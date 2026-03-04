import type { DiscoveryConfig, HostingScore, HostingOptionId } from '../types/discovery'

interface ScoringRule {
  condition: (config: DiscoveryConfig) => boolean
  points: number
  reason: string
}

function domainDnsMatchesProvider(config: DiscoveryConfig, type: string): boolean {
  return config.domain_lookup?.detectedProviderType === type
}

const scoringRules: Record<HostingOptionId, ScoringRule[]> = {
  aws: [
    {
      condition: (c) => c.cloud_providers.includes('aws'),
      points: 10,
      reason: 'Already using AWS infrastructure',
    },
    {
      condition: (c) => domainDnsMatchesProvider(c, 'aws'),
      points: 7,
      reason: 'Domain DNS already hosted on AWS Route 53',
    },
    {
      condition: (c) => c.hipaa_hosting_required,
      points: 3,
      reason: 'HIPAA-eligible services available',
    },
    {
      condition: (c) => c.needs_baa,
      points: 2,
      reason: 'BAA agreements supported',
    },
    {
      condition: (c) => c.hosting_preference === 'managed',
      points: 1,
      reason: 'Managed hosting options with CloudFront',
    },
    {
      condition: () => true,
      points: 2,
      reason: 'Industry-leading reliability and ecosystem',
    },
  ],

  gcp: [
    {
      condition: (c) => c.cloud_providers.includes('gcp'),
      points: 10,
      reason: 'Already using Google Cloud infrastructure',
    },
    {
      condition: (c) => domainDnsMatchesProvider(c, 'gcp'),
      points: 7,
      reason: 'Domain DNS already hosted on Google Cloud',
    },
    {
      condition: (c) => c.hipaa_hosting_required,
      points: 3,
      reason: 'HIPAA BAA available for healthcare workloads',
    },
    {
      condition: (c) => c.needs_baa,
      points: 2,
      reason: 'BAA agreements supported',
    },
    {
      condition: (c) => c.doctor_count > 3,
      points: 1,
      reason: 'Strong data analytics for larger practices',
    },
    {
      condition: () => true,
      points: 1,
      reason: 'Premium global network',
    },
  ],

  azure: [
    {
      condition: (c) => c.cloud_providers.includes('azure'),
      points: 10,
      reason: 'Already using Azure infrastructure',
    },
    {
      condition: (c) => domainDnsMatchesProvider(c, 'azure'),
      points: 7,
      reason: 'Domain DNS already hosted on Azure',
    },
    {
      condition: (c) => c.uses_microsoft_365,
      points: 8,
      reason: 'Integrates with existing Microsoft 365 environment',
    },
    {
      condition: (c) => c.hipaa_hosting_required,
      points: 3,
      reason: 'HIPAA and SOC 2 compliance built in',
    },
    {
      condition: (c) => c.needs_baa,
      points: 2,
      reason: 'Enterprise BAA agreements available',
    },
    {
      condition: () => true,
      points: 1,
      reason: 'Enterprise-grade cloud platform',
    },
  ],

  vercel: [
    {
      condition: (c) =>
        c.project_type === 'new' && c.cloud_providers.includes('none'),
      points: 6,
      reason: 'Ideal for new projects without existing cloud infrastructure',
    },
    {
      condition: (c) => !c.hipaa_hosting_required,
      points: 2,
      reason: 'Simple deployment when HIPAA hosting is not required',
    },
    {
      condition: (c) => c.hosting_preference === 'managed',
      points: 2,
      reason: 'Fully managed platform with zero-config deployments',
    },
    {
      condition: () => true,
      points: 1,
      reason: 'Excellent developer experience and global CDN',
    },
  ],

  traditional: [
    {
      condition: (c) =>
        c.cloud_providers.includes('none') && !c.hipaa_hosting_required,
      points: 4,
      reason: 'Simple hosting for practices without compliance requirements',
    },
    {
      condition: (c) => c.has_professional_email && !c.uses_microsoft_365,
      points: 2,
      reason: 'All-in-one hosting and email bundling',
    },
    {
      condition: (c) => c.doctor_count <= 2 && c.bilingual_scope === 'none',
      points: 2,
      reason: 'Cost-effective for smaller, single-language practices',
    },
    {
      condition: () => true,
      points: 1,
      reason: 'Familiar management interfaces',
    },
  ],

  custom: [
    {
      condition: (c) => c.hosting_preference === 'self_managed',
      points: 8,
      reason: 'Matches preference for self-managed infrastructure',
    },
    {
      condition: (c) => c.hipaa_hosting_required && c.needs_baa,
      points: 3,
      reason: 'Full control over compliance configurations',
    },
    {
      condition: (c) =>
        c.cloud_providers.includes('other'),
      points: 4,
      reason: 'Existing non-standard infrastructure can be leveraged',
    },
    {
      condition: () => true,
      points: 0,
      reason: '',
    },
  ],
}

export function scoreHostingOptions(config: DiscoveryConfig): HostingScore[] {
  const hostingIds: HostingOptionId[] = ['aws', 'gcp', 'azure', 'vercel', 'traditional', 'custom']

  return hostingIds
    .map((id) => {
      const rules = scoringRules[id]
      let score = 0
      const reasons: string[] = []

      for (const rule of rules) {
        if (rule.condition(config)) {
          score += rule.points
          if (rule.reason) {
            reasons.push(rule.reason)
          }
        }
      }

      return { id, score, reasons }
    })
    .sort((a, b) => b.score - a.score)
}

export function getRecommendedHosting(config: DiscoveryConfig): HostingOptionId {
  const scores = scoreHostingOptions(config)
  return scores[0].id
}
