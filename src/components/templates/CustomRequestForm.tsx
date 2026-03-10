import { useState } from 'react'
import { Send, Check, Loader as Loader2, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { STYLE_CATEGORIES, CATEGORY_ORDER } from '../../data/templateData'
import styles from './CustomRequestForm.module.css'

interface Props {
  onBack: () => void
}

interface FormData {
  name: string
  email: string
  phone: string
  practice_name: string
  vision_description: string
  preferred_style: string
  reference_urls: string
}

const emptyForm: FormData = {
  name: '',
  email: '',
  phone: '',
  practice_name: '',
  vision_description: '',
  preferred_style: '',
  reference_urls: '',
}

export default function CustomRequestForm({ onBack }: Props) {
  const [data, setData] = useState<FormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (field: keyof FormData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }))

  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!data.name.trim()) {
      setError('Name is required')
      return
    }
    if (!data.email.trim() || !isEmailValid(data.email)) {
      setError('A valid email address is required')
      return
    }
    if (!data.vision_description.trim()) {
      setError('Please describe your vision for the website')
      return
    }

    setSubmitting(true)

    try {
      const { error: dbError } = await supabase.from('custom_requests').insert({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim() || null,
        practice_name: data.practice_name.trim() || null,
        vision_description: data.vision_description.trim(),
        preferred_style: data.preferred_style || null,
        reference_urls: data.reference_urls.trim() || null,
      })
      if (dbError) throw dbError

      setSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={16} />
          Back to Templates
        </button>

        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <Check size={32} />
            </div>
            <h2 className={styles.successTitle}>Request Received</h2>
            <p className={styles.successText}>
              Thank you! A follow-up session will be scheduled within 2 business days.
              We will reach out to <strong>{data.email}</strong> to discuss your custom design.
            </p>
            <button className={styles.backLink} onClick={onBack}>
              Browse Templates
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Request a Custom Design</h2>
              <p className={styles.subtitle}>
                Tell us about your vision and we will create a design tailored specifically to your practice.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-name">Name *</label>
                  <input
                    id="cr-name"
                    type="text"
                    className={styles.input}
                    placeholder="Your name"
                    value={data.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-email">Email *</label>
                  <input
                    id="cr-email"
                    type="email"
                    className={styles.input}
                    placeholder="email@example.com"
                    value={data.email}
                    onChange={e => set('email', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-phone">Phone</label>
                  <input
                    id="cr-phone"
                    type="tel"
                    className={styles.input}
                    placeholder="(555) 555-5555"
                    value={data.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-practice">Practice Name</label>
                  <input
                    id="cr-practice"
                    type="text"
                    className={styles.input}
                    placeholder="Your practice name"
                    value={data.practice_name}
                    onChange={e => set('practice_name', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.fieldFull}>
                <label className={styles.label} htmlFor="cr-vision">Describe Your Vision *</label>
                <textarea
                  id="cr-vision"
                  className={styles.textarea}
                  placeholder="Describe the look, feel, and key features you envision for your website..."
                  rows={5}
                  value={data.vision_description}
                  onChange={e => set('vision_description', e.target.value)}
                />
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-style">Preferred Style</label>
                  <select
                    id="cr-style"
                    className={styles.input}
                    value={data.preferred_style}
                    onChange={e => set('preferred_style', e.target.value)}
                  >
                    <option value="">Not sure</option>
                    {CATEGORY_ORDER.map(cat => (
                      <option key={cat} value={cat}>{STYLE_CATEGORIES[cat].label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cr-refs">Reference URLs</label>
                  <input
                    id="cr-refs"
                    type="text"
                    className={styles.input}
                    placeholder="Websites you like (separate with commas)"
                    value={data.reference_urls}
                    onChange={e => set('reference_urls', e.target.value)}
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
                {submitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
