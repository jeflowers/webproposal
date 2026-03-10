import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DiscoveryConfig, ConfiguredProposal, Quote } from '../types/discovery'
import { DEFAULT_CONFIG } from '../types/discovery'
import { generateProposalConfig } from './configEngine'
import { supabase } from '../lib/supabase'

const QUOTE_NUMBER_REGEX = /^MEC-WEB-\d{4}(-v\d+)?$/
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface ActiveSelections {
  selectedPhase1: Set<string>
  selectedAddOns: Set<string>
  selectedMonthly: Set<string>
}

interface DiscoveryContextValue {
  config: DiscoveryConfig
  proposalConfig: ConfiguredProposal
  setConfig: (config: DiscoveryConfig) => void
  configId: string | null
  loading: boolean
  saveConfig: (practiceName: string, contactEmail: string) => Promise<string | null>
  currentQuote: Quote | null
  quoteLoading: boolean
  quoteNotFound: boolean
  createQuote: (practiceName: string, contactEmail: string) => Promise<Quote | null>
  saveQuoteCustomizations: (
    selectedPhase1: string[],
    selectedAddOns: string[],
    selectedMonthly: string[]
  ) => Promise<boolean>
  createQuoteVersion: (practiceName: string, contactEmail: string) => Promise<Quote | null>
  loadQuote: (quoteNumber: string) => Promise<boolean>
  activeSelections: ActiveSelections
  updatePhase1Selection: (updater: (prev: Set<string>) => Set<string>) => void
  updateAddOnSelection: (updater: (prev: Set<string>) => Set<string>) => void
  updateMonthlySelection: (updater: (prev: Set<string>) => Set<string>) => void
  selectedTemplateId: string | null
  setSelectedTemplateId: (id: string | null) => void
  saveDraft: (currentStep: number, practiceName: string, contactEmail: string) => Promise<string | null>
  loadDraft: (draftId: string) => Promise<{ step: number; practiceName: string; contactEmail: string } | null>
  draftId: string | null
}

const SESSION_TOKEN_KEY = 'discovery_session_token'

