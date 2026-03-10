import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { templates, type TemplateCategory } from '../../data/templateData'
import CategoryFilter from './CategoryFilter'
import TemplateCard from './TemplateCard'
import styles from './TemplateGallery.module.css'

interface Props {
  onPreview: (id: string) => void
  onCustomRequest: () => void
}

export default function TemplateGallery({ onPreview, onCustomRequest }: Props) {
  const [category, setCategory] = useState<TemplateCategory | 'all'>('all')

  const filtered = category === 'all'
    ? templates
    : templates.filter(t => t.category === category)

  return (
    <div className={styles.gallery}>
      <Link to="/" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Proposal
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>Choose Your Website Style</h1>
        <p className={styles.subtitle}>
          Select a pre-designed template to start your proposal, or describe your vision for a custom design.
        </p>
      </div>

      <CategoryFilter active={category} onChange={setCategory} />

      <div className={styles.grid} role="tabpanel">
        {filtered.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={onPreview}
          />
        ))}
        <article className={styles.customCard}>
          <button className={styles.customTrigger} onClick={onCustomRequest}>
            <div className={styles.customIcon}>
              <Plus size={32} strokeWidth={1.5} />
            </div>
            <h3 className={styles.customTitle}>Custom Design</h3>
            <p className={styles.customText}>
              Have a specific vision? Describe what you want and we will design something unique for your practice.
            </p>
            <span className={styles.customLink}>Request Custom Design</span>
          </button>
        </article>
      </div>
    </div>
  )
}
