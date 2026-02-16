import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useDiscovery } from '../config/DiscoveryContext'
import ProposalHeader from '../components/proposal/ProposalHeader'
import CurrentSiteAnalysis from '../components/proposal/CurrentSiteAnalysis'
import ScopeOfWork from '../components/proposal/ScopeOfWork'
import FeatureBreakdown from '../components/proposal/FeatureBreakdown'
import IntegrationDetails from '../components/proposal/IntegrationDetails'
import HostingOptions from '../components/proposal/HostingOptions'
import InvestmentSummary from '../components/proposal/InvestmentSummary'
import QuoteWorksheet from '../components/proposal/QuoteWorksheet'
import styles from './Proposal.module.css'

export default function Proposal() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { configId, loading, currentQuote, quoteLoading } = useDiscovery()
  const [quoteNumberInput, setQuoteNumberInput] = useState('')
  const [quoteLoadError, setQuoteLoadError] = useState('')

  const hasConfig = !!searchParams.get('config') || !!configId || !!currentQuote

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
        <div className={styles.loadingState}>Loading...</div>
      </div>
    )
  }

  return (
    <div className={styles.proposal}>
      <ProposalHeader />
      {!hasConfig && (
        <div className={styles.discoveryBanner}>
          <div className={styles.bannerContent}>
            <h3>Customize This Proposal</h3>
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
      <div className={styles.mockupBanner}>
        <div className={styles.bannerContent}>
          <h3>Interactive Mockup Available</h3>
          <p>View a working prototype of the redesigned website</p>
          <Link to="/mockup" className={styles.mockupLink}>
            View Mockup
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        <CurrentSiteAnalysis />
        <ScopeOfWork />
        <FeatureBreakdown />
        <IntegrationDetails />
        <HostingOptions />
        <InvestmentSummary />
        <QuoteWorksheet />
      </div>
      <footer className={styles.footer}>
        <p>Prepared for MEC Eye Specialists</p>
        <p className={styles.date}>February 2026</p>
      </footer>
    </div>
  )
}
