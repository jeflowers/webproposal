import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DiscoveryConfig, ConfiguredProposal, Quote } from '../types/discovery'
import { DEFAULT_CONFIG } from '../types/discovery'
import { generateProposalConfig } from './configEngine'
import { supabase } from '../lib/supabase'

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
}

const DiscoveryContext = createContext<DiscoveryContextValue | null>(null)

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams()
  const [config, setConfigState] = useState<DiscoveryConfig>(DEFAULT_CONFIG)
  const [configId, setConfigId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)

  const proposalConfig = generateProposalConfig(config)

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

  useEffect(() => {
    if (!currentQuote) {
      setActiveSelections({
        selectedPhase1: new Set(proposalConfig.preSelectedPhase1),
        selectedAddOns: new Set(proposalConfig.preSelectedAddOns),
        selectedMonthly: new Set(proposalConfig.preSelectedMonthly),
      })
    }
  }, [proposalConfig.preSelectedPhase1, proposalConfig.preSelectedAddOns, proposalConfig.preSelectedMonthly, currentQuote])

  const setConfig = useCallback((newConfig: DiscoveryConfig) => {
    setConfigState(newConfig)
  }, [])

  const loadQuote = useCallback(
    async (quoteNumber: string): Promise<boolean> => {
      setQuoteLoading(true)

      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('quote_number', quoteNumber)
        .maybeSingle()

      setQuoteLoading(false)

      if (error || !data) return false

      const quote = data as Quote
      setCurrentQuote(quote)
      setConfigState(quote.config_snapshot)
      setConfigId(quote.discovery_config_id)

      return true
    },
    []
  )

  useEffect(() => {
    const urlQuoteNumber = searchParams.get('quote')
    const urlConfigId = searchParams.get('config')

    if (urlQuoteNumber) {
      if (currentQuote?.quote_number === urlQuoteNumber) return

      ;(async () => {
        await loadQuote(urlQuoteNumber)
      })()

      return
    }

    if (urlConfigId) {
      if (urlConfigId === configId) return

      let cancelled = false
      setLoading(true)
      ;(async () => {
        const { data, error } = await supabase
          .from('discovery_configs')
          .select('config_data')
          .eq('id', urlConfigId)
          .maybeSingle()

        if (cancelled) return

        if (!error && data?.config_data) {
          setConfigState(data.config_data as DiscoveryConfig)
          setConfigId(urlConfigId)
        }
        setLoading(false)
      })()

      return () => { cancelled = true }
    }
  }, [searchParams, configId, currentQuote, loadQuote])

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
    [config, configId, saveConfig, activeSelections]
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
        createQuote,
        saveQuoteCustomizations,
        createQuoteVersion,
        loadQuote,
        activeSelections,
        updatePhase1Selection,
        updateAddOnSelection,
        updateMonthlySelection,
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
