// @vitest-environment node

import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'

const repoRoot = process.cwd()
const bashPath = (path: string) => {
  if (process.platform !== 'win32') return path

  const match = path.match(/^([A-Za-z]):\\(.*)$/)
  if (!match) throw new Error(`Cannot convert ${path} to a WSL path`)

  return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`
}

const readRepoFile = (path: string) => readFileSync(join(repoRoot, path), 'utf8')
const shellQuote = (value: string) => `'${value.replaceAll("'", `'"'"'`)}'`

describe('production deployment contract', () => {
  const temporaryDirectories: string[] = []

  afterEach(() => {
    temporaryDirectories.splice(0).forEach(directory => rmSync(directory, { recursive: true }))
  })

  const createHarness = () => {
    const directory = mkdtempSync(join(tmpdir(), 'aos-reminders-deployment-contract-'))
    temporaryDirectories.push(directory)

    const buildDirectory = join(directory, 'dist')
    const fakeBin = join(directory, 'bin')
    const logPath = join(directory, 'aws.log')
    const attemptsPath = join(directory, 'lock-attempts')
    mkdirSync(join(buildDirectory, 'assets'), { recursive: true })
    mkdirSync(fakeBin)

    for (const [path, contents] of [
      ['assets/current-123.js', 'current'],
      ['index.html', '<!doctype html>'],
      ['site.webmanifest', '{}'],
      ['service-worker.js', 'importScripts("sw-extras-abc123.js")'],
      ['sw-extras-abc123.js', 'const catalog = true'],
      ['favicon.ico', 'icon'],
    ]) {
      writeFileSync(join(buildDirectory, path), contents)
    }

    const fakeAws = join(fakeBin, 'aws')
    writeFileSync(
      fakeAws,
      `#!/usr/bin/env bash
set -euo pipefail
printf '%s\\n' "$*" >> "$AWS_LOG"

if [[ "$1 $2" == "s3api put-object" && "$*" == *"--if-none-match *"* ]]; then
  attempts=0
  [[ -f "$AWS_LOCK_ATTEMPTS" ]] && attempts=$(cat "$AWS_LOCK_ATTEMPTS")
  attempts=$((attempts + 1))
  printf '%s' "$attempts" > "$AWS_LOCK_ATTEMPTS"
  if [[ "\${AWS_LOCK_MODE:-available}" == "held" || ( "\${AWS_LOCK_MODE:-available}" == "recover" && "$attempts" -eq 1 ) ]]; then
    echo 'PreconditionFailed' >&2
    exit 255
  fi
  echo '"acquired-etag"'
  exit 0
fi

if [[ "$1 $2" == "s3api head-object" ]]; then
  printf '%s\\t%s\\t%s\\n' '"held-etag"' 'held-owner' '2026-08-01T00:00:00+00:00'
  exit 0
fi

if [[ "$1 $2" == "s3api list-objects-v2" ]]; then
  printf '%s\\n' "\${AWS_REMOTE_KEYS:-}"
  exit 0
fi

if [[ "$1 $2" == "s3api get-object-tagging" ]]; then
  if [[ "$*" == *"assets/already-retired.js"* ]]; then
    echo 'true'
  else
    echo 'false'
  fi
  exit 0
fi

echo '{}'
`,
      'utf8'
    )
    chmodSync(fakeAws, 0o755)

    const run = (extraEnvironment: Record<string, string> = {}) => {
      const environment = {
        AWS_LOCK_ATTEMPTS: bashPath(attemptsPath),
        AWS_LOG: bashPath(logPath),
        AWS_REMOTE_KEYS: 'assets/current-123.js\tassets/newly-superseded.js\tassets/already-retired.js',
        CF_DIST_ID: 'distribution-id',
        DEPLOY_OWNER: 'deployment-test',
        SITE_BUILD_DIR: bashPath(buildDirectory),
        SITE_S3: 's3://test-bucket',
        ...extraEnvironment,
      }
      const assignments = Object.entries(environment)
        .map(([key, value]) => `${key}=${shellQuote(value)}`)
        .join(' ')
      const fakeBinPath = bashPath(fakeBin)

      return spawnSync(
        'bash',
        [
          '-c',
          `chmod +x ${shellQuote(`${fakeBinPath}/aws`)}; PATH=${shellQuote(fakeBinPath)}:/usr/local/bin:/usr/bin:/bin ${assignments} bash scripts/deploy-production.sh`,
        ],
        { cwd: repoRoot, encoding: 'utf8' }
      )
    }

    return {
      log: () =>
        existsSync(logPath) && readFileSync(logPath, 'utf8').trim()
          ? readFileSync(logPath, 'utf8').trim().split('\n')
          : [],
      run,
    }
  }

  it('routes all three production entry points through one serialized contract', () => {
    const workflow = readRepoFile('.github/workflows/deploy.yml')
    const manual = readRepoFile('upload.sh')
    const standaloneCi = readRepoFile('CI-build.sh')

    expect(workflow).toMatch(
      /concurrency:\s*\n\s*group: production-deployment\s*\n\s*cancel-in-progress: false/
    )
    for (const caller of [workflow, manual, standaloneCi]) {
      expect(caller).toContain('scripts/deploy-production.sh')
      expect(caller).not.toMatch(/aws s3 (cp|sync)/)
    }
  })

  it('publishes dependencies first, the index next, and the service worker last', () => {
    const harness = createHarness()
    const result = harness.run()

    expect(result.status, result.stderr).toBe(0)
    const log = harness.log()
    const assetUpload = log.findIndex(line => line.startsWith('s3 cp ') && line.includes('/assets'))
    const extrasUpload = log.findIndex(
      line => line.startsWith('s3 cp ') && line.includes('sw-extras-abc123.js')
    )
    const indexUpload = log.findIndex(line => line.startsWith('s3 cp ') && line.includes('/index.html'))
    const workerUpload = log.findIndex(
      line => line.startsWith('s3 cp ') && line.includes('/service-worker.js')
    )

    expect(assetUpload).toBeGreaterThan(-1)
    expect(extrasUpload).toBeGreaterThan(assetUpload)
    expect(log[extrasUpload]).toContain('public, max-age=31536000, immutable')
    expect(indexUpload).toBeGreaterThan(extrasUpload)
    expect(workerUpload).toBeGreaterThan(indexUpload)
    expect(log.slice(workerUpload + 1).some(line => line.startsWith('s3 cp '))).toBe(false)
    expect(
      log.some(line => line.startsWith('s3api delete-object ') && line.includes('--if-match "acquired-etag"'))
    ).toBe(true)
  })

  it('keeps live assets ineligible and starts retirement exactly once', () => {
    const harness = createHarness()
    const result = harness.run()

    expect(result.status, result.stderr).toBe(0)
    const log = harness.log()
    expect(
      log.some(
        line =>
          line.startsWith('s3api put-object-tagging ') &&
          line.includes('assets/current-123.js') &&
          line.includes('retire,Value=false')
      )
    ).toBe(true)
    expect(
      log.some(line => line.startsWith('s3api copy-object ') && line.includes('assets/newly-superseded.js'))
    ).toBe(true)
    expect(
      log.some(line => line.startsWith('s3api copy-object ') && line.includes('assets/already-retired.js'))
    ).toBe(false)
  })

  it('fails closed before publication when another deploy holds the lock', () => {
    const harness = createHarness()
    const result = harness.run({ AWS_LOCK_MODE: 'held' })

    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('held-owner')
    const log = harness.log()
    expect(log.some(line => line.startsWith('s3 cp ') || line.startsWith('s3 sync '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api copy-object '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api put-object-tagging '))).toBe(false)
  })

  it('recovers a stale lock only with the exact owner and ETag', () => {
    const deniedHarness = createHarness()
    const denied = deniedHarness.run({
      AWS_LOCK_MODE: 'held',
      DEPLOY_LOCK_RECOVER_ETAG: '"wrong-etag"',
      DEPLOY_LOCK_RECOVER_OWNER: 'held-owner',
    })
    expect(denied.status).not.toBe(0)
    expect(deniedHarness.log().some(line => line.startsWith('s3api delete-object '))).toBe(false)

    const recoveredHarness = createHarness()
    const recovered = recoveredHarness.run({
      AWS_LOCK_MODE: 'recover',
      DEPLOY_LOCK_RECOVER_ETAG: '"held-etag"',
      DEPLOY_LOCK_RECOVER_OWNER: 'held-owner',
    })
    expect(recovered.status, recovered.stderr).toBe(0)
    expect(
      recoveredHarness
        .log()
        .some(line => line.startsWith('s3api delete-object ') && line.includes('--if-match "held-etag"'))
    ).toBe(true)
  })
})
