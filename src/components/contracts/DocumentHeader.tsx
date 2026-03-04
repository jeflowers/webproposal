import { PROVIDER, CLIENT } from '../../data/contractData'
import styles from './DocumentHeader.module.css'

interface DocumentHeaderProps {
  docType: string
  title: string
  date: string
  docNumber?: string
}

export default function DocumentHeader({ docType, title, date, docNumber }: DocumentHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.branding}>
          <span className={styles.providerName}>{PROVIDER.name}</span>
          <span className={styles.providerTitle}>{PROVIDER.title}</span>
        </div>
        <div className={styles.docMeta}>
          <span className={styles.docLabel}>Date</span>
          <span className={styles.docValue}>{date}</span>
          {docNumber && (
            <>
              <span className={styles.docLabel}>Document No.</span>
              <span className={styles.docValue}>{docNumber}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.titleBlock}>
        <p className={styles.docType}>{docType}</p>
        <h1 className={styles.docTitle}>{title}</h1>
        <p className={styles.parties}>
          Between <span className={styles.partyName}>{PROVIDER.name}</span> (&ldquo;Provider&rdquo;)
          and <span className={styles.partyName}>{CLIENT.name}</span> (&ldquo;Client&rdquo;)
        </p>
      </div>
    </header>
  )
}
