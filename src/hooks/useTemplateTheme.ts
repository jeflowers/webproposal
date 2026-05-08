import { useAiContent } from '../config/AiContentContext'
import { useSelectedMockupTemplateId } from '../config/MockupTemplateContext'
import { templates, type TemplateTheme } from '../data/templateData'

export function useTemplateTheme(): TemplateTheme | null {
  const { content } = useAiContent()
  const selectedId = useSelectedMockupTemplateId()
  const templateId = content?._templateId || selectedId
  if (!templateId) return null
  return templates.find(t => t.id === templateId) || null
}
