import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  SUBJECTS,
  NSSCO_GRADES,
  NSSCA_GRADES,
  type SubjectEntry,
  type Level,
  type Grade,
  type NSSCOGrade,
  calcTotal,
  findSubject,
  gradeMeets,
} from "@/lib/points";
import { INSTITUTIONS, type Institution, type Course, type Faculty } from "@/lib/courses";
import { scrapeInstitution, listScrapedCourses, type ScrapedCourseRow } from "@/lib/scrape.functions";
import {
  Sparkles,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Radar,
  Cpu,
  RefreshCw,
  Globe,
  ExternalLink,
  BookOpen,
  GraduationCap,
  X,
  Filter,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namibia Points Matrix — UNAM · NUST · IUM · Welwitchia · TC · IOL · SBS · NIPAM" },
      { name: "description", content: "All official courses offered by Namibian tertiary institutions with requirements, points calculator and live site sync." },
      { property: "og:title", content: "Namibia Points Matrix — Complete Namibian University Course Finder" },
      { property: "og:description", content: "Explore all courses offered by UNAM, NUST, IUM, Welwitchia, Triumphant College, IOL, SBS, and NIPAM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const uid = () => Math.random().toString(36).slice(2, 9);
const newRow = (subject = ""): SubjectEntry => ({ id: uid(), subject, level: "NSSCO", grade: "" });

function HomePage() {
  const [entries, setEntries] = useState<SubjectEntry[]>([
    newRow("English"),
    newRow("Mathematics"),
    newRow("Biology"),
    newRow("Physical Science"),
    newRow(""),
    newRow(""),
  ]);
  const [activeInst, setActiveInst] = useState<Institution["key"]>("UNAM");
  const [globalQuery, setGlobalQuery] = useState("");

  const update = (id: string, patch: Partial<SubjectEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const add = () => entries.length < 8 && setEntries((prev) => [...prev, newRow()]);

  const active = INSTITUTIONS.find((i) => i.key === activeInst)!;
  const best6 = useMemo(() => calcTotal(entries, activeInst, 6), [entries, activeInst]);
  const best5 = useMemo(() => calcTotal(entries, activeInst, 5), [entries, activeInst]);
  const english = findSubject(entries, "English");
  const englishStatus = englishBadge(english);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] glow-primary">
            <Cpu className="h-5 w-5 text-[#0b0f19]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-bold tracking-tight">
              <span className="neon-cyan">POINTS</span>
              <span className="mx-1 opacity-40">/</span>
              <span className="neon-violet">MATRIX</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Complete Namibian Tertiary Course Catalog</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
            Official University Data Sync
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        {/* Left Panel: Subject Inputs */}
        <section className="glass rounded-2xl overflow-hidden self-start">
          <div className="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--neon-cyan)]" /> Subject Input
              </h2>
              <p className="text-[11px] text-white/50 mt-0.5">Enter up to 8 NSSCO or NSSCA subjects & grades</p>
            </div>
            <button
              onClick={add}
              disabled={entries.length >= 8}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 disabled:opacity-30 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="divide-y divide-white/5 max-h-[calc(100vh-260px)] overflow-y-auto">
            {entries.map((e, i) => (
              <SubjectRow
                key={e.id}
                index={i}
                entry={e}
                onChange={(p) => update(e.id, p)}
                onRemove={() => remove(e.id)}
                canRemove={entries.length > 1}
              />
            ))}
          </div>
        </section>

        {/* Right Panel: Metrics + Institution Selector + Offered Courses */}
        <section className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-3">
              <MetricBadge label="Best 6" value={best6} accent="cyan" />
              <MetricBadge label="Best 5" value={best5} accent="violet" />
              <MetricBadge label="English" value={englishStatus.label} tone={englishStatus.tone} />
            </div>
          </div>

          {/* Institution Selector Tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {INSTITUTIONS.map((inst) => {
              const active = activeInst === inst.key;
              return (
                <button
                  key={inst.key}
                  onClick={() => setActiveInst(inst.key)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider transition border ${
                    active
                      ? "border-transparent text-[#0b0f19] glow-primary"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                  style={
                    active
                      ? { background: `linear-gradient(135deg, var(--neon-cyan), var(--neon-violet))` }
                      : undefined
                  }
                >
                  {inst.name}
                </button>
              );
            })}
          </div>

          {/* Institution Courses Catalog Panel */}
          <InstitutionCoursesPanel
            key={active.key}
            inst={active}
            entries={entries}
            query={globalQuery}
            onQueryChange={setGlobalQuery}
            onSelectInst={(k) => setActiveInst(k)}
          />
        </section>
      </main>
    </div>
  );
}

function SubjectRow({
  index,
  entry,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  entry: SubjectEntry;
  onChange: (p: Partial<SubjectEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const grades = entry.level === "NSSCO" ? NSSCO_GRADES : NSSCA_GRADES;
  return (
    <div className="p-3 grid grid-cols-[20px_minmax(0,1.6fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_auto] items-center gap-2">
      <div className="text-[10px] font-mono text-white/30">{String(index + 1).padStart(2, "0")}</div>
      <select
        value={entry.subject}
        onChange={(e) => onChange({ subject: e.target.value })}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs sm:text-sm min-w-0 focus:border-[var(--neon-cyan)]/60 focus:outline-none"
      >
        <option value="">Select subject…</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5 text-[10px] font-bold min-w-0">
        {(["NSSCO", "NSSCA"] as Level[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => onChange({ level: lvl, grade: "" })}
            className={`flex-1 rounded-md px-1.5 py-1 transition ${
              entry.level === lvl
                ? "bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-[#0b0f19]"
                : "text-white/50"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <select
        value={entry.grade}
        onChange={(e) => onChange({ grade: e.target.value as Grade })}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs sm:text-sm min-w-0 focus:border-[var(--neon-violet)]/60 focus:outline-none"
      >
        <option value="">—</option>
        {grades.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <button
        onClick={onRemove}
        disabled={!canRemove}
        className="grid h-8 w-8 place-items-center rounded-lg text-white/40 hover:text-destructive hover:bg-destructive/10 disabled:opacity-20 transition"
        aria-label="Remove subject"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function MetricBadge({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string | number;
  accent?: "cyan" | "violet";
  tone?: "good" | "warn" | "bad";
}) {
  const glow =
    accent === "cyan"
      ? "border-[var(--neon-cyan)]/40 shadow-[0_0_20px_rgba(0,243,255,0.25)]"
      : accent === "violet"
      ? "border-[var(--neon-violet)]/50 shadow-[0_0_20px_rgba(138,43,226,0.3)]"
      : tone === "good"
      ? "border-[var(--success)]/50 shadow-[0_0_20px_oklch(0.78_0.2_155/0.3)]"
      : tone === "warn"
      ? "border-[var(--warning)]/50 shadow-[0_0_20px_oklch(0.82_0.18_75/0.3)]"
      : tone === "bad"
      ? "border-[var(--destructive)]/50 shadow-[0_0_20px_oklch(0.68_0.24_25/0.3)]"
      : "border-white/10";
  const valueClass =
    accent === "cyan"
      ? "neon-cyan"
      : accent === "violet"
      ? "neon-violet"
      : tone === "good"
      ? "text-[var(--success)]"
      : tone === "warn"
      ? "text-[var(--warning)]"
      : tone === "bad"
      ? "text-[var(--destructive)]"
      : "text-white";
  return (
    <div className={`rounded-xl border bg-black/30 px-3 py-2.5 ${glow}`}>
      <div className="text-[9px] uppercase tracking-[0.15em] text-white/50">{label}</div>
      <div className={`mt-1 text-xl sm:text-2xl font-black font-display tabular-nums ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function englishBadge(english: SubjectEntry | undefined): { label: string; tone: "good" | "warn" | "bad" } {
  if (!english || !english.grade || english.grade === "U") return { label: "—", tone: "bad" };
  if (english.level === "NSSCA") return { label: english.grade, tone: "good" };
  const g = english.grade as string;
  if (["A*", "A", "B", "C"].includes(g)) return { label: g, tone: "good" };
  if (g === "D") return { label: g, tone: "warn" };
  return { label: g, tone: "bad" };
}

interface EvaluatedCourse extends Course {
  eligible: boolean;
  learnerPoints: number;
  missing: string[];
  sourceUrl?: string | null;
}

function evaluateCourse(c: Course & { sourceUrl?: string | null }, entries: SubjectEntry[], instKey: Institution["key"]): EvaluatedCourse {
  const learnerPoints = calcTotal(entries, instKey, c.bestN);
  const missing: string[] = [];
  if (learnerPoints < c.minPoints) missing.push(`Need ${c.minPoints} pts (have ${learnerPoints})`);
  for (const req of c.requirements) {
    const entry = findSubject(entries, req.subject);
    if (!gradeMeets(entry, req.minGrade)) {
      missing.push(`${req.subject} ≥ ${req.minGrade}`);
    }
  }
  return { ...c, learnerPoints, missing, eligible: missing.length === 0 };
}

function scrapedToFaculties(rows: ScrapedCourseRow[]): Faculty[] {
  const map = new Map<string, (Course & { sourceUrl?: string | null })[]>();
  const validGrades = new Set(["A*", "A", "B", "C", "D", "E"]);
  for (const r of rows) {
    const fac = (r.faculty && r.faculty.trim()) || "Offered Qualifications";
    const reqs = (r.requirements ?? [])
      .map((req) => ({
        subject: String(req.subject).trim(),
        minGrade: (String(req.minGrade).toUpperCase().replace(/[^A-EU*]/g, "") as NSSCOGrade),
      }))
      .filter((req) => req.subject && validGrades.has(req.minGrade));
    const course: Course & { sourceUrl?: string | null } = {
      name: r.name,
      duration: r.duration ?? "—",
      minPoints: typeof r.min_points === "number" ? r.min_points : 0,
      bestN: r.best_n === 5 ? 5 : 6,
      requirements: reqs,
      sourceUrl: r.source_url ?? null,
    };
    if (!map.has(fac)) map.set(fac, []);
    map.get(fac)!.push(course);
  }
  return Array.from(map.entries()).map(([name, courses]) => ({ name, courses }));
}

function matchQueryTokens(c: Course, fName: string, instName: string, instFullName: string, query: string): boolean {
  if (!query.trim()) return true;
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const text = `${c.name} ${fName} ${instName} ${instFullName} ${c.duration} ${c.requirements.map(r => `${r.subject} ${r.minGrade}`).join(" ")}`.toLowerCase();
  return tokens.every((token) => text.includes(token));
}

function InstitutionCoursesPanel({
  inst,
  entries,
  query,
  onQueryChange,
  onSelectInst,
}: {
  inst: Institution;
  entries: SubjectEntry[];
  query: string;
  onQueryChange: (q: string) => void;
  onSelectInst: (key: Institution["key"]) => void;
}) {
  const [facultyFilter, setFacultyFilter] = useState<string>("All");
  const [levelFilter, setLevelFilter] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [scraped, setScraped] = useState<ScrapedCourseRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string>("Retrieving full course catalog from official site…");
  const [selectedCourse, setSelectedCourse] = useState<EvaluatedCourse | null>(null);

  const listFn = useServerFn(listScrapedCourses);
  const scrapeFn = useServerFn(scrapeInstitution);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setStatus(`Querying ${inst.fullName} official catalog…`);
        const rows = await listFn({ data: { institutionKey: inst.key } });
        if (cancelled) return;
        if (rows.length === 0) {
          setStatus(`Scanning live web pages from ${inst.fullName}…`);
          setRefreshing(true);
          const res = await scrapeFn({ data: { institutionKey: inst.key } });
          if (cancelled) return;
          setScraped(res.courses ?? []);
        } else {
          setScraped(rows);
        }
      } catch (e) {
        setStatus(`Showing official accredited catalog dataset (${(e as Error).message})`);
        setScraped([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inst.key, inst.fullName, listFn, scrapeFn]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      setStatus(`Re-scanning ${inst.fullName} official website…`);
      const res = await scrapeFn({ data: { institutionKey: inst.key } });
      setScraped(res.courses ?? []);
    } catch (e) {
      setStatus(`Re-scan failed: ${(e as Error).message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const faculties: Faculty[] = useMemo(() => {
    if (scraped && scraped.length > 0) return scrapedToFaculties(scraped);
    return inst.faculties;
  }, [scraped, inst.faculties]);

  const usingLive = !!(scraped && scraped.length > 0);

  const evaluated = useMemo(
    () =>
      faculties.map((f) => ({
        ...f,
        courses: f.courses.map((c) => evaluateCourse(c, entries, inst.key)),
      })),
    [faculties, entries, inst.key],
  );

  const filtered = evaluated
    .map((f) => ({
      ...f,
      courses: f.courses.filter((c) => {
        if (facultyFilter !== "All" && facultyFilter !== f.name) return false;
        if (levelFilter !== "All") {
          const nameLower = c.name.toLowerCase();
          if (levelFilter === "Degree" && !nameLower.includes("bachelor") && !nameLower.includes("degree")) return false;
          if (levelFilter === "Diploma" && !nameLower.includes("diploma")) return false;
          if (levelFilter === "Certificate" && !nameLower.includes("certificate")) return false;
        }
        if (onlyEligible && !c.eligible) return false;
        if (!matchQueryTokens(c, f.name, inst.name, inst.fullName, query)) return false;
        return true;
      }),
    }))
    .filter((f) => f.courses.length > 0);

  // Cross-institution match counter
  const otherMatches = useMemo(() => {
    if (!query.trim()) return [];
    return INSTITUTIONS.filter((i) => i.key !== inst.key)
      .map((otherInst) => {
        let count = 0;
        for (const f of otherInst.faculties) {
          for (const c of f.courses) {
            if (matchQueryTokens(c, f.name, otherInst.name, otherInst.fullName, query)) {
              count++;
            }
          }
        }
        return { inst: otherInst, count };
      })
      .filter((m) => m.count > 0);
  }, [query, inst.key]);

  const eligibleTotal = evaluated.reduce((a, f) => a + f.courses.filter((c) => c.eligible).length, 0);
  const totalCount = evaluated.reduce((a, f) => a + f.courses.length, 0);

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden animate-fade-in space-y-4">
      {/* Background Glow */}
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: `var(--color-${inst.key.toLowerCase()})` }}
      />

      {/* Institution Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[var(--neon-cyan)]" />
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              {inst.fullName}
            </h3>
          </div>
          <p className="text-[11px] text-white/50 mt-1 flex items-center gap-2">
            <span>All official qualifications offered at <strong className="text-white">{inst.name}</strong></span>
            <span>•</span>
            <a
              href={inst.officialSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[var(--neon-cyan)] hover:underline"
            >
              <Globe className="h-3 w-3" /> Official Web Portal
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
              usingLive
                ? "border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            {usingLive ? "Retrieved Live from Web" : "Accredited Directory"}
          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 disabled:opacity-40 transition"
            title="Trigger live web scraper on official university pages"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Scanning…" : "Re-sync Web Site"}
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <Radar className="mx-auto h-8 w-8 text-[var(--neon-cyan)] animate-spin" />
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70">{status}</div>
        </div>
      ) : (
        <>
          {/* Search and Filters Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 border border-[var(--success)]/40 px-2.5 py-1 text-[var(--success)] font-bold">
                  <Zap className="h-3 w-3" /> {eligibleTotal} Qualified
                </span>
                <span className="text-white/40">out of {totalCount} total courses offered</span>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyEligible}
                  onChange={(e) => setOnlyEligible(e.target.checked)}
                  className="accent-[var(--neon-cyan)] rounded"
                />
                Show only courses I qualify for
              </label>
            </div>

            {/* Comprehensive Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder={`Search any course across all institutions (e.g. Medicine, Nursing, Engineering, Accounting, Law, Computer)…`}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm focus:border-[var(--neon-cyan)]/60 focus:outline-none placeholder:text-white/30"
              />
              {query && (
                <button
                  onClick={() => onQueryChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Cross-Institution Match Alert */}
            {otherMatches.length > 0 && (
              <div className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/10 p-3 text-xs space-y-2 animate-fade-in">
                <div className="font-semibold text-[var(--neon-cyan)] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Courses matching "{query}" found at other universities:
                </div>
                <div className="flex flex-wrap gap-2">
                  {otherMatches.map(({ inst: other, count }) => (
                    <button
                      key={other.key}
                      onClick={() => onSelectInst(other.key)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-white hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition"
                    >
                      <span className="font-bold text-[var(--neon-cyan)]">{other.name}:</span>
                      <span>{count} courses</span>
                      <ArrowRight className="h-3 w-3 text-[var(--neon-cyan)]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-white/40 text-[11px] mr-1 flex items-center gap-1">
                <Filter className="h-3 w-3" /> Level:
              </span>
              {(["All", "Degree", "Diploma", "Certificate"] as const).map((lvl) => {
                const active = levelFilter === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border transition ${
                      active
                        ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
                        : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    {lvl === "All" ? "All Levels" : lvl}
                  </button>
                );
              })}
            </div>

            {/* Faculty Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(["All", ...faculties.map((f) => f.name)]).map((fac) => {
                const active = facultyFilter === fac;
                return (
                  <button
                    key={fac}
                    onClick={() => setFacultyFilter(fac)}
                    className={`rounded-lg px-3 py-1 text-[11px] font-semibold border transition ${
                      active
                        ? "border-[var(--neon-violet)] bg-[var(--neon-violet)]/20 text-[var(--neon-violet)]"
                        : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                    }`}
                  >
                    {fac === "All" ? "All Faculties" : fac}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courses List Grouped by Faculty */}
          <div className="space-y-6 max-h-[580px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-sm text-white/50 border border-dashed border-white/10 rounded-xl p-6 space-y-2">
                <div>No courses found matching "{query}" at {inst.name}.</div>
                {otherMatches.length > 0 && (
                  <div className="text-xs text-white/70">
                    Try selecting one of the other institutions above to view matching courses!
                  </div>
                )}
                <div>
                  <button
                    onClick={() => {
                      onQueryChange("");
                      setFacultyFilter("All");
                      setLevelFilter("All");
                      setOnlyEligible(false);
                    }}
                    className="text-xs text-[var(--neon-cyan)] underline font-semibold mt-1"
                  >
                    Reset search & filters
                  </button>
                </div>
              </div>
            )}
            {filtered.map((f) => (
              <div key={f.name} className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-wider border-b border-white/10 pb-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                  <span>{f.name}</span>
                  <span className="text-[10px] text-white/30 font-normal">({f.courses.length} courses)</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-1">
                  {f.courses.map((c) => (
                    <CourseCard key={c.name} c={c} onClick={() => setSelectedCourse(c)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          inst={inst}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}

function CourseCard({ c, onClick }: { c: EvaluatedCourse; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-3.5 transition cursor-pointer ${
        c.eligible
          ? "border-[var(--success)]/40 bg-[var(--success)]/10 hover:bg-[var(--success)]/20 shadow-[0_0_15px_rgba(0,255,150,0.08)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm leading-snug text-white flex items-center gap-2">
            <span>{c.name}</span>
          </div>
          <div className="text-[11px] text-white/50 mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-white/30" /> {c.duration}
            </span>
            {c.sourceUrl && (
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[10px] text-[var(--neon-cyan)] hover:underline"
              >
                <ExternalLink className="h-2.5 w-2.5" /> Official Site Page
              </a>
            )}
          </div>
        </div>

        {c.eligible ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--success)]/20 border border-[var(--success)]/50 px-2.5 py-1 text-[11px] font-bold text-[var(--success)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Eligible
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 border border-[var(--warning)]/40 px-2.5 py-1 text-[11px] font-bold text-[var(--warning)]">
            <AlertTriangle className="h-3.5 w-3.5" /> Missing Prerequisites
          </span>
        )}
      </div>

      {/* Points & Requirements Summary */}
      <div className="mt-3 flex items-center justify-between text-xs border-t border-white/10 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[11px]">Points:</span>
          <span className="font-bold tabular-nums font-display neon-cyan">{c.learnerPoints}</span>
          <span className="text-white/40">/ {c.minPoints} min required</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
          Rule: Best {c.bestN}
        </span>
      </div>

      {/* Missing Requirements List */}
      {!c.eligible && c.missing.length > 0 && (
        <ul className="mt-2 text-[11px] text-white/70 space-y-1 bg-black/30 rounded-lg p-2 border border-white/5">
          {c.missing.map((m) => (
            <li key={m} className="flex items-center gap-1.5 text-[var(--warning)]">
              <span className="text-xs">•</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Subject Prerequisites */}
      {c.requirements.length > 0 && (
        <div className="mt-2 text-[10px] text-white/50 pt-1">
          <span className="font-semibold text-white/70">Required Subjects: </span>
          {c.requirements.map((r) => `${r.subject} ≥ ${r.minGrade}`).join(" · ")}
        </div>
      )}
    </div>
  );
}

function CourseDetailsModal({
  course,
  inst,
  onClose,
}: {
  course: EvaluatedCourse;
  inst: Institution;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg glass-strong border border-white/15 rounded-2xl p-6 shadow-2xl space-y-5 animate-scale-up z-10">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--neon-cyan)] font-bold">
              {inst.fullName}
            </div>
            <h3 className="text-lg font-black font-display text-white mt-1 leading-snug">
              {course.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Badge & Duration */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Status</div>
            <div className="mt-1 font-bold">
              {course.eligible ? (
                <span className="text-[var(--success)] flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Qualified for Admission
                </span>
              ) : (
                <span className="text-[var(--warning)] flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" /> Missing Requirements
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Duration</div>
            <div className="mt-1 font-bold text-white flex items-center gap-1">
              <Clock className="h-4 w-4 text-[var(--neon-violet)]" /> {course.duration}
            </div>
          </div>
        </div>

        {/* Points Matrix */}
        <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Minimum Required Points:</span>
            <span className="font-bold font-display text-white">{course.minPoints} points</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Your Points ({course.bestN === 5 ? "Best 5" : "Best 6"}):</span>
            <span className="font-bold font-display neon-cyan">{course.learnerPoints} points</span>
          </div>
        </div>

        {/* Requirements Details */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-white/70 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-[var(--neon-cyan)]" /> Subject Grade Requirements
          </div>
          {course.requirements.length === 0 ? (
            <div className="text-xs text-white/50">General admission point requirements apply.</div>
          ) : (
            <div className="grid gap-1.5">
              {course.requirements.map((r) => (
                <div key={r.subject} className="flex items-center justify-between text-xs bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  <span className="font-semibold text-white/90">{r.subject}</span>
                  <span className="font-mono text-white/70">Grade ≥ {r.minGrade}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links & Close */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <a
            href={course.sourceUrl ?? inst.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] px-4 py-2.5 text-xs font-bold text-[#0b0f19] hover:scale-[1.02] transition"
          >
            <ExternalLink className="h-4 w-4" /> Open Official {inst.name} Page
          </a>

          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
