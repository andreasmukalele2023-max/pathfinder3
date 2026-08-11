import { useMemo } from "react";
import {
  AlertTriangle,
  Banknote,
  Bookmark,
  BookmarkCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Route as RouteIcon,
  Wrench,
  X,
} from "lucide-react";
import type { Institution } from "@/lib/courses";
import type { SubjectEntry } from "@/lib/points";
import type { EvaluatedCourse } from "@/lib/evaluate";
import { courseLevel } from "@/lib/evaluate";
import {
  PROSPECTUS_YEAR,
  deadlineInfo,
  estimatedFee,
  isNsfafEligible,
  requirementLabel,
  requirementMet,
  upgradePlan,
} from "@/lib/admissions";
import { alternativePathways } from "@/lib/pathways";

export function CourseCard({
  c,
  inst,
  saved,
  onToggleSave,
  onOpen,
}: {
  c: EvaluatedCourse;
  inst: Institution;
  saved: boolean;
  onToggleSave: () => void;
  onOpen: () => void;
}) {
  const nsfaf = isNsfafEligible(c, inst.key);
  return (
    <button
      onClick={onOpen}
      className={`group w-full rounded-2xl border p-3.5 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] ${
        c.eligible
          ? "border-[var(--success)]/40 bg-[var(--success)]/[0.08] hover:bg-[var(--success)]/15"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
            c.eligible
              ? "bg-[var(--success)]/20 text-[var(--success)]"
              : "bg-[var(--warning)]/15 text-[var(--warning)]"
          }`}
          title={c.eligible ? "Eligible" : "Missing prerequisites"}
        >
          {c.eligible ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Lock className="h-4 w-4" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold leading-snug text-white">{c.name}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-bold uppercase tracking-wider text-white/70">
              {inst.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-white/60">
              <Clock className="h-2.5 w-2.5" /> {c.duration}
            </span>
            <span className="rounded-full border border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/10 px-2 py-0.5 font-semibold text-[var(--neon-violet)]">
              {courseLevel(c)}
            </span>
            {nsfaf && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--success)]/40 bg-[var(--success)]/10 px-2 py-0.5 font-semibold text-[var(--success)]">
                <Banknote className="h-2.5 w-2.5" /> NSFAF
              </span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-[width] duration-700"
                style={{
                  width: `${Math.min(100, (c.learnerPoints / Math.max(1, c.minPoints)) * 100)}%`,
                  background: c.eligible ? "var(--success)" : "var(--warning)",
                }}
              />
            </div>
            <span className="tabular-nums text-white/60">
              {c.learnerPoints}/{c.minPoints} pts · Best {c.bestN}
            </span>
          </div>
        </div>

        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onToggleSave();
            }
          }}
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition ${
            saved
              ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
              : "border-white/10 bg-white/5 text-white/40 hover:text-white"
          }`}
          aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
        >
          {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
        </span>
      </div>
    </button>
  );
}

export function CourseSheet({
  course,
  inst,
  entries,
  saved,
  onToggleSave,
  onClose,
}: {
  course: EvaluatedCourse;
  inst: Institution;
  entries: SubjectEntry[];
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  const fee = estimatedFee(course, inst.key);
  const deadline = deadlineInfo(inst);
  const nsfaf = isNsfafEligible(course, inst.key);
  const plan = useMemo(
    () => (course.eligible ? [] : upgradePlan(course, entries, inst.key)),
    [course, entries, inst.key],
  );
  const pathways = useMemo(
    () => (course.eligible ? [] : alternativePathways(course, entries)),
    [course, entries],
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full animate-sheet-up overflow-y-auto rounded-t-3xl border border-white/15 glass-strong p-5 shadow-2xl sm:max-w-lg sm:animate-scale-up sm:rounded-3xl">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">
              {inst.fullName}
            </div>
            <h3 className="mt-1 font-display text-lg font-black leading-snug text-white">{course.name}</h3>
            <div className="mt-1 text-[11px] text-white/50">
              {course.faculty || "Programme"} · {course.duration} · Updated for {PROSPECTUS_YEAR}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onToggleSave}
              className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
                saved
                  ? "border-[var(--neon-cyan)]/60 bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]"
                  : "border-white/10 bg-white/5 text-white/50 hover:text-white"
              }`}
              aria-label="Toggle shortlist"
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Status</div>
            <div className="mt-1 font-bold">
              {course.eligible ? (
                <span className="flex items-center gap-1 text-[var(--success)]">
                  <CheckCircle2 className="h-4 w-4" /> Eligible
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[var(--warning)]">
                  <AlertTriangle className="h-4 w-4" /> Missing requirements
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Your points</div>
            <div className="mt-1 font-display font-bold neon-cyan tabular-nums">
              {course.learnerPoints}
              <span className="text-white/40"> / {course.minPoints} required</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Estimated fees</div>
            <div className="mt-1 font-semibold text-white/90">{fee}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-3">
            <div className="text-[10px] uppercase tracking-wider text-white/50">Funding</div>
            <div className={`mt-1 font-semibold ${nsfaf ? "text-[var(--success)]" : "text-white/60"}`}>
              {nsfaf ? "NSFAF eligible" : "Self / private funding"}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="text-xs font-bold text-white/70">Prerequisite checklist</div>
          {course.requirements.length === 0 ? (
            <div className="text-xs text-white/50">General admission point requirements apply.</div>
          ) : (
            course.requirements.map((r) => {
              const ok = requirementMet(r, entries);
              return (
                <div
                  key={`${r.subject}-${r.minGrade}`}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-[11px] ${
                    ok
                      ? "border-[var(--success)]/30 bg-[var(--success)]/10"
                      : "border-[var(--destructive)]/30 bg-[var(--destructive)]/10"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-semibold text-white/90">
                    {ok ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" />
                    ) : (
                      <AlertTriangle className="h-3.5 w-3.5 text-[var(--destructive)]" />
                    )}
                    {r.anyOf?.join(" / ") ?? r.subject}
                  </span>
                  <span className="font-mono text-white/60">{requirementLabel(r)}</span>
                </div>
              );
            })
          )}
        </div>

        {plan.length > 0 && (
          <div className="mt-4 space-y-2 rounded-xl border border-[var(--warning)]/30 bg-[var(--warning)]/[0.07] p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--warning)]">
              <Wrench className="h-3.5 w-3.5" /> How to qualify
            </div>
            {plan.map((st) => (
              <div key={st.text} className="text-[11px]">
                <div className="font-semibold text-white">{st.text}</div>
                <div className="text-white/55">{st.detail}</div>
              </div>
            ))}
            <div className="border-t border-white/5 pt-1 text-[10px] text-white/40">
              Upgrade via NamCOL part-time / distance NSSCO &amp; NSSCAS, or a full-time matric rewrite centre.
            </div>
          </div>
        )}

        {pathways.length > 0 && (
          <div className="mt-4 space-y-2 rounded-xl border border-[var(--neon-violet)]/30 bg-[var(--neon-violet)]/[0.07] p-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--neon-violet)]">
              <RouteIcon className="h-3.5 w-3.5" /> Alternative pathways into this field
            </div>
            {pathways.map((p) => (
              <div
                key={`${p.inst.key}-${p.course.name}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5 text-[11px]"
              >
                <span className="min-w-0">
                  <span className="font-semibold text-white">{p.course.name}</span>
                  <span className="block text-[10px] text-white/45">
                    {p.inst.name} · {p.course.duration} · {p.course.minPoints} pts
                  </span>
                </span>
                <span
                  className={`shrink-0 text-[10px] font-bold ${
                    p.eligible ? "text-[var(--success)]" : "text-white/40"
                  }`}
                >
                  {p.eligible ? "Open to you" : `${p.learnerPoints}/${p.course.minPoints}`}
                </span>
              </div>
            ))}
            <div className="text-[10px] text-white/40">
              These bridging qualifications commonly articulate into the degree once completed.
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <a
            href={inst.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] px-4 py-2.5 text-xs font-bold text-[#0b0f19] transition hover:scale-[1.02]"
          >
            <ExternalLink className="h-4 w-4" /> Apply · {inst.portalName}
          </a>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
              deadline.closed
                ? "border-[var(--destructive)]/40 bg-[var(--destructive)]/10 text-[var(--destructive)]"
                : deadline.days <= 30
                  ? "border-[var(--warning)]/40 bg-[var(--warning)]/10 text-[var(--warning)]"
                  : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            <CalendarClock className="h-3 w-3" /> {deadline.label}
          </span>
        </div>
      </div>
    </div>
  );
}
