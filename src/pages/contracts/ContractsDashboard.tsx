import { Link } from 'react-router-dom'
import { FileText, ClipboardList, DollarSign, Settings, ArrowRight, ArrowLeft } from 'lucide-react'
import styles from './ContractsDashboard.module.css'

const documents = [
  {
    id: 'msa',
    icon: FileText,
    badge: 'Agreement',
    title: 'Master Service Agreement',
    description: 'The overarching contract defining the business relationship, payment terms, intellectual property rights, confidentiality, HIPAA compliance, and liability provisions.',
    docNumber: 'MSA-001',
    path: '/contracts/msa',
  },
  {
    id: 'sow',
    icon: ClipboardList,
    badge: 'Scope',
    title: 'Statement of Work',
    description: 'Detailed breakdown of all project deliverables, phases, milestones, and timelines for the website redesign. References the MSA for governing terms.',
    docNumber: 'SOW-001',
    path: '/contracts/sow',
  },
  {
    id: 'quote',
    icon: DollarSign,
    badge: 'Pricing',
    title: 'Quote / Estimate',
    description: 'Itemized pricing for all Phase 1 deliverables, optional Phase 2 add-ons, and ongoing monthly services. Valid for 30 days from date of issue.',
    docNumber: 'QTE-001',
    path: '/contracts/quote',
  },
  {
    id: 'service',
    icon: Settings,
    badge: 'Ongoing',
    title: 'Service Agreement',
    description: 'Terms for post-launch hosting, maintenance, support, and email services. Month-to-month billing with 30-day termination notice.',
    docNumber: 'SA-001',
    path: '/contracts/service',
  },
]

export default function ContractsDashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Contract Documents</p>
          <h1 className={styles.heroTitle}>MEC Eye Specialists</h1>
          <p className={styles.heroDesc}>
            Professional contract documents for the website redesign project.
            Each document can be printed or saved as PDF.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <Link to="/proposal" className={styles.backLink}>
          <ArrowLeft size={14} />
          Back to Proposal
        </Link>

        <div className={styles.grid}>
          {documents.map((doc) => (
            <Link key={doc.id} to={doc.path} className={styles.card}>
              <span className={styles.cardBadge}>
                <doc.icon size={12} />
                {doc.badge}
              </span>
              <h2 className={styles.cardTitle}>{doc.title}</h2>
              <p className={styles.cardDesc}>{doc.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardDoc}>{doc.docNumber}</span>
                <span className={styles.cardAction}>
                  View Document
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
