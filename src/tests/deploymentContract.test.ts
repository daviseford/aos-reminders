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
const lifecyclePreflightQuery =
  '[length(Rules), length(Rules[0]), Rules[0].ID, Rules[0].Status,' +
  ' length(Rules[0].Filter), length(Rules[0].Filter.Tag), Rules[0].Filter.Tag.Key,' +
  ' Rules[0].Filter.Tag.Value, length(Rules[0].Expiration), Rules[0].Expiration.Days]'
const cloudFrontPreflightQuery =
  'DistributionConfig.[DefaultCacheBehavior.MinTTL, DefaultCacheBehavior.DefaultTTL,' +
  ' DefaultCacheBehavior.MaxTTL, DefaultCacheBehavior.CachePolicyId,' +
  ' DefaultCacheBehavior.ResponseHeadersPolicyId, CacheBehaviors.Quantity]'

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
    const retirementStatePath = join(directory, 'retired-immutable-keys.txt')
    mkdirSync(join(buildDirectory, 'assets'), { recursive: true })
    mkdirSync(fakeBin)

    for (const [path, contents] of [
      ['assets/current-123.js', 'current'],
      // Longer than the harness's PRECOMPRESS_THRESHOLD_BYTES so the pre-gzip path always runs.
      ['assets/aos4-catalog-data-abc123.js', `const catalogCorpus = ${'"x"'.repeat(64)}`],
      ['index.html', '<!doctype html>'],
      ['site.webmanifest', '{}'],
      ['service-worker.js', 'importScripts("sw-extras-abc123.js")'],
      ['sw-extras-abc123.js', 'const catalog = true'],
      ['workbox-abc123.js', 'const workbox = true'],
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

require_exact_option() {
  local contract="$1"
  local option="$2"
  local expected="$3"
  shift 3

  local actual=''
  local count=0
  while [[ "$#" -gt 0 ]]; do
    if [[ "$1" == "$option" ]]; then
      count=$((count + 1))
      actual="\${2:-}"
      shift 2
    else
      shift
    fi
  done

  if [[ "$count" -ne 1 || "$actual" != "$expected" ]]; then
    echo "Unexpected $contract $option argument" >&2
    exit 64
  fi
}

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

if [[ -n "\${AWS_FAIL_MATCH:-}" && "$*" == *"$AWS_FAIL_MATCH"* ]]; then
  echo "Injected AWS failure for $AWS_FAIL_MATCH" >&2
  exit 42
fi

if [[ "$1 $2" == "s3api get-bucket-lifecycle-configuration" ]]; then
  require_exact_option 'lifecycle preflight' '--query' ${shellQuote(lifecyclePreflightQuery)} "$@"
  require_exact_option 'lifecycle preflight' '--output' 'text' "$@"
  if [[ "\${AWS_LIFECYCLE_STATE:-valid}" == "missing" ]]; then
    echo 'NoSuchLifecycleConfiguration' >&2
    exit 254
  fi
  if [[ "\${AWS_LIFECYCLE_STATE:-valid}" == "malformed" ]]; then
    printf '%s\t%s\n' '1' '4'
    exit 0
  fi
  if [[ "\${AWS_LIFECYCLE_STATE:-valid}" == "invalid" ]]; then
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' '1' '4' 'retire-superseded-assets' 'Enabled' '1' '2' 'retire' 'false' '1' '30'
    exit 0
  fi
  if [[ "\${AWS_LIFECYCLE_STATE:-valid}" == "extra-prefix-rule" ]]; then
    # Projection for the valid named rule plus a second unsafe prefix-only expiration rule.
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' '2' '4' 'retire-superseded-assets' 'Enabled' '1' '2' 'retire' 'true' '1' '30'
    exit 0
  fi
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' '1' '4' 'retire-superseded-assets' 'Enabled' '1' '2' 'retire' 'true' '1' '30'
  exit 0
fi

if [[ "$1 $2" == "cloudfront get-distribution-config" ]]; then
  require_exact_option 'CloudFront preflight' '--query' ${shellQuote(cloudFrontPreflightQuery)} "$@"
  require_exact_option 'CloudFront preflight' '--output' 'text' "$@"
  if [[ "\${AWS_CLOUDFRONT_STATE:-valid}" == "malformed" ]]; then
    printf '%s\t%s\n' '0' '86400'
    exit 0
  fi
  if [[ "\${AWS_CLOUDFRONT_STATE:-valid}" == "invalid" ]]; then
    printf '%s\t%s\t%s\t%s\t%s\t%s\n' '60' '86400' '31536000' 'None' 'None' '0'
    exit 0
  fi
  if [[ "\${AWS_CLOUDFRONT_STATE:-valid}" == "ordered-behavior" ]]; then
    printf '%s\t%s\t%s\t%s\t%s\t%s\n' '0' '86400' '31536000' 'None' 'None' '1'
    exit 0
  fi
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' '0' '86400' '31536000' 'None' 'None' '0'
  exit 0
fi

if [[ "$1 $2" == "s3api head-object" ]]; then
  if [[ "$*" == *"CacheControl"* ]]; then
    printf '%s\\t%s\\n' 'public, max-age=31536000, immutable' 'text/javascript; charset=utf-8'
    exit 0
  fi
  printf '%s\\t%s\\t%s\\n' '"held-etag"' 'held-owner' '2026-08-01T00:00:00+00:00'
  exit 0
fi

# Real S3 refuses an in-place copy that changes nothing but tags; only the REPLACE metadata
# directive makes a self-copy legal. Enforce it so the script cannot regress to COPY.
if [[ "$1 $2" == "s3api copy-object" && "$*" == *"--metadata-directive COPY"* ]]; then
  echo 'An error occurred (InvalidRequest) when calling the CopyObject operation: illegal self-copy without metadata change' >&2
  exit 254
fi

if [[ "$1 $2" == "s3api list-objects-v2" ]]; then
  if [[ "$*" == *"--prefix assets/"* ]]; then
    printf '%s\\n' "\${AWS_REMOTE_ASSET_KEYS:-}"
  elif [[ "$*" == *"--prefix sw-extras-"* ]]; then
    printf '%s\\n' "\${AWS_REMOTE_EXTRAS_KEYS:-}"
  elif [[ "$*" == *"--prefix workbox-"* ]]; then
    printf '%s\\n' "\${AWS_REMOTE_WORKBOX_KEYS:-}"
  fi
  exit 0
fi

if [[ "$1 $2" == "s3 cp" && "$3" == s3://*/_deploy/retired-immutable-keys.txt ]]; then
  if [[ ! -f "$AWS_RETIREMENT_STATE" ]]; then
    echo 'NoSuchKey' >&2
    exit 254
  fi
  cp "$AWS_RETIREMENT_STATE" "$4"
  exit 0
fi

if [[ "$1 $2" == "s3 cp" && "$4" == s3://*/_deploy/retired-immutable-keys.txt ]]; then
  cp "$3" "$AWS_RETIREMENT_STATE"
  exit 0
fi

# The real CLI validates local cp sources before any request; a phantom build artifact in the
# script must fail here exactly as it would in production.
if [[ "$1 $2" == "s3 cp" && "$3" != s3://* && ! -e "$3" ]]; then
  echo "The user-provided path $3 does not exist." >&2
  exit 255
fi

if [[ "$1 $2" == "s3api get-object-tagging" ]]; then
  if [[ "$*" == *"assets/already-retired.js"* || "$*" == *"workbox-already-retired.js"* ]]; then
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
        AWS_REMOTE_ASSET_KEYS: 'assets/current-123.js\tassets/newly-superseded.js\tassets/already-retired.js',
        AWS_REMOTE_EXTRAS_KEYS: 'sw-extras-abc123.js\tsw-extras-old.js',
        // A retirement-eligible key deliberately sits last: an unterminated final line from the
        // key listing must still be processed, or the last object silently escapes retirement.
        AWS_REMOTE_WORKBOX_KEYS: 'workbox-abc123.js\tworkbox-already-retired.js\tworkbox-old.js',
        AWS_RETIREMENT_STATE: bashPath(retirementStatePath),
        CF_DIST_ID: 'distribution-id',
        DEPLOY_OWNER: 'deployment-test',
        PRECOMPRESS_THRESHOLD_BYTES: '100',
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
      buildDirectory,
      log: () =>
        existsSync(logPath) && readFileSync(logPath, 'utf8').trim()
          ? readFileSync(logPath, 'utf8').trim().split('\n')
          : [],
      retirementStatePath,
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

  it.each([
    ['the retirement lifecycle is missing', { AWS_LIFECYCLE_STATE: 'missing' }, /lifecycle/i],
    ['the retirement lifecycle response is malformed', { AWS_LIFECYCLE_STATE: 'malformed' }, /lifecycle/i],
    ['the retirement lifecycle is unsafe', { AWS_LIFECYCLE_STATE: 'invalid' }, /lifecycle/i],
    [
      'an additional unsafe lifecycle rule exists',
      { AWS_LIFECYCLE_STATE: 'extra-prefix-rule' },
      /lifecycle/i,
    ],
    ['the CloudFront response is malformed', { AWS_CLOUDFRONT_STATE: 'malformed' }, /CloudFront/i],
    ['CloudFront overrides revalidation', { AWS_CLOUDFRONT_STATE: 'invalid' }, /CloudFront/i],
    ['CloudFront has an ordered cache behavior', { AWS_CLOUDFRONT_STATE: 'ordered-behavior' }, /CloudFront/i],
  ])('fails before publication when %s', (_description, environment, expectedError) => {
    const harness = createHarness()
    const result = harness.run(environment)

    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(expectedError)
    const log = harness.log()
    expect(log.some(line => line.startsWith('s3 cp ') || line.startsWith('s3 sync '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api put-object '))).toBe(false)
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
    expect(
      log
        .slice(workerUpload + 1)
        .some(line => line.startsWith('s3 cp ') && !line.includes('_deploy/retired-immutable-keys.txt'))
    ).toBe(false)
    expect(
      log.some(line => line.startsWith('s3api delete-object ') && line.includes('--if-match "acquired-etag"'))
    ).toBe(true)
  })

  it('fails before publication when the build emits no workbox runtime', () => {
    const harness = createHarness()
    rmSync(join(harness.buildDirectory, 'workbox-abc123.js'))
    const result = harness.run()

    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(/workbox/i)
    const log = harness.log()
    expect(log.some(line => line.startsWith('s3 cp ') || line.startsWith('s3 sync '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api put-object '))).toBe(false)
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
      log.some(
        line =>
          line.startsWith('s3api put-object-tagging ') &&
          line.includes('workbox-abc123.js') &&
          line.includes('retire,Value=false')
      )
    ).toBe(true)
    expect(
      log.some(
        line =>
          line.startsWith('s3api put-object-tagging ') &&
          line.includes('sw-extras-abc123.js') &&
          line.includes('retire,Value=false')
      )
    ).toBe(true)
    const copiesFor = (key: string) =>
      log.filter(line => line.startsWith('s3api copy-object ') && line.includes(key))
    expect(copiesFor('assets/newly-superseded.js')).toHaveLength(1)
    expect(copiesFor('sw-extras-old.js')).toHaveLength(1)
    expect(copiesFor('workbox-old.js')).toHaveLength(1)
    expect(copiesFor('assets/already-retired.js')).toHaveLength(0)
    expect(copiesFor('workbox-already-retired.js')).toHaveLength(0)
    // The live build's own keys must never be tagged for retirement: the lifecycle rule would
    // delete them 30 days later. Without these, a membership check that always reported "not
    // current" would still pass every other assertion in this suite.
    expect(copiesFor('assets/current-123.js')).toHaveLength(0)
    expect(copiesFor('sw-extras-abc123.js')).toHaveLength(0)
    expect(copiesFor('workbox-abc123.js')).toHaveLength(0)
    log
      .filter(line => line.startsWith('s3api copy-object '))
      .forEach(line => {
        expect(line).toContain('--metadata-directive REPLACE')
        expect(line).toContain('public, max-age=31536000, immutable')
        expect(line).toContain('text/javascript; charset=utf-8')
      })
  })

  it('reuses the retired-key inventory instead of re-reading every historical object tag', () => {
    const harness = createHarness()
    const firstResult = harness.run()
    expect(firstResult.status, firstResult.stderr).toBe(0)
    const firstLogLength = harness.log().length
    writeFileSync(
      harness.retirementStatePath,
      `${readFileSync(harness.retirementStatePath, 'utf8')}assets/expired-and-removed.js\n`
    )

    const secondResult = harness.run()
    expect(secondResult.status, secondResult.stderr).toBe(0)
    const secondLog = harness.log().slice(firstLogLength)

    expect(
      secondLog.some(
        line =>
          line.startsWith('s3 cp s3://test-bucket/_deploy/retired-immutable-keys.txt ') &&
          line.includes('--only-show-errors')
      )
    ).toBe(true)
    expect(secondLog.some(line => line.startsWith('s3api get-object-tagging '))).toBe(false)
    expect(
      secondLog.filter(
        line => line.startsWith('s3api put-object-tagging ') && line.includes('retire,Value=false')
      )
    ).toHaveLength(4)
    expect(readFileSync(harness.retirementStatePath, 'utf8')).toContain('assets/newly-superseded.js')
    expect(readFileSync(harness.retirementStatePath, 'utf8')).not.toContain('assets/expired-and-removed.js')
  })

  it('fails closed before publication when the retired-key inventory contains an unmanaged key', () => {
    const harness = createHarness()
    writeFileSync(harness.retirementStatePath, 'index.html\n')

    const result = harness.run()

    expect(result.status).not.toBe(0)
    expect(result.stderr).toMatch(/retirement state/i)
    const log = harness.log()
    expect(log.some(line => line.includes('/assets --recursive'))).toBe(false)
    expect(
      log.some(line => line.startsWith('s3api delete-object ') && line.includes('--if-match "acquired-etag"'))
    ).toBe(true)
  })

  it('stores oversized scripts gzipped so CloudFront size limits cannot ship them raw', () => {
    const harness = createHarness()
    const result = harness.run()

    expect(result.status, result.stderr).toBe(0)
    const log = harness.log()
    const recursiveAssetsUpload = log.find(
      line => line.startsWith('s3 cp ') && line.includes('/assets --recursive')
    )
    expect(recursiveAssetsUpload).toBeDefined()
    expect(recursiveAssetsUpload).toContain('--exclude aos4-catalog-data-abc123.js')
    const compressedUpload = log.find(
      line =>
        line.startsWith('s3 cp ') &&
        line.includes('s3://test-bucket/assets/aos4-catalog-data-abc123.js') &&
        line.includes('--content-encoding gzip')
    )
    expect(compressedUpload).toBeDefined()
    expect(compressedUpload).toContain('public, max-age=31536000, immutable')
    expect(compressedUpload).toContain('text/javascript; charset=utf-8')
    expect(
      log.some(
        line =>
          line.startsWith('s3api put-object-tagging ') &&
          line.includes('assets/aos4-catalog-data-abc123.js') &&
          line.includes('retire,Value=false')
      )
    ).toBe(true)
  })

  it('force-copies unhashed public files with the moderate cache header', () => {
    const harness = createHarness()
    const result = harness.run()

    expect(result.status, result.stderr).toBe(0)
    const log = harness.log()
    const publicUpload = log.find(
      line =>
        line.startsWith('s3 cp ') && line.includes(' --recursive ') && line.includes('public, max-age=86400')
    )
    expect(publicUpload).toBeDefined()
    expect(log.some(line => line.startsWith('s3 sync '))).toBe(false)
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

  it('releases the lock and stops after a publication failure', () => {
    const harness = createHarness()
    const result = harness.run({ AWS_FAIL_MATCH: '/service-worker.js' })

    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('Injected AWS failure for /service-worker.js')
    const log = harness.log()
    const workerUpload = log.findIndex(
      line => line.startsWith('s3 cp ') && line.includes('/service-worker.js')
    )
    const lockRelease = log.findIndex(
      line =>
        line.startsWith('s3api delete-object ') &&
        line.includes('_deploy/production.lock') &&
        line.includes('--if-match "acquired-etag"')
    )

    expect(workerUpload).toBeGreaterThan(-1)
    expect(lockRelease).toBeGreaterThan(workerUpload)
    expect(log.some(line => line.startsWith('cloudfront create-invalidation '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api list-objects-v2 '))).toBe(false)
    expect(log.some(line => line.startsWith('s3api copy-object '))).toBe(false)
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
