import DocumentShell from '../../components/contracts/DocumentShell'
import DocumentHeader from '../../components/contracts/DocumentHeader'
import SignatureBlock from '../../components/contracts/SignatureBlock'
import { SERVICE_AGREEMENT_TERMS } from '../../data/contractData'
import { getMonthlyServices, formatCurrency } from '../../data/pricingData'
import styles from './ServiceAgreement.module.css'

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const monthlyServices = getMonthlyServices('aws')

export default function ServiceAgreement() {
  return (
    <DocumentShell>
      <DocumentHeader
        docType="Service Agreement"
        title="Ongoing Service Agreement"
        date={today}
        docNumber="SA-001"
      />

      <div className={styles.intro}>
        <p>
          This Service Agreement (&ldquo;Agreement&rdquo;) defines the ongoing hosting,
          maintenance, and support services to be provided following the launch of the
          MEC Eye Specialists website. This Agreement is supplemental to the Master Service
          Agreement between the parties.
        </p>
        <p className={styles.refLabel}>Reference Agreements</p>
        <p className={styles.refValue}>MSA-001, SOW-001</p>
      </div>

      <div className={styles.servicesGrid}>
        {SERVICE_AGREEMENT_TERMS.map((term, i) => (
          <div key={term.title} className={styles.serviceCard}>
            <p className={styles.serviceNum}>Section {i + 1}</p>
            <h3 className={styles.serviceTitle}>{term.title}</h3>
            <p className={styles.serviceContent}>{term.content}</p>
          </div>
        ))}
      </div>

      <div className={styles.pricingSection}>
        <h2 className={styles.pricingTitle}>Monthly Service Pricing</h2>
        <table className={styles.pricingTable}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Monthly Rate</th>
            </tr>
          </thead>
          <tbody>
            {monthlyServices.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.serviceName}>{item.name}</div>
                  <div className={styles.serviceDesc}>{item.description}</div>
                </td>
                <td>{item.priceLabel || formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.note}>
        Monthly rates are subject to adjustment with thirty (30) days&rsquo; written notice.
        Third-party service costs (cloud hosting, email accounts, API fees) are billed at cost
        and may fluctuate based on usage and provider pricing changes. Either party may terminate
        this Service Agreement with thirty (30) days&rsquo; written notice without affecting the
        terms of the Master Service Agreement.
      </div>

      <SignatureBlock />
    </DocumentShell>
  )
}
