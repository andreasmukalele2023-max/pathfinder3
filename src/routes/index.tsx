import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
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
  pointsFor,
} from "@/lib/points";
import { INSTITUTIONS, type Institution, type Course } from "@/lib/courses";
import { GraduationCap, Plus, Trash2, Search, CheckCircle2, XCircle, BookOpen, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Namibian Points Calculator — UNAM, NUST, IUM & Welwitchia" },
      { name: "description", content: "Grade 12 admission points calculator for UNAM, NUST, IUM and Welwitchia. Enter your NSSCO/NSSCA subjects and instantly see qualifying courses." },
      { property: "og:title", content: "Namibian Points Calculator" },
      { property: "og:description", content: "Calculate your admission points and see qualifying courses across UNAM, NUST, IUM and Welwitchia." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const uid = () => Math.random().toString(36).slice(2, 9);

function newRow(subject = ""): SubjectEntry {
  return { id: uid(), subject, level: "NSSCO", grade: "" };
}

function HomePage() {
  const [entries, setEntries] = useState<SubjectEntry[]>([
    newRow("English"),
    newRow("Mathematics"),
    newRow("Biology"),
    newRow("Physical Science"),
    newRow(""),
    newRow(""),
    newRow(""),
  ]);
  const [activeInst, setActiveInst] = useState<Institution["key"]>("UNAM");

  const update = (id: string, patch: Partial<SubjectEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const add = () => entries.length < 8 && setEntries((prev) => [...prev, newRow()]);

  const active = INSTITUTIONS.find((i) => i.key === activeInst)!;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur-xl sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Namibian Points Calculator</h1>
            <p className="text-xs text-muted-foreground truncate">UNAM • NUST • IUM • Welwitchia</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Subject entry */}
        <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-base sm:text-lg">Your subjects</h2>
              <p className="text-xs text-muted-foreground">Enter up to 8 subjects with grade & level.</p>
            </div>
            <button
              onClick={add}
              disabled={entries.length >= 8}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-sm disabled:opacity-50 hover:bg-primary/90 transition"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="divide-y divide-border">
            {entries.map((e, i) => (
              <SubjectRow key={e.id} index={i} entry={e} onChange={(p) => update(e.id, p)} onRemove={() => remove(e.id)} canRemove={entries.length > 1} />
            ))}
          </div>
        </section>

        {/* Institution tabs */}
        <section>
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {INSTITUTIONS.map((inst) => (
              <button
                key={inst.key}
                onClick={() => setActiveInst(inst.key)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition border ${
                  activeInst === inst.key
                    ? "text-white border-transparent shadow-md"
                    : "bg-card text-foreground border-border hover:bg-accent"
                }`}
                style={
                  activeInst === inst.key
                    ? { background: `var(--color-${inst.key.toLowerCase()})` }
                    : undefined
                }
              >
                {inst.name}
              </button>
            ))}
          </div>

          <InstitutionPanel key={active.key} inst={active} entries={entries} />
        </section>

        <footer className="text-center text-xs text-muted-foreground py-6">
          Rule-based calculator. Always verify course requirements with the institution.
        </footer>
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
    <div className="p-3 sm:p-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[24px_minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-3">
      <div className="hidden sm:grid h-6 w-6 place-items-center rounded-md bg-muted text-[11px] font-semibold text-muted-foreground">
        {index + 1}
      </div>

      <select
        value={entry.subject}
        onChange={(e) => onChange({ subject: e.target.value })}
        className="col-span-2 sm:col-span-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-w-0"
      >
        <option value="">Select subject…</option>
        {SUBJECTS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="inline-flex rounded-lg border border-input bg-background p-0.5 text-xs font-medium min-w-0">
        {(["NSSCO", "NSSCA"] as Level[]).map((lvl) => (
          <button
            key={lvl}
            onClick={() => onChange({ level: lvl, grade: "" })}
            className={`flex-1 rounded-md px-2 py-1.5 transition ${
              entry.level === lvl ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <select
        value={entry.grade}
        onChange={(e) => onChange({ grade: e.target.value as Grade })}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-w-0"
      >
        <option value="">Grade</option>
        {grades.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <button
        onClick={onRemove}
        disabled={!canRemove}
        className="shrink-0 grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition disabled:opacity-30"
        aria-label="Remove subject"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function InstitutionPanel({ inst, entries }: { inst: Institution; entries: SubjectEntry[] }) {
  const [showCourses, setShowCourses] = useState(false);
  const [query, setQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("All");
  const [onlyEligible, setOnlyEligible] = useState(true);

  // Compute headline total using best 6 (display); eligibility uses per-course bestN.
  const totalBest6 = useMemo(() => calcTotal(entries, inst.key, 6), [entries, inst.key]);
  const totalBest5 = useMemo(() => calcTotal(entries, inst.key, 5), [entries, inst.key]);

  const englishOk = gradeMeets(findSubject(entries, "English"), "C");
  const mathsEntry = findSubject(entries, "Mathematics");

  const evaluated = useMemo(
    () =>
      inst.faculties.map((f) => ({
        ...f,
        courses: f.courses.map((c) => evaluateCourse(c, entries, inst.key)),
      })),
    [inst, entries],
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

  const instColor = `var(--color-${inst.key.toLowerCase()})`;

  return (
    <div className="mt-4 space-y-4">
      {/* Calculation card */}
      <div
        className="rounded-2xl overflow-hidden shadow-lg text-white"
        style={{ background: `linear-gradient(135deg, ${instColor}, color-mix(in oklab, ${instColor} 60%, black))` }}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest opacity-80">{inst.fullName}</p>
              <h3 className="mt-1 text-xl sm:text-2xl font-bold">{inst.name} Admission Points</h3>
            </div>
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black tabular-nums leading-none">{totalBest6}</div>
              <div className="text-xs opacity-80 mt-1">Best 6 subjects</div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <Stat label="Best 6" value={totalBest6} />
            <Stat label="Best 5" value={totalBest5} />
            <Stat label="English ≥ C" value={englishOk ? "Yes" : "No"} good={englishOk} />
            <Stat label="Maths" value={mathsEntry?.grade || "—"} />
          </div>
        </div>

        <div className="bg-black/20 px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
          <p className="text-xs opacity-90">See faculties & qualifying courses</p>
          <button
            onClick={() => setShowCourses((s) => !s)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs sm:text-sm font-semibold text-foreground shadow hover:bg-white transition"
          >
            <BookOpen className="h-4 w-4" />
            {showCourses ? "Hide courses" : "View Qualifying Courses"}
          </button>
        </div>
      </div>

      {/* Course explorer */}
      {showCourses && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses…"
                className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm min-w-0 flex-1 sm:flex-none"
              >
                <option value="All">All faculties</option>
                {inst.faculties.map((f) => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
              <label className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm cursor-pointer">
                <input type="checkbox" checked={onlyEligible} onChange={(e) => setOnlyEligible(e.target.checked)} className="accent-primary" />
                Only eligible
              </label>
            </div>
          </div>

          <div className="p-4 space-y-5">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No courses match your current filters or grades.
              </div>
            )}
            {filtered.map((f) => (
              <div key={f.name}>
                <div className="flex items-center gap-2 mb-2">
                  <ChevronRight className="h-4 w-4" style={{ color: instColor }} />
                  <h4 className="font-semibold text-sm sm:text-base">{f.name}</h4>
                  <span className="text-xs text-muted-foreground">({f.courses.length})</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {f.courses.map((c) => (
                    <CourseCard key={c.name} c={c} instColor={instColor} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, good }: { label: string; value: string | number; good?: boolean }) {
  return (
    <div className="rounded-lg bg-white/10 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider opacity-75">{label}</div>
      <div className={`text-sm font-bold ${good === false ? "opacity-70" : ""}`}>{value}</div>
    </div>
  );
}

interface EvaluatedCourse extends Course {
  eligible: boolean;
  learnerPoints: number;
  missing: string[];
}

function evaluateCourse(c: Course, entries: SubjectEntry[], instKey: Institution["key"]): EvaluatedCourse {
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

function CourseCard({ c, instColor }: { c: EvaluatedCourse; instColor: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 sm:p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-sm leading-tight">{c.name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{c.duration}</div>
        </div>
        {c.eligible ? (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success-foreground" style={{ color: "oklch(0.35 0.15 155)" }}>
            <CheckCircle2 className="h-3 w-3" /> Eligible
          </span>
        ) : (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
            <XCircle className="h-3 w-3" /> Missing
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Points: <span className="font-semibold text-foreground tabular-nums">{c.learnerPoints}</span> / {c.minPoints}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Best {c.bestN}</span>
      </div>
      {c.missing.length > 0 && (
        <ul className="text-[11px] text-muted-foreground space-y-0.5 border-t border-border pt-2">
          {c.missing.map((m) => (
            <li key={m}>• {m}</li>
          ))}
        </ul>
      )}
      {c.requirements.length > 0 && c.eligible && (
        <div className="text-[11px] text-muted-foreground border-t border-border pt-2">
          Requires: {c.requirements.map((r) => `${r.subject} ≥ ${r.minGrade}`).join(", ")}
        </div>
      )}
      <div className="h-0.5 rounded-full opacity-30" style={{ background: instColor }} />
    </div>
  );
}

// silence unused import in some builds
void pointsFor;
void ({} as NSSCOGrade);
