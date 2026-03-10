import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface QuoteEmailRequest {
  quote_id: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function generateEmailHTML(quote: any): string {
  const baseUrl = Deno.env.get('BASE_URL') || 'http://localhost:5173'
  const safeQuoteNumber = encodeURIComponent(quote.quote_number)
  const quoteUrl = `${baseUrl}/proposal?quote=${safeQuoteNumber}`

  const phase1Items = quote.customizations?.selectedPhase1 || []
  const addOns = quote.customizations?.selectedAddOns || []
  const monthlyItems = quote.customizations?.selectedMonthly || []

  let oneTimeTotal = 10000
  if (addOns.includes('ringcentral')) oneTimeTotal += 800
  if (addOns.includes('nextech')) oneTimeTotal += 1200
  if (addOns.includes('scheduling')) oneTimeTotal += 600
  if (addOns.includes('patient-portal')) oneTimeTotal += 1000
  if (addOns.includes('language-pack')) oneTimeTotal += 1200

  let monthlyTotal = 0
  if (monthlyItems.includes('hosting-monthly')) monthlyTotal += 50
  if (monthlyItems.includes('maintenance-monthly')) monthlyTotal += 200
  if (monthlyItems.includes('email-monthly')) monthlyTotal += 7

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote - ${escapeHtml(quote.quote_number)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #0fa8a0;
    }
    .quote-number {
      font-size: 24px;
      font-weight: 700;
      color: #0fa8a0;
      margin: 8px 0;
    }
    .practice-name {
      font-size: 18px;
      color: #666;
      margin: 8px 0;
    }
    .section {
      margin: 24px 0;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    .item {
      padding: 8px 0;
      display: flex;
      align-items: center;
    }
    .item:before {
      content: "✓";
      color: #0fa8a0;
      font-weight: bold;
      margin-right: 8px;
    }
    .totals {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 16px;
    }
    .total-row.main {
      font-size: 20px;
      font-weight: 700;
      color: #0fa8a0;
      border-top: 2px solid #0fa8a0;
      padding-top: 16px;
      margin-top: 8px;
    }
    .cta-button {
      display: inline-block;
      background: #0fa8a0;
      color: white;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      text-align: center;
      margin: 24px 0;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .validity {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px 16px;
      margin: 20px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="quote-number">${escapeHtml(quote.quote_number)}</div>
      <div class="practice-name">${escapeHtml(quote.practice_name || '')}</div>
    </div>

    <p>Thank you for your interest! Here's your customized website proposal:</p>

    <div class="section">
      <div class="section-title">Core Website & Forms (Phase 1)</div>
      ${phase1Items.length > 0 ? phase1Items.map((item: string) => `<div class="item">${escapeHtml(item)}</div>`).join('') : '<div class="item">Complete website solution</div>'}
    </div>

    ${addOns.length > 0 ? `
    <div class="section">
      <div class="section-title">Selected Add-Ons</div>
      ${addOns.map((addon: string) => {
        const addonNames: Record<string, string> = {
          'ringcentral': 'RingCentral Integration',
          'nextech': 'Nextech EHR Integration',
          'scheduling': 'Online Appointment Scheduling',
          'patient-portal': 'Patient Portal Enhancement',
          'language-pack': 'Additional Language Pack'
        }
        return `<div class="item">${escapeHtml(addonNames[addon] || addon)}</div>`
      }).join('')}
    </div>
    ` : ''}

    ${monthlyItems.length > 0 ? `
    <div class="section">
      <div class="section-title">Monthly Services (Optional)</div>
      ${monthlyItems.map((item: string) => {
        const monthlyNames: Record<string, string> = {
          'hosting-monthly': 'Hosting Costs',
          'maintenance-monthly': 'Maintenance & Support',
          'email-monthly': 'Email Service'
        }
        return `<div class="item">${escapeHtml(monthlyNames[item] || item)}</div>`
      }).join('')}
    </div>
    ` : ''}

    <div class="totals">
      <div class="total-row">
        <span>One-Time Investment:</span>
        <span>${formatCurrency(oneTimeTotal)}</span>
      </div>
      ${monthlyTotal > 0 ? `
      <div class="total-row">
        <span>Estimated Monthly:</span>
        <span>~${formatCurrency(monthlyTotal)}/month</span>
      </div>
      ` : ''}
      <div class="total-row main">
        <span>Total to Start:</span>
        <span>${formatCurrency(Math.round(oneTimeTotal / 2))} (50% deposit)</span>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${quoteUrl}" class="cta-button">View Full Proposal</a>
    </div>

    <div class="validity">
      <strong>⏰ This quote is valid for 30 days</strong>
    </div>

    <div class="footer">
      <p>Questions? Reply to this email or contact us directly.</p>
      <p style="color: #999; font-size: 12px;">Quote generated on ${new Date(quote.created_at).toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { quote_id }: QuoteEmailRequest = await req.json()

    if (!quote_id || typeof quote_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'quote_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(quote_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid quote_id format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: quote, error: fetchError } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quote_id)
      .single()

    if (fetchError || !quote) {
      return new Response(
        JSON.stringify({ error: 'Quote not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!quote.contact_email || !emailRegex.test(quote.contact_email)) {
      return new Response(
        JSON.stringify({ error: 'Quote has an invalid contact email' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const emailHTML = generateEmailHTML(quote)

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'quotes@yourdomain.com'

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [quote.contact_email],
        subject: `Your Website Proposal - ${quote.quote_number}`,
        html: emailHTML,
      }),
    })

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text()
      console.error('Resend API error:', resendError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const resendData = await resendResponse.json()
    console.log('📧 Email sent via Resend:', resendData)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: 'sent',
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', quote_id)

    if (updateError) {
      console.error('Failed to update quote status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update quote status' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Quote email sent successfully',
        quote_number: quote.quote_number,
        email_id: resendData.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in send-quote-email:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
