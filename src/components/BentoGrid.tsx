import type { SkillItem } from '@/lib/data'
import MagicBento from '@/components/MagicBento'

interface BentoGridProps {
  skills: SkillItem[]
}

export default function BentoGrid({ skills }: BentoGridProps) {
  const cards = skills.slice(0, 6).map((skill) => ({
    color: '#120F17',
    title: skill.name,
    description: skill.description,
    label: skill.category,
  }))

  return (
    <section
      id="arsenal"
      className="relative overflow-hidden border-b border-chalk/10 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.42em] text-electric">
          The Arsenal
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-chalk md:text-6xl">
          Tools I use when quality and ship speed both matter.
        </h2>

        <div className="mt-16">
          <MagicBento
            cards={cards}
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt
            enableMagnetism
            clickEffect
            spotlightRadius={300}
            particleCount={12}
            glowColor="255, 0, 85"
          />
        </div>
      </div>
    </section>
  )
}
