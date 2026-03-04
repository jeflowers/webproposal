import { PROVIDER, CLIENT } from '../../data/contractData'
import styles from './SignatureBlock.module.css'

interface SignatureBlockProps {
  title?: string
}

export default function SignatureBlock({ title = 'Signatures' }: SignatureBlockProps) {
  return (
    <div className={styles.signatures}>
      <h3 className={styles.sigTitle}>{title}</h3>
      <div className={styles.grid}>
        <div className={styles.party}>
          <div>
            <p className={styles.partyLabel}>Provider</p>
            <p className={styles.partyName}>{PROVIDER.name}</p>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Signature</span>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Printed Name &amp; Title</span>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Date</span>
          </div>
        </div>
        <div className={styles.party}>
          <div>
            <p className={styles.partyLabel}>Client</p>
            <p className={styles.partyName}>{CLIENT.name}</p>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Signature</span>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Printed Name &amp; Title</span>
          </div>
          <div className={styles.sigLine}>
            <div className={styles.line} />
            <span className={styles.lineLabel}>Date</span>
          </div>
        </div>
      </div>
    </div>
  )
}
