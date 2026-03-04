import { Phone, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupFooter.module.css'

export default function MockupFooter() {
  const { t } = useLanguage()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <span className={styles.brandName}>MEC</span>
              <span className={styles.brandSub}>Eye Specialists</span>
            </div>
            <p className={styles.brandText}>{t.footer.brandText}</p>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>{t.footer.quickLinks}</h4>
            <ul className={styles.linkList}>
              <li><a href="#services">{t.nav.services}</a></li>
              <li><a href="#forms">{t.nav.forms}</a></li>
              <li><a href="#referrals">{t.nav.referrals}</a></li>
              <li><a href="#">{t.hero.patientPortal}</a></li>
              <li><a href="#">{t.hero.billPay}</a></li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>{t.footer.servicesTitle}</h4>
            <ul className={styles.linkList}>
              <li><a href="#services">{t.footer.cataract}</a></li>
              <li><a href="#services">{t.footer.glaucoma}</a></li>
              <li><a href="#services">{t.footer.retina}</a></li>
              <li><a href="#services">{t.footer.lasik}</a></li>
              <li><a href="#services">{t.footer.eyeExams}</a></li>
            </ul>
          </div>

          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>{t.footer.contactTitle}</h4>
            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <Phone size={14} />
                <a href="tel:8442115462">(844) 211-5462</a>
              </div>
              <div className={styles.contactItem}>
                <Mail size={14} />
                <a href="mailto:info@meceyespecialists.com">info@meceyespecialists.com</a>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={14} />
                <span>{t.footer.addressPlaceholder}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
