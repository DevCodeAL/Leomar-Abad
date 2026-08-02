import { FaFacebook, FaGithub, FaInstagramSquare, FaLinkedin } from "react-icons/fa";

/**
 * Single source of truth for personal details.
 * Every value here comes from the original portfolio — nothing invented.
 */
export const profile = {
  name: "Leomar Abad",
  brand: "DevCode",
  role: "Fullstack Web Developer",
  /** Cycled by the hero headline. */
  roles: ["Fullstack Web Developer", "Frontend Developer", "Backend Developer"],
  status: "Available for opportunities",
  location: "Cuyapo, Nueva Ecija, Philippines",
  email: "abadleomar875@gmail.com",
  phone: "+639169232342",
  avatar: "/picture/Leomar-Abad.png",
  resume: "/file/Leomar-Abad-CV-2025-Updated.pdf",
  resumeFileName: "Leomar-Abad-CV-2025-Updated.pdf",

  intro:
    "I'm a Fullstack Web Developer passionate about building modern, responsive, and user-focused web applications. I turn ideas into fast, scalable, and engaging digital experiences that make an impact.",

  about:
    "I'm a passionate web developer skilled in building dynamic, responsive applications and intuitive user experiences. I'm committed to delivering high-quality, creative solutions that solve real-world problems through thoughtful design and clean development practices. I love learning new technologies, improving my craft, and collaborating on innovative projects that make a meaningful impact.",

  /** Shown as the "Currently" line in the dashboard status widget. */
  currently: "Building web applications",

  /** Primary stack, surfaced as monospace metadata. */
  coreStack: ["React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
};

export const education = {
  degree: "Bachelor of Science in Information Technology",
  school: "College for Research and Technology",
  address: "Burgos Ave., Cabanatuan City, Nueva Ecija, Philippines",
  graduated: "2025",
};

/** The three "What I Do" pillars from the original site. */
export const focusAreas = [
  {
    title: "Responsive Web Design",
    description: "Mobile-first layouts that hold up on every screen size.",
    icon: "devices",
  },
  {
    title: "Web Development",
    description: "End-to-end builds from interface down to database.",
    icon: "code",
  },
  {
    title: "Web Design",
    description: "Clean, considered interfaces that are easy to use.",
    icon: "pen",
  },
];

export const socials = [
  {
    label: "GitHub",
    handle: "DevCodeAL",
    href: "https://github.com/DevCodeAL",
    Icon: FaGithub,
  },
  {
    label: "LinkedIn",
    handle: "leomar-abad",
    href: "https://www.linkedin.com/in/leomar-abad-52381327b/",
    Icon: FaLinkedin,
  },
  {
    label: "Facebook",
    handle: "abad.leomar",
    href: "https://www.facebook.com/abad.leomar/",
    Icon: FaFacebook,
  },
  {
    label: "Instagram",
    handle: "abadleomar875",
    href: "https://www.instagram.com/abadleomar875/",
    Icon: FaInstagramSquare,
  },
];
