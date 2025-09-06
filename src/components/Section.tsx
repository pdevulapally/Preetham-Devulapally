import { ReactNode } from "react";

export function Section({
  id,
  title,
  intro,
  children
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{title}</h2>
        {intro && <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
