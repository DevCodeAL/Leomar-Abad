import { ArrowUp } from "lucide-react";
import { profile, socials } from "@/data/profile";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-surface/50">
      <div className="mx-auto flex max-w-workspace flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 xl:px-10">
        <div className="space-y-1">
          <p className="font-mono text-xs text-ink-subtle">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-ink-subtle">
            Built with passion and code — React, Vite &amp; Tailwind CSS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-subtle transition-[color,border-color,transform] duration-300 ease-smooth hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}

          <a
            href="#overview"
            aria-label="Back to top"
            className="ml-2 flex h-9 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-medium text-ink-subtle transition-[color,border-color] duration-200 hover:border-primary/50 hover:text-primary"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}
