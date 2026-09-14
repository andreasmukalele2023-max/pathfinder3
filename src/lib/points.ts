export type Level = "NSSCO" | "NSSCA";
export type NSSCOGrade = "A*" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "U";
export type NSSCAGrade = "A" | "B" | "C" | "D" | "E" | "U";
export type Grade = NSSCOGrade | NSSCAGrade;

/** Institution identifier. Namibian keys (UNAM, NUST, …) plus SADC keys. */
export type InstitutionKey = string;


export interface SubjectEntry {
  id: string;
  subject: string;
  level: Level;
  grade: Grade | "";
}

/**
 * Official NIED senior-secondary subject offering (NSSCO, Ordinary Level).
 * Source: NIED senior secondary syllabus register. Physical Science no longer
 * exists — the sciences are examined separately as Physics and Chemistry.
 */
export const NSSCO_SUBJECT_GROUPS: { group: string; subjects: string[] }[] = [
  {
    group: "Core & Sciences",
    subjects: [
      "English",
      "Mathematics",
      "Biology",
      "Chemistry",
      "Physics",
      "Agriculture",
      "Agricultural Science",
      "Geography",
      "Life Skills",
    ],
  },
  {
    group: "Commerce & Social Sciences",
    subjects: [
      "Accounting",
      "Business Studies",
      "Economics",
      "Entrepreneurship",
      "Development Studies",
      "History",
      "Office Practice",
    ],
  },
  {
    group: "Technology & ICT",
    subjects: [
      "Computer Studies",
      "Information & Communication Technology (ICT)",
      "Design & Technology",
      "Building Studies",
      "Woodwork",
    ],
  },
  {
    group: "Home Sciences & Hospitality",
    subjects: ["Home Economics", "Fashion & Fabrics", "Hospitality"],
  },
  {
    group: "Arts & Physical Education",
    subjects: ["Art & Design", "Integrated Performing Arts", "Physical Education"],
  },
  {
    group: "Namibian Languages",
    subjects: [
      "Afrikaans",
      "Khoekhoegowab",
      "Oshindonga",
      "Oshikwanyama",
      "Otjiherero",
      "Rukwangali",
      "Rumanyo",
      "Silozi",
      "Thimbukushu",
    ],
  },
  {
    group: "Foreign Languages",
    subjects: ["German", "French"],
  },
];

/**
 * Official NIED NSSCAS (Advanced Subsidiary, Grade 12) subject offering.
 * Considerably narrower than the Ordinary Level list.
 */
export const NSSCA_SUBJECT_GROUPS: { group: string; subjects: string[] }[] = [
  {
    group: "Core & Sciences",
    subjects: ["English", "Mathematics", "Biology", "Chemistry", "Physics", "Agricultural Science", "Geography"],
  },
  {
    group: "Commerce & Social Sciences",
    subjects: ["Accounting", "Business Studies", "Economics", "Entrepreneurship", "History", "Social Studies", "Life Skills"],
  },
  {
    group: "Technology & ICT",
    subjects: [
      "Computer Science",
      "Information & Communication Technology (ICT)",
      "Design & Technology",
      "Motor Mechanics",
    ],
  },
  {
    group: "Arts",
    subjects: ["Art & Design"],
  },
  {
    group: "Namibian Languages",
    subjects: ["Afrikaans", "Khoekhoegowab", "Oshikwanyama", "Silozi", "Thimbukushu"],
  },
  {
    group: "Foreign Languages",
    subjects: ["German", "French"],
  },
];

export function subjectGroupsFor(level: Level) {
  return level === "NSSCA" ? NSSCA_SUBJECT_GROUPS : NSSCO_SUBJECT_GROUPS;
}

export function subjectsFor(level: Level): string[] {
  return subjectGroupsFor(level).flatMap((g) => g.subjects);
}

export function isSubjectOffered(subject: string, level: Level): boolean {
  return subjectsFor(level).some((s) => s.toLowerCase() === subject.toLowerCase());
}

/** Backwards-compatible full list (Ordinary Level offering). */
export const SUBJECT_GROUPS = NSSCO_SUBJECT_GROUPS;

export const SUBJECTS = Array.from(new Set([...subjectsFor("NSSCO"), ...subjectsFor("NSSCA")]));



export const NSSCO_GRADES: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];
export const NSSCA_GRADES: NSSCAGrade[] = ["A", "B", "C", "D", "E", "U"];

const NSSCO_POINTS: Record<NSSCOGrade, number> = {
  "A*": 8, A: 7, B: 6, C: 5, D: 4, E: 3, F: 2, G: 1, U: 0,
};

/** Institution-specific NSSCAS (Advanced Subsidiary) conversion scales. */
const NSSCA_SCALES: Record<string, Record<NSSCAGrade, number>> = {
  // UNAM 2027: AS grades carry a full premium over Ordinary level
  UNAM: { A: 10, B: 9, C: 8, D: 7, E: 6, U: 0 },
  // NUST 2027: AS conversion is one band lower than UNAM's
  NUST: { A: 9, B: 8, C: 7, D: 6, E: 5, U: 0 },
  // Default (IUM, Welwitchia, TC, IOL, SBS, NIPAM) follow the national AS scale
  DEFAULT: { A: 10, B: 9, C: 8, D: 7, E: 6, U: 0 },
};

