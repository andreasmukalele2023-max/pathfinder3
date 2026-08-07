export interface Career {
  title: string;
  aliases: string[];
  /** Keywords matched against course names. */
  keywords: string[];
  blurb: string;
}

export const CAREERS: Career[] = [
  { title: "Radiographer / Radiotherapist", aliases: ["radiography", "radiotherapy", "x-ray"], keywords: ["radiograph", "radiation", "medical imaging"], blurb: "Medical imaging and radiation treatment of patients." },
  { title: "Medical Doctor", aliases: ["doctor", "physician", "mbchb"], keywords: ["medicine", "surgery", "mbchb"], blurb: "Diagnose and treat illness in clinical practice." },
  { title: "Nurse", aliases: ["nursing", "midwife"], keywords: ["nursing", "midwifery"], blurb: "Clinical patient care in hospitals and clinics." },
  { title: "Pharmacist", aliases: ["pharmacy"], keywords: ["pharmac"], blurb: "Dispense medicines and advise on drug therapy." },
  { title: "Civil Engineer", aliases: ["structural engineer"], keywords: ["civil engineering"], blurb: "Design roads, bridges, water and building infrastructure." },
  { title: "Electrical Engineer", aliases: ["power engineer"], keywords: ["electrical", "electronics"], blurb: "Power systems, electronics and control engineering." },
  { title: "Mechanical Engineer", aliases: ["mechatronics"], keywords: ["mechanical", "mechatronic"], blurb: "Machines, manufacturing and thermal systems." },
  { title: "Mining / Metallurgical Engineer", aliases: ["miner", "geologist"], keywords: ["mining", "metallurg", "geolog"], blurb: "Extraction and processing of Namibia's mineral resources." },
  { title: "Software Developer", aliases: ["programmer", "IT", "software engineer"], keywords: ["computer", "software", "informatics", "information technology", "data science", "cyber"], blurb: "Build software, apps and data systems." },
  { title: "Accountant / Auditor", aliases: ["chartered accountant", "CA"], keywords: ["accounting", "accountancy", "auditing"], blurb: "Financial reporting, auditing and tax." },
  { title: "Economist", aliases: ["financial analyst"], keywords: ["economic", "finance", "banking"], blurb: "Analyse markets, policy and financial performance." },
  { title: "Lawyer", aliases: ["advocate", "attorney", "legal"], keywords: ["law", "juris", "legal"], blurb: "Legal practice, justice and compliance." },
  { title: "Teacher", aliases: ["educator", "lecturer"], keywords: ["education", "teaching"], blurb: "Teach in primary, secondary or vocational education." },
  { title: "Agricultural Scientist", aliases: ["farmer", "agronomist"], keywords: ["agricultur", "animal science", "crop", "natural resource"], blurb: "Crop, livestock and natural resource management." },
  { title: "Environmental Scientist", aliases: ["conservationist", "wildlife"], keywords: ["environment", "wildlife", "conservation", "tourism"], blurb: "Conservation, wildlife and environmental management." },
  { title: "Human Resources Practitioner", aliases: ["HR"], keywords: ["human resource", "industrial psychology"], blurb: "Recruitment, labour relations and people management." },
  { title: "Public Administrator", aliases: ["civil servant", "government"], keywords: ["public management", "public administration", "local government", "governance"], blurb: "Manage public institutions and government services." },
  { title: "Social Worker / Psychologist", aliases: ["counsellor"], keywords: ["social work", "psycholog", "sociolog"], blurb: "Community welfare, counselling and mental health." },
  { title: "Journalist", aliases: ["media", "communications"], keywords: ["journalism", "media", "communication"], blurb: "News, media production and corporate communication." },
  { title: "Architect / Quantity Surveyor", aliases: ["built environment"], keywords: ["architect", "quantity survey", "land management", "property", "spatial"], blurb: "Design and cost management of the built environment." },
  { title: "Hospitality & Tourism Manager", aliases: ["hotel manager", "chef"], keywords: ["hospitality", "tourism", "culinary", "travel"], blurb: "Run hotels, lodges and tourism operations." },
  { title: "Logistics & Supply Chain Manager", aliases: ["procurement"], keywords: ["logistics", "supply chain", "transport", "procurement"], blurb: "Move goods and manage procurement networks." },
];

export function findCareer(query: string): Career | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return (
    CAREERS.find((c) => c.title.toLowerCase() === q) ??
    CAREERS.find((c) => c.title.toLowerCase().includes(q) || c.aliases.some((a) => a.toLowerCase().includes(q))) ??
    CAREERS.find((c) => c.keywords.some((k) => q.includes(k) || k.includes(q)))
  );
}

export function careerMatchesCourse(career: Career, courseName: string): boolean {
  const n = courseName.toLowerCase();
  return career.keywords.some((k) => n.includes(k));
}
