import { useState } from 'react'
import { Check, Info, Mail } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import type { HostingOptionId } from '../../types/discovery'
import { supabase } from '../../lib/supabase'
import styles from './InvestmentSummary.module.css'

interface LineItem {
  id: string
  name: string
  description: string
  price?: string
}

interface LineGroup {
  category: string
  items: LineItem[]
  subtotal?: string
}

interface HostingLabels {
  categoryLabel: string
  setupName: string
  setupDescription: string
  monthlyLabel: string
  monthlyDescription: string
}

const HOSTING_LABELS: Record<HostingOptionId, HostingLabels> = {
  aws: {
    categoryLabel: 'AWS Hosting & Email Setup',
    setupName: 'AWS Infrastructure Setup',
    setupDescription: 'S3, CloudFront, Lambda, Route 53, ACM, CloudWatch',
    monthlyLabel: 'AWS Hosting Costs',
    monthlyDescription: 'S3, CloudFront, Lambda, Route 53 (estimated)',
  },
  gcp: {
    categoryLabel: 'Google Cloud Hosting & Email Setup',
    setupName: 'Google Cloud Infrastructure Setup',
    setupDescription: 'Cloud Storage, Cloud CDN, Cloud Functions, Cloud DNS, Certificate Manager',
    monthlyLabel: 'Google Cloud Hosting Costs',
    monthlyDescription: 'Cloud Storage, Cloud CDN, Cloud Functions (estimated)',
  },
  azure: {
    categoryLabel: 'Azure Hosting & Email Setup',
    setupName: 'Azure Infrastructure Setup',
    setupDescription: 'Blob Storage, Azure CDN, Azure Functions, Azure DNS, App Service',
    monthlyLabel: 'Azure Hosting Costs',
    monthlyDescription: 'Azure Storage, CDN, Functions, DNS (estimated)',
  },
  vercel: {
    categoryLabel: 'Vercel Hosting & Email Setup',
    setupName: 'Vercel Infrastructure Setup',
    setupDescription: 'Edge Network, Serverless Functions, Analytics, Custom Domains',
    monthlyLabel: 'Vercel Hosting Costs',
    monthlyDescription: 'Vercel Pro plan with serverless functions (estimated)',
  },
  traditional: {
    categoryLabel: 'Web Hosting & Email Setup',
    setupName: 'Web Hosting Setup',
    setupDescription: 'Shared/VPS hosting, SSL certificate, CDN, backup configuration',
    monthlyLabel: 'Web Hosting Costs',
    monthlyDescription: 'Hosting plan with SSL and CDN (estimated)',
  },
  custom: {
    categoryLabel: 'Custom Hosting & Email Setup',
    setupName: 'Custom Infrastructure Setup',
    setupDescription: 'Tailored hosting solution based on your specific requirements',
    monthlyLabel: 'Hosting Infrastructure Costs',
    monthlyDescription: 'Custom hosting solution (estimated)',
  },
}

