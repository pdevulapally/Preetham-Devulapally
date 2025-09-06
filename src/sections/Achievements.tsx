import { useMemo, useState } from "react";
import { Section } from "../components/Section";
import { achievements as rawAchievements } from "../data/cv";
import { Badge } from "../components/Badge";
import { motion } from "framer-motion";
import { Award, Trophy, Heart, ExternalLink, Users, ShieldCheck, HeartHandshake } from "lucide-react";
import { cn } from "../lib/utils";

type AchievementType = "certification" | "award" | "volunteering" | "other";

type RichAchievement = {
  title: string;
  org?: string;          // Issuer / Organisation
  date?: string;         // e.g. "Aug 2024" or "2023 — 2024"
  description?: string;
  skills?: string[];
  link?: string;         // certificate or details URL
  type?: AchievementType;
  endorsements?: number; // like count / kudos
};

function isRich(a: any): a is RichAchievement {
  return a && typeof a === "object" && "title" in a;
}

// Map your existing string[] into a basic rich model
function normalise(input: any[]): RichAchievement[] {
  return input.map((a) => {
    if (isRich(a)) return a;
    return {
      title: String(a),
      type: "other",
    } as RichAchievement;
  });
}

const FILTERS: { key: "all" | AchievementType; label: string; icon: JSX.Element }[] = [
  { key: "all",           label: "All",           icon: <ShieldCheck className="w-4 h-4" /> },
  { key: "award",         label: "Awards",        icon: <Trophy className="w-4 h-4" /> },
  { key: "volunteering",  label: "Volunteering",  icon: <HeartHandshake className="w-4 h-4" /> },
];

export function Achievements() {
  const data = useMemo(() => normalise(rawAchievements as any[]), []);
  const [active, setActive] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [likes, setLikes] = useState<Record<number, number>>({});

  const filtered = useMemo(() => {
    if (active === "all") return data;
    return data.filter((a) => (a.type ?? "other") === active);
  }, [active, data]);

  const grouped = useMemo(() => {
    // Optional: group by year (LinkedIn vibe)
    const map = new Map<string, RichAchievement[]>();
    for (const a of filtered) {
      const key = extractYear(a.date) ?? "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    }
    // Sort by year desc, with "Other" last
    return Array.from(map.entries()).sort((a, b) => {
      if (a[0] === "Other") return 1;
      if (b[0] === "Other") return -1;
      return Number(b[0]) - Number(a[0]);
    });
  }, [filtered]);

  function onLike(idx: number) {
    setLikes((p) => ({ ...p, [idx]: (p[idx] ?? 0) + 1 }));
  }

  return (
    <Section
      id="achievements"
      title="Achievements"
      intro="Highlights, credentials, and milestones — in a clean, LinkedIn-style timeline."
    >
      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
        <div
          role="tablist"
          aria-label="Achievement filters"
          className="inline-flex flex-wrap gap-2 rounded-xl border border-neutral-200/70 dark:border-white/10 p-1 bg-white/70 dark:bg-white/5 backdrop-blur"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              role="tab"
              aria-selected={active === f.key}
              onClick={() => setActive(f.key)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition",
                active === f.key
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "hover:bg-neutral-100/70 dark:hover:bg-white/10"
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand/40 via-fuchsia-500/20 to-cyan-400/30" />
        <div className="space-y-10">
          {grouped.map(([year, items], gi) => (
            <motion.div
              key={year + gi}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: gi * 0.03 }}
            >
              <div className="pl-10 md:pl-12 mb-4">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500">
                  <Users className="w-4 h-4" />
                  {year}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {items.map((a, idx) => {
                  const likeKey = `${year}-${idx}`;
                  const likeCount = (a.endorsements ?? 0) + (likes[idx] ?? 0);
                  return (
                    <motion.article
                      key={likeKey}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35 }}
                      className="relative pl-10 md:pl-12"
                    >
                      {/* Trophy icon */}
                      <div className="absolute left-2 md:left-4 top-2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 shadow-[0_0_0_3px] shadow-white/50 dark:shadow-white/10 flex items-center justify-center">
                        <Trophy className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>

                      <div className="card p-5 border-white/10">
                        <header className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-[1.05rem] leading-tight">
                              {a.title}
                            </h3>
                            {(a.org || a.date) && (
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                {a.org && <span className="text-brand font-medium">{a.org}</span>}
                                {a.org && a.date ? " • " : ""}
                                {a.date}
                              </p>
                            )}
                          </div>
                          <TypeBadge type={a.type ?? "other"} />
                        </header>

                        {a.description && (
                          <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-3 leading-relaxed">
                            {a.description}
                          </p>
                        )}

                        {/* Skills */}
                        {a.skills && a.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {a.skills.map((s) => <Badge key={s}>{s}</Badge>)}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => onLike(idx)}
                            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 hover:bg-neutral-100/70 dark:hover:bg-white/10 transition"
                            aria-label="Give kudos"
                          >
                            <Heart className="w-4 h-4" />
                            Kudos
                            <span className="text-xs opacity-70">{likeCount}</span>
                          </button>

                          {a.link && (
                            <a
                              href={a.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white hover:opacity-90 transition focus-ring"
                              aria-label="View certificate or details"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Helpers ---------- */
function extractYear(date?: string) {
  if (!date) return undefined;
  const m = date.match(/(20\d{2}|19\d{2})/g);
  if (!m) return undefined;
  // Pick the last (e.g., "2023 — 2025")
  return m[m.length - 1];
}

function TypeBadge({ type }: { type: AchievementType }) {
  const map: Record<AchievementType, { label: string; cls: string; icon: JSX.Element }> = {
    certification: {
      label: "Certification",
      cls: "from-emerald-500 to-teal-400",
      icon: <Award className="w-3.5 h-3.5" />,
    },
    award: {
      label: "Award",
      cls: "from-amber-500 to-orange-500",
      icon: <Trophy className="w-3.5 h-3.5" />,
    },
    volunteering: {
      label: "Volunteering",
      cls: "from-pink-500 to-rose-500",
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
    },
    other: {
      label: "Achievement",
      cls: "from-brand to-fuchsia-500",
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  };
  const { label, cls, icon } = map[type];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r text-white">
      <span className={cn("inline-block w-2 h-2 rounded-full bg-gradient-to-r", cls)} />
      {icon}
      {label}
    </span>
  );
}
