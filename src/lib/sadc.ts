import type { Institution } from "./courses";

/**
 * Accredited public universities across the SADC region.
 * Entry points are expressed on the Namibian NSSCO/NSSCAS points scale so a
 * learner can compare regional options with local ones on equal footing.
 * Always confirm with the institution — international applicants also need
 * an equivalency/exemption certificate.
 */
export const SADC_INSTITUTIONS: Institution[] = [
  {
    key: "UP",
    name: "UP",
    fullName: "University of Pretoria",
    country: "South Africa",
    region: "SADC",
    accent: "#6f9bd8",
    officialSite: "https://www.up.ac.za",
    applyUrl: "https://www.up.ac.za/apply",
    portalName: "UP Online Application",
    applicationDeadline: "2026-06-30",
    faculties: [
      {
        name: "Health Sciences",
        courses: [
          { name: "MBChB (Medicine)", duration: "6 years", minPoints: 36, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", anyOf: ["Physics", "Chemistry"], minGrade: "B" }, { subject: "Biology", minGrade: "B" }] },
          { name: "BRad (Diagnostics) — Radiography", duration: "4 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }, { subject: "Physics", anyOf: ["Physics", "Chemistry"], minGrade: "C" }] },
          { name: "BSc Physiotherapy", duration: "4 years", minPoints: 32, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering, Built Environment & IT",
        courses: [
          { name: "BEng Civil Engineering", duration: "4 years", minPoints: 33, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "B" }] },
          { name: "BSc Computer Science", duration: "3 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }] },
          { name: "BCom Accounting Sciences", duration: "3 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UCT",
    name: "UCT",
    fullName: "University of Cape Town",
    country: "South Africa",
    region: "SADC",
    accent: "#4aa3c7",
    officialSite: "https://www.uct.ac.za",
    applyUrl: "https://applyonline.uct.ac.za",
    portalName: "UCT Apply Online",
    applicationDeadline: "2026-07-31",
    faculties: [
      {
        name: "Health Sciences",
        courses: [
          { name: "MBChB (Medicine)", duration: "6 years", minPoints: 37, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "B" }] },
          { name: "BSc Occupational Therapy", duration: "4 years", minPoints: 31, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Commerce, Science & Humanities",
        courses: [
          { name: "BCom (Actuarial Science)", duration: "3 years", minPoints: 34, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Mathematics", minGrade: "A" }] },
          { name: "BSc (Chemistry & Biology majors)", duration: "3 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }, { subject: "Chemistry", anyOf: ["Chemistry", "Physics", "Biology"], minGrade: "C" }] },
          { name: "Bachelor of Social Science", duration: "3 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "WITS",
    name: "Wits",
    fullName: "University of the Witwatersrand",
    country: "South Africa",
    region: "SADC",
    accent: "#d3a04a",
    officialSite: "https://www.wits.ac.za",
    applyUrl: "https://www.wits.ac.za/applications/",
    portalName: "Wits Self Service",
    applicationDeadline: "2026-06-30",
    faculties: [
      {
        name: "Health Sciences",
        courses: [
          { name: "BHSc Radiation Sciences (Radiography)", duration: "4 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }, { subject: "Physics", anyOf: ["Physics", "Chemistry"], minGrade: "C" }] },
          { name: "MBBCh (Medicine)", duration: "6 years", minPoints: 36, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "B" }] },
          { name: "BPharm", duration: "4 years", minPoints: 31, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Chemistry", anyOf: ["Chemistry", "Physics"], minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering & Science",
        courses: [
          { name: "BSc Mining Engineering", duration: "4 years", minPoints: 32, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "B" }] },
          { name: "BSc Geology", duration: "3 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "STELL",
    name: "SU",
    fullName: "Stellenbosch University",
    country: "South Africa",
    region: "SADC",
    accent: "#8fc46b",
    officialSite: "https://www.sun.ac.za",
    applyUrl: "https://www.maties.com/apply",
    portalName: "Stellenbosch Apply",
    applicationDeadline: "2026-07-31",
    faculties: [
      {
        name: "Science, AgriSciences & Engineering",
        courses: [
          { name: "BSc Agriculture (Animal Science)", duration: "4 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
          { name: "BEng Mechatronic Engineering", duration: "4 years", minPoints: 33, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "B" }] },
          { name: "BSc Nursing", duration: "4 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UB",
    name: "UB",
    fullName: "University of Botswana",
    country: "Botswana",
    region: "SADC",
    accent: "#5ec8e0",
    officialSite: "https://www.ub.bw",
    applyUrl: "https://www.ub.bw/admissions",
    portalName: "UB Admissions",
    applicationDeadline: "2026-09-30",
    faculties: [
      {
        name: "Health Sciences & Medicine",
        courses: [
          { name: "Bachelor of Medicine & Surgery (MBBS)", duration: "5 years", minPoints: 34, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "B" }] },
          { name: "Bachelor of Nursing Science", duration: "4 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering, Business & Humanities",
        courses: [
          { name: "BEng Electrical & Electronics", duration: "5 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "C" }] },
          { name: "Bachelor of Accountancy", duration: "4 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Education (Secondary)", duration: "4 years", minPoints: 24, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "BIUST",
    name: "BIUST",
    fullName: "Botswana International University of Science & Technology",
    country: "Botswana",
    region: "SADC",
    accent: "#4fb3a4",
    officialSite: "https://www.biust.ac.bw",
    applyUrl: "https://www.biust.ac.bw/admissions",
    portalName: "BIUST Admissions",
    applicationDeadline: "2026-09-30",
    faculties: [
      {
        name: "Science & Engineering",
        courses: [
          { name: "BEng Mining Engineering", duration: "5 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "C" }] },
          { name: "BSc Computer Science", duration: "4 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "BSc Geology", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UZ",
    name: "UZ",
    fullName: "University of Zimbabwe",
    country: "Zimbabwe",
    region: "SADC",
    accent: "#e0a05e",
    officialSite: "https://www.uz.ac.zw",
    applyUrl: "https://www.uz.ac.zw/index.php/admissions",
    portalName: "UZ Admissions",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Medicine & Health Sciences",
        courses: [
          { name: "Bachelor of Medicine & Surgery (MBChB)", duration: "5 years", minPoints: 33, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "B" }] },
          { name: "BSc Radiography", duration: "4 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Physics", anyOf: ["Physics", "Chemistry"], minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Commerce & Social Studies",
        courses: [
          { name: "BSc Economics", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Laws (LLB)", duration: "4 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }] },
        ],
      },
    ],
  },
  {
    key: "NUSTZW",
    name: "NUST ZW",
    fullName: "National University of Science & Technology (Zimbabwe)",
    country: "Zimbabwe",
    region: "SADC",
    accent: "#c98ae0",
    officialSite: "https://www.nust.ac.zw",
    applyUrl: "https://www.nust.ac.zw/admissions",
    portalName: "NUST Zimbabwe Admissions",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Applied Sciences & Engineering",
        courses: [
          { name: "BEng Industrial & Manufacturing", duration: "4 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "C" }] },
          { name: "BSc Applied Biology & Biochemistry", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }, { subject: "Chemistry", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UNZA",
    name: "UNZA",
    fullName: "University of Zambia",
    country: "Zambia",
    region: "SADC",
    accent: "#6fd08c",
    officialSite: "https://www.unza.zm",
    applyUrl: "https://apply.unza.zm",
    portalName: "UNZA Apply",
    applicationDeadline: "2026-09-30",
    faculties: [
      {
        name: "Medicine & Health",
        courses: [
          { name: "Bachelor of Medicine & Surgery (MBChB)", duration: "7 years", minPoints: 33, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "B" }] },
          { name: "BSc Nursing", duration: "4 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering, Mines & Business",
        courses: [
          { name: "BEng Mining Engineering", duration: "5 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "C" }] },
          { name: "Bachelor of Business Administration", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "CBU",
    name: "CBU",
    fullName: "Copperbelt University (Zambia)",
    country: "Zambia",
    region: "SADC",
    accent: "#e08a6f",
    officialSite: "https://www.cbu.ac.zm",
    applyUrl: "https://www.cbu.ac.zm/admissions",
    portalName: "CBU Admissions",
    applicationDeadline: "2026-09-30",
    faculties: [
      {
        name: "Engineering & Built Environment",
        courses: [
          { name: "BEng Chemical Engineering", duration: "5 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Chemistry", minGrade: "C" }] },
          { name: "Bachelor of Architecture", duration: "5 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UNAL",
    name: "UAN",
    fullName: "Universidade Agostinho Neto (Angola)",
    country: "Angola",
    region: "SADC",
    accent: "#e05e5e",
    officialSite: "https://www.uan.ao",
    applyUrl: "https://www.uan.ao",
    portalName: "UAN Admissions",
    applicationDeadline: "2026-07-31",
    faculties: [
      {
        name: "Medicine, Science & Engineering",
        courses: [
          { name: "Licenciatura em Medicina", duration: "6 years", minPoints: 32, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "B" }] },
          { name: "Licenciatura em Engenharia Civil", duration: "5 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "Mathematics", minGrade: "C" }, { subject: "Physics", minGrade: "C" }] },
          { name: "Licenciatura em Economia", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "Mathematics", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "UNESWA",
    name: "UNESWA",
    fullName: "University of Eswatini",
    country: "Eswatini",
    region: "SADC",
    accent: "#7f9ee0",
    officialSite: "https://www.uneswa.ac.sz",
    applyUrl: "https://www.uneswa.ac.sz/admissions/",
    portalName: "UNESWA Admissions",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Science, Health & Commerce",
        courses: [
          { name: "BSc Environmental Health Science", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
          { name: "Bachelor of Commerce", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "BSc Agriculture", duration: "4 years", minPoints: 24, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Biology", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "NUL",
    name: "NUL",
    fullName: "National University of Lesotho",
    country: "Lesotho",
    region: "SADC",
    accent: "#9ad0e0",
    officialSite: "https://www.nul.ls",
    applyUrl: "https://www.nul.ls/admissions",
    portalName: "NUL Admissions",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Science, Law & Humanities",
        courses: [
          { name: "BSc Computer Science", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Laws (LLB)", duration: "5 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }] },
          { name: "Bachelor of Education", duration: "4 years", minPoints: 23, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "UNIMA",
    name: "UNIMA",
    fullName: "University of Malawi",
    country: "Malawi",
    region: "SADC",
    accent: "#e0c15e",
    officialSite: "https://www.unima.ac.mw",
    applyUrl: "https://www.unima.ac.mw/admissions",
    portalName: "UNIMA Admissions",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Science & Social Science",
        courses: [
          { name: "BSc Biological Sciences", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
          { name: "Bachelor of Social Science", duration: "4 years", minPoints: 24, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UEM",
    name: "UEM",
    fullName: "Universidade Eduardo Mondlane (Mozambique)",
    country: "Mozambique",
    region: "SADC",
    accent: "#6fe0c1",
    officialSite: "https://www.uem.mz",
    applyUrl: "https://www.uem.mz",
    portalName: "UEM Admissions",
    applicationDeadline: "2026-07-31",
    faculties: [
      {
        name: "Engineering, Medicine & Sciences",
        courses: [
          { name: "Licenciatura em Medicina", duration: "6 years", minPoints: 32, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "B" }] },
          { name: "Licenciatura em Engenharia Informática", duration: "5 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "Mathematics", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "UDSM",
    name: "UDSM",
    fullName: "University of Dar es Salaam (Tanzania)",
    country: "Tanzania",
    region: "SADC",
    accent: "#5ee0a0",
    officialSite: "https://www.udsm.ac.tz",
    applyUrl: "https://aris.udsm.ac.tz",
    portalName: "UDSM ARIS",
    applicationDeadline: "2026-08-31",
    faculties: [
      {
        name: "Engineering, Science & Business",
        courses: [
          { name: "BSc Petroleum Engineering", duration: "4 years", minPoints: 29, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physics", minGrade: "C" }] },
          { name: "Bachelor of Commerce (Finance)", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "UOM",
    name: "UoM",
    fullName: "University of Mauritius",
    country: "Mauritius",
    region: "SADC",
    accent: "#e06fa8",
    officialSite: "https://www.uom.ac.mu",
    applyUrl: "https://www.uom.ac.mu/admissions",
    portalName: "UoM Admissions",
    applicationDeadline: "2026-07-31",
    faculties: [
      {
        name: "Engineering, ICT & Science",
        courses: [
          { name: "BSc Software Engineering", duration: "4 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "BSc Biomedical Sciences", duration: "3 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }, { subject: "Chemistry", minGrade: "C" }] },
        ],
      },
    ],
  },
];
