// Every claim here is sourced from the resume PDF or the linked repo's README/code.

export type Project = {
  name: string
  summary: string
  about: string[]
  stack: string[]
  repo: string
  live?: string
  group: 'core' | 'infra'
}

const gh = (repo: string) => `https://github.com/CharanTeja-6825/${repo}`

export const profile = {
  name: 'Rathikindi Charan Teja',
  lede: 'Computer Science undergraduate focused on backend development, distributed systems and scalable applications.',
  // Built by scripts/portrait.py; the source photo is never shipped.
  portrait: { src: '/portrait.webp', alt: 'Photo of Rathikindi Charan Teja', width: 480, height: 674 },
}

export const contact = {
  email: 'rcharanteja2006@gmail.com',
  github: 'https://github.com/CharanTeja-6825',
  linkedin: 'https://www.linkedin.com/in/charan-teja-rathikindi/',
}

export const skills: Record<string, string[]> = {
  languages: ['java', 'c', 'python', 'javascript', 'typescript'],
  backend: ['spring-boot', 'fastapi', 'flask', 'react'],
  data: ['mongodb', 'postgresql', 'redis'],
  devops: ['docker', 'kubernetes', 'helm', 'ansible', 'jenkins', 'github-actions', 'aws'],
  'ai/ml': ['pytorch', 'computer-vision', 'model-evaluation'],
  core: ['data-structures', 'algorithms', 'os', 'dbms', 'oop'],
}

export const experience = [
  'Applied modular design, RESTful architecture and clean code practices while building scalable systems, cutting execution time by 25%.',
  'Integrated frontend, backend and DevOps workflows, and automated deployments with Jenkins and Docker to shorten delivery time.',
]

// Listed in C-locale `ls` order: uppercase before lowercase.
export const projects: Project[] = [
  {
    name: 'Awetales-Project',
    summary: 'target-speaker asr and diarization pipeline',
    about: [
      'Isolates a target speaker from multi-speaker audio and transcribes it with speaker labels.',
      'Pipeline: denoise, voice activity, overlap detection, separation, speaker id, asr, punctuation.',
      'WebSocket server for streaming; JSON output with timestamps and confidence scores.',
    ],
    stack: ['python', 'pytorch', 'whisper', 'pyannote', 'websocket'],
    repo: gh('Awetales-Project'),
    group: 'core',
  },
  {
    name: 'DRIVEAWAY',
    summary: 'car rental marketplace',
    about: [
      'Customer, dealer and admin roles with JWT auth and method-level access guards.',
      'Razorpay payments with server-side order creation and HMAC signature checks.',
      'Redis cache for listings; a cron scheduler expires stale bookings.',
      'Multi-stage Docker builds, Docker Compose, CI/CD to Docker Hub.',
    ],
    stack: ['java', 'spring-boot', 'react', 'mongodb', 'redis', 'docker'],
    repo: gh('DRIVEAWAY'),
    live: 'https://driveaway.charantejadev.com',
    group: 'core',
  },
  {
    name: 'SIH2025',
    summary: 'fair internship allocation engine',
    about: [
      'Smart India Hackathon: matches students to internships.',
      'Profiles and requirements are vectorised; PyTorch cosine similarity picks the best match.',
      'Fairness boosts for social category and aspirational districts.',
      'Flask matcher for checking a single applicant.',
    ],
    stack: ['python', 'pytorch', 'pandas', 'scikit-learn', 'flask'],
    repo: gh('SIH2025'),
    group: 'core',
  },
  {
    name: 'panoptic-segmentation',
    summary: 'real-time scene understanding',
    about: [
      'YOLOv8 segmentation with persistent object tracking.',
      'Scene memory plus a local Ollama LLM answers questions about what the camera saw.',
      'FastAPI and WebSocket backend; React dashboard with live counts and heatmaps.',
    ],
    stack: ['python', 'pytorch', 'yolov8', 'fastapi', 'ollama', 'react'],
    repo: gh('panoptic-segmentation'),
    group: 'core',
  },
  {
    name: 'sentinel_face_v2',
    summary: 'classroom attendance from video',
    about: [
      'Students register through a guided five-angle webcam capture.',
      'Faculty upload a classroom video; an RQ worker detects and matches faces with InsightFace.',
      'Embeddings live in PostgreSQL with pgvector; results are reviewed with evidence crops.',
      'Starts with one docker compose up; CPU-only by default.',
    ],
    stack: ['python', 'fastapi', 'postgresql', 'pgvector', 'redis', 'react', 'docker-compose'],
    repo: gh('sentinel_face_v2'),
    group: 'core',
  },
  {
    name: 'ALL_DOCKER_FILES',
    summary: 'dockerfiles and compose setups from every lab',
    about: ['Frontend, backend and full-stack images, with compose files for local and AWS runs.'],
    stack: ['docker', 'docker-compose'],
    repo: gh('ALL_DOCKER_FILES'),
    group: 'infra',
  },
  {
    name: 'DOCKER-AWS-FULLSTACK',
    summary: 'spring boot + react on aws with docker compose',
    about: ['Backend and nginx-served frontend images, orchestrated with docker compose on an AWS host.'],
    stack: ['docker', 'docker-compose', 'aws', 'nginx'],
    repo: gh('DOCKER-AWS-FULLSTACK'),
    group: 'infra',
  },
  {
    name: 'DevOps-Ansible-2300031964',
    summary: 'full-stack deployment with ansible',
    about: ['GitHub Actions builds and pushes arm64 and amd64 images for deployment with Ansible.'],
    stack: ['ansible', 'github-actions', 'docker'],
    repo: gh('DevOps-Ansible-2300031964'),
    group: 'infra',
  },
  {
    name: 'HELM-PRACTICE',
    summary: 'helm chart for a full-stack app',
    about: ['Chart with backend, frontend and MySQL deployments, an HPA, ingress and namespace.'],
    stack: ['helm', 'kubernetes', 'github-actions'],
    repo: gh('HELM-PRACTICE'),
    group: 'infra',
  },
  {
    name: 'Kubernetes_Project',
    summary: 'spring boot + react on kubernetes',
    about: ['Deployment and ingress manifests for a containerised Spring Boot API and React frontend.'],
    stack: ['kubernetes', 'docker', 'nginx'],
    repo: gh('Kubernetes_Project'),
    group: 'infra',
  },
  {
    name: 'jenkinsspringbootrepo',
    summary: 'spring boot deployed through jenkins',
    about: ['Maven-built Spring Boot service deployed from a Jenkins pipeline.'],
    stack: ['java', 'spring-boot', 'maven', 'jenkins'],
    repo: gh('jenkinsspringbootrepo'),
    group: 'infra',
  },
]
