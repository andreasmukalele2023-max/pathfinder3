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
}

export interface Faculty {
  name: string;
  courses: Course[];
}

export interface Institution {
  key: "UNAM" | "NUST" | "IUM" | "Welwitchia" | "TC" | "IOL" | "SBS" | "NIPAM";
  name: string;
  fullName: string;
  faculties: Faculty[];
}

export const INSTITUTIONS: Institution[] = [
  {
    key: "UNAM",
    name: "UNAM",
    fullName: "University of Namibia",
    faculties: [
      {
        name: "Health Sciences & Veterinary Medicine",
        courses: [
          { name: "Bachelor of Medicine & Surgery (MBChB)", duration: "6 years", minPoints: 35, bestN: 5, requirements: [{ subject: "English", minGrade: "B" }, { subject: "Biology", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Nursing Science", duration: "4 years", minPoints: 30, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
          { name: "Bachelor of Pharmacy", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Chemistry", minGrade: "B" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Veterinary Medicine", duration: "6 years", minPoints: 34, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "B" }, { subject: "Chemistry", minGrade: "C" }] },
        ],
      },
      {
        name: "Commerce & Management",
        courses: [
          { name: "Bachelor of Accounting (CA)", duration: "4 years", minPoints: 30, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Economics", duration: "3 years", minPoints: 26, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "Bachelor of Business Administration", duration: "3 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
          { name: "Bachelor of Human Resources Management", duration: "3 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering & Spatial Sciences",
        courses: [
          { name: "Bachelor of Civil Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }] },
          { name: "Bachelor of Mechanical Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }] },
          { name: "Bachelor of Mining Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }] },
        ],
      },
      {
        name: "Humanities & Education",
        courses: [
          { name: "Bachelor of Education (Senior Primary)", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
          { name: "Bachelor of Arts (Media Studies)", duration: "3 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
          { name: "Bachelor of Social Work", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
      {
        name: "Science",
        courses: [
          { name: "Bachelor of Science (Biology/Chem)", duration: "3 years", minPoints: 28, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Computer Science", duration: "3 years", minPoints: 30, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Law",
        courses: [
          { name: "Bachelor of Laws (LLB)", duration: "4 years", minPoints: 32, bestN: 6, requirements: [{ subject: "English", minGrade: "B" }] },
          { name: "B. Juris (Justice)", duration: "3 years", minPoints: 27, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
    ],
  },
  {
    key: "NUST",
    name: "NUST",
    fullName: "Namibia University of Science and Technology",
    faculties: [
      {
        name: "Commerce",
        courses: [
          { name: "Bachelor of Accounting (Professional)", duration: "3 years", minPoints: 30, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Marketing", duration: "3 years", minPoints: 27, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "Bachelor of Logistics & Supply Chain", duration: "3 years", minPoints: 28, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Human Sciences & Education",
        courses: [
          { name: "Bachelor of Communication", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }] },
          { name: "Bachelor of Education (TVET)", duration: "4 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
      {
        name: "Engineering & Spatial Sciences",
        courses: [
          { name: "Bachelor of Electrical Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }] },
          { name: "Bachelor of Civil Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }, { subject: "Physical Science", minGrade: "B" }] },
          { name: "Bachelor of Land Administration", duration: "3 years", minPoints: 28, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
        ],
      },
      {
        name: "Health & Applied Sciences",
        courses: [
          { name: "Bachelor of Environmental Health", duration: "4 years", minPoints: 30, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
          { name: "Bachelor of Emergency Medical Care", duration: "4 years", minPoints: 30, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "C" }] },
        ],
      },
      {
        name: "Computing & Informatics",
        courses: [
          { name: "Bachelor of Informatics", duration: "3 years", minPoints: 28, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "C" }] },
          { name: "Bachelor of Software Engineering", duration: "4 years", minPoints: 32, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "B" }] },
        ],
      },
    ],
  },
  {
    key: "IUM",
    name: "IUM",
    fullName: "International University of Management",
    faculties: [
      {
        name: "Information Technology & Systems",
        courses: [
          { name: "Bachelor of IT (Business Systems)", duration: "3 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Computer Science", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }] },
        ],
      },
      {
        name: "Business Administration",
        courses: [
          { name: "Bachelor of Business Administration", duration: "3 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Accounting & Finance", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Marketing Management", duration: "3 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Human Resources Management", duration: "3 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
      {
        name: "Education",
        courses: [
          { name: "Bachelor of Education (Early Childhood)", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Education (Senior Primary)", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
      {
        name: "Health Sciences",
        courses: [
          { name: "Bachelor of Public Health", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "D" }] },
          { name: "Bachelor of Health Services Management", duration: "3 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "Welwitchia",
    name: "Welwitchia",
    fullName: "Welwitchia Health Training Centre / University",
    faculties: [
      {
        name: "Health Sciences & Nursing",
        courses: [
          { name: "Bachelor of Nursing Science (General)", duration: "4 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Biology", minGrade: "D" }] },
          { name: "Diploma in Nursing", duration: "3 years", minPoints: 22, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Biology", minGrade: "D" }] },
          { name: "Bachelor of Pharmacy Technology", duration: "3 years", minPoints: 27, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Chemistry", minGrade: "D" }] },
        ],
      },
      {
        name: "Education",
        courses: [
          { name: "Bachelor of Education (Primary)", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
      {
        name: "Computing & Information Systems",
        courses: [
          { name: "Bachelor of Computing (BSc)", duration: "3 years", minPoints: 26, bestN: 6, requirements: [{ subject: "English", minGrade: "C" }, { subject: "Mathematics", minGrade: "D" }] },
        ],
      },
      {
        name: "Management & Business",
        courses: [
          { name: "Bachelor of Business Management", duration: "3 years", minPoints: 24, bestN: 6, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "TC",
    name: "TC",
    fullName: "Triumphant College",
    faculties: [
      {
        name: "Business & Management",
        courses: [
          { name: "Bachelor of Business Administration", duration: "3 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Bachelor of Accounting", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "Diploma in Human Resources Management", duration: "2 years", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }] },
        ],
      },
      {
        name: "Information Technology",
        courses: [
          { name: "Bachelor of Information Technology", duration: "3 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "Diploma in Information Technology", duration: "2 years", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }] },
        ],
      },
      {
        name: "Public Relations & Media",
        courses: [
          { name: "Diploma in Public Relations", duration: "2 years", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Diploma in Journalism & Media Studies", duration: "2 years", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
    ],
  },
  {
    key: "IOL",
    name: "IOL",
    fullName: "Institute of Open Learning",
    faculties: [
      {
        name: "Education",
        courses: [
          { name: "Diploma in Early Childhood Development", duration: "3 years", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }] },
          { name: "Bachelor of Education (Pre & Lower Primary)", duration: "4 years", minPoints: 25, bestN: 6, requirements: [{ subject: "English", minGrade: "D" }] },
        ],
      },
      {
        name: "Business Studies",
        courses: [
          { name: "Diploma in Business Management", duration: "3 years", minPoints: 22, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Certificate in Bookkeeping & Accounting", duration: "1 year", minPoints: 18, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }, { subject: "Mathematics", minGrade: "E" }] },
        ],
      },
      {
        name: "Information Technology",
        courses: [
          { name: "Diploma in Information Technology", duration: "3 years", minPoints: 22, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "E" }] },
        ],
      },
    ],
  },
  {
    key: "SBS",
    name: "SBS",
    fullName: "Southern Business School Namibia",
    faculties: [
      {
        name: "Commerce & Management",
        courses: [
          { name: "Bachelor of Commerce", duration: "3 years", minPoints: 26, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }, { subject: "Mathematics", minGrade: "D" }] },
          { name: "Bachelor of Business Administration", duration: "3 years", minPoints: 25, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Higher Certificate in Management", duration: "1 year", minPoints: 18, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }] },
        ],
      },
      {
        name: "Policing & Safety",
        courses: [
          { name: "Bachelor of Policing Practices", duration: "3 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Higher Certificate in Policing", duration: "1 year", minPoints: 18, bestN: 5, requirements: [{ subject: "English", minGrade: "E" }] },
        ],
      },
    ],
  },
  {
    key: "NIPAM",
    name: "NIPAM",
    fullName: "Namibia Institute of Public Administration & Management",
    faculties: [
      {
        name: "Public Administration",
        courses: [
          { name: "Certificate in Public Administration", duration: "1 year", minPoints: 20, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Diploma in Public Administration", duration: "2 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
      {
        name: "Leadership & Governance",
        courses: [
          { name: "Executive Development Programme", duration: "1 year", minPoints: 22, bestN: 5, requirements: [{ subject: "English", minGrade: "D" }] },
          { name: "Diploma in Local Governance", duration: "2 years", minPoints: 24, bestN: 5, requirements: [{ subject: "English", minGrade: "C" }] },
        ],
      },
    ],
  },
];
