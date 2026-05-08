import type { InspirationSite } from '../types/discovery'
import type { TemplateTheme } from '../data/templateData'
import { templates } from '../data/templateData'

export type DesignTrait =
  | 'clean'
  | 'modern'
  | 'professional'
  | 'approachable'
  | 'multi-location'
  | 'service-focused'
  | 'doctor-centric'
  | 'hospital-system'
  | 'boutique-practice'
  | 'corporate-medical'

export interface MockupTemplate {
  id: string
  name: string
  description: string
  designTraits: DesignTrait[]
  heroVariant: 'full-bleed' | 'split' | 'centered' | 'video-bg'
  navStyle: 'transparent-scroll' | 'solid' | 'minimal'
  doctorLayout: 'cards' | 'profiles' | 'grid'
  serviceLayout: 'icons-grid' | 'cards-row' | 'accordion' | 'tabs'
  colorScheme: 'clinical' | 'warm' | 'modern-dark' | 'earth-tones'
  sectionOrder: string[]
  theme: TemplateTheme
}

export interface TemplateMatch {
  template: MockupTemplate
  score: number
  matchedTraits: DesignTrait[]
  reason: string
}

const keywordTraitMap: Record<string, DesignTrait[]> = {
  'clean': ['clean'],
  'modern': ['modern'],
  'professional': ['professional'],
  'approachable': ['approachable'],
  'friendly': ['approachable'],
  'warm': ['approachable'],
  'personal': ['approachable'],
  'multiple locations': ['multi-location'],
  'multi-location': ['multi-location'],
  'across locations': ['multi-location'],
  'across multiple': ['multi-location'],
  'doctor profiles': ['doctor-centric'],
  'doctor': ['doctor-centric'],
  'physician': ['doctor-centric'],
  'surgeon': ['doctor-centric'],
  'service presentation': ['service-focused'],
  'services': ['service-focused'],
  'organize': ['service-focused'],
  'hospital': ['hospital-system'],
  'health system': ['hospital-system'],
  'health services': ['hospital-system'],
  'boutique': ['boutique-practice'],
  'specialty': ['boutique-practice'],
  'corporate': ['corporate-medical'],
  'professionalism': ['professional'],
}

function extractTraits(notes: string): Set<DesignTrait> {
  const lower = notes.toLowerCase()
  const traits = new Set<DesignTrait>()

  for (const [keyword, mappedTraits] of Object.entries(keywordTraitMap)) {
    if (lower.includes(keyword)) {
      mappedTraits.forEach(t => traits.add(t))
    }
  }

  return traits
}

function traitReasonLabel(trait: DesignTrait): string {
  const labels: Record<DesignTrait, string> = {
    'clean': 'clean design',
    'modern': 'modern aesthetic',
    'professional': 'professional feel',
    'approachable': 'approachable tone',
    'multi-location': 'multi-location support',
    'service-focused': 'service-focused layout',
    'doctor-centric': 'doctor-centric presentation',
    'hospital-system': 'health system style',
    'boutique-practice': 'boutique practice feel',
    'corporate-medical': 'corporate medical style',
  }
  return labels[trait]
}

const mockupTemplateRegistry: MockupTemplate[] = [
  {
    id: 'clearview',
    name: 'Modern Clinical',
    description: 'Clean, modern design with strong doctor profiles and clear service presentation.',
    designTraits: ['clean', 'modern', 'professional', 'approachable', 'doctor-centric', 'service-focused'],
    heroVariant: 'full-bleed',
    navStyle: 'transparent-scroll',
    doctorLayout: 'profiles',
    serviceLayout: 'icons-grid',
    colorScheme: 'clinical',
    sectionOrder: ['hero', 'services', 'about', 'doctors', 'forms', 'referral', 'contact', 'footer'],
    theme: templates.find(t => t.id === 'clearview')!,
  },
  {
    id: 'skylineeye',
    name: 'Multi-Location Hub',
    description: 'Organized multi-site layout for practices with multiple offices.',
    designTraits: ['multi-location', 'hospital-system', 'corporate-medical', 'service-focused', 'professional'],
    heroVariant: 'split',
    navStyle: 'solid',
    doctorLayout: 'grid',
    serviceLayout: 'tabs',
    colorScheme: 'clinical',
    sectionOrder: ['hero', 'services', 'doctors', 'about', 'forms', 'referral', 'contact', 'footer'],
    theme: templates.find(t => t.id === 'skylineeye')!,
  },
  {
    id: 'brighthorizon',
    name: 'Boutique Practice',
    description: 'Warm, approachable design emphasizing personal care and patient experience.',
    designTraits: ['approachable', 'boutique-practice', 'doctor-centric'],
    heroVariant: 'centered',
    navStyle: 'transparent-scroll',
    doctorLayout: 'cards',
    serviceLayout: 'cards-row',
    colorScheme: 'warm',
    sectionOrder: ['hero', 'about', 'services', 'doctors', 'forms', 'referral', 'contact', 'footer'],
    theme: templates.find(t => t.id === 'brighthorizon')!,
  },
  {
    id: 'precisioneye',
    name: 'Bold Specialist',
    description: 'Authoritative layout built for established multi-doctor specialist practices.',
    designTraits: ['modern', 'doctor-centric', 'professional'],
    heroVariant: 'split',
    navStyle: 'solid',
    doctorLayout: 'profiles',
    serviceLayout: 'icons-grid',
    colorScheme: 'clinical',
    sectionOrder: ['hero', 'doctors', 'services', 'about', 'forms', 'referral', 'contact', 'footer'],
    theme: templates.find(t => t.id === 'precisioneye')!,
  },
]

const DEFAULT_TEMPLATE_ID = 'clearview'

export function matchTemplates(
  inspirationSites: InspirationSite[],
  registry: MockupTemplate[] = mockupTemplateRegistry
): TemplateMatch[] {
  if (!inspirationSites || inspirationSites.length === 0) {
    return registry.map(template => ({
      template,
      score: template.id === DEFAULT_TEMPLATE_ID ? 0.5 : 0,
      matchedTraits: [],
      reason: template.id === DEFAULT_TEMPLATE_ID ? 'Default recommendation' : '',
    }))
  }

  const allTraits = new Set<DesignTrait>()
  inspirationSites.forEach(site => {
    extractTraits(site.notes).forEach(t => allTraits.add(t))
  })

  const totalTraits = allTraits.size || 1

  return registry
    .map(template => {
      const matched: DesignTrait[] = []
      for (const trait of template.designTraits) {
        if (allTraits.has(trait)) {
          matched.push(trait)
        }
      }

      const score = matched.length / totalTraits

      const reason = matched.length > 0
        ? `Matches your preference for ${matched.map(traitReasonLabel).join(', ')}`
        : ''

      return { template, score, matchedTraits: matched, reason }
    })
    .sort((a, b) => b.score - a.score)
}

export function getRecommendedTemplate(
  inspirationSites: InspirationSite[]
): TemplateMatch {
  const matches = matchTemplates(inspirationSites)
  return matches[0]
}

export function getMockupTemplateById(id: string): MockupTemplate | undefined {
  return mockupTemplateRegistry.find(t => t.id === id)
}

export function getAllMockupTemplates(): MockupTemplate[] {
  return mockupTemplateRegistry
}
