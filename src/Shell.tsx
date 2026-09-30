import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { boot, complete, run, type Block, type Line, type Seg } from './commands.ts'

type Entry = { id: number; input: string; out: Block[] }

const PROMPT = 'guest@charan:~$'
let nextId = 0
const exec = (input: string): Entry | 'clear' => {
  const out = run(input)
  return out === 'clear' ? 'clear' : { id: nextId++, input, out }
}
const bootEntries = boot.map(exec) as Entry[]
// Only take focus where it won't pop a phone keyboard.
const finePointer = () => window.matchMedia('(pointer: fine)').matches

export default function Shell() {
  const [entries, setEntries] = useState<Entry[]>(bootEntries)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1) // -1 = editing a fresh line
  const inputRef = useRef<HTMLInputElement>(null)
  const booted = useRef(false)

  useEffect(() => {
    if (!booted.current) {
      booted.current = true
      if (finePointer()) inputRef.current?.focus({ preventScroll: true })
      return
    }
    inputRef.current?.scrollIntoView({ block: 'end' })
    if (finePointer()) inputRef.current?.focus({ preventScroll: true })
  }, [entries])

  const submit = (cmd: string) => {
    const e = exec(cmd)
    setEntries((prev) => (e === 'clear' ? [] : [...prev, e]))
    if (cmd.trim()) setHistory((h) => [...h, cmd.trim()])
    setInput('')
    setCursor(-1)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && input && !e.shiftKey) {
      // Only swallow Tab when there is something to complete, so keyboard users can still leave the field.
      const next = complete(input)
      if (next !== input) {
        e.preventDefault()
        setInput(next)
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const up = e.key === 'ArrowUp'
      if (!history.length || (!up && cursor === -1)) return
      e.preventDefault()
      const i = cursor === -1 ? (up ? history.length - 1 : -1) : cursor + (up ? -1 : 1)
      const clamped = i >= history.length ? -1 : Math.max(0, i)
      setCursor(clamped)
      setInput(clamped === -1 ? '' : history[clamped])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  // Display names may break after "_" (hyphens already break); never mid-word.
  const label = (t: string, wrap: boolean) => (wrap ? t.split(/(?<=_)/).flatMap((p, k) => (k ? [<wbr key={k} />, p] : [p])) : t)
  const seg = (s: Seg, i: number, wrap = false) => {
    if (typeof s === 'string') return <span key={i}>{label(s, wrap)}</span>
    if ('href' in s) {
      const external = s.href.startsWith('http')
      return (
        <a key={i} href={s.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...(s.href.endsWith('.pdf') ? { download: '' } : {})}>
          {label(s.text, wrap)}
        </a>
      )
    }
    return (
      <button key={i} type="button" className="run" onClick={() => submit(s.run)}>
        {label(s.text ?? s.run, wrap)}
      </button>
    )
  }
  const line = (l: Line, i: number) => (
    <p key={i} className={l.tone}>
      {l.segs.map((s, j) => seg(s, j))}
    </p>
  )
  const block = (b: Block, i: number) =>
    'image' in b ? (
      // Like imgcat: the picture prints inline, before the text that follows it.
      <img key={i} className="portrait" src={b.image.src} alt={b.image.alt} width={b.image.width} height={b.image.height} decoding="async" />
    ) : 'grid' in b ? (
      <div key={i} className="grid">
        {b.grid.map((c, j) => (
          <div key={j} className="cell">
            <p className="head">{seg(c.head, 0, true)}</p>
            {c.lines.map(line)}
          </div>
        ))}
      </div>
    ) : (
      <div key={i} className="lines">
        {b.lines.map(line)}
      </div>
    )

  return (
    <main className="shell">
      <h1 className="sr-only">Rathikindi Charan Teja, portfolio shell</h1>
      <div role="log" aria-live="polite">
        {entries.map((e) => (
          <section key={e.id} className="entry">
            <p className="cmd">
              {PROMPT} {e.input}
            </p>
            {e.out.map(block)}
          </section>
        ))}
      </div>
      <form
        className="prompt"
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
      >
        <label htmlFor="cmd">{PROMPT}</label>
        <input
          id="cmd"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type help"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
        />
      </form>
    </main>
  )
}
