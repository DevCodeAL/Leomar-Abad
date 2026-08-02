import { ArrowRight, ArrowUpRight, MapPin, Terminal } from "lucide-react";
import { profile, socials } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { StatusDot } from "@/components/ui/StatusDot";
import { RoleRotator } from "./RoleRotator";

/** The dashboard's opening bento: introduction panel + identity card. */
export function Hero() {
  return (
    <section id="overview" className="scroll-mt-24 pt-8 sm:pt-10">
      <div className="grid gap-4 lg:grid-cols-3">
        <IntroPanel />
        <IdentityCard />
      </div>
    </section>
  );
}

function IntroPanel() {
  return (
    <Reveal className="lg:col-span-2" direction="up">
      <Card glow className="h-full">
        {/* Faint grid + corner ticks: the "instrument panel" cue */}
        <div
          aria-hidden="true"
          className="grid-lines pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom_right,#000,transparent_70%)]"
        />

        <CardBody className="flex h-full flex-col justify-center gap-6 px-6 py-9 sm:px-9 sm:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary" size="md" className="gap-2">
              <StatusDot />
              {profile.status}
            </Badge>
            <Badge mono className="gap-1.5 text-ink-subtle">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {profile.location}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-sm text-ink-muted">
              Hello, I&apos;m{" "}
              <span className="font-semibold text-ink">{profile.name}</span>.
            </p>

            <h1 className="text-balance text-[2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl xl:text-[3.25rem]">
              <RoleRotator roles={profile.roles} className="text-[0.9em]" />
            </h1>

            <p className="max-w-2xl text-pretty pt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              {profile.intro}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button href="#projects" size="lg">
              View my work
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:translate-x-1"
                aria-hidden="true"
              />
            </Button>
            <Button href="#contact" variant="outline" size="lg">
              Let&apos;s work together
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="font-mono text-2xs uppercase tracking-[0.2em] text-ink-subtle">
              Connect
            </span>
            <span className="h-px flex-1 bg-line sm:max-w-16" />
            <ul className="flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-[color,border-color,transform] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>
    </Reveal>
  );
}

function IdentityCard() {
  return (
    <Reveal direction="scale" delay={120}>
      <Card className="flex h-full flex-col">
        <div className="dot-grid relative flex justify-center overflow-hidden px-6 pb-6 pt-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-8 top-4 h-40 rounded-full bg-primary/25 blur-3xl"
          />

          <div className="group/avatar relative animate-float">
            <span
              aria-hidden="true"
              className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary via-accent to-primary opacity-70 blur-[2px]"
            />
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-surface bg-elevated sm:h-40 sm:w-40">
              <img
                src={profile.avatar}
                alt={`Portrait of ${profile.name}`}
                width="160"
                height="160"
                loading="eager"
                className="h-full w-full scale-110 object-cover object-top transition-transform duration-500 ease-smooth group-hover/avatar:scale-[1.22]"
              />
            </div>
          </div>
        </div>

        <CardBody className="flex flex-1 flex-col gap-4 border-t border-line pt-5">
          <div>
            <p className="text-lg font-bold tracking-tight text-ink">
              {profile.name}
            </p>
            <p className="font-mono text-xs text-primary">{profile.role}</p>
          </div>

          <dl className="space-y-3 text-xs">
            <div>
              <dt className="mb-1 flex items-center gap-1.5 text-2xs uppercase tracking-[0.16em] text-ink-subtle">
                <Terminal className="h-3 w-3" aria-hidden="true" />
                Currently
              </dt>
              <dd className="text-ink-muted">{profile.currently}</dd>
            </div>

            <div>
              <dt className="mb-1.5 text-2xs uppercase tracking-[0.16em] text-ink-subtle">
                Core stack
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {profile.coreStack.map((item) => (
                  <Badge key={item} mono>
                    {item}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </Reveal>
  );
}
