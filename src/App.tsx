import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DiscoveryProvider } from './config/DiscoveryContext'

const Proposal = lazy(() => import('./pages/Proposal'))
const Mockup = lazy(() => import('./pages/Mockup'))
const Discovery = lazy(() => import('./pages/Discovery'))
const QuoteManagement = lazy(() => import('./pages/QuoteManagement'))
const ContractsDashboard = lazy(() => import('./pages/contracts/ContractsDashboard'))
const MasterServiceAgreement = lazy(() => import('./pages/contracts/MasterServiceAgreement'))
const StatementOfWork = lazy(() => import('./pages/contracts/StatementOfWork'))
const QuoteEstimate = lazy(() => import('./pages/contracts/QuoteEstimate'))
const ServiceAgreement = lazy(() => import('./pages/contracts/ServiceAgreement'))

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      color: 'var(--color-text-muted)',
      fontSize: '0.95rem',
    }}>
      Loading...
    </div>
  )
}

function App() {
  return (
    <DiscoveryProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Proposal />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/mockup/*" element={<Mockup />} />
          <Route path="/quotes" element={<QuoteManagement />} />
          <Route path="/contracts" element={<ContractsDashboard />} />
          <Route path="/contracts/msa" element={<MasterServiceAgreement />} />
          <Route path="/contracts/sow" element={<StatementOfWork />} />
          <Route path="/contracts/quote" element={<QuoteEstimate />} />
          <Route path="/contracts/service" element={<ServiceAgreement />} />
        </Routes>
      </Suspense>
    </DiscoveryProvider>
  )
}

export default App
