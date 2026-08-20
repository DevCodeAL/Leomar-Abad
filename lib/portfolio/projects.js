/**
 * Projects, carried over verbatim from the original portfolio.
 *
 * Isomorphic: no icon or React imports, so the assistant's serverless function
 * can read it without pulling an icon library into the function bundle.
 * `src/data/projects.js` re-exports it for the UI.
 *
 * `span` controls the bento grid footprint (out of 3 columns on desktop).
 * `demo: null` means no public deployment — the UI hides the link rather
 * than rendering a dead "#" anchor like the old site did.
 */
export const projects = [
  {
    slug: "guimba-east-edulink",
    title: "Guimba East EduLink",
    category: "Client Work",
    year: "2025",
    featured: true,
    image: "/projects-images/png/guimba-east.png",
    summary:
      "A school management and learning-resource platform built for the Guimba East District.",
    description:
      "Guimba EastEdulink is a web-based system for the Guimba East District that streamlines school management and learning resources for school heads, teachers, and administrators. As my first major client project, it strengthened my skills in full-stack development, client communication, and real-world deployment.",
    highlights: [
      "School file management and notification hub",
      "Built for school heads, teachers and administrators",
      "Centralised access to learning resources",
      "Delivered and deployed on a live client domain",
    ],
    technologies: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Supabase",
    ],
    demo: "https://www.guimbaeastedulink.com/",
    repo: "https://github.com/DevCodeAL/EduFile-School-File-Management-and-Notification-Hub.git",
    span: 3,
  },
  {
    slug: "ai-math-generator",
    title: "AI Math Generator",
    category: "AI Integration",
    year: "2025",
    image: "/projects-images/png/AI-Math-Generator.png",
    summary:
      "Generated math problems powered by Gemini, built as an assessment task for Ottodot.",
    description:
      "This is my assessment task for Ottodot. The goal was to implement a generated math problem feature using the Gemini Google AI Studio, Next.js, Tailwind CSS, and Supabase. I learned a lot from this project, especially because it was my first time integrating an AI model. I'm excited to continue improving and applying AI in more personal projects and future client work.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Supabase",
      "Gemini Google AI Studio",
    ],
    demo: "https://ai-math-generator-lake.vercel.app/",
    repo: "https://github.com/DevCodeAL/AI-Math-Generator",
    span: 2,
  },
  {
    slug: "portfolio-builder",
    title: "Portfolio Builder",
    category: "Product",
    image: "/projects-images/png/portbuilder1.png",
    summary:
      "A no-code way for students and freelancers to publish a clean portfolio in minutes.",
    description:
      "I developed this Simple Website Portfolio Builder to help students, freelancers, and non-tech folks build a clean, responsive portfolio in just a few minutes — no coding needed. It's an easy way for anyone to showcase their work and have a professional online presence without the hassle.",
    technologies: ["React", "Tailwind CSS", "Lucide React"],
    demo: "https://simple-website-portfolio-builder.vercel.app/",
    repo: "https://github.com/DevCodeAL/Simple-Website-Portfolio-Builder",
    span: 1,
  },
  {
    slug: "image-compressor",
    title: "Image Compressor App",
    category: "Developer Tool",
    image: "/projects-images/png/image-compressor.png",
    summary: "Resize and compress images for the web, straight from the browser.",
    description:
      "I developed this image file size adjuster for my personal use to easily resize and compress images for my projects.",
    technologies: ["React", "Tailwind CSS"],
    demo: "https://image-compressor-app-five.vercel.app/",
    repo: "https://github.com/DevCodeAL/Image-Compressor-App",
    span: 1,
  },
  {
    slug: "armandos-resort",
    title: "Hotel & Resort Management System",
    category: "Client Work",
    image: "/projects-images/png/armandos.png",
    summary:
      "Reservation, booking and inquiry management for Cuyapo Armandos Resort.",
    description:
      "Cuyapo Armandos Resort Management System is a custom web application developed as a commissioned project for student clients. The system helps manage resort reservations, customer inquiries, room availability, and booking schedules, streamlining daily operations and improving customer service.",
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap 5", "PHP", "MySQL"],
    demo: null,
    repo: "https://github.com/DevCodeAL/Cuyapo-Armandos-Hotel-and-Resort-Management-System",
    span: 2,
  },
  {
    slug: "qr-code-generator",
    title: "QR-Code Generator",
    category: "Developer Tool",
    image: "/projects-images/png/qr-code1.png",
    summary: "Generate and download QR codes in a couple of clicks.",
    description:
      "I developed this QR Code Generator as a personal project to help me quickly generate and download QR codes for my future work and projects.",
    technologies: ["React", "Tailwind CSS", "Lucide React"],
    demo: "https://qr-code-generator-eight-gold.vercel.app/",
    repo: "https://github.com/DevCodeAL/QR-Code-Generator",
    span: 1,
  },
  {
    slug: "inventory-system",
    title: "Inventory Management System",
    category: "Business Tool",
    image: "/projects-images/png/inventory-system.png",
    summary: "A practical stock-tracking tool built as a foundation for future business plans.",
    description:
      "I developed this inventory system to practice building practical business tools and to manage my products efficiently. It serves as a foundation for my future business plans.",
    technologies: ["HTML", "CSS", "JavaScript", "Bootstrap 5", "PHP", "MySQL"],
    demo: null,
    repo: "https://github.com/DevCodeAL/Inventory-System",
    span: 2,
  },
];

export const featuredProject = projects.find((project) => project.featured);

export const gridProjects = projects.filter((project) => !project.featured);

/** Derived from the grid only — the featured project sits outside the filter. */
export const projectCategories = [
  "All",
  ...Array.from(new Set(gridProjects.map((project) => project.category))),
];
