import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import styles from './ProposalNav.module.css'

const sections = [
  { id: 'discovery-summary', label: 'Discovery' },
  { id: 'current-site', label: 'Current Site' },
  { id: 'scope-of-work', label: 'Scope' },
  { id: 'hosting', label: 'Hosting' },
  { id: 'investment-summary', label: 'Investment' },
  { id: 'quote-worksheet', label: 'Quote Worksheet' },
]

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function ProposalNav() {
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-56px 0px -60% 0px', threshold: 0.1 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleClick = (id: string) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleHomeClick = () => {
    setMobileOpen(false)
    setActiveSection('')
    scrollToTop()
  }

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Proposal navigation"
    >
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.brand}
          onClick={handleHomeClick}
          aria-label="Scroll to top"
        >
          Proposal
        </button>

        <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
          <button
            className={`${styles.link} ${activeSection === '' ? styles.active : ''}`}
            onClick={handleHomeClick}
          >
            Home
          </button>
          {sections.map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.link} ${activeSection === id ? styles.active : ''}`}
              onClick={() => handleClick(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          className={styles.cta}
          onClick={() => handleClick('quote-worksheet')}
        >
          Customize Your Quote
        </button>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}
