import { useMemo } from "react";
import { Info, Plus, Trash2, X, Sparkles, Download, Wand2 } from "lucide-react";
import {
  SUBJECT_GROUPS,
  NSSCO_GRADES,
  NSSCA_GRADES,
  explainEntry,
  calcTotal,
  findSubject,
  type Grade,
  type InstitutionKey,
  type Level,
  type SubjectEntry,
} from "@/lib/points";

export const uid = () => Math.random().toString(36).slice(2, 9);
export const newRow = (subject = ""): SubjectEntry => ({ id: uid(), subject, level: "NSSCO", grade: "" });

export function englishBadge(english: SubjectEntry | undefined): { label: string; tone: "good" | "warn" | "bad" } {
  if (!english || !english.grade || english.grade === "U") return { label: "—", tone: "bad" };
  if (english.level === "NSSCA") return { label: english.grade, tone: "good" };
  const g = english.grade as string;
  if (["A*", "A", "B", "C"].includes(g)) return { label: g, tone: "good" };
  if (g === "D") return { label: g, tone: "warn" };
  return { label: g, tone: "bad" };
}

/* ------------------------------- Gauges ---------------------------------- */

export function Gauge({
  label,
  value,
  max,
  tone = "cyan",
  caption,
  hint,
}: {
  label: string;
  value: number | string;
  max?: number;
  tone?: "cyan" | "violet" | "good" | "warn" | "bad";
  caption?: string;
  hint?: string;
}) {
  const colors: Record<string, string> = {
    cyan: "var(--neon-cyan)",
    violet: "var(--neon-violet)",
    good: "var(--success)",
    warn: "var(--warning)",
    bad: "var(--destructive)",
  };
  const color = colors[tone]!;
  const pct = typeof value === "number" && max ? Math.min(100, (value / max) * 100) : 100;

  return (
    <div
      className="rounded-2xl border border-white/10 bg-black/30 p-3 transition hover:-translate-y-0.5"
      style={{ boxShadow: `0 0 18px color-mix(in oklab, ${color} 18%, transparent)` }}
      title={hint}
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-white/50">
        <span>{label}</span>
        {hint && <Info className="h-2.5 w-2.5" />}
      </div>
      <div className="mt-1 font-display text-2xl font-black tabular-nums" style={{ color }}>
        {value}
        {typeof value === "number" && max && <span className="text-xs font-semibold text-white/30"> / {max}</span>}
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }}
        />
      </div>
      {caption && <div className="mt-1.5 text-[10px] text-white/40">{caption}</div>}
    </div>
  );
}

export function ScoreGauges({
  entries,
  institution,
}: {
  entries: SubjectEntry[];
  institution: InstitutionKey;
}) {
  const best6 = useMemo(() => calcTotal(entries, institution, 6), [entries, institution]);
  const best5 = useMemo(() => calcTotal(entries, institution, 5), [entries, institution]);
  const eng = englishBadge(findSubject(entries, "English"));

  return (
    <div className="grid grid-cols-3 gap-2.5">
      <Gauge label="Best 6" value={best6} max={48} tone="cyan" caption={`${institution} scale`} hint="Sum of your six highest-scoring subjects on this institution's conversion scale." />
      <Gauge label="Best 5" value={best5} max={40} tone="violet" caption={`${institution} scale`} hint="Sum of your five highest-scoring subjects." />
      <Gauge label="English" value={eng.label} tone={eng.tone} caption="Compulsory" hint="English is compulsory nationwide. Green = C or better, amber = D, red = E or lower." />
    </div>
  );
}

/* ----------------------------- Grade sheet -------------------------------- */

