import {
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  Download,
  FolderGit2,
  Layers,
  Mail,
  Newspaper,
  Wrench,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useSectionLinkProps } from "@/hooks/useSectionLinkProps";

/**
 * The rich blocks a reply can render under its prose.
 *
 * Everything here is driven by an action the parser already validated against
 * the real portfolio data, so these components never have to defend against a
 * missing project or a bogus link — by the time one arrives here it exists.
 */

const CTA_ICONS = {
  calendar: CalendarCheck,
  mail: Mail,
  folder: FolderGit2,
  layers: Layers,
  briefcase: Briefcase,
  wrench: Wrench,
  download: Download,
  newspaper: Newspaper,
  github: FaGithub,
  linkedin: FaLinkedin,
};

/** `/#contact` has to become a router link when the visitor is on the blog. */
function useDestination() {
  const sectionProps = useSectionLinkProps();

  return (href) => {
    const section = href.startsWith("/#") ? href.slice(2) : null;
    if (section) return { props: sectionProps(section), internal: true };

    const external = href.startsWith("http");
    return {
      props: {
        href,
        ...(external ? { target: "_blank", rel: "noreferrer noopener" } : null),
      },
      internal: !external && !href.startsWith("mailto:"),
    };
  };
}

export function ChatActions({ actions, onNavigate }) {
  if (!actions?.length) return null;

  const projects = actions.filter((action) => action.type === "project");
  const skills = actions.filter((action) => action.type === "skills");
  const ctas = actions.filter((action) => action.type === "cta");

  return (
    <div className="mt-3 space-y-2.5">
      {projects.map((action) => (
        <ProjectPreview key={action.id} project={action.project} />
      ))}

      {skills.map((action) => (
        <SkillGroup key={action.id} group={action.group} />
      ))}

      {ctas.length ? (
        <div className="flex flex-wrap gap-2 pt-0.5">
          {ctas.map((action) => (
            <CtaButton key={action.id} cta={action.cta} onNavigate={onNavigate} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Project ────────────────────────────────────────────────────────────── */

function ProjectPreview({ project }) {
  const href = project.demo ?? project.repo;

  return (
    <article className="group/card overflow-hidden rounded-xl border border-line bg-canvas-deep/60 transition-colors duration-300 hover:border-line-strong">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-elevated">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-smooth group-hover/card:scale-[1.05]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-canvas-deep/90 via-canvas-deep/10 to-transparent"
        />
        <Badge
          mono
          className="absolute left-2.5 top-2.5 border-line-strong bg-canvas-deep/75 text-ink backdrop-blur-sm"
        >
          {project.category}
        </Badge>
      </div>

      <div className="space-y-2 p-3">
        <h4 className="text-[0.9375rem] font-bold leading-tight tracking-tight text-ink">
          {project.title}
        </h4>

        <p className="text-xs leading-relaxed text-ink-muted">{project.summary}</p>

        <ul className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Badge mono>{tech}</Badge>
            </li>
          ))}
          {project.technologies.length > 4 ? (
            <li>
              <Badge mono>+{project.technologies.length - 4}</Badge>
            </li>
          ) : null}
        </ul>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              "inline-flex items-center gap-1.5 pt-0.5 text-xs font-semibold text-primary",
              "transition-colors duration-200 hover:text-primary-strong",
            )}
          >
            {project.demo ? "View project" : "View source"}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-smooth group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        ) : null}
      </div>
    </article>
  );
}

/* ── Skills ─────────────────────────────────────────────────────────────── */

function SkillGroup({ group }) {
  return (
    <div className="rounded-xl border border-line bg-canvas-deep/60 p-3">
      <p className="mb-2 text-2xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
        {group.label}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {group.skills.map((skill) => (
          <li key={skill.name}>
            <Badge variant="primary" mono>
              {skill.name}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Call to action ─────────────────────────────────────────────────────── */

function CtaButton({ cta, onNavigate }) {
  const destination = useDestination();
  const { props, internal } = destination(cta.href);
  const Icon = CTA_ICONS[cta.icon] ?? ArrowUpRight;
  const Component = props.as ?? "a";
  const { as: _as, ...linkProps } = props;

  const primary = cta.key === "contact";

  return (
    <Component
      {...linkProps}
      {...(cta.download ? { download: cta.download } : null)}
      onClick={internal ? onNavigate : undefined}
      className={cn(
        "group/cta inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold tracking-tight",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-smooth",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "active:scale-[0.98]",
        primary
          ? "bg-primary text-primary-fg shadow-glow-sm hover:bg-primary-strong hover:shadow-glow"
          : "border border-line-strong bg-surface/60 text-ink-muted hover:border-primary hover:text-primary",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {cta.label}
      <ArrowUpRight
        className="h-3 w-3 opacity-60 transition-transform duration-300 ease-smooth group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
        aria-hidden="true"
      />
    </Component>
  );
}
