import { useState } from 'react'
import { X, Download, AlertTriangle, Loader2 } from 'lucide-react'
import { discoveryHelpContent } from '../../data/discoveryHelpContent'
import { generateGuidePdf } from '../../utils/generateGuidePdf'
import styles from './CompletionGuideModal.module.css'

interface CompletionGuideModalProps {
  onClose: () => void
}

export default function CompletionGuideModal({ onClose }: CompletionGuideModalProps) {
  const [generating, setGenerating] = useState(false)

  const handleExportPdf = async () => {
    setGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      generateGuidePdf()
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.title}>Completion Guide</div>
            <div className={styles.subtitle}>
              Instructions and examples for every question
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.pdfButton}
              onClick={handleExportPdf}
              disabled={generating}
            >
              {generating ? (
                <Loader2 size={14} className={styles.spinner} />
              ) : (
                <Download size={14} />
              )}
              <span>{generating ? 'Generating...' : 'Download PDF'}</span>
            </button>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {discoveryHelpContent.map((section, idx) => (
            <div key={section.sectionIndex}>
              {idx > 0 && <div className={styles.divider} />}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionNumber}>
                    {section.sectionIndex + 1}
                  </div>
                  <div className={styles.sectionTitle}>{section.title}</div>
                </div>
                <div className={styles.sectionDescription}>
                  {section.description}
                </div>

                {section.fields.map((field) => (
                  <div key={field.fieldKey} className={styles.fieldCard}>
                    <div className={styles.fieldQuestion}>{field.question}</div>
                    <p className={styles.fieldGuidance}>{field.guidance}</p>

                    {field.example && (
                      <div className={styles.fieldExample}>
                        <div className={styles.fieldExampleLabel}>Example</div>
                        <div className={styles.fieldExampleText}>
                          {field.example}
                        </div>
                      </div>
                    )}

                    {field.pricingImpact && (
                      <div className={styles.fieldPricing}>
                        <AlertTriangle size={11} />
                        <span>{field.pricingImpact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.divider} />

          <div className={styles.summaryTitle}>Quick Reference Summary</div>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Section</th>
                <th>Key Decision Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Practice narrative, pain points, goals, design inspiration</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Redesign vs. new; domain status; M365 usage</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Doctor count; branding assets; additional pages</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Form types; physician referral acceptance</td>
              </tr>
              <tr>
                <td>5</td>
                <td>HIPAA hosting; BAA requirement</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Language selection; bilingual depth</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Phone system; EHR; online scheduling; patient portal</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Managed hosting; maintenance plan; email account count</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          All fields marked with a pricing impact warning directly affect proposal
          scope and pricing.
        </div>
      </div>
    </div>
  )
}
