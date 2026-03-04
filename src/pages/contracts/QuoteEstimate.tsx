import DocumentShell from '../../components/contracts/DocumentShell'
import DocumentHeader from '../../components/contracts/DocumentHeader'
import SignatureBlock from '../../components/contracts/SignatureBlock'
import { PROVIDER, CLIENT } from '../../data/contractData'
import { getPhase1Categories, ADD_ONS, getMonthlyServices, formatCurrency } from '../../data/pricingData'
import styles from './QuoteEstimate.module.css'

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const hostingProvider = 'aws' as const

const phase1Categories = getPhase1Categories(hostingProvider)
const monthlyServices = getMonthlyServices(hostingProvider)

const phase1Total = phase1Categories.reduce(
  (sum, cat) => sum + cat.items.reduce((s, item) => s + item.price, 0),
  0
)
const phase1Hours = phase1Categories.reduce(
  (sum, cat) => sum + cat.items.reduce((s, item) => s + item.hours, 0),
  0
)
const addOnsTotal = ADD_ONS.reduce((sum, item) => sum + item.price, 0)

export default function QuoteEstimate() {
  return (
    <DocumentShell>
      <DocumentHeader
        docType="Project Quote / Estimate"
        title="Website Redesign -- Quote"
        date={today}
        docNumber="QTE-001"
      />

      <div className={styles.intro}>
        <p>
          This document provides a detailed cost estimate for the MEC Eye Specialists website
          redesign project as described in SOW-001. All pricing is based on the scope defined
          in the accompanying Statement of Work.
        </p>
      </div>

      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Prepared By</span>
          <span className={styles.metaValue}>{PROVIDER.name}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Prepared For</span>
          <span className={styles.metaValue}>{CLIENT.name}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Reference</span>
          <span className={styles.metaValue}>SOW-001</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Valid Through</span>
          <span className={styles.metaValue}>30 days from issue date</span>
        </div>
      </div>

      {phase1Categories.map((cat) => {
        const catTotal = cat.items.reduce((s, item) => s + item.price, 0)
        const catHours = cat.items.reduce((s, item) => s + item.hours, 0)
        return (
          <div key={cat.id} className={styles.categoryBlock}>
            <h3 className={styles.categoryTitle}>{cat.name}</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Hours</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {cat.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDesc}>{item.description}</div>
                    </td>
                    <td>{item.hours}</td>
                    <td>{formatCurrency(item.price)}</td>
                  </tr>
                ))}
                <tr className={styles.subtotalRow}>
                  <td>Subtotal</td>
                  <td>{catHours}</td>
                  <td>{formatCurrency(catTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      })}

      <div className={styles.categoryBlock}>
        <h3 className={styles.categoryTitle}>Phase 2 -- Optional Add-Ons</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Hours</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {ADD_ONS.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.description}</div>
                </td>
                <td>{item.hours}</td>
                <td>{item.priceLabel || formatCurrency(item.price)}</td>
              </tr>
            ))}
            <tr className={styles.subtotalRow}>
              <td>Add-Ons Subtotal</td>
              <td>{ADD_ONS.reduce((s, i) => s + i.hours, 0)}</td>
              <td>{formatCurrency(addOnsTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.grandTotal}>
        <span className={styles.grandTotalLabel}>
          Phase 1 Total ({phase1Hours} hours)
        </span>
        <span className={styles.grandTotalAmount}>
          {formatCurrency(phase1Total)}
        </span>
      </div>

      <div className={styles.monthlySection}>
        <h3 className={styles.monthlySectionTitle}>Ongoing Monthly Services (Optional)</h3>
        <p className={styles.monthlySectionDesc}>
          Billed monthly after website launch. Can be added or removed at any time with 30 days notice.
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Service</th>
              <th>Hours</th>
              <th>Monthly</th>
            </tr>
          </thead>
          <tbody>
            {monthlyServices.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDesc}>{item.description}</div>
                </td>
                <td>{item.hours || '--'}</td>
                <td>{item.priceLabel || formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.terms}>
        <h3 className={styles.termsTitle}>Payment Terms</h3>
        <ul className={styles.termsList}>
          <li>A deposit of 50% of the Phase 1 total is due upon contract execution.</li>
          <li>The remaining 50% is due upon project completion and delivery.</li>
          <li>Phase 2 add-ons are quoted separately and payable upon completion of each add-on.</li>
          <li>Monthly services are invoiced on the 1st of each month, due within 15 days.</li>
          <li>Late payments are subject to 1.5% monthly interest per the Master Service Agreement.</li>
        </ul>
      </div>

      <div className={styles.validity}>
        <strong>This quote is valid for 30 days from the date of issue.</strong> Pricing is
        subject to change for quotes accepted after the validity period. Scope changes may
        require a revised estimate.
      </div>

      <SignatureBlock title="Acceptance" />
    </DocumentShell>
  )
}
