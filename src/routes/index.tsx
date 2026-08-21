import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Bookmark,
  Briefcase,
  Calculator,
  CalendarClock,
  ChevronRight,
  Cpu,
  ExternalLink,
  Filter,
  GraduationCap,
  Home,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  calcTotal,
  findSubject,
  type InstitutionKey,
  type NSSCOGrade,
  type SubjectEntry,
} from "@/lib/points";
import { INSTITUTIONS, type Course, type Faculty, type Institution } from "@/lib/courses";
import { courseLevel, evaluateCourse, matchesQuery, type EvaluatedCourse } from "@/lib/evaluate";
import { CAREERS, careerMatchesCourse, findCareer } from "@/lib/careers";
import { deadlineInfo, isNsfafEligible, PROSPECTUS_YEAR } from "@/lib/admissions";
import { exportSummaryPdf } from "@/lib/export-pdf";
import { useShortlist } from "@/lib/shortlist";
import { GradeSheet, ScoreGauges, englishBadge, newRow } from "@/components/grade-sheet";
import { CourseCard, CourseSheet } from "@/components/course-card";
import { listScrapedCourses, scrapeInstitution, type ScrapedCourseRow } from "@/lib/scrape.functions";
import { useAuth } from "@/lib/auth";
import { useCloudProgress, type SyncState } from "@/lib/sync";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Points Matrix — Namibian University Admission Points App" },
      {
        name: "description",
        content:
          "Mobile-first Namibian admission points calculator: NSSCO & NSSCAS grades, Best 5 / Best 6 scores, qualifying courses, shortlist and NSFAF guidance for UNAM, NUST, IUM and more.",
      },
      { property: "og:title", content: "Points Matrix — Namibian University Admission Points App" },
      {
        property: "og:description",
        content:
          "Calculate your Grade 12 points and instantly see every Namibian course you qualify for, with how-to-qualify advice and application deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

type View = "dashboard" | "courses" | "careers" | "shortlist" | "settings";

const NAV: { key: View; label: string; icon: typeof Home }[] = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "courses", label: "Calculator", icon: Calculator },
  { key: "careers", label: "Careers", icon: Briefcase },
  { key: "shortlist", label: "Shortlist", icon: Bookmark },
  { key: "settings", label: "Settings", icon: Settings },
];

const LEVELS = ["Certificate", "Diploma", "Degree", "Postgraduate"] as const;