function buildPhase1Groups(hostingProvider: HostingOptionId): LineGroup[] {
  const labels = HOSTING_LABELS[hostingProvider]

  return [
    {
      category: 'Design & Development',
      items: [
        { id: 'website-design', name: 'Website Design (6 pages)', description: 'Home, Services, Our Doctors, Patient Forms, Doctor Referrals, Contact', price: '$2,400' },
        { id: 'responsive-dev', name: 'Responsive Development', description: 'Mobile, tablet, and desktop optimization', price: '$1,200' },
        { id: 'patient-forms', name: 'Patient Intake Forms (4 forms)', description: 'Registration, Medical History, Insurance, Consent', price: '$1,800' },
        { id: 'referral-form', name: 'Doctor Referral Form', description: 'Physician referral submission system', price: '$600' },
      ],
      subtotal: '$6,000',
    },
    {
      category: 'Infrastructure & Security',
      items: [
        { id: 'ssl-security', name: 'Secure Database Setup', description: 'Form submissions, referral data storage', price: '$800' },
        { id: 'hipaa-compliance', name: 'SSL Certificate & Security', description: 'HTTPS, secure form handling', price: '$200' },
      ],
      subtotal: '$1,000',
    },
    {
      category: 'Bilingual Language Module (EN / ES-MX)',
      items: [
        { id: 'bilingual-translation', name: 'Translation Framework Setup', description: 'i18n architecture, language toggle, locale detection', price: '$600' },
        { id: 'bilingual-toggle', name: 'Spanish (Mexico) Translation', description: 'All pages, navigation, forms, and UI elements translated to ES-MX', price: '$800' },
        { id: 'bilingual-forms', name: 'Bilingual Form Support', description: 'Patient forms, referrals, and confirmation emails in both languages', price: '$400' },
      ],
      subtotal: '$1,800',
    },
    {
      category: labels.categoryLabel,
      items: [
        { id: 'hosting-setup', name: labels.setupName, description: labels.setupDescription, price: '$800' },
        { id: 'email-setup', name: 'Professional Email Setup', description: 'Google Workspace or AWS WorkMail for @meceyespecialists.com', price: '$200' },
        { id: 'dns-config', name: 'DNS & Domain Configuration', description: 'Domain transfer/setup, SSL provisioning, CDN configuration', price: '$200' },
      ],
      subtotal: '$1,200',
    },
  ]
}

interface AddOn {
  id: string
  name: string
  description: string
  price: string
  includes: string[]
}

const addOns: AddOn[] = [
  {
    id: 'ringcentral',
    name: 'RingCentral Integration',
    description: 'Deep integration with your existing phone and scheduling system.',
    price: '$800',
    includes: [
      'Click-to-call buttons throughout the site',
      'Embedded scheduling widget (if supported by plan)',
      'Voicemail and callback request forms',
      'SMS notification integration for appointment reminders',
    ],
  },
  {
    id: 'nextech',
    name: 'Nextech EHR Integration',
    description: 'Connect the website directly to your practice management system.',
    price: '$1,200',
    includes: [
      'Form submissions formatted for Nextech import',
      'Referral data structured for patient intake',
      'API integration for automated data sync',
      'Patient portal deep linking',
    ],
  },
  {
    id: 'scheduling',
    name: 'Online Appointment Scheduling',
    description: 'Let patients book appointments directly from the website.',
    price: '$600',
    includes: [
      'Calendar-based scheduling interface',
      'Appointment type selection',
      'Automated confirmation emails',
      'Integration with existing scheduling workflow',
    ],
  },
  {
    id: 'patient-portal',
    name: 'Patient Portal Enhancement',
    description: 'Secure patient login for records access and communication.',
    price: '$1,000',
    includes: [
      'Secure patient login system',
      'Form submission history',
      'Appointment history view',
      'Secure messaging with the practice',
    ],
  },
  {
    id: 'language-pack',
    name: 'Additional Language Pack',
    description: 'Expand your site beyond English and Spanish with additional language support. Per-language pricing.',
    price: '$1,200/lang',
    includes: [
      'Full translation of all pages, forms, and UI elements',
      'RTL (right-to-left) support for applicable languages (Arabic, Hebrew, etc.)',
      'Locale-specific date, number, and currency formatting',
      'Proven framework supporting up to 11+ languages (see csvlasik.com reference)',
    ],
  },
]

interface MonthlyItem {
  id: string
  name: string
  description: string
  price: string
}

function buildMonthlyItems(hostingProvider: HostingOptionId): MonthlyItem[] {
  const labels = HOSTING_LABELS[hostingProvider]

  return [
    { id: 'hosting-monthly', name: labels.monthlyLabel, description: labels.monthlyDescription, price: '$25-50/mo' },
    { id: 'maintenance-monthly', name: 'Maintenance & Support', description: 'Updates, security patches, content changes, monitoring', price: '$200/mo' },
    { id: 'email-monthly', name: 'Email Service', description: 'Google Workspace or AWS WorkMail per user', price: '$6-7/mo' },
  ]
}

