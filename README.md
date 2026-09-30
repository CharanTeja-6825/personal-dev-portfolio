# personal-dev-portfolio

Rathikindi Charan Teja's portfolio, built as a small shell. It boots having already run `whoami` and then waits at an empty prompt. Visitors type commands (`help` lists them) or click any name in the output to run it.

```
guest@charan:~$ help
help            list commands
whoami          who this is
projects        what I built; --live for deployed ones
ls [dir]        list projects/ or infra/
open <name>     details and links
skills          tools I use, backed by the repos above
experience      how I work
contact         email, github, linkedin
resume          download the pdf
clear           clear the screen
```

Tab completes, the arrow keys walk history, and Ctrl+L clears.

## Layout

| Path | What it is |
|---|---|
| `src/content.ts` | All content: profile, skills, experience, projects. Every claim is sourced from the resume or the linked repo. |
| `src/commands.ts` | Pure command table. `run(input)` returns plain data; `complete(input)` handles Tab. |
| `src/Shell.tsx` | Renders the output log and prompt: history, Tab, Ctrl+L, click-to-run. |
| `src/styles.css` | Design tokens and styles for locked direction H. |
| `src/commands.check.ts` | Assert-based self-check for commands and completion. |
| `public/fonts/` | Self-hosted Monaspace Xenon 300/400/800 (SIL OFL 1.1, see `OFL.txt`). |
| `public/resume.pdf` | The resume served by `resume`. |
| `public/portrait.webp` | Portrait shown by `whoami`. Regenerate with `python3 scripts/portrait.py <photo>` (needs Pillow). |
| `design/` | Locked direction H, its capsule (`ROUND-2-CONTEXT.md`) and `STYLEGUIDE.html`. |

To add a project, append it to `projects` in `src/content.ts`. Use `group: 'core'` for the main grid or `'infra'` for `ls infra`. Public repos only.

## Scripts

```bash
npm run dev        # vite dev server
npm run check      # command self-check (node, no deps)
npm run typecheck  # tsc, strict
npm run lint       # eslint over .ts/.tsx
npm run preview    # build + wrangler dev on :8787
npm run deploy     # build + wrangler deploy (Cloudflare Workers static assets)
```

Stack: React 19, TypeScript, Vite 8, Cloudflare Workers. No animation or CSS framework.
