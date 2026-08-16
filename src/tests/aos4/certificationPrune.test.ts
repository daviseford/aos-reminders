import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'
import {
  applyCertificationRetentionPlan,
  parseCertificationPruneArguments,
  planCertificationRetention,
} from '../../aos4/review'

const execFileAsync = promisify(execFile)

const CERTIFICATIONS = path.join('data', 'aos4', 'certifications')

const writeCertification = async (
  repoRoot: string,
  name: string,
  files: Record<string, string>
): Promise<void> => {
  const directory = path.join(repoRoot, CERTIFICATIONS, name)
  await mkdir(directory, { recursive: true })
  for (const [file, content] of Object.entries(files)) {
    await writeFile(path.join(directory, file), content, 'utf8')
  }
}

const writePointer = async (repoRoot: string, directory: string): Promise<void> => {
  await mkdir(path.join(repoRoot, CERTIFICATIONS), { recursive: true })
  await writeFile(
    path.join(repoRoot, CERTIFICATIONS, 'beta.json'),
    JSON.stringify({
      schemaVersion: 1,
      directory: `${CERTIFICATIONS.split(path.sep).join('/')}/${directory}`,
    }),
    'utf8'
  )
}

const git = (repoRoot: string, arguments_: string[]) => execFileAsync('git', arguments_, { cwd: repoRoot })

describe('certification retention pruning', () => {
  it('parses defaults and explicit arguments', () => {
    expect(parseCertificationPruneArguments([])).toEqual({
      currentPath: path.join('data', 'aos4', 'certifications', 'beta.json'),
      apply: false,
    })
    expect(parseCertificationPruneArguments(['--apply'])).toMatchObject({ apply: true })
    expect(parseCertificationPruneArguments(['--current', 'custom/pointer.json'])).toMatchObject({
      currentPath: 'custom/pointer.json',
    })
    expect(() => parseCertificationPruneArguments(['--current'])).toThrow('--current requires a value')
    expect(() => parseCertificationPruneArguments(['--bogus'])).toThrow('Unknown argument: --bogus')
  })

  it('keeps the current certification and its overlay ancestors, retiring the rest', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-prune-'))
    try {
      await writePointer(repoRoot, 'corpus-machine-r4')
      await writeCertification(repoRoot, 'corpus-machine-r4', {
        'manifest.json': '{"status":"pass"}',
        'reuse-index.json': JSON.stringify({
          reuseSource: { directory: 'data/aos4/certifications/corpus-machine-r3' },
        }),
      })
      await writeCertification(repoRoot, 'corpus-machine-r3', { 'manifest.json': '{"status":"pass"}' })
      await writeCertification(repoRoot, 'corpus-machine-r2', { 'summary.json': 'x'.repeat(2048) })
      await writeCertification(repoRoot, 'corpus-machine-r1', { 'summary.json': 'x'.repeat(1024) })

      const plan = await planCertificationRetention(repoRoot)

      expect(plan.current).toBe('data/aos4/certifications/corpus-machine-r4')
      expect(plan.live).toEqual([
        'data/aos4/certifications/corpus-machine-r4',
        'data/aos4/certifications/corpus-machine-r3',
      ])
      expect(plan.retirable.map(value => value.directory)).toEqual([
        'data/aos4/certifications/corpus-machine-r1',
        'data/aos4/certifications/corpus-machine-r2',
      ])
      expect(plan.retirable.find(value => value.directory.endsWith('r2'))?.bytes).toBeGreaterThanOrEqual(2048)
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('retains any certification directory mentioned by live evidence, not just overlay sources', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-prune-'))
    try {
      await writePointer(repoRoot, 'corpus-machine-r2')
      await writeCertification(repoRoot, 'corpus-machine-r2', {
        'results.json': '{"note":"supersedes data/aos4/certifications/corpus-machine-r1"}',
      })
      await writeCertification(repoRoot, 'corpus-machine-r1', { 'manifest.json': '{}' })
      await writeCertification(repoRoot, 'corpus-machine-r0', { 'manifest.json': '{}' })

      const plan = await planCertificationRetention(repoRoot)

      expect(plan.live).toContain('data/aos4/certifications/corpus-machine-r1')
      expect(plan.retirable.map(value => value.directory)).toEqual([
        'data/aos4/certifications/corpus-machine-r0',
      ])
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('tolerates references to directories that were already pruned', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-prune-'))
    try {
      await writePointer(repoRoot, 'corpus-machine-r2')
      await writeCertification(repoRoot, 'corpus-machine-r2', {
        'reuse-index.json': JSON.stringify({
          reuseSource: { directory: 'data/aos4/certifications/corpus-machine-r1' },
        }),
      })

      const plan = await planCertificationRetention(repoRoot)

      expect(plan.live).toEqual(['data/aos4/certifications/corpus-machine-r2'])
      expect(plan.retirable).toEqual([])
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('fails closed on a missing or escaping pointer', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-prune-'))
    try {
      await expect(planCertificationRetention(repoRoot)).rejects.toThrow()

      await writePointer(repoRoot, '../outside')
      await expect(planCertificationRetention(repoRoot)).rejects.toThrow(
        'Certification pointer is not a certification directory'
      )

      await writePointer(repoRoot, '../../../../outside')
      await expect(planCertificationRetention(repoRoot)).rejects.toThrow('escapes the repository')
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('stages retirable directories with git rm in apply mode', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-prune-'))
    try {
      await writePointer(repoRoot, 'corpus-machine-r2')
      await writeCertification(repoRoot, 'corpus-machine-r2', { 'manifest.json': '{}' })
      await writeCertification(repoRoot, 'corpus-machine-r1', { 'manifest.json': '{}' })
      await git(repoRoot, ['init', '-q'])
      await git(repoRoot, ['add', '-A'])
      await git(repoRoot, [
        '-c',
        'user.name=test',
        '-c',
        'user.email=test@example.com',
        'commit',
        '-qm',
        'seed',
      ])

      const plan = await planCertificationRetention(repoRoot)
      await applyCertificationRetentionPlan(repoRoot, plan)

      await expect(readdir(path.join(repoRoot, CERTIFICATIONS))).resolves.toEqual([
        'beta.json',
        'corpus-machine-r2',
      ])
      const status = await git(repoRoot, ['status', '--porcelain'])
      expect(status.stdout).toContain('D  data/aos4/certifications/corpus-machine-r1/manifest.json')
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })
})
