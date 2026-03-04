import DocumentShell from '../../components/contracts/DocumentShell'
import DocumentHeader from '../../components/contracts/DocumentHeader'
import SignatureBlock from '../../components/contracts/SignatureBlock'
import { MSA_SECTIONS, PROVIDER, CLIENT } from '../../data/contractData'
import styles from './MasterServiceAgreement.module.css'

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

export default function MasterServiceAgreement() {
  return (
    <DocumentShell>
      <DocumentHeader
        docType="Master Service Agreement"
        title="Master Service Agreement"
        date={today}
        docNumber="MSA-001"
      />

      <div className={styles.recitals}>
        <p className={styles.recitalsTitle}>Recitals</p>
        <ul className={styles.recitalsList}>
          <li>
            This Master Service Agreement (&ldquo;Agreement&rdquo;) is entered into as of the date
            last signed below (the &ldquo;Effective Date&rdquo;) by and between:
          </li>
          <li>
            {PROVIDER.name} is a web development professional providing design, development,
            and technology consulting services; and
          </li>
          <li>
            {CLIENT.name} desires to engage Provider to perform certain web development
            and related services as described herein and in associated Statements of Work.
          </li>
        </ul>
      </div>

      <div className={styles.sections}>
        {MSA_SECTIONS.map((section) => (
          <div key={section.number} className={styles.section}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNumber}>{section.number}.</span>
              <span className={styles.sectionTitle}>{section.title}</span>
            </div>
            <div className={styles.sectionBody}>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.effectiveDate}>
        <strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the
        Effective Date set forth above.
      </div>

      <SignatureBlock />
    </DocumentShell>
  )
}