function HomePage() {
  const [entries, setEntries] = useState<SubjectEntry[]>([
    newRow("English"),
    newRow("Mathematics"),
    newRow("Biology"),
    newRow("Chemistry"),
    newRow("Physics"),
    newRow(""),
  ]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [whatIf, setWhatIf] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [activeInst, setActiveInst] = useState<InstitutionKey>("UNAM");
  const [selected, setSelected] = useState<{ course: EvaluatedCourse; inst: Institution } | null>(null);
  const shortlist = useShortlist();
  const { user, loading: authLoading, signOut } = useAuth();
  const syncState = useCloudProgress({
    user,
    entries,
    setEntries,
    shortlist: shortlist.items,
    setShortlist: shortlist.setAll,
  });

  const inst = INSTITUTIONS.find((i) => i.key === activeInst)!;

  const toggleSave = (c: EvaluatedCourse, i: Institution) =>
    shortlist.toggle({
      instKey: i.key,
      courseName: c.name,
      faculty: c.faculty,
      duration: c.duration,
      minPoints: c.minPoints,
    });

  return (
    <div
      className="min-h-[100dvh] w-full overflow-x-hidden sm:pl-[76px]"
      style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
    >
      {/* Desktop side dock */}
      <nav className="fixed inset-y-0 left-0 z-40 hidden w-[76px] flex-col items-center gap-1 border-r border-white/10 glass-strong py-4 sm:flex">
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] glow-primary">
          <Cpu className="h-5 w-5 text-[#0b0f19]" />
        </div>
        {NAV.map((n) => (
          <button
            key={n.key}
            onClick={() => setView(n.key)}
            title={n.label}
            className={`grid h-12 w-12 place-items-center rounded-2xl transition ${
              view === n.key
                ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] shadow-[0_0_18px_rgba(0,243,255,0.25)]"
                : "text-white/40 hover:bg-white/5 hover:text-white"
            }`}
          >
            <n.icon className="h-5 w-5" />
          </button>
        ))}
        <div className="my-3 h-px w-8 bg-white/10" />
        <div className="flex flex-1 flex-col items-center gap-1.5 overflow-y-auto scrollbar-none">
          {INSTITUTIONS.map((i) => (
            <button
              key={i.key}
              onClick={() => {
                setActiveInst(i.key);
                setView("courses");
              }}
              title={i.fullName}
              className={`grid h-10 w-10 place-items-center rounded-xl border text-[9px] font-black transition ${
                activeInst === i.key && view === "courses"
                  ? "border-transparent text-[#0b0f19]"
                  : "border-white/10 bg-white/5 text-white/50 hover:text-white"
              }`}
              style={
                activeInst === i.key && view === "courses"
                  ? { background: `var(--color-${i.key.toLowerCase()})` }
                  : undefined
              }
            >
              {i.name.slice(0, 4)}
            </button>
          ))}
        </div>
      </nav>

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 glass-strong">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] glow-primary sm:hidden">
            <Cpu className="h-4.5 w-4.5 text-[#0b0f19]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold tracking-tight sm:text-base">
              <span className="neon-cyan">POINTS</span>
              <span className="mx-1 opacity-40">/</span>
              <span className="neon-violet">MATRIX</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
              {NAV.find((n) => n.key === view)?.label} · {PROSPECTUS_YEAR} prospectus
            </p>
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-3 py-1.5 text-[11px] font-bold text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)]/20"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Grade Sheet
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl animate-fade-in px-4 py-4">
        {view === "dashboard" && (
          <DashboardView
            entries={entries}
            activeInst={activeInst}
            shortlistCount={shortlist.items.length}
            onOpenSheet={() => setSheetOpen(true)}
            onGoCourses={(k) => {
              setActiveInst(k);
              setView("courses");
            }}
            onGo={setView}
          />
        )}

        {view === "courses" && (
          <CoursesView
            inst={inst}
            entries={entries}
            onSelectInst={setActiveInst}
            onOpenCourse={(c) => setSelected({ course: c, inst })}
            isSaved={(c) => shortlist.has(inst.key, c.name)}
            onToggleSave={(c) => toggleSave(c, inst)}
          />
        )}

        {view === "careers" && (
          <CareersView
            entries={entries}
            onOpenCourse={(c, i) => setSelected({ course: c, inst: i })}
            isSaved={(c, i) => shortlist.has(i.key, c.name)}
            onToggleSave={(c, i) => toggleSave(c, i)}
          />
        )}

        {view === "shortlist" && (
          <ShortlistView
            entries={entries}
            items={shortlist.items}
            onRemove={shortlist.remove}
            onOpenCourse={(c, i) => setSelected({ course: c, inst: i })}
          />
        )}

        {view === "settings" && <SettingsView entries={entries} whatIf={whatIf} onToggleWhatIf={setWhatIf} />}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 glass-strong sm:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={`flex flex-col items-center gap-1 py-2.5 text-[9px] font-bold uppercase tracking-wider transition ${
                view === n.key ? "text-[var(--neon-cyan)]" : "text-white/40"
              }`}
            >
              <n.icon className={`h-5 w-5 transition-transform ${view === n.key ? "scale-110" : ""}`} />
              {n.label}
            </button>
          ))}
        </div>
      </nav>

      <GradeSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        entries={entries}
        setEntries={setEntries}
        institution={activeInst}
        whatIf={whatIf}
        onToggleWhatIf={setWhatIf}
        onExport={() => exportSummaryPdf(entries)}
      />

      {selected && (
        <CourseSheet
          course={selected.course}
          inst={selected.inst}
          entries={entries}
          saved={shortlist.has(selected.inst.key, selected.course.name)}
          onToggleSave={() => toggleSave(selected.course, selected.inst)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------ Dashboard -------------------------------- */

function DashboardView({
  entries,
  activeInst,
  shortlistCount,
  onOpenSheet,
  onGoCourses,
  onGo,
}: {
  entries: SubjectEntry[];
  activeInst: InstitutionKey;
  shortlistCount: number;
  onOpenSheet: () => void;
  onGoCourses: (k: InstitutionKey) => void;
  onGo: (v: View) => void;
}) {
  const stats = useMemo(
    () =>
      INSTITUTIONS.map((inst) => {
        let eligible = 0;
        let total = 0;
        for (const f of inst.faculties) {
          for (const c of f.courses) {
            total++;
            if (evaluateCourse(c, entries, inst.key, f.name).eligible) eligible++;
          }
        }
        return { inst, eligible, total };
      }),
    [entries],
  );

  const totalEligible = stats.reduce((a, s) => a + s.eligible, 0);
  const eng = englishBadge(findSubject(entries, "English"));

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">Your live score</h2>
          <button onClick={onOpenSheet} className="text-[11px] font-bold text-[var(--neon-cyan)]">
            Edit grades
          </button>
        </div>
        <ScoreGauges entries={entries} institution={activeInst} />
        <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-2xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Courses you qualify for</div>
            <div className="mt-1 font-display text-2xl font-black text-[var(--success)]">{totalEligible}</div>
          </div>
          <button
            onClick={() => onGo("shortlist")}
            className="rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:bg-white/10"
          >
            <div className="text-[10px] uppercase tracking-wider text-white/50">Shortlisted</div>
            <div className="mt-1 font-display text-2xl font-black text-white">{shortlistCount}</div>
          </button>
        </div>
        {eng.tone !== "good" && (
          <p className="mt-3 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-2.5 text-[11px] text-[var(--warning)]">
            English is compulsory at every Namibian institution — aim for a C (NSSCO) or better to unlock most programmes.
          </p>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-xs font-bold uppercase tracking-widest text-white/50">Institutions</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {stats.map(({ inst, eligible, total }) => {
            const d = deadlineInfo(inst);
            return (
              <button
                key={inst.key}
                onClick={() => onGoCourses(inst.key)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[10px] font-black text-[#0b0f19]"
                  style={{ background: `var(--color-${inst.key.toLowerCase()})` }}
                >
                  {inst.name.slice(0, 4)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-white">{inst.fullName}</span>
                  <span className="block text-[11px] text-white/50">
                    {eligible} of {total} programmes open to you · {d.label}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/30" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------- Courses --------------------------------- */

function CoursesView({
  inst,
  entries,
  onSelectInst,
  onOpenCourse,
  isSaved,
  onToggleSave,
}: {
  inst: Institution;
  entries: SubjectEntry[];
  onSelectInst: (k: InstitutionKey) => void;
  onOpenCourse: (c: EvaluatedCourse) => void;
  isSaved: (c: EvaluatedCourse) => boolean;
  onToggleSave: (c: EvaluatedCourse) => void;
}) {
  const [query, setQuery] = useState("");
  const [levels, setLevels] = useState<string[]>([]);
  const [faculty, setFaculty] = useState("All");
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [onlyNsfaf, setOnlyNsfaf] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [scraped, setScraped] = useState<ScrapedCourseRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const listFn = useServerFn(listScrapedCourses);
  const scrapeFn = useServerFn(scrapeInstitution);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setScraped(null);
    (async () => {
      try {
        const rows = await listFn({ data: { institutionKey: inst.key } });
        if (!cancelled) setScraped(rows);
      } catch {
        if (!cancelled) setScraped([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inst.key, listFn]);

  const sync = async () => {
    try {
      setSyncing(true);
      const res = await scrapeFn({ data: { institutionKey: inst.key } });
      setScraped(res.courses ?? []);
    } catch {
      /* keep accredited directory */
    } finally {
      setSyncing(false);
    }
  };

  const faculties: Faculty[] = useMemo(
    () => (scraped && scraped.length > 0 ? scrapedToFaculties(scraped) : inst.faculties),
    [scraped, inst.faculties],
  );

  const evaluated = useMemo(
    () =>
      faculties.flatMap((f) => f.courses.map((c) => evaluateCourse(c, entries, inst.key, f.name))),
    [faculties, entries, inst.key],
  );

  const filtered = evaluated.filter((c) => {
    if (faculty !== "All" && c.faculty !== faculty) return false;
    if (levels.length > 0 && !levels.includes(courseLevel(c))) return false;
    if (onlyEligible && !c.eligible) return false;
    if (onlyNsfaf && !isNsfafEligible(c, inst.key)) return false;
    return matchesQuery(c, c.faculty, inst, query);
  });

  const grouped = useMemo(() => {
    const map = new Map<string, EvaluatedCourse[]>();
    for (const c of filtered) {
      if (!map.has(c.faculty)) map.set(c.faculty, []);
      map.get(c.faculty)!.push(c);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const eligibleCount = evaluated.filter((c) => c.eligible).length;

  return (
    <div className="space-y-4">
      {/* Institution carousel */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto scrollbar-none px-4 pb-1">
        {INSTITUTIONS.map((i) => {
          const active = i.key === inst.key;
          return (
            <button
              key={i.key}
              onClick={() => onSelectInst(i.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                active ? "text-[#0b0f19]" : "border border-white/10 bg-white/5 text-white/60 hover:text-white"
              }`}
              style={active ? { background: `var(--color-${i.key.toLowerCase()})` } : undefined}
            >
              {i.name}
            </button>
          );
        })}
      </div>

      <section className="glass rounded-3xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <GraduationCap className="h-5 w-5 text-[var(--neon-cyan)]" /> {inst.fullName}
            </h2>
            <p className="mt-1 text-[11px] text-white/50">
              {eligibleCount} of {evaluated.length} programmes open to you · Best {inst.key === "UNAM" ? "5/6" : "6"} rules
            </p>
          </div>
          <button
            onClick={sync}
            disabled={syncing}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold transition hover:bg-white/10 disabled:opacity-40"
            title="Sync the official institution website"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing" : "Sync"}
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, faculties, subjects…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-9 text-sm placeholder:text-white/30 focus:border-[var(--neon-cyan)]/60 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className={`grid h-[42px] w-[42px] place-items-center rounded-xl border transition ${
              onlyEligible || onlyNsfaf || faculty !== "All"
                ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
            aria-label="Filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {/* Level pill carousel */}
        <div className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto scrollbar-none px-4">
          <button
            onClick={() => setLevels([])}
            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
              levels.length === 0
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            All levels
          </button>
          {LEVELS.map((l) => {
            const active = levels.includes(l);
            return (
              <button
                key={l}
                onClick={() => setLevels((prev) => (active ? prev.filter((x) => x !== l) : [...prev, l]))}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                  active
                    ? "border-[var(--neon-violet)] bg-[var(--neon-violet)]/20 text-[var(--neon-violet)]"
                    : "border-white/10 bg-white/5 text-white/60"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <SkeletonList />
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
          No programmes match these filters.
          <button
            onClick={() => {
              setQuery("");
              setLevels([]);
              setFaculty("All");
              setOnlyEligible(false);
              setOnlyNsfaf(false);
            }}
            className="mt-2 block w-full text-xs font-bold text-[var(--neon-cyan)]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([facName, courses]) => (
            <div key={facName} className="space-y-2">
              <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-[var(--neon-violet)]" />
                {facName}
                <span className="font-normal text-white/30">({courses.length})</span>
              </div>
              <div className="grid gap-2">
                {courses.map((c) => (
                  <CourseCard
                    key={`${c.faculty}-${c.name}`}
                    c={c}
                    inst={inst}
                    saved={isSaved(c)}
                    onToggleSave={() => onToggleSave(c)}
                    onOpen={() => onOpenCourse(c)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filterOpen && (
        <FilterModal
          faculties={faculties.map((f) => f.name)}
          faculty={faculty}
          setFaculty={setFaculty}
          onlyEligible={onlyEligible}
          setOnlyEligible={setOnlyEligible}
          onlyNsfaf={onlyNsfaf}
          setOnlyNsfaf={setOnlyNsfaf}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}

function FilterModal({
  faculties,
  faculty,
  setFaculty,
  onlyEligible,
  setOnlyEligible,
  onlyNsfaf,
  setOnlyNsfaf,
  onClose,
}: {
  faculties: string[];
  faculty: string;
  setFaculty: (f: string) => void;
  onlyEligible: boolean;
  setOnlyEligible: (v: boolean) => void;
  onlyNsfaf: boolean;
  setOnlyNsfaf: (v: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full animate-sheet-up overflow-y-auto rounded-t-3xl border border-white/15 glass-strong p-5 sm:max-w-md sm:animate-scale-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold">Filters</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs">
            <span>Show only courses I qualify for</span>
            <input
              type="checkbox"
              checked={onlyEligible}
              onChange={(e) => setOnlyEligible(e.target.checked)}
              className="accent-[var(--neon-cyan)]"
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs">
            <span>NSFAF eligible only</span>
            <input
              type="checkbox"
              checked={onlyNsfaf}
              onChange={(e) => setOnlyNsfaf(e.target.checked)}
              className="accent-[var(--success)]"
            />
          </label>

          <div>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-white/50">
              Faculty / School
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...faculties].map((f) => (
                <button
                  key={f}
                  onClick={() => setFaculty(f)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                    faculty === f
                      ? "border-[var(--neon-violet)] bg-[var(--neon-violet)]/20 text-[var(--neon-violet)]"
                      : "border-white/10 bg-white/5 text-white/60"
                  }`}
                >
                  {f === "All" ? "All faculties" : f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] py-2.5 text-xs font-bold text-[#0b0f19]"
        >
          Show results
        </button>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-[86px] rounded-2xl" />
      ))}
    </div>
  );
}

/* ------------------------------- Careers --------------------------------- */

function CareersView({
  entries,
  onOpenCourse,
  isSaved,
  onToggleSave,
}: {
  entries: SubjectEntry[];
  onOpenCourse: (c: EvaluatedCourse, i: Institution) => void;
  isSaved: (c: EvaluatedCourse, i: Institution) => boolean;
  onToggleSave: (c: EvaluatedCourse, i: Institution) => void;
}) {
  const [q, setQ] = useState("");
  const career = useMemo(() => findCareer(q), [q]);

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    const out: { inst: Institution; course: EvaluatedCourse }[] = [];
    for (const inst of INSTITUTIONS) {
      for (const f of inst.faculties) {
        for (const c of f.courses) {
          const byCareer = career ? careerMatchesCourse(career, c.name) : false;
          const byText = matchesQuery(c, f.name, inst, term);
          if (!byCareer && !byText) continue;
          out.push({ inst, course: evaluateCourse(c, entries, inst.key, f.name) });
        }
      }
    }
    return out.sort((a, b) => Number(b.course.eligible) - Number(a.course.eligible)).slice(0, 60);
  }, [q, career, entries]);

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Briefcase className="h-4 w-4 text-[var(--neon-violet)]" /> Career Matcher
        </h2>
        <p className="mt-1 text-[11px] text-white/50">
          Live search across course titles, careers and institutions.
        </p>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Radiographer, Civil Engineer, Accountant…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm placeholder:text-white/30 focus:border-[var(--neon-violet)]/60 focus:outline-none"
          />
        </div>
        {!q.trim() && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {CAREERS.slice(0, 10).map((c) => (
              <button
                key={c.title}
                onClick={() => setQ(c.title)}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/60 transition hover:border-[var(--neon-violet)]/60 hover:text-white"
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
        {career && (
          <p className="mt-3 rounded-xl border border-white/10 bg-black/30 p-2.5 text-[11px] text-white/60">
            <strong className="text-white">{career.title}</strong> — {career.blurb}
          </p>
        )}
      </section>

      <div className="grid gap-2">
        {matches.map(({ inst, course }) => (
          <CourseCard
            key={`${inst.key}-${course.name}`}
            c={course}
            inst={inst}
            saved={isSaved(course, inst)}
            onToggleSave={() => onToggleSave(course, inst)}
            onOpen={() => onOpenCourse(course, inst)}
          />
        ))}
        {q.trim() && matches.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">
            Nothing matched “{q}”. Try a broader term like “engineering” or “nursing”.
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Shortlist -------------------------------- */

function ShortlistView({
  entries,
  items,
  onRemove,
  onOpenCourse,
}: {
  entries: SubjectEntry[];
  items: ReturnType<typeof useShortlist>["items"];
  onRemove: (k: InstitutionKey, name: string) => void;
  onOpenCourse: (c: EvaluatedCourse, i: Institution) => void;
}) {
  const resolved = items
    .map((it) => {
      const inst = INSTITUTIONS.find((i) => i.key === it.instKey);
      if (!inst) return null;
      for (const f of inst.faculties) {
        const c = f.courses.find((x) => x.name === it.courseName);
        if (c) return { inst, course: evaluateCourse(c, entries, inst.key, f.name) };
      }
      return null;
    })
    .filter((x): x is { inst: Institution; course: EvaluatedCourse } => !!x);

  if (resolved.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
        <Bookmark className="mx-auto mb-2 h-6 w-6 text-white/30" />
        Your shortlist is empty. Tap the bookmark icon on any course to track it here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resolved.map(({ inst, course }) => {
        const d = deadlineInfo(inst);
        return (
          <div key={`${inst.key}-${course.name}`} className="glass rounded-2xl p-3.5">
            <div className="flex items-start justify-between gap-3">
              <button className="min-w-0 flex-1 text-left" onClick={() => onOpenCourse(course, inst)}>
                <div className="text-sm font-bold text-white">{course.name}</div>
                <div className="mt-0.5 text-[11px] text-white/50">
                  {inst.name} · {course.duration} · {course.learnerPoints}/{course.minPoints} pts
                </div>
              </button>
              <button
                onClick={() => onRemove(inst.key, course.name)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition hover:text-destructive"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                  d.closed
                    ? "border-[var(--destructive)]/40 bg-[var(--destructive)]/10 text-[var(--destructive)]"
                    : d.days <= 30
                      ? "border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]"
                      : "border-white/10 bg-white/5 text-white/60"
                }`}
              >
                <CalendarClock className="h-3 w-3" /> {d.label}
              </span>
              <a
                href={inst.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] px-3 py-1.5 text-[11px] font-bold text-[#0b0f19]"
              >
                <ExternalLink className="h-3 w-3" /> Apply
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- Settings -------------------------------- */

function SettingsView({
  entries,
  whatIf,
  onToggleWhatIf,
}: {
  entries: SubjectEntry[];
  whatIf: boolean;
  onToggleWhatIf: (v: boolean) => void;
}) {
  const [target, setTarget] = useState(30);
  const best6 = calcTotal(entries, "UNAM", 6);
  const gap = Math.max(0, target - best6);

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Zap className="h-4 w-4 text-[var(--neon-cyan)]" /> Target Score Simulator
        </h2>
        <p className="mt-1 text-[11px] text-white/50">
          Set the score you are aiming for and see the gap against your current Best 6.
        </p>
        <input
          type="range"
          min={20}
          max={48}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="mt-4 w-full accent-[var(--neon-cyan)]"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-white/50">Target: <strong className="text-white">{target} pts</strong></span>
          <span className={gap === 0 ? "text-[var(--success)]" : "text-[var(--warning)]"}>
            {gap === 0 ? "Target reached" : `${gap} point${gap === 1 ? "" : "s"} to go`}
          </span>
        </div>
        <p className="mt-3 rounded-xl border border-white/10 bg-black/30 p-2.5 text-[11px] text-white/55">
          Turn on What-If mode in the Grade Sheet, then edit grades to model upcoming exam results without losing
          track of your real symbols.
        </p>
        <button
          onClick={() => onToggleWhatIf(!whatIf)}
          className={`mt-3 w-full rounded-xl border px-3 py-2 text-[11px] font-bold transition ${
            whatIf
              ? "border-[var(--neon-violet)] bg-[var(--neon-violet)]/20 text-[var(--neon-violet)]"
              : "border-white/10 bg-white/5 text-white/70"
          }`}
        >
          What-If Simulator: {whatIf ? "ON" : "OFF"}
        </button>
      </section>

      <section className="glass rounded-3xl p-4 text-[11px] text-white/55">
        <h2 className="mb-2 text-sm font-bold text-white">About</h2>
        <p>
          Points Matrix evaluates NSSCO and NSSCAS results against published {PROSPECTUS_YEAR} prospectus admission
          criteria for accredited Namibian institutions. It is an indicative guide — final admission decisions rest
          with each institution.
        </p>
        <p className="mt-2">Install this app from your browser menu (“Add to Home screen”) to use it offline-style, full screen.</p>
      </section>
    </div>
  );
}

/* --------------------------- scraped adapter ------------------------------ */

function scrapedToFaculties(rows: ScrapedCourseRow[]): Faculty[] {
  const map = new Map<string, Course[]>();
  const valid = new Set(["A*", "A", "B", "C", "D", "E"]);
  for (const r of rows) {
    const fac = (r.faculty && r.faculty.trim()) || "Offered Qualifications";
    const reqs = (r.requirements ?? [])
      .map((req) => ({
        subject: String(req.subject).trim(),
        minGrade: String(req.minGrade).toUpperCase().replace(/[^A-EU*]/g, "") as NSSCOGrade,
      }))
      .filter((req) => req.subject && valid.has(req.minGrade));
    const course: Course = {
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
