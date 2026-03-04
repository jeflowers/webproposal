import { Globe, FileText, Layout, MessageSquare } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import styles from './DiscoverySummary.module.css'

export default function DiscoverySummary() {
  const { config, currentQuote } = useDiscovery()
  const cfg = currentQuote?.config_snapshot || config

  const hasProblemStatement = cfg.problem_statement || cfg.website_frustrations || cfg.website_wishes || cfg.inspiration_sites
  const hasPageOrder = cfg.page_order && cfg.page_order.length > 0

  if (!hasProblemStatement && !hasPageOrder) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Discovery Summary</h2>
      <p className={styles.description}>
        Key insights captured from your discovery intake form.
      </p>

      <div className={styles.grid}>
        {cfg.problem_statement && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <MessageSquare size={18} />
            </div>
            <h3 className={styles.cardTitle}>Practice Overview</h3>
            <p className={styles.cardText}>{cfg.problem_statement}</p>
          </div>
        )}

        {cfg.website_frustrations && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <FileText size={18} />
            </div>
            <h3 className={styles.cardTitle}>Current Frustrations</h3>
            <p className={styles.cardText}>{cfg.website_frustrations}</p>
          </div>
        )}

        {cfg.website_wishes && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Globe size={18} />
            </div>
            <h3 className={styles.cardTitle}>Desired Features</h3>
            <p className={styles.cardText}>{cfg.website_wishes}</p>
          </div>
        )}

        {cfg.inspiration_sites && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Layout size={18} />
            </div>
            <h3 className={styles.cardTitle}>Inspiration</h3>
            <p className={styles.cardText}>{cfg.inspiration_sites}</p>
          </div>
        )}
      </div>

      {hasPageOrder && (
        <div className={styles.pageOrderSection}>
          <h3 className={styles.pageOrderTitle}>Planned Site Structure</h3>
          <div className={styles.pageOrderList}>
            {cfg.page_order.map((page, index) => (
              <div key={page} className={styles.pageOrderItem}>
                <span className={styles.pageOrderNumber}>{index + 1}</span>
                <span className={styles.pageOrderName}>{page}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.highlights}>
        <h3 className={styles.highlightsTitle}>Configuration Highlights</h3>
        <div className={styles.highlightsList}>
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>Project Type</span>
            <span className={styles.highlightValue}>
              {cfg.project_type === 'new' ? 'New Website' : cfg.project_type === 'redesign' ? 'Redesign' : 'Upgrade'}
            </span>
          </div>
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>Doctors</span>
            <span className={styles.highlightValue}>{cfg.doctor_count}</span>
          </div>
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>Bilingual</span>
            <span className={styles.highlightValue}>
              {cfg.bilingual_scope === 'full' ? 'Full' : cfg.bilingual_scope === 'key_pages' ? 'Key Pages' : 'No'}
            </span>
          </div>
          {cfg.has_domain && cfg.domain_name && (
            <div className={styles.highlight}>
              <span className={styles.highlightLabel}>Domain</span>
              <span className={styles.highlightValue}>{cfg.domain_name}</span>
            </div>
          )}
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>HIPAA Required</span>
            <span className={styles.highlightValue}>{cfg.hipaa_hosting_required ? 'Yes' : 'No'}</span>
          </div>
          <div className={styles.highlight}>
            <span className={styles.highlightLabel}>Hosting</span>
            <span className={styles.highlightValue}>
              {cfg.hosting_preference === 'managed' ? 'Managed' : 'Self-Managed'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
