import styles from './MockupBadgeRow.module.css'

interface Props {
  variant: 'awards' | 'credentials'
}

const awardBadges = [
  { label: 'Castle Connolly', initials: 'CC' },
  { label: 'Best Physicians', initials: 'BP' },
  { label: 'Top Doctor', initials: 'TD' },
  { label: 'Patients Choice', initials: 'PC' },
  { label: 'Americas Best', initials: 'AB' },
]

const credentialBadges = [
  { label: 'American Academy of Ophthalmology', initials: 'AAO' },
  { label: 'ASCRS', initials: 'ASCRS' },
  { label: 'American Board of Ophthalmology', initials: 'ABO' },
  { label: 'AMA', initials: 'AMA' },
]

export default function MockupBadgeRow({ variant }: Props) {
  const badges = variant === 'awards' ? awardBadges : credentialBadges

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.row}>
          {badges.map((badge) => (
            <div key={badge.label} className={styles.badge} title={badge.label}>
              <span className={styles.badgeInitials}>{badge.initials}</span>
              <span className={styles.badgeLabel}>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
