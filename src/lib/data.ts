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

export async function loadPortfolioData() {
  const [skillsModule, resumeModule] = await Promise.all([
    import('@data/skills.json'),
    import('@data/resume.json'),
  ])

  return {
    skills: skillsModule.default as SkillItem[],
    resume: resumeModule.default as ResumeItem[],
  }
}
