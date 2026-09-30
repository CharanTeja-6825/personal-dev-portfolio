# Round 2 context: locked direction H

Locked on 2026-09-30 by explicit instruction ("lock H.html"). Directions A–G, I, J and hybrids H1–H3 were deleted.

Human notes at lock: "stays in my mind", "looks alive", "kind of old time terminal". G was noted for clean black/white simplicity, but the hybrids were not chosen.

# H
Premise: plain `ls` prints names across in columns. Project names become a huge sorted grid; details sit small beneath each.
Font: Monaspace Xenon 400/800, slab-serif mono (GitHub Next, OFL-1.1). Fallback: ui-monospace.
Type: project names clamp(22–46px) 800 with -0.035em tracking, wrapped anywhere. Details 14px. The whoami block is 15px, name 800.
Color (4): canvas #243a8c; primary #f4f3ec (project names, name) ~35%; secondary #aab8f5 (descriptions, lede) ~30%; tertiary #7fdcc0 (stack) ~20%; accent #ffc857 (prompt+commands) ~15%.
Space: a 3/2/1 column grid (breaks at 52rem/30rem) with 16–48px gutters and 32–72px row gaps. whoami is kept small at the top-left, max 58ch.
Signature: the `ls` column grid at display size, with name dominance inverted (projects outrank the person).
Invariants: saturated ink-blue canvas, slab mono display, sorted grid. Prohibited: list layout for projects.
Risk: the saturated canvas is strong over long sessions.
Round 2: `projects` renders as the grid; `open` shows one cell expanded.


# Evidence capsule (shared)

- Subject: personal portfolio of Rathikindi Charan Teja, CS undergraduate (backend, distributed systems, devops). Delivered as an interactive shell.
- Audience: recruiters and engineers deciding on internship interviews.
- First-party language: resume PDF; GitHub profile README ("Computer Science undergraduate focused on backend development, distributed systems and scalable applications."); repo READMEs.
- Observations: works all day in the macOS terminal; installs with brew, runs with docker, tests with curl; values minimal and deterministic results.
- Tensions: an expressive portfolio vs a tool that just prints output; people who don't type vs a keyboard-first medium.
- Working copy (identical in A–J): `whoami` + `ls projects` boot output, plus the waiting prompt. Project order is C-locale `ls` sort (uppercase first). Descriptions come from each repo's README/code.
- Allowed sources: the above, terminal/CLI behaviour (tty cell grid, prompt, scrollback, man(1), HTTP headers, YAML indentation, ls columns). Prohibited: portfolio galleries, other designers, UI kits, Google Fonts.
- Fonts: all SIL OFL-1.1, loaded from jsDelivr (@fontsource 5.3.0 mirrors). Free to self-host; no purchase or account needed.


## Round 2 decisions

- 2026-09-30: the human asked to integrate their portrait (IMG_0160.JPG). Imagery was approved for this one use only. Treatment: an H duotone (canvas → ink), shown in whoami in the neofetch layout. A text/ASCII rendering was tried and rejected because the likeness was lost. The rules are in STYLEGUIDE.html under imagery.
- 2026-09-30: human override ("Represent the actual image itself"). The portrait now uses the photo's real colours instead of the duotone. It's the only full-colour element; everything else stays in H's palette.
- 2026-09-30: human override. The boot runs only `whoami`, leaving an empty prompt; `ls projects` is no longer auto-run. The project grid appears on demand (help, projects, ls).
- 2026-09-30: human approved a runnable `help` line at the end of whoami output ("run help to see commands") so touch visitors can continue without typing.
