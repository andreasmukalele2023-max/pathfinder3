import { jsPDF } from "jspdf";
import { INSTITUTIONS } from "./courses";
import { calcTotal, pointsFor, type SubjectEntry } from "./points";
import { PROSPECTUS_YEAR, requirementMet, isNsfafEligible } from "./admissions";

export function exportSummaryPdf(entries: SubjectEntry[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  let y = 56;

  const line = (text: string, size = 10, bold = false, color: [number, number, number] = [30, 30, 40]) => {
    if (y > H - 60) {
      doc.addPage();
      y = 56;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const wrapped = doc.splitTextToSize(text, W - 88);
    doc.text(wrapped, 44, y);
    y += wrapped.length * (size + 3);
  };

  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, W, 78, "F");
  doc.setTextColor(0, 210, 230);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("POINTS / MATRIX", 44, 42);
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 220);
  doc.text(`Namibian Admission Points Summary — ${PROSPECTUS_YEAR} Academic Year`, 44, 60);
  y = 108;

  const graded = entries.filter((e) => e.subject && e.grade && e.grade !== "U");

  line("Your Subjects & Grades", 13, true);
  y += 2;
  for (const e of graded) {
    line(`• ${e.subject} — ${e.level} grade ${e.grade} (${pointsFor(e, "UNAM")} pts UNAM / ${pointsFor(e, "NUST")} pts NUST)`, 10);
  }
  if (graded.length === 0) line("No graded subjects entered.", 10);

  y += 10;
  line("Calculated Points", 13, true);
  for (const key of ["UNAM", "NUST"] as const) {
    line(`${key}: Best 6 = ${calcTotal(entries, key, 6)} points · Best 5 = ${calcTotal(entries, key, 5)} points`, 10);
  }

  y += 12;
  line("Qualifying Courses Across Namibian Institutions", 13, true);

  let totalQualified = 0;
  for (const inst of INSTITUTIONS) {
    const qualified: string[] = [];
    for (const f of inst.faculties) {
      for (const c of f.courses) {
        const pts = calcTotal(entries, inst.key, c.bestN);
        if (pts < c.minPoints) continue;
        if (!c.requirements.every((r) => requirementMet(r, entries))) continue;
        qualified.push(`${c.name} (${f.name}, ${c.duration}${isNsfafEligible(c, inst.key) ? ", NSFAF eligible" : ""})`);
      }
    }
    if (qualified.length === 0) continue;
    totalQualified += qualified.length;
    y += 6;
    line(`${inst.fullName} — ${qualified.length} qualifying programme(s)`, 11, true, [0, 90, 130]);
    line(
      `Apply: ${inst.portalName} — ${inst.applyUrl}  ·  Closing date: ${new Date(inst.applicationDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
      8,
      false,
      [90, 90, 120],
    );
    for (const q of qualified) line(`• ${q}`, 9);
  }
  if (totalQualified === 0) line("No qualifying programmes yet — see the Upgrade Advisor in the app for how to qualify.", 10);


  y += 16;
  line(`Generated ${new Date().toLocaleString("en-GB")}`, 8, false, [110, 110, 130]);
  line(
    `Disclaimer: This evaluation is based on published ${PROSPECTUS_YEAR} prospectus admission criteria and is an indicative guide only. Final admission decisions rest with each institution.`,
    8,
    false,
    [110, 110, 130],
  );

  doc.save(`points-matrix-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
}
