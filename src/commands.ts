import { contact, experience, profile, projects, skills, type Project } from './content.ts'

// Output is plain data so it can be checked without a DOM (see commands.check.ts).
export type Tone = 'name' | 'desc' | 'stack' | 'err'
export type Seg = string | { run: string; text?: string } | { href: string; text: string }
export type Line = { tone: Tone; segs: Seg[] }
export type Cell = { head: Seg; lines: Line[] }
export type Image = { src: string; alt: string; width: number; height: number }
export type Block = { lines: Line[] } | { grid: Cell[] } | { image: Image }
export type Result = Block[] | 'clear'

const line = (tone: Tone, ...segs: Seg[]): Line => ({ tone, segs })
const lines = (...l: Line[]): Block => ({ lines: l })
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '')

const core = projects.filter((p) => p.group === 'core')
const infra = projects.filter((p) => p.group === 'infra')

const cell = (p: Project): Cell => ({
  head: { run: `open ${p.name}`, text: p.name },
  lines: [line('desc', p.summary), line('stack', p.stack.join(' '))],
})

const infraCell: Cell = {
  head: { run: 'ls infra', text: 'infra/' },
  lines: [line('desc', `${infra.length} deployment repos`), line('stack', 'docker kubernetes helm ansible jenkins aws')],
}

function findProject(arg: string): Project | undefined {
  const q = arg.toLowerCase()
  return projects.find((p) => p.name.toLowerCase() === q)
}

function openProject(p: Project): Block[] {
  const links = [line('desc', 'repo  ', { href: p.repo, text: bare(p.repo) })]
  if (p.live) links.push(line('desc', 'live  ', { href: p.live, text: bare(p.live) }))
  // One expanded ls cell: the project keeps its display-size name.
  return [{ grid: [{ head: p.name, lines: [...p.about.map((a) => line('desc', a)), line('stack', p.stack.join(' '))] }] }, lines(...links)]
}

type Command = { usage: string; about: string; run: (args: string[]) => Block[] | 'clear' }

const commands: Record<string, Command> = {
  help: {
    usage: 'help',
    about: 'list commands',
    run: () => [
      lines(
        ...Object.values(commands).map((c) =>
          line('desc', { run: c.usage.split(' ')[0], text: c.usage }, ' '.repeat(Math.max(2, 16 - c.usage.length)) + c.about),
        ),
      ),
      lines(line('stack', 'tab completes, arrow keys walk history, ctrl+l clears')),
    ],
  },
  whoami: {
    usage: 'whoami',
    about: 'who this is',
    // The help token gives touch visitors something to tap at boot.
    run: () => [{ image: profile.portrait }, lines(line('name', profile.name), line('desc', profile.lede), line('stack', 'run ', { run: 'help' }, ' to see commands'))],
  },
  projects: {
    usage: 'projects',
    about: 'what I built; --live for deployed ones',
    run: ([flag]) => {
      if (flag === undefined) return [{ grid: [...core.map(cell), infraCell] }]
      if (flag === '--live') return [{ grid: projects.filter((p) => p.live).map(cell) }]
      return [lines(line('err', `projects: unknown option ${flag}`), line('desc', 'try ', { run: 'projects --live' }))]
    },
  },
  ls: {
    usage: 'ls [dir]',
    about: 'list projects/ or infra/',
    run: ([dir = 'projects']) => {
      const d = dir.replace(/\/$/, '')
      if (d === 'projects' || d === '.') return commands.projects.run([])
      if (d === 'infra') return [{ grid: infra.map(cell) }]
      return [lines(line('err', `ls: ${dir}: No such file or directory`))]
    },
  },
  open: {
    usage: 'open <name>',
    about: 'details and links',
    run: ([arg]) => {
      if (!arg) return [lines(line('err', 'usage: open <name>'), line('desc', 'names come from ', { run: 'projects' }))]
      if (arg.replace(/\/$/, '') === 'infra') return commands.ls.run(['infra'])
      const p = findProject(arg)
      if (!p) return [lines(line('err', `open: no such project: ${arg}`), line('desc', 'see ', { run: 'projects' }))]
      return openProject(p)
    },
  },
  skills: {
    usage: 'skills',
    about: 'tools I use, backed by the repos above',
    run: () => [{ grid: Object.entries(skills).map(([k, v]) => ({ head: k, lines: [line('stack', v.join(' '))] })) }],
  },
  experience: {
    usage: 'experience',
    about: 'how I work',
    run: () => [lines(...experience.map((e) => line('desc', e)))],
  },
  contact: {
    usage: 'contact',
    about: 'email, github, linkedin',
    run: () => [
      lines(
        line('desc', 'email     ', { href: `mailto:${contact.email}`, text: contact.email }),
        line('desc', 'github    ', { href: contact.github, text: bare(contact.github) }),
        line('desc', 'linkedin  ', { href: contact.linkedin, text: bare(contact.linkedin).replace(/\/$/, '') }),
      ),
    ],
  },
  resume: {
    usage: 'resume',
    about: 'download the pdf',
    run: () => [lines(line('desc', { href: '/resume.pdf', text: 'resume.pdf' }))],
  },
  clear: {
    usage: 'clear',
    about: 'clear the screen',
    run: () => 'clear',
  },
}

export function run(input: string): Result {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return []
  const cmd = commands[name.toLowerCase()]
  if (!cmd) return [lines(line('err', `command not found: ${name}`), line('desc', 'try ', { run: 'help' }))]
  return cmd.run(args)
}

const commonPrefix = (xs: string[]) =>
  xs.reduce((a, b) => {
    let i = 0
    while (i < a.length && a[i].toLowerCase() === b[i]?.toLowerCase()) i++
    return a.slice(0, i)
  })

// Returns the input extended as far as it is unambiguous.
export function complete(input: string): string {
  const m = input.match(/^(\S*)(?:\s+(\S*))?$/)
  if (!m) return input
  const [, head, arg] = m
  const pick = (pool: string[], typed: string) => {
    const hits = pool.filter((x) => x.toLowerCase().startsWith(typed.toLowerCase()))
    return hits.length ? commonPrefix(hits) : typed
  }
  if (arg === undefined) {
    const done = pick(Object.keys(commands), head)
    return commands[done] ? `${done} ` : done
  }
  const pool = head === 'open' ? [...projects.map((p) => p.name), 'infra/'] : head === 'ls' ? ['projects/', 'infra/'] : []
  return `${head} ${pick(pool, arg)}`
}

export const boot = ['whoami']
