import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface DiscoveryConfig {
  practice_name?: string;
  project_type?: string;
  doctor_count?: number;
  has_existing_branding?: boolean;
  bilingual_scope?: string;
  patient_languages?: string[];
  accepts_referrals?: boolean;
  wants_online_scheduling?: boolean;
  needs_patient_portal?: boolean;
  phone_system?: string;
  ehr_system?: string;
  problem_statement?: string;
  website_frustrations?: string;
  website_wishes?: string;
  page_order?: string[];
  current_forms?: string[];
  additional_pages?: string[];
}

interface GenerateRequest {
  config: DiscoveryConfig;
  practice_name: string;
  specialty?: string;
  template_id?: string;
  tone_directive?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { config, practice_name, specialty, tone_directive, template_id }: GenerateRequest = await req.json();

    const practiceType = specialty || "ophthalmology";
    const name = practice_name || "Our Practice";
    const doctorCount = config.doctor_count || 2;
    const isBilingual = config.bilingual_scope && config.bilingual_scope !== "none";
    const languages = config.patient_languages?.join(", ") || "English";
    const hasScheduling = config.wants_online_scheduling;
    const hasPortal = config.needs_patient_portal;
    const acceptsReferrals = config.accepts_referrals;
    const pageOrder = config.page_order || ["Home", "Services", "About", "Doctors", "Forms", "Contact"];
    const frustrations = config.website_frustrations || "";
    const wishes = config.website_wishes || "";
    const problemStatement = config.problem_statement || "";

    const isAlvarado = template_id === "alvarado-authority";
    const isMinimal = template_id === "pure-minimal";

    let templateFields = "";
    if (isAlvarado) {
      templateFields = `,
  "surgeonCredential": "Dr. [Name], MD - use a realistic name",
  "surgeonSpecialty": "Specializing in [2-3 key specialties]",
  "ageGuide": {
    "heading": "heading for age-based treatment guide",
    "groups": [
      { "label": "Young Adults", "ageRange": "18-40", "description": "brief description of eye care needs", "treatments": ["treatment1", "treatment2", "treatment3"] },
      { "label": "Adults", "ageRange": "40-60", "description": "brief description of eye care needs", "treatments": ["treatment1", "treatment2", "treatment3"] },
      { "label": "Seniors", "ageRange": "60+", "description": "brief description of eye care needs", "treatments": ["treatment1", "treatment2", "treatment3"] }
    ]
  }`;
    } else if (isMinimal) {
      templateFields = `,
  "statBar": [
    { "value": 15000, "suffix": "+", "label": "stat label like Patients Treated" },
    { "value": 25, "suffix": "+", "label": "stat label like Years Experience" },
    { "value": 98, "suffix": "%", "label": "stat label like Patient Satisfaction" },
    { "value": 6, "label": "stat label like Board-Certified Specialists" }
  ],
  "closingStatement": {
    "headline": "a single compelling closing sentence",
    "linkText": "short CTA text like Schedule a Visit"
  }`;
    }

    const prompt = `You are a professional medical website copywriter. Generate website content for a ${practiceType} practice called "${name}".

Practice details:
- Number of doctors: ${doctorCount}
- Languages served: ${languages}
- Bilingual: ${isBilingual ? "Yes" : "No"}
- Online scheduling: ${hasScheduling ? "Yes" : "No"}
- Patient portal: ${hasPortal ? "Yes" : "No"}
- Accepts referrals: ${acceptsReferrals ? "Yes" : "No"}
- Pages: ${pageOrder.join(", ")}
${frustrations ? `- Current website frustrations: ${frustrations}` : ""}
${wishes ? `- Website wishes: ${wishes}` : ""}
${problemStatement ? `- Key problem to solve: ${problemStatement}` : ""}

Generate JSON content for these website sections. Keep copy professional, warm, and patient-focused. Use the practice name "${name}" throughout. Do NOT use generic placeholder text.

Return ONLY valid JSON with this exact structure (no markdown, no code fences):
{
  "hero": {
    "practiceName": "${name}",
    "tagline1": "a compelling tagline about the practice",
    "tagline2": "a secondary supporting tagline"
  },
  "services": {
    "heading": "section heading for services",
    "subheading": "brief paragraph about the practice services",
    "items": [
      { "name": "service name", "description": "2-sentence service description" }
    ]
  },
  "about": {
    "heading": "section heading",
    "text1": "first paragraph about the practice (3-4 sentences)",
    "text2": "second paragraph about expertise and approach (2-3 sentences)",
    "stats": {
      "yearsExp": "number or range",
      "patients": "approximate number served",
      "specialists": "count or descriptor",
      "locations": "count or descriptor"
    }
  },
  "contact": {
    "heading": "section heading",
    "subheading": "brief welcoming text about getting in touch"
  },
  "footer": {
    "brandText": "brief practice description for footer (1-2 sentences)"
  }${templateFields}
}

Requirements:
- All content must be specific to a ${practiceType} practice, not generic
- Services should be realistic ${practiceType} services (provide 6 services)
- Stats should be plausible for a practice with ${doctorCount} doctors
- Tone: professional, trustworthy, compassionate
- Do not include any markdown formatting or code fences in the response${tone_directive ? `\n\nTone and Style:\n${tone_directive}` : ""}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({ error: "AI generation failed", details: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const textContent = result.content?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(textContent);
    } catch {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return new Response(
          JSON.stringify({ error: "Failed to parse AI response" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (template_id) {
      parsed._templateId = template_id;
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
