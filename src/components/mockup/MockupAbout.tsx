import { Award, Clock, Users, MapPin } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAiContent } from '../../config/AiContentContext'
import styles from './MockupAbout.module.css'

export default function MockupAbout() {
  const { locale, t } = useLanguage()
  const { content } = useAiContent()

  const useAi = locale === 'en' && !!content
  const heading = useAi ? content.about.heading : t.about.heading
  const text1 = useAi ? content.about.text1 : t.about.text1
  const text2 = useAi ? content.about.text2 : t.about.text2

  const stats = [
    { icon: Clock, value: useAi ? content.about.stats.yearsExp : '20+', label: t.about.yearsExp },
    { icon: Users, value: useAi ? content.about.stats.patients : '50,000+', label: t.about.patients },
    { icon: Award, value: useAi ? content.about.stats.specialists : 'Board', label: t.about.certified },
    { icon: MapPin, value: useAi ? content.about.stats.locations : 'Multiple', label: t.about.locations },
  ]

  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageCol}>
            <img
              src="https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Eye examination"
              className={styles.image}
            />
          </div>
          <div className={styles.textCol}>
            <span className={styles.label}>{t.about.label}</span>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.text}>{text1}</p>
            <p className={styles.text}>{text2}</p>
          </div>
        </div>

        <div className={styles.stats}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <stat.icon size={20} className={styles.statIcon} />
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
