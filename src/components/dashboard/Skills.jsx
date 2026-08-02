import { skillGroups, totalSkills } from "@/data/skills";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/SectionHeader";

/**
 * Toolkit grid. No skill percentages — the original site never had them and
 * inventing proficiency numbers would be fabricating credentials.
 */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        index="03"
        eyebrow="Skills"
        title="The toolkit I build with"
        description="Proficiencies in full-stack web development, spanning both front-end and back-end technologies."
        action={
          <Badge variant="primary" size="md" mono>
            {totalSkills} technologies
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} direction="up" delay={index * 100}>
            <Card className="h-full">
              <CardHeader className="flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between gap-3">
                  <CardTitle className="text-primary">{group.label}</CardTitle>
                  <span className="font-mono text-2xs text-ink-subtle">
                    {String(group.skills.length).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs text-ink-subtle">{group.caption}</p>
              </CardHeader>

              <CardBody className="p-3 sm:p-4">
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  {group.skills.map((skill) => (
                    <SkillTile key={skill.name} {...skill} />
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SkillTile({ name, Icon, brand }) {
  return (
    <li>
      <div
        className="group/tile flex h-full flex-col items-center gap-2 rounded-xl border border-line bg-elevated/50 px-2 py-3.5 text-center transition-[transform,border-color,background-color] duration-300 ease-smooth hover:-translate-y-1 hover:border-primary/40 hover:bg-elevated"
        title={name}
      >
        <Icon
          className="h-6 w-6 text-ink-muted transition-[color,transform] duration-300 ease-smooth group-hover/tile:scale-110 group-hover/tile:text-[color:var(--brand)]"
          style={{ "--brand": brand ?? "hsl(var(--ink))" }}
          aria-hidden="true"
        />
        <span className="text-[0.6875rem] font-medium leading-tight text-ink-subtle transition-colors duration-300 group-hover/tile:text-ink">
          {name}
        </span>
      </div>
    </li>
  );
}
