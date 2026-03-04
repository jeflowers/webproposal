import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, Mail, ExternalLink, ArrowLeft, AlertCircle, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Quote, QuoteStatus } from '../types/discovery'
import styles from './QuoteManagement.module.css'

const STATUS_OPTIONS: { value: QuoteStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Quotes' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'expired', label: 'Expired' },
]

const STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: '#94a3b8',
  sent: '#3b82f6',
  accepted: '#22c55e',
  expired: '#ef4444',
}

export default function QuoteManagement() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQuotes()
  }, [])

  const loadQuotes = async () => {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Failed to load quotes')
      setLoading(false)
      return
    }

    setQuotes((data as Quote[]) || [])
    setLoading(false)
  }

  const handleDelete = async (quoteId: string) => {
    const { error: deleteError } = await supabase
      .from('quotes')
      .update({ status: 'expired' as QuoteStatus })
      .eq('id', quoteId)

    if (deleteError) {
      setError('Failed to archive quote')
      return
    }

    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: 'expired' as QuoteStatus } : q))
    setDeleteConfirm(null)
  }

  const handleSendEmail = async (quote: Quote) => {
    setSendingEmail(quote.id)
    setEmailSuccess(null)

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote_id: quote.id }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to send email')
      }

      await supabase
        .from('quotes')
        .update({ status: 'sent' as QuoteStatus })
        .eq('id', quote.id)

      setQuotes(prev => prev.map(q => q.id === quote.id ? { ...q, status: 'sent' as QuoteStatus } : q))
      setEmailSuccess(quote.id)
      setTimeout(() => setEmailSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setSendingEmail(null)
    }
  }

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = searchTerm === '' ||
      q.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.practice_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.contact_email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading quotes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/proposal" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Proposal
        </Link>
        <h1 className={styles.title}>Quote Management</h1>
        <p className={styles.subtitle}>View, manage, and send quotes to clients</p>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError('')} className={styles.dismissError}>Dismiss</button>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by quote number, practice, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`${styles.filterBtn} ${statusFilter === opt.value ? styles.filterBtnActive : ''}`}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <div className={styles.empty}>
          <p>No quotes found{searchTerm || statusFilter !== 'all' ? ' matching your criteria' : ''}.</p>
          {quotes.length === 0 && (
            <Link to="/discovery" className={styles.createLink}>
              Create your first quote via the Discovery Form
            </Link>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Practice</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map(quote => (
                <tr key={quote.id}>
                  <td>
                    <Link
                      to={`/proposal?quote=${quote.quote_number}`}
                      className={styles.quoteLink}
                    >
                      {quote.quote_number}
                    </Link>
                    {quote.version > 1 && (
                      <span className={styles.versionBadge}>v{quote.version}</span>
                    )}
                  </td>
                  <td>{quote.practice_name}</td>
                  <td className={styles.emailCell}>{quote.contact_email}</td>
                  <td>
                    <span
                      className={styles.statusBadge}
                      style={{ color: STATUS_COLORS[quote.status], borderColor: STATUS_COLORS[quote.status] }}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {new Date(quote.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        to={`/proposal?quote=${quote.quote_number}`}
                        className={styles.actionBtn}
                        title="View Proposal"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleSendEmail(quote)}
                        disabled={sendingEmail === quote.id}
                        title="Send Email"
                      >
                        {emailSuccess === quote.id ? (
                          <Check size={14} />
                        ) : (
                          <Mail size={14} />
                        )}
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={() => setDeleteConfirm(quote.id)}
                        title="Archive Quote"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className={styles.dialogOverlay} onClick={() => setDeleteConfirm(null)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>Archive Quote</h3>
            <p className={styles.dialogText}>
              Are you sure you want to archive this quote? It will be marked as expired.
            </p>
            <div className={styles.dialogActions}>
              <button
                onClick={() => setDeleteConfirm(null)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className={styles.confirmBtn}
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
