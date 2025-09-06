import { Section } from "../components/Section";
import { experience } from "../data/cv";

export function Experience() {
  return (
    <Section id="experience" title="Experience & Volunteering" intro="Where I collaborated, shipped, and learned with others.">
      <ol className="relative border-s border-neutral-200 dark:border-white/10 ml-3">
        {experience.map((e, i) => (
          <li key={i} className="ms-4 pb-8">
            <div className="absolute -start-1.5 mt-1.5 w-3 h-3 rounded-full bg-brand/80 border border-white/50" />
            <div className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{e.title} — <span className="text-brand">{e.org}</span></h3>
                <span className="text-xs text-neutral-500">{e.period}</span>
              </div>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {e.bullets.map((b: string) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