export function nsscaScaleFor(institution?: InstitutionKey): Record<NSSCAGrade, number> {
  if (!institution) return NSSCA_SCALES.DEFAULT!;
  return NSSCA_SCALES[institution] ?? NSSCA_SCALES.DEFAULT!;
}

export function scaleLabel(institution?: InstitutionKey): string {
  if (institution === "NUST") return "NUST AS scale (A=9 … E=5)";
  if (institution === "UNAM") return "UNAM AS scale (A=10 … E=6)";
  return "National AS scale (A=10 … E=6)";
}

export function pointsFor(entry: SubjectEntry, institution?: InstitutionKey): number {
  if (!entry.grade || entry.grade === "U") return 0;
  if (entry.level === "NSSCO") return NSSCO_POINTS[entry.grade as NSSCOGrade] ?? 0;
  return nsscaScaleFor(institution)[entry.grade as NSSCAGrade] ?? 0;
}

/** Human-readable explanation used for the calculation tooltips. */
export function explainEntry(entry: SubjectEntry, institution?: InstitutionKey): string {
  if (!entry.subject) return "Select a subject to include it in the calculation.";
  if (!entry.grade || entry.grade === "U") return `${entry.subject}: ungraded — contributes 0 points.`;
  const pts = pointsFor(entry, institution);
  if (entry.level === "NSSCO") {
    return `${entry.subject} — NSSCO (Ordinary) grade ${entry.grade} = ${pts} points on the standard Ordinary scale (A*=8 … G=1).`;
  }
  return `${entry.subject} — NSSCAS (Advanced Subsidiary) grade ${entry.grade} = ${pts} points on the ${scaleLabel(institution)}.`;
}

/** NSSCAS grade expressed as its Ordinary-level equivalent for prerequisite checks. */
const NSSCA_TO_NSSCO: Record<NSSCAGrade, NSSCOGrade> = {
  A: "A*", B: "A*", C: "A", D: "A", E: "B", U: "U",
};

export function equivalentNSSCO(entry: SubjectEntry): NSSCOGrade | null {
  if (!entry.grade || entry.grade === "U") return null;
  if (entry.level === "NSSCO") return entry.grade as NSSCOGrade;
  return NSSCA_TO_NSSCO[entry.grade as NSSCAGrade] ?? null;
}

const ORDER: NSSCOGrade[] = ["A*", "A", "B", "C", "D", "E", "F", "G", "U"];

export function gradeMeets(entry: SubjectEntry | undefined, minGrade: NSSCOGrade): boolean {
  if (!entry) return false;
  const eq = equivalentNSSCO(entry);
  if (!eq) return false;
  return ORDER.indexOf(eq) <= ORDER.indexOf(minGrade);
}

/** NSSCAS grade that satisfies an Ordinary-level minimum (exemption rule). */
export function nsscaEquivalentOf(minGrade: NSSCOGrade): NSSCAGrade {
  const idx = ORDER.indexOf(minGrade);
  if (idx <= ORDER.indexOf("A")) return "C";
  if (idx <= ORDER.indexOf("B")) return "E";
  return "E";
}

export function findSubject(entries: SubjectEntry[], name: string): SubjectEntry | undefined {
  return entries.find((e) => e.subject.toLowerCase() === name.toLowerCase() && e.grade && e.grade !== "U");
}

/** Best matching entry for a requirement that accepts several subjects. */
export function findAnySubject(entries: SubjectEntry[], names: string[]): SubjectEntry | undefined {
  const matches = names
    .map((n) => findSubject(entries, n))
    .filter((e): e is SubjectEntry => !!e);
  if (matches.length === 0) return undefined;
  return matches.sort((a, b) => pointsFor(b) - pointsFor(a))[0];
}

export interface CountedEntry {
  entry: SubjectEntry;
  points: number;
  counted: boolean;
}

export function calcBreakdown(
  entries: SubjectEntry[],
  institution: InstitutionKey,
  bestN: 5 | 6 = 6,
): { total: number; rows: CountedEntry[] } {
  const valid = entries.filter((e) => e.subject && e.grade && e.grade !== "U");
  const scored = valid
    .map((e) => ({ entry: e, points: pointsFor(e, institution), counted: false }))
    .sort((a, b) => b.points - a.points);
  scored.slice(0, bestN).forEach((r) => (r.counted = true));
  const total = scored.filter((r) => r.counted).reduce((a, b) => a + b.points, 0);
  return { total, rows: scored };
}

export function calcTotal(
  entries: SubjectEntry[],
  institution: InstitutionKey,
  bestN: 5 | 6 = 6,
): number {
  return calcBreakdown(entries, institution, bestN).total;
}
