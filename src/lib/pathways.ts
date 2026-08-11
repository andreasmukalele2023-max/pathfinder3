import { INSTITUTIONS, type Course, type Institution } from "./courses";
import { requirementMet } from "./admissions";
import { calcTotal, type InstitutionKey, type SubjectEntry } from "./points";

export interface Pathway {
  inst: Institution;
  faculty: string;
  course: Course;
  learnerPoints: number;
  eligible: boolean;
}

const STOP = new Set([
  "bachelor", "of", "in", "and", "the", "honours", "hons", "science", "sciences",
  "diploma", "certificate", "degree", "studies", "national", "advanced", "a", "&",
]);

function keywords(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

function levelRank(c: Course): number {
  const t = `${c.degreeLevel ?? ""} ${c.name}`.toLowerCase();
  if (t.includes("certificate")) return 0;
  if (t.includes("diploma")) return 1;
  return 2;
}

/**
 * Bridging routes: lower-level qualifications in the same field the learner
 * either already qualifies for or is closest to, which articulate into the target degree.
 */
export function alternativePathways(target: Course, entries: SubjectEntry[]): Pathway[] {
  const kw = keywords(target.name);
  if (kw.length === 0) return [];
  const targetRank = levelRank(target);
  const out: Pathway[] = [];

  for (const inst of INSTITUTIONS) {
    for (const f of inst.faculties) {
      for (const c of f.courses) {
        if (c.name === target.name) continue;
        if (levelRank(c) >= targetRank) continue;
        const text = c.name.toLowerCase();
        if (!kw.some((k) => text.includes(k))) continue;
        const learnerPoints = calcTotal(entries, inst.key as InstitutionKey, c.bestN);
        const eligible =
          learnerPoints >= c.minPoints && c.requirements.every((r) => requirementMet(r, entries));
        out.push({ inst, faculty: f.name, course: c, learnerPoints, eligible });
      }
    }
  }

  return out
    .sort((a, b) => Number(b.eligible) - Number(a.eligible) || a.course.minPoints - b.course.minPoints)
    .slice(0, 6);
}
