import { useState } from 'react'
import { GraduationCap, Award, Stethoscope, ChevronDown } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useTemplateTheme } from '../../hooks/useTemplateTheme'
import styles from './MockupDoctors.module.css'
import khannaPhoto from '../../assets/image.png'
import unzuetaPhoto from '../../assets/unzueta.png'
import duongPhoto from '../../assets/duong.png'
import groupPhoto from '../../assets/8P0A0036-Edit_1998x1032.jpg'

interface Doctor {
  name: string
  title: string
  photo: string
  specialties: string[]
  education: string[]
  certifications: string[]
  bio: string
}

const doctors: Doctor[] = [
  {
    name: 'Sandeep Khanna, M.D.',
    title: 'Vitreo-Retinal Surgery, Founder',
    photo: khannaPhoto,
    specialties: ['Vitreo-Retinal Surgery', 'Diabetic Retinopathy', 'Macular Degeneration', 'Complex Retinal Detachments'],
    education: [
      'M.D., All India Institute of Medical Sciences (AIIMS), New Delhi',
      'Internship, Good Samaritan Regional Medical Center, Phoenix',
      'Nuclear Medicine, University of California, Los Angeles (UCLA)',
      'Residency, Ophthalmology, Charles Drew University / UCLA',
      'Fellowship, Vitreo-Retinal Diseases & Surgery, Retina Vitreous Associates Medical Group, Beverly Hills',
    ],
    certifications: ['Diplomate, American Board of Ophthalmology', 'Fellow, American Academy of Ophthalmology', 'Member, American Society of Retina Specialists'],
    bio: 'Dr. Khanna founded Mercy Eye Care Medical Group (MEC) in 2001 to provide eye care services in the Mid-Cities region of Los Angeles. MEC now comprises multiple offices from Downtown Los Angeles to Long Beach. He directed the Vitreo-Retinal Services at MLK Jr. Multi-service Ambulatory Care Center (MACC), where he earned the "Doctor of the Year" award in 2013. His clinical interests include diabetic retinopathy, age-related macular degeneration, and management of complex retinal detachments.',
  },
  {
    name: 'Miguel Unzueta, M.D.',
    title: 'Glaucoma & Cataract Surgery, Director',
    photo: unzuetaPhoto,
    specialties: ['Glaucoma', 'Cataract Surgery', 'Corneal Reshaping', 'Eye Disorder Prevention'],
    education: [],
    certifications: [],
    bio: 'Dr. Unzueta has been an ophthalmologist for years with an emphasis on patient comfort and keeping up-to-date with the latest advancements in ophthalmology. He has a wide range of experience in different areas of ophthalmology, from eye disorder prevention to corneal reshaping. "I am proud to provide my patients with the best in vision treatment technology, patient comfort and treatment options."',
  },
  {
    name: 'Dr. Henry Duong',
    title: 'Medical Optometrist, Low Vision Care',
    photo: duongPhoto,
    specialties: ['Low Vision Care', 'Comprehensive Eye Exams', 'Medical Optometry'],
    education: [
      'B.S., Molecular and Cell Biology, University of California, Berkeley',
      'O.D., University of California, Berkeley School of Optometry',
    ],
    certifications: [],
    bio: 'Dr. Henry Duong is the Medical Optometrist at MEC Eye Specialists and sees patients at the clinics in Los Angeles, Montebello, and Lakewood. Raised in the Los Angeles area, he is grateful to serve the local community. Dr. Duong has participated in humanitarian events including free health clinics in the Bay Area, Los Angeles/Orange County, and Nicaragua.',
  },
]

function MinimalDoctorCard({ doctor }: { doctor: Doctor }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.expandCard}>
      <button
        className={styles.expandHeader}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <img src={doctor.photo} alt={doctor.name} className={styles.expandPhoto} />
        <div className={styles.expandMeta}>
          <h3 className={styles.expandName}>{doctor.name}</h3>
          <p className={styles.expandTitle}>{doctor.title}</p>
        </div>
        <ChevronDown
          size={18}
          className={`${styles.expandChevron} ${expanded ? styles.expandChevronOpen : ''}`}
        />
      </button>
      {expanded && (
        <div className={styles.expandBody}>
          <p className={styles.expandBio}>{doctor.bio}</p>
          <div className={styles.expandTags}>
            {doctor.specialties.map((s) => (
              <span key={s} className={styles.expandTag}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MockupDoctors() {
  const { t } = useLanguage()
  const template = useTemplateTheme()

  const isMinimal = template?.id === 'pure-minimal'

  if (isMinimal) {
    return (
      <section id="doctors" className={styles.sectionMinimal}>
        <div className={styles.containerNarrow}>
          <h2 className={styles.headingMinimal}>{t.doctors.heading}</h2>
          <p className={styles.subheadingMinimal}>{t.doctors.subheading}</p>
          <div className={styles.expandList}>
            {doctors.map((doctor) => (
              <MinimalDoctorCard key={doctor.name} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="doctors" className={styles.section}>
      <div className={styles.heroBanner}>
        <img
          src={groupPhoto}
          alt={t.doctors.heading}
          className={styles.heroBannerImg}
          loading="eager"
        />
        <div className={styles.heroBannerOverlay} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{t.doctors.label}</p>
          <h2 className={styles.heroTitle}>{t.doctors.heading}</h2>
          <p className={styles.heroSubtitle}>{t.doctors.subheading}</p>
        </div>
      </div>

      <div className={styles.container}>

        <div className={styles.doctorsList}>
          {doctors.map((doctor, index) => (
            <div
              key={doctor.name}
              className={`${styles.doctorCard} ${index % 2 !== 0 ? styles.reversed : ''}`}
            >
              <div className={styles.photoCol}>
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className={styles.photo}
                />
              </div>

              <div className={styles.infoCol}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <p className={styles.doctorTitle}>{doctor.title}</p>

                <p className={styles.bio}>{doctor.bio}</p>

                <div className={styles.details}>
                  <div className={styles.detailGroup}>
                    <div className={styles.detailHeader}>
                      <Stethoscope size={15} />
                      <h4>{t.doctors.specialties}</h4>
                    </div>
                    <div className={styles.tags}>
                      {doctor.specialties.map((s) => (
                        <span key={s} className={styles.tag}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {doctor.education.length > 0 && (
                    <div className={styles.detailGroup}>
                      <div className={styles.detailHeader}>
                        <GraduationCap size={15} />
                        <h4>{t.doctors.education}</h4>
                      </div>
                      <ul className={styles.detailList}>
                        {doctor.education.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doctor.certifications.length > 0 && (
                    <div className={styles.detailGroup}>
                      <div className={styles.detailHeader}>
                        <Award size={15} />
                        <h4>{t.doctors.certifications}</h4>
                      </div>
                      <ul className={styles.detailList}>
                        {doctor.certifications.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
