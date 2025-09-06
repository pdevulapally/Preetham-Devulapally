import { Section } from "../components/Section";
import { education } from "../data/cv";

export function Education() {
  return (
    <Section id="education" title="Education">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {education.map((edu) => (
          <div key={edu.school} className="card p-5">
            <h3 className="font-semibold">{edu.school}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{edu.degree}</p>
            <p className="text-xs text-neutral-500 mt-2">{edu.period}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
