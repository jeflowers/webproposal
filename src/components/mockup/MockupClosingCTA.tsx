import { useAiContent } from '../../config/AiContentContext'
import styles from './MockupClosingCTA.module.css'

export default function MockupClosingCTA() {
  const { content } = useAiContent()

  const headline = content?.closingStatement?.headline || 'See the world more clearly.'
  const linkText = content?.closingStatement?.linkText || 'Schedule a consultation'

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.headline}>{headline}</h2>
        <a href="#contact" className={styles.link}>
          {linkText} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </section>
  )
}
