export interface InspirationSite {
  url: string
  notes: string
}

export type ProjectType = 'new' | 'redesign' | 'upgrade'
export type CloudProvider = 'aws' | 'gcp' | 'azure' | 'other' | 'none'
export type BrandingAsset = 'logo' | 'style_guide' | 'photography'
export type PhoneSystem = 'ringcentral' | 'other' | 'none'
export type EhrSystem = 'nextech' | 'other' | 'none'
export type BilingualScope = 'full' | 'key_pages' | 'none'
export type HostingPreference = 'managed' | 'self_managed'
export type ImplementationPhase = 'phase_1' | 'phase_2' | 'custom'

export interface DomainLookupResult {
  domain: string
  registrar: string
  registrationDate: string
  expirationDate: string
  nameservers: string[]
  status: string[]
  detectedProvider: string
  detectedProviderType: string
  error?: string
}

export interface DiscoveryConfig {
  id?: string
  created_at?: string

  project_type: ProjectType
  cloud_providers: CloudProvider[]
  has_domain: boolean
  domain_name: string
  domain_registrar: string
  domain_lookup?: DomainLookupResult
  has_professional_email: boolean
  uses_microsoft_365: boolean

  doctor_count: number
  has_existing_branding: boolean
  branding_assets: BrandingAsset[]
  needs_additional_pages: boolean
  additional_pages: string[]
  page_order: string[]

  current_forms: string[]
  need_custom_forms: boolean
  custom_form_count: number
  accepts_referrals: boolean

  hipaa_hosting_required: boolean
  needs_baa: boolean

  patient_languages: string[]
  bilingual_scope: BilingualScope
  additional_languages: string[]

  phone_system: PhoneSystem
  ehr_system: EhrSystem
  wants_online_scheduling: boolean
  scheduling_phase: ImplementationPhase
  scheduling_custom_note: string
  needs_patient_portal: boolean
  patient_portal_phase: ImplementationPhase
  patient_portal_custom_note: string

  hosting_preference: HostingPreference
  needs_maintenance: boolean
  email_account_count: number

  problem_statement: string
  website_frustrations: string
  website_wishes: string
  inspiration_sites: string
  inspiration_sites_parsed?: InspirationSite[]
}

export type HostingOptionId = 'aws' | 'gcp' | 'azure' | 'vercel' | 'traditional' | 'custom'

export interface HostingScore {
  id: HostingOptionId
  score: number
  reasons: string[]
}

export interface LineItemVisibility {
  id: string
  visible: boolean
  included: boolean
  note?: string
}

export interface ConfiguredProposal {
  recommendedHosting: HostingOptionId
  hostingScores: HostingScore[]
  phase1Visibility: LineItemVisibility[]
  addOnVisibility: LineItemVisibility[]
  monthlyVisibility: LineItemVisibility[]
  preSelectedPhase1: string[]
  preSelectedAddOns: string[]
  preSelectedMonthly: string[]
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'expired'

export interface Quote {
  id: string
  quote_number: string
  version: number
  parent_quote_id: string | null
  discovery_config_id: string
  practice_name: string
  contact_email: string
  config_snapshot: DiscoveryConfig
  proposal_snapshot: ConfiguredProposal
  customizations: {
    selectedPhase1: string[]
    selectedAddOns: string[]
    selectedMonthly: string[]
  } | null
  status: QuoteStatus
  created_at: string
  updated_at: string
}

export const DEFAULT_CONFIG: DiscoveryConfig = {
  project_type: 'redesign',
  cloud_providers: ['none'],
  has_domain: false,
  domain_name: '',
  domain_registrar: '',
  has_professional_email: false,
  uses_microsoft_365: false,

  doctor_count: 2,
  has_existing_branding: false,
  branding_assets: [],
  needs_additional_pages: false,
  additional_pages: [],
  page_order: ['Home', 'Services', 'About', 'Doctors', 'Forms', 'Contact'],

  current_forms: [],
  need_custom_forms: false,
  custom_form_count: 0,
  accepts_referrals: true,

  hipaa_hosting_required: false,
  needs_baa: false,

  patient_languages: ['english'],
  bilingual_scope: 'none',
  additional_languages: [],

  phone_system: 'none',
  ehr_system: 'none',
  wants_online_scheduling: false,
  scheduling_phase: 'phase_1',
  scheduling_custom_note: '',
  needs_patient_portal: false,
  patient_portal_phase: 'phase_1',
  patient_portal_custom_note: '',

  hosting_preference: 'managed',
  needs_maintenance: true,
  email_account_count: 5,

  problem_statement: '',
  website_frustrations: '',
  website_wishes: '',
  inspiration_sites: '',
}
