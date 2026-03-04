import { useDiscovery } from '../../config/DiscoveryContext'
import styles from './ProposalHeader.module.css'

const PROJECT_TYPE_LABELS: Record<string, string> = {
  new: 'Website Design Proposal',
  redesign: 'Website Redesign Proposal',
  upgrade: 'Website Upgrade Proposal',
}

export default function ProposalHeader() {
  const { config, currentQuote } = useDiscovery()
  const cfg = currentQuote?.config_snapshot || config

  const isGeneric = !currentQuote && !config.problem_statement

  const label = isGeneric
    ? 'Website Proposal'
    : PROJECT_TYPE_LABELS[cfg.project_type] || 'Website Proposal'
  const practiceName = isGeneric
    ? 'Your Business'
    : currentQuote?.practice_name || 'Your Practice'
  const quoteNumber = isGeneric ? null : currentQuote?.quote_number || null
  const domain = isGeneric ? null : cfg.has_domain && cfg.domain_name ? cfg.domain_name : null

  const preparedDate = currentQuote
    ? new Date(currentQuote.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <header className={styles.header}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h1 className={styles.title}>{practiceName}</h1>
        <div className={styles.divider} />
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Prepared</span>
            <span className={styles.metaValue}>{preparedDate}</span>
          </div>
          {quoteNumber && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Quote</span>
              <span className={styles.metaValue}>{quoteNumber}</span>
            </div>
          )}
          {domain && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Current Site</span>
              <span className={styles.metaValue}>{domain}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
