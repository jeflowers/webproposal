import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Search, Globe, CircleAlert as AlertCircle, Loader as Loader2, Circle as HelpCircle, Save } from 'lucide-react'
import { useDiscovery } from '../config/DiscoveryContext'
import InfoTooltip from '../components/discovery/InfoTooltip'
import CompletionGuideModal from '../components/discovery/CompletionGuideModal'
import { getFieldHelp } from '../data/discoveryHelpContent'
import type {
  DiscoveryConfig,
  DomainLookupResult,
  ProjectType,
  CloudProvider,
  BrandingAsset,
  PhoneSystem,
  EhrSystem,
  BilingualScope,
  HostingPreference,
  ImplementationPhase,
} from '../types/discovery'
import styles from './Discovery.module.css'

const TOTAL_STEPS = 8

const SECTION_TITLES = [
  'About Your Practice & Current Challenges',
  'Current Environment & Infrastructure',
  'Practice & Branding Needs',
  'Patient Intake & Forms',
  'Security & Compliance',
  'Language Requirements',
  'Integrations & Systems',
  'Ongoing Support Preferences',
]

const SECTION_DESCRIPTIONS = [
  'Help us understand your practice, current pain points, and what you envision for the new website.',
  'Tell us about your current technology setup and hosting environment.',
  'Help us understand your practice size and branding needs.',
  'Describe your current patient intake process and form requirements.',
  'Specify your security and compliance requirements.',
  'Tell us about the languages your patients speak.',
  'What systems and integrations does your practice use?',
  'How would you like your website hosted and maintained?',
]

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={styles.radioGroup}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`${styles.radioOption} ${value === opt.value ? styles.radioOptionSelected : ''}`}
        >
          <input
            type="radio"
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: { value: string; label: string }[]
  values: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val))
    } else {
      onChange([...values, val])
    }
  }

  return (
    <div className={styles.checkboxGroup}>
      {options.map((opt) => {
        const checked = values.includes(opt.value)
        return (
          <div
            key={opt.value}
            className={`${styles.checkboxOption} ${checked ? styles.checkboxOptionSelected : ''}`}
            onClick={() => toggle(opt.value)}
          >
            <div className={`${styles.checkboxBox} ${checked ? styles.checkboxBoxChecked : ''}`}>
              {checked && <Check size={12} color="#fff" />}
            </div>
            {opt.label}
          </div>
        )
      })}
    </div>
  )
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button
        type="button"
        className={`${styles.toggle} ${value ? styles.toggleActive : ''}`}
        onClick={() => onChange(!value)}
      >
        <div className={styles.toggleKnob} />
      </button>
    </div>
  )
}

function FieldLabel({
  sectionIndex,
  fieldKey,
  children,
}: {
  sectionIndex: number
  fieldKey: string
  children: React.ReactNode
}) {
  const help = getFieldHelp(sectionIndex, fieldKey)
  return (
    <span className={styles.fieldLabelRow}>
      <span className={styles.fieldLabel}>{children}</span>
      {help && <InfoTooltip help={help} />}
    </span>
  )
}

