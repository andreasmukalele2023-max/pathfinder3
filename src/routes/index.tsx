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
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namibia Points Matrix — UNAM · NUST · IUM · Welwitchia" },
      { name: "description", content: "Admission points calculator and live course matcher for Namibian Grade 12 learners." },
      { property: "og:title", content: "Namibia Points Matrix — UNAM · NUST · IUM · Welwitchia" },
      { property: "og:description", content: "Admission points calculator and live course matcher for Namibian Grade 12 learners." },
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Namibia · Grade 12 Live Course Matcher</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon-cyan)] animate-pulse" />
            Official Site Sync
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        {/* Subjects panel */}
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

        {/* Metrics + Institution panel */}
        <section className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-3 gap-3">
              <MetricBadge label="Best 6" value={best6} accent="cyan" />
              <MetricBadge label="Best 5" value={best5} accent="violet" />
              <MetricBadge label="English" value={englishStatus.label} tone={englishStatus.tone} />
            </div>
          </div>

          {/* Institution tabs */}
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
          <InstitutionCoursesPanel key={active.key} inst={active} entries={entries} />
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

function InstitutionCoursesPanel({
  inst,
  entries,
}: {
  inst: Institution;
  entries: SubjectEntry[];
}) {
  const [query, setQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [scraped, setScraped] = useState<ScrapedCourseRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<string>("Retrieving course catalog from official website…");

  const listFn = useServerFn(listScrapedCourses);
  const scrapeFn = useServerFn(scrapeInstitution);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setStatus(`Querying ${inst.fullName} catalog…`);
        const rows = await listFn({ data: { institutionKey: inst.key } });
        if (cancelled) return;
        if (rows.length === 0) {
          setStatus(`Scanning live pages from ${inst.fullName}…`);
          setRefreshing(true);
          const res = await scrapeFn({ data: { institutionKey: inst.key } });
          if (cancelled) return;
          setScraped(res.courses ?? []);
        } else {
          setScraped(rows);
        }
      } catch (e) {
        setStatus(`Showing accredited catalog dataset (${(e as Error).message})`);
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
        if (onlyEligible && !c.eligible) return false;
        if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    }))
    .filter((f) => f.courses.length > 0);

  const eligibleTotal = evaluated.reduce((a, f) => a + f.courses.filter((c) => c.eligible).length, 0);
  const totalCount = evaluated.reduce((a, f) => a + f.courses.length, 0);

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden animate-fade-in space-y-4">
      {/* Background Glow */}
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: `var(--color-${inst.key.toLowerCase()})` }}
      />

      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[var(--neon-cyan)]" />
            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              {inst.fullName}
            </h3>
          </div>
          <p className="text-[11px] text-white/50 mt-0.5">
            Official Courses & Requirements Offered by <span className="font-semibold text-white/80">{inst.name}</span>
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
            {usingLive ? "Retrieved Live from Site" : "Accredited Catalog"}
          </div>

          <button
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-white/10 disabled:opacity-40 transition"
            title="Trigger live website scraper to re-fetch official course pages"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Scanning…" : "Re-sync Web Data"}
          </button>
        </div>
      </div>

      {/* Status / Loading indicator */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <Radar className="mx-auto h-8 w-8 text-[var(--neon-cyan)] animate-spin" />
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70">{status}</div>
        </div>
      ) : (
        <>
          {/* Controls Bar */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--success)]/15 border border-[var(--success)]/40 px-2.5 py-1 text-[var(--success)] font-bold">
                  <Zap className="h-3 w-3" /> {eligibleTotal} Courses Qualified
                </span>
                <span className="text-white/40">of {totalCount} offered</span>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyEligible}
                  onChange={(e) => setOnlyEligible(e.target.checked)}
                  className="accent-[var(--neon-cyan)] rounded"
                />
                Show only programs I qualify for
              </label>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${inst.name} courses or majors…`}
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm focus:border-[var(--neon-cyan)]/60 focus:outline-none"
              />
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
                        ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"
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
          <div className="space-y-6 max-h-[560px] overflow-y-auto pr-1">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-sm text-white/50 border border-dashed border-white/10 rounded-xl p-6">
                No courses match your current search or filter criteria.
              </div>
            )}
            {filtered.map((f) => (
              <div key={f.name} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white/60 uppercase tracking-wider border-b border-white/10 pb-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                  <span>{f.name}</span>
                  <span className="text-[10px] text-white/30 font-normal">({f.courses.length} courses)</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-1">
                  {f.courses.map((c) => (
                    <CourseCard key={c.name} c={c} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CourseCard({ c }: { c: EvaluatedCourse }) {
  return (
    <div
      className={`rounded-xl border p-3.5 transition ${
        c.eligible
          ? "border-[var(--success)]/40 bg-[var(--success)]/10 hover:bg-[var(--success)]/15"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-bold text-sm leading-snug text-white">{c.name}</div>
          <div className="text-[11px] text-white/50 mt-0.5 flex items-center gap-2">
            <span>Duration: {c.duration}</span>
            {c.sourceUrl && (
              <>
                <span>•</span>
                <a
                  href={c.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-[var(--neon-cyan)] hover:underline"
                >
                  <ExternalLink className="h-2.5 w-2.5" /> Official Site
                </a>
              </>
            )}
          </div>
        </div>

        {c.eligible ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--success)]/20 border border-[var(--success)]/50 px-2.5 py-1 text-[11px] font-bold text-[var(--success)]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Eligible
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 border border-[var(--warning)]/40 px-2.5 py-1 text-[11px] font-bold text-[var(--warning)]">
            <AlertTriangle className="h-3.5 w-3.5" /> Missing Requirements
          </span>
        )}
      </div>

      {/* Points Comparison */}
      <div className="mt-3 flex items-center justify-between text-xs border-t border-white/10 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-white/50 text-[11px]">Required Points:</span>
          <span className="font-bold tabular-nums font-display neon-cyan">{c.learnerPoints}</span>
          <span className="text-white/40">/ {c.minPoints} min</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
          Rule: Best {c.bestN}
        </span>
      </div>

      {/* Missing Requirements List */}
      {!c.eligible && c.missing.length > 0 && (
        <ul className="mt-2 text-[11px] text-white/70 space-y-1 bg-black/20 rounded-lg p-2 border border-white/5">
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
          <span className="font-semibold text-white/70">Subject Prerequisites: </span>
          {c.requirements.map((r) => `${r.subject} ≥ ${r.minGrade}`).join(" · ")}
        </div>
      )}
    </div>
  );
}
