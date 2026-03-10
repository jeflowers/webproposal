import { Phone, FileText, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAiContent } from '../../config/AiContentContext'
import { useTemplateTheme } from '../../hooks/useTemplateTheme'
import styles from './MockupHero.module.css'

export default function MockupHero() {
  const { locale, t } = useLanguage()
  const { content } = useAiContent()
  const template = useTemplateTheme()

  const useAi = locale === 'en' && !!content
  const practiceName = content?.hero.practiceName || 'MEC'
  const tagline1 = useAi ? content.hero.tagline1 : t.hero.tagline1
  const tagline2 = useAi ? content.hero.tagline2 : t.hero.tagline2

  const isMinimal = template?.id === 'pure-minimal'
  const isAlvarado = template?.id === 'alvarado-authority'

  if (isMinimal) {
    return (
      <section id="home" className={styles.heroMinimal}>
        <div className={styles.contentNarrow}>
          <h1 className={styles.titleMinimal}>{tagline1}</h1>
          <p className={styles.subtitleMinimal}>{tagline2}</p>
        </div>
      </section>
    )
  }

  if (isAlvarado) {
    const credential = content?.surgeonCredential || 'Dr. Lee R. Katzman, MD'
    const specialty = content?.surgeonSpecialty || 'Specializing in Cataracts, LASIK, and Eye Surgery'

    return (
      <section id="home" className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <p className={styles.credential}>{credential}</p>
          <h1 className={styles.titleAlvarado}>{tagline1}</h1>
          <p className={styles.specialtyLine}>{specialty}</p>
          <div className={styles.divider} style={{ background: 'var(--color-accent)' }} />
          <div className={styles.actions}>
            <a href="tel:8442115462" className={styles.primaryBtnGold}>
              <Phone size={16} />
              (844) 211-5462
            </a>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className={styles.secondaryBtn}>
              Book Appointment
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    )
  }

  const nameParts = practiceName.split(' ')
  const titleMain = nameParts[0]
  const titleSub = nameParts.length > 1 ? nameParts.slice(1).join(' ').toUpperCase() : 'EYE SPECIALISTS'

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{titleMain}</h1>
        <p className={styles.subtitle}>{titleSub}</p>
        <div className={styles.divider} />
        <p className={styles.tagline}>
          {tagline1}
          <br />
          {tagline2}
        </p>
        <div className={styles.actions}>
          <a href="tel:8442115462" className={styles.primaryBtn}>
            <Phone size={16} />
            (844) 211-5462
          </a>
          <button onClick={() => scrollTo('forms')} className={styles.secondaryBtn}>
            <FileText size={16} />
            {t.hero.patientForms}
            <ArrowRight size={14} />
          </button>
        </div>
        <div className={styles.quickLinks}>
          <a href="#" className={styles.quickLink}>{t.hero.patientPortal}</a>
          <span className={styles.quickSep} />
          <a href="#" className={styles.quickLink}>{t.hero.billPay}</a>
          <span className={styles.quickSep} />
          <button onClick={() => scrollTo('referrals')} className={styles.quickLinkBtn}>{t.hero.doctorReferrals}</button>
        </div>
      </div>
    </section>
  )
}
