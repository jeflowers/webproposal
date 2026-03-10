import { useState, useEffect } from 'react'
import { Phone, Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAiContent } from '../../config/AiContentContext'
import { useTemplateTheme } from '../../hooks/useTemplateTheme'
import styles from './MockupNavbar.module.css'

interface Props {
  activeSection: string
  setActiveSection: (s: string) => void
}

const navKeys = ['home', 'services', 'about', 'doctors', 'forms', 'referrals', 'contact'] as const
const minimalNavKeys = ['services', 'about', 'doctors', 'contact'] as const

export default function MockupNavbar({ activeSection, setActiveSection }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { locale, setLocale, t } = useLanguage()
  const { content } = useAiContent()
  const template = useTemplateTheme()

  const isMinimal = template?.id === 'pure-minimal'

  const practiceName = content?.hero.practiceName || 'MEC'
  const nameParts = practiceName.split(' ')
  const brandMain = nameParts[0]
  const brandSub = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Eye Specialists'

  const activeNavKeys = isMinimal ? minimalNavKeys : navKeys

  useEffect(() => {
    if (isMinimal) return
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMinimal])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-90px 0px -60% 0px', threshold: 0.1 }
    )

    navKeys.forEach((key) => {
      const el = document.getElementById(key)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [setActiveSection])

  const navLabels: Record<string, string> = {
    home: t.nav.home,
    services: t.nav.services,
    about: t.nav.about,
    doctors: t.nav.doctors,
    forms: t.nav.forms,
    referrals: t.nav.referrals,
    contact: t.nav.contact,
  }

  const handleClick = (id: string) => {
    setActiveSection(id)
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'es' : 'en')
  }

  if (isMinimal) {
    return (
      <nav
        className={styles.navMinimal}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.innerMinimal}>
          <div className={styles.brandMinimal}>
            <span className={styles.brandNameMinimal}>{practiceName}</span>
          </div>

          <div className={`${styles.linksMinimal} ${mobileOpen ? styles.open : ''}`}>
            {minimalNavKeys.map((key) => (
              <button
                key={key}
                className={`${styles.linkMinimal} ${activeSection === key ? styles.activeMinimal : ''}`}
                onClick={() => handleClick(key)}
              >
                {navLabels[key]}
              </button>
            ))}
          </div>

          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>{brandMain}</span>
          <span className={styles.brandSub}>{brandSub}</span>
        </div>

        <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
          {activeNavKeys.map((key) => (
            <button
              key={key}
              className={`${styles.link} ${activeSection === key ? styles.active : ''}`}
              onClick={() => handleClick(key)}
            >
              {navLabels[key]}
            </button>
          ))}
          <button
            className={styles.langToggle}
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            <Globe size={14} />
            {locale === 'en' ? 'ES' : 'EN'}
          </button>
          <a href="tel:+18442115462" className={styles.phoneLink}>
            <Phone size={14} />
            (844) 211-5462
          </a>
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
