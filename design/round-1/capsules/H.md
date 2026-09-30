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
