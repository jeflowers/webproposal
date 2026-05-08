import { useState, useEffect, useMemo, type ComponentType } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LanguageProvider } from '../i18n/LanguageContext'
import { useDiscovery } from '../config/DiscoveryContext'
import { AiContentProvider, useAiContent } from '../config/AiContentContext'
import { CircleAlert } from 'lucide-react'
import { matchTemplates, getMockupTemplateById, type MockupTemplate } from '../config/templateMatcher'
import { MockupTemplateProvider } from '../config/MockupTemplateContext'
import type { InspirationSite } from '../types/discovery'
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
import TemplateReview from '../components/mockup/TemplateReview'
import styles from './Mockup.module.css'

type MockupPhase = 'template-review' | 'mockup-render'

const sectionComponents: Record<string, ComponentType<{ variant?: string }>> = {
  hero: MockupHero,
  services: MockupServices,
  about: MockupAbout,
  doctors: MockupDoctors,
  forms: MockupForms,
  referral: MockupReferral,
  contact: MockupContact,
  footer: MockupFooter,
}

function parseInspirationSites(raw: string): InspirationSite[] {
  if (!raw || !raw.trim()) return []

  const sites: InspirationSite[] = []
  const urlRegex = /https?:\/\/[^\s,]+/g
  const urls = raw.match(urlRegex) || []

  if (urls.length === 0) {
    return [{ url: '', notes: raw.trim() }]
  }

  urls.forEach((url, i) => {
    const startIdx = raw.indexOf(url)
    const endIdx = i < urls.length - 1 ? raw.indexOf(urls[i + 1]) : raw.length
    const afterUrl = raw.slice(startIdx + url.length, endIdx).trim()
    const notes = afterUrl.replace(/^[\s—\-:,]+/, '').replace(/[\s,]+$/, '')
    sites.push({ url, notes })
  })

  return sites
}

export default function Mockup() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { currentQuote, loadQuote, quoteLoading, quoteNotFound, config } = useDiscovery()
  const [activeSection, setActiveSection] = useState('home')

  const quoteParam = searchParams.get('quote')
  const templateParam = searchParams.get('template')
  const hasNoContext = !quoteParam && !currentQuote

  useEffect(() => {
    if (quoteParam && currentQuote?.quote_number !== quoteParam) {
      loadQuote(quoteParam)
    }
  }, [quoteParam, currentQuote?.quote_number, loadQuote])

  const backUrl = quoteParam ? `/proposal?quote=${quoteParam}` : '/'
  const practiceName = currentQuote?.practice_name || null
  const quoteNumber = currentQuote?.quote_number || null
  const activeConfig = currentQuote?.config_snapshot || config

  const inspirationSites = useMemo(() => {
    if (activeConfig.inspiration_sites_parsed?.length) {
      return activeConfig.inspiration_sites_parsed
    }
    return parseInspirationSites(activeConfig.inspiration_sites || '')
  }, [activeConfig.inspiration_sites_parsed, activeConfig.inspiration_sites])

  const templateMatches = useMemo(
    () => matchTemplates(inspirationSites),
    [inspirationSites]
  )

  const initialTemplate = templateParam ? getMockupTemplateById(templateParam) : null
  const initialPhase: MockupPhase = initialTemplate ? 'mockup-render' : 'template-review'

  const [phase, setPhase] = useState<MockupPhase>(initialPhase)
  const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate | null>(initialTemplate || null)

  const handleTemplateSelect = (template: MockupTemplate) => {
    setSelectedTemplate(template)
    setPhase('mockup-render')

    const params = new URLSearchParams(searchParams)
    params.set('template', template.id)
    setSearchParams(params, { replace: true })
  }

  const handleChangeTemplate = () => {
    setPhase('template-review')
  }

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

  if (phase === 'template-review') {
    return (
      <LanguageProvider>
        <div className={styles.mockup}>
          <div className={styles.previewBar}>
            <span className={styles.previewLabel}>
              TEMPLATE SELECTION
              {practiceName && <> | {practiceName}</>}
            </span>
            <Link to={backUrl} className={styles.backLink}>Back to Proposal</Link>
          </div>
          <TemplateReview
            matches={templateMatches}
            onSelect={handleTemplateSelect}
            preSelectedId={selectedTemplate?.id}
          />
        </div>
      </LanguageProvider>
    )
  }

  return (
    <LanguageProvider>
      <AiContentProvider>
        <MockupTemplateProvider templateId={selectedTemplate?.theme.id || null}>
          <MockupInner
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            practiceName={practiceName}
            quoteNumber={quoteNumber}
            backUrl={backUrl}
            config={activeConfig}
            selectedTemplate={selectedTemplate}
            onChangeTemplate={handleChangeTemplate}
          />
        </MockupTemplateProvider>
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
  selectedTemplate: MockupTemplate | null
  onChangeTemplate: () => void
}

function MockupInner({
  activeSection,
  setActiveSection,
  practiceName,
  quoteNumber,
  backUrl,
  config,
  selectedTemplate,
  onChangeTemplate,
}: MockupInnerProps) {
  const { content, loading, error, generate } = useAiContent()
  const [dismissed, setDismissed] = useState(false)

  const templateId = selectedTemplate?.theme.id
  const toneDirective = selectedTemplate?.theme.aiToneDirective

  useEffect(() => {
    if (!content && !loading && !error && practiceName) {
      generate(config, practiceName, templateId, toneDirective)
    }
  }, [content, loading, error, practiceName, config, generate, templateId, toneDirective])

  const showOverlay = loading || (!content && !error && !dismissed)

  const themeStyles = selectedTemplate?.theme.cssOverrides
    ? (selectedTemplate.theme.cssOverrides as React.CSSProperties)
    : undefined

  const sectionOrder = selectedTemplate?.sectionOrder || [
    'hero', 'services', 'about', 'doctors', 'forms', 'referral', 'contact', 'footer',
  ]

  const mainSections = sectionOrder.filter(id => id !== 'footer')
  const hasFooter = sectionOrder.includes('footer')

  return (
    <div className={styles.mockup} style={themeStyles}>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header role="banner" className={styles.stickyHeader}>
        <div className={styles.previewBar}>
          <span className={styles.previewLabel}>
            {content ? 'AI-GENERATED PREVIEW' : 'PROTOTYPE PREVIEW'}
            {practiceName && <> | This is a simulated mockup for {practiceName}</>}
            {quoteNumber && <> | Quote: {quoteNumber}</>}
          </span>
          <div className={styles.previewActions}>
            <button className={styles.changeTemplateBtn} onClick={onChangeTemplate}>
              Change Template
            </button>
            {error && !dismissed && (
              <button className={styles.retryBtn} onClick={() => generate(config, practiceName || 'Our Practice', templateId, toneDirective)}>
                Retry AI
              </button>
            )}
            <Link to={backUrl} className={styles.backLink}>Back to Proposal</Link>
          </div>
        </div>
        <MockupNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
      </header>
      <main id="main-content" role="main">
        {mainSections.map(sectionId => {
          const Component = sectionComponents[sectionId]
          if (!Component) return null
          return <Component key={sectionId} />
        })}
      </main>
      {hasFooter && <MockupFooter />}
      <FloatingCTA />
      <BackToTop />
      {showOverlay && !dismissed && (
        <AiGeneratingOverlay
          loading={loading}
          error={error}
          onRetry={() => generate(config, practiceName || 'Our Practice', templateId, toneDirective)}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </div>
  )
}
