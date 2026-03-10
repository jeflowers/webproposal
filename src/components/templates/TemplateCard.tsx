import { Eye } from 'lucide-react'
import { STYLE_CATEGORIES, type TemplateTheme } from '../../data/templateData'
import styles from './TemplateCard.module.css'

interface Props {
  template: TemplateTheme
  onPreview: (id: string) => void
}

export default function TemplateCard({ template, onPreview }: Props) {
  const overrides = template.cssOverrides
  const isDark = isColorDark(overrides['--color-bg'] || '#ffffff')

  return (
    <article className={styles.card}>
      <button
        className={styles.trigger}
        onClick={() => onPreview(template.id)}
        aria-label={`Preview ${template.name} template`}
      >
        <div
          className={styles.thumbnail}
          style={overrides as React.CSSProperties}
        >
          <div className={styles.miniNav} style={{ background: overrides['--color-bg-dark'] || '#0c1821' }}>
            <div className={styles.miniLogo} style={{ background: overrides['--color-primary'] }} />
            <div className={styles.miniNavLinks}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={styles.miniNavItem} style={{ background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
          </div>
          <div className={styles.miniHero} style={{ background: overrides['--color-primary'] }}>
            <div className={styles.miniHeroLine1} style={{ background: isDark ? 'rgba(255,255,255,0.9)' : '#fff' }} />
            <div className={styles.miniHeroLine2} style={{ background: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.7)' }} />
            <div className={styles.miniHeroBtn} style={{ background: overrides['--color-accent'] || '#e8a838' }} />
          </div>
          <div className={styles.miniBody} style={{ background: overrides['--color-bg'] || '#fff' }}>
            <div className={styles.miniSectionTitle} style={{ background: overrides['--color-secondary'] || '#1a3a4a', opacity: 0.15 }} />
            <div className={styles.miniGrid}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.miniCard} style={{
                  background: overrides['--color-bg-alt'] || '#f7f9fb',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : (overrides['--color-border'] || '#e2e8f0'),
                }}>
                  <div className={styles.miniCardIcon} style={{ background: overrides['--color-primary'] }} />
                  <div className={styles.miniCardLine} style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
                  <div className={styles.miniCardLine2} style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }} />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.miniFooter} style={{ background: overrides['--color-bg-dark'] || '#0c1821' }} />
          <div className={styles.hoverOverlay}>
            <Eye size={20} />
            <span>Preview</span>
          </div>
        </div>
      </button>
      <div className={styles.info}>
        <div className={styles.meta}>
          <h3 className={styles.name}>{template.name}</h3>
          <span className={styles.badge} style={{
            background: getCategoryColor(template.category),
            color: '#fff',
          }}>
            {STYLE_CATEGORIES[template.category].label.split(' / ')[0]}
          </span>
        </div>
        <p className={styles.tagline}>{template.tagline}</p>
        <p className={styles.description}>{template.description}</p>
      </div>
    </article>
  )
}

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'clinical': return '#0e7c7b'
    case 'modern': return '#0096b7'
    case 'warm': return '#5b8a72'
    case 'premium': return '#a68a3a'
    default: return '#64748b'
  }
}
