import { useState, useMemo, useEffect } from 'react'
import { Check, ChevronDown, ChevronUp, Calculator, FileText, Info, Save, GitBranch, Mail } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import { supabase } from '../../lib/supabase'
import styles from './QuoteWorksheet.module.css'

interface WorksheetItem {
  id: string
  name: string
  description: string
  hours: number
  price: number
  priceLabel?: string
}

interface WorksheetCategory {
  id: string
  name: string
  items: WorksheetItem[]
}

const phase1Categories: WorksheetCategory[] = [
  {
    id: 'design',
    name: 'Design & Development',
    items: [
      { id: 'website-design', name: 'Website Design (6 pages)', description: 'Home, Services, Our Doctors, Patient Forms, Doctor Referrals, Contact', hours: 24, price: 2400 },
      { id: 'responsive-dev', name: 'Responsive Development', description: 'Mobile, tablet, and desktop optimization', hours: 12, price: 1200 },
      { id: 'patient-forms', name: 'Patient Intake Forms (4 forms)', description: 'Registration, Medical History, Insurance, Consent', hours: 18, price: 1800 },
      { id: 'referral-form', name: 'Doctor Referral Form', description: 'Physician referral submission system', hours: 6, price: 600 },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & Security',
    items: [
      { id: 'ssl-security', name: 'Secure Database Setup', description: 'Form submissions, referral data storage', hours: 8, price: 800 },
      { id: 'hipaa-compliance', name: 'SSL Certificate & Security', description: 'HTTPS, secure form handling', hours: 2, price: 200 },
    ],
  },
  {
    id: 'bilingual',
    name: 'Bilingual Language Module (EN / ES-MX)',
    items: [
      { id: 'bilingual-translation', name: 'Translation Framework Setup', description: 'i18n architecture, language toggle, locale detection', hours: 6, price: 600 },
      { id: 'bilingual-toggle', name: 'Spanish (Mexico) Translation', description: 'All pages, navigation, forms, and UI elements translated to ES-MX', hours: 8, price: 800 },
      { id: 'bilingual-forms', name: 'Bilingual Form Support', description: 'Patient forms, referrals, and confirmation emails in both languages', hours: 4, price: 400 },
    ],
  },
  {
    id: 'hosting',
    name: 'AWS Hosting & Email Setup',
    items: [
      { id: 'hosting-setup', name: 'AWS Infrastructure Setup', description: 'S3, CloudFront, Lambda, Route 53, ACM, CloudWatch', hours: 8, price: 800 },
      { id: 'email-setup', name: 'Professional Email Setup', description: 'Google Workspace or AWS WorkMail for @meceyespecialists.com', hours: 2, price: 200 },
      { id: 'dns-config', name: 'DNS & Domain Configuration', description: 'Domain transfer/setup, SSL provisioning, CDN configuration', hours: 2, price: 200 },
    ],
  },
]

const addOns: WorksheetItem[] = [
  { id: 'ringcentral', name: 'RingCentral Integration', description: 'Click-to-call, scheduling widget, voicemail forms, SMS reminders', hours: 8, price: 800 },
  { id: 'nextech', name: 'Nextech EHR Integration', description: 'Nextech import formatting, API sync, patient portal linking', hours: 12, price: 1200 },
  { id: 'scheduling', name: 'Online Appointment Scheduling', description: 'Calendar interface, appointment types, automated confirmations', hours: 6, price: 600 },
  { id: 'patient-portal', name: 'Patient Portal Enhancement', description: 'Secure login, form history, appointment history, messaging', hours: 10, price: 1000 },
  { id: 'language-pack', name: 'Additional Language Pack', description: 'Full translation, RTL support, locale-specific formatting', hours: 12, price: 1200, priceLabel: '$1,200/lang' },
]

const monthlyServices: WorksheetItem[] = [
  { id: 'hosting-monthly', name: 'AWS Hosting Costs', description: 'S3, CloudFront, Lambda, Route 53 (estimated)', hours: 0, price: 38, priceLabel: '$25-50/mo' },
  { id: 'maintenance', name: 'Maintenance & Support', description: 'Updates, security patches, content changes, monitoring', hours: 2, price: 200, priceLabel: '$200/mo' },
  { id: 'email-service', name: 'Email Service', description: 'Google Workspace or AWS WorkMail per user', hours: 0, price: 7, priceLabel: '$6-7/mo' },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

export default function QuoteWorksheet() {
  const {
    proposalConfig,
    currentQuote,
    createQuote,
    saveQuoteCustomizations,
    createQuoteVersion
  } = useDiscovery()

  const [selected, setSelected] = useState<Set<string>>(() =>
    currentQuote?.customizations
      ? new Set(currentQuote.customizations.selectedPhase1)
      : new Set(proposalConfig.preSelectedPhase1)
  )
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(() =>
    currentQuote?.customizations
      ? new Set(currentQuote.customizations.selectedAddOns)
      : new Set(proposalConfig.preSelectedAddOns)
  )
  const [selectedMonthly, setSelectedMonthly] = useState<Set<string>>(() =>
    currentQuote?.customizations
      ? new Set(currentQuote.customizations.selectedMonthly)
      : new Set(proposalConfig.preSelectedMonthly)
  )
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => new Set(phase1Categories.map(c => c.id)))
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [practiceName, setPracticeName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [emailError, setEmailError] = useState('')

  const phase1VisMap = useMemo(() => new Map(
    proposalConfig.phase1Visibility.map((v) => [v.id, v])
  ), [proposalConfig.phase1Visibility])

  const addOnVisMap = useMemo(() => new Map(
    proposalConfig.addOnVisibility.map((v) => [v.id, v])
  ), [proposalConfig.addOnVisibility])

  useEffect(() => {
    if (currentQuote?.customizations) {
      setSelected(new Set(currentQuote.customizations.selectedPhase1))
      setSelectedAddOns(new Set(currentQuote.customizations.selectedAddOns))
      setSelectedMonthly(new Set(currentQuote.customizations.selectedMonthly))
    }
  }, [currentQuote])

  const hasChanges = useMemo(() => {
    if (!currentQuote?.customizations) return false

    const originalPhase1 = new Set(currentQuote.customizations.selectedPhase1)
    const originalAddOns = new Set(currentQuote.customizations.selectedAddOns)
    const originalMonthly = new Set(currentQuote.customizations.selectedMonthly)

    const phase1Changed = selected.size !== originalPhase1.size ||
      [...selected].some(id => !originalPhase1.has(id))
    const addOnsChanged = selectedAddOns.size !== originalAddOns.size ||
      [...selectedAddOns].some(id => !originalAddOns.has(id))
    const monthlyChanged = selectedMonthly.size !== originalMonthly.size ||
      [...selectedMonthly].some(id => !originalMonthly.has(id))

    return phase1Changed || addOnsChanged || monthlyChanged
  }, [currentQuote, selected, selectedAddOns, selectedMonthly])

  const matchesRecommended = useMemo(() => {
    if (!currentQuote) return true

    const recommendedPhase1 = new Set(proposalConfig.preSelectedPhase1)
    const recommendedAddOns = new Set(proposalConfig.preSelectedAddOns)
    const recommendedMonthly = new Set(proposalConfig.preSelectedMonthly)

    const phase1Match = selected.size === recommendedPhase1.size &&
      [...selected].every(id => recommendedPhase1.has(id))
    const addOnsMatch = selectedAddOns.size === recommendedAddOns.size &&
      [...selectedAddOns].every(id => recommendedAddOns.has(id))
    const monthlyMatch = selectedMonthly.size === recommendedMonthly.size &&
      [...selectedMonthly].every(id => recommendedMonthly.has(id))

    return phase1Match && addOnsMatch && monthlyMatch
  }, [currentQuote, proposalConfig, selected, selectedAddOns, selectedMonthly])

  const toggleItem = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleCategory = (category: WorksheetCategory) => {
    const visibleItems = category.items.filter(item => {
      const vis = phase1VisMap.get(item.id)
      return !vis || vis.visible
    })
    const allSelected = visibleItems.every(item => selected.has(item.id))
    setSelected(prev => {
      const next = new Set(prev)
      visibleItems.forEach(item => {
        if (allSelected) next.delete(item.id)
        else next.add(item.id)
      })
      return next
    })
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleMonthly = (id: string) => {
    setSelectedMonthly(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllPhase1 = () => {
    const allVisibleIds = new Set<string>()
    phase1Categories.forEach(cat => cat.items.forEach(item => {
      const vis = phase1VisMap.get(item.id)
      if (!vis || vis.visible) {
        allVisibleIds.add(item.id)
      }
    }))
    setSelected(allVisibleIds)
  }

  const clearAllPhase1 = () => setSelected(new Set())

  const { phase1Total, phase1Hours } = useMemo(() => {
    let total = 0
    let hours = 0
    phase1Categories.forEach(cat => cat.items.forEach(item => {
      const vis = phase1VisMap.get(item.id)
      const isVisible = !vis || vis.visible
      if (isVisible && selected.has(item.id)) {
        total += item.price
        hours += item.hours
      }
    }))
    return { phase1Total: total, phase1Hours: hours }
  }, [selected, phase1VisMap])

  const { addOnsTotal, addOnsHours } = useMemo(() => {
    let total = 0
    let hours = 0
    addOns.forEach(item => {
      if (selectedAddOns.has(item.id)) {
        total += item.price
        hours += item.hours
      }
    })
    return { addOnsTotal: total, addOnsHours: hours }
  }, [selectedAddOns])

  const monthlyTotal = useMemo(() => {
    let total = 0
    monthlyServices.forEach(item => {
      if (selectedMonthly.has(item.id)) total += item.price
    })
    return total
  }, [selectedMonthly])

  const handleSaveNewQuote = async () => {
    if (!practiceName.trim() || !contactEmail.trim()) {
      setSaveError('Please provide practice name and email')
      return
    }

    setSaving(true)
    setSaveError('')

    const quote = await createQuote(practiceName.trim(), contactEmail.trim())

    if (!quote) {
      setSaveError('Failed to create quote. Please try again.')
      setSaving(false)
      return
    }

    await saveQuoteCustomizations(
      Array.from(selected),
      Array.from(selectedAddOns),
      Array.from(selectedMonthly)
    )

    setSaving(false)
    setShowSaveDialog(false)
    setPracticeName('')
    setContactEmail('')
  }

  const handleUpdateQuote = async () => {
    if (!currentQuote) return

    setSaving(true)
    const success = await saveQuoteCustomizations(
      Array.from(selected),
      Array.from(selectedAddOns),
      Array.from(selectedMonthly)
    )

    setSaving(false)

    if (!success) {
      setSaveError('Failed to update quote. Please try again.')
    }
  }

  const handleSaveAsVersion = async () => {
    if (!currentQuote) return
    if (!practiceName.trim() || !contactEmail.trim()) {
      setSaveError('Please provide practice name and email')
      return
    }

    setSaving(true)
    setSaveError('')

    const newQuote = await createQuoteVersion(practiceName.trim(), contactEmail.trim())

    if (!newQuote) {
      setSaveError('Failed to create new version. Please try again.')
      setSaving(false)
      return
    }

    await saveQuoteCustomizations(
      Array.from(selected),
      Array.from(selectedAddOns),
      Array.from(selectedMonthly)
    )

    setSaving(false)
    setShowSaveDialog(false)
    setPracticeName('')
    setContactEmail('')
  }

  const handleEmailCustomQuote = async () => {
    if (!currentQuote) return

    setSendingEmail(true)
    setEmailError('')
    setEmailSuccess(false)

    await saveQuoteCustomizations(
      Array.from(selected),
      Array.from(selectedAddOns),
      Array.from(selectedMonthly)
    )

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

      setEmailSuccess(true)
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const oneTimeTotal = phase1Total + addOnsTotal
  const totalHours = phase1Hours + addOnsHours

  const phase1AllSelected = useMemo(() => {
    return phase1Categories.every(cat => {
      const visibleItems = cat.items.filter(item => {
        const vis = phase1VisMap.get(item.id)
        return !vis || vis.visible
      })
      return visibleItems.length > 0 && visibleItems.every(item => selected.has(item.id))
    })
  }, [selected, phase1VisMap])

  const phase1NoneSelected = useMemo(() => {
    return phase1Categories.every(cat => {
      const visibleItems = cat.items.filter(item => {
        const vis = phase1VisMap.get(item.id)
        return !vis || vis.visible
      })
      return visibleItems.length === 0 || visibleItems.every(item => !selected.has(item.id))
    })
  }, [selected, phase1VisMap])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Calculator size={24} />
        </div>
        <div>
          <h2 className={styles.heading}>Interactive Quote Builder</h2>
          <p className={styles.description}>
            Select the features you need to build your custom quote. Toggle items on or off to see how they affect pricing in real time.
          </p>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.worksheetCol}>
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.phaseBadge}>Phase 1</span>
                <h3>Core Website & Forms</h3>
              </div>
              <div className={styles.bulkActions}>
                <button
                  className={`${styles.bulkBtn} ${phase1AllSelected ? styles.bulkActive : ''}`}
                  onClick={selectAllPhase1}
                  disabled={phase1AllSelected}
                >
                  Select All
                </button>
                <button
                  className={`${styles.bulkBtn} ${phase1NoneSelected ? styles.bulkActive : ''}`}
                  onClick={clearAllPhase1}
                  disabled={phase1NoneSelected}
                >
                  Clear All
                </button>
              </div>
            </div>

            {phase1Categories.map(category => {
              const visibleItems = category.items.filter(item => {
                const vis = phase1VisMap.get(item.id)
                return !vis || vis.visible
              })

              if (visibleItems.length === 0) return null

              const catItemsSelected = visibleItems.filter(item => selected.has(item.id)).length
              const allCatSelected = catItemsSelected === visibleItems.length
              const someCatSelected = catItemsSelected > 0 && !allCatSelected
              const catTotal = visibleItems.reduce((sum, item) => selected.has(item.id) ? sum + item.price : sum, 0)
              const catHours = visibleItems.reduce((sum, item) => selected.has(item.id) ? sum + item.hours : sum, 0)
              const isExpanded = expandedCategories.has(category.id)

              return (
                <div key={category.id} className={styles.category}>
                  <div className={styles.categoryHeader} onClick={() => toggleExpand(category.id)}>
                    <div className={styles.categoryLeft}>
                      <button
                        className={`${styles.checkbox} ${allCatSelected ? styles.checked : ''} ${someCatSelected ? styles.partial : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleCategory(category) }}
                        aria-label={`Toggle ${category.name}`}
                      >
                        {(allCatSelected || someCatSelected) && <Check size={12} />}
                      </button>
                      <span className={styles.categoryName}>{category.name}</span>
                      <span className={styles.categoryCount}>
                        {catItemsSelected}/{visibleItems.length}
                      </span>
                    </div>
                    <div className={styles.categoryRight}>
                      {catHours > 0 && (
                        <span className={styles.categoryHours}>{catHours} hrs</span>
                      )}
                      <span className={styles.categoryTotal}>
                        {catTotal > 0 ? formatCurrency(catTotal) : '--'}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.categoryItems}>
                      {visibleItems.map(item => {
                        const isSelected = selected.has(item.id)
                        const vis = phase1VisMap.get(item.id)
                        const dimmed = vis && !vis.included && !isSelected
                        return (
                          <div
                            key={item.id}
                            className={`${styles.item} ${isSelected ? styles.itemSelected : ''} ${dimmed ? styles.itemDimmed : ''}`}
                            onClick={() => toggleItem(item.id)}
                          >
                            <div className={styles.itemLeft}>
                              <button
                                className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
                                aria-label={`Toggle ${item.name}`}
                              >
                                {isSelected && <Check size={12} />}
                              </button>
                              <div className={styles.itemInfo}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemDesc}>{item.description}</span>
                                {vis?.note && !isSelected && (
                                  <span className={styles.itemNote}>
                                    <Info size={11} /> {vis.note}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={styles.itemRight}>
                              <span className={`${styles.itemHours} ${isSelected ? styles.itemHoursActive : ''}`}>
                                {item.hours} hrs
                              </span>
                              <span className={`${styles.itemPrice} ${isSelected ? styles.itemPriceActive : ''}`}>
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.addOnBadge}>Phase 2+</span>
                <h3>Available Add-Ons</h3>
              </div>
            </div>

            <div className={styles.addOnGrid}>
              {addOns.map(addon => {
                const isSelected = selectedAddOns.has(addon.id)
                const vis = addOnVisMap.get(addon.id)
                const dimmed = vis && !vis.included && !isSelected
                return (
                  <div
                    key={addon.id}
                    className={`${styles.addOnCard} ${isSelected ? styles.addOnSelected : ''} ${dimmed ? styles.addOnDimmed : ''}`}
                    onClick={() => toggleAddOn(addon.id)}
                  >
                    <div className={styles.addOnTop}>
                      <button
                        className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
                        aria-label={`Toggle ${addon.name}`}
                      >
                        {isSelected && <Check size={12} />}
                      </button>
                      <div className={styles.addOnInfo}>
                        <span className={styles.addOnName}>{addon.name}</span>
                        <div className={styles.addOnMeta}>
                          <span className={styles.addOnHours}>{addon.hours} hrs</span>
                          <span className={styles.addOnPrice}>
                            {addon.priceLabel || formatCurrency(addon.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className={styles.addOnDesc}>{addon.description}</p>
                    {vis?.note && !isSelected && (
                      <p className={styles.addOnNote}><Info size={11} /> {vis.note}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <span className={styles.monthlyBadge}>Monthly</span>
                <h3>Ongoing Services (Optional)</h3>
              </div>
            </div>

            <div className={styles.monthlyList}>
              {monthlyServices.map(service => {
                const isSelected = selectedMonthly.has(service.id)
                return (
                  <div
                    key={service.id}
                    className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
                    onClick={() => toggleMonthly(service.id)}
                  >
                    <div className={styles.itemLeft}>
                      <button
                        className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
                        aria-label={`Toggle ${service.name}`}
                      >
                        {isSelected && <Check size={12} />}
                      </button>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{service.name}</span>
                        <span className={styles.itemDesc}>{service.description}</span>
                      </div>
                    </div>
                    <span className={`${styles.itemPrice} ${isSelected ? styles.itemPriceActive : ''}`}>
                      {service.priceLabel || formatCurrency(service.price)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FileText size={20} />
            </div>
            <h3 className={styles.summaryTitle}>Your Quote</h3>

            <div className={styles.summarySection}>
              <div className={styles.summaryRow}>
                <span>Core Website & Forms</span>
                <div className={styles.summaryAmountGroup}>
                  <span className={styles.summaryHours}>{phase1Hours} hrs</span>
                  <span className={styles.summaryAmount}>{formatCurrency(phase1Total)}</span>
                </div>
              </div>
              {addOnsTotal > 0 && (
                <div className={styles.summaryRow}>
                  <span>Add-Ons</span>
                  <div className={styles.summaryAmountGroup}>
                    <span className={styles.summaryHours}>{addOnsHours} hrs</span>
                    <span className={styles.summaryAmount}>{formatCurrency(addOnsTotal)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryTotalRow}>
              <span>One-Time Total</span>
              <div className={styles.summaryTotalGroup}>
                <span className={styles.summaryTotalHours}>{totalHours} hrs</span>
                <span className={styles.summaryTotal}>{formatCurrency(oneTimeTotal)}</span>
              </div>
            </div>

            {monthlyTotal > 0 && (
              <>
                <div className={styles.summaryDivider} />
                <div className={styles.summaryMonthlyRow}>
                  <span>Est. Monthly</span>
                  <span className={styles.summaryMonthly}>~{formatCurrency(monthlyTotal)}/mo</span>
                </div>
              </>
            )}

            <div className={styles.summaryDivider} />

            <div className={styles.depositSection}>
              <div className={styles.depositRow}>
                <span>50% Deposit to Start</span>
                <span className={styles.depositAmount}>{formatCurrency(Math.round(oneTimeTotal / 2))}</span>
              </div>
              <div className={styles.depositRow}>
                <span>Balance on Completion</span>
                <span className={styles.depositAmount}>{formatCurrency(oneTimeTotal - Math.round(oneTimeTotal / 2))}</span>
              </div>
            </div>

            <div className={styles.summaryNote}>
              Pricing is based on selected features. Final quote may be adjusted during consultation.
            </div>

            {currentQuote && (
              <>
                <div className={styles.summaryDivider} />
                <div className={styles.quoteNumberSection}>
                  <span className={styles.quoteLabel}>Quote Number:</span>
                  <span className={styles.quoteNumber}>{currentQuote.quote_number}</span>
                </div>
              </>
            )}

            {currentQuote && hasChanges && (
              <div className={styles.saveActions}>
                <button
                  onClick={handleUpdateQuote}
                  disabled={saving}
                  className={styles.updateButton}
                >
                  <Save size={16} />
                  {saving ? 'Updating...' : 'Update This Quote'}
                </button>
                <button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={saving}
                  className={styles.versionButton}
                >
                  <GitBranch size={16} />
                  Save as New Version
                </button>
              </div>
            )}

            {!currentQuote && (
              <button
                onClick={() => setShowSaveDialog(true)}
                className={styles.saveButton}
              >
                <Save size={16} />
                Save as New Quote
              </button>
            )}

            {saveError && (
              <div className={styles.saveError}>{saveError}</div>
            )}

            {currentQuote && !hasChanges && (
              <>
                <div className={styles.summaryDivider} />
                <div className={styles.customQuoteSection}>
                  {!matchesRecommended ? (
                    <>
                      <p className={styles.customQuoteMessage}>
                        Your selections differ from the recommended quote.
                      </p>
                      {emailSuccess ? (
                        <div className={styles.emailSuccessMessage}>
                          <Check size={16} />
                          Custom quote sent! Check your email.
                        </div>
                      ) : (
                        <button
                          onClick={handleEmailCustomQuote}
                          disabled={sendingEmail}
                          className={styles.emailCustomButton}
                        >
                          <Mail size={16} />
                          {sendingEmail ? 'Sending...' : 'Email My Custom Quote'}
                        </button>
                      )}
                      {emailError && (
                        <div className={styles.emailErrorMessage}>{emailError}</div>
                      )}
                    </>
                  ) : (
                    <div className={styles.matchMessage}>
                      <p className={styles.matchText}>
                        Your selections match the recommended quote.
                      </p>
                      <a href="#investment-summary" className={styles.matchLink}>
                        Accept it in the Investment Summary section
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showSaveDialog && (
        <div className={styles.dialogOverlay} onClick={() => setShowSaveDialog(false)}>
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.dialogTitle}>
              {currentQuote ? 'Save as New Version' : 'Save Quote'}
            </h3>
            <p className={styles.dialogDescription}>
              {currentQuote
                ? `Create a new version of ${currentQuote.quote_number}`
                : 'Create a new quote with your customizations'}
            </p>
            <div className={styles.dialogForm}>
              <div className={styles.formGroup}>
                <label htmlFor="practiceName">Practice Name</label>
                <input
                  id="practiceName"
                  type="text"
                  value={practiceName}
                  onChange={(e) => setPracticeName(e.target.value)}
                  placeholder="MEC Eye Specialists"
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className={styles.formInput}
                />
              </div>
              {saveError && (
                <div className={styles.dialogError}>{saveError}</div>
              )}
              <div className={styles.dialogActions}>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className={styles.cancelButton}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={currentQuote ? handleSaveAsVersion : handleSaveNewQuote}
                  className={styles.confirmButton}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
