import { STYLE_CATEGORIES, CATEGORY_ORDER, type TemplateCategory, templates } from '../../data/templateData'
import styles from './CategoryFilter.module.css'

interface Props {
  active: TemplateCategory | 'all'
  onChange: (category: TemplateCategory | 'all') => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  const allCount = templates.length
  const counts = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = templates.filter(t => t.category === cat).length
    return acc
  }, {} as Record<TemplateCategory, number>)

  return (
    <div className={styles.wrapper} role="tablist" aria-label="Filter templates by style">
      <button
        role="tab"
        aria-selected={active === 'all'}
        className={`${styles.tab} ${active === 'all' ? styles.active : ''}`}
        onClick={() => onChange('all')}
      >
        All
        <span className={styles.count}>{allCount}</span>
      </button>
      {CATEGORY_ORDER.map(cat => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`${styles.tab} ${active === cat ? styles.active : ''}`}
          onClick={() => onChange(cat)}
        >
          {STYLE_CATEGORIES[cat].label}
          <span className={styles.count}>{counts[cat]}</span>
        </button>
      ))}
    </div>
  )
}
