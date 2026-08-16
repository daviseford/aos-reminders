import { execFile } from 'node:child_process'
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const CERTIFICATIONS_ROOT = path.join('data', 'aos4', 'certifications')
const DEFAULT_CURRENT = path.join(CERTIFICATIONS_ROOT, 'beta.json')
const MAX_RETAINED_REFERENCES = 64
const CERTIFICATION_REFERENCE = /data\/aos4\/certifications\/[A-Za-z0-9._-]+/g

export interface CertificationPruneArguments {
  currentPath: string
  apply: boolean
}

export interface RetirableCertification {
  directory: string
  bytes: number
}

export interface CertificationRetentionPlan {
  current: string
  live: string[]
  retirable: RetirableCertification[]
}

interface CertificationPointer {
  schemaVersion: 1
  directory: string
}

export const parseCertificationPruneArguments = (arguments_: string[]): CertificationPruneArguments => {
  const parsed: CertificationPruneArguments = { currentPath: DEFAULT_CURRENT, apply: false }
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index]
    if (argument === '--apply') {
      parsed.apply = true
    } else if (argument === '--current') {
      const value = arguments_[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`${argument} requires a value`)
      parsed.currentPath = value
      index += 1
    } else {
      throw new Error(`Unknown argument: ${argument}`)
    }
  }
  return parsed
}

const repoPath = (repoRoot: string, relativePath: string): string => {
  const resolved = path.resolve(repoRoot, relativePath)
  if (resolved !== repoRoot && !resolved.startsWith(`${repoRoot}${path.sep}`)) {
    throw new Error(`Certification path escapes the repository: ${relativePath}`)
  }
  return resolved
}

const toPosixRelative = (repoRoot: string, resolved: string): string =>
  path.relative(repoRoot, resolved).split(path.sep).join('/')

// Resolves a directory under the certifications root, refusing anything that is not a direct
// child. Returns the repo-relative POSIX path, or undefined when the candidate is not a
// certification directory.
const certificationDirectoryPath = (repoRoot: string, relativePath: string): string | undefined => {
  const resolved = repoPath(repoRoot, relativePath)
  if (path.dirname(resolved) !== repoPath(repoRoot, CERTIFICATIONS_ROOT)) return undefined
  return toPosixRelative(repoRoot, resolved)
}

const directoryBytes = async (directory: string): Promise<number> => {
  let bytes = 0
  const entries = await readdir(directory, { withFileTypes: true })
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) bytes += await directoryBytes(entryPath)
    else bytes += (await stat(entryPath)).size
  }
  return bytes
}

// Collects every certification directory a live directory references. Deliberately conservative:
// any JSON text mention of another certification directory (overlay reuse source, execution
// record, summary, or any future reference shape) retains it. Over-retention is the safe failure
// mode for a pruning tool.
const referencedCertificationDirectories = async (repoRoot: string, directory: string): Promise<string[]> => {
  const referenced = new Set<string>()
  const entries = await readdir(path.join(repoPath(repoRoot, directory)))
  for (const entry of entries.filter(value => value.endsWith('.json'))) {
    const content = await readFile(path.join(repoPath(repoRoot, directory), entry), 'utf8')
    for (const match of content.match(CERTIFICATION_REFERENCE) ?? []) {
      const candidate = certificationDirectoryPath(repoRoot, match)
      if (candidate && candidate !== directory) referenced.add(candidate)
    }
  }
  return Array.from(referenced)
}

export const planCertificationRetention = async (
  repoRoot: string,
  currentPath: string = DEFAULT_CURRENT
): Promise<CertificationRetentionPlan> => {
  const pointer = JSON.parse(await readFile(repoPath(repoRoot, currentPath), 'utf8')) as CertificationPointer
  if (pointer.schemaVersion !== 1 || !pointer.directory || path.isAbsolute(pointer.directory)) {
    throw new Error(`Invalid certification pointer: ${currentPath}`)
  }
  const current = certificationDirectoryPath(repoRoot, pointer.directory)
  if (!current) {
    throw new Error(`Certification pointer is not a certification directory: ${pointer.directory}`)
  }

  const live: string[] = [current]
  const retained = new Set(live)
  const queue = [...live]
  while (queue.length) {
    if (retained.size > MAX_RETAINED_REFERENCES) {
      throw new Error(`Certification retention chain exceeds ${MAX_RETAINED_REFERENCES} directories`)
    }
    const directory = queue.shift() as string
    for (const referenced of await referencedCertificationDirectories(repoRoot, directory)) {
      if (retained.has(referenced)) continue
      retained.add(referenced)
      // A live directory may cite an ancestor that was already pruned; keep the reference
      // (harmless — it cannot appear in the on-disk listing) but only scan directories that
      // still exist.
      try {
        if ((await stat(repoPath(repoRoot, referenced))).isDirectory()) {
          live.push(referenced)
          queue.push(referenced)
        }
      } catch {
        // already pruned
      }
    }
  }

  const certificationsRoot = repoPath(repoRoot, CERTIFICATIONS_ROOT)
  const entries = await readdir(certificationsRoot, { withFileTypes: true })
  const retirable: RetirableCertification[] = []
  for (const entry of entries.filter(value => value.isDirectory())) {
    const directory = toPosixRelative(repoRoot, path.join(certificationsRoot, entry.name))
    if (!retained.has(directory)) {
      retirable.push({ directory, bytes: await directoryBytes(path.join(certificationsRoot, entry.name)) })
    }
  }
  retirable.sort((left, right) => left.directory.localeCompare(right.directory))
  return { current, live, retirable }
}

export const applyCertificationRetentionPlan = async (
  repoRoot: string,
  plan: CertificationRetentionPlan
): Promise<void> => {
  if (!plan.retirable.length) return
  await execFileAsync('git', ['rm', '-r', '-q', '--', ...plan.retirable.map(value => value.directory)], {
    cwd: repoRoot,
  })
}

const formatMegabytes = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const run = async (): Promise<void> => {
  const arguments_ = parseCertificationPruneArguments(process.argv.slice(2))
  const plan = await planCertificationRetention(process.cwd(), arguments_.currentPath)
  console.log('AoS 4 certification retention:')
  plan.live.forEach((directory, index) => {
    console.log(`  keep ${directory}${index === 0 ? ' (current)' : ''}`)
  })
  if (!plan.retirable.length) {
    console.log('  nothing to retire')
    return
  }
  const total = plan.retirable.reduce((sum, value) => sum + value.bytes, 0)
  plan.retirable.forEach(value =>
    console.log(`  retire ${value.directory} (${formatMegabytes(value.bytes)})`)
  )
  console.log(
    `  ${plan.retirable.length} superseded directories, ${formatMegabytes(total)} total` +
      (arguments_.apply ? '' : ' — rerun with --apply to delete them (git rm -r)')
  )
  if (arguments_.apply) {
    await applyCertificationRetentionPlan(process.cwd(), plan)
    console.log('  retired and staged (git rm -r); commit the deletions in their own PR')
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
