import { Award, Clock, Users, MapPin } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupAbout.module.css'

export default function MockupAbout() {
  const { t } = useLanguage()

  const stats = [
    { icon: Clock, value: '20+', label: t.about.yearsExp },
    { icon: Users, value: '50,000+', label: t.about.patients },
    { icon: Award, value: 'Board', label: t.about.certified },
    { icon: MapPin, value: 'Multiple', label: t.about.locations },
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
            <h2 className={styles.heading}>{t.about.heading}</h2>
            <p className={styles.text}>{t.about.text1}</p>
            <p className={styles.text}>{t.about.text2}</p>
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
