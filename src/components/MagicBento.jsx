import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { gsap } from 'gsap'
import './MagicBento.css'

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = '132, 0, 255'
const MOBILE_BREAKPOINT = 768
const MotionDiv = motion.div
const MotionSpan = motion.span

const DEFAULT_CARD_DATA = [
  {
    color: '#120F17',
    title: 'Analytics',
    description: 'Track user behavior',
    label: 'Insights',
  },
  {
    color: '#120F17',
    title: 'Dashboard',
    description: 'Centralized data view',
    label: 'Overview',
  },
  {
    color: '#120F17',
    title: 'Collaboration',
    description: 'Work together seamlessly',
    label: 'Teamwork',
  },
  {
    color: '#120F17',
    title: 'Automation',
    description: 'Streamline workflows',
    label: 'Efficiency',
  },
  {
    color: '#120F17',
    title: 'Integration',
    description: 'Connect favorite tools',
    label: 'Connectivity',
  },
  {
    color: '#120F17',
    title: 'Security',
    description: 'Enterprise-grade protection',
    label: 'Protection',
  },
]

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const element = document.createElement('div')
  element.className = 'magic-bento-particle'
  element.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return element
}

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
})

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty('--glow-x', `${relativeX}%`)
  card.style.setProperty('--glow-y', `${relativeY}%`)
  card.style.setProperty('--glow-intensity', String(glow))
  card.style.setProperty('--glow-radius', `${radius}px`)
}

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

const ReactAtomVisual = ({ active, reduceMotion }) => (
  <div className="magic-bento-visual magic-bento-visual--react" aria-hidden="true">
    <MotionDiv
      className="magic-bento-react-atom"
      animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
      transition={{
        duration: active ? 15 : 32,
        ease: 'linear',
        repeat: reduceMotion ? 0 : Infinity,
      }}
    >
      <svg viewBox="0 0 160 120" role="presentation">
        <ellipse className="magic-bento-react-atom__ring" cx="80" cy="60" rx="58" ry="18" />
        <ellipse
          className="magic-bento-react-atom__ring"
          cx="80"
          cy="60"
          rx="58"
          ry="18"
          transform="rotate(60 80 60)"
        />
        <ellipse
          className="magic-bento-react-atom__ring"
          cx="80"
          cy="60"
          rx="58"
          ry="18"
          transform="rotate(120 80 60)"
        />
        <circle className="magic-bento-react-atom__core" cx="80" cy="60" r="5" />
      </svg>
    </MotionDiv>
  </div>
)

const TypeScriptLockVisual = () => (
  <div className="magic-bento-visual magic-bento-visual--typescript" aria-hidden="true">
    <svg viewBox="0 0 180 112" role="presentation">
      <rect className="magic-bento-ts__rail" x="25" y="24" width="130" height="64" rx="12" />
      <rect className="magic-bento-ts__slot" x="38" y="38" width="28" height="28" rx="5" />
      <rect className="magic-bento-ts__slot" x="76" y="38" width="28" height="28" rx="5" />
      <rect className="magic-bento-ts__slot magic-bento-ts__slot--locked" x="114" y="38" width="28" height="28" rx="5" />
      <rect className="magic-bento-ts__block" x="39" y="39" width="26" height="26" rx="4" />
      <rect className="magic-bento-ts__block" x="77" y="39" width="26" height="26" rx="4" />
      <path className="magic-bento-ts__check" d="M120 52.5l5 5 10-12" />
    </svg>
  </div>
)

const PlaygroundOrb = ({ x, y, size, className, strength = 1 }) => {
  const offsetX = useTransform(x, [0, 1], [-14 * strength, 18 * strength])
  const offsetY = useTransform(y, [0, 1], [12 * strength, -16 * strength])

  return (
    <MotionSpan
      className={`magic-bento-orb ${className}`}
      style={{
        width: size,
        height: size,
        x: offsetX,
        y: offsetY,
      }}
    />
  )
}

