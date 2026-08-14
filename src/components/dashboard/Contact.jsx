import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { profile, socials } from "@/data/profile";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { Reveal } from "@/components/ui/Reveal";
import { StatusDot } from "@/components/ui/StatusDot";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";
import { BookACall } from "@/components/booking/BookACall";

const details = [
  {
    key: "email",
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    copyable: true,
  },
  {
    key: "phone",
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone}`,
    icon: Phone,
    copyable: true,
  },
  {
    key: "location",
    label: "Location",
    value: profile.location,
    href: null,
    icon: MapPin,
    copyable: false,
  },
];

export function Contact() {
  return (
    <Section id="contact" className="pb-4">
      <SectionHeader
        index="08"
        eyebrow="Book a Call"
        title="Let's talk about your project"
        description="Pick a time that suits you and we'll talk it through on a 30-minute call. You'll get a Google Meet link straight away — no back-and-forth email needed."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-3" direction="left">
          <Card glow className="h-full">
            <CardHeader>
              <CardTitle>Book a call</CardTitle>
              <Badge mono>30 min · Google Meet</Badge>
            </CardHeader>
            <CardBody>
              <BookACall />
            </CardBody>
          </Card>
        </Reveal>

        <div className="grid gap-4 lg:col-span-2">
          <Reveal direction="right" delay={80}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Contact information</CardTitle>
              </CardHeader>

              <CardBody className="space-y-2.5">
                {details.map(({ key, label, value, href, icon: Icon, copyable }) => (
                  <div
                    key={key}
                    className="group/row flex items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition-colors duration-200 hover:border-line-strong"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-2xs uppercase tracking-[0.16em] text-ink-subtle">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="block truncate text-sm text-ink transition-colors duration-200 hover:text-primary"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="truncate text-sm text-ink">{value}</p>
                      )}
                    </div>

                    {copyable ? (
                      <CopyButton value={value} label={`Copy ${label.toLowerCase()}`} />
                    ) : null}
                  </div>
                ))}
              </CardBody>
            </Card>
          </Reveal>

          <Reveal direction="right" delay={140}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Elsewhere</CardTitle>
                <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink-muted">
                  <StatusDot />
                  Open to work
                </span>
              </CardHeader>

              <CardBody className="space-y-4">
                <ul className="grid grid-cols-2 gap-2">
                  {socials.map(({ label, handle, href, Icon }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/link flex items-center gap-2.5 rounded-xl border border-line px-3 py-2.5 transition-[border-color,transform] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary/40"
                      >
                        <Icon
                          className="h-4 w-4 shrink-0 text-ink-muted transition-colors duration-200 group-hover/link:text-primary"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-ink">
                            {label}
                          </span>
                          <span className="block truncate font-mono text-[0.625rem] text-ink-subtle">
                            {handle}
                          </span>
                        </span>
                        <ArrowUpRight
                          className="h-3 w-3 shrink-0 text-ink-subtle transition-[transform,color] duration-300 ease-smooth group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-primary"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="rounded-xl border border-primary/25 bg-primary/[0.07] p-4">
                  <p className="text-sm font-semibold text-ink">
                    Turn your ideas into reality
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                    Let&apos;s create something meaningful together.
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="group/cta mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                  >
                    {profile.email}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-smooth group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </CardBody>
            </Card>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
