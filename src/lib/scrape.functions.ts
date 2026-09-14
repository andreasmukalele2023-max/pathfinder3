import { createServerFn } from "@tanstack/react-start";

type InstKey = "UNAM" | "NUST" | "IUM" | "Welwitchia" | "TC" | "IOL" | "SBS" | "NIPAM";

const SEEDS: Record<InstKey, string[]> = {
  UNAM: [
    "https://www.unam.edu.na/prospectus",
    "https://www.unam.edu.na/undergraduate-programmes",
  ],
  NUST: [
    "https://www.nust.na/prospectus",
    "https://www.nust.na/faculties",
  ],
  IUM: ["https://www.ium.edu.na/faculties/"],
  Welwitchia: ["https://welwitchiauniversity.edu.na/programmes/"],
  TC: ["https://www.triumphantcollege.com/programmes"],
  IOL: ["https://iol.edu.na/programmes/"],
  SBS: ["https://www.sbsnamibia.com/qualifications/"],
  NIPAM: ["https://nipam.na/training/"],
};

const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const EXTRACT_PROMPT = `Extract EVERY undergraduate programme/course/qualification (degree, diploma, certificate) listed on this Namibian tertiary institution page.
For each programme return:
- name: full programme name
- faculty: faculty/school/department it belongs to (best guess if implicit)
- duration: e.g. "3 years", "4 years"
- minPoints: integer minimum admission points required (null if not stated)
- bestN: 5 or 6 (Namibian NSSCO best-N rule; default 6 if unclear)
- requirements: list of { subject, minGrade } where minGrade is an NSSCO letter A/B/C/D/E for any explicitly required subjects (English, Mathematics, Biology, Physical Science, Chemistry, Physics, etc.)
Return { "courses": [...] }.`;

const SCHEMA = {
  type: "object",
  properties: {
    courses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          faculty: { type: "string" },
          duration: { type: "string" },
          minPoints: { type: ["integer", "null"] },
          bestN: { type: "integer" },
          requirements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                subject: { type: "string" },
                minGrade: { type: "string" },
              },
              required: ["subject", "minGrade"],
            },
          },
        },
        required: ["name"],
      },
    },
  },
  required: ["courses"],
};

export interface ScrapedCourseRow {
  id?: string;
  institution_key: string;
  name: string;
  faculty: string | null;
  duration: string | null;
  min_points: number | null;
  best_n: number;
  requirements: { subject: string; minGrade: string }[];
  source_url: string | null;
  scraped_at?: string;
}

export const scrapeInstitution = createServerFn({ method: "POST" })
  .inputValidator((d: { institutionKey: InstKey }) => d)
  .handler(async ({ data }) => {
    const urls = SEEDS[data.institutionKey];
    if (!urls) throw new Error("Unknown institution");
    const LOVABLE = process.env.LOVABLE_API_KEY;
    const FC = process.env.FIRECRAWL_API_KEY;
    if (!LOVABLE || !FC) throw new Error("Missing Firecrawl credentials");

    const collected: Array<Record<string, unknown> & { source_url: string }> = [];
    const errors: string[] = [];

    for (const url of urls) {
      try {
        const res = await fetch(`${GATEWAY}/scrape`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE}`,
            "X-Connection-Api-Key": FC,
          },
          body: JSON.stringify({
            url,
            formats: [{ type: "json", prompt: EXTRACT_PROMPT, schema: SCHEMA }],
            onlyMainContent: true,
            waitFor: 1500,
          }),
        });
        if (!res.ok) {
          errors.push(`${url}: ${res.status} ${await res.text().catch(() => "")}`.slice(0, 300));
          continue;
        }
        const body = (await res.json()) as {
          data?: { json?: { courses?: unknown[] } };
          json?: { courses?: unknown[] };
        };
        const courses =
          (body?.data?.json?.courses as unknown[] | undefined) ??
          (body?.json?.courses as unknown[] | undefined) ??
          [];
        for (const c of courses) {
          if (c && typeof c === "object") collected.push({ ...(c as Record<string, unknown>), source_url: url });
        }
      } catch (e) {
        errors.push(`${url}: ${(e as Error).message}`.slice(0, 300));
      }
    }

    const seen = new Set<string>();
    const rows: ScrapedCourseRow[] = [];
    for (const c of collected) {
      const name = String(c.name ?? "").trim();
      if (!name || seen.has(name.toLowerCase())) continue;
      seen.add(name.toLowerCase());
      const mp = c.minPoints;
      rows.push({
        institution_key: data.institutionKey,
        name: name.slice(0, 300),
        faculty: (c.faculty as string) ?? null,
        duration: (c.duration as string) ?? null,
        min_points: typeof mp === "number" ? mp : null,
        best_n: c.bestN === 5 ? 5 : 6,
        requirements: Array.isArray(c.requirements)
          ? (c.requirements as { subject: string; minGrade: string }[]).filter(
              (r) => r && r.subject && r.minGrade,
            )
          : [],
        source_url: c.source_url,
      });
    }

    if (rows.length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("scraped_courses").delete().eq("institution_key", data.institutionKey);
      const { error } = await supabaseAdmin.from("scraped_courses").insert(rows);
      if (error) throw new Error(error.message);
    }

    return { count: rows.length, errors, courses: rows };
  });

export const listScrapedCourses = createServerFn({ method: "POST" })
  .inputValidator((d: { institutionKey: InstKey }) => d)
  .handler(async ({ data }) => {
    const { createClient } = await import("@supabase/supabase-js");
    const url = process.env.SUPABASE_URL!;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const sb = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const { data: rows, error } = await sb
      .from("scraped_courses")
      .select("*")
      .eq("institution_key", data.institutionKey)
      .order("faculty", { ascending: true });
    if (error) throw new Error(error.message);
    return (rows ?? []) as ScrapedCourseRow[];
  });
