export type Level = "NSSCO" | "NSSCA";
export type NSSCOGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "U";
export type NSSCAGrade = "d" | "m" | "p" | "e" | "U";
export type Grade = NSSCOGrade | NSSCAGrade;

export interface SubjectEntry {
  id: string;
  subject: string;
  level: Level;
  grade: Grade | "";
}

export const SUBJECTS = [
  "English",
  "Mathematics",
  "Biology",
  "Physical Science",
  "Chemistry",
  "Physics",
  "Accounting",
  "Entrepreneurship",
  "History",
  "Geography",
  "Agriculture",
  "Computer Studies",
  "Development Studies",
  "Economics",
  "Life Science",
  "Afrikaans",
  "Oshindonga",
  "Otjiherero",
];

export const NSSCO_GRADES: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];
export const NSSCA_GRADES: NSSCAGrade[] = ["d", "m", "p", "e", "U"];

// Standard NSSCO points (used by NUST/IUM/Welwitchia scales are similar)
const NSSCO_POINTS: Record<NSSCOGrade, number> = {
  "A*": 8, A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1, U: 0,
};

// NSSCA (Advanced Subsidiary) — higher weighting
const NSSCA_POINTS: Record<NSSCAGrade, number> = {
  d: 8, m: 7, p: 6, e: 4, U: 0,
};

// UNAM uses its own scale where A*=8 down to G=1 for NSSCO and Advanced adds bonus
const UNAM_NSSCO: Record<NSSCOGrade, number> = {
  "A*": 8, A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1, U: 0,
};
const UNAM_NSSCA: Record<NSSCAGrade, number> = {
  d: 8, m: 7, p: 6, e: 4, U: 0,
};

export function pointsFor(entry: SubjectEntry, institution: "UNAM" | "NUST" | "IUM" | "Welwitchia"): number {
  if (!entry.grade || entry.grade === "U") return 0;
  if (entry.level === "NSSCO") {
    const g = entry.grade as NSSCOGrade;
    if (institution === "UNAM") return UNAM_NSSCO[g] ?? 0;
    return NSSCO_POINTS[g] ?? 0;
  } else {
    const g = entry.grade as NSSCAGrade;
    if (institution === "UNAM") return UNAM_NSSCA[g] ?? 0;
    return NSSCA_POINTS[g] ?? 0;
  }
}

export function gradeMeets(entry: SubjectEntry | undefined, minGrade: NSSCOGrade): boolean {
  if (!entry || !entry.grade || entry.grade === "U") return false;
  if (entry.level === "NSSCA") {
    // Advanced subsidiary always exceeds NSSCO requirement of C or better
    const g = entry.grade as NSSCAGrade;
    return g === "d" || g === "m" || g === "p" || g === "e";
  }
  const order: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];
  return order.indexOf(entry.grade as NSSCOGrade) <= order.indexOf(minGrade);
}

export function findSubject(entries: SubjectEntry[], name: string): SubjectEntry | undefined {
  return entries.find((e) => e.subject.toLowerCase() === name.toLowerCase() && e.grade && e.grade !== "U");
}

export function calcTotal(
  entries: SubjectEntry[],
  institution: "UNAM" | "NUST" | "IUM" | "Welwitchia",
  bestN: 5 | 6 = 6,
): number {
  const valid = entries.filter((e) => e.subject && e.grade && e.grade !== "U");
  const scored = valid.map((e) => pointsFor(e, institution)).sort((a, b) => b - a);
  return scored.slice(0, bestN).reduce((a, b) => a + b, 0);
}
