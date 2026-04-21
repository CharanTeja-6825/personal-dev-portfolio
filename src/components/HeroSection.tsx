import { useLayoutEffect, useRef } from 'react'
import { ensureGsap } from '@/lib/gsap'

const headline = ['ENGINEERING', 'EXPERIENCES']

function renderCharacters(line: string) {
  return line.split('').map((char, index) => (
    <span
      key={`${line}-${index}`}
      className="hero-char inline-block will-change-transform"
      aria-hidden="true"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) {
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
      gsap.fromTo(
        '.hero-char',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.12,
          ease: 'power4.out',
          stagger: 0.02,
        },
      )
      gsap.fromTo(
        '.hero-subcopy',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, delay: 0.32, ease: 'power3.out' },
      )
    }, section)

    const layers = Array.from(
      section.querySelectorAll<HTMLElement>('[data-parallax-depth]'),
    )

    const onMove = (event: MouseEvent) => {
      const bounds = section.getBoundingClientRect()
      const relX = event.clientX - bounds.left
      const relY = event.clientY - bounds.top
      const centerX = bounds.width / 2
      const centerY = bounds.height / 2

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.parallaxDepth || 1)
        gsap.to(layer, {
          x: ((relX - centerX) / centerX) * depth * 22,
          y: ((relY - centerY) / centerY) * depth * 22,
          duration: 0.6,
          ease: 'power2.out',
        })
      })
    }

    const onLeave = () => {
      layers.forEach((layer) => {
        gsap.to(layer, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' })
      })
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)

    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden border-b border-chalk/10 px-6 py-16 md:px-12"
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          data-parallax-depth="1.4"
          className="absolute -left-10 top-20 h-64 w-64 rounded-full bg-neon/10 blur-3xl"
        />
        <div
          data-parallax-depth="-0.9"
          className="absolute right-[-120px] top-16 h-72 w-72 rounded-full bg-electric/20 blur-3xl"
        />
        <svg
          data-parallax-depth="1.1"
          className="absolute bottom-14 right-10 h-36 w-36 opacity-70"
          viewBox="0 0 100 100"
        >
          <path
            d="M50 5 L95 95 L5 95 Z"
            fill="none"
            stroke="rgba(245,245,245,0.3)"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl">
        <p className="mb-8 text-xs uppercase tracking-[0.44em] text-neon">
          Rathikindi Charan Teja · Full-Stack Engineer
        </p>
        <h1 className="font-display text-[clamp(3rem,10vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.03em] text-chalk">
          {headline.map((line) => (
            <span key={line} className="block overflow-hidden">
              {renderCharacters(line)}
            </span>
          ))}
        </h1>
        <p className="hero-subcopy mt-8 max-w-2xl text-lg leading-relaxed text-chalk/70 md:text-2xl">
          I design and ship interfaces that make complex systems feel obvious,
          fast, and memorable—built for product velocity, not template theater.
        </p>
      </div>
    </section>
  )
}
