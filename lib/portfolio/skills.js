/**
 * The toolkit, grouped exactly as it was on the original site — the isomorphic
 * half of `src/data/skills.js`.
 *
 * `brand` is the official product colour, used only to tint the icon on hover.
 * It is omitted for logos whose brand colour is pure white (Next.js, Express,
 * GitHub, Render, Vercel) — those fall back to the palette's ink token so they
 * stay visible in light mode.
 *
 * Icons are attached in `src/data/skills.js`, keyed by `name`.
 */
export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    caption: "Interfaces, structure and styling",
    skills: [
      { name: "HTML5", brand: "#E34F26" },
      { name: "CSS3", brand: "#1572B6" },
      { name: "JavaScript ES6+", brand: "#F7DF1E" },
      { name: "TypeScript", brand: "#3178C6" },
      { name: "React", brand: "#61DAFB" },
      { name: "Next.js" },
      { name: "Tailwind CSS", brand: "#38BDF8" },
      { name: "Bootstrap 5", brand: "#7952B3" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Data",
    caption: "APIs, servers and databases",
    skills: [
      { name: "Node.js", brand: "#5FA04E" },
      { name: "Express.js" },
      { name: "PHP", brand: "#777BB4" },
      { name: "MongoDB", brand: "#47A248" },
      { name: "MySQL", brand: "#4479A1" },
      { name: "Supabase", brand: "#3ECF8E" },
    ],
  },
  {
    id: "tools",
    label: "Tools & Platforms",
    caption: "Everything around the code",
    skills: [
      { name: "VS Code", brand: "#22A7F2" },
      { name: "Git", brand: "#F05032" },
      { name: "GitHub" },
      { name: "NPM", brand: "#CB3837" },
      { name: "Vite", brand: "#A259FF" },
      { name: "Postman", brand: "#FF6C37" },
      { name: "XAMPP", brand: "#FB7A24" },
      { name: "Figma", brand: "#F24E1E" },
    ],
  },
  {
    id: "hosting",
    label: "Hosting & Cloud",
    caption: "Deployment and infrastructure",
    skills: [
      { name: "DigitalOcean", brand: "#0080FF" },
      { name: "Render" },
      { name: "Vercel" },
    ],
  },
  {
    id: "ai",
    label: "AI Assistants",
    caption: "Coding assistants and AI automation",
    skills: [
      { name: "Claude Code", brand: "#D97757" },
      { name: "Gemini (Google AI Studio)", brand: "#8E75B2" },
      /* OpenAI's #412991 is too dark to read against the dark canvas, so this
         falls back to the ink token like the other low-contrast logos. */
      { name: "ChatGPT" },
      /* No MCP entry in simple-icons and the official mark is monochrome, so
         this uses a generic plug glyph on the ink token. */
      { name: "MCP" },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    caption: "Workflow and CRM automation",
    skills: [
      { name: "n8n", brand: "#EA4B71" },
      /* GoHighLevel has no simple-icons entry, so this uses a generic workflow
         glyph rather than an invented logo. The tint is approximate. */
      { name: "GoHighLevel", brand: "#2F97FF" },
    ],
  },
];

export const totalSkills = skillGroups.reduce(
  (count, group) => count + group.skills.length,
  0,
);
