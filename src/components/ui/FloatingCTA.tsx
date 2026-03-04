import { useState, useEffect, useRef } from 'react'
import { Phone, CalendarDays, X } from 'lucide-react'
import styles from './FloatingCTA.module.css'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setVisible(currentY < lastScrollY.current || currentY < 100)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`${styles.container} ${visible ? styles.visible : ''}`}>
      {expanded && (
        <div className={styles.menu}>
          <a href="tel:+18442115462" className={styles.menuItem}>
            <Phone size={18} />
            <span>Call Now</span>
          </a>
          <button
            className={styles.menuItem}
            onClick={() => {
              setExpanded(false)
              const el = document.getElementById('contact')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <CalendarDays size={18} />
            <span>Request Appointment</span>
          </button>
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close menu' : 'Contact options'}
      >
        {expanded ? <X size={24} /> : <Phone size={24} />}
      </button>
    </div>
  )
}
