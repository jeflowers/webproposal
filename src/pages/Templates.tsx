import { useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getTemplateById } from '../data/templateData'
import TemplateGallery from '../components/templates/TemplateGallery'
import TemplatePreview from '../components/templates/TemplatePreview'
import CustomRequestForm from '../components/templates/CustomRequestForm'

type View = 'gallery' | 'preview' | 'custom'

export default function Templates() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const previewId = searchParams.get('preview')
  const showCustom = searchParams.get('view') === 'custom'

  const currentView: View = previewId ? 'preview' : showCustom ? 'custom' : 'gallery'
  const template = previewId ? getTemplateById(previewId) : null

  const handlePreview = useCallback((id: string) => {
    setSearchParams({ preview: id })
  }, [setSearchParams])

  const handleBackToGallery = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  const handleCustomRequest = useCallback(() => {
    setSearchParams({ view: 'custom' })
  }, [setSearchParams])

  const handleSelectTemplate = useCallback((_id: string) => {
    navigate('/discovery')
  }, [navigate])

  if (currentView === 'preview' && template) {
    return (
      <TemplatePreview
        template={template}
        onBack={handleBackToGallery}
        onSelect={handleSelectTemplate}
      />
    )
  }

  if (currentView === 'custom') {
    return <CustomRequestForm onBack={handleBackToGallery} />
  }

  return (
    <TemplateGallery
      onPreview={handlePreview}
      onCustomRequest={handleCustomRequest}
    />
  )
}
