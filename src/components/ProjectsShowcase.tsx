import { useLayoutEffect, useRef } from 'react'
import type { ProjectItem } from '@/lib/data'
import { ensureGsap } from '@/lib/gsap'

interface ProjectsShowcaseProps {
  projects: ProjectItem[]
}

function SpriteIcon({ id }: { id: string }) {
  return (
    <svg
      className="block h-4 w-4 shrink-0"
      style={{ height: '1rem', width: '1rem' }}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#${id}`} />
    </svg>
  )
}

function ProjectPreview({ project }: { project: ProjectItem }) {
  if (project.liveUrl) {
    return (
      <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-neon/25 bg-obsidian shadow-neon">
        <div className="flex items-center gap-2 border-b border-chalk/10 bg-white/[0.04] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-electric" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon" />
          <span className="h-2.5 w-2.5 rounded-full bg-chalk/35" />
          <span className="ml-3 truncate text-xs text-chalk/50">
            {project.liveUrl}
          </span>
        </div>
        <iframe
          title={`${project.name} live preview`}
          src={project.liveUrl}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          className="h-[26rem] w-full bg-obsidian"
        />
      </div>
    )
  }

  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-chalk/10 bg-white/[0.035] p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/60 to-transparent" />
      <div className="flex items-center justify-between border-b border-chalk/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-neon">
            {project.preview.eyebrow}
          </p>
          <h3 className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight text-chalk">
            {project.preview.title}
          </h3>
        </div>
        <div className="hidden h-16 w-16 place-items-center rounded-2xl border border-electric/30 bg-electric/10 text-2xl font-semibold text-electric md:grid">
          {project.name.slice(0, 1)}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {project.preview.metrics.map((metric) => (
          <div
            key={metric}
            className="border border-chalk/10 bg-obsidian/70 px-4 py-5"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-chalk">
              {metric}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 font-mono text-sm text-chalk/70">
        {project.highlights.map((highlight, index) => (
          <p key={highlight} className="border-l border-neon/50 pl-4">
            <span className="text-electric">0{index + 1}</span> {highlight}
          </p>
        ))}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <article className="project-card grid gap-8 border-b border-chalk/10 py-14 last:border-b-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)] lg:items-center">
      <div>
        <p className="text-xs uppercase tracking-[0.36em] text-electric">
          {project.tagline}
        </p>
        <h3 className="mt-4 font-display text-4xl font-semibold tracking-tight text-chalk md:text-5xl">
          {project.name}
        </h3>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-chalk/70 md:text-lg">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-chalk/15 px-3 py-1 text-xs uppercase tracking-[0.16em] text-chalk/70"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="interactive"
              className="inline-flex items-center gap-2 rounded-full border border-neon/70 bg-neon px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-obsidian transition-shadow hover:shadow-neon"
            >
              <SpriteIcon id="external-link-icon" />
              Open Live
            </a>
          ) : null}
          <a
            href={project.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="interactive"
            className="inline-flex items-center gap-2 rounded-full border border-chalk/25 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-chalk transition-colors hover:border-electric hover:text-electric"
          >
            <SpriteIcon id="github-line-icon" />
            View Code
          </a>
        </div>
      </div>

      <ProjectPreview project={project} />
    </article>
  )
}

export default function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
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

    const { gsap, ScrollTrigger } = ensureGsap()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.project-card',
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.14,
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
          },
        },
      )
      ScrollTrigger.refresh()
    }, section)

    return () => {
      ctx.revert()
    }
  }, [projects])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden border-b border-chalk/10 px-6 py-24 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs uppercase tracking-[0.42em] text-electric">
            Deployed Work
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-chalk md:text-6xl">
            Projects you can inspect, preview, or trace through code.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-chalk/65">
            Live deployments open inside the page when available. Research,
            desktop, and backend-heavy systems keep the focus on the GitHub
            implementation.
          </p>
        </div>

        <div className="mt-10">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
