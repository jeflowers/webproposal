import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useDiscovery } from '../config/DiscoveryContext'
import ProposalNav from '../components/proposal/ProposalNav'
import ProposalHeader from '../components/proposal/ProposalHeader'
import DiscoverySummary from '../components/proposal/DiscoverySummary'
import CurrentSiteAnalysis from '../components/proposal/CurrentSiteAnalysis'
import ScopeOfWork from '../components/proposal/ScopeOfWork'
import FeatureBreakdown from '../components/proposal/FeatureBreakdown'
import IntegrationDetails from '../components/proposal/IntegrationDetails'
import HostingOptions from '../components/proposal/HostingOptions'
import InvestmentSummary from '../components/proposal/InvestmentSummary'
import QuoteWorksheet from '../components/proposal/QuoteWorksheet'
import BackToTop from '../components/ui/BackToTop'
import styles from './Proposal.module.css'

export default function Proposal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { configId, loading, currentQuote, quoteLoading } = useDiscovery()
  const [quoteNumberInput, setQuoteNumberInput] = useState('')
  const [quoteLoadError, setQuoteLoadError] = useState('')

  const hasConfig = !!searchParams.get('config') || !!configId || !!currentQuote

  const practiceName = currentQuote?.practice_name || 'Your Practice'
  const preparedDate = currentQuote
    ? new Date(currentQuote.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const quoteParam = currentQuote?.quote_number
    ? `?quote=${currentQuote.quote_number}`
    : searchParams.get('config')
      ? `?config=${searchParams.get('config')}`
      : ''

  const handleLoadQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setQuoteLoadError('')

    if (!quoteNumberInput.trim()) {
      setQuoteLoadError('Please enter a quote number')
      return
    }

    navigate(`/proposal?quote=${quoteNumberInput.trim()}`)
  }

  if (loading || quoteLoading) {
    return (
      <div className={styles.proposal}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your proposal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.proposal}>
      <a href="#content" className="skip-link">Skip to content</a>
      <ProposalNav />
      {!hasConfig && (
        <div className={styles.discoveryBanner}>
          <div className={styles.bannerContent}>
            <h3>Create A Proposal</h3>
            <p>Complete the discovery form to tailor recommendations and pricing to your practice</p>
            <Link to="/discovery" className={styles.discoveryLink}>
              Start Discovery Form
            </Link>
          </div>
          <div className={styles.bannerDivider} />
          <div className={styles.bannerContent}>
            <h3>Have an Existing Quote?</h3>
            <p>Enter your quote number to load your saved proposal</p>
            <form onSubmit={handleLoadQuote} className={styles.quoteLoadForm}>
              <input
                type="text"
                placeholder="e.g., MEC-WEB-0001"
                value={quoteNumberInput}
                onChange={(e) => setQuoteNumberInput(e.target.value)}
                className={styles.quoteInput}
              />
              <button type="submit" className={styles.loadButton}>
                Load Quote
              </button>
            </form>
            {quoteLoadError && (
              <p className={styles.errorMessage}>{quoteLoadError}</p>
            )}
          </div>
        </div>
      )}
      <ProposalHeader />
      <div className={styles.mockupBanner}>
        <div className={styles.bannerContent}>
          <h3>Interactive Mockup Available</h3>
          <p>View a working prototype of the redesigned website</p>
          <div className={styles.bannerLinks}>
            <Link to={`/mockup${quoteParam}`} className={styles.mockupLink}>
              View Mockup
            </Link>
            <Link to="/quotes" className={styles.mockupLink}>
              Manage Quotes
            </Link>
            <Link to="/contracts" className={styles.mockupLink}>
              Contract Documents
            </Link>
          </div>
        </div>
      </div>
      <main id="content" className={styles.content} role="main">
        <section id="discovery-summary">
          <DiscoverySummary />
        </section>
        <section id="current-site">
          <CurrentSiteAnalysis />
        </section>
        <section id="scope-of-work">
          <ScopeOfWork />
        </section>
        <section id="features">
          <FeatureBreakdown />
        </section>
        <section id="integrations">
          <IntegrationDetails />
        </section>
        <section id="hosting">
          <HostingOptions />
        </section>
        <InvestmentSummary />
        <section id="quote-worksheet">
          <QuoteWorksheet />
        </section>
      </main>
      <footer className={styles.footer} role="contentinfo">
        <p>Prepared for {practiceName}</p>
        <p className={styles.date}>{preparedDate}</p>
      </footer>
      <BackToTop />
    </div>
  )
}
