export interface FieldHelp {
  fieldKey: string
  question: string
  guidance: string
  example?: string
  pricingImpact?: string
}

export interface SectionHelp {
  sectionIndex: number
  title: string
  description: string
  fields: FieldHelp[]
}

export const discoveryHelpContent: SectionHelp[] = [
  {
    sectionIndex: 0,
    title: 'About Your Practice & Current Challenges',
    description:
      'Help us understand your practice, current pain points, and what you envision for the new website.',
    fields: [
      {
        fieldKey: 'project_type',
        question: 'Is this a brand new website or replacing/upgrading an existing one?',
        guidance:
          'Brand new website = no existing site. Redesign existing site = current site needs a complete overhaul. Upgrade current site = functional but needs updates.',
        example: 'Typical healthcare client answer: Redesign existing site.',
      },
      {
        fieldKey: 'problem_statement',
        question: 'Tell us about your practice and what prompted this project.',
        guidance:
          'Describe your practice type (e.g., ophthalmology, dermatology), number of locations, patient demographics, and why the project is happening now (outdated site, new services, growth).',
        example:
          '"[Practice Name] is a multi-location [specialty] practice serving [X] communities across [Region]. Our patient base includes [demographic groups], and we prioritize culturally appropriate care. Our current website no longer reflects our capabilities or helps patients connect with us effectively."',
      },
      {
        fieldKey: 'website_frustrations',
        question: 'What frustrations do you have with your current website (if any)?',
        guidance:
          'Describe visual/design issues, functional gaps (no forms, no mobile support), staff pain points (fielding calls), and patient experience complaints.',
        example:
          '"The current site is a static page with placeholder images. There are no online appointment forms, no bilingual support, and it doesn\'t work on mobile. Staff spend significant time answering calls for information the site should provide."',
      },
      {
        fieldKey: 'website_wishes',
        question: 'What do you wish your website could do?',
        guidance:
          'Describe patient-facing features (scheduling, intake forms, portal access), staff-facing features (referral management), language/accessibility needs, and third-party integrations.',
        example:
          '"We want patients to request appointments online, access their portal, and find location-specific info easily. Bilingual support is essential. We also want digital intake forms and a streamlined referral process."',
      },
      {
        fieldKey: 'inspiration_sites',
        question: 'Are there any websites you admire or want to draw inspiration from?',
        guidance:
          'Share URLs of sites in the same or similar specialty. Note what you like about them: layout, color palette, navigation style, overall feel (professional, warm, modern).',
        example:
          '"We admire sites like example-eyecare.com -- clean layouts, easy-to-navigate service menus, strong visual hierarchy, and clear calls to action for scheduling."',
      },
    ],
  },
  {
    sectionIndex: 1,
    title: 'Current Environment & Infrastructure',
    description: 'Tell us about your current technology setup and hosting environment.',
    fields: [
      {
        fieldKey: 'cloud_providers',
        question: 'Do you currently use any cloud providers?',
        guidance:
          'Select all that apply. If the practice uses Microsoft 365, Azure may be relevant. When in doubt, select "None / Not sure." Common if using cloud-hosted apps or email.',
      },
      {
        fieldKey: 'has_domain',
        question: 'Do you have an existing domain?',
        guidance:
          'Toggle ON if the practice already owns their domain. Enter the domain (e.g., yourpractice.com) and click Lookup. The form auto-populates registrar, expiration, DNS provider, and nameservers.',
        example:
          'Confirm the domain is active and note the expiration date. Domains expiring within 12 months should be flagged for renewal.',
      },
      {
        fieldKey: 'has_professional_email',
        question: 'Do you currently have professional email (@yourpractice.com)?',
        guidance:
          'Toggle ON if the practice uses branded email (e.g., info@yourpractice.com). Toggle OFF if staff use personal or generic accounts (Gmail, Yahoo).',
      },
      {
        fieldKey: 'uses_microsoft_365',
        question: 'Does your practice use Microsoft 365?',
        guidance:
          'Toggle ON if the practice uses Outlook, Teams, SharePoint, or other M365 tools. Toggle OFF if they use Google Workspace or no cloud productivity suite.',
        pricingImpact:
          'Microsoft 365 integration may affect email setup and hosting recommendations.',
      },
    ],
  },
  {
    sectionIndex: 2,
    title: 'Practice & Branding Needs',
    description: 'Help us understand your practice size and branding needs.',
    fields: [
      {
        fieldKey: 'doctor_count',
        question: 'How many doctors need individual profile pages?',
        guidance:
          'Count only active, patient-facing providers. Include MDs, DOs, ODs, and any other clinical staff with patient relationships. Do not include administrative staff.',
        example: '4',
        pricingImpact: 'Each additional doctor profile beyond the base count may add to scope.',
      },
      {
        fieldKey: 'has_existing_branding',
        question: 'Do you have existing branding assets?',
        guidance:
          'Toggle ON if the practice has a logo, color palette, brand guidelines, or existing marketing materials. Toggle OFF if starting from scratch.',
        pricingImpact:
          'No existing branding means design work increases. A new logo and brand kit will be added to scope.',
      },
      {
        fieldKey: 'needs_additional_pages',
        question: 'Do you need pages beyond the standard 6?',
        guidance:
          'Standard pages: Home, Services, About, Doctors, Forms, Contact. Toggle ON if additional pages are needed (e.g., Referrals, Locations, Blog). Use the drag-to-reorder list to arrange navigation order.',
        example:
          'Additional pages: Referrals, Locations, Patient Resources. Recommended order: Home, Services, About, Doctors, Forms, Referrals, Contact.',
        pricingImpact: 'Each additional page beyond the standard 6 adds to the base scope.',
      },
    ],
  },
  {
    sectionIndex: 3,
    title: 'Patient Intake & Forms',
    description: 'Describe your current patient intake process and form requirements.',
    fields: [
      {
        fieldKey: 'current_forms',
        question: 'What forms do you currently use for patient intake?',
        guidance:
          'Select all that apply: Patient Registration, Medical History, Insurance Information, Consent Forms, and/or Other forms. Typical healthcare practices use all four standard forms.',
      },
      {
        fieldKey: 'need_custom_forms',
        question: 'Do you need custom forms beyond the standard 4?',
        guidance:
          'Toggle ON only if the practice requires forms not covered by the standard four (e.g., vision history questionnaire, surgical pre-op checklist, referral-specific intake).',
        pricingImpact: 'Custom forms are scoped individually and priced as add-ons.',
      },
      {
        fieldKey: 'accepts_referrals',
        question: 'Do you accept physician referrals?',
        guidance:
          'Toggle ON if the practice receives referrals from other physicians and needs a referral submission workflow on the website.',
        pricingImpact:
          'Turning this ON typically adds a Referrals page and a digital referral form to the project.',
      },
    ],
  },
  {
    sectionIndex: 4,
    title: 'Security & Compliance',
    description: 'Specify your security and compliance requirements.',
    fields: [
      {
        fieldKey: 'hipaa_hosting_required',
        question: 'Do you have specific HIPAA hosting requirements?',
        guidance:
          'Toggle ON for any practice that collects, stores, or transmits Protected Health Information (PHI) through the website. This applies to virtually all healthcare practices with online intake forms.',
        pricingImpact:
          'HIPAA-compliant hosting affects infrastructure choice and adds to base hosting cost.',
      },
      {
        fieldKey: 'needs_baa',
        question:
          'Do you need a Business Associate Agreement (BAA) with your hosting provider?',
        guidance:
          'Toggle ON if the practice must have a signed BAA with any vendor handling PHI -- required by HIPAA for covered entities. If HIPAA hosting is ON, BAA should also be ON.',
        pricingImpact:
          'Not all hosting providers offer BAAs. This narrows hosting options to HIPAA-eligible platforms.',
      },
    ],
  },
  {
    sectionIndex: 5,
    title: 'Language Requirements',
    description: 'Tell us about the languages your patients speak.',
    fields: [
      {
        fieldKey: 'patient_languages',
        question: 'What languages do your patients speak?',
        guidance:
          'Select all that apply. Always select English. Select Spanish if there is a significant Spanish-speaking patient population. Add Chinese, Vietnamese, Korean, or Other as needed.',
        example: 'Typical answer for Southeast LA / similar communities: English + Spanish.',
      },
      {
        fieldKey: 'bilingual_scope',
        question: 'What level of bilingual support do you need?',
        guidance:
          'Full bilingual = every page and form in both languages. Key pages only = Home, Services, Contact translated. English only = no translation needed.',
        pricingImpact:
          'Full bilingual is the most comprehensive option and adds significant scope. Key pages only is a middle-ground option.',
      },
      {
        fieldKey: 'additional_languages',
        question: 'Any languages beyond English and Spanish?',
        guidance:
          'Enter comma-separated list of additional languages. Leave blank if English and Spanish cover the patient population.',
        example: 'Mandarin, Vietnamese',
        pricingImpact:
          'Each additional language beyond English/Spanish is a separate add-on line item.',
      },
    ],
  },
  {
    sectionIndex: 6,
    title: 'Integrations & Systems',
    description: 'What systems and integrations does your practice use?',
    fields: [
      {
        fieldKey: 'phone_system',
        question: 'What phone system do you use?',
        guidance:
          'Select RingCentral if the practice uses RingCentral VoIP. Select Other system for a different VoIP/phone system. Select No VoIP system for traditional landline.',
        pricingImpact:
          'RingCentral integration (click-to-call, call tracking) is a recommended add-on if selected.',
      },
      {
        fieldKey: 'ehr_system',
        question: 'What EHR/EMR system do you use?',
        guidance:
          'Select Nextech if the practice uses Nextech EHR. Select Other EHR for a different system. Select No EHR system if none is used.',
        pricingImpact:
          'EHR integration (appointment syncing, patient data handoff) is a recommended add-on if selected.',
      },
      {
        fieldKey: 'wants_online_scheduling',
        question: 'Do you want online appointment scheduling?',
        guidance:
          'Toggle ON if patients should be able to request or book appointments through the website. Toggle OFF if booking happens by phone or through an existing portal.',
        pricingImpact:
          'Online scheduling integration is a recommended add-on and may require EHR or third-party tool integration.',
      },
      {
        fieldKey: 'needs_patient_portal',
        question: 'Do you need a patient portal?',
        guidance:
          'Toggle ON if the practice needs a patient-facing portal for records, test results, or secure messaging. Toggle OFF if using a standalone portal (e.g., through their EHR) and only need a link.',
      },
    ],
  },
  {
    sectionIndex: 7,
    title: 'Ongoing Support Preferences',
    description: 'How would you like your website hosted and maintained?',
    fields: [
      {
        fieldKey: 'hosting_preference',
        question: 'Do you want managed hosting or self-managed?',
        guidance:
          'Managed = the web development team handles hosting, updates, backups, and security. Self-managed = the practice IT team manages it. Managed is recommended for most healthcare practices.',
      },
      {
        fieldKey: 'needs_maintenance',
        question: 'Do you need ongoing maintenance and support?',
        guidance:
          'Toggle ON to include a monthly maintenance plan (content updates, security patches, uptime monitoring, backups). Toggle OFF if the practice handles all updates internally.',
        pricingImpact:
          'Monthly maintenance is a recurring cost. Highly recommended for HIPAA-regulated sites.',
      },
      {
        fieldKey: 'email_account_count',
        question: 'How many email accounts do you need?',
        guidance:
          'Count individual staff email addresses needed (e.g., info@, referrals@, billing@, individual staff accounts). Do not count shared distribution lists unless they require individual mailboxes.',
        example: '5 (info, referrals, billing, two individual staff accounts)',
      },
    ],
  },
]

export function getFieldHelp(
  sectionIndex: number,
  fieldKey: string
): FieldHelp | undefined {
  const section = discoveryHelpContent.find(
    (s) => s.sectionIndex === sectionIndex
  )
  return section?.fields.find((f) => f.fieldKey === fieldKey)
}
