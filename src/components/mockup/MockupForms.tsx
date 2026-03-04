import { useState } from 'react'
import { FileText, ClipboardList, Shield, CreditCard, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupForms.module.css'

type FormType = 'registration' | 'medical' | 'insurance' | 'consent'

interface RegistrationData {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
  street_address: string
  city: string
  state: string
  zip: string
  reason_for_visit: string
}

interface MedicalData {
  eye_conditions: string
  previous_surgeries: string
  current_medications: string
  drug_allergies: string
  has_diabetes: string
  family_eye_disease: string
}

interface InsuranceData {
  insurance_provider: string
  policy_number: string
  group_number: string
  policyholder_name: string
  relationship_to_patient: string
  secondary_insurance: string
}

interface ConsentData {
  hipaa_acknowledged: boolean
  treatment_consent: boolean
  signature_name: string
  signature_date: string
}

const emptyRegistration: RegistrationData = {
  first_name: '', last_name: '', date_of_birth: '', phone: '', email: '',
  street_address: '', city: '', state: '', zip: '', reason_for_visit: '',
}

const emptyMedical: MedicalData = {
  eye_conditions: '', previous_surgeries: '', current_medications: '',
  drug_allergies: '', has_diabetes: '', family_eye_disease: '',
}

const emptyInsurance: InsuranceData = {
  insurance_provider: '', policy_number: '', group_number: '',
  policyholder_name: '', relationship_to_patient: '', secondary_insurance: '',
}

const emptyConsent: ConsentData = {
  hipaa_acknowledged: false, treatment_consent: false,
  signature_name: '', signature_date: '',
}

export default function MockupForms() {
  const { t } = useLanguage()
  const [activeForm, setActiveForm] = useState<FormType>('registration')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [registration, setRegistration] = useState<RegistrationData>(emptyRegistration)
  const [medical, setMedical] = useState<MedicalData>(emptyMedical)
  const [insurance, setInsurance] = useState<InsuranceData>(emptyInsurance)
  const [consent, setConsent] = useState<ConsentData>(emptyConsent)

  const formTabs = [
    { id: 'registration' as FormType, label: t.forms.tabRegistration, icon: FileText },
    { id: 'medical' as FormType, label: t.forms.tabMedical, icon: ClipboardList },
    { id: 'insurance' as FormType, label: t.forms.tabInsurance, icon: CreditCard },
    { id: 'consent' as FormType, label: t.forms.tabConsent, icon: Shield },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (activeForm === 'registration') {
        const { error } = await supabase.from('patient_registrations').insert({
          ...registration,
          date_of_birth: registration.date_of_birth || null,
        })
        if (error) throw error
        setRegistration(emptyRegistration)
      } else if (activeForm === 'medical') {
        const { error } = await supabase.from('medical_histories').insert({
          ...medical,
        })
        if (error) throw error
        setMedical(emptyMedical)
      } else if (activeForm === 'insurance') {
        const { error } = await supabase.from('insurance_info').insert({
          ...insurance,
        })
        if (error) throw error
        setInsurance(emptyInsurance)
      } else if (activeForm === 'consent') {
        const { error } = await supabase.from('consent_forms').insert({
          ...consent,
          signature_date: consent.signature_date || null,
        })
        if (error) throw error
        setConsent(emptyConsent)
      }

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="forms" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{t.forms.label}</span>
          <h2 className={styles.heading}>{t.forms.heading}</h2>
          <p className={styles.subheading}>{t.forms.subheading}</p>
        </div>

        <div className={styles.formArea}>
          <div className={styles.tabs}>
            {formTabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeForm === tab.id ? styles.tabActive : ''}`}
                onClick={() => { setActiveForm(tab.id); setSubmitted(false); setError('') }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className={styles.formContent}>
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <Check size={32} />
                </div>
                <h3>{t.forms.successTitle}</h3>
                <p>{t.forms.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {activeForm === 'registration' && (
                  <RegistrationForm data={registration} onChange={setRegistration} />
                )}
                {activeForm === 'medical' && (
                  <MedicalHistoryForm data={medical} onChange={setMedical} />
                )}
                {activeForm === 'insurance' && (
                  <InsuranceForm data={insurance} onChange={setInsurance} />
                )}
                {activeForm === 'consent' && (
                  <ConsentForm data={consent} onChange={setConsent} />
                )}
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting && <Loader2 size={16} className={styles.spinner} />}
                  {submitting ? t.forms.submitting : t.forms.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function RegistrationForm({ data, onChange }: { data: RegistrationData; onChange: (d: RegistrationData) => void }) {
  const { t } = useLanguage()
  const set = (field: keyof RegistrationData, value: string) =>
    onChange({ ...data, [field]: value })

  return (
    <div className={styles.formGrid}>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.firstName}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderFirstName} value={data.first_name} onChange={e => set('first_name', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.lastName}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderLastName} value={data.last_name} onChange={e => set('last_name', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.dob}</label>
        <input type="date" className={styles.input} value={data.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.phone}</label>
        <input type="tel" className={styles.input} placeholder={t.forms.placeholderPhone} value={data.phone} onChange={e => set('phone', e.target.value)} />
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.email}</label>
        <input type="email" className={styles.input} placeholder={t.forms.placeholderEmail} value={data.email} onChange={e => set('email', e.target.value)} />
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.streetAddress}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderStreet} value={data.street_address} onChange={e => set('street_address', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.city}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderCity} value={data.city} onChange={e => set('city', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.stateZip}</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="text" className={styles.input} placeholder={t.forms.placeholderState} style={{ flex: 1 }} value={data.state} onChange={e => set('state', e.target.value)} />
          <input type="text" className={styles.input} placeholder={t.forms.placeholderZip} style={{ width: 100 }} value={data.zip} onChange={e => set('zip', e.target.value)} />
        </div>
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.reasonForVisit}</label>
        <textarea className={styles.textarea} placeholder={t.forms.placeholderReason} rows={3} value={data.reason_for_visit} onChange={e => set('reason_for_visit', e.target.value)} />
      </div>
    </div>
  )
}

function MedicalHistoryForm({ data, onChange }: { data: MedicalData; onChange: (d: MedicalData) => void }) {
  const { t } = useLanguage()
  const set = (field: keyof MedicalData, value: string) =>
    onChange({ ...data, [field]: value })

  return (
    <div className={styles.formGrid}>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.eyeConditions}</label>
        <textarea className={styles.textarea} placeholder={t.forms.placeholderEyeConditions} rows={2} value={data.eye_conditions} onChange={e => set('eye_conditions', e.target.value)} />
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.previousSurgeries}</label>
        <textarea className={styles.textarea} placeholder={t.forms.placeholderSurgeries} rows={2} value={data.previous_surgeries} onChange={e => set('previous_surgeries', e.target.value)} />
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.currentMedications}</label>
        <textarea className={styles.textarea} placeholder={t.forms.placeholderMedications} rows={2} value={data.current_medications} onChange={e => set('current_medications', e.target.value)} />
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.drugAllergies}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderAllergies} value={data.drug_allergies} onChange={e => set('drug_allergies', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.hasDiabetes}</label>
        <select className={styles.input} value={data.has_diabetes} onChange={e => set('has_diabetes', e.target.value)}>
          <option value="">{t.forms.select}</option>
          <option value="no">{t.forms.no}</option>
          <option value="type1">{t.forms.type1}</option>
          <option value="type2">{t.forms.type2}</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.familyEyeDisease}</label>
        <select className={styles.input} value={data.family_eye_disease} onChange={e => set('family_eye_disease', e.target.value)}>
          <option value="">{t.forms.select}</option>
          <option value="no">{t.forms.no}</option>
          <option value="glaucoma">{t.forms.glaucoma}</option>
          <option value="macular">{t.forms.macularDegen}</option>
          <option value="other">{t.forms.other}</option>
        </select>
      </div>
    </div>
  )
}

function InsuranceForm({ data, onChange }: { data: InsuranceData; onChange: (d: InsuranceData) => void }) {
  const { t } = useLanguage()
  const set = (field: keyof InsuranceData, value: string) =>
    onChange({ ...data, [field]: value })

  return (
    <div className={styles.formGrid}>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.insuranceProvider}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderInsurance} value={data.insurance_provider} onChange={e => set('insurance_provider', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.policyNumber}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderPolicy} value={data.policy_number} onChange={e => set('policy_number', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.groupNumber}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderGroup} value={data.group_number} onChange={e => set('group_number', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.policyholderName}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderPolicyholder} value={data.policyholder_name} onChange={e => set('policyholder_name', e.target.value)} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.relationship}</label>
        <select className={styles.input} value={data.relationship_to_patient} onChange={e => set('relationship_to_patient', e.target.value)}>
          <option value="">{t.forms.select}</option>
          <option value="self">{t.forms.self}</option>
          <option value="spouse">{t.forms.spouse}</option>
          <option value="parent">{t.forms.parent}</option>
          <option value="other">{t.forms.other}</option>
        </select>
      </div>
      <div className={styles.fieldGroupFull}>
        <label className={styles.fieldLabel}>{t.forms.secondaryInsurance}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderSecondary} value={data.secondary_insurance} onChange={e => set('secondary_insurance', e.target.value)} />
      </div>
    </div>
  )
}

function ConsentForm({ data, onChange }: { data: ConsentData; onChange: (d: ConsentData) => void }) {
  const { t } = useLanguage()

  return (
    <div className={styles.formGrid}>
      <div className={styles.fieldGroupFull}>
        <div className={styles.consentBlock}>
          <h4 className={styles.consentTitle}>{t.forms.hipaaTitle}</h4>
          <p className={styles.consentText}>{t.forms.hipaaText}</p>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={data.hipaa_acknowledged} onChange={e => onChange({ ...data, hipaa_acknowledged: e.target.checked })} />
            <span>{t.forms.hipaaCheck}</span>
          </label>
        </div>
      </div>
      <div className={styles.fieldGroupFull}>
        <div className={styles.consentBlock}>
          <h4 className={styles.consentTitle}>{t.forms.consentTitle}</h4>
          <p className={styles.consentText}>{t.forms.consentText}</p>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={data.treatment_consent} onChange={e => onChange({ ...data, treatment_consent: e.target.checked })} />
            <span>{t.forms.consentCheck}</span>
          </label>
        </div>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.signatureName}</label>
        <input type="text" className={styles.input} placeholder={t.forms.placeholderSignature} value={data.signature_name} onChange={e => onChange({ ...data, signature_name: e.target.value })} />
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.fieldLabel}>{t.forms.signatureDate}</label>
        <input type="date" className={styles.input} value={data.signature_date} onChange={e => onChange({ ...data, signature_date: e.target.value })} />
      </div>
    </div>
  )
}
