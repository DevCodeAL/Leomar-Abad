# Leomar Abad — Portfolio

A dashboard-style personal portfolio built with React 19, Vite and Tailwind CSS.
Single page, single scroll column, fixed sidebar navigation, and a theme system
with **5 colour palettes × light/dark = 10 visual combinations**.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Environment

The contact form posts through EmailJS. Create a `.env` with:

```
VITE_EMAILJS_SERVICE_ID=…
VITE_EMAILJS_TEMPLATE_ID=…
VITE_EMAILJS_PUBLIC_KEY=…
```

The EmailJS template expects the fields `name`, `email` and `message`.
Without these keys the form degrades gracefully: it shows an inline error
pointing the visitor at the email address instead of failing silently.

## Structure

```
src/
├── data/            content only — no JSX layout decisions
│   ├── profile.js       name, role, socials, education, focus areas
│   ├── navigation.js    section registry (drives sidebar + scroll-spy)
│   ├── projects.js      projects + bento grid spans
│   ├── skills.js        toolkit, grouped
│   ├── experience.js    timeline entries
│   ├── services.js      services
│   ├── testimonials.js  recommendations
│   └── stats.js         figures COUNTED from the data above
│
├── styles/palettes.css  every colour token, 5 palettes × 2 modes
├── theme/               ThemeProvider, useTheme, ThemeToggle, PaletteSelector
├── hooks/               scroll-spy, parallax, reduced motion, clipboard, …
│
└── components/
    ├── layout/      DashboardLayout, Sidebar, MobileNavigation, Footer, …
    ├── ui/          Button, Card, Badge, Reveal, Tooltip, SectionHeader, …
    ├── projects/    FeaturedProject, ProjectCard, ProjectGrid
    └── dashboard/   Hero, Stats, About, Experience, Skills, Projects,
                     Services, Testimonials, Contact
```

Content lives in `src/data`. To add a project, skill or timeline entry, edit
the relevant data file — nothing in `components/` needs to change.

## Theming

Colours are **never** hardcoded in components. Everything resolves through CSS
variables set on `<html>` by two attributes:

```html
<html data-theme="dark|light" data-palette="default|ocean|emerald|violet|sunset">
```

`src/styles/palettes.css` defines one block per combination:

| Token | Meaning |
| --- | --- |
| `--canvas`, `--canvas-deep` | page background |
| `--surface`, `--elevated` | card and raised surfaces |
| `--line`, `--line-strong` | borders |
| `--ink`, `--ink-muted`, `--ink-subtle` | text hierarchy |
| `--primary`, `--primary-strong`, `--primary-fg` | accent, hover, text-on-accent |
| `--accent` | secondary hue for gradients |

`tailwind.config.js` maps these to utilities (`bg-canvas`, `text-ink-muted`,
`border-line`, `bg-primary/10`, …). Adding a sixth palette means adding one
block of CSS — no component changes.

Palette 1 (`default`) is the original brand: `#1ed760` on `#121212` / `#212121`.
It is the default for first-time visitors. Theme and palette persist in
`localStorage` and are applied by an inline script in `index.html` before first
paint, so there is no flash of the wrong colours.

## Performance & accessibility notes

- No animation library. Reveals, hovers and marquees are CSS transitions
  driven by `IntersectionObserver`.
- Scroll listeners are `passive` and `requestAnimationFrame`-throttled; the
  parallax layers only ever write a CSS variable.
- `prefers-reduced-motion: reduce` disables reveals, parallax, the marquees,
  the count-up figures and the rotating job title.
- Semantic landmarks, a skip link, visible focus rings, `aria-current` on the
  active nav item, and `inert` on the closed mobile drawer.

## Content policy

Every fact on the page comes from the original portfolio. Dashboard figures in
`src/data/stats.js` are counted from the real data at runtime rather than typed
in, and there are no invented skill percentages, dates or metrics. The two
academic timeline entries are labelled by programme phase because only the 2025
graduation date is documented — add real dates in `src/data/experience.js` when
you have them.