function DomainLookup({
  config,
  update,
}: {
  config: DiscoveryConfig
  update: (patch: Partial<DiscoveryConfig>) => void
}) {
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  const lookupDomain = useCallback(async () => {
    const domain = config.domain_name.trim()
    if (!domain) return

    setLookupLoading(true)
    setLookupError('')

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/domain-lookup`
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain }),
      })

      const data = await res.json()

      if (!res.ok) {
        setLookupError(data.error || 'Lookup failed')
        setLookupLoading(false)
        return
      }

      const result = data as DomainLookupResult
      const patch: Partial<DiscoveryConfig> = {
        domain_lookup: result,
        domain_registrar: result.registrar !== 'Unknown' ? result.registrar : config.domain_registrar,
      }

      if (result.detectedProviderType === 'aws' && !config.cloud_providers.includes('aws')) {
        patch.cloud_providers = [...config.cloud_providers.filter((p) => p !== 'none'), 'aws']
      } else if (result.detectedProviderType === 'gcp' && !config.cloud_providers.includes('gcp')) {
        patch.cloud_providers = [...config.cloud_providers.filter((p) => p !== 'none'), 'gcp']
      } else if (result.detectedProviderType === 'azure' && !config.cloud_providers.includes('azure')) {
        patch.cloud_providers = [...config.cloud_providers.filter((p) => p !== 'none'), 'azure']
      }

      update(patch)
    } catch {
      setLookupError('Could not connect to lookup service')
    }

    setLookupLoading(false)
  }, [config.domain_name, config.cloud_providers, config.domain_registrar, update])

  const lookup = config.domain_lookup

  return (
    <>
      <div className={styles.domainInputRow}>
        <input
          type="text"
          className={styles.textInput}
          placeholder="yourdomain.com"
          value={config.domain_name}
          onChange={(e) => update({ domain_name: e.target.value })}
          onKeyDown={(e) => { if (e.key === 'Enter') lookupDomain() }}
        />
        <button
          type="button"
          className={styles.lookupButton}
          onClick={lookupDomain}
          disabled={lookupLoading || !config.domain_name.trim()}
        >
          {lookupLoading ? <Loader2 size={14} className={styles.spinner} /> : <Search size={14} />}
          {lookupLoading ? 'Looking up...' : 'Lookup'}
        </button>
      </div>

      {lookupError && (
        <div className={styles.lookupError}>
          <AlertCircle size={13} /> {lookupError}
        </div>
      )}

      {lookup && !lookupError && (
        <div className={styles.lookupResults}>
          <div className={styles.lookupHeader}>
            <Globe size={14} />
            <span>Domain Information for <strong>{lookup.domain}</strong></span>
          </div>
          <div className={styles.lookupGrid}>
            <div className={styles.lookupItem}>
              <span className={styles.lookupLabel}>Registrar</span>
              <span className={styles.lookupValue}>{lookup.registrar}</span>
            </div>
            {lookup.registrationDate && (
              <div className={styles.lookupItem}>
                <span className={styles.lookupLabel}>Registered</span>
                <span className={styles.lookupValue}>{new Date(lookup.registrationDate).toLocaleDateString()}</span>
              </div>
            )}
            {lookup.expirationDate && (
              <div className={styles.lookupItem}>
                <span className={styles.lookupLabel}>Expires</span>
                <span className={styles.lookupValue}>{new Date(lookup.expirationDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className={styles.lookupItem}>
              <span className={styles.lookupLabel}>DNS Provider</span>
              <span className={styles.lookupValue}>{lookup.detectedProvider}</span>
            </div>
            {lookup.nameservers.length > 0 && (
              <div className={`${styles.lookupItem} ${styles.lookupItemFull}`}>
                <span className={styles.lookupLabel}>Nameservers</span>
                <span className={styles.lookupValue}>{lookup.nameservers.join(', ')}</span>
              </div>
            )}
          </div>
          {lookup.detectedProviderType !== 'unknown' && (
            <div className={styles.lookupSignal}>
              <Check size={12} />
              DNS hosted on {lookup.detectedProvider} -- this has been factored into hosting recommendations.
            </div>
          )}
        </div>
      )}
    </>
  )
}

function SectionProblemStatement({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={0} fieldKey="project_type">Is this a brand new website or replacing/upgrading an existing one?</FieldLabel>
        <RadioGroup
          options={[
            { value: 'new', label: 'Brand new website' },
            { value: 'redesign', label: 'Redesign existing site' },
            { value: 'upgrade', label: 'Upgrade current site' },
          ]}
          value={config.project_type}
          onChange={(v) => update({ project_type: v as ProjectType })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={0} fieldKey="problem_statement">Tell us about your practice and what prompted this project.</FieldLabel>
        <span className={styles.fieldHint}>What are the main challenges or goals driving this website project?</span>
        <textarea
          className={styles.textArea}
          rows={4}
          placeholder="e.g., We're a multi-location ophthalmology practice looking to modernize our online presence and improve patient intake..."
          value={config.problem_statement}
          onChange={(e) => update({ problem_statement: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={0} fieldKey="website_frustrations">What frustrations do you have with your current website (if any)?</FieldLabel>
        <span className={styles.fieldHint}>What isn't working well? What do patients or staff complain about?</span>
        <textarea
          className={styles.textArea}
          rows={3}
          placeholder="e.g., The site looks outdated, forms don't work on mobile, patients can't find information easily..."
          value={config.website_frustrations}
          onChange={(e) => update({ website_frustrations: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={0} fieldKey="website_wishes">What do you wish your website could do?</FieldLabel>
        <span className={styles.fieldHint}>Describe your ideal website experience for patients and staff.</span>
        <textarea
          className={styles.textArea}
          rows={3}
          placeholder="e.g., Easy online forms, bilingual support, modern design that builds trust..."
          value={config.website_wishes}
          onChange={(e) => update({ website_wishes: e.target.value })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={0} fieldKey="inspiration_sites">Are there any websites you admire or want to draw inspiration from?</FieldLabel>
        <span className={styles.fieldHint}>Share URLs or describe what you like about them.</span>
        <textarea
          className={styles.textArea}
          rows={2}
          placeholder="e.g., https://example-eyecare.com - clean layout, easy navigation"
          value={config.inspiration_sites}
          onChange={(e) => update({ inspiration_sites: e.target.value })}
        />
      </div>
    </div>
  )
}

function Section1({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={1} fieldKey="cloud_providers">Do you currently use any cloud providers?</FieldLabel>
        <span className={styles.fieldHint}>Select all that apply</span>
        <CheckboxGroup
          options={[
            { value: 'aws', label: 'Amazon Web Services (AWS)' },
            { value: 'gcp', label: 'Google Cloud Platform' },
            { value: 'azure', label: 'Microsoft Azure' },
            { value: 'other', label: 'Other provider' },
            { value: 'none', label: 'None / Not sure' },
          ]}
          values={config.cloud_providers}
          onChange={(v) => {
            const prev = config.cloud_providers
            const added = v.find((x) => !(prev as string[]).includes(x))
            if (added === 'none') {
              update({ cloud_providers: ['none'] as CloudProvider[] })
            } else if (added) {
              update({ cloud_providers: v.filter((x) => x !== 'none') as CloudProvider[] })
            } else {
              update({ cloud_providers: v as CloudProvider[] })
            }
          }}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={1} fieldKey="has_domain">Do you have an existing domain?</FieldLabel>
        <Toggle label="Yes, we have a domain" value={config.has_domain} onChange={(v) => update({ has_domain: v })} />
        {config.has_domain && (
          <DomainLookup config={config} update={update} />
        )}
        {config.has_domain && config.domain_lookup && (
          <input
            type="text"
            className={styles.textInput}
            placeholder="Registrar (auto-filled from lookup)"
            value={config.domain_registrar}
            onChange={(e) => update({ domain_registrar: e.target.value })}
          />
        )}
        {config.has_domain && !config.domain_lookup && (
          <input
            type="text"
            className={styles.textInput}
            placeholder="Where is it registered? (e.g., GoDaddy, Namecheap)"
            value={config.domain_registrar}
            onChange={(e) => update({ domain_registrar: e.target.value })}
          />
        )}
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={1} fieldKey="has_professional_email">Do you currently have professional email (@yourpractice.com)?</FieldLabel>
        <Toggle
          label="Yes, we have professional email"
          value={config.has_professional_email}
          onChange={(v) => update({ has_professional_email: v })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={1} fieldKey="uses_microsoft_365">Does your practice use Microsoft 365?</FieldLabel>
        <Toggle
          label="Yes, we use Microsoft 365"
          value={config.uses_microsoft_365}
          onChange={(v) => update({ uses_microsoft_365: v })}
        />
      </div>
    </div>
  )
}

function Section2({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={2} fieldKey="doctor_count">How many doctors need individual profile pages?</FieldLabel>
        <input
          type="number"
          className={styles.numberInput}
          min={1}
          max={20}
          value={config.doctor_count}
          onChange={(e) => update({ doctor_count: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={2} fieldKey="has_existing_branding">Do you have existing branding assets?</FieldLabel>
        <Toggle
          label="Yes, we have branding materials"
          value={config.has_existing_branding}
          onChange={(v) => update({ has_existing_branding: v })}
        />
        {config.has_existing_branding && (
          <CheckboxGroup
            options={[
              { value: 'logo', label: 'Logo files' },
              { value: 'style_guide', label: 'Brand style guide' },
              { value: 'photography', label: 'Professional photography' },
            ]}
            values={config.branding_assets}
            onChange={(v) => update({ branding_assets: v as BrandingAsset[] })}
          />
        )}
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={2} fieldKey="needs_additional_pages">Do you need pages beyond the standard 6?</FieldLabel>
        <span className={styles.fieldHint}>Standard pages: Home, Services, About, Doctors, Forms, Contact</span>
        <Toggle
          label="Yes, we need additional pages"
          value={config.needs_additional_pages}
          onChange={(v) => {
            update({ needs_additional_pages: v })
            if (!v) {
              update({ additional_pages: [] })
              update({ page_order: ['Home', 'Services', 'About', 'Doctors', 'Forms', 'Contact'] })
            }
          }}
        />
        {config.needs_additional_pages && (
          <input
            type="text"
            className={styles.textInput}
            placeholder="e.g., Referrals, Blog, Insurance Info (comma-separated)"
            value={config.additional_pages.join(', ')}
            onChange={(e) => {
              const newPages = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)

              const standardPages = ['Home', 'Services', 'About', 'Doctors', 'Forms', 'Contact']
              const currentOrder = config.page_order.filter((p) =>
                standardPages.includes(p) || config.additional_pages.includes(p)
              )

              const pagesToAdd = newPages.filter((p) => !currentOrder.includes(p))
              const newOrder = [...currentOrder.filter((p) => standardPages.includes(p) || newPages.includes(p)), ...pagesToAdd]

              update({
                additional_pages: newPages,
                page_order: newOrder,
              })
            }}
          />
        )}
        <PageOrderSelector config={config} update={update} />
      </div>
    </div>
  )
}

function PageOrderSelector({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const standardPages = ['Home', 'Services', 'About', 'Doctors', 'Forms', 'Contact']
  const allPages = [...new Set([...standardPages, ...config.additional_pages])]
  const orderedPages = config.page_order.length > 0
    ? config.page_order.filter((p) => allPages.includes(p))
    : standardPages

  const missingPages = allPages.filter((p) => !orderedPages.includes(p))
  const displayPages = [...orderedPages, ...missingPages]

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newOrder = [...displayPages]
      const [removed] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(dragOverIndex, 0, removed)
      update({ page_order: newOrder })
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const isAdditionalPage = (page: string) => config.additional_pages.includes(page)

  return (
    <div className={styles.pagesConfirmation}>
      <div className={styles.pagesConfirmationHeader}>
        Pages to be created (drag to reorder):
      </div>
      <div className={styles.pagesConfirmationList}>
        {displayPages.map((page, index) => (
          <div
            key={page}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            onDragLeave={handleDragLeave}
            className={`${styles.pageItem} ${isAdditionalPage(page) ? styles.pageItemAdditional : ''} ${
              draggedIndex === index ? styles.pageItemDragging : ''
            } ${dragOverIndex === index ? styles.pageItemDragOver : ''}`}
          >
            <span className={styles.pageItemDragHandle}>⋮⋮</span>
            {page}
          </div>
        ))}
      </div>
    </div>
  )
}

function Section3({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={3} fieldKey="current_forms">What forms do you currently use for patient intake?</FieldLabel>
        <CheckboxGroup
          options={[
            { value: 'registration', label: 'Patient Registration' },
            { value: 'medical_history', label: 'Medical History' },
            { value: 'insurance', label: 'Insurance Information' },
            { value: 'consent', label: 'Consent Forms' },
            { value: 'other', label: 'Other forms' },
          ]}
          values={config.current_forms}
          onChange={(v) => update({ current_forms: v })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={3} fieldKey="need_custom_forms">Do you need custom forms beyond the standard 4?</FieldLabel>
        <Toggle
          label="Yes, we need additional custom forms"
          value={config.need_custom_forms}
          onChange={(v) => update({ need_custom_forms: v })}
        />
        {config.need_custom_forms && (
          <div className={styles.field}>
            <span className={styles.fieldHint}>How many total forms do you need?</span>
            <input
              type="number"
              className={styles.numberInput}
              min={5}
              max={20}
              value={config.custom_form_count}
              onChange={(e) => update({ custom_form_count: parseInt(e.target.value) || 5 })}
            />
          </div>
        )}
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={3} fieldKey="accepts_referrals">Do you accept physician referrals?</FieldLabel>
        <Toggle
          label="Yes, we accept referrals"
          value={config.accepts_referrals}
          onChange={(v) => update({ accepts_referrals: v })}
        />
      </div>
    </div>
  )
}

function Section4({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={4} fieldKey="hipaa_hosting_required">Do you have specific HIPAA hosting requirements?</FieldLabel>
        <span className={styles.fieldHint}>
          This determines whether your hosting provider needs HIPAA-eligible infrastructure
        </span>
        <Toggle
          label="Yes, we need HIPAA-compliant hosting"
          value={config.hipaa_hosting_required}
          onChange={(v) => update({ hipaa_hosting_required: v })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={4} fieldKey="needs_baa">Do you need a Business Associate Agreement (BAA) with your hosting provider?</FieldLabel>
        <Toggle
          label="Yes, we need a BAA"
          value={config.needs_baa}
          onChange={(v) => update({ needs_baa: v })}
        />
      </div>
    </div>
  )
}

function Section5({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={5} fieldKey="patient_languages">What languages do your patients speak?</FieldLabel>
        <CheckboxGroup
          options={[
            { value: 'english', label: 'English' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'chinese', label: 'Chinese' },
            { value: 'vietnamese', label: 'Vietnamese' },
            { value: 'korean', label: 'Korean' },
            { value: 'other', label: 'Other' },
          ]}
          values={config.patient_languages}
          onChange={(v) => update({ patient_languages: v })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={5} fieldKey="bilingual_scope">What level of bilingual support do you need?</FieldLabel>
        <RadioGroup
          options={[
            { value: 'full', label: 'Full bilingual (all pages and forms)' },
            { value: 'key_pages', label: 'Key pages only (Home, Services, Contact)' },
            { value: 'none', label: 'English only' },
          ]}
          value={config.bilingual_scope}
          onChange={(v) => update({ bilingual_scope: v as BilingualScope })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={5} fieldKey="additional_languages">Any languages beyond English and Spanish?</FieldLabel>
        <span className={styles.fieldHint}>Each additional language is a separate add-on</span>
        <input
          type="text"
          className={styles.textInput}
          placeholder="e.g., Mandarin, Vietnamese (comma-separated)"
          value={config.additional_languages.join(', ')}
          onChange={(e) =>
            update({
              additional_languages: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </div>
  )
}

function Section6({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={6} fieldKey="phone_system">What phone system do you use?</FieldLabel>
        <RadioGroup
          options={[
            { value: 'ringcentral', label: 'RingCentral' },
            { value: 'other', label: 'Other system' },
            { value: 'none', label: 'No VoIP system' },
          ]}
          value={config.phone_system}
          onChange={(v) => update({ phone_system: v as PhoneSystem })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={6} fieldKey="ehr_system">What EHR/EMR system do you use?</FieldLabel>
        <RadioGroup
          options={[
            { value: 'nextech', label: 'Nextech' },
            { value: 'other', label: 'Other EHR' },
            { value: 'none', label: 'No EHR system' },
          ]}
          value={config.ehr_system}
          onChange={(v) => update({ ehr_system: v as EhrSystem })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={6} fieldKey="wants_online_scheduling">Do you want online appointment scheduling?</FieldLabel>
        <Toggle
          label="Yes, enable online scheduling"
          value={config.wants_online_scheduling}
          onChange={(v) => update({ wants_online_scheduling: v })}
        />
        {config.wants_online_scheduling && (
          <div className={styles.subField}>
            <span className={styles.fieldHint}>When would you like to implement scheduling?</span>
            <RadioGroup
              options={[
                { value: 'phase_1', label: 'Phase 1 -- Include at launch' },
                { value: 'phase_2', label: 'Phase 2 -- Add after initial launch' },
                { value: 'custom', label: 'Custom Timeline' },
              ]}
              value={config.scheduling_phase}
              onChange={(v) => update({ scheduling_phase: v as ImplementationPhase })}
            />
            {config.scheduling_phase === 'custom' && (
              <input
                type="text"
                className={styles.textInput}
                placeholder="Describe your preferred timeline (e.g., 3 months after launch)"
                value={config.scheduling_custom_note}
                onChange={(e) => update({ scheduling_custom_note: e.target.value })}
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={6} fieldKey="needs_patient_portal">Do you need a patient portal?</FieldLabel>
        <Toggle
          label="Yes, we need a patient portal"
          value={config.needs_patient_portal}
          onChange={(v) => update({ needs_patient_portal: v })}
        />
        {config.needs_patient_portal && (
          <div className={styles.subField}>
            <span className={styles.fieldHint}>When would you like to implement the patient portal?</span>
            <RadioGroup
              options={[
                { value: 'phase_1', label: 'Phase 1 -- Include at launch' },
                { value: 'phase_2', label: 'Phase 2 -- Add after initial launch' },
                { value: 'custom', label: 'Custom Timeline' },
              ]}
              value={config.patient_portal_phase}
              onChange={(v) => update({ patient_portal_phase: v as ImplementationPhase })}
            />
            {config.patient_portal_phase === 'custom' && (
              <input
                type="text"
                className={styles.textInput}
                placeholder="Describe your preferred timeline (e.g., 3 months after launch)"
                value={config.patient_portal_custom_note}
                onChange={(e) => update({ patient_portal_custom_note: e.target.value })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Section7({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <FieldLabel sectionIndex={7} fieldKey="hosting_preference">Do you want managed hosting or self-managed?</FieldLabel>
        <RadioGroup
          options={[
            { value: 'managed', label: 'Managed (we handle everything)' },
            { value: 'self_managed', label: 'Self-managed (your team handles hosting)' },
          ]}
          value={config.hosting_preference}
          onChange={(v) => update({ hosting_preference: v as HostingPreference })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={7} fieldKey="needs_maintenance">Do you need ongoing maintenance and support?</FieldLabel>
        <Toggle
          label="Yes, include monthly maintenance"
          value={config.needs_maintenance}
          onChange={(v) => update({ needs_maintenance: v })}
        />
      </div>

      <div className={styles.field}>
        <FieldLabel sectionIndex={7} fieldKey="email_account_count">How many email accounts do you need?</FieldLabel>
        <input
          type="number"
          className={styles.numberInput}
          min={0}
          max={50}
          value={config.email_account_count}
          onChange={(e) => update({ email_account_count: parseInt(e.target.value) || 0 })}
        />
      </div>
    </div>
  )
}

const SECTIONS = [SectionProblemStatement, Section1, Section2, Section3, Section4, Section5, Section6, Section7]

export default function Discovery() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { config, setConfig, createQuote, saveDraft, loadDraft, draftId } = useDiscovery()
  const [step, setStep] = useState(0)
  const [practiceName, setPracticeName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingStatus, setSavingStatus] = useState('')
  const [error, setError] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const [draftSaving, setDraftSaving] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)

  useEffect(() => {
    const draftParam = searchParams.get('draft')
    if (draftParam && !draftId) {
      setDraftLoading(true)
      loadDraft(draftParam).then((result) => {
        if (result) {
          setStep(result.step)
          setPracticeName(result.practiceName)
          setContactEmail(result.contactEmail)
        }
        setDraftLoading(false)
      })
    }
  }, [])

  const update = (patch: Partial<DiscoveryConfig>) => {
    setConfig({ ...config, ...patch })
  }

  const handleSaveProgress = async () => {
    setDraftSaving(true)
    setDraftSaved(false)
    const id = await saveDraft(step, practiceName, contactEmail)
    setDraftSaving(false)
    if (id) {
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 3000)
    }
  }

  const SectionComponent = SECTIONS[step]

  const handleSubmit = async () => {
    if (!practiceName.trim() || !contactEmail.trim()) {
      setError('Please enter both practice name and contact email.')
      return
    }

    setSaving(true)
    setError('')
    setSavingStatus('Creating your proposal...')

    try {
      const quote = await createQuote(practiceName, contactEmail)
      if (quote && quote.quote_number) {
        navigate(`/proposal?quote=${quote.quote_number}`, { replace: true })
      } else {
        setError('Failed to create quote. Please try again or contact support.')
        setSaving(false)
        setSavingStatus('')
      }
    } catch (err) {
      console.error('Error creating quote:', err)
      setError('An unexpected error occurred. Please try again.')
      setSaving(false)
      setSavingStatus('')
    }
  }

  if (draftLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>
          <Loader2 size={24} className={styles.spinner} />
          <p>Loading your saved progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} />
          Back to Proposal
        </Link>
        <button
          type="button"
          className={styles.saveProgressButton}
          onClick={handleSaveProgress}
          disabled={draftSaving}
        >
          {draftSaving ? (
            <Loader2 size={14} className={styles.spinner} />
          ) : draftSaved ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {draftSaving ? 'Saving...' : draftSaved ? 'Saved' : 'Save Progress'}
        </button>
      </div>
      <div className={styles.header}>
        <div className={styles.headerTopRow}>
          <h1>Discovery Intake Form</h1>
          <button
            type="button"
            className={styles.guideButton}
            onClick={() => setShowGuide(true)}
          >
            <HelpCircle size={16} />
            <span>Completion Guide</span>
          </button>
        </div>
        <p>
          Answer these questions to help us understand your practice's needs. Your responses
          will customize the proposal with tailored recommendations and pricing.
        </p>
      </div>

      {showGuide && <CompletionGuideModal onClose={() => setShowGuide(false)} />}

      <div className={styles.progressBar}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`${styles.progressStep} ${
              i === step ? styles.progressStepActive : i < step ? styles.progressStepComplete : ''
            }`}
          />
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionNumber}>{step + 1}</div>
          <h2 className={styles.sectionTitle}>{SECTION_TITLES[step]}</h2>
        </div>
        <p className={styles.sectionDescription}>{SECTION_DESCRIPTIONS[step]}</p>
        <SectionComponent config={config} update={update} />
      </div>

      {step === TOTAL_STEPS - 1 && (
        <div className={styles.submitSection}>
          <h3>Ready to View Your Proposal</h3>
          <p>Enter your practice name and email to save this configuration and view your customized proposal.</p>
          <div className={styles.submitFields}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Practice name"
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
            />
            <input
              type="email"
              className={styles.textInput}
              placeholder="Contact email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          {savingStatus && !error && (
            <div className={styles.statusMessage}>
              <Loader2 size={16} className={styles.spinner} />
              {savingStatus}
            </div>
          )}
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={saving || !practiceName.trim() || !contactEmail.trim()}
          >
            {saving ? 'Creating Quote...' : 'View Your Proposal'}
          </button>
        </div>
      )}

      <div className={styles.navigation}>
        {step > 0 ? (
          <button
            className={`${styles.navButton} ${styles.navButtonSecondary}`}
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeft size={16} /> Previous
          </button>
        ) : (
          <div />
        )}
        {step < TOTAL_STEPS - 1 && (
          <button
            className={`${styles.navButton} ${styles.navButtonPrimary}`}
            onClick={() => setStep(step + 1)}
          >
            Next <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
