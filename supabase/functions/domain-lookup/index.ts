import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RdapNameserver {
  ldhName?: string;
  objectClassName?: string;
}

interface RdapEvent {
  eventAction?: string;
  eventDate?: string;
}

interface RdapEntity {
  vcardArray?: unknown[];
  roles?: string[];
  publicIds?: { type: string; identifier: string }[];
  handle?: string;
}

interface RdapResponse {
  ldhName?: string;
  status?: string[];
  nameservers?: RdapNameserver[];
  events?: RdapEvent[];
  entities?: RdapEntity[];
}

interface DomainLookupResult {
  domain: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  nameservers: string[];
  status: string[];
  detectedProvider: string;
  detectedProviderType: string;
  error?: string;
}

const NAMESERVER_PATTERNS: { pattern: RegExp; provider: string; type: string }[] = [
  { pattern: /awsdns/i, provider: "Amazon Route 53", type: "aws" },
  { pattern: /amazonaws\.com/i, provider: "Amazon Route 53", type: "aws" },
  { pattern: /googledomains/i, provider: "Google Domains", type: "gcp" },
  { pattern: /google\.com/i, provider: "Google Cloud DNS", type: "gcp" },
  { pattern: /azure-dns/i, provider: "Azure DNS", type: "azure" },
  { pattern: /microsoft\.com/i, provider: "Azure DNS", type: "azure" },
  { pattern: /cloudflare/i, provider: "Cloudflare", type: "cloudflare" },
  { pattern: /domaincontrol\.com/i, provider: "GoDaddy", type: "registrar" },
  { pattern: /registrar-servers\.com/i, provider: "Namecheap", type: "registrar" },
  { pattern: /nsone\.net/i, provider: "NS1", type: "cdn" },
  { pattern: /dynect\.net/i, provider: "Dyn / Oracle", type: "cdn" },
  { pattern: /ultradns/i, provider: "UltraDNS / Neustar", type: "cdn" },
  { pattern: /wixdns/i, provider: "Wix", type: "website_builder" },
  { pattern: /squarespace/i, provider: "Squarespace", type: "website_builder" },
  { pattern: /wordpress/i, provider: "WordPress.com", type: "website_builder" },
  { pattern: /hostgator/i, provider: "HostGator", type: "shared_hosting" },
  { pattern: /bluehost/i, provider: "Bluehost", type: "shared_hosting" },
  { pattern: /siteground/i, provider: "SiteGround", type: "shared_hosting" },
];

function detectProvider(nameservers: string[]): { provider: string; type: string } {
  for (const ns of nameservers) {
    for (const { pattern, provider, type } of NAMESERVER_PATTERNS) {
      if (pattern.test(ns)) {
        return { provider, type };
      }
    }
  }
  return { provider: "Unknown", type: "unknown" };
}

function extractRegistrar(entities: RdapEntity[] | undefined): string {
  if (!entities) return "Unknown";
  for (const entity of entities) {
    if (entity.roles?.includes("registrar")) {
      if (entity.vcardArray && Array.isArray(entity.vcardArray[1])) {
        for (const field of entity.vcardArray[1] as unknown[][]) {
          if (field[0] === "fn") {
            return String(field[3]);
          }
        }
      }
      if (entity.handle) return entity.handle;
    }
  }
  return "Unknown";
}

function extractDate(events: RdapEvent[] | undefined, action: string): string {
  if (!events) return "";
  const event = events.find((e) => e.eventAction === action);
  return event?.eventDate ?? "";
}

function cleanDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.replace(/\/.*$/, "");
  return domain;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { domain: rawDomain } = await req.json();

    if (!rawDomain || typeof rawDomain !== "string") {
      return new Response(
        JSON.stringify({ error: "Domain is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const domain = cleanDomain(rawDomain);

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/.test(domain)) {
      return new Response(
        JSON.stringify({ error: "Invalid domain format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const rdapUrl = `https://rdap.org/domain/${domain}`;
    const rdapResponse = await fetch(rdapUrl, {
      headers: { Accept: "application/rdap+json" },
    });

    if (!rdapResponse.ok) {
      const status = rdapResponse.status;
      if (status === 404) {
        return new Response(
          JSON.stringify({ error: "Domain not found in RDAP registry" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ error: `RDAP lookup failed (HTTP ${status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data: RdapResponse = await rdapResponse.json();

    const nameservers = (data.nameservers ?? [])
      .map((ns) => ns.ldhName?.toLowerCase() ?? "")
      .filter(Boolean);

    const { provider, type } = detectProvider(nameservers);

    const result: DomainLookupResult = {
      domain,
      registrar: extractRegistrar(data.entities),
      registrationDate: extractDate(data.events, "registration"),
      expirationDate: extractDate(data.events, "expiration"),
      nameservers,
      status: data.status ?? [],
      detectedProvider: provider,
      detectedProviderType: type,
    };

    return new Response(JSON.stringify(result), {
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
