import { useState, useMemo } from 'react'
import { Check, Info, Mail } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import {
  getPhase1Categories,
  ADD_ONS,
  ADD_ON_DESCRIPTIONS,
  ADD_ON_INCLUDES,
  getMonthlyServices,
  formatCurrency,
} from '../../data/pricingData'
import type { PricingCategory, PricingItem } from '../../data/pricingData'
import type { LineItemVisibility } from '../../types/discovery'
import { supabase } from '../../lib/supabase'
import styles from './InvestmentSummary.module.css'

function PriceTable({
  groups,
  visibilityMap,
  selectedIds,
}: {
  groups: PricingCategory[]
  visibilityMap: Map<string, LineItemVisibility>
  selectedIds: Set<string>
}) {
  return (
    <div className={styles.table}>
      {groups.map((group) => {
        const displayItems = group.items.filter((item) => {
          const vis = visibilityMap.get(item.id)
          const isVisible = !vis || vis.visible
          return isVisible && selectedIds.has(item.id)
        })
        if (displayItems.length === 0) return null

        const subtotal = displayItems.reduce((sum, item) => sum + item.price, 0)

        return (
          <div key={group.id} className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupName}>{group.name}</span>
              <span className={styles.subtotal}>{formatCurrency(subtotal)}</span>
            </div>
            {displayItems.map((item) => {
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
                  <span className={styles.price}>{formatCurrency(item.price)}</span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function MonthlyTable({
  items,
  visibilityMap,
  selectedIds,
}: {
  items: PricingItem[]
  visibilityMap: Map<string, LineItemVisibility>
  selectedIds: Set<string>
}) {
  const displayItems = items.filter((item) => {
    const vis = visibilityMap.get(item.id)
    const isVisible = !vis || vis.visible
    return isVisible && selectedIds.has(item.id)
  })

  if (displayItems.length === 0) return null

  return (
    <div className={styles.table}>
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <span className={styles.groupName}>Ongoing Monthly (Optional)</span>
        </div>
        {displayItems.map((item) => (
          <div key={item.id} className={styles.row}>
            <div className={styles.rowContent}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemDesc}>{item.description}</span>
            </div>
            <span className={styles.price}>{item.priceLabel || formatCurrency(item.price)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function InvestmentSummary() {
  const { proposalConfig, currentQuote, activeSelections } = useDiscovery()
  const [acceptChecked, setAcceptChecked] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sendSuccess, setSendSuccess] = useState(false)

  const hostingProvider = proposalConfig.recommendedHosting
  const phase1Categories = useMemo(() => getPhase1Categories(hostingProvider), [hostingProvider])
  const monthlyServices = useMemo(() => getMonthlyServices(hostingProvider), [hostingProvider])

  const phase1Map = useMemo(
    () => new Map(proposalConfig.phase1Visibility.map((v) => [v.id, v])),
    [proposalConfig.phase1Visibility]
  )
  const addOnMap = useMemo(
    () => new Map(proposalConfig.addOnVisibility.map((v) => [v.id, v])),
    [proposalConfig.addOnVisibility]
  )
  const monthlyMap = useMemo(
    () => new Map(proposalConfig.monthlyVisibility.map((v) => [v.id, v])),
    [proposalConfig.monthlyVisibility]
  )

  const { phase1Total, phase1Hours } = useMemo(() => {
    let total = 0
    let hours = 0
    phase1Categories.forEach((cat) =>
      cat.items.forEach((item) => {
        const vis = phase1Map.get(item.id)
        const isVisible = !vis || vis.visible
        if (isVisible && activeSelections.selectedPhase1.has(item.id)) {
          total += item.price
          hours += item.hours
        }
      })
    )
    return { phase1Total: total, phase1Hours: hours }
  }, [activeSelections.selectedPhase1, phase1Categories, phase1Map])

  const addOnsTotal = useMemo(() => {
    let total = 0
    ADD_ONS.forEach((item) => {
      if (activeSelections.selectedAddOns.has(item.id)) total += item.price
    })
    return total
  }, [activeSelections.selectedAddOns])

  const monthlyTotal = useMemo(() => {
    let total = 0
    monthlyServices.forEach((item) => {
      if (activeSelections.selectedMonthly.has(item.id)) total += item.price
    })
    return total
  }, [activeSelections.selectedMonthly, monthlyServices])

  const oneTimeTotal = phase1Total + addOnsTotal

  const selectedAddOnsList = useMemo(
    () => ADD_ONS.filter((a) => activeSelections.selectedAddOns.has(a.id)),
    [activeSelections.selectedAddOns]
  )

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

  const hasPhase1Items = phase1Categories.some((cat) =>
    cat.items.some((item) => {
      const vis = phase1Map.get(item.id)
      const isVisible = !vis || vis.visible
      return isVisible && activeSelections.selectedPhase1.has(item.id)
    })
  )

  return (
    <section id="investment-summary" className={styles.section}>
      <h2 className={styles.heading}>Investment Summary</h2>
      <p className={styles.description}>
        We use a phased approach so you only pay for what you need now, with the
        flexibility to add features as your practice grows.
      </p>

      {hasPhase1Items && (
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

          <PriceTable
            groups={phase1Categories}
            visibilityMap={phase1Map}
            selectedIds={activeSelections.selectedPhase1}
          />

          <div className={styles.totalBar}>
            <div className={styles.totalLeft}>
              <span className={styles.totalLabel}>Phase 1 Total</span>
              <span className={styles.totalHoursLabel}>{phase1Hours} hours</span>
            </div>
            <span className={styles.totalAmount}>{formatCurrency(phase1Total)}</span>
          </div>
        </div>
      )}

      {selectedAddOnsList.length > 0 && (
        <div className={styles.addOnsBlock}>
          <div className={styles.phaseLabel}>
            <span className={styles.addOnBadge}>Phase 2+</span>
            <h3 className={styles.phaseTitle}>Selected Add-Ons</h3>
            <p className={styles.phaseDesc}>
              Enhance your website over time with these integrations and features.
              Each can be added independently whenever you're ready.
            </p>
          </div>

          <div className={styles.addOnGrid}>
            {selectedAddOnsList.map((addon) => {
              const vis = addOnMap.get(addon.id)
              const dimmed = vis && !vis.included
              return (
                <div key={addon.id} className={`${styles.addOnCard} ${dimmed ? styles.addOnCardDimmed : ''}`}>
                  <div className={styles.addOnHeader}>
                    <h4 className={styles.addOnName}>{addon.name}</h4>
                    <span className={styles.addOnPrice}>
                      {addon.priceLabel || formatCurrency(addon.price)}
                    </span>
                  </div>
                  <p className={styles.addOnDesc}>
                    {ADD_ON_DESCRIPTIONS[addon.id] || addon.description}
                  </p>
                  {vis?.note && (
                    <p className={styles.addOnNote}>
                      <Info size={12} /> {vis.note}
                    </p>
                  )}
                  {ADD_ON_INCLUDES[addon.id] && (
                    <ul className={styles.addOnIncludes}>
                      {ADD_ON_INCLUDES[addon.id].map((item) => (
                        <li key={item}>
                          <Check size={12} className={styles.addOnCheck} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>

          <div className={styles.totalBar}>
            <span className={styles.totalLabel}>Add-Ons Total</span>
            <span className={styles.totalAmount}>{formatCurrency(addOnsTotal)}</span>
          </div>
        </div>
      )}

      <div className={styles.monthlyBlock}>
        <MonthlyTable
          items={monthlyServices}
          visibilityMap={monthlyMap}
          selectedIds={activeSelections.selectedMonthly}
        />
      </div>

      {oneTimeTotal > 0 && (
        <div className={styles.grandTotalBar}>
          <span className={styles.grandTotalLabel}>One-Time Investment Total</span>
          <span className={styles.grandTotalAmount}>{formatCurrency(oneTimeTotal)}</span>
        </div>
      )}

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
            <h3 className={styles.acceptanceTitle}>Accept Quote</h3>
            <p className={styles.acceptanceDesc}>
              If the current configuration meets your needs, accept and email this quote to begin.
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
                I accept the solution as quoted ({currentQuote.quote_number}) --{' '}
                {formatCurrency(oneTimeTotal)}
                {monthlyTotal > 0 && ` + ~${formatCurrency(monthlyTotal)}/mo`}
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
