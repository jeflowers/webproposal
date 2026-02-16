import styles from './ProposalHeader.module.css'

export default function ProposalHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.label}>Website Redesign Proposal</p>
        <h1 className={styles.title}>MEC Eye Specialists</h1>
        <div className={styles.divider} />
        <p className={styles.subtitle}>
          Modern website redesign with patient intake forms,<br />
          doctor referral system, and practice management integrations
        </p>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Prepared</span>
            <span className={styles.metaValue}>February 2026</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Current Site</span>
            <span className={styles.metaValue}>meceyespecialists.com</span>
          </div>
        </div>
      </div>
    </header>
  )
}
