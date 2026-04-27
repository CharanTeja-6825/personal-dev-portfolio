import CurvedLoop from '@/components/CurvedLoop'
import type { ResumeItem, SkillItem } from '@/lib/data'

interface ProfileCurvedLoopProps {
  resume: ResumeItem[]
  skills: SkillItem[]
}

const fallbackHighlights = [
  'Rathikindi Charan Teja',
  'Full-Stack Developer',
  'DevOps Engineer',
  'React',
  'Java',
  'Spring Boot',
  'Docker',
  'Jenkins',
  'CI/CD',
  '10+ Projects Completed',
]

export default function ProfileCurvedLoop({
  resume,
  skills,
}: ProfileCurvedLoopProps) {
  const resumeRoles = resume.map((item) => item.role)
  const skillNames = skills.slice(0, 5).map((skill) => skill.name)
  const highlights =
    resumeRoles.length || skillNames.length
      ? ['Charan Teja', ...resumeRoles, ...skillNames, 'DevOps', 'CI/CD']
      : fallbackHighlights

  return (
    <section
      aria-label="Profile highlights"
      className="relative overflow-hidden border-b border-chalk/10 px-0 py-10 text-neon md:py-14"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/40 to-transparent" />
      <CurvedLoop
        marqueeText={`${highlights.join(' ✦ ')} ✦`}
        speed={1.4}
        curveAmount={260}
        direction="right"
        interactive
        className="font-display tracking-[0.08em]"
      />
    </section>
  )
}
