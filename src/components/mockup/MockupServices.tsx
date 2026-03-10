import { Eye, Scan, Microscope, Zap, Glasses, Heart, ArrowRight } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAiContent } from '../../config/AiContentContext'
import { useTemplateTheme } from '../../hooks/useTemplateTheme'
import styles from './MockupServices.module.css'

const serviceIcons = [Eye, Scan, Microscope, Zap, Glasses, Heart]

export default function MockupServices() {
  const { locale, t } = useLanguage()
  const { content } = useAiContent()
  const template = useTemplateTheme()

  const isMinimal = template?.id === 'pure-minimal'

  const useAi = locale === 'en' && !!content
  const heading = useAi ? content.services.heading : t.services.heading
  const subheading = useAi ? content.services.subheading : t.services.subheading

  const defaultServices = [
    { title: t.services.cataract, description: t.services.cataractDesc },
    { title: t.services.glaucoma, description: t.services.glaucomaDesc },
    { title: t.services.retina, description: t.services.retinaDesc },
    { title: t.services.lasik, description: t.services.lasikDesc },
    { title: t.services.exams, description: t.services.examsDesc },
    { title: t.services.oculoplastics, description: t.services.oculoplasticsDesc },
  ]

  const services = useAi && content.services.items?.length
    ? content.services.items.map((item, i) => ({
        icon: serviceIcons[i % serviceIcons.length],
        title: item.name,
        description: item.description,
      }))
    : defaultServices.map((s, i) => ({ icon: serviceIcons[i], ...s }))

  if (isMinimal) {
    return (
      <section id="services" className={styles.sectionMinimal}>
        <div className={styles.containerNarrow}>
          <h2 className={styles.headingMinimal}>{heading}</h2>
          <p className={styles.subheadingMinimal}>{subheading}</p>
          <div className={styles.listMinimal}>
            {services.map((service) => (
              <div key={service.title} className={styles.rowCard}>
                <div className={styles.rowIcon}>
                  <service.icon size={20} />
                </div>
                <div className={styles.rowContent}>
                  <h3 className={styles.rowTitle}>{service.title}</h3>
                  <p className={styles.rowDesc}>{service.description}</p>
                </div>
                <ArrowRight size={16} className={styles.rowArrow} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{t.services.label}</span>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.subheading}>{subheading}</p>
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
