import type { Course, Institution } from "./courses";
import { requirementLabel, requirementMet } from "./admissions";
import { calcTotal, type InstitutionKey, type SubjectEntry } from "./points";

export interface EvaluatedCourse extends Course {
  eligible: boolean;
  learnerPoints: number;
  missing: string[];
  metCount: number;
  faculty: string;
  instKey: InstitutionKey;
  sourceUrl?: string | null;
}

export function evaluateCourse(
  c: Course & { sourceUrl?: string | null },
  entries: SubjectEntry[],
  instKey: InstitutionKey,
  faculty = "",
): EvaluatedCourse {
  const learnerPoints = calcTotal(entries, instKey, c.bestN);
  const missing: string[] = [];
  if (learnerPoints < c.minPoints) missing.push(`Need ${c.minPoints} points (you have ${learnerPoints})`);
  let metCount = 0;
  for (const req of c.requirements) {
    if (requirementMet(req, entries)) metCount++;
    else missing.push(requirementLabel(req));
  }
  return { ...c, learnerPoints, missing, metCount, faculty, instKey, eligible: missing.length === 0 };
}

export function courseLevel(c: Course): "Certificate" | "Diploma" | "Degree" | "Postgraduate" {
  const t = `${c.degreeLevel ?? ""} ${c.name}`.toLowerCase();
  if (t.includes("certificate")) return "Certificate";
  if (t.includes("diploma") && !t.includes("postgraduate")) return "Diploma";
  if (t.includes("master") || t.includes("postgraduate") || t.includes("phd")) return "Postgraduate";
  return "Degree";
}

export function matchesQuery(c: Course, faculty: string, inst: Institution, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const text = `${c.name} ${faculty} ${inst.name} ${inst.fullName} ${c.duration} ${c.requirements
    .map((r) => `${r.subject} ${r.minGrade}`)
    .join(" ")}`.toLowerCase();
  return q.split(/\s+/).every((t) => text.includes(t));
}
