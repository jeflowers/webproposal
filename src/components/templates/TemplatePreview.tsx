import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { ArrowLeft, Monitor, Tablet, Smartphone, Check } from 'lucide-react'
import { LanguageProvider } from '../../i18n/LanguageContext'
import { AiContentProvider, useAiContent } from '../../config/AiContentContext'
import { useDiscovery } from '../../config/DiscoveryContext'
import { STYLE_CATEGORIES, type TemplateTheme } from '../../data/templateData'
import { DEFAULT_CONFIG } from '../../types/discovery'
import MockupNavbar from '../mockup/MockupNavbar'
import MockupHero from '../mockup/MockupHero'
import MockupServices from '../mockup/MockupServices'
import MockupAbout from '../mockup/MockupAbout'
import MockupDoctors from '../mockup/MockupDoctors'
import MockupForms from '../mockup/MockupForms'
import MockupReferral from '../mockup/MockupReferral'
import MockupContact from '../mockup/MockupContact'
import MockupFooter from '../mockup/MockupFooter'
import MockupStatBar from '../mockup/MockupStatBar'
import MockupAgeGuide from '../mockup/MockupAgeGuide'
import MockupBadgeRow from '../mockup/MockupBadgeRow'
import MockupClosingCTA from '../mockup/MockupClosingCTA'
import AiGeneratingOverlay from '../mockup/AiGeneratingOverlay'
import styles from './TemplatePreview.module.css'

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface Props {
  template: TemplateTheme
  onBack: () => void
  onSelect: (id: string) => void
}

export default function TemplatePreview({ template, onBack, onSelect }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [template.id])

  return (
    <LanguageProvider>
      <AiContentProvider>
        <PreviewInner template={template} onBack={onBack} onSelect={onSelect} />
      </AiContentProvider>
    </LanguageProvider>
  )
}

const SECTION_REGISTRY: Record<string, () => ReactNode> = {
  hero: () => <MockupHero />,
  services: () => <MockupServices />,
  about: () => <MockupAbout />,
  doctors: () => <MockupDoctors />,
  forms: () => <MockupForms />,
  referrals: () => <MockupReferral />,
  contact: () => <MockupContact />,
  statBar: () => <MockupStatBar />,
  ageGuide: () => <MockupAgeGuide />,
  badgeRowAwards: () => <MockupBadgeRow variant="awards" />,
  badgeRowCredentials: () => <MockupBadgeRow variant="credentials" />,
  closingCta: () => <MockupClosingCTA />,
}

const DEFAULT_SECTIONS = ['hero', 'services', 'about', 'doctors', 'forms', 'referrals', 'contact']

const TEMPLATE_SECTIONS: Record<string, string[]> = {
  'alvarado-authority': ['hero', 'badgeRowCredentials', 'services', 'about', 'ageGuide', 'doctors', 'forms', 'referrals', 'contact'],
  'pure-minimal': ['hero', 'statBar', 'services', 'about', 'doctors', 'contact', 'closingCta'],
}

function PreviewInner({ template, onBack, onSelect }: Props) {
  const { content, loading, error, generate } = useAiContent()
  const { setSelectedTemplateId } = useDiscovery()
  const [device, setDevice] = useState<DeviceMode>('desktop')
  const [dismissed, setDismissed] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    if (!content && !loading && !error) {
      generate(DEFAULT_CONFIG, 'Sample Practice', template.id, template.aiToneDirective)
    }
  }, [content, loading, error, generate, template.id, template.aiToneDirective])

  const handleSelect = useCallback(() => {
    setSelectedTemplateId(template.id)
    setSelected(true)
    setTimeout(() => onSelect(template.id), 600)
  }, [template.id, setSelectedTemplateId, onSelect])

  const handleBack = useCallback(() => {
    onBack()
  }, [onBack])

  const showOverlay = loading || (!content && !error && !dismissed)

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className={styles.preview}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeft size={16} />
            Back to Gallery
          </button>
          <div className={styles.templateMeta}>
            <span className={styles.templateName}>{template.name}</span>
            <span className={styles.categoryBadge}>
              {STYLE_CATEGORIES[template.category].label.split(' / ')[0]}
            </span>
          </div>
        </div>
        <div className={styles.toolbarCenter}>
          <div className={styles.deviceToggle} role="group" aria-label="Device preview">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([mode, Icon]) => (
              <button
                key={mode}
                className={`${styles.deviceBtn} ${device === mode ? styles.deviceActive : ''}`}
                onClick={() => setDevice(mode)}
                aria-label={`${mode} view`}
                aria-pressed={device === mode}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
        <div className={styles.toolbarRight}>
          <button
            className={`${styles.selectBtn} ${selected ? styles.selected : ''}`}
            onClick={handleSelect}
            disabled={selected}
          >
            {selected ? <><Check size={16} /> Selected</> : 'Select This Template'}
          </button>
        </div>
      </div>

      <div className={styles.viewport}>
        <div
          className={`${styles.frame} ${device !== 'desktop' ? styles.frameDevice : ''}`}
          style={{
            maxWidth: deviceWidths[device],
            ...template.cssOverrides as React.CSSProperties,
          }}
        >
          <header role="banner">
            <MockupNavbar activeSection={activeSection} setActiveSection={setActiveSection} />
          </header>
          <main role="main">
            {(TEMPLATE_SECTIONS[template.id] || DEFAULT_SECTIONS).map((sectionKey) => {
              const render = SECTION_REGISTRY[sectionKey]
              return render ? <div key={sectionKey}>{render()}</div> : null
            })}
          </main>
          <MockupFooter />
        </div>
      </div>

      {showOverlay && !dismissed && (
        <AiGeneratingOverlay
          loading={loading}
          error={error}
          onRetry={() => generate(DEFAULT_CONFIG, 'Sample Practice', template.id, template.aiToneDirective)}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </div>
  )
}
