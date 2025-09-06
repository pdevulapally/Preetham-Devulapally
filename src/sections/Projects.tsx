import { Section } from "../components/Section";
import { projects } from "../data/cv";
import { Badge } from "../components/Badge";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Github, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { trackProjectView } from "../lib/analytics";

export function Projects() {
  const [showAll, setShowAll] = useState(false);
  const initialProjectsCount = 2; // Show all 2 projects initially
  const displayedProjects = showAll ? projects : projects.slice(0, initialProjectsCount);
  const hasMoreProjects = projects.length > initialProjectsCount;

  return (
    <Section id="projects" title="Projects" intro="Selected builds and what I learned from each.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedProjects.map((p, idx) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="card p-5 flex flex-col"
          >
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-white/10 dark:to-white/5 mb-4 border border-white/10 overflow-hidden">
              {p.image ? (
                <img
                  src={p.image}
                  alt={`${p.title} project screenshot`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full flex items-center justify-center text-sm text-neutral-600 dark:text-neutral-400 ${p.image ? 'hidden' : 'flex'}`}
              >
                Screenshot placeholder
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <span className="text-xs text-neutral-500">{p.period}</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">{p.tagline}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.stack.map((s: string) => <Badge key={s}>{s}</Badge>)}
              </div>

              <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {p.highlights.map((h: string) => <li key={h}>{h}</li>)}
              </ul>
            </div>

            {/* --- Premium Link Buttons (Demo / Code) --- */}
            {p.links?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {p.links.map((l: { label: string; href: string }) => {
                  const label = l.label.trim().toLowerCase();
                  const isDemo = /demo|live|preview/.test(label);
                  const isCode = /code|source/.test(label);
                  const isGithub = /github/.test(l.href);

                  // Style variants
                  const base =
                    "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm focus-ring transition";
                  const solid =
                    "text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:opacity-95";
                  const ghost =
                    "border border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100/70 dark:hover:bg-white/10";

                  const cls = isDemo ? `${base} ${solid} btn-shine` : `${base} ${ghost}`;

                  return (
                    <a
                      key={l.label + l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cls}
                      aria-label={l.label}
                      onClick={() => trackProjectView(p.title)}
                    >
                      {isDemo && <ExternalLink className="w-4 h-4" />}
                      {isCode && !isGithub && <Code2 className="w-4 h-4" />}
                      {isGithub && <Github className="w-4 h-4" />}
                      <span className="font-medium">
                        {isDemo ? "Live Demo" : isGithub ? "GitHub" : "View Code"}
                      </span>

                      {/* subtle shimmer highlight */}
                      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                        <span className="btn-shine__gloss" />
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </motion.article>
        ))}
      </div>

      {/* Show More/Less Button */}
      {hasMoreProjects && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100/70 dark:hover:bg-white/10 transition-all duration-200 focus-ring group"
          >
            <span className="font-medium">
              {showAll ? "Show Less" : "Show More Projects"}
            </span>
            <motion.div
              animate={{ rotate: showAll ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showAll ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </motion.div>
          </button>
        </motion.div>
      )}
    </Section>
  );
}
