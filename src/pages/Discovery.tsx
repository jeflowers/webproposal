import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Search, Globe, AlertCircle, Loader2 } from 'lucide-react'
import { useDiscovery } from '../config/DiscoveryContext'
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

const TOTAL_STEPS = 7

const SECTION_TITLES = [
  'Current Environment & Infrastructure',
  'Practice & Branding Needs',
  'Patient Intake & Forms',
  'Security & Compliance',
  'Language Requirements',
  'Integrations & Systems',
  'Ongoing Support Preferences',
]

const SECTION_DESCRIPTIONS = [
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

function Section1({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Is this a brand new website or replacing/upgrading an existing one?</span>
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
        <span className={styles.fieldLabel}>Do you currently use any cloud providers?</span>
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
        <span className={styles.fieldLabel}>Do you have an existing domain?</span>
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
        <span className={styles.fieldLabel}>Do you currently have professional email (@yourpractice.com)?</span>
        <Toggle
          label="Yes, we have professional email"
          value={config.has_professional_email}
          onChange={(v) => update({ has_professional_email: v })}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Does your practice use Microsoft 365?</span>
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
        <span className={styles.fieldLabel}>How many doctors need individual profile pages?</span>
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
        <span className={styles.fieldLabel}>Do you have existing branding assets?</span>
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
        <span className={styles.fieldLabel}>Do you need pages beyond the standard 6?</span>
        <span className={styles.fieldHint}>Standard pages: Home, Services, About, Doctors, Forms, Contact</span>
        <Toggle
          label="Yes, we need additional pages"
          value={config.needs_additional_pages}
          onChange={(v) => {
            update({ needs_additional_pages: v })
            if (!v) {
              update({ additional_pages: [] })
            }
          }}
        />
        {config.needs_additional_pages && (
          <input
            type="text"
            className={styles.textInput}
            placeholder="e.g., Referrals, Blog, Insurance Info (comma-separated)"
            value={config.additional_pages.join(', ')}
            onChange={(e) =>
              update({
                additional_pages: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        )}
        <div className={styles.pagesConfirmation}>
          <div className={styles.pagesConfirmationHeader}>Pages to be created:</div>
          <div className={styles.pagesConfirmationList}>
            <div className={styles.pageItem}>Home</div>
            <div className={styles.pageItem}>Services</div>
            <div className={styles.pageItem}>About</div>
            <div className={styles.pageItem}>Doctors</div>
            <div className={styles.pageItem}>Forms</div>
            <div className={styles.pageItem}>Contact</div>
            {config.additional_pages.map((page) => (
              <div key={page} className={`${styles.pageItem} ${styles.pageItemAdditional}`}>
                {page}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section3({ config, update }: { config: DiscoveryConfig; update: (patch: Partial<DiscoveryConfig>) => void }) {
  return (
    <div className={styles.fieldGroup}>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>What forms do you currently use for patient intake?</span>
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
        <span className={styles.fieldLabel}>Do you need custom forms beyond the standard 4?</span>
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
        <span className={styles.fieldLabel}>Do you accept physician referrals?</span>
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
        <span className={styles.fieldLabel}>Do you have specific HIPAA hosting requirements?</span>
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
        <span className={styles.fieldLabel}>Do you need a Business Associate Agreement (BAA) with your hosting provider?</span>
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
        <span className={styles.fieldLabel}>What languages do your patients speak?</span>
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
        <span className={styles.fieldLabel}>What level of bilingual support do you need?</span>
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
        <span className={styles.fieldLabel}>Any languages beyond English and Spanish?</span>
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
        <span className={styles.fieldLabel}>What phone system do you use?</span>
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
        <span className={styles.fieldLabel}>What EHR/EMR system do you use?</span>
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
        <span className={styles.fieldLabel}>Do you want online appointment scheduling?</span>
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
        <span className={styles.fieldLabel}>Do you need a patient portal?</span>
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
        <span className={styles.fieldLabel}>Do you want managed hosting or self-managed?</span>
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
        <span className={styles.fieldLabel}>Do you need ongoing maintenance and support?</span>
        <Toggle
          label="Yes, include monthly maintenance"
          value={config.needs_maintenance}
          onChange={(v) => update({ needs_maintenance: v })}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>How many email accounts do you need?</span>
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

const SECTIONS = [Section1, Section2, Section3, Section4, Section5, Section6, Section7]

export default function Discovery() {
  const navigate = useNavigate()
  const { config, setConfig, createQuote } = useDiscovery()
  const [step, setStep] = useState(0)
  const [practiceName, setPracticeName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (patch: Partial<DiscoveryConfig>) => {
    setConfig({ ...config, ...patch })
  }

  const SectionComponent = SECTIONS[step]

  const handleSubmit = async () => {
    setSaving(true)
    const quote = await createQuote(practiceName, contactEmail)
    if (quote) {
      navigate(`/proposal?quote=${quote.quote_number}`)
    }
    setSaving(false)
  }

  if (false) {
    return (
      <div className={styles.page}>
        <div className={styles.successMessage}>
          <h3>Discovery Form Submitted</h3>
          <p>
            Your answers have been saved and a customized proposal has been generated.
            Share the link below with stakeholders, or view the proposal now.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Discovery Intake Form</h1>
        <p>
          Answer these questions to help us understand your practice's needs. Your responses
          will customize the proposal with tailored recommendations and pricing.
        </p>
      </div>

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
