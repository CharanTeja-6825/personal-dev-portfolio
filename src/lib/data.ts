export interface SkillItem {
  name: string
  category: string
  proficiency: string
  description: string
}

export interface ResumeItem {
  role: string
  company: string
  dates: string
  achievements: string[]
  techStack: string[]
}

export interface ProjectItem {
  name: string
  tagline: string
  description: string
  repositoryUrl: string
  readmeUrl: string
  liveUrl?: string
  techStack: string[]
  highlights: string[]
  preview: {
    eyebrow: string
    title: string
    metrics: string[]
  }
}

export async function loadPortfolioData() {
  const [skillsModule, resumeModule, projectsModule] = await Promise.all([
    import('@data/skills.json'),
    import('@data/resume.json'),
    import('@data/projects.json'),
  ])

  return {
    skills: skillsModule.default as SkillItem[],
    resume: resumeModule.default as ResumeItem[],
    projects: projectsModule.default as ProjectItem[],
  }
}
