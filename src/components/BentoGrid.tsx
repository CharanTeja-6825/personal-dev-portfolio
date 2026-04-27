import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import type { SkillItem } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'

interface BentoGridProps {
  skills: SkillItem[]
}

function getSpanClasses(index: number) {
  const pattern = [
    'lg:col-span-2 lg:row-span-2',
    'lg:col-span-1 lg:row-span-1',
    'lg:col-span-1 lg:row-span-1',
    'lg:col-span-2 lg:row-span-1',
  ]

  return pattern[index % pattern.length]
}

export default function BentoGrid({ skills }: BentoGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section || skills.length === 0) {
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduceMotion) {
      return
    }

    const { gsap, ScrollTrigger } = ensureGsap()
    const cards = cardRefs.current.filter(Boolean)
    if (cards.length === 0) {
      return
    }

    const ctx = gsap.context(() => {
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 56,
            rotateX: 16,
            rotateZ: index % 2 === 0 ? 0.8 : -0.8,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateZ: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 58%',
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        )
      })

      const refreshFrame = window.requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      return () => window.cancelAnimationFrame(refreshFrame)
    }, section)

    return () => {
      ctx.revert()
    }
  }, [skills])

  return (
    <section
      id="arsenal"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-chalk/10 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.42em] text-electric">
          The Arsenal
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-chalk md:text-6xl">
          Tools I use when quality and ship speed both matter.
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">
          {skills.map((skill, index) => (
            <motion.article
              key={skill.name}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              data-cursor="interactive"
              className={`group relative min-h-[250px] overflow-hidden rounded-2xl border border-chalk/15 bg-white/[0.03] p-5 backdrop-blur-sm sm:min-h-[270px] sm:p-6 lg:min-h-0 ${getSpanClasses(
                index,
              )}`}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,85,0.22),transparent_55%)] opacity-55"
                whileHover={{
                  backgroundPositionX: '68%',
                  backgroundPositionY: '42%',
                }}
                transition={{ duration: 0.35 }}
              />
              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <span className="text-[0.63rem] uppercase tracking-[0.3em] text-neon">
                    {skill.category}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold text-chalk sm:text-2xl">
                    {skill.name}
                  </h3>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-electric">
                    {skill.proficiency}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-chalk/65">
                    {skill.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
