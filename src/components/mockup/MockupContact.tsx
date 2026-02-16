import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, ExternalLink, Check, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './MockupContact.module.css'

interface ContactData {
  name: string
  phone: string
  email: string
  subject: string
  message: string
}

const emptyContact: ContactData = {
  name: '', phone: '', email: '', subject: '', message: '',
}

export default function MockupContact() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<ContactData>(emptyContact)

  const set = (field: keyof ContactData, value: string) =>
    setData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { error } = await supabase.from('contact_messages').insert(data)
      if (error) throw error

      setData(emptyContact)
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
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>{t.contact.label}</span>
          <h2 className={styles.heading}>{t.contact.heading}</h2>
          <p className={styles.subheading}>{t.contact.subheading}</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <Phone size={18} className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoTitle}>{t.contact.phoneTitle}</h4>
                <a href="tel:8442115462" className={styles.infoValue}>(844) 211-5462</a>
                <p className={styles.infoNote}>{t.contact.poweredBy}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <Mail size={18} className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoTitle}>{t.contact.emailTitle}</h4>
                <a href="mailto:info@meceyespecialists.com" className={styles.infoValue}>
                  info@meceyespecialists.com
                </a>
              </div>
            </div>

            <div className={styles.infoCard}>
              <MapPin size={18} className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoTitle}>{t.contact.locationTitle}</h4>
                <p className={styles.infoValue}>{t.contact.locationValue}</p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <Clock size={18} className={styles.infoIcon} />
              <div>
                <h4 className={styles.infoTitle}>{t.contact.hoursTitle}</h4>
                <p className={styles.infoValue}>{t.contact.hoursWeekday}</p>
                <p className={styles.infoNote}>{t.contact.hoursWeekend}</p>
              </div>
            </div>

            <div className={styles.portalLinks}>
              <a href="#" className={styles.portalLink}>
                <ExternalLink size={14} />
                {t.contact.portalLink}
              </a>
              <a href="#" className={styles.portalLink}>
                <ExternalLink size={14} />
                {t.contact.billPayLink}
              </a>
            </div>
          </div>

          <div className={styles.formCol}>
            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>
                  <Check size={32} />
                </div>
                <h3>{t.contact.successTitle}</h3>
                <p>{t.contact.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>{t.contact.formTitle}</h3>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>{t.contact.name}</label>
                    <input type="text" className={styles.input} placeholder={t.contact.placeholderName} value={data.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>{t.contact.phone}</label>
                    <input type="tel" className={styles.input} placeholder={t.contact.placeholderPhone} value={data.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>{t.contact.email}</label>
                  <input type="email" className={styles.input} placeholder={t.contact.placeholderEmail} value={data.email} onChange={e => set('email', e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>{t.contact.subject}</label>
                  <select className={styles.input} value={data.subject} onChange={e => set('subject', e.target.value)}>
                    <option value="">{t.contact.selectTopic}</option>
                    <option value="appointment">{t.contact.appointment}</option>
                    <option value="billing">{t.contact.billing}</option>
                    <option value="records">{t.contact.records}</option>
                    <option value="general">{t.contact.general}</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel}>{t.contact.message}</label>
                  <textarea className={styles.textarea} placeholder={t.contact.placeholderMessage} rows={4} value={data.message} onChange={e => set('message', e.target.value)} />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting && <Loader2 size={16} className={styles.spinner} />}
                  {submitting ? t.contact.submitting : t.contact.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
