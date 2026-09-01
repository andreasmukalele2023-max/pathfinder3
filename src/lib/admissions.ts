import type { Course, CourseRequirement, Institution } from "./courses";
import {
  calcBreakdown,
  findAnySubject,
  gradeMeets,
  nsscaEquivalentOf,
  pointsFor,
  type InstitutionKey,
  type NSSCOGrade,
  type SubjectEntry,
} from "./points";

export const PROSPECTUS_YEAR = 2027;

/** Subjects accepted for a requirement (2026 Physical Science split rule). */
export function acceptedSubjects(req: CourseRequirement): string[] {
  return req.anyOf && req.anyOf.length > 0 ? req.anyOf : [req.subject];
}

export function requirementLabel(req: CourseRequirement): string {
  const subs = acceptedSubjects(req).join(" or ");
  return `${subs} ≥ ${req.minGrade} (NSSCO) / ${nsscaEquivalentOf(req.minGrade)} (NSSCAS)`;
}

export function requirementMet(req: CourseRequirement, entries: SubjectEntry[]): boolean {
  const entry = findAnySubject(entries, acceptedSubjects(req));
  return gradeMeets(entry, req.minGrade);
}

/* ------------------------------ NSFAF & fees ------------------------------ */

const NSFAF_FUNDED_INSTITUTIONS: InstitutionKey[] = ["UNAM", "NUST", "IUM", "Welwitchia", "IOL", "NIPAM"];

export function isNsfafEligible(course: Course, instKey: InstitutionKey): boolean {
  if (!NSFAF_FUNDED_INSTITUTIONS.includes(instKey)) return false;
  const lvl = (course.degreeLevel ?? "").toLowerCase();
  const name = course.name.toLowerCase();
  if (lvl === "certificate" || name.includes("certificate")) return false;
  return true;
}

const FEE_RANGES: Record<string, { Degree: string; Diploma: string; Certificate: string }> = {
  UNAM: { Degree: "N$25 000 – N$42 000 / year", Diploma: "N$20 000 – N$28 000 / year", Certificate: "N$14 000 – N$20 000 / year" },
  NUST: { Degree: "N$27 000 – N$45 000 / year", Diploma: "N$21 000 – N$30 000 / year", Certificate: "N$15 000 – N$21 000 / year" },
  IUM: { Degree: "N$30 000 – N$48 000 / year", Diploma: "N$22 000 – N$32 000 / year", Certificate: "N$16 000 – N$22 000 / year" },
  Welwitchia: { Degree: "N$32 000 – N$50 000 / year", Diploma: "N$24 000 – N$34 000 / year", Certificate: "N$17 000 – N$24 000 / year" },
  DEFAULT: { Degree: "N$20 000 – N$35 000 / year", Diploma: "N$15 000 – N$25 000 / year", Certificate: "N$10 000 – N$18 000 / year" },
};

export function estimatedFee(course: Course, instKey: InstitutionKey): string {
  const table = FEE_RANGES[instKey] ?? FEE_RANGES.DEFAULT!;
  const name = course.name.toLowerCase();
  const lvl =
    course.degreeLevel === "Diploma" || name.includes("diploma")
      ? "Diploma"
      : course.degreeLevel === "Certificate" || name.includes("certificate")
      ? "Certificate"
      : "Degree";
  return table[lvl];
}

export function deadlineInfo(inst: Institution): { label: string; days: number; closed: boolean } {
  const due = new Date(inst.applicationDeadline);
  const days = Math.ceil((due.getTime() - Date.now()) / 86_400_000);
  const formatted = due.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  if (days < 0) return { label: `Closed ${formatted}`, days, closed: true };
  if (days === 0) return { label: "Closes today", days, closed: false };
  return { label: `${days} day${days === 1 ? "" : "s"} left · ${formatted}`, days, closed: false };
}

/* ----------------------------- Upgrade advisor ---------------------------- */

export interface UpgradeStep {
  kind: "subject" | "points";
  text: string;
  detail: string;
}

const ORDER: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];

export function upgradePlan(
  course: Course,
  entries: SubjectEntry[],
  instKey: InstitutionKey,
): UpgradeStep[] {
  const steps: UpgradeStep[] = [];

  for (const req of course.requirements) {
    if (requirementMet(req, entries)) continue;
    const subs = acceptedSubjects(req);
    const held = findAnySubject(entries, subs);
    if (!held) {
      steps.push({
        kind: "subject",
        text: `Write ${subs.join(" or ")} at NSSCO level and pass with at least ${req.minGrade}`,
        detail: `You currently have no ${subs.join("/")} result. NamCOL offers this subject part-time; a full-time matric rewrite centre is the faster route.`,
      });
    } else {
      steps.push({
        kind: "subject",
        text: `Upgrade ${held.subject} from ${held.grade} to at least ${req.minGrade}`,
        detail: `That is ${Math.max(1, ORDER.indexOf(held.grade as NSSCOGrade) - ORDER.indexOf(req.minGrade))} grade band(s). NSSCAS grade ${nsscaEquivalentOf(req.minGrade)} also satisfies this requirement.`,
      });
    }
  }

  const { total, rows } = calcBreakdown(entries, instKey, course.bestN);
  const gap = course.minPoints - total;
  if (gap > 0) {
    const weakest = rows.filter((r) => r.counted).sort((a, b) => a.points - b.points).slice(0, 3);
    const suggestions = weakest
      .map((r) => `${r.entry.subject} (${r.entry.grade}, ${r.points} pts)`)
      .join(", ");
    steps.push({
      kind: "points",
      text: `Gain ${gap} more point${gap === 1 ? "" : "s"} (you have ${total} of ${course.minPoints})`,
      detail: weakest.length
        ? `Each NSSCO grade band you improve adds 1 point. Focus your NamCOL rewrite on your weakest counted subjects: ${suggestions}. Converting one subject to NSSCAS level adds up to ${Math.max(
            0,
            pointsFor({ ...weakest[0]!.entry, level: "NSSCA", grade: "C" }, instKey) - weakest[0]!.points,
          )} points.`
        : "Add more graded subjects — only your best subjects are counted.",
    });
  }

  return steps;
}
