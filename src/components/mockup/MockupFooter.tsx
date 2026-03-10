import { Phone, Mail, MapPin } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAiContent } from '../../config/AiContentContext'
import { useTemplateTheme } from '../../hooks/useTemplateTheme'
import styles from './MockupFooter.module.css'

export default function MockupFooter() {
  const { locale, t } = useLanguage()
  const { content } = useAiContent()
  const template = useTemplateTheme()

  const isMinimal = template?.id === 'pure-minimal'
  const isAlvarado = template?.id === 'alvarado-authority'

  const useAi = locale === 'en' && !!content
  const brandText = useAi ? content.footer.brandText : t.footer.brandText
  const practiceName = content?.hero.practiceName || 'MEC'
  const nameParts = practiceName.split(' ')
  const brandMain = nameParts[0]
  const brandSub = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Eye Specialists'

  const serviceNames = useAi && content.services.items?.length
    ? content.services.items.slice(0, 5).map(s => s.name)
    : [t.footer.cataract, t.footer.glaucoma, t.footer.retina, t.footer.lasik, t.footer.eyeExams]

  if (isMinimal) {
    return (
      <footer className={styles.footerMinimal}>
        <div className={styles.containerMinimal}>
          <div className={styles.minimalLeft}>
            <span className={styles.brandNameMinimal}>{practiceName}</span>
            <p className={styles.brandTextMinimal}>{brandText}</p>
          </div>
          <div className={styles.minimalRight}>
            <ul className={styles.linkListMinimal}>
              <li><a href="#services">{t.nav.services}</a></li>
              <li><a href="#about">{t.nav.about}</a></li>
              <li><a href="#doctors">{t.nav.doctors}</a></li>
              <li><a href="#contact">{t.nav.contact}</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottomMinimal}>
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>
      </footer>
    )
  }

  if (isAlvarado) {
    return (
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.brandCol}>
              <div className={styles.brand}>
                <span className={styles.brandName}>{brandMain}</span>
                <span className={styles.brandSub}>{brandSub}</span>
              </div>
              <p className={styles.brandText}>{brandText}</p>
            </div>

            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>{t.footer.servicesTitle}</h4>
              <ul className={styles.linkList}>
                {serviceNames.map(name => (
                  <li key={name}><a href="#services">{name}</a></li>
                ))}
              </ul>
            </div>

            <div className={styles.linksCol}>
              <h4 className={styles.colTitle}>Main Office</h4>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <MapPin size={14} />
                  <span>123 Medical Center Dr, San Diego</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <a href="tel:8442115462">(844) 211-5462</a>
                </div>
              </div>
              <h4 className={`${styles.colTitle} ${styles.colTitleSpaced}`}>Satellite Office</h4>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <MapPin size={14} />
                  <span>456 Vision Blvd, La Jolla</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={14} />
                  <a href="tel:8442115462">(844) 211-5462</a>
                </div>
              </div>
            </div>

            <div className={styles.contactCol}>
              <h4 className={styles.colTitle}>{t.footer.contactTitle}</h4>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <Mail size={14} />
                  <a href="mailto:info@meceyespecialists.com">info@meceyespecialists.com</a>
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

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <span className={styles.brandName}>{brandMain}</span>
              <span className={styles.brandSub}>{brandSub}</span>
            </div>
            <p className={styles.brandText}>{brandText}</p>
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
              {serviceNames.map(name => (
                <li key={name}><a href="#services">{name}</a></li>
              ))}
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