function PriceTable({
  groups,
  visibilityMap,
}: {
  groups: LineGroup[]
  visibilityMap: Map<string, { visible: boolean; included: boolean; note?: string }>
}) {
  return (
    <div className={styles.table}>
      {groups.map((group) => {
        const visibleItems = group.items.filter((item) => {
          const vis = visibilityMap.get(item.id)
          return !vis || vis.visible
        })
        if (visibleItems.length === 0) return null

        return (
          <div key={group.category} className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupName}>{group.category}</span>
              {group.subtotal && (
                <span className={styles.subtotal}>{group.subtotal}</span>
              )}
            </div>
            {visibleItems.map((item) => {
              const vis = visibilityMap.get(item.id)
              const dimmed = vis && !vis.included
              return (
                <div key={item.id} className={`${styles.row} ${dimmed ? styles.rowDimmed : ''}`}>
                  <div className={styles.rowContent}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemDesc}>{item.description}</span>
                    {vis?.note && (
                      <span className={styles.itemNote}>
                        <Info size={11} /> {vis.note}
                      </span>
                    )}
                  </div>
                  {item.price && (
                    <span className={styles.price}>{item.price}</span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function InvestmentSummary() {
  const { proposalConfig, currentQuote } = useDiscovery()
  const [acceptChecked, setAcceptChecked] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  const hostingProvider = proposalConfig.recommendedHosting
  const phase1Groups = buildPhase1Groups(hostingProvider)
  const monthlyItemsData = buildMonthlyItems(hostingProvider)

  const phase1Map = new Map(
    proposalConfig.phase1Visibility.map((v) => [v.id, v])
  )
  const addOnMap = new Map(
    proposalConfig.addOnVisibility.map((v) => [v.id, v])
  )
  const monthlyMap = new Map(
    proposalConfig.monthlyVisibility.map((v) => [v.id, v])
  )

  const visibleMonthly = monthlyItemsData.filter((item) => {
    const vis = monthlyMap.get(item.id)
    return !vis || vis.visible
  })

  const monthlyGroup: LineGroup = {
    category: 'Ongoing Monthly (Optional)',
    items: visibleMonthly.map((m) => ({ id: m.id, name: m.name, description: m.description, price: m.price })),
  }

  const handleEmailQuote = async () => {
    if (!currentQuote) return

    setSending(true)
    setSendError('')
    setSendSuccess(false)

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote_id: currentQuote.id }),
      })

      const result = await response.json()

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to send email')
      }

      await supabase
        .from('quotes')
        .update({ status: 'sent' })
        .eq('id', currentQuote.id)

      setSendSuccess(true)
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="investment-summary" className={styles.section}>
      <h2 className={styles.heading}>Investment Summary</h2>
      <p className={styles.description}>
        We use a phased approach so you only pay for what you need now, with the
        flexibility to add features as your practice grows.
      </p>

      <div className={styles.phaseBlock}>
        <div className={styles.phaseLabel}>
          <span className={styles.phaseBadge}>Phase 1</span>
          <h3 className={styles.phaseTitle}>Core Website & Forms</h3>
          <p className={styles.phaseDesc}>
            Everything needed to launch your new website: professional design,
            patient intake forms, referral system, hosting, security, and full
            bilingual support in English and Mexican Spanish.
          </p>
        </div>

        <PriceTable groups={phase1Groups} visibilityMap={phase1Map} />

        <div className={styles.totalBar}>
          <span className={styles.totalLabel}>Phase 1 Total</span>
          <span className={styles.totalAmount}>$10,000</span>
        </div>
      </div>

      <div className={styles.addOnsBlock}>
        <div className={styles.phaseLabel}>
          <span className={styles.addOnBadge}>Phase 2+</span>
          <h3 className={styles.phaseTitle}>Available Add-Ons</h3>
          <p className={styles.phaseDesc}>
            Enhance your website over time with these integrations and features.
            Each can be added independently whenever you're ready.
          </p>
        </div>

        <div className={styles.addOnGrid}>
          {addOns.map((addon) => {
            const vis = addOnMap.get(addon.id)
            const dimmed = vis && !vis.included
            const hidden = vis && !vis.visible
            if (hidden) return null

            return (
              <div key={addon.id} className={`${styles.addOnCard} ${dimmed ? styles.addOnCardDimmed : ''}`}>
                <div className={styles.addOnHeader}>
                  <h4 className={styles.addOnName}>{addon.name}</h4>
                  <span className={styles.addOnPrice}>{addon.price}</span>
                </div>
                <p className={styles.addOnDesc}>{addon.description}</p>
                {vis?.note && (
                  <p className={styles.addOnNote}>
                    <Info size={12} /> {vis.note}
                  </p>
                )}
                <ul className={styles.addOnIncludes}>
                  {addon.includes.map((item) => (
                    <li key={item}>
                      <Check size={12} className={styles.addOnCheck} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.monthlyBlock}>
        <PriceTable groups={[monthlyGroup]} visibilityMap={monthlyMap} />
      </div>

      <div className={styles.note}>
        <p>
          Phase 1 includes everything needed for a complete, functional website
          with full English and Mexican Spanish language support.
          Add-ons can be purchased at any time after launch, including additional
          language packs at $1,200 per language. Monthly costs are
          optional and billed separately. A 50% deposit is required to begin
          Phase 1, with the remaining balance due upon completion.
        </p>
      </div>

      <div className={styles.nextSteps}>
        <h3 className={styles.nextTitle}>Next Steps</h3>
        <ol className={styles.stepsList}>
          <li>Review this proposal and the interactive mockup</li>
          <li>Discuss any changes to scope, features, or pricing</li>
          <li>Approve proposal and submit deposit to begin Phase 1</li>
          <li>Provide content (doctor bios, service details, photos)</li>
          <li>Begin development with milestone check-ins</li>
          <li>Review, test, and launch</li>
          <li>Explore Phase 2 add-ons based on your needs</li>
        </ol>
      </div>

      {currentQuote && (
        <div className={styles.acceptanceBlock}>
          <div className={styles.acceptanceHeader}>
            <h3 className={styles.acceptanceTitle}>Accept Recommended Quote</h3>
            <p className={styles.acceptanceDesc}>
              If the recommended configuration meets your needs, accept and email this quote to begin.
            </p>
          </div>

          <div className={styles.acceptanceCheckbox}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={acceptChecked}
                onChange={(e) => setAcceptChecked(e.target.checked)}
                className={styles.checkbox}
              />
              <span>
                I accept the recommended solution as quoted ({currentQuote.quote_number})
              </span>
            </label>
          </div>

          {acceptChecked && (
            <div className={styles.emailSection}>
              <div className={styles.emailFields}>
                <div className={styles.emailField}>
                  <label>Practice Name</label>
                  <input
                    type="text"
                    value={currentQuote.practice_name}
                    disabled
                    className={styles.emailInput}
                  />
                </div>
                <div className={styles.emailField}>
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={currentQuote.contact_email}
                    disabled
                    className={styles.emailInput}
                  />
                </div>
              </div>

              {sendSuccess ? (
                <div className={styles.successMessage}>
                  <Check size={16} />
                  Quote sent successfully! Check your email for details.
                </div>
              ) : (
                <button
                  onClick={handleEmailQuote}
                  disabled={sending}
                  className={styles.emailButton}
                >
                  <Mail size={16} />
                  {sending ? 'Sending...' : 'Email My Quote'}
                </button>
              )}

              {sendError && (
                <div className={styles.errorMessage}>{sendError}</div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
