import { ReactLenis } from 'lenis/react'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef, useState } from 'react'
import BentoGrid from '@/components/BentoGrid'
import ContactRevealFooter from '@/components/ContactRevealFooter'
import CustomCursor from '@/components/CustomCursor'
import HeroSection from '@/components/HeroSection'
import HorizontalTimeline from '@/components/HorizontalTimeline'
import ProfileCurvedLoop from '@/components/ProfileCurvedLoop'
import type { ResumeItem, SkillItem } from '@/lib/data'
import { loadPortfolioData } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'

interface PortfolioState {
  skills: SkillItem[]
  resume: ResumeItem[]
}

export default function Page() {
  const lenisRef = useRef<LenisRef | null>(null)
  const [portfolioState, setPortfolioState] = useState<PortfolioState>({
    skills: [],
    resume: [],
  })

  useEffect(() => {
    let cancelled = false

    const bootstrapData = async () => {
      const data = await loadPortfolioData()
      if (!cancelled) {
        setPortfolioState(data)
      }
    }

    void bootstrapData()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const { ScrollTrigger } = ensureGsap()
    let frameId = 0
    let dispose = () => {}

    const wireLenis = () => {
      const lenis = lenisRef.current?.lenis
      if (!lenis) {
        frameId = window.requestAnimationFrame(wireLenis)
        return
      }

      const onLenisScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onLenisScroll)
      ScrollTrigger.refresh()
      dispose = () => lenis.off('scroll', onLenisScroll)
    }

    wireLenis()
    return () => {
      window.cancelAnimationFrame(frameId)
      dispose()
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ lerp: 0.08, smoothWheel: true, wheelMultiplier: 0.85 }}
    >
      <CustomCursor />
      <main className="bg-obsidian text-chalk">
        <HeroSection />
        <ProfileCurvedLoop
          skills={portfolioState.skills}
          resume={portfolioState.resume}
        />
        <BentoGrid skills={portfolioState.skills} />
        <HorizontalTimeline
          entries={portfolioState.resume}
          resumeHref="/resume18mar2026.pdf"
        />
        <ContactRevealFooter />
      </main>
    </ReactLenis>
  )
}
