import { motion } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
import type { SkillItem } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'

interface BentoGridProps {
  skills: SkillItem[]
}

function getSpanClasses(index: number) {
  const pattern = [
    'md:col-span-2 md:row-span-2',
    'md:col-span-1 md:row-span-1',
    'md:col-span-1 md:row-span-1',
    'md:col-span-2 md:row-span-1',
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
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          scrub: 1.05,
          pin: true,
          anticipatePin: 1,
        },
      })

      reveal.fromTo(
        cards,
        { opacity: 0, y: 100, rotateX: 36, z: -150 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          z: 0,
          stagger: 0.16,
          ease: 'power2.out',
        },
      )

      cards.forEach((card, index) => {
        reveal.to(
          card,
          {
            y: index % 2 === 0 ? -16 : 16,
            rotateZ: index % 3 === 0 ? 0.8 : -0.8,
            ease: 'none',
          },
          0,
        )
      })
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
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

        <div className="mt-16 grid auto-rows-[180px] grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[200px]">
          {skills.map((skill, index) => (
            <motion.article
              key={skill.name}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              data-cursor="interactive"
              className={`group relative overflow-hidden rounded-2xl border border-chalk/15 bg-white/[0.03] p-6 backdrop-blur-sm ${getSpanClasses(
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
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <span className="text-[0.63rem] uppercase tracking-[0.3em] text-neon">
                    {skill.category}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-chalk">
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
