import { ArrowRight } from 'lucide-react'
import styles from './IntegrationDetails.module.css'

const integrations = [
  {
    name: 'RingCentral',
    type: 'Communications',
    currentUse: 'Currently used for phone communications and scheduling active clients.',
    coreIncludes: [
      'Phone number displayed prominently across the site',
      'Basic click-to-call links on all pages',
      'Contact page with office hours and direct numbers',
    ],
    addOnFeatures: [
      'Embedded scheduling widget (if supported by plan)',
      'Voicemail and callback request forms',
      'SMS notification integration for appointment reminders',
      'Deep API integration for call tracking',
    ],
  },
  {
    name: 'Nextech',
    type: 'EHR / Practice Management',
    currentUse: 'Currently used for scheduling and managing active client records.',
    coreIncludes: [
      'Patient portal link embedded in navigation',
      'Form data structured for easy manual import',
      'Referral data formatted to match intake fields',
    ],
    addOnFeatures: [
      'API integration for automated data sync',
      'Real-time appointment availability',
      'Automated form-to-EHR data pipeline',
      'Two-way patient record synchronization',
    ],
  },
]

export default function IntegrationDetails() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Integration Details</h2>
      <p className={styles.description}>
        Phase 1 includes basic connectivity with your existing tools. Deeper
        integrations are available as add-ons when you're ready.
      </p>

      <div className={styles.integrations}>
        {integrations.map((item) => (
          <div key={item.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.name}>{item.name}</h3>
                <span className={styles.type}>{item.type}</span>
              </div>
            </div>
            <p className={styles.desc}>{item.currentUse}</p>

            <div className={styles.columns}>
              <div className={styles.column}>
                <h4 className={styles.columnLabel}>
                  <span className={styles.coreBadge}>Phase 1</span>
                  Included in Core
                </h4>
                <ul className={styles.featureList}>
                  {item.coreIncludes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.column}>
                <h4 className={styles.columnLabel}>
                  <span className={styles.futureBadge}>Add-On</span>
                  Available Later
                </h4>
                <ul className={styles.featureList}>
                  {item.addOnFeatures.map((f) => (
                    <li key={f}>
                      <ArrowRight size={11} className={styles.arrowIcon} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
