import { Eye, Scan, Microscope, Zap, Glasses, Heart } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupServices.module.css'

export default function MockupServices() {
  const { t } = useLanguage()

  const services = [
    { icon: Eye, title: t.services.cataract, description: t.services.cataractDesc },
    { icon: Scan, title: t.services.glaucoma, description: t.services.glaucomaDesc },
    { icon: Microscope, title: t.services.retina, description: t.services.retinaDesc },
    { icon: Zap, title: t.services.lasik, description: t.services.lasikDesc },
    { icon: Glasses, title: t.services.exams, description: t.services.examsDesc },
    { icon: Heart, title: t.services.oculoplastics, description: t.services.oculoplasticsDesc },
  ]

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{t.services.label}</span>
          <h2 className={styles.heading}>{t.services.heading}</h2>
          <p className={styles.subheading}>{t.services.subheading}</p>
        </div>

        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service.title} className={styles.card}>
              <div className={styles.iconWrap}>
                <service.icon size={22} />
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
