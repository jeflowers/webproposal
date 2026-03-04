import jsPDF from 'jspdf'
import { discoveryHelpContent } from '../data/discoveryHelpContent'

const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20
const MARGIN_TOP = 25
const MARGIN_BOTTOM = 25
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT

const COLORS = {
  primary: [14, 124, 123] as [number, number, number],
  text: [30, 41, 59] as [number, number, number],
  textLight: [100, 116, 139] as [number, number, number],
  textMuted: [148, 163, 184] as [number, number, number],
  accent: [146, 96, 10] as [number, number, number],
  border: [226, 232, 240] as [number, number, number],
  bgAlt: [247, 249, 251] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  accentBg: [254, 249, 238] as [number, number, number],
}

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage()
    return MARGIN_TOP
  }
  return y
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth) as string[]
}

export function generateGuidePdf(): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...COLORS.primary)
  doc.text('Discovery Intake Form', MARGIN_LEFT, MARGIN_TOP)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.setTextColor(...COLORS.text)
  doc.text('Completion Guide', MARGIN_LEFT, MARGIN_TOP + 8)

  doc.setFontSize(8)
  doc.setTextColor(...COLORS.textMuted)
  doc.text(
    'This guide provides instructions for filling out all 8 sections of the Discovery Intake Form.',
    MARGIN_LEFT,
    MARGIN_TOP + 16
  )
  doc.text(
    'Fields marked with a warning icon directly affect scope and pricing.',
    MARGIN_LEFT,
    MARGIN_TOP + 21
  )

  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.3)
  doc.line(MARGIN_LEFT, MARGIN_TOP + 26, PAGE_WIDTH - MARGIN_RIGHT, MARGIN_TOP + 26)

  let y = MARGIN_TOP + 34

  for (const section of discoveryHelpContent) {
    y = checkPageBreak(doc, y, 30)

    doc.setFillColor(...COLORS.primary)
    doc.circle(MARGIN_LEFT + 4, y + 1, 4, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...COLORS.white)
    doc.text(String(section.sectionIndex + 1), MARGIN_LEFT + 4, y + 2, {
      align: 'center',
    })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COLORS.text)
    doc.text(section.title, MARGIN_LEFT + 12, y + 2.5)

    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...COLORS.textMuted)
    const descLines = wrapText(doc, section.description, CONTENT_WIDTH - 12)
    doc.text(descLines, MARGIN_LEFT + 12, y)
    y += descLines.length * 4 + 6

    for (const field of section.fields) {
      const guidanceLines = wrapText(doc, field.guidance, CONTENT_WIDTH - 10)
      const exampleLines = field.example
        ? wrapText(doc, field.example, CONTENT_WIDTH - 16)
        : []
      const pricingLines = field.pricingImpact
        ? wrapText(doc, field.pricingImpact, CONTENT_WIDTH - 16)
        : []

      const cardHeight =
        8 +
        guidanceLines.length * 3.5 +
        (exampleLines.length > 0 ? exampleLines.length * 3.5 + 10 : 0) +
        (pricingLines.length > 0 ? pricingLines.length * 3.5 + 10 : 0) +
        6

      y = checkPageBreak(doc, y, cardHeight)

      doc.setFillColor(...COLORS.bgAlt)
      doc.setDrawColor(...COLORS.border)
      doc.setLineWidth(0.2)
      doc.roundedRect(MARGIN_LEFT, y, CONTENT_WIDTH, cardHeight, 2, 2, 'FD')

      y += 5

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(...COLORS.text)
      const questionLines = wrapText(doc, field.question, CONTENT_WIDTH - 10)
      doc.text(questionLines, MARGIN_LEFT + 5, y)
      y += questionLines.length * 3.5 + 3

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...COLORS.textLight)
      doc.text(guidanceLines, MARGIN_LEFT + 5, y)
      y += guidanceLines.length * 3.5

      if (exampleLines.length > 0) {
        y += 3

        doc.setFillColor(...COLORS.white)
        const exampleBlockH = exampleLines.length * 3.5 + 6
        doc.roundedRect(MARGIN_LEFT + 5, y - 2, CONTENT_WIDTH - 10, exampleBlockH, 1, 1, 'F')
        doc.setFillColor(...COLORS.primary)
        doc.rect(MARGIN_LEFT + 5, y - 2, 1.2, exampleBlockH, 'F')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(5.5)
        doc.setTextColor(...COLORS.primary)
        doc.text('EXAMPLE', MARGIN_LEFT + 9, y + 1)

        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7)
        doc.setTextColor(...COLORS.textLight)
        doc.text(exampleLines, MARGIN_LEFT + 9, y + 5)
        y += exampleBlockH + 2
      }

      if (pricingLines.length > 0) {
        y += 2

        doc.setFillColor(...COLORS.accentBg)
        const pricingBlockH = pricingLines.length * 3.5 + 5
        doc.roundedRect(
          MARGIN_LEFT + 5,
          y - 2,
          CONTENT_WIDTH - 10,
          pricingBlockH,
          1,
          1,
          'F'
        )

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6)
        doc.setTextColor(...COLORS.accent)
        doc.text('PRICING IMPACT', MARGIN_LEFT + 9, y + 1)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(...COLORS.accent)
        doc.text(pricingLines, MARGIN_LEFT + 9, y + 5)
        y += pricingBlockH + 2
      }

      y += 6
    }

    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.2)
    y = checkPageBreak(doc, y, 8)
    doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y)
    y += 10
  }

  y = checkPageBreak(doc, y, 50)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COLORS.text)
  doc.text('Quick Reference Summary', MARGIN_LEFT, y)
  y += 8

  const summaryData = [
    ['1', 'Practice narrative, pain points, goals, design inspiration'],
    ['2', 'Redesign vs. new; domain status; M365 usage'],
    ['3', 'Doctor count; branding assets; additional pages'],
    ['4', 'Form types; physician referral acceptance'],
    ['5', 'HIPAA hosting; BAA requirement'],
    ['6', 'Language selection; bilingual depth'],
    ['7', 'Phone system; EHR; online scheduling; patient portal'],
    ['8', 'Managed hosting; maintenance plan; email account count'],
  ]

  const col1W = 20

  doc.setFillColor(...COLORS.bgAlt)
  doc.setDrawColor(...COLORS.border)
  doc.setLineWidth(0.2)
  doc.roundedRect(MARGIN_LEFT, y - 2, CONTENT_WIDTH, 8, 1, 1, 'FD')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.setTextColor(...COLORS.text)
  doc.text('Section', MARGIN_LEFT + 4, y + 3)
  doc.text('Key Decision Points', MARGIN_LEFT + col1W + 4, y + 3)
  y += 9

  for (const [num, desc] of summaryData) {
    y = checkPageBreak(doc, y, 8)

    doc.setDrawColor(...COLORS.border)
    doc.setLineWidth(0.1)
    doc.line(MARGIN_LEFT, y + 5, MARGIN_LEFT + CONTENT_WIDTH, y + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...COLORS.primary)
    doc.text(num, MARGIN_LEFT + 4, y + 3)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...COLORS.textLight)
    doc.text(desc, MARGIN_LEFT + col1W + 4, y + 3)
    y += 7
  }

  y += 8
  y = checkPageBreak(doc, y, 12)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7)
  doc.setTextColor(...COLORS.textMuted)
  const reminderLines = wrapText(
    doc,
    'Reminder: All fields marked with a pricing impact warning directly affect proposal scope and pricing. Ensure these are confirmed with the client before submitting the form.',
    CONTENT_WIDTH
  )
  doc.text(reminderLines, MARGIN_LEFT, y)

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...COLORS.textMuted)
    doc.text(
      `Discovery Intake Form - Completion Guide | Page ${i} of ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 12,
      { align: 'center' }
    )
  }

  doc.save('Discovery-Intake-Completion-Guide.pdf')
}
