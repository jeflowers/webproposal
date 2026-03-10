import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LanguageProvider } from '../i18n/LanguageContext'
import { useDiscovery } from '../config/DiscoveryContext'
import { AiContentProvider, useAiContent } from '../config/AiContentContext'
import { CircleAlert } from 'lucide-react'
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
import AiGeneratingOverlay from '../components/mockup/AiGeneratingOverlay'
import styles from './Mockup.module.css'

export default function Mockup() {
  const [searchParams] = useSearchParams()
  const { currentQuote, loadQuote, quoteLoading, quoteNotFound, config } = useDiscovery()
  const [activeSection, setActiveSection] = useState('home')

  const quoteParam = searchParams.get('quote')
  const hasNoContext = !quoteParam && !currentQuote

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

  if (quoteNotFound && quoteParam) {
    return (
      <div className={styles.mockup}>
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>MOCKUP PREVIEW</span>
          <Link to="/" className={styles.backLink}>Back to Home</Link>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}><CircleAlert size={40} /></div>
          <h2 className={styles.errorTitle}>Quote Not Found</h2>
          <p className={styles.errorText}>
            The quote <strong>{quoteParam}</strong> does not exist or could not be loaded.
          </p>
          <p className={styles.errorHint}>Please check the quote number and try again, or go back to create a new proposal.</p>
          <div className={styles.errorActions}>
            <Link to="/" className={styles.errorPrimary}>Go to Proposals</Link>
            <Link to="/discovery" className={styles.errorSecondary}>Start Discovery</Link>
          </div>
        </div>
      </div>
    )
  }

  if (hasNoContext) {
    return (
      <div className={styles.mockup}>
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>MOCKUP PREVIEW</span>
          <Link to="/" className={styles.backLink}>Back to Home</Link>
        </div>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}><CircleAlert size={40} /></div>
          <h2 className={styles.errorTitle}>No Mockup Available</h2>
          <p className={styles.errorText}>
            A quote or discovery configuration is required to generate a mockup preview.
          </p>
          <p className={styles.errorHint}>Complete the discovery form and create a quote first, then use the "View Mockup" link from your proposal.</p>
          <div className={styles.errorActions}>
            <Link to="/discovery" className={styles.errorPrimary}>Start Discovery</Link>
            <Link to="/" className={styles.errorSecondary}>Go to Proposals</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <AiContentProvider>
        <MockupInner
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          practiceName={practiceName}
          quoteNumber={quoteNumber}
          backUrl={backUrl}
          config={currentQuote?.config_snapshot || config}
        />
      </AiContentProvider>
    </LanguageProvider>
  )
}

interface MockupInnerProps {
  activeSection: string
  setActiveSection: (s: string) => void
  practiceName: string | null
  quoteNumber: string | null
  backUrl: string
  config: import('../types/discovery').DiscoveryConfig
}

function MockupInner({ activeSection, setActiveSection, practiceName, quoteNumber, backUrl, config }: MockupInnerProps) {
  const { content, loading, error, generate } = useAiContent()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!content && !loading && !error && practiceName) {
      generate(config, practiceName)
    }
  }, [content, loading, error, practiceName, config, generate])

  const showOverlay = loading || (!content && !error && !dismissed)

  return (
    <div className={styles.mockup}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header role="banner">
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>
            {content ? 'AI-GENERATED PREVIEW' : 'PROTOTYPE PREVIEW'}
            {practiceName && <> | This is a simulated mockup for {practiceName}</>}
            {quoteNumber && <> | Quote: {quoteNumber}</>}
          </span>
          <div className={styles.previewActions}>
            {error && !dismissed && (
              <button className={styles.retryBtn} onClick={() => generate(config, practiceName || 'Our Practice')}>
                Retry AI
              </button>
            )}
            <Link to={backUrl} className={styles.backLink}>Back to Proposal</Link>
          </div>
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
      {showOverlay && !dismissed && (
        <AiGeneratingOverlay
          loading={loading}
          error={error}
          onRetry={() => generate(config, practiceName || 'Our Practice')}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </div>
  )
}
