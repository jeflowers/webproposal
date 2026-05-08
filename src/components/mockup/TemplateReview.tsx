import { Star, LayoutGrid as Layout, ArrowRight } from 'lucide-react'
import type { MockupTemplate, TemplateMatch } from '../../config/templateMatcher'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './TemplateReview.module.css'

interface Props {
  matches: TemplateMatch[]
  onSelect: (template: MockupTemplate) => void
  preSelectedId?: string | null
}

function ColorDots({ theme }: { theme: MockupTemplate['theme'] }) {
  const colors = [
    theme.cssOverrides['--color-primary'],
    theme.cssOverrides['--color-accent'],
    theme.cssOverrides['--color-bg-dark'],
    theme.cssOverrides['--color-bg-alt'],
  ].filter(Boolean)

  return (
    <div className={styles.colorDots}>
      {colors.map((c, i) => (
        <span key={i} className={styles.colorDot} style={{ background: c }} />
      ))}
    </div>
  )
}

export default function TemplateReview({ matches, onSelect, preSelectedId }: Props) {
  const { t } = useLanguage()
  const tr = t.templateReview

  const recommended = matches[0]
  const others = matches.slice(1)

  const preSelected = preSelectedId
    ? matches.find(m => m.template.id === preSelectedId)
    : null

  const primary = preSelected || recommended

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.heading}>{tr.heading}</h1>
        <p className={styles.subheading}>{tr.subheading}</p>
      </div>

      <div className={styles.recommended}>
        <div
          className={styles.recommendedCard}
          role="radio"
          aria-checked={true}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(primary.template)
            }
          }}
        >
          <span className={styles.badge}>
            <Star size={12} />
            {tr.recommended}
          </span>
          <div className={styles.previewArea}>
            <div className={styles.previewPlaceholder}>
              <Layout size={40} />
              <span className={styles.previewPlaceholderText}>{primary.template.name}</span>
            </div>
          </div>
          <div className={styles.cardBody}>
            <h2 className={styles.cardName}>{primary.template.name}</h2>
            <p className={styles.cardDesc}>{primary.template.description}</p>
            <ColorDots theme={primary.template.theme} />
            {primary.matchedTraits.length > 0 && (
              <div className={styles.matchedTraits}>
                <span className={styles.traitLabel}>{tr.matchedTraits}</span>
                {primary.matchedTraits.map(trait => (
                  <span key={trait} className={styles.trait}>{trait}</span>
                ))}
              </div>
            )}
            {primary.reason && (
              <p className={styles.matchReason}>{primary.reason}</p>
            )}
            <button
              className={styles.useBtn}
              onClick={() => onSelect(primary.template)}
            >
              {tr.useTemplate}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className={styles.othersSection}>
          <h3 className={styles.othersHeading}>{tr.otherOptions}</h3>
          <div className={styles.othersGrid} role="radiogroup">
            {others.map(match => (
              <div
                key={match.template.id}
                className={styles.altCard}
                role="radio"
                aria-checked={false}
                tabIndex={0}
                onClick={() => onSelect(match.template)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelect(match.template)
                  }
                }}
              >
                <div className={styles.altPreview}>
                  <Layout size={28} className={styles.altPreviewPlaceholder} />
                </div>
                <div className={styles.altBody}>
                  <h4 className={styles.altName}>{match.template.name}</h4>
                  <p className={styles.altDesc}>{match.template.description}</p>
                  <ColorDots theme={match.template.theme} />
                  <button
                    className={styles.selectBtn}
                    onClick={e => {
                      e.stopPropagation()
                      onSelect(match.template)
                    }}
                  >
                    {tr.selectTemplate}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
