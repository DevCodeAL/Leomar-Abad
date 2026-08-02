import {
  SiBootstrap,
  SiCss3,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPhp,
  SiPostman,
  SiReact,
  SiRender,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiXampp,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";

/**
 * The toolkit, grouped exactly as it was on the original site.
 *
 * `brand` is the official product colour, used only to tint the icon on hover.
 * It is omitted for logos whose brand colour is pure white (Next.js, Express,
 * GitHub, Render, Vercel) — those fall back to the palette's ink token so they
 * stay visible in light mode. All surrounding chrome is palette-driven.
 */
export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    caption: "Interfaces, structure and styling",
    skills: [
      { name: "HTML5", Icon: SiHtml5, brand: "#E34F26" },
      { name: "CSS3", Icon: SiCss3, brand: "#1572B6" },
      { name: "JavaScript ES6+", Icon: SiJavascript, brand: "#F7DF1E" },
      { name: "TypeScript", Icon: SiTypescript, brand: "#3178C6" },
      { name: "React", Icon: SiReact, brand: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "Tailwind CSS", Icon: SiTailwindcss, brand: "#38BDF8" },
      { name: "Bootstrap 5", Icon: SiBootstrap, brand: "#7952B3" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Data",
    caption: "APIs, servers and databases",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, brand: "#5FA04E" },
      { name: "Express.js", Icon: SiExpress },
      { name: "PHP", Icon: SiPhp, brand: "#777BB4" },
      { name: "MongoDB", Icon: SiMongodb, brand: "#47A248" },
      { name: "MySQL", Icon: SiMysql, brand: "#4479A1" },
      { name: "Supabase", Icon: SiSupabase, brand: "#3ECF8E" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    caption: "Everything around the code",
    skills: [
      { name: "VS Code", Icon: VscVscode, brand: "#22A7F2" },
      { name: "Git", Icon: SiGit, brand: "#F05032" },
      { name: "GitHub", Icon: SiGithub },
      { name: "NPM", Icon: SiNpm, brand: "#CB3837" },
      { name: "Vite", Icon: SiVite, brand: "#A259FF" },
      { name: "Postman", Icon: SiPostman, brand: "#FF6C37" },
      { name: "XAMPP", Icon: SiXampp, brand: "#FB7A24" },
      { name: "Render", Icon: SiRender },
      { name: "Vercel", Icon: SiVercel },
      { name: "Figma", Icon: SiFigma, brand: "#F24E1E" },
    ],
  },
];

export const totalSkills = skillGroups.reduce(
  (count, group) => count + group.skills.length,
  0,
);

/** Flat list used by the ticker under the hero. */
export const skillTicker = skillGroups.flatMap((group) => group.skills);
