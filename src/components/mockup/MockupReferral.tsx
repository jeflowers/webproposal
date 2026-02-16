import { useState } from 'react'
import { Send, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupReferral.module.css'

interface ReferralData {
  physician_name: string
  practice_name: string
  physician_phone: string
  physician_fax: string
  patient_name: string
  patient_dob: string
  patient_phone: string
  urgency_level: string
  reason_for_referral: string
}

const emptyReferral: ReferralData = {
  physician_name: '', practice_name: '', physician_phone: '', physician_fax: '',
  patient_name: '', patient_dob: '', patient_phone: '', urgency_level: '',
  reason_for_referral: '',
}

export default function MockupReferral() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<ReferralData>(emptyReferral)

  const set = (field: keyof ReferralData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { error } = await supabase.from('doctor_referrals').insert({
        ...data,
        patient_dob: data.patient_dob || null,
      })
      if (error) throw error

      setData(emptyReferral)
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
    <section id="referrals" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.info}>
            <span className={styles.label}>{t.referral.label}</span>
            <h2 className={styles.heading}>{t.referral.heading}</h2>
            <p className={styles.text}>{t.referral.text}</p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureNum}>01</span>
                <div>
                  <h4 className={styles.featureTitle}>{t.referral.step1Title}</h4>
                  <p className={styles.featureDesc}>{t.referral.step1Desc}</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureNum}>02</span>
                <div>
                  <h4 className={styles.featureTitle}>{t.referral.step2Title}</h4>
                  <p className={styles.featureDesc}>{t.referral.step2Desc}</p>
                </div>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureNum}>03</span>
                <div>
                  <h4 className={styles.featureTitle}>{t.referral.step3Title}</h4>
                  <p className={styles.featureDesc}>{t.referral.step3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formWrap}>
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <Check size={32} />
                </div>
                <h3>{t.referral.successTitle}</h3>
                <p>{t.referral.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>{t.referral.formTitle}</h3>

                <div className={styles.formSection}>
                  <h4 className={styles.sectionTitle}>{t.referral.referringPhysician}</h4>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.physicianName}</label>
                      <input type="text" className={styles.input} placeholder={t.referral.placeholderDoctor} value={data.physician_name} onChange={e => set('physician_name', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.practiceName}</label>
                      <input type="text" className={styles.input} placeholder={t.referral.placeholderPractice} value={data.practice_name} onChange={e => set('practice_name', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.contact.phoneTitle}</label>
                      <input type="tel" className={styles.input} placeholder={t.referral.placeholderPhone} value={data.physician_phone} onChange={e => set('physician_phone', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.fax}</label>
                      <input type="tel" className={styles.input} placeholder={t.referral.placeholderFax} value={data.physician_fax} onChange={e => set('physician_fax', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h4 className={styles.sectionTitle}>{t.referral.patientInfo}</h4>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.patientName}</label>
                      <input type="text" className={styles.input} placeholder={t.referral.placeholderPatient} value={data.patient_name} onChange={e => set('patient_name', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.forms.dob}</label>
                      <input type="date" className={styles.input} value={data.patient_dob} onChange={e => set('patient_dob', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.patientPhone}</label>
                      <input type="tel" className={styles.input} placeholder={t.referral.placeholderPatientPhone} value={data.patient_phone} onChange={e => set('patient_phone', e.target.value)} />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>{t.referral.urgency}</label>
                      <select className={styles.input} value={data.urgency_level} onChange={e => set('urgency_level', e.target.value)}>
                        <option value="">{t.referral.selectUrgency}</option>
                        <option value="routine">{t.referral.routine}</option>
                        <option value="urgent">{t.referral.urgent}</option>
                        <option value="emergent">{t.referral.emergent}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel}>{t.referral.reasonForReferral}</label>
                  <textarea className={styles.textarea} placeholder={t.referral.placeholderReason} rows={4} value={data.reason_for_referral} onChange={e => set('reason_for_referral', e.target.value)} />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? <Loader2 size={16} className={styles.spinner} /> : <Send size={16} />}
                  {submitting ? t.referral.submitting : t.referral.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
