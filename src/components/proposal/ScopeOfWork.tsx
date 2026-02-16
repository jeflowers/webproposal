import { Layout, FileText, Users, Settings, Shield, Smartphone, Globe } from 'lucide-react'
import styles from './ScopeOfWork.module.css'

const deliverables = [
  {
    icon: Layout,
    title: 'Complete Website Redesign',
    description: 'Modern, professional design retaining the signature hero imagery. Clean navigation, clear service pages, and polished visual presentation.',
  },
  {
    icon: FileText,
    title: 'Patient Intake Forms',
    description: 'Online forms for new patient registration, medical history, insurance information, and consent forms. Submissions stored securely in the database.',
  },
  {
    icon: Users,
    title: 'Doctor Referral System',
    description: 'Streamlined referral form for referring physicians with patient details, diagnosis, and urgency level. Automated notifications on submission.',
  },
  {
    icon: Settings,
    title: 'Integration-Ready Architecture',
    description: 'Built with hooks for RingCentral and Nextech integration. Basic connectivity included in Phase 1, with deeper integrations available as add-ons.',
  },
  {
    icon: Smartphone,
    title: 'Fully Responsive Design',
    description: 'Optimized for all devices -- desktop, tablet, and mobile. Touch-friendly forms and navigation for patients on the go.',
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'SSL certificate, secure form submissions, and data protection measures aligned with healthcare industry standards.',
  },
  {
    icon: Globe,
    title: 'Bilingual Support (EN / ES-MX)',
    description: 'Full English and Mexican Spanish language support included in the core website. All pages, forms, and navigation translated for your bilingual patient community.',
  },
]

export default function ScopeOfWork() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Scope of Work</h2>
      <p className={styles.description}>
        The following deliverables outline the complete website redesign project for MEC Eye Specialists.
      </p>

      <div className={styles.grid}>
        {deliverables.map((item) => (
          <div key={item.title} className={styles.card}>
            <div className={styles.iconWrap}>
              <item.icon size={20} />
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