export function GradeSheet({
  open,
  onClose,
  entries,
  setEntries,
  institution,
  whatIf,
  onToggleWhatIf,
  onExport,
}: {
  open: boolean;
  onClose: () => void;
  entries: SubjectEntry[];
  setEntries: (fn: (prev: SubjectEntry[]) => SubjectEntry[]) => void;
  institution: InstitutionKey;
  whatIf: boolean;
  onToggleWhatIf: (v: boolean) => void;
  onExport: () => void;
}) {
  const update = (id: string, patch: Partial<SubjectEntry>) =>
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const add = () => setEntries((prev) => (prev.length >= 10 ? prev : [...prev, newRow()]));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[88vh] rounded-t-3xl border-t border-white/15 glass-strong transition-transform duration-300 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:max-h-none sm:rounded-t-none sm:rounded-l-3xl sm:border-l sm:border-t-0 ${
          open ? "translate-y-0 sm:translate-x-0" : "translate-y-full sm:translate-y-0 sm:translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Sparkles className="h-4 w-4 text-[var(--neon-cyan)]" /> Grade Sheet
            </h2>
            <p className="mt-0.5 text-[11px] text-white/50">Up to 10 NSSCO / NSSCAS subjects</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={add}
              disabled={entries.length >= 10}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 px-2.5 py-1.5 text-[11px] font-bold text-[var(--neon-cyan)] transition hover:bg-[var(--neon-cyan)]/20 disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
              aria-label="Close grade sheet"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3">
          <ScoreGauges entries={entries} institution={institution} />
        </div>

        <div className="max-h-[45vh] divide-y divide-white/5 overflow-y-auto sm:max-h-[calc(100vh-330px)]">
          {entries.map((e, i) => (
            <SubjectRow
              key={e.id}
              index={i}
              entry={e}
              institution={institution}
              onChange={(p) => update(e.id, p)}
              onRemove={() => remove(e.id)}
              canRemove={entries.length > 1}
            />
          ))}
        </div>

        <div className="space-y-2 border-t border-white/10 p-3">
          <button
            onClick={() => onToggleWhatIf(!whatIf)}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-[11px] font-bold transition ${
              whatIf
                ? "border-[var(--neon-violet)] bg-[var(--neon-violet)]/20 text-[var(--neon-violet)]"
                : "border-white/10 bg-white/5 text-white/70"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Wand2 className="h-3.5 w-3.5" /> What-If Simulator
            </span>
            <span>{whatIf ? "ON — editing target grades" : "OFF"}</span>
          </button>
          <button
            onClick={onExport}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] px-4 py-2.5 text-xs font-bold text-[#0b0f19] transition hover:scale-[1.01]"
          >
            <Download className="h-4 w-4" /> Export Summary (PDF)
          </button>
        </div>
      </aside>
    </>
  );
}

function SubjectRow({
  index,
  entry,
  institution,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  entry: SubjectEntry;
  institution: InstitutionKey;
  onChange: (p: Partial<SubjectEntry>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const grades = entry.level === "NSSCO" ? NSSCO_GRADES : NSSCA_GRADES;
  const explanation = explainEntry(entry, institution);
  return (
    <div className="space-y-1.5 p-2.5">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="w-4 shrink-0 font-mono text-[10px] text-white/30">{String(index + 1).padStart(2, "0")}</span>
        <select
          value={entry.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          className="w-full min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs focus:border-[var(--neon-cyan)]/60 focus:outline-none"
        >
          <option value="">Select subject…</option>
          {SUBJECT_GROUPS.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 pl-[22px]">
        <div className="inline-flex min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 p-0.5 text-[9px] font-bold">
          {(["NSSCO", "NSSCA"] as Level[]).map((lvl) => (
            <button
              key={lvl}
              onClick={() => onChange({ level: lvl, grade: "" })}
              className={`min-w-0 flex-1 rounded-md px-1 py-1 transition ${
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
          className="w-[64px] shrink-0 rounded-lg border border-white/10 bg-white/5 px-1.5 py-1.5 text-xs focus:border-[var(--neon-violet)]/60 focus:outline-none"
        >
          <option value="">—</option>
          {grades.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <span
          title={explanation}
          aria-label={explanation}
          className="grid h-7 w-7 shrink-0 cursor-help place-items-center rounded-lg text-white/30 transition hover:text-[var(--neon-cyan)]"
        >
          <Info className="h-3.5 w-3.5" />
        </span>

        <button
          onClick={onRemove}
          disabled={!canRemove}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-white/40 transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-20"
          aria-label="Remove subject"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
