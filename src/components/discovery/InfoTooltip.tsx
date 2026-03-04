import { useState, useRef, useEffect } from 'react'
import { Info, AlertTriangle } from 'lucide-react'
import type { FieldHelp } from '../../data/discoveryHelpContent'
import styles from './InfoTooltip.module.css'

interface InfoTooltipProps {
  help: FieldHelp
}

export default function InfoTooltip({ help }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      if (rect.left < 180) {
        setAlign('left')
      } else if (viewportWidth - rect.right < 180) {
        setAlign('right')
      } else {
        setAlign('center')
      }
    }
  }, [open])

  const popoverClass = [
    styles.popover,
    align === 'right' ? styles.popoverRight : '',
    align === 'left' ? styles.popoverLeft : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(!open)
        }}
        aria-label={`Help for: ${help.question}`}
      >
        <Info size={11} />
      </button>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} />
          <div className={popoverClass}>
            <div className={styles.arrow} />
            <p className={styles.guidance}>{help.guidance}</p>

            {help.example && (
              <div className={styles.example}>
                <div className={styles.exampleLabel}>Example</div>
                <div className={styles.exampleText}>{help.example}</div>
              </div>
            )}

            {help.pricingImpact && (
              <div className={styles.pricingBadge}>
                <AlertTriangle size={12} />
                <span>{help.pricingImpact}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
