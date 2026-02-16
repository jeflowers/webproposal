import styles from './FeatureBreakdown.module.css'

const pages = [
  {
    name: 'Home',
    features: [
      'Signature hero section with existing starry sky imagery',
      'Practice overview and welcome message',
      'Quick links to services, forms, and patient portal',
      'Phone number and call-to-action buttons',
      'Insurance providers accepted',
      'Language toggle for English / Spanish (Mexico)',
    ],
  },
  {
    name: 'Services',
    features: [
      'Comprehensive eye care services listing',
      'Individual service detail sections (Cataracts, Glaucoma, Retina, LASIK, etc.)',
      'Relevant medical imagery',
      'Links to schedule appointments',
      'Full Spanish translations for all service descriptions',
    ],
  },
  {
    name: 'Patient Forms',
    features: [
      'New Patient Registration form',
      'Medical History questionnaire',
      'Insurance Information form',
      'HIPAA Consent and Authorization forms',
      'Form data stored securely in database',
      'Confirmation emails on submission',
      'All forms available in English and Spanish (Mexico)',
    ],
  },
  {
    name: 'Doctor Referrals',
    features: [
      'Physician referral form with patient details',
      'Diagnosis and urgency level fields',
      'File attachment capability for records',
      'Automated referral tracking',
    ],
  },
  {
    name: 'About / Our Doctors',
    features: [
      'Practice history and mission',
      'Doctor profiles with credentials',
      'Specializations and certifications',
      'Professional photography or headshots',
      'Bilingual doctor bios and practice descriptions',
    ],
  },
  {
    name: 'Contact',
    features: [
      'Office locations and hours',
      'Embedded map',
      'General inquiry contact form',
      'Click-to-call phone links',
      'Emergency contact information',
    ],
  },
]

export default function FeatureBreakdown() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Page-by-Page Breakdown</h2>
      <p className={styles.description}>
        Detailed features planned for each page of the redesigned website.
      </p>

      <div className={styles.pages}>
        {pages.map((page, index) => (
          <div key={page.name} className={styles.page}>
            <div className={styles.pageHeader}>
              <span className={styles.pageNumber}>{String(index + 1).padStart(2, '0')}</span>
              <h3 className={styles.pageName}>{page.name}</h3>
            </div>
            <ul className={styles.features}>
              {page.features.map((feat) => (
                <li key={feat} className={styles.feature}>
                  <span className={styles.dot} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
