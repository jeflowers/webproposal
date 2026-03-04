export interface ContractParty {
  name: string
  address: string
  city: string
  state: string
  zip: string
  email: string
  phone: string
  title?: string
  signerName?: string
  signerTitle?: string
}

export const PROVIDER: ContractParty = {
  name: 'Luis Alonzo',
  address: '',
  city: 'El Paso',
  state: 'TX',
  zip: '',
  email: '',
  phone: '',
  title: 'Web Developer & Consultant',
  signerName: 'Luis Alonzo',
  signerTitle: 'Web Developer & Consultant',
}

export const CLIENT: ContractParty = {
  name: 'MEC Eye Specialists',
  address: '',
  city: 'El Paso',
  state: 'TX',
  zip: '',
  email: '',
  phone: '',
  signerName: '',
  signerTitle: '',
}

export interface MsaSection {
  number: string
  title: string
  paragraphs: string[]
}

export const MSA_SECTIONS: MsaSection[] = [
  {
    number: '1',
    title: 'Services',
    paragraphs: [
      'Provider agrees to perform the web development, design, and related technology services ("Services") as described in one or more Statements of Work ("SOW") executed by both parties and attached hereto as exhibits.',
      'Each SOW shall define the specific scope, deliverables, timeline, and compensation for the Services to be performed. In the event of a conflict between this Agreement and any SOW, the terms of this Agreement shall control unless the SOW expressly states otherwise.',
    ],
  },
  {
    number: '2',
    title: 'Term and Termination',
    paragraphs: [
      'This Agreement shall commence on the Effective Date and continue for a period of twelve (12) months, automatically renewing for successive twelve-month periods unless either party provides written notice of non-renewal at least thirty (30) days prior to the end of the then-current term.',
      'Either party may terminate this Agreement for cause upon thirty (30) days\u2019 written notice if the other party materially breaches this Agreement and fails to cure such breach within such thirty (30) day period.',
      'Upon termination, Client shall pay Provider for all Services performed and expenses incurred through the effective date of termination. Sections 4, 5, 6, 7, and 9 shall survive termination.',
    ],
  },
  {
    number: '3',
    title: 'Compensation and Payment',
    paragraphs: [
      'Client shall compensate Provider for Services as specified in each applicable SOW. Unless otherwise stated in the SOW, a deposit of fifty percent (50%) of the total project fee is due upon execution of the SOW, with the remaining balance due upon project completion and delivery.',
      'Monthly recurring services, if any, shall be invoiced on the first business day of each month and are due within fifteen (15) days of invoice date.',
      'Late payments shall accrue interest at a rate of one and one-half percent (1.5%) per month or the maximum rate permitted by law, whichever is less.',
    ],
  },
  {
    number: '4',
    title: 'Intellectual Property',
    paragraphs: [
      'Upon full payment of all fees due under the applicable SOW, Provider assigns to Client all right, title, and interest in the final deliverables ("Work Product") created specifically for Client under this Agreement.',
      'Provider retains all rights in pre-existing materials, tools, frameworks, libraries, and general-purpose code ("Provider Materials") used in performing the Services. Provider grants Client a non-exclusive, perpetual, royalty-free license to use Provider Materials as incorporated into the Work Product.',
      'Client retains all rights in content, branding, images, and materials provided to Provider ("Client Materials"). Client grants Provider a limited license to use Client Materials solely for performing the Services.',
    ],
  },
  {
    number: '5',
    title: 'Confidentiality',
    paragraphs: [
      'Each party agrees to hold in confidence all non-public information received from the other party that is identified as confidential or that reasonably should be understood to be confidential ("Confidential Information").',
      'Confidential Information shall not be disclosed to any third party without prior written consent, except as required by law or to employees, contractors, or agents who need to know such information for the purposes of this Agreement and are bound by confidentiality obligations no less restrictive than those contained herein.',
      'This obligation of confidentiality shall survive for a period of three (3) years following termination of this Agreement.',
    ],
  },
  {
    number: '6',
    title: 'HIPAA and Data Security',
    paragraphs: [
      'Provider acknowledges that Client operates in the healthcare industry and that certain information may constitute Protected Health Information ("PHI") under the Health Insurance Portability and Accountability Act ("HIPAA").',
      'Provider shall implement commercially reasonable administrative, physical, and technical safeguards to protect any PHI that may be encountered during the performance of Services. Provider shall not store, access, or process PHI unless specifically authorized in the applicable SOW.',
      'The website and associated systems shall be designed and configured to transmit data exclusively over encrypted connections (HTTPS/TLS). No PHI shall be stored in client-side code, browser storage, analytics platforms, or application logs.',
    ],
  },
  {
    number: '7',
    title: 'Warranties and Disclaimers',
    paragraphs: [
      'Provider warrants that: (a) the Services will be performed in a professional and workmanlike manner consistent with industry standards; (b) the Work Product will substantially conform to the specifications set forth in the applicable SOW for a period of thirty (30) days following delivery; and (c) the Work Product will not, to Provider\u2019s knowledge, infringe any third-party intellectual property rights.',
      'EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, PROVIDER MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.',
    ],
  },
  {
    number: '8',
    title: 'Limitation of Liability',
    paragraphs: [
      'IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO THIS AGREEMENT, REGARDLESS OF THE FORM OF ACTION OR THEORY OF LIABILITY.',
      'PROVIDER\u2019S TOTAL AGGREGATE LIABILITY UNDER THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THE APPLICABLE SOW GIVING RISE TO THE CLAIM.',
    ],
  },
  {
    number: '9',
    title: 'Indemnification',
    paragraphs: [
      'Provider shall indemnify and hold harmless Client from any third-party claims arising from Provider\u2019s gross negligence or willful misconduct in performing the Services, or from any claim that the Work Product infringes a third party\u2019s intellectual property rights.',
      'Client shall indemnify and hold harmless Provider from any third-party claims arising from Client Materials provided to Provider, or from Client\u2019s use of the Work Product in a manner not contemplated by this Agreement.',
    ],
  },
  {
    number: '10',
    title: 'Independent Contractor',
    paragraphs: [
      'Provider is an independent contractor and nothing in this Agreement shall be construed to create an employment, partnership, joint venture, or agency relationship between the parties. Provider is solely responsible for all taxes, insurance, and benefits related to Provider\u2019s business.',
    ],
  },
  {
    number: '11',
    title: 'General Provisions',
    paragraphs: [
      'This Agreement constitutes the entire agreement between the parties with respect to its subject matter and supersedes all prior or contemporaneous agreements, understandings, and communications, whether oral or written.',
      'This Agreement shall be governed by and construed in accordance with the laws of the State of Texas, without regard to its conflict of laws provisions. Any disputes arising under this Agreement shall be resolved in the courts located in El Paso County, Texas.',
      'This Agreement may not be amended except by a written instrument signed by both parties. No waiver of any provision shall constitute a waiver of any other provision or of the same provision on another occasion.',
      'If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.',
    ],
  },
]