const FramerPlaygroundVisual = ({ reduceMotion }) => {
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const springX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.45 })
  const springY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.45 })

  const handlePointerMove = (event) => {
    if (reduceMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }

  const handlePointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  return (
    <div
      className="magic-bento-visual magic-bento-visual--framer"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <PlaygroundOrb x={springX} y={springY} size={52} className="magic-bento-orb--one" strength={1.2} />
      <PlaygroundOrb x={springX} y={springY} size={38} className="magic-bento-orb--two" strength={-0.85} />
      <PlaygroundOrb x={springX} y={springY} size={44} className="magic-bento-orb--three" strength={0.7} />
      <PlaygroundOrb x={springX} y={springY} size={30} className="magic-bento-orb--four" strength={-1.15} />
    </div>
  )
}

const GsapWaveVisual = () => (
  <div className="magic-bento-visual magic-bento-visual--gsap" aria-hidden="true">
    <svg viewBox="0 0 220 120" role="presentation">
      <path className="magic-bento-gsap__wave magic-bento-gsap__wave--one" d="M10 76 C44 28 70 112 108 64 S174 44 210 80" />
      <path className="magic-bento-gsap__wave magic-bento-gsap__wave--two" d="M10 58 C48 96 72 16 112 56 S174 98 210 42" />
      <path className="magic-bento-gsap__wave magic-bento-gsap__wave--three" d="M10 92 C56 66 82 68 116 90 S172 104 210 68" />
    </svg>
  </div>
)

const TailwindSkeletonVisual = () => (
  <div className="magic-bento-visual magic-bento-visual--tailwind" aria-hidden="true">
    <div className="magic-bento-skeleton">
      <div className="h-full w-[24%] rounded bg-chalk/[0.08] transition-colors duration-500 group-hover:bg-neon/[0.18]" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 rounded bg-chalk/[0.09] transition-colors delay-75 duration-500 group-hover:bg-neon/[0.24]" />
        <div className="grid flex-1 grid-cols-3 gap-2">
          <span className="rounded bg-chalk/[0.07] transition-colors delay-100 duration-500 group-hover:bg-neon/[0.16]" />
          <span className="rounded bg-chalk/[0.07] transition-colors delay-150 duration-500 group-hover:bg-neon/[0.2]" />
          <span className="rounded bg-chalk/[0.07] transition-colors delay-200 duration-500 group-hover:bg-neon/[0.26]" />
        </div>
        <div className="h-2 w-2/3 rounded bg-chalk/[0.06] transition-colors delay-300 duration-500 group-hover:bg-neon/[0.2]" />
      </div>
    </div>
  </div>
)

const SpringBootApiVisual = () => (
  <div className="magic-bento-visual magic-bento-visual--spring" aria-hidden="true">
    <svg viewBox="0 0 190 118" role="presentation">
      <path className="magic-bento-spring__line" d="M43 58h46M101 42l34-20M102 76l34 20" />
      <circle className="magic-bento-spring__server" cx="43" cy="58" r="18" />
      <circle className="magic-bento-spring__dot magic-bento-spring__dot--one" cx="89" cy="58" r="4" />
      <circle className="magic-bento-spring__dot magic-bento-spring__dot--two" cx="101" cy="42" r="4" />
      <circle className="magic-bento-spring__dot magic-bento-spring__dot--three" cx="102" cy="76" r="4" />
      <circle className="magic-bento-spring__node magic-bento-spring__node--one" cx="139" cy="20" r="10" />
      <circle className="magic-bento-spring__node magic-bento-spring__node--two" cx="139" cy="98" r="10" />
    </svg>
  </div>
)

const SkillCardVisual = ({ card, active, disableAnimations }) => {
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = disableAnimations || prefersReducedMotion

  if (card.title === 'React Interface Engineering') {
    return <ReactAtomVisual active={active} reduceMotion={reduceMotion} />
  }

  if (card.title === 'TypeScript Architecture') {
    return <TypeScriptLockVisual />
  }

  if (card.title === 'Framer Motion Micro-UX') {
    return <FramerPlaygroundVisual reduceMotion={reduceMotion} />
  }

  if (card.title === 'GSAP Storytelling Motion') {
    return <GsapWaveVisual />
  }

  if (card.title === 'Tailwind Design Systems') {
    return <TailwindSkeletonVisual />
  }

  if (card.title === 'Spring Boot APIs') {
    return <SpringBootApiVisual />
  }

  return null
}

