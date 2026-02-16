import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import styles from './CurrentSiteAnalysis.module.css'

const issues = [
  { type: 'critical', text: 'No SSL certificate (site marked "Not Secure")' },
  { type: 'critical', text: 'No online patient intake forms' },
  { type: 'critical', text: 'No mobile-responsive design' },
  { type: 'warning', text: 'Outdated visual design and layout' },
  { type: 'warning', text: 'No structured services information' },
  { type: 'warning', text: 'Limited SEO optimization' },
  { type: 'warning', text: 'No integration with practice management tools' },
]

const strengths = [
  'Memorable hero imagery (to be retained)',
  'Clear phone contact information',
  'Patient Portal and Bill Pay links available',
  'Doctor Referral section present',
]

export default function CurrentSiteAnalysis() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Current Site Analysis</h2>
      <p className={styles.description}>
        A review of meceyespecialists.com identified several areas for improvement
        alongside existing strengths to build upon.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <XCircle size={18} color="var(--color-error)" />
            Issues Identified
          </h3>
          <ul className={styles.list}>
            {issues.map((item) => (
              <li key={item.text} className={styles.listItem}>
                {item.type === 'critical' ? (
                  <XCircle size={14} color="var(--color-error)" />
                ) : (
                  <AlertTriangle size={14} color="var(--color-warning)" />
                )}
                <span>{item.text}</span>
                <span className={`${styles.badge} ${styles[item.type]}`}>
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <CheckCircle size={18} color="var(--color-success)" />
            Strengths to Retain
          </h3>
          <ul className={styles.list}>
            {strengths.map((item) => (
              <li key={item} className={styles.listItem}>
                <CheckCircle size={14} color="var(--color-success)" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