export interface SowDeliverable {
  name: string
  description: string
  hours: number
}

export interface SowPhase {
  name: string
  description: string
  deliverables: SowDeliverable[]
}

export const SOW_PHASES: SowPhase[] = [
  {
    name: 'Phase 1 -- Core Website & Forms',
    description: 'Complete website redesign with patient intake forms, referral system, bilingual support, and infrastructure setup.',
    deliverables: [
      { name: 'Website Design (6 pages)', description: 'Home, Services, Our Doctors, Patient Forms, Doctor Referrals, Contact', hours: 24 },
      { name: 'Responsive Development', description: 'Mobile, tablet, and desktop optimization', hours: 12 },
      { name: 'Patient Intake Forms (4 forms)', description: 'Registration, Medical History, Insurance, Consent', hours: 18 },
      { name: 'Doctor Referral Form', description: 'Physician referral submission system', hours: 6 },
      { name: 'Translation Framework Setup', description: 'i18n architecture, language toggle, locale detection', hours: 6 },
      { name: 'Spanish (Mexico) Translation', description: 'All pages, navigation, forms, and UI elements translated to ES-MX', hours: 8 },
      { name: 'Bilingual Form Support', description: 'Patient forms, referrals, and confirmation emails in both languages', hours: 4 },
      { name: 'Secure Database Setup', description: 'Form submissions, referral data storage', hours: 8 },
      { name: 'SSL Certificate & Security', description: 'HTTPS, secure form handling', hours: 2 },
      { name: 'Hosting Infrastructure Setup', description: 'Cloud hosting, CDN, monitoring', hours: 8 },
      { name: 'Professional Email Setup', description: 'Google Workspace or equivalent email service', hours: 2 },
      { name: 'DNS & Domain Configuration', description: 'Domain transfer/setup, SSL provisioning, CDN configuration', hours: 2 },
    ],
  },
  {
    name: 'Phase 2 -- Integrations & Enhancements (Optional)',
    description: 'Each add-on can be implemented independently at any time after Phase 1 launch.',
    deliverables: [
      { name: 'RingCentral Integration', description: 'Click-to-call, scheduling widget, voicemail forms, SMS reminders', hours: 8 },
      { name: 'Nextech EHR Integration', description: 'Nextech import formatting, API sync, patient portal linking', hours: 12 },
      { name: 'Online Appointment Scheduling', description: 'Calendar interface, appointment types, automated confirmations', hours: 6 },
      { name: 'Patient Portal Enhancement', description: 'Secure login, form history, appointment history, messaging', hours: 10 },
      { name: 'Additional Language Pack', description: 'Full translation, RTL support, locale-specific formatting (per language)', hours: 12 },
    ],
  },
]

