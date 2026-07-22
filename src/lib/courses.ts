import type { NSSCOGrade } from "./points";

export interface CourseRequirement {
  subject: string;
  minGrade: NSSCOGrade;
}

export interface Course {
  name: string;
  duration: string;
  minPoints: number;
  bestN: 5 | 6;
  requirements: CourseRequirement[];
  degreeLevel?: "Degree" | "Diploma" | "Certificate" | "Postgraduate";
  sourceUrl?: string | null;
}

export interface Faculty {
  name: string;
  courses: Course[];
}

export interface Institution {
  key: "UNAM" | "NUST" | "IUM" | "Welwitchia" | "TC" | "IOL" | "SBS" | "NIPAM";
  name: string;
  fullName: string;
  officialSite: string;
  faculties: Faculty[];
}

export const INSTITUTIONS: Institution[] = [
  {
    key: "UNAM",
    name: "UNAM",
    fullName: "University of Namibia",
    officialSite: "https://www.unam.edu.na",
    faculties: [
      {
        name: "Health Sciences & Veterinary Medicine",
        courses: [
          { name: "Bachelor of Medicine & Bachelor of Surgery (MBChB)", duration: "6 years", minPoints: 35, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Biology", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Dental Surgery (BDS)", duration: "5 years", minPoints: 35, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }, { subject: "Biology", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Pharmacy (Honours)", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Chemistry", minGrade: "B" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Nursing Science (Honours)", duration: "4 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }, { subject: "Physical Science", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Radiography (Diagnostic)", duration: "4 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Physical Science", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Veterinary Medicine (BVM)", duration: "6 years", minPoints: 34, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Diploma in General Nursing and Midwifery", duration: "3 years", minPoints: 25, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Biology", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
        ],
      },
      {
        name: "Commerce, Management & Law",
        courses: [
          { name: "Bachelor of Accounting (Chartered Accountancy)", duration: "4 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Accounting (General)", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Economics", duration: "3 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Business Administration (BBA)", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Human Resources Management", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Public Management", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Laws (LLB)", duration: "4 years", minPoints: 32, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "B. Juris (Criminal Justice)", duration: "3 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Diploma in Local Government Studies", duration: "2 years", minPoints: 22, bestN: 6, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
        ],
      },
      {
        name: "Engineering & Spatial Sciences",
        courses: [
          { name: "Bachelor of Civil Engineering (Honours)", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Mechanical Engineering (Honours)", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Electrical Engineering (Honours)", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Mining Engineering (Honours)", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Electronics & Computer Engineering", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
        ],
      },
      {
        name: "Science & Agriculture",
        courses: [
          { name: "Bachelor of Science in Computer Science", duration: "3 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Science in Cybersecurity & Data Science", duration: "3 years", minPoints: 30, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Science (Biology & Chemistry)", duration: "3 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Science in Agriculture (Animal Science)", duration: "4 years", minPoints: 28, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Science in Wildlife Management & Tourism", duration: "3 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "D" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
        ],
      },
      {
        name: "Humanities, Education & Social Sciences",
        courses: [
          { name: "Bachelor of Education (Senior Primary)", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Education (Secondary)", duration: "4 years", minPoints: 26, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Education (Early Childhood & Junior Primary)", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Arts in Media Studies & Communication", duration: "3 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Social Work (Honours)", duration: "4 years", minPoints: 25, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
          { name: "Bachelor of Psychology (Honours)", duration: "4 years", minPoints: 27, bestN: 6, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.unam.edu.na/undergraduate-programmes" },
        ],
      },
    ],
  },
  {
    key: "NUST",
    name: "NUST",
    fullName: "Namibia University of Science and Technology",
    officialSite: "https://www.nust.na",
    faculties: [
      {
        name: "Computing & Informatics",
        courses: [
          { name: "Bachelor of Computer Science (Cyber Security)", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Computer Science (Software Development)", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Computer Science (Systems Administration)", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Informatics (Business Analysis)", duration: "3 years", minPoints: 28, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Diploma in Information Technology", duration: "2 years", minPoints: 25, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.nust.na/programmes" },
        ],
      },
      {
        name: "Engineering & Spatial Sciences",
        courses: [
          { name: "Bachelor of Engineering in Civil Engineering", duration: "4 years", minPoints: 35, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Engineering in Mechanical Engineering", duration: "4 years", minPoints: 35, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Engineering in Electronics & Telecommunications", duration: "4 years", minPoints: 35, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Architecture", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Quantity Surveying", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Land Administration", duration: "3 years", minPoints: 27, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
        ],
      },
      {
        name: "Commerce & Management Sciences",
        courses: [
          { name: "Bachelor of Accounting (Professional)", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Marketing", duration: "3 years", minPoints: 27, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Logistics & Supply Chain Management", duration: "3 years", minPoints: 28, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Human Resources Management", duration: "3 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Hospitality Management", duration: "3 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
        ],
      },
      {
        name: "Health, Applied Sciences & Natural Resources",
        courses: [
          { name: "Bachelor of Medical Laboratory Sciences", duration: "4 years", minPoints: 32, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }, { subject: "Physical Science", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Emergency Medical Care", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Environmental Health Sciences", duration: "4 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Natural Resource Management", duration: "3 years", minPoints: 27, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "D" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Science in Applied Mathematics & Statistics", duration: "3 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }], sourceUrl: "https://www.nust.na/programmes" },
        ],
      },
      {
        name: "Human Sciences & Communication",
        courses: [
          { name: "Bachelor of Communication", duration: "3 years", minPoints: 26, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of Journalism & Media Technology", duration: "3 years", minPoints: 26, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
          { name: "Bachelor of English & Applied Linguistics", duration: "3 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.nust.na/programmes" },
        ],
      },
    ],
  },
  {
    key: "IUM",
    name: "IUM",
    fullName: "International University of Management",
    officialSite: "https://www.ium.edu.na",
    faculties: [
      {
        name: "Business Administration & Information Technology",
        courses: [
          { name: "Bachelor of Business Administration (Honours)", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Bachelor of Science in Information Technology (Honours)", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Bachelor of Finance & Management (Honours)", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Bachelor of Marketing Management (Honours)", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Diploma in Information Technology", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
        ],
      },
      {
        name: "Health Sciences & Nursing",
        courses: [
          { name: "Bachelor of Nursing Science (Honours)", duration: "4 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Bachelor of Environmental Health", duration: "4 years", minPoints: 26, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Diploma in Public Health", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
        ],
      },
      {
        name: "Education & Humanities",
        courses: [
          { name: "Bachelor of Education (Honours) Senior Primary", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Bachelor of Education (Honours) Secondary", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Diploma in Educational Leadership & Management", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
        ],
      },
      {
        name: "Tourism, Hospitality & Events",
        courses: [
          { name: "Bachelor of Tourism, Hospitality & Events Management (Honours)", duration: "4 years", minPoints: 25, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
          { name: "Diploma in Hospitality & Tourism Management", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.ium.edu.na/faculties/" },
        ],
      },
    ],
  },
  {
    key: "Welwitchia",
    name: "Welwitchia",
    fullName: "Welwitchia Health Sciences University",
    officialSite: "https://welwitchiauniversity.edu.na",
    faculties: [
      {
        name: "Nursing, Pharmacy & Health Sciences",
        courses: [
          { name: "Bachelor of Science in Nursing & Midwifery (Honours)", duration: "4 years", minPoints: 28, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }], sourceUrl: "https://welwitchiauniversity.edu.na/programmes/" },
          { name: "Bachelor of Science in Pharmacy", duration: "4 years", minPoints: 30, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "C" }, { subject: "Chemistry", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }], sourceUrl: "https://welwitchiauniversity.edu.na/programmes/" },
          { name: "Diploma in General Nursing and Midwifery", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Biology", minGrade: "D" }], sourceUrl: "https://welwitchiauniversity.edu.na/programmes/" },
          { name: "Diploma in Occupational Health & Safety", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://welwitchiauniversity.edu.na/programmes/" },
          { name: "Diploma in Community Health & Caregiving", duration: "2 years", minPoints: 20, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "E" }], sourceUrl: "https://welwitchiauniversity.edu.na/programmes/" },
        ],
      },
    ],
  },
  {
    key: "TC",
    name: "TC",
    fullName: "Triumphant College",
    officialSite: "https://www.triumphantcollege.com",
    faculties: [
      {
        name: "Engineering, IT & Business",
        courses: [
          { name: "Diploma in Civil & Structural Engineering", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.triumphantcollege.com/programmes" },
          { name: "Diploma in Electrical & Electronics Engineering", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }], sourceUrl: "https://www.triumphantcollege.com/programmes" },
          { name: "Diploma in Business Management & Entrepreneurship", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.triumphantcollege.com/programmes" },
          { name: "Diploma in Information Technology & Networking", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.triumphantcollege.com/programmes" },
          { name: "Certificate in Logistics & Supply Chain Management", duration: "1 year", minPoints: 20, bestN: 5, degreeLevel: "Certificate", requirements: [{ subject: "English", minGrade: "E" }], sourceUrl: "https://www.triumphantcollege.com/programmes" },
        ],
      },
    ],
  },
  {
    key: "IOL",
    name: "IOL",
    fullName: "Institute of Open Learning",
    officialSite: "https://iol.edu.na",
    faculties: [
      {
        name: "Education & Open Learning",
        courses: [
          { name: "Diploma in Junior Primary Education", duration: "3 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://iol.edu.na/programmes/" },
          { name: "Diploma in Senior Primary Education", duration: "3 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://iol.edu.na/programmes/" },
          { name: "Diploma in Secondary Education", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://iol.edu.na/programmes/" },
          { name: "Diploma in Educational Management & Leadership", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://iol.edu.na/programmes/" },
          { name: "Certificate in Early Childhood Development (ECD)", duration: "1 year", minPoints: 20, bestN: 5, degreeLevel: "Certificate", requirements: [{ subject: "English", minGrade: "E" }], sourceUrl: "https://iol.edu.na/programmes/" },
        ],
      },
    ],
  },
  {
    key: "SBS",
    name: "SBS",
    fullName: "Southern Business School (STADIO)",
    officialSite: "https://www.sbsnamibia.com",
    faculties: [
      {
        name: "Management, Safety & Public Sector",
        courses: [
          { name: "Bachelor of Business Administration (BBA)", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.sbsnamibia.com/qualifications/" },
          { name: "Bachelor of Policing Practice", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.sbsnamibia.com/qualifications/" },
          { name: "Bachelor of Disaster Risk Management", duration: "3 years", minPoints: 24, bestN: 5, degreeLevel: "Degree", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.sbsnamibia.com/qualifications/" },
          { name: "Diploma in Management", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.sbsnamibia.com/qualifications/" },
          { name: "Advanced Diploma in Management", duration: "1 year", minPoints: 24, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://www.sbsnamibia.com/qualifications/" },
        ],
      },
    ],
  },
  {
    key: "NIPAM",
    name: "NIPAM",
    fullName: "Namibia Institute of Public Administration and Management",
    officialSite: "https://nipam.na",
    faculties: [
      {
        name: "Public Governance & Administration",
        courses: [
          { name: "Executive Diploma in Public Management", duration: "2 years", minPoints: 25, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "C" }], sourceUrl: "https://nipam.na/training/" },
          { name: "Diploma in Local Government Management", duration: "2 years", minPoints: 22, bestN: 5, degreeLevel: "Diploma", requirements: [{ subject: "English", minGrade: "D" }], sourceUrl: "https://nipam.na/training/" },
          { name: "Certificate in Public Sector Finance & Procurement", duration: "1 year", minPoints: 20, bestN: 5, degreeLevel: "Certificate", requirements: [{ subject: "English", minGrade: "E" }], sourceUrl: "https://nipam.na/training/" },
          { name: "Specialized Certificate in Public Governance", duration: "1 year", minPoints: 20, bestN: 5, degreeLevel: "Certificate", requirements: [{ subject: "English", minGrade: "E" }], sourceUrl: "https://nipam.na/training/" },
        ],
      },
    ],
  },
];
