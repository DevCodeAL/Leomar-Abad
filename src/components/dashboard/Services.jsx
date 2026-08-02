import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

export function Services() {
  return (
    <Section id="services">
      <SectionHeader
        index="05"
        eyebrow="Services"
        title="What I can build for you"
        description="What I offer based on my skills and experience."
        action={
          <Button href="#contact" variant="outline" size="sm">
            Start a project
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-smooth group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <Reveal key={service.title} direction="up" delay={index * 70}>
            <ServiceCard service={service} index={index + 1} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ServiceCard({ service, index }) {
  const { icon: Icon, title, description } = service;

  return (
    <Card interactive className="group h-full">
      {/* Oversized index watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[5rem] font-bold leading-none text-ink/[0.04] transition-[color,transform] duration-500 ease-smooth group-hover:-translate-y-1 group-hover:text-primary/[0.09]"
      >
        {String(index).padStart(2, "0")}
      </span>

      <CardBody className="flex h-full flex-col gap-3.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-elevated text-primary transition-[transform,border-color,box-shadow] duration-300 ease-smooth group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-glow-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.6875rem] text-primary">
            {String(index).padStart(2, "0")}
          </span>
          <span className="h-px w-4 bg-line-strong" />
        </div>

        <h3 className="text-[0.9375rem] font-bold leading-snug tracking-tight text-ink">
          {title}
        </h3>

        <p className="text-xs leading-relaxed text-ink-muted">{description}</p>

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-accent to-transparent transition-transform duration-500 ease-smooth group-hover:scale-x-100"
        />
      </CardBody>
    </Card>
  );
}
