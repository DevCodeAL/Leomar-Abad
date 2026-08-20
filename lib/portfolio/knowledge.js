/**
 * The assistant's knowledge base.
 *
 * This is a *view* over the portfolio data, not a second copy of it — every
 * value is imported from the modules the dashboard itself renders, so the
 * assistant can never describe a project, skill or contact detail that is not
 * actually on the site. Edit the data modules and the assistant follows.
 *
 * `buildKnowledgeContext()` flattens the whole thing into the plain-text block
 * that gets pinned into the model's system instruction.
 */

import { education, profile, socialLinks } from "./profile.js";
import { experience } from "./experience.js";
import { projects } from "./projects.js";
import { services } from "./services.js";
import { skillGroups } from "./skills.js";
import { testimonials } from "./testimonials.js";

/** Where each subject lives on the site, so answers can point somewhere real. */
export const siteMap = {
  overview: { label: "Dashboard", href: "/#overview" },
  about: { label: "About", href: "/#about" },
  experience: { label: "Experience", href: "/#experience" },
  skills: { label: "Skills", href: "/#skills" },
  projects: { label: "Projects", href: "/#projects" },
  services: { label: "Services", href: "/#services" },
  testimonials: { label: "Testimonials", href: "/#testimonials" },
  blog: { label: "Blog", href: "/blog" },
  contact: { label: "Book a Call", href: "/#contact" },
};

export const knowledge = {
  profile,
  education,
  socialLinks,
  skillGroups,
  projects,
  experience,
  services,
  testimonials,
  siteMap,
};

/** Every project slug the assistant is allowed to reference. */
export const projectSlugs = projects.map((project) => project.slug);

/** Every skill group id the assistant is allowed to reference. */
export const skillGroupIds = skillGroups.map((group) => group.id);

/** Flat, de-duplicated list of every technology named anywhere on the site. */
export const allTechnologies = [
  ...new Set([
    ...skillGroups.flatMap((group) => group.skills.map((skill) => skill.name)),
    ...projects.flatMap((project) => project.technologies),
  ]),
];

function bullet(lines) {
  return lines.filter(Boolean).map((line) => `- ${line}`).join("\n");
}

function projectLine(project) {
  const links = [
    project.demo ? `live: ${project.demo}` : "live: none (source only)",
    project.repo ? `code: ${project.repo}` : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return [
    `[${project.slug}] ${project.title} — ${project.category}${project.year ? `, ${project.year}` : ""}${project.featured ? " (FEATURED / flagship)" : ""}`,
    `  ${project.description}`,
    `  stack: ${project.technologies.join(", ")}`,
    `  ${links}`,
  ].join("\n");
}

/**
 * The knowledge block pinned into the system instruction. Regenerated on every
 * request — it is a few kB of static text, and building it fresh means it can
 * never lag behind an edit to the data modules.
 */
export function buildKnowledgeContext() {
  const sections = [];

  sections.push(
    [
      "## Identity",
      bullet([
        `Name: ${profile.name} (personal brand: "${profile.brand}")`,
        `Role: ${profile.role}`,
        `Also works as: ${profile.roles.join(", ")}`,
        `Availability: ${profile.status}`,
        `Currently: ${profile.currently}`,
        `Location: ${profile.location}`,
        `Core stack: ${profile.coreStack.join(", ")}`,
      ]),
      "",
      `Intro (his own words): ${profile.intro}`,
      `About (his own words): ${profile.about}`,
    ].join("\n"),
  );

  sections.push(
    [
      "## Contact",
      bullet([
        `Email: ${profile.email}`,
        `Phone: ${profile.phone}`,
        `Resume / CV (downloadable from the site): ${profile.resume}`,
        `Booking: a 30-minute call can be booked on the portfolio at ${siteMap.contact.href} — it returns a Google Meet link immediately, no email back-and-forth.`,
        ...socialLinks.map(
          (social) => `${social.label}: ${social.href} (@${social.handle})`,
        ),
      ]),
    ].join("\n"),
  );

  sections.push(
    [
      "## Skills",
      skillGroups
        .map(
          (group) =>
            `[${group.id}] ${group.label} — ${group.caption}\n  ${group.skills
              .map((skill) => skill.name)
              .join(", ")}`,
        )
        .join("\n"),
    ].join("\n"),
  );

  sections.push(
    ["## Projects", projects.map(projectLine).join("\n\n")].join("\n"),
  );

  sections.push(
    [
      "## Experience & education",
      experience
        .map((entry) =>
          [
            `${entry.role} — ${entry.org} (${entry.period}, ${entry.kind})`,
            `  ${entry.summary}`,
            entry.details.length ? `  ${entry.details.join(" ")}` : null,
            entry.tech.length ? `  stack: ${entry.tech.join(", ")}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n"),
      "",
      `Education: ${education.degree}, ${education.school} (${education.address}). Graduated ${education.graduated}.`,
    ].join("\n"),
  );

  sections.push(
    [
      "## Services he offers",
      services
        .map((service) => `${service.title}: ${service.description}`)
        .map((line) => `- ${line}`)
        .join("\n"),
    ].join("\n"),
  );

  sections.push(
    [
      "## What people say (real recommendations on the site)",
      testimonials
        .map(
          (person) =>
            `- ${person.name}, ${person.position}: "${person.quote}"`,
        )
        .join("\n"),
    ].join("\n"),
  );

  sections.push(
    [
      "## Where things live on this site",
      bullet(
        Object.values(siteMap).map((entry) => `${entry.label}: ${entry.href}`),
      ),
      "The site also publishes a blog of AI-assisted technical articles at /blog.",
    ].join("\n"),
  );

  return sections.join("\n\n");
}
