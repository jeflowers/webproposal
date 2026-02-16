import { Cloud, Server, Globe, Check, ArrowRight, Layers, Shield, Settings } from 'lucide-react'
import { useDiscovery } from '../../config/DiscoveryContext'
import type { HostingOptionId } from '../../types/discovery'
import styles from './HostingOptions.module.css'

interface HostingOption {
  id: HostingOptionId
  name: string
  tagline: string
  icon: typeof Cloud
  description: string
  pros: string[]
  cons: string[]
  monthlyCost: string
}

const options: HostingOption[] = [
  {
    id: 'aws',
    name: 'Amazon Web Services (AWS)',
    tagline: 'Leverage your existing AWS infrastructure',
    icon: Cloud,
    description:
      'Host the website on your existing AWS account using S3 and CloudFront for fast, globally distributed static hosting, with Lambda functions handling form submissions and backend processing. Consolidates all infrastructure under one vendor and one billing account.',
    pros: [
      'Leverages your existing AWS account and billing',
      'Industry-leading reliability (99.99% uptime SLA)',
      'Full control over infrastructure and configuration',
      'HIPAA-eligible services available',
      'Extensive monitoring with CloudWatch',
      'Scales to any traffic level',
    ],
    cons: [
      'Higher initial setup complexity',
      'Usage-based pricing requires monitoring',
    ],
    monthlyCost: '$25-50/mo',
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform (GCP)',
    tagline: 'Enterprise cloud with strong data and AI capabilities',
    icon: Layers,
    description:
      'Host on Google Cloud using Cloud Storage and Cloud CDN for static delivery, with Cloud Functions or Cloud Run for form processing. Strong networking backbone with global edge caching and excellent uptime guarantees.',
    pros: [
      'Premium global network with low-latency edge caching',
      'Competitive sustained-use pricing discounts',
      'Strong IAM and security tooling',
      'HIPAA BAA available for healthcare workloads',
      'Firebase integration for real-time features',
    ],
    cons: [
      'Smaller ecosystem than AWS for third-party tooling',
      'Console UI can be complex for non-technical users',
      'Adds a new vendor relationship',
    ],
    monthlyCost: '$20-45/mo',
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    tagline: 'Enterprise-grade cloud with Microsoft ecosystem integration',
    icon: Shield,
    description:
      'Deploy using Azure Static Web Apps or Blob Storage with Azure CDN. Azure Functions handle form submissions and backend logic. Ideal if your practice uses Microsoft 365 or Active Directory, consolidating cloud services under one vendor.',
    pros: [
      'Native Microsoft 365 and Active Directory integration',
      'Azure Front Door for global CDN and WAF protection',
      'HIPAA and SOC 2 compliance built in',
      'Strong hybrid cloud capabilities',
      'Enterprise support agreements available',
    ],
    cons: [
      'More complex pricing model than competitors',
      'Steeper learning curve for non-Microsoft shops',
      'Adds a new vendor if not already using Azure',
    ],
    monthlyCost: '$25-50/mo',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    tagline: 'Modern deployment platform for web applications',
    icon: Globe,
    description:
      'Vercel provides a streamlined deployment experience with automatic builds, global CDN, and serverless functions. Great developer experience with instant previews and zero-config deployments.',
    pros: [
      'Extremely simple deployment workflow',
      'Automatic SSL and global CDN',
      'Built-in serverless functions',
      'Excellent performance out of the box',
    ],
    cons: [
      'Adds another vendor to your stack',
      'Less infrastructure control than AWS',
      'Serverless function limits on free/pro tiers',
    ],
    monthlyCost: '$20/mo (Pro)',
  },
  {
    id: 'traditional',
    name: 'Traditional Web Host',
    tagline: 'Conventional shared or VPS hosting',
    icon: Server,
    description:
      'Traditional hosting through providers like SiteGround, Bluehost, or a managed VPS. Familiar setup with cPanel or similar management tools. Suitable for straightforward hosting needs.',
    pros: [
      'Familiar management interfaces (cPanel)',
      'All-in-one pricing (hosting + email)',
      'Phone/chat support available',
      'Simple for basic content updates',
    ],
    cons: [
      'Slower performance than CDN-based solutions',
      'Limited scalability',
      'Shared resources can impact reliability',
      'Another vendor to manage',
    ],
    monthlyCost: '$15-30/mo',
  },
  {
    id: 'custom',
    name: 'Custom / Self-Managed',
    tagline: 'Full control with your own server infrastructure',
    icon: Settings,
    description:
      'Deploy to your own dedicated server, colocated hardware, or private cloud. Full control over every layer of the stack including OS, runtime, networking, and security. Best suited for organizations with existing IT staff and specific compliance or data residency requirements.',
    pros: [
      'Complete control over hardware and software stack',
      'No vendor lock-in or recurring platform fees',
      'Custom security and compliance configurations',
      'On-premise data residency if required',
    ],
    cons: [
      'Requires dedicated IT staff for maintenance',
      'Responsible for all updates, backups, and monitoring',
      'Higher upfront setup and ongoing operational cost',
      'No built-in CDN — must configure separately',
    ],
    monthlyCost: '$50-150/mo',
  },
]