export interface SowMilestone {
  name: string
  description: string
  payment: string
}

export const SOW_MILESTONES: SowMilestone[] = [
  { name: 'Project Kickoff', description: 'Contract execution, content collection begins', payment: '50% of Phase 1 total' },
  { name: 'Design Review', description: 'Homepage and key page designs presented for approval', payment: '' },
  { name: 'Development Review', description: 'Functional site with forms and bilingual content for testing', payment: '' },
  { name: 'Launch & Delivery', description: 'Final review, deployment, and handoff', payment: 'Remaining 50% of Phase 1 total' },
]

export interface ServiceAgreementTerm {
  title: string
  content: string
}

export const SERVICE_AGREEMENT_TERMS: ServiceAgreementTerm[] = [
  {
    title: 'Hosting Services',
    content: 'Provider will maintain the Client\u2019s website on a cloud hosting platform with 99.9% uptime target, automated daily backups, SSL certificate management, and CDN distribution. Hosting costs are billed monthly and are subject to adjustment with thirty (30) days\u2019 written notice.',
  },
  {
    title: 'Maintenance & Support',
    content: 'Provider will perform monthly maintenance including security updates, dependency patches, performance monitoring, and up to two (2) hours of content changes per month. Additional hours are billed at the Provider\u2019s standard hourly rate. Emergency support for site outages is provided with best-effort response within four (4) business hours.',
  },
  {
    title: 'Email Service',
    content: 'Provider will manage the Client\u2019s professional email accounts through Google Workspace or equivalent service. This includes account provisioning, DNS configuration, and basic troubleshooting. Per-user fees are billed monthly.',
  },
  {
    title: 'Service Level',
    content: 'Provider will use commercially reasonable efforts to maintain website availability. Scheduled maintenance will be performed during off-peak hours with advance notice. Provider is not responsible for downtime caused by third-party services, Client modifications, or force majeure events.',
  },
  {
    title: 'Term and Billing',
    content: 'This Service Agreement begins upon website launch and continues on a month-to-month basis. Either party may terminate with thirty (30) days\u2019 written notice. Monthly invoices are issued on the first business day of each month and are due within fifteen (15) days.',
  },
  {
    title: 'Data and Backups',
    content: 'Provider will maintain automated daily backups with a minimum thirty (30) day retention period. In the event of termination, Provider will deliver a complete backup of the website files and database to Client within ten (10) business days of the termination effective date.',
  },
]