function getSessionToken(): string {
  let token = localStorage.getItem(SESSION_TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(SESSION_TOKEN_KEY, token)
  }
  return token
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null)

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams()
  const [config, setConfigState] = useState<DiscoveryConfig>(DEFAULT_CONFIG)
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const currentQuoteRef = useRef(currentQuote)
  currentQuoteRef.current = currentQuote
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteNotFound, setQuoteNotFound] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [draftId, setDraftId] = useState<string | null>(null)

  const proposalConfig = useMemo(() => generateProposalConfig(config), [config])

  const [activeSelections, setActiveSelections] = useState<ActiveSelections>({
    selectedPhase1: new Set(proposalConfig.preSelectedPhase1),
    selectedAddOns: new Set(proposalConfig.preSelectedAddOns),
    selectedMonthly: new Set(proposalConfig.preSelectedMonthly),
  })

  const updatePhase1Selection = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setActiveSelections(prev => ({
      ...prev,
      selectedPhase1: updater(prev.selectedPhase1),
    }))
  }, [])

  const updateAddOnSelection = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setActiveSelections(prev => ({
      ...prev,
      selectedAddOns: updater(prev.selectedAddOns),
    }))
  }, [])

  const updateMonthlySelection = useCallback((updater: (prev: Set<string>) => Set<string>) => {
    setActiveSelections(prev => ({
      ...prev,
      selectedMonthly: updater(prev.selectedMonthly),
    }))
  }, [])

  useEffect(() => {
    if (currentQuote?.customizations) {
      setActiveSelections({
        selectedPhase1: new Set(currentQuote.customizations.selectedPhase1),
        selectedAddOns: new Set(currentQuote.customizations.selectedAddOns),
        selectedMonthly: new Set(currentQuote.customizations.selectedMonthly),
      })
    }
  }, [currentQuote])

  const preSelectedKey = useMemo(
    () => JSON.stringify([proposalConfig.preSelectedPhase1, proposalConfig.preSelectedAddOns, proposalConfig.preSelectedMonthly]),
    [proposalConfig.preSelectedPhase1, proposalConfig.preSelectedAddOns, proposalConfig.preSelectedMonthly]
  )

  useEffect(() => {
    if (!currentQuote) {
      setActiveSelections({
        selectedPhase1: new Set(proposalConfig.preSelectedPhase1),
        selectedAddOns: new Set(proposalConfig.preSelectedAddOns),
        selectedMonthly: new Set(proposalConfig.preSelectedMonthly),
      })
    }
  }, [preSelectedKey, currentQuote])

  const setConfig = useCallback((newConfig: DiscoveryConfig) => {
    setConfigState(newConfig)
  }, [])

  const loadQuote = useCallback(
    async (quoteNumber: string): Promise<boolean> => {
      setQuoteLoading(true)
      setQuoteNotFound(false)

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('quote_number', quoteNumber)
        .maybeSingle()

      setQuoteLoading(false)

      if (error || !data) {
        setQuoteNotFound(true)
        return false
      }

      const quote = data as Quote
      setCurrentQuote(quote)
      setConfigState(quote.config_snapshot)
      setConfigId(quote.discovery_config_id)

      return true
    },
    []
  )

  const urlQuoteNumber = searchParams.get('quote')
  const urlConfigParam = searchParams.get('config')

  useEffect(() => {
    if (urlQuoteNumber) {
      if (!QUOTE_NUMBER_REGEX.test(urlQuoteNumber)) {
        setQuoteNotFound(true)
        return
      }
      if (currentQuoteRef.current?.quote_number === urlQuoteNumber) return

      ;(async () => {
        await loadQuote(urlQuoteNumber)
      })()

      return
    }

    if (urlConfigParam) {
      if (!UUID_REGEX.test(urlConfigParam)) return
      if (urlConfigParam === configId) return

      let cancelled = false
      setLoading(true)
      ;(async () => {
        const { data, error } = await supabase
          .from('discovery_configs')
          .select('config_data')
          .eq('id', urlConfigParam)
          .maybeSingle()

        if (cancelled) return

        if (!error && data?.config_data) {
          setConfigState(data.config_data as DiscoveryConfig)
          setConfigId(urlConfigParam)
        }
        setLoading(false)
      })()

      return () => { cancelled = true }
    }
  }, [urlQuoteNumber, urlConfigParam, configId, loadQuote])

  const saveConfig = useCallback(
    async (practiceName: string, contactEmail: string): Promise<string | null> => {
      const proposal = generateProposalConfig(config)

      const { data, error } = await supabase
        .from('discovery_configs')
        .insert({
          practice_name: practiceName,
          contact_email: contactEmail,
          config_data: config,
          proposal_config: proposal,
        })
        .select('id')
        .maybeSingle()

      if (error || !data) return null

      setConfigId(data.id)
      return data.id
    },
    [config]
  )

  const createQuote = useCallback(
    async (practiceName: string, contactEmail: string): Promise<Quote | null> => {
      try {
        let discoveryConfigId = configId

        if (!discoveryConfigId) {
          discoveryConfigId = await saveConfig(practiceName, contactEmail)
          if (!discoveryConfigId) {
            console.error('Failed to save discovery config')
            return null
          }
        }

        const proposal = generateProposalConfig(config)

        const { data: maxData } = await supabase
          .from('quotes')
          .select('quote_number')
          .like('quote_number', 'MEC-WEB-____')
          .order('quote_number', { ascending: false })
          .limit(1)

        let nextNumber = 1
        if (maxData && maxData.length > 0) {
          const match = maxData[0].quote_number.match(/MEC-WEB-(\d+)$/)
          if (match) {
            nextNumber = parseInt(match[1], 10) + 1
          }
        }

        const quoteNumber = `MEC-WEB-${String(nextNumber).padStart(4, '0')}`

        const { data, error } = await supabase
          .from('quotes')
          .insert({
            quote_number: quoteNumber,
            version: 1,
            parent_quote_id: null,
            discovery_config_id: discoveryConfigId,
            practice_name: practiceName,
            contact_email: contactEmail,
            config_snapshot: config,
            proposal_snapshot: proposal,
            customizations: {
              selectedPhase1: Array.from(activeSelections.selectedPhase1),
              selectedAddOns: Array.from(activeSelections.selectedAddOns),
              selectedMonthly: Array.from(activeSelections.selectedMonthly),
            },
            template_id: selectedTemplateId || null,
            status: 'draft',
          })
          .select()
          .maybeSingle()

        if (error) {
          console.error('Failed to create quote:', error)
          return null
        }

        if (!data) {
          console.error('No data returned from quote creation')
          return null
        }

        const quote = data as Quote
        setCurrentQuote(quote)

        return quote
      } catch (err) {
        console.error('Error in createQuote:', err)
        return null
      }
    },
    [config, configId, saveConfig, activeSelections, selectedTemplateId]
  )

  const saveQuoteCustomizations = useCallback(
    async (
      selectedPhase1: string[],
      selectedAddOns: string[],
      selectedMonthly: string[]
    ): Promise<boolean> => {
      if (!currentQuote) return false

      const { error } = await supabase
        .from('quotes')
        .update({
          customizations: {
            selectedPhase1,
            selectedAddOns,
            selectedMonthly,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentQuote.id)

      if (error) return false

      setCurrentQuote((prev) =>
        prev
          ? {
              ...prev,
              customizations: { selectedPhase1, selectedAddOns, selectedMonthly },
              updated_at: new Date().toISOString(),
            }
          : null
      )

      return true
    },
    [currentQuote]
  )

  const saveDraft = useCallback(
    async (currentStep: number, practiceName: string, contactEmail: string): Promise<string | null> => {
      const sessionToken = getSessionToken()

      if (draftId) {
        const { error } = await supabase
          .from('discovery_drafts')
          .update({
            config_data: config,
            current_step: currentStep,
            practice_name: practiceName,
            contact_email: contactEmail,
            updated_at: new Date().toISOString(),
          })
          .eq('id', draftId)

        if (error) return null
        return draftId
      }

      const { data, error } = await supabase
        .from('discovery_drafts')
        .insert({
          session_token: sessionToken,
          config_data: config,
          current_step: currentStep,
          practice_name: practiceName,
          contact_email: contactEmail,
        })
        .select('id')
        .maybeSingle()

      if (error || !data) return null

      setDraftId(data.id)

      const url = new URL(window.location.href)
      url.searchParams.set('draft', data.id)
      window.history.replaceState(null, '', url.toString())

      return data.id
    },
    [config, draftId]
  )

  const loadDraft = useCallback(
    async (id: string): Promise<{ step: number; practiceName: string; contactEmail: string } | null> => {
      const { data, error } = await supabase
        .from('discovery_drafts')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error || !data) return null

      setConfigState(data.config_data as DiscoveryConfig)
      setDraftId(data.id)

      return {
        step: data.current_step,
        practiceName: data.practice_name,
        contactEmail: data.contact_email,
      }
    },
    []
  )

  const createQuoteVersion = useCallback(
    async (practiceName: string, contactEmail: string): Promise<Quote | null> => {
      if (!currentQuote) return null

      const proposal = generateProposalConfig(config)
      const newVersion = currentQuote.version + 1
      const baseQuoteNumber = currentQuote.quote_number.replace(/-v\d+$/, '')
      const newQuoteNumber = `${baseQuoteNumber}-v${newVersion}`

      const { data, error } = await supabase
        .from('quotes')
        .insert({
          quote_number: newQuoteNumber,
          version: newVersion,
          parent_quote_id: currentQuote.parent_quote_id || currentQuote.id,
          discovery_config_id: currentQuote.discovery_config_id,
          practice_name: practiceName,
          contact_email: contactEmail,
          config_snapshot: config,
          proposal_snapshot: proposal,
          customizations: {
            selectedPhase1: Array.from(activeSelections.selectedPhase1),
            selectedAddOns: Array.from(activeSelections.selectedAddOns),
            selectedMonthly: Array.from(activeSelections.selectedMonthly),
          },
          status: 'draft',
        })
        .select()
        .maybeSingle()

      if (error || !data) return null

      const quote = data as Quote
      setCurrentQuote(quote)
      return quote
    },
    [currentQuote, config, activeSelections]
  )

  return (
    <DiscoveryContext.Provider
      value={{
        config,
        proposalConfig,
        setConfig,
        configId,
        loading,
        saveConfig,
        currentQuote,
        quoteLoading,
        quoteNotFound,
        createQuote,
        saveQuoteCustomizations,
        createQuoteVersion,
        loadQuote,
        activeSelections,
        updatePhase1Selection,
        updateAddOnSelection,
        updateMonthlySelection,
        selectedTemplateId,
        setSelectedTemplateId,
        saveDraft,
        loadDraft,
        draftId,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  )
}

export function useDiscovery(): DiscoveryContextValue {
  const ctx = useContext(DiscoveryContext)
  if (!ctx) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider')
  }
  return ctx
}
