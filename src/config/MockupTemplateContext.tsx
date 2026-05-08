import { createContext, useContext, type ReactNode } from 'react'

interface MockupTemplateContextValue {
  selectedTemplateId: string | null
}

const MockupTemplateContext = createContext<MockupTemplateContextValue>({ selectedTemplateId: null })

export function MockupTemplateProvider({
  templateId,
  children,
}: {
  templateId: string | null
  children: ReactNode
}) {
  return (
    <MockupTemplateContext.Provider value={{ selectedTemplateId: templateId }}>
      {children}
    </MockupTemplateContext.Provider>
  )
}

export function useSelectedMockupTemplateId(): string | null {
  return useContext(MockupTemplateContext).selectedTemplateId
}
