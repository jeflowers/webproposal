import { Phone, FileText, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupHero.module.css'

export default function MockupHero() {
  const { t } = useLanguage()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>MEC</h1>
        <p className={styles.subtitle}>EYE SPECIALISTS</p>
        <div className={styles.divider} />
        <p className={styles.tagline}>
          {t.hero.tagline1}
          <br />
          {t.hero.tagline2}
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