const HOSTING_NAME_MAP: Record<HostingOptionId, string> = {
  aws: 'AWS',
  gcp: 'Google Cloud',
  azure: 'Azure',
  vercel: 'Vercel',
  traditional: 'traditional hosting',
  custom: 'custom/self-managed hosting',
}

export default function HostingOptions() {
  const { proposalConfig } = useDiscovery()
  const recommended = proposalConfig.recommendedHosting
  const topScore = proposalConfig.hostingScores[0]

  const reasonText = topScore.reasons.length > 0
    ? topScore.reasons[0].charAt(0).toLowerCase() + topScore.reasons[0].slice(1)
    : 'it best matches your requirements'

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Hosting & Infrastructure</h2>
      <p className={styles.description}>
        Based on your discovery responses, we recommend {HOSTING_NAME_MAP[recommended]} because {reasonText}. Here are six options to consider. Each can support the full website and form system.
      </p>

      <div className={styles.optionsGrid}>
        {options.map((option) => {
          const Icon = option.icon
          const isRecommended = option.id === recommended
          const scoreEntry = proposalConfig.hostingScores.find((s) => s.id === option.id)

          return (
            <div
              key={option.id}
              className={`${styles.card} ${isRecommended ? styles.cardRecommended : ''}`}
            >
              {isRecommended && (
                <div className={styles.recommendBadge}>Recommended</div>
              )}
              <div className={styles.cardHeader}>
                <Icon size={22} className={styles.cardIcon} />
                <div>
                  <h3 className={styles.cardName}>{option.name}</h3>
                  <p className={styles.cardTagline}>{option.tagline}</p>
                </div>
              </div>

              <p className={styles.cardDesc}>{option.description}</p>

              {scoreEntry && scoreEntry.reasons.length > 0 && isRecommended && (
                <div className={styles.scoreBadge}>
                  {scoreEntry.reasons.slice(0, 2).map((r) => (
                    <span key={r} className={styles.scoreReason}>
                      <Check size={11} /> {r}
                    </span>
                  ))}
                </div>
              )}

              <div className={styles.costBadge}>
                <span className={styles.costLabel}>Est. Monthly</span>
                <span className={styles.costValue}>{option.monthlyCost}</span>
              </div>

              <div className={styles.prosSection}>
                <h4 className={styles.listTitle}>Advantages</h4>
                <ul className={styles.prosList}>
                  {option.pros.map((pro) => (
                    <li key={pro}>
                      <Check size={13} className={styles.checkIcon} />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.consSection}>
                <h4 className={styles.listTitle}>Considerations</h4>
                <ul className={styles.consList}>
                  {option.cons.map((con) => (
                    <li key={con}>
                      <ArrowRight size={13} className={styles.arrowIcon} />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.note}>
        <p>
          All options include SSL, DNS configuration, and professional email setup.
          {recommended === 'aws' && ' AWS is recommended because it consolidates with your existing infrastructure and avoids adding a new vendor relationship.'}
          {recommended === 'azure' && ' Azure is recommended because it integrates with your existing Microsoft ecosystem.'}
          {recommended === 'gcp' && ' Google Cloud is recommended based on your existing GCP infrastructure.'}
        </p>
      </div>
    </section>
  )
}
