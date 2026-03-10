import { useAiContent } from '../../config/AiContentContext'
import styles from './MockupAgeGuide.module.css'

interface AgeGroup {
  label: string
  ageRange: string
  description: string
  treatments: string[]
  imageUrl: string
}

const defaultGroups: AgeGroup[] = [
  {
    label: 'Young Adults',
    ageRange: 'Ages 18-40',
    description: 'Active lifestyles demand clear, unassisted vision. Modern refractive procedures can reduce or eliminate dependence on glasses and contacts.',
    treatments: ['LASIK', 'EVO ICL', 'PRK'],
    imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    label: 'Adults',
    ageRange: 'Ages 40-60',
    description: 'Presbyopia and early lens changes are common in this age group. Advanced lens-based solutions can restore both distance and near vision.',
    treatments: ['Clear Lens Exchange', 'LASIK', 'Multifocal IOLs'],
    imageUrl: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    label: 'Seniors',
    ageRange: 'Ages 60+',
    description: 'Cataract development is a natural part of aging. Today\'s premium lens implants can correct vision at all distances during cataract surgery.',
    treatments: ['Cataract Surgery', 'Premium IOLs', 'Glaucoma Management'],
    imageUrl: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
]

export default function MockupAgeGuide() {
  const { content } = useAiContent()

  const heading = content?.ageGuide?.heading || 'How We Can Help'
  const groups: AgeGroup[] = content?.ageGuide?.groups?.length
    ? content.ageGuide.groups.map((g, i) => ({
        ...g,
        imageUrl: defaultGroups[i]?.imageUrl || defaultGroups[0].imageUrl,
      }))
    : defaultGroups

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{heading}</h2>
        </div>
        <div className={styles.grid}>
          {groups.map((group) => (
            <div key={group.ageRange} className={styles.card}>
              <div className={styles.imageWrap}>
                <img src={group.imageUrl} alt={group.label} className={styles.image} loading="lazy" />
              </div>
              <div className={styles.body}>
                <span className={styles.badge}>{group.ageRange}</span>
                <h3 className={styles.cardTitle}>{group.label}</h3>
                <p className={styles.cardDesc}>{group.description}</p>
                <div className={styles.treatments}>
                  {group.treatments.map((t) => (
                    <a key={t} href="#services" className={styles.treatmentLink}>{t}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
