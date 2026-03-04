# MEC Eye Specialists - Website Proposal System

A dual-purpose React application that serves as both a proposal/quoting system for web development services and an interactive website mockup for MEC Eye Specialists.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9, Vite 7
- **Backend:** Supabase (PostgreSQL, Edge Functions, Row Level Security)
- **Styling:** CSS Modules
- **Routing:** React Router v7
- **Icons:** Lucide React
- **PDF:** jsPDF
- **Deployment:** Netlify

## Project Structure

```
src/
├── assets/              # Images (doctor photos, hero, devices)
├── components/
│   ├── contracts/       # Shared contract document components (DocumentShell, DocumentHeader, SignatureBlock)
│   ├── discovery/       # Discovery intake form components
│   ├── mockup/          # Website mockup sections (Hero, Services, Doctors, etc.)
│   ├── proposal/        # Proposal sections (Nav, Scope, Hosting, Investment, Quote Worksheet)
│   └── ui/              # Shared UI components (BackToTop, FloatingCTA, SectionWrapper)
├── config/
│   ├── DiscoveryContext.tsx   # Global state provider (proposal config, quotes, active selections)
│   └── configEngine.ts       # Visibility/recommendation engine
├── data/
│   ├── pricingData.ts         # Single source of truth for all pricing
│   ├── contractData.ts        # Contract content (MSA sections, SOW phases, service terms)
│   └── discoveryHelpContent.ts
├── i18n/
│   ├── LanguageContext.tsx     # EN/ES-MX language toggle
│   └── translations.ts        # Bilingual translation strings
├── lib/
│   └── supabase.ts            # Supabase client singleton
├── pages/
│   ├── Proposal.tsx           # Proposal page with sticky nav and section anchors
│   ├── Mockup.tsx             # Interactive website mockup (bilingual)
│   ├── Discovery.tsx          # Client intake/discovery form
│   ├── QuoteManagement.tsx    # Quote listing and management
│   └── contracts/             # Print-ready contract documents
│       ├── ContractsDashboard.tsx    # Document navigation hub
│       ├── MasterServiceAgreement.tsx # MSA (MSA-001)
│       ├── StatementOfWork.tsx       # SOW with deliverables & milestones (SOW-001)
│       ├── QuoteEstimate.tsx         # Itemized pricing (QTE-001)
│       └── ServiceAgreement.tsx      # Ongoing services (SA-001)
├── types/
│   └── discovery.ts           # TypeScript interfaces
└── utils/
    └── generateGuidePdf.ts    # PDF generation utility

supabase/
├── migrations/                # Database schema migrations
└── functions/
    ├── domain-lookup/         # Domain availability lookup
    └── send-quote-email/      # Email quote to client
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Proposal | Default route, full proposal view |
| `/proposal` | Proposal | Proposal with optional `?quote=` or `?config=` params |
| `/discovery` | Discovery | Client intake form |
| `/mockup` | Mockup | Interactive website mockup preview |
| `/quotes` | QuoteManagement | View and manage saved quotes |
| `/contracts` | ContractsDashboard | Contract document hub (MSA, SOW, Quote, Service Agreement) |
| `/contracts/msa` | MasterServiceAgreement | Master Service Agreement (print-ready) |
| `/contracts/sow` | StatementOfWork | Statement of Work with deliverables and milestones |
| `/contracts/quote` | QuoteEstimate | Itemized project quote/estimate |
| `/contracts/service` | ServiceAgreement | Ongoing service terms and monthly pricing |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

## Key Features

**Contract Documents**
- Four professional, print-ready contract pages accessible at `/contracts`
- **MSA (Master Service Agreement):** 11-section legal agreement covering services, IP, confidentiality, HIPAA, liability, and general terms
- **SOW (Statement of Work):** Phased deliverable tables with hours, project milestones, payment schedule, and assumptions
- **Quote/Estimate:** Itemized pricing pulled from `pricingData.ts` with category subtotals, grand total, monthly services, and payment terms
- **Service Agreement:** Post-launch hosting, maintenance, email, and support terms with monthly pricing table
- All documents include signature blocks, document numbering, and cross-references between documents
- Print/PDF export via browser print dialog (toolbar hidden in print view)

**Scope of Work (SOW)**
- Static deliverables display covering 7 project areas: Website Redesign, Patient Intake Forms, Doctor Referral System, Integration-Ready Architecture, Responsive Design, Security & Compliance, Bilingual Support
- SOW is rendered as part of the Proposal view alongside investment and hosting details
- Driven by discovery answers to tailor recommended scope items

**Quote Management & Lifecycle**
- Quote Worksheet with interactive line-item selection (Phase 1, add-ons, monthly services)
- Quote versioning with automatic revision suffixes (-v2, -v3, etc.)
- Quote statuses: draft, sent, accepted, expired
- Send quotes to clients via email (Supabase Edge Function)
- Full quote listing and management at `/quotes`
- Snapshots of discovery config and proposal config saved with each quote

**Proposal System**
- Sticky navigation with active section tracking (IntersectionObserver)
- Discovery-driven configuration engine that tailors recommendations
- Sections: Current Site Analysis, Discovery Summary, Scope of Work, Feature Breakdown, Integration Details, Hosting Options, Investment Summary, Quote Worksheet
- Investment Summary with dynamic totals synced to the Quote Worksheet
- Lazy-loaded route components for performance

**Website Mockup**
- Full interactive mockup of a healthcare website
- Bilingual support (English / Mexican Spanish)
- Scroll-aware navigation with transparent-to-solid transition
- Mobile floating action button (call + appointment)
- Patient intake forms (Registration, Medical History, Insurance, Consent) with signature capture on consent
- Physician referral form

**Security**
- Supabase Row Level Security on all tables
- Netlify security headers (CSP, X-Frame-Options, X-Content-Type-Options)
- No sensitive keys in client-side code
- HIPAA-aligned form handling (HTTPS, no PHI in storage or logs)
- BAA-aware hosting recommendations

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Type-check and build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```
