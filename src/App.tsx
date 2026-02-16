import { Routes, Route } from 'react-router-dom'
import { DiscoveryProvider } from './config/DiscoveryContext'
import Proposal from './pages/Proposal'
import Mockup from './pages/Mockup'
import Discovery from './pages/Discovery'

function App() {
  return (
    <DiscoveryProvider>
      <Routes>
        <Route path="/" element={<Proposal />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/mockup/*" element={<Mockup />} />
      </Routes>
    </DiscoveryProvider>
  )
}

export default App
