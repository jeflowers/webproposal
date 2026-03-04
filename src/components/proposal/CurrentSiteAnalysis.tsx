import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import type { DiscoveryConfig } from '../../types/discovery'
import styles from './CurrentSiteAnalysis.module.css'

function buildIssues(cfg: DiscoveryConfig): { type: string; text: string }[] {
  const items: { type: string; text: string }[] = []

  if (cfg.current_forms.length === 0) {
    items.push({ type: 'critical', text: 'No online patient intake forms' })
  }

  if (!cfg.hipaa_hosting_required && cfg.project_type !== 'new') {
    items.push({ type: 'warning', text: 'HIPAA-compliant hosting not currently in place' })
  }

  if (cfg.bilingual_scope !== 'none' && cfg.project_type !== 'new') {
    items.push({ type: 'warning', text: 'No bilingual support for patient-facing content' })
  }

  if (cfg.phone_system === 'none' && cfg.ehr_system === 'none') {
    items.push({ type: 'warning', text: 'No integration with practice management tools' })
  }

  if (cfg.project_type === 'redesign') {
    items.push({ type: 'warning', text: 'Outdated visual design and layout' })
    items.push({ type: 'critical', text: 'Current site needs responsive mobile design' })
  }

  if (cfg.project_type === 'upgrade') {
    items.push({ type: 'warning', text: 'Site functionality needs modernization' })
  }

  if (cfg.wants_online_scheduling && cfg.project_type !== 'new') {
    items.push({ type: 'warning', text: 'No online appointment scheduling available' })
  }

  if (items.length === 0) {
    items.push({ type: 'warning', text: 'Limited SEO optimization' })
  }

  return items
}

function buildStrengths(cfg: DiscoveryConfig): string[] {
  const items: string[] = []

  if (cfg.has_domain && cfg.domain_name) {
    items.push(`Established domain (${cfg.domain_name})`)
  }

  if (cfg.has_existing_branding) {
    items.push('Existing brand assets available')
  }

  if (cfg.accepts_referrals) {
    items.push('Doctor referral workflow in place')
  }

  if (cfg.has_professional_email) {
    items.push('Professional email already configured')
  }

  if (cfg.current_forms.length > 0) {
    items.push('Patient intake forms already in use')
  }

  if (cfg.project_type !== 'new') {
    items.push('Existing web presence to build upon')
  }

  if (items.length === 0) {
    items.push('Clean slate for modern implementation')
  }

  return items
}

export default function CurrentSiteAnalysis() {
  const { config, currentQuote } = useDiscovery()
  const cfg = currentQuote?.config_snapshot || config

  const issues = buildIssues(cfg)
  const strengths = buildStrengths(cfg)

  const domain = cfg.has_domain && cfg.domain_name ? cfg.domain_name : null
  const descriptionText = cfg.project_type === 'new'
    ? 'An assessment of your practice requirements identified the following considerations for your new website.'
    : domain
      ? `A review of ${domain} identified several areas for improvement alongside existing strengths to build upon.`
      : 'A review of your current environment identified several areas for improvement alongside existing strengths to build upon.'

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Current Site Analysis</h2>
      <p className={styles.description}>{descriptionText}</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <XCircle size={18} color="var(--color-error)" />
            {cfg.project_type === 'new' ? 'Requirements to Address' : 'Issues Identified'}
          </h3>
          <ul className={styles.list}>
            {issues.map((item) => (
              <li key={item.text} className={styles.listItem}>
                {item.type === 'critical' ? (
                  <XCircle size={14} color="var(--color-error)" />
                ) : (
                  <AlertTriangle size={14} color="var(--color-warning)" />
                )}
                <span>{item.text}</span>
                <span className={`${styles.badge} ${styles[item.type]}`}>
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            <CheckCircle size={18} color="var(--color-success)" />
            {cfg.project_type === 'new' ? 'Starting Advantages' : 'Strengths to Retain'}
          </h3>
          <ul className={styles.list}>
            {strengths.map((item) => (
              <li key={item} className={styles.listItem}>
                <CheckCircle size={14} color="var(--color-success)" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
