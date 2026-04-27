import { useLayoutEffect, useRef } from 'react'
import type { ResumeItem } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'
import MagneticButton from '@/components/MagneticButton'

interface HorizontalTimelineProps {
  entries: ResumeItem[]
  resumeHref: string
}

export default function HorizontalTimeline({
  entries,
  resumeHref,
}: HorizontalTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track || entries.length === 0) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      return
    }

    const { gsap, ScrollTrigger } = ensureGsap()

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('article', track)
      const getDistance = () =>
        Math.max(track.scrollWidth - section.clientWidth, 0)
      const mm = gsap.matchMedia()

      mm.add('(min-width: 1024px)', () => {
        gsap.set(track, { x: 0 })

        const horizontalScroll = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance() + window.innerHeight * 0.75}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        return () => {
          horizontalScroll.kill()
          gsap.set(track, { clearProps: 'transform' })
        }
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.set(track, { clearProps: 'transform' })

        gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.68,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 74%',
              once: true,
            },
          },
        )
      })

      const refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => {
        window.cancelAnimationFrame(refreshFrame)
        mm.revert()
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

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:overflow-visible"
        >
          {entries.map((entry) => (
            <article
              key={`${entry.company}-${entry.role}`}
              className="min-h-[440px] w-[calc(100vw-3rem)] shrink-0 snap-start rounded-3xl border border-chalk/10 bg-white/[0.03] p-8 md:w-[42rem]"
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
          ))}
        </div>
      </div>
    </section>
  )
}
