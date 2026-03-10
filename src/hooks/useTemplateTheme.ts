import { useAiContent } from '../config/AiContentContext'
import { templates, type TemplateTheme } from '../data/templateData'

export function useTemplateTheme(): TemplateTheme | null {
  const { content } = useAiContent()
  const templateId = content?._templateId
  if (!templateId) return null
  return templates.find(t => t.id === templateId) || null
}
