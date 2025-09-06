import { personal } from "../data/cv";
import { Mail, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/60 dark:border-white/10">
      <div className="container py-10 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            Built with React, Tailwind, and a lot of caffeine ☕
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${personal.email}`} className="hover:text-brand underline underline-offset-8 inline-flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </a>
            <a href={personal.linkedin} className="hover:text-brand underline underline-offset-8 inline-flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-neutral-200/60 dark:border-white/10 text-center">
          <p className="text-xs text-neutral-500/80">
            © {new Date().getFullYear()} {personal.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
