import { useRef, useState, useEffect } from 'react'
import { useAiContent } from '../../config/AiContentContext'
import styles from './MockupStatBar.module.css'

interface StatItem {
  prefix?: string
  value: number
  suffix?: string
  label: string
}

const defaultStats: StatItem[] = [
  { value: 15000, suffix: '+', label: 'Procedures Performed' },
  { value: 99, suffix: '.7%', label: 'Patient Satisfaction' },
  { value: 20, suffix: '+', label: 'Years of Excellence' },
]

function AnimatedNumber({ item, animate }: { item: StatItem; animate: boolean }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!animate) {
      setDisplay(0)
      return
    }

    const duration = 1500
    const start = performance.now()
    const target = item.value

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * target))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [animate, item.value])

  return (
    <span className={styles.statValue}>
      {item.prefix || ''}{display.toLocaleString()}{item.suffix || ''}
    </span>
  )
}

export default function MockupStatBar() {
  const { content } = useAiContent()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  const stats: StatItem[] = content?.statBar?.length ? content.statBar : defaultStats

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={styles.statBar}>
      {stats.map((item) => (
        <div key={item.label} className={styles.statItem}>
          <AnimatedNumber item={item} animate={visible} />
          <span className={styles.statLabel}>{item.label}</span>
        </div>
      ))}
    </section>
  )
}
