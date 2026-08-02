import { Briefcase, GraduationCap, Rocket, Building2 } from "lucide-react";

/**
 * Timeline entries.
 *
 * Everything here is sourced from content that already existed on the site
 * (project descriptions, the education block and the recommendations).
 * Only the 2025 graduation date is explicitly documented, so the two academic
 * entries are labelled by programme phase rather than given invented years.
 */
export const experience = [
  {
    id: "freelance",
    period: "2025",
    kind: "Client Work",
    icon: Rocket,
    role: "Freelance Fullstack Web Developer",
    org: "Independent · Client Projects",
    summary:
      "Delivered custom web systems for real clients, from requirements through to deployment and handover.",
    details: [
      "Built Guimba East EduLink for the Guimba East District — a school file management and notification hub for school heads, teachers and administrators.",
      "Developed the Cuyapo Armandos Hotel and Resort Management System as a commissioned project covering reservations, room availability and customer inquiries.",
      "Handled client communication, real-world deployment and post-launch maintenance.",
    ],
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Supabase", "PHP", "MySQL"],
  },
  {
    id: "bsit",
    period: "2025",
    kind: "Education",
    icon: GraduationCap,
    role: "BS in Information Technology",
    org: "College for Research and Technology",
    summary: "Burgos Ave., Cabanatuan City, Nueva Ecija, Philippines.",
    details: ["Graduated 2025."],
    tech: [],
  },
  {
    id: "capstone",
    period: "BSIT Programme",
    kind: "Academic",
    icon: Briefcase,
    role: "Capstone Project — Team Lead & Developer",
    org: "College for Research and Technology",
    summary:
      "Led the team through the capstone system, owning the frontend and keeping delivery on schedule.",
    details: [
      "Guided the team and coordinated the build through to on-time delivery.",
      "Focused on a user-friendly, responsive frontend.",
      "Handled coding challenges and supported teammates throughout the project.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "Bootstrap 5", "PHP", "MySQL"],
  },
  {
    id: "ojt",
    period: "BSIT Programme",
    kind: "Internship",
    icon: Building2,
    role: "On-the-Job Training",
    org: "Office of the Sangguniang Bayan",
    summary:
      "Provided computer programming and technical support to the local legislative office.",
    details: [
      "Applied programming skills to day-to-day office needs.",
      "Recognised for technical proficiency and willingness to contribute.",
    ],
    tech: [],
  },
];
