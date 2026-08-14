import {
  Code2,
  GraduationCap,
  MapPin,
  MonitorSmartphone,
  PenTool,
  Quote,
  Sparkles,
} from "lucide-react";
import { aiWorkflow, education, focusAreas, profile } from "@/data/profile";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

const FOCUS_ICONS = {
  devices: MonitorSmartphone,
  code: Code2,
  pen: PenTool,
};

export function About() {
  return (
    <Section id="about">
      <SectionHeader
        index="01"
        eyebrow="About"
        title="Developer, problem-solver, lifelong learner"
        description="A quick look at how I work and where I came from."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <BioCard />
        <WorkspaceCard />
        <EducationCard />
        <FocusGrid />
        <AiWorkflowCard />
      </div>
    </Section>
  );
}

function BioCard() {
  return (
    <Reveal className="lg:col-span-3" direction="left">
      <Card glow className="h-full">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <Badge mono>bio.md</Badge>
        </CardHeader>

        <CardBody className="space-y-5">
          <p className="text-pretty text-sm leading-relaxed text-ink-muted sm:text-[0.9375rem]">
            {profile.about}
          </p>

          <blockquote className="relative rounded-xl border border-line bg-elevated/60 p-4 pl-11">
            <Quote
              className="absolute left-4 top-4 h-4 w-4 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm font-medium leading-relaxed text-ink">
              I turn ideas into fast, scalable, and engaging digital experiences
              that make an impact.
            </p>
            <footer className="mt-2 font-mono text-[0.6875rem] text-ink-subtle">
              — Development philosophy
            </footer>
          </blockquote>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line p-3">
              <dt className="text-2xs uppercase tracking-[0.16em] text-ink-subtle">
                Based in
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm text-ink">
                <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                {profile.location}
              </dd>
            </div>
            <div className="rounded-xl border border-line p-3">
              <dt className="text-2xs uppercase tracking-[0.16em] text-ink-subtle">
                Focus
              </dt>
              <dd className="mt-1 text-sm text-ink">
                Fullstack web applications
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </Reveal>
  );
}

/** Keeps the original laptop + phone artwork as a responsive-design vignette. */
function WorkspaceCard() {
  return (
    <Reveal className="lg:col-span-2" direction="right" delay={100}>
      <Card interactive className="group h-full">
        <CardHeader>
          <CardTitle>Built for every screen</CardTitle>
          <Badge mono>responsive</Badge>
        </CardHeader>

        <div className="dot-grid relative flex min-h-[13rem] items-center justify-center overflow-hidden p-6">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 bottom-2 h-32 rounded-full bg-primary/20 blur-3xl"
          />

          <div className="relative w-full max-w-sm">
            <img
              src="/png/laptop.png"
              alt="A web application shown on a laptop"
              loading="lazy"
              decoding="async"
              className="w-full object-contain transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
            />
            <img
              src="/png/phone.png"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute left-[53%] top-[26%] w-[34%] object-contain transition-transform duration-500 ease-smooth group-hover:-translate-y-1 group-hover:scale-[1.06]"
            />
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

function EducationCard() {
  return (
    <Reveal className="lg:col-span-2" direction="left" delay={60}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <Badge variant="primary" mono>
            {education.graduated}
          </Badge>
        </CardHeader>

        <CardBody className="space-y-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug text-ink">
                {education.degree}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{education.school}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
                {education.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-line bg-elevated/50 px-3 py-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <p className="font-mono text-xs text-ink-muted">
              Graduated {education.graduated}
            </p>
          </div>
        </CardBody>
      </Card>
    </Reveal>
  );
}

/** Full-width statement on process, spanning the whole grid as its own row. */
function AiWorkflowCard() {
  return (
    <Reveal className="lg:col-span-5" direction="up" delay={120}>
      <Card interactive className="group h-full">
        <CardHeader>
          <CardTitle>How I work</CardTitle>
          <Badge mono>ai-assisted</Badge>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-elevated text-primary transition-[transform,border-color] duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:border-primary/40">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>

          <div className="space-y-3.5">
            <p className="text-pretty text-sm leading-relaxed text-ink-muted sm:text-[0.9375rem]">
              {aiWorkflow.description}
            </p>

            <ul className="flex flex-wrap gap-2">
              {aiWorkflow.tools.map(({ name, Icon }) => (
                <li key={name}>
                  <Badge size="md">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {name}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>
    </Reveal>
  );
}

function FocusGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
      {focusAreas.map((area, index) => {
        const Icon = FOCUS_ICONS[area.icon] ?? Code2;
        return (
          <Reveal key={area.title} direction="up" delay={index * 90}>
            <Card interactive className="group h-full">
              <CardBody className="flex h-full flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-elevated text-primary transition-[transform,border-color] duration-300 ease-smooth group-hover:-translate-y-0.5 group-hover:border-primary/40">
                  <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold leading-snug text-ink">
                  {area.title}
                </h3>
                <p className="text-xs leading-relaxed text-ink-subtle">
                  {area.description}
                </p>
              </CardBody>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
