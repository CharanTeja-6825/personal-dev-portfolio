import { useLayoutEffect, useRef } from 'react'
import type { ResumeItem } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'
import MagneticButton from '@/components/MagneticButton'

interface HorizontalTimelineProps {
  entries: ResumeItem[]
  resumeHref: string
}

const AUTO_SCROLL_PIXELS_PER_SECOND = 46

function TimelineCard({
  entry,
  isDuplicate = false,
}: {
  entry: ResumeItem
  isDuplicate?: boolean
}) {
  return (
    <article
      aria-hidden={isDuplicate}
      className="min-h-[440px] w-[calc(100vw-3rem)] shrink-0 rounded-3xl border border-chalk/10 bg-white/[0.03] p-8 md:w-[42rem]"
    >
      <div className="flex flex-col gap-2 border-b border-chalk/10 pb-6">
        <p className="text-xs uppercase tracking-[0.32em] text-electric">
          {entry.dates}
        </p>
        <h3 className="font-display text-3xl font-semibold text-chalk">
          {entry.role}
        </h3>
        <p className="text-lg text-chalk/70">{entry.company}</p>
      </div>

      <ul className="mt-6 space-y-3">
        {entry.achievements.map((achievement) => (
          <li
            key={achievement}
            className="flex gap-3 text-base leading-relaxed text-chalk/75"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon" />
            <span>{achievement}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-2">
        {entry.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-neon/35 px-3 py-1 text-xs uppercase tracking-[0.18em] text-neon"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  )
}

export default function HorizontalTimeline({
  entries,
  resumeHref,
}: HorizontalTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    const loop = loopRef.current
    if (!section || !track || !loop || entries.length === 0) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      return
    }

    const { gsap } = ensureGsap()

    const ctx = gsap.context(() => {
      const startAutoScroll = () => {
        const distance = loop.scrollWidth
        if (distance < 1) {
          return
        }

        gsap.killTweensOf(track)
        gsap.set(track, { x: 0 })

        gsap.to(track, {
          x: -distance,
          duration: distance / AUTO_SCROLL_PIXELS_PER_SECOND,
          ease: 'none',
          repeat: -1,
        })
      }

      startAutoScroll()
      const resizeObserver = new ResizeObserver(startAutoScroll)
      resizeObserver.observe(loop)

      return () => {
        resizeObserver.disconnect()
        gsap.killTweensOf(track)
        gsap.set(track, { clearProps: 'transform' })
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [entries])

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-chalk/10 px-6 py-20 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-neon">
              The Proof
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-chalk md:text-6xl">
              Teams trust me with the hardest interfaces in the room.
            </h2>
          </div>
          <MagneticButton
            href={resumeHref}
            target="_blank"
            rel="noreferrer"
            className="self-start"
          >
            Download Full Resume
          </MagneticButton>
        </div>

        <div className="-mx-6 overflow-hidden px-6 motion-reduce:overflow-x-auto md:-mx-12 md:px-12">
          <div ref={trackRef} className="flex w-max">
            <div ref={loopRef} className="flex shrink-0 gap-6 pr-6">
              {entries.map((entry) => (
                <TimelineCard
                  key={`${entry.company}-${entry.role}`}
                  entry={entry}
                />
              ))}
            </div>

            <div aria-hidden="true" className="flex shrink-0 gap-6 pr-6">
              {entries.map((entry) => (
                <TimelineCard
                  key={`${entry.company}-${entry.role}-duplicate`}
                  entry={entry}
                  isDuplicate
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