const CardBody = ({ card, isActive = false, disableAnimations = false }) => (
  <>
    <div className="magic-bento-card__header">
      <div className="magic-bento-card__label">{card.label}</div>
    </div>
    <SkillCardVisual
      card={card}
      active={isActive}
      disableAnimations={disableAnimations}
    />
    <div className="magic-bento-card__content">
      <h3 className="magic-bento-card__title">{card.title}</h3>
      <p className="magic-bento-card__description">{card.description}</p>
    </div>
  </>
)

const ParticleCard = ({
  card,
  className,
  disableAnimations = false,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = false,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef(null)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const particlesRef = useRef([])
  const timeoutsRef = useRef([])
  const isHoveredRef = useRef(false)
  const memoizedParticlesRef = useRef([])
  const particlesInitializedRef = useRef(false)
  const magnetismAnimationRef = useRef(null)

  const initializeParticles = useCallback(() => {
    if (particlesInitializedRef.current || !cardRef.current) {
      return
    }

    const { width, height } = cardRef.current.getBoundingClientRect()
    memoizedParticlesRef.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor,
      ),
    )
    particlesInitializedRef.current = true
  }, [particleCount, glowColor])

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    magnetismAnimationRef.current?.kill()

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle)
        },
      })
    })

    particlesRef.current = []
  }, [])

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) {
      return
    }

    if (!particlesInitializedRef.current) {
      initializeParticles()
    }

    memoizedParticlesRef.current.forEach((particle, index) => {
      const timeoutId = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) {
          return
        }

        const clone = particle.cloneNode(true)
        cardRef.current.appendChild(clone)
        particlesRef.current.push(clone)

        gsap.fromTo(
          clone,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
        )

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true,
        })
      }, index * 100)

      timeoutsRef.current.push(timeoutId)
    })
  }, [initializeParticles])

  useEffect(() => {
    if (!cardRef.current || disableAnimations) {
      return
    }

    const element = cardRef.current

    const handleMouseEnter = () => {
      isHoveredRef.current = true
      setIsCardHovered(true)
      animateParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000,
        })
      }
    }

    const handleMouseLeave = () => {
      isHoveredRef.current = false
      setIsCardHovered(false)
      clearAllParticles()

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseMove = (event) => {
      if (!enableTilt && !enableMagnetism) {
        return
      }

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        })
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05
        const magnetY = (y - centerY) * 0.05
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleClick = (event) => {
      if (!clickEffect) {
        return
      }

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )

      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `

      element.appendChild(ripple)
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      )
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('click', handleClick)

    return () => {
      isHoveredRef.current = false
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('click', handleClick)
      clearAllParticles()
    }
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ])

  return (
    <article
      ref={cardRef}
      className={`${className} magic-bento-particle-container`}
      style={{
        backgroundColor: card.color,
        '--glow-color': glowColor,
      }}
      data-cursor="interactive"
    >
      <CardBody
        card={card}
        isActive={isCardHovered}
        disableAnimations={disableAnimations}
      />
    </article>
  )
}

const StaticInteractiveCard = ({
  card,
  className,
  disableAnimations = false,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = false,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef(null)
  const [isCardHovered, setIsCardHovered] = useState(false)

  useEffect(() => {
    if (!cardRef.current || disableAnimations) {
      return
    }

    const element = cardRef.current

    const handleMouseMove = (event) => {
      if (!enableTilt && !enableMagnetism) {
        return
      }

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000,
        })
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05
        const magnetY = (y - centerY) * 0.05
        gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseLeave = () => {
      setIsCardHovered(false)

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    const handleMouseEnter = () => {
      setIsCardHovered(true)
    }

    const handleClick = (event) => {
      if (!clickEffect) {
        return
      }

      const rect = element.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height),
      )

      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `

      element.appendChild(ripple)
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove(),
        },
      )
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('click', handleClick)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('click', handleClick)
    }
  }, [disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor])

  return (
    <article
      ref={cardRef}
      className={className}
      style={{
        backgroundColor: card.color,
        '--glow-color': glowColor,
      }}
      data-cursor="interactive"
    >
      <CardBody
        card={card}
        isActive={isCardHovered}
        disableAnimations={disableAnimations}
      />
    </article>
  )
}

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef(null)

  useEffect(() => {
    if (disableAnimations || !enabled || !gridRef?.current) {
      return
    }

    const spotlight = document.createElement('div')
    spotlight.className = 'magic-bento-global-spotlight'
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, rgba(${glowColor}, 0.08) 15%, rgba(${glowColor}, 0.04) 25%, rgba(${glowColor}, 0.02) 40%, rgba(${glowColor}, 0.01) 65%, transparent 70%);
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `

    document.body.appendChild(spotlight)
    spotlightRef.current = spotlight

    const handleMouseMove = (event) => {
      if (!spotlightRef.current || !gridRef.current) {
        return
      }

      const section = gridRef.current.closest('.magic-bento-section')
      const rect = section?.getBoundingClientRect()
      const isInside =
        rect &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom

      const cards = gridRef.current.querySelectorAll('.magic-bento-card')

      if (!isInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
        cards.forEach((card) => card.style.setProperty('--glow-intensity', '0'))
        return
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius)
      let minDistance = Infinity

      cards.forEach((card) => {
        const rectCard = card.getBoundingClientRect()
        const centerX = rectCard.left + rectCard.width / 2
        const centerY = rectCard.top + rectCard.height / 2
        const distance =
          Math.hypot(event.clientX - centerX, event.clientY - centerY) -
          Math.max(rectCard.width, rectCard.height) / 2
        const effectiveDistance = Math.max(0, distance)
        minDistance = Math.min(minDistance, effectiveDistance)

        let glowIntensity = 0
        if (effectiveDistance <= proximity) {
          glowIntensity = 1
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
        }

        updateCardGlowProperties(
          card,
          event.clientX,
          event.clientY,
          glowIntensity,
          spotlightRadius,
        )
      })

      gsap.to(spotlightRef.current, {
        left: event.clientX,
        top: event.clientY,
        duration: 0.1,
        ease: 'power2.out',
      })

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gridRef.current
        ?.querySelectorAll('.magic-bento-card')
        .forEach((card) => card.style.setProperty('--glow-intensity', '0'))

      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current)
    }
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor])

  return null
}

const normalizeCard = (card) => ({
  color: card.color || '#120F17',
  title: card.title || 'Untitled',
  description: card.description || '',
  label: card.label || 'Item',
})

export default function MagicBento({
  cards = DEFAULT_CARD_DATA,
  className = '',
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) {
  const gridRef = useRef(null)
  const isMobile = useMobileDetection()
  const shouldDisableAnimations = disableAnimations || isMobile
  const safeCards = useMemo(() => cards.map(normalizeCard), [cards])

  return (
    <div className={`magic-bento-root ${className}`}>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <div className="magic-bento-grid magic-bento-section" ref={gridRef}>
        {safeCards.map((card, index) => {
          const baseClassName = `magic-bento-card group ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`

          if (enableStars) {
            return (
              <ParticleCard
                key={`${card.title}-${index}`}
                card={card}
                className={baseClassName}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              />
            )
          }

          return (
            <StaticInteractiveCard
              key={`${card.title}-${index}`}
              card={card}
              className={baseClassName}
              disableAnimations={shouldDisableAnimations}
              glowColor={glowColor}
              enableTilt={enableTilt}
              clickEffect={clickEffect}
              enableMagnetism={enableMagnetism}
            />
          )
        })}
      </div>
    </div>
  )
}
