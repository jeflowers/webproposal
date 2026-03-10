import { Sparkles, CircleAlert as AlertCircle, X } from 'lucide-react'
import styles from './AiGeneratingOverlay.module.css'

interface Props {
  loading: boolean
  error: string | null
  onRetry: () => void
  onDismiss: () => void
}

export default function AiGeneratingOverlay({ loading, error, onRetry, onDismiss }: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        {loading ? (
          <>
            <div className={styles.iconWrap}>
              <Sparkles size={32} className={styles.sparkle} />
            </div>
            <h3 className={styles.title}>Generating Personalized Content</h3>
            <p className={styles.text}>
              AI is creating custom website copy based on the discovery questionnaire data.
              This usually takes 10-15 seconds.
            </p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </>
        ) : error ? (
          <>
            <div className={styles.iconWrapError}>
              <AlertCircle size={32} />
            </div>
            <h3 className={styles.title}>Content Generation Unavailable</h3>
            <p className={styles.text}>{error}</p>
            <p className={styles.textSub}>The mockup will display default template content instead.</p>
            <div className={styles.actions}>
              <button className={styles.retryBtn} onClick={onRetry}>Try Again</button>
              <button className={styles.dismissBtn} onClick={onDismiss}>Use Default Content</button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.iconWrap}>
              <Sparkles size={32} className={styles.sparkle} />
            </div>
            <h3 className={styles.title}>Preparing Mockup</h3>
            <p className={styles.text}>Setting up the personalized preview...</p>
          </>
        )}
        {loading && (
          <button className={styles.closeBtn} onClick={onDismiss} aria-label="Skip">
            <X size={16} />
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
