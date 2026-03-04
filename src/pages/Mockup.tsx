import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LanguageProvider } from '../i18n/LanguageContext'
import { useDiscovery } from '../config/DiscoveryContext'
import MockupNavbar from '../components/mockup/MockupNavbar'
import MockupHero from '../components/mockup/MockupHero'
import MockupServices from '../components/mockup/MockupServices'
import MockupAbout from '../components/mockup/MockupAbout'
import MockupDoctors from '../components/mockup/MockupDoctors'
import MockupForms from '../components/mockup/MockupForms'
import MockupReferral from '../components/mockup/MockupReferral'
import MockupContact from '../components/mockup/MockupContact'
import MockupFooter from '../components/mockup/MockupFooter'
import FloatingCTA from '../components/ui/FloatingCTA'
import BackToTop from '../components/ui/BackToTop'
import styles from './Mockup.module.css'

export default function Mockup() {
  const [searchParams] = useSearchParams()
  const { currentQuote, loadQuote, quoteLoading } = useDiscovery()
  const [activeSection, setActiveSection] = useState('home')

  const quoteParam = searchParams.get('quote')

  useEffect(() => {
    if (quoteParam && currentQuote?.quote_number !== quoteParam) {
      loadQuote(quoteParam)
    }
  }, [quoteParam, currentQuote?.quote_number, loadQuote])

  const backUrl = quoteParam ? `/proposal?quote=${quoteParam}` : '/'
  const practiceName = currentQuote?.practice_name || null
  const quoteNumber = currentQuote?.quote_number || null

  if (quoteLoading) {
    return (
      <div className={styles.mockup}>
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>Loading mockup...</span>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <div className={styles.mockup}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <header role="banner">
          <div className={styles.previewBar}>
            <span className={styles.previewLabel}>
              PROTOTYPE PREVIEW
              {practiceName && <> | This is a simulated mockup for {practiceName}</>}
              {quoteNumber && <> | Quote: {quoteNumber}</>}
            </span>
            <Link to={backUrl} className={styles.backLink}>Back to Proposal</Link>
          </div>
          <MockupNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
        </header>
        <main id="main-content" role="main">
          <MockupHero />
          <MockupServices />
          <MockupAbout />
          <MockupDoctors />
          <MockupForms />
          <MockupReferral />
          <MockupContact />
        </main>
        <MockupFooter />
        <FloatingCTA />
        <BackToTop />
      </div>
    </LanguageProvider>
  )
}
