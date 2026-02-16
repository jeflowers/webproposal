import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LanguageProvider } from '../i18n/LanguageContext'
import MockupNavbar from '../components/mockup/MockupNavbar'
import MockupHero from '../components/mockup/MockupHero'
import MockupServices from '../components/mockup/MockupServices'
import MockupAbout from '../components/mockup/MockupAbout'
import MockupDoctors from '../components/mockup/MockupDoctors'
import MockupForms from '../components/mockup/MockupForms'
import MockupReferral from '../components/mockup/MockupReferral'
import MockupContact from '../components/mockup/MockupContact'
import MockupFooter from '../components/mockup/MockupFooter'
import styles from './Mockup.module.css'

export default function Mockup() {
  const [activeSection, setActiveSection] = useState('home')

  return (
    <LanguageProvider>
      <div className={styles.mockup}>
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>INTERACTIVE MOCKUP PREVIEW</span>
          <Link to="/" className={styles.backLink}>Back to Proposal</Link>
        </div>
        <MockupNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main>
          <MockupHero />
          <MockupServices />
          <MockupAbout />
          <MockupDoctors />
          <MockupForms />
          <MockupReferral />
          <MockupContact />
        </main>
        <MockupFooter />
      </div>
    </LanguageProvider>
  )
}
