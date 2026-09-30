// Run: npm run check
import assert from 'node:assert/strict'
import { complete, run, type Block, type Seg } from './commands.ts'
import { projects } from './content.ts'

const text = (r: ReturnType<typeof run>) => JSON.stringify(r)
const grid = (r: ReturnType<typeof run>) => {
  assert.ok(Array.isArray(r) && 'grid' in r[0])
  return (r[0] as Extract<Block, { grid: unknown }>).grid
}
const headText = (s: Seg) => (typeof s === 'string' ? s : s.text)

assert.deepEqual(run('   '), [])
assert.equal(run('clear'), 'clear')
assert.match(text(run('nope')), /command not found: nope/)
assert.match(text(run('WHOAMI')), /Rathikindi Charan Teja/)
assert.match(text(run('whoami')), /"src":"\/portrait\.webp"/)
assert.match(text(run('whoami')), /\{"run":"help"\}/)

// ls projects == projects: every core project plus the infra/ directory
assert.deepEqual(run('ls projects'), run('projects'))
assert.deepEqual(grid(run('projects')).map((c) => headText(c.head)), [
  ...projects.filter((p) => p.group === 'core').map((p) => p.name),
  'infra/',
])
assert.deepEqual(grid(run('projects --live')).map((c) => headText(c.head)), ['DRIVEAWAY'])
assert.match(text(run('projects --bogus')), /unknown option/)
assert.equal(grid(run('ls infra/')).length, projects.filter((p) => p.group === 'infra').length)
assert.match(text(run('ls etc')), /No such file or directory/)

assert.match(text(run('open driveaway')), /driveaway\.charantejadev\.com/)
assert.doesNotMatch(text(run('open SIH2025')), /live {2}/)
assert.match(text(run('open')), /usage: open/)
assert.match(text(run('open nothing')), /no such project/)
assert.deepEqual(run('open infra'), run('ls infra'))

assert.equal(complete('who'), 'whoami ')
assert.equal(complete('op'), 'open ')
assert.equal(complete('open DRI'), 'open DRIVEAWAY')
assert.equal(complete('open sentinel'), 'open sentinel_face_v2')
assert.equal(complete('ls in'), 'ls infra/')
assert.equal(complete('zzz'), 'zzz')
// ambiguous: stop at the shared prefix
assert.equal(complete('c'), 'c')

// ponytail: guards content drift — every repo must be a real public CharanTeja-6825 URL
for (const p of projects) assert.match(p.repo, /^https:\/\/github\.com\/CharanTeja-6825\/[\w.-]+$/)

console.log('commands: ok')
