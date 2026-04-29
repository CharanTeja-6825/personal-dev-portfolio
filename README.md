# Personal Portfolio

A motion-driven developer portfolio built with React, Vite, Tailwind CSS, GSAP, Framer Motion, and Lenis. The experience is designed around a dark editorial interface, lime-green accent energy, scroll-based storytelling, and polished micro-interactions.

## Tech Stack

### Core

- React 19
- TypeScript 6
- Vite 8
- Node.js package workflow with npm

### Styling

- Tailwind CSS 3
- PostCSS and Autoprefixer
- Custom CSS modules for complex visual systems
- `clsx` and `tailwind-merge` for class composition

### Motion and Interaction

- GSAP 3 with ScrollTrigger for scroll-based animation sections
- Framer Motion 12 for cursor, magnetic, spring, and hover micro-interactions
- Lenis for smooth scrolling
- Custom cursor and magnetic button interactions
- Lightweight SVG and CSS keyframe animation for bento card visuals

### Data and Content

- Dynamic JSON imports from `data/skills.json`, `data/projects.json`, and `data/resume.json`
- Resume PDF served from `public/resume18mar2026.pdf`
- Portfolio sections receive data through typed props instead of hardcoded component content

### Build and Deployment

- Vite production build
- Cloudflare Vite plugin
- Wrangler for preview and deployment
- ESLint 9 with React Hooks and React Refresh rules

## Visual Theme

The portfolio uses a high-contrast dark mode theme with restrained neon accents.

### Color Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `obsidian` | `#0a0a0a` | Main page background |
| `chalk` | `#f5f5f5` | Primary text and light UI details |
| `neon` | `#ccff00` | Lime-green accent, labels, glows, hover fills |
| `electric` | `#ff0055` | Secondary hot-pink accent and ambient glow |

### Typography

- Display: `Inter Tight`
- Body: `Space Grotesk`
- The interface favors tight headings, uppercase micro-labels, and readable body copy over heavy decorative type.

### Atmosphere

- Dark obsidian base with subtle radial background glows
- Lime-green accent used for section labels, animated visual states, and hover feedback
- Electric pink reserved for contrast and ambient energy
- Rounded but controlled UI surfaces, with bento cards using the existing dark card background and soft borders

## Interface Sections

- `HeroSection` introduces the portfolio with GSAP entrance and pointer-reactive motion.
- `ProfileCurvedLoop` creates a looping profile and skills rhythm.
- `BentoGrid` presents the skill arsenal through the Magic Bento card system.
- `ProjectsShowcase` displays project work with scroll-aware reveals.
- `HorizontalTimeline` maps professional experience into a responsive animated timeline.
- `ContactRevealFooter` closes the page with a motion-led contact section.

## Bento Card Visual System

The skill cards use lightweight SVG, CSS, and Framer Motion details while preserving the original grid layout, typography, spacing, and dark/lime theme.

- React Interface Engineering: translucent rotating React atom with hover-speed motion.
- TypeScript Architecture: geometric strict-typing lock forms with lime pulse states.
- GSAP Storytelling Motion: thin cascading SVG wave paths with animated dash offsets.
- Framer Motion Micro-UX: blurred gradient orbs that spring around pointer movement.
- Tailwind Design Systems: miniature UI skeleton with group-hover cascading fills.
- Spring Boot APIs: server-node diagram with dashed links and pinging data dots.

All animation layers respect reduced-motion preferences and avoid heavy WebGL, canvas, and external animation payloads.

## Project Structure

```text
src/
  components/        Reusable portfolio sections and interactive UI systems
  lib/               Data loading, utilities, and GSAP setup
  styles/            Global Tailwind and theme styles
  page.tsx           Root portfolio composition and Lenis/ScrollTrigger sync
data/                Portfolio content in JSON and markdown
public/              Static assets served directly
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run deploy
```

## Local Development

Install dependencies, start Vite, and open the local server.

```bash
npm install
npm run dev
```

Production assets are generated with:

```bash
npm run build
```

Code quality is checked with:

```bash
npm run lint
```
