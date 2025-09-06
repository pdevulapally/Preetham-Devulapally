import { useEffect, useMemo, useRef, useState } from "react";
import { personal } from "../data/cv";
import { Sun, Moon, Download, Menu, X, Search } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, useScroll, useSpring } from "framer-motion";

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#achievements", label: "Achievements" },
  { href: "#contact", label: "Contact" },
  { href: personal.resumeUrl, label: "CV" },
];

export function Navbar() {
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [active, setActive] = useState<string>("#");

  // ---------- THEME ----------
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // ---------- SCROLL PROGRESS ----------
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 210, damping: 30, mass: 0.3 });

  // ---------- ACTIVE LINK SYNC ----------
  useEffect(() => {
    const sections = ["#skills", "#projects", "#experience", "#education", "#achievements", "#contact"];
    const els = sections
      .map((id) => {
        const el = document.querySelector(id);
        return el ? { id, el } : null;
      })
      .filter(Boolean) as { id: string; el: Element }[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) {
          const id = "#" + (visible.target as HTMLElement).id;
          setActive(id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    els.forEach(({ el }) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ---------- COMMAND PALETTE (Ctrl/Cmd + K) ----------
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return links;
    return links.filter((l) => l.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if ((isMac && e.metaKey && e.key.toLowerCase() === "k") || (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setPaletteOpen((s) => !s);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ---------- MOBILE FOCUS TRAP ----------
  const firstFocusable = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (mobileOpen) firstFocusable.current?.focus();
  }, [mobileOpen]);

  // ---------- BODY SCROLL LOCK ----------
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  function closeAll() {
    setMobileOpen(false);
    setPaletteOpen(false);
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Glow + gradient border shell */}
      <div className="pointer-events-none absolute -z-10 inset-x-0 top-0 h-28 bg-gradient-to-b from-brand/20 to-transparent blur-2xl" />
      <div className="backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/55 border-b border-white/10">
        {/* Subtle gradient border strip */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        {/* Progress bar */}
        <motion.div style={{ scaleX: width }} className="origin-left h-[2px] bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400" />
        {/* Content row */}
        <div className="container h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-extrabold tracking-tight text-xl select-none">
            <span className="bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">Preetham</span>
            <span className="text-neutral-700 dark:text-neutral-300">.dev</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-[0.95rem]">
            {links.map((l) => {
              const isActive = active === l.href;
              const isCV = l.href === personal.resumeUrl;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative px-3 py-2 rounded-xl transition",
                    "text-neutral-700/90 hover:text-neutral-900 dark:text-neutral-300/90 dark:hover:text-white",
                    isActive && "text-neutral-900 dark:text-white"
                  )}
                  {...(isCV && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span className="relative">
                    {l.label}
                    {/* animated underline */}
                    <span
                      className={cn(
                        "absolute left-0 right-0 -bottom-1 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 transition-transform duration-300",
                        (isActive) && "scale-x-100"
                      )}
                    />
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="group inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200/70 dark:border-white/10 hover:bg-neutral-100/70 dark:hover:bg-white/10 transition focus-ring"
              aria-label="Open command palette"
              title="Search sections (Ctrl/⌘+K)"
            >
              <Search className="w-4 h-4" />
              <span className="opacity-80 group-hover:opacity-100">Quick Search</span>
            </button>
            <a
              href={personal.resumeUrl}
              className="btn-shine inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white focus-ring"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" /> CV
            </a>
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 transition focus-ring"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              aria-label="Open quick search"
              onClick={() => setPaletteOpen(true)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 focus-ring"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 focus-ring"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              ref={firstFocusable}
              aria-expanded={mobileOpen}
              aria-label="Toggle mobile menu"
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 focus-ring"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* panel */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 mt-16 mx-3 rounded-2xl card border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
          role="dialog"
          aria-modal="true"
        >
          <nav className="p-4">
            {links.map((l) => {
              const isCV = l.href === personal.resumeUrl;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-xl text-[0.95rem] transition",
                    "hover:bg-neutral-100/70 dark:hover:bg-white/10",
                    active === l.href ? "bg-neutral-100/70 dark:bg-white/10" : ""
                  )}
                  {...(isCV && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  {l.label}
                </a>
              );
            })}
            <div className="mt-3 flex gap-2">
              <a
                href={personal.resumeUrl}
                onClick={() => setMobileOpen(false)}
                className="btn-shine inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white dark:text-neutral-900 bg-neutral-900 dark:bg-white focus-ring"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4" /> Download CV
              </a>
            </div>
          </nav>
        </div>
      </div>

      {/* Command palette */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-sm flex items-start justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl card border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 p-3 border-b border-white/10">
              <Search className="w-4 h-4 opacity-70" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections… (Press Esc to close)"
                className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-500"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200/80 dark:bg-white/10">Esc</kbd>
            </div>
            <ul className="max-h-64 overflow-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm text-neutral-500">No matches</li>
              )}
              {filtered.map((l) => {
                const isCV = l.href === personal.resumeUrl;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setPaletteOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm hover:bg-neutral-100/70 dark:hover:bg-white/10 transition"
                      )}
                      {...(isCV && { target: "_blank", rel: "noopener noreferrer" })}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
