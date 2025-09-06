import { useMemo, useState } from "react";
import { Section } from "../components/Section";
import { skills as skillGroups } from "../data/cv";
import { Badge } from "../components/Badge";
import { motion } from "framer-motion";
import { Search, Grid, Rows } from "lucide-react";
import { cn } from "../lib/utils";


export function Skills() {
  const [mode, setMode] = useState<"grouped" | "all">("grouped");
  const [query, setQuery] = useState("");

  // Flattened skills for "All" mode
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    skillGroups.forEach((g) => g.items.forEach((i: string) => set.add(i)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skillGroups;
    return skillGroups
      .map((g) => ({
        ...g,
        items: g.items.filter((i: string) => i.toLowerCase().includes(q))
      }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const filteredAll = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSkills;
    return allSkills.filter((i) => i.toLowerCase().includes(q));
  }, [query, allSkills]);

  return (
    <Section
      id="skills"
      title="Skills"
      intro="A toolkit shaped by shipping projects end-to-end."
    >
      {/* Controls */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <label className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills…"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus-ring text-sm"
          />
        </label>

        {/* View toggle */}
        <div
          role="tablist"
          aria-label="Skills view"
          className="inline-flex rounded-xl border border-neutral-200/70 dark:border-white/10 p-1 bg-white/70 dark:bg-white/5 backdrop-blur"
        >
          <button
            role="tab"
            aria-selected={mode === "grouped"}
            onClick={() => setMode("grouped")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition",
              mode === "grouped"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "hover:bg-neutral-100/70 dark:hover:bg-white/10"
            )}
          >
            <Rows className="w-4 h-4" /> Grouped
          </button>
          <button
            role="tab"
            aria-selected={mode === "all"}
            onClick={() => setMode("all")}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition",
              mode === "all"
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "hover:bg-neutral-100/70 dark:hover:bg-white/10"
            )}
          >
            <Grid className="w-4 h-4" /> All
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === "grouped" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((g, gi) => (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: gi * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{g.group}</h3>
                <span className="text-xs text-neutral-500">{g.items.length} items</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((i: string) => (
                  <Badge key={i}>{i}</Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          {filteredAll.map((i) => (
            <Badge key={i}>{i}</Badge>
          ))}
        </motion.div>
      )}
    </Section>
  );
}
