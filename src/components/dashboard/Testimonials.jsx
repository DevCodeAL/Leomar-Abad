import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Two counter-scrolling marquees. Each row duplicates its list once and
 * translates -50% for a seamless loop; hovering pauses the row under the
 * cursor so a quote can actually be read.
 */
export function Testimonials() {
  const midpoint = Math.ceil(testimonials.length / 2);
  const rows = [testimonials.slice(0, midpoint), testimonials.slice(midpoint)];

  return (
    <Section id="testimonials">
      <SectionHeader
        index="06"
        eyebrow="Testimonials"
        title="What clients, mentors and teammates say"
        description="Feedback from the people I've built systems with and for."
      />

      <Reveal direction="none" className="edge-fade space-y-4 overflow-hidden">
        {rows.map((row, rowIndex) => (
          <ul
            key={rowIndex}
            /* pr-4 matches gap-4 so the -50% loop point stays seamless */
            className={`flex w-max items-stretch gap-4 pr-4 ${
              rowIndex % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse"
            } hover:[animation-play-state:paused]`}
            style={{ "--marquee-duration": rowIndex % 2 === 0 ? "62s" : "74s" }}
          >
            {[...row, ...row].map((person, index) => (
              <TestimonialCard
                key={`${person.name}-${index}`}
                person={person}
                duplicate={index >= row.length}
              />
            ))}
          </ul>
        ))}
      </Reveal>
    </Section>
  );
}

function TestimonialCard({ person, duplicate }) {
  return (
    <li
      className="w-[19rem] shrink-0 sm:w-[23rem]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <Card interactive className="group h-full">
        <figure className="flex h-full flex-col gap-4 p-5">
          <Quote
            className="h-5 w-5 text-primary/70 transition-colors duration-300 group-hover:text-primary"
            aria-hidden="true"
          />

          <blockquote className="flex-1 text-[0.8125rem] leading-relaxed text-ink-muted">
            {person.quote}
          </blockquote>

          <figcaption className="flex items-center gap-3 border-t border-line pt-4">
            <img
              src={person.photo}
              alt=""
              loading="lazy"
              decoding="async"
              width="40"
              height="40"
              className="h-10 w-10 rounded-full border border-line object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {person.name}
              </p>
              <p className="truncate text-xs text-ink-subtle">
                {person.position}
              </p>
            </div>
          </figcaption>
        </figure>
      </Card>
    </li>
  );
}
