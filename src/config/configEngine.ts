import type {
  DiscoveryConfig,
  ConfiguredProposal,
  LineItemVisibility,
} from '../types/discovery'
import { scoreHostingOptions } from './hostingScoring'

function getPhase1Visibility(config: DiscoveryConfig): LineItemVisibility[] {
  return [
    {
      id: 'website-design',
      visible: true,
      included: true,
    },
    {
      id: 'responsive-dev',
      visible: true,
      included: true,
    },
    {
      id: 'patient-forms',
      visible: true,
      included: true,
      note:
        config.need_custom_forms && config.custom_form_count > 4
          ? `Includes ${config.custom_form_count} custom forms`
          : undefined,
    },
    {
      id: 'referral-form',
      visible: config.accepts_referrals,
      included: config.accepts_referrals,
      note: !config.accepts_referrals
        ? 'Not applicable — practice does not accept referrals'
        : undefined,
    },
    {
      id: 'referral-upgrade',
      visible: config.accepts_referrals,
      included: config.accepts_referrals,
      note: !config.accepts_referrals
        ? 'Not applicable — practice does not accept referrals'
        : undefined,
    },
    {
      id: 'hipaa-controls',
      visible: true,
      included: true,
    },
    {
      id: 'baa-compliance',
      visible: true,
      included: config.hipaa_hosting_required,
      note: !config.hipaa_hosting_required
        ? 'Optional — no specific HIPAA hosting requirement indicated'
        : undefined,
    },
    {
      id: 'bilingual-translation',
      visible: config.bilingual_scope !== 'none',
      included: config.bilingual_scope === 'full',
      note:
        config.bilingual_scope === 'key_pages'
          ? 'Key pages only — reduced scope'
          : config.bilingual_scope === 'none'
            ? 'Not applicable — single language'
            : undefined,
    },
    {
      id: 'bilingual-toggle',
      visible: config.bilingual_scope !== 'none',
      included: config.bilingual_scope !== 'none',
    },
    {
      id: 'bilingual-forms',
      visible: config.bilingual_scope === 'full',
      included: config.bilingual_scope === 'full',
    },
    {
      id: 'hosting-setup',
      visible: true,
      included: true,
    },
    {
      id: 'dns-config',
      visible: config.has_domain,
      included: config.has_domain,
      note: !config.has_domain
        ? 'Domain registration needed — additional step required'
        : undefined,
    },
    {
      id: 'email-setup',
      visible: true,
      included: true,
      note: config.email_account_count > 0
        ? `${config.email_account_count} email accounts`
        : undefined,
    },
  ]
}

function getAddOnVisibility(config: DiscoveryConfig): LineItemVisibility[] {
  return [
    {
      id: 'ringcentral',
      visible: true,
      included: config.phone_system === 'ringcentral',
      note:
        config.phone_system === 'none'
          ? 'No phone system specified'
          : config.phone_system === 'other'
            ? 'Not applicable — requires RingCentral'
            : undefined,
    },
    {
      id: 'nextech',
      visible: true,
      included: config.ehr_system === 'nextech',
      note:
        config.ehr_system === 'none'
          ? 'No EHR system specified'
          : config.ehr_system === 'other'
            ? 'Not applicable — requires Nextech EHR'
            : undefined,
    },
    {
      id: 'scheduling',
      visible: true,
      included: config.wants_online_scheduling,
      note: !config.wants_online_scheduling
        ? 'Online scheduling not requested'
        : config.scheduling_phase === 'phase_2'
          ? 'Planned for Phase 2 -- post-launch implementation'
          : config.scheduling_phase === 'custom'
            ? `Custom timeline: ${config.scheduling_custom_note || 'to be determined'}`
            : undefined,
    },
    {
      id: 'patient-portal',
      visible: true,
      included: config.needs_patient_portal,
      note: !config.needs_patient_portal
        ? 'Patient portal not requested'
        : config.patient_portal_phase === 'phase_2'
          ? 'Planned for Phase 2 -- post-launch implementation'
          : config.patient_portal_phase === 'custom'
            ? `Custom timeline: ${config.patient_portal_custom_note || 'to be determined'}`
            : undefined,
    },
    {
      id: 'language-pack',
      visible: config.additional_languages.length > 0,
      included: config.additional_languages.length > 0,
      note:
        config.additional_languages.length > 0
          ? `${config.additional_languages.join(', ')}`
          : undefined,
    },
  ]
}

function getMonthlyVisibility(config: DiscoveryConfig): LineItemVisibility[] {
  return [
    {
      id: 'hosting-monthly',
      visible: true,
      included: config.hosting_preference === 'managed',
      note:
        config.hosting_preference === 'self_managed'
          ? 'Self-managed hosting selected'
          : undefined,
    },
    {
      id: 'maintenance-monthly',
      visible: true,
      included: config.needs_maintenance,
      note: !config.needs_maintenance
        ? 'Maintenance not requested'
        : undefined,
    },
    {
      id: 'email-monthly',
      visible: config.email_account_count > 0,
      included: config.email_account_count > 0,
      note:
        config.email_account_count > 0
          ? `${config.email_account_count} accounts`
          : undefined,
    },
  ]
}

function getPreSelectedPhase1(visibility: LineItemVisibility[]): string[] {
  return visibility.filter((v) => v.visible && v.included).map((v) => v.id)
}

function getPreSelectedAddOns(visibility: LineItemVisibility[]): string[] {
  return visibility.filter((v) => v.visible && v.included).map((v) => v.id)
}

function getPreSelectedMonthly(visibility: LineItemVisibility[]): string[] {
  return visibility.filter((v) => v.visible && v.included).map((v) => v.id)
}

export function generateProposalConfig(
  config: DiscoveryConfig
): ConfiguredProposal {
  const hostingScores = scoreHostingOptions(config)
  const recommendedHosting = hostingScores[0].id

  const phase1Visibility = getPhase1Visibility(config)
  const addOnVisibility = getAddOnVisibility(config)
  const monthlyVisibility = getMonthlyVisibility(config)

  return {
    recommendedHosting,
    hostingScores,
    phase1Visibility,
    addOnVisibility,
    monthlyVisibility,
    preSelectedPhase1: getPreSelectedPhase1(phase1Visibility),
    preSelectedAddOns: getPreSelectedAddOns(addOnVisibility),
    preSelectedMonthly: getPreSelectedMonthly(monthlyVisibility),
  }
}
