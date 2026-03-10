import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { DiscoveryConfig } from '../types/discovery'

export interface AiServiceItem {
  name: string
  description: string
}

export interface AiContent {
  hero: {
    practiceName: string
    tagline1: string
    tagline2: string
  }
  services: {
    heading: string
    subheading: string
    items: AiServiceItem[]
  }
  about: {
    heading: string
    text1: string
    text2: string
    stats: {
      yearsExp: string
      patients: string
      specialists: string
      locations: string
    }
  }
  contact: {
    heading: string
    subheading: string
  }
  footer: {
    brandText: string
  }
  _templateId?: string
  ageGuide?: {
    heading: string
    groups: Array<{
      label: string
      ageRange: string
      description: string
      treatments: string[]
    }>
  }
  statBar?: Array<{
    prefix?: string
    value: number
    suffix?: string
    label: string
  }>
  closingStatement?: {
    headline: string
    linkText: string
  }
  surgeonCredential?: string
  surgeonSpecialty?: string
}

interface AiContentContextValue {
  content: AiContent | null
  loading: boolean
  error: string | null
  generate: (config: DiscoveryConfig, practiceName: string, templateId?: string, toneDirective?: string) => Promise<void>
}

const AiContentContext = createContext<AiContentContextValue | null>(null)

export function AiContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AiContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (config: DiscoveryConfig, practiceName: string, templateId?: string, toneDirective?: string) => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-site-content`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          practice_name: practiceName,
          specialty: 'ophthalmology',
          template_id: templateId || undefined,
          tone_directive: toneDirective || undefined,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Generation failed (${response.status})`)
      }

      const data: AiContent = await response.json()
      if (templateId) {
        data._templateId = templateId
      }
      setContent(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Content generation failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AiContentContext.Provider value={{ content, loading, error, generate }}>
      {children}
    </AiContentContext.Provider>
  )
}

export function useAiContent(): AiContentContextValue {
  const ctx = useContext(AiContentContext)
  if (!ctx) {
    throw new Error('useAiContent must be used within an AiContentProvider')
  }
  return ctx
}
