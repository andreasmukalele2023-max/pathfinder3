export type Level = "NSSCO" | "NSSCA";
export type NSSCOGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "U";
export type NSSCAGrade = "A" | "B" | "C" | "D" | "E" | "U";
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
export const NSSCA_GRADES: NSSCAGrade[] = ["A", "B", "C", "D", "E", "U"];

const NSSCO_POINTS: Record<NSSCOGrade, number> = {
  "A*": 8, A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1, U: 0,
};

// NSSCA Advanced Subsidiary: A=10, B=9, C=8, D=7, E=6, U=0
const NSSCA_POINTS: Record<NSSCAGrade, number> = {
  A: 10, B: 9, C: 8, D: 7, E: 6, U: 0,
};

export function pointsFor(entry: SubjectEntry): number {
  if (!entry.grade || entry.grade === "U") return 0;
  if (entry.level === "NSSCO") return NSSCO_POINTS[entry.grade as NSSCOGrade] ?? 0;
  return NSSCA_POINTS[entry.grade as NSSCAGrade] ?? 0;
}

export function gradeMeets(entry: SubjectEntry | undefined, minGrade: NSSCOGrade): boolean {
  if (!entry || !entry.grade || entry.grade === "U") return false;
  if (entry.level === "NSSCA") {
    // Advanced subsidiary A–E all exceed any NSSCO requirement
    return true;
  }
  const order: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];
  return order.indexOf(entry.grade as NSSCOGrade) <= order.indexOf(minGrade);
}

export function findSubject(entries: SubjectEntry[], name: string): SubjectEntry | undefined {
  return entries.find((e) => e.subject.toLowerCase() === name.toLowerCase() && e.grade && e.grade !== "U");
}

export function calcTotal(
  entries: SubjectEntry[],
  _institution: "UNAM" | "NUST" | "IUM" | "Welwitchia" | "TC" | "IOL" | "SBS" | "NIPAM",
  bestN: 5 | 6 = 6,
): number {
  const valid = entries.filter((e) => e.subject && e.grade && e.grade !== "U");
  const scored = valid.map((e) => pointsFor(e)).sort((a, b) => b - a);
  return scored.slice(0, bestN).reduce((a, b) => a + b, 0);
}
