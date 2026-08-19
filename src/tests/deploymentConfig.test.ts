import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { inspectDeploymentArtifact, validateDeploymentEndpoints } from '../../scripts/deploymentConfig'
import { afterEach, describe, expect, it } from 'vitest'
import { bashCommand, bashPath } from './support/bashHarness'

const validEndpoints = {
  armyApiUrl: 'https://army123.execute-api.us-east-1.amazonaws.com',
  subscriptionApiUrl: 'https://subs123.execute-api.us-east-1.amazonaws.com',
}

const shellQuote = (value: string) => `'${value.replaceAll("'", `'"'"'`)}'`

describe('production deployment configuration', () => {
  const temporaryDirectories: string[] = []

  afterEach(() => {
    temporaryDirectories.splice(0).forEach(directory => rmSync(directory, { recursive: true }))
  })

  it('accepts distinct production HTTP API endpoints', () => {
    expect(validateDeploymentEndpoints(validEndpoints)).toEqual(validEndpoints)
  })

  it.each([
    ['', /VITE_ARMY_API_URL/],
    ['http://army123.execute-api.us-east-1.amazonaws.com', /HTTPS/],
    ['https://localhost:3000', /production HTTP API/],
    ['https://subscription-api.invalid', /production HTTP API/],
    ['https://army123.execute-api.us-east-1.amazonaws.com/dev', /production stage/],
    ['https://army123.execute-api.eu-west-1.amazonaws.com', /us-east-1/],
  ])('rejects an unsafe army endpoint %s', (armyApiUrl, expected) => {
    expect(() => validateDeploymentEndpoints({ ...validEndpoints, armyApiUrl })).toThrow(expected)
  })

  it('rejects a missing or reused subscription endpoint', () => {
    expect(() => validateDeploymentEndpoints({ ...validEndpoints, subscriptionApiUrl: '' })).toThrow(
      /VITE_SUBSCRIPTION_API_URL/
    )
    expect(() =>
      validateDeploymentEndpoints({
        ...validEndpoints,
        subscriptionApiUrl: validEndpoints.armyApiUrl,
      })
    ).toThrow(/distinct/)
  })

  it('requires both intended endpoints and no retired authorization material in the bundle', () => {
    const directory = mkdtempSync(join(tmpdir(), 'aos-reminders-deploy-'))
    temporaryDirectories.push(directory)
    writeFileSync(join(directory, 'index.js'), JSON.stringify(validEndpoints))

    expect(inspectDeploymentArtifact(directory, validEndpoints)).toMatchObject({ filesInspected: 1 })

    writeFileSync(
      join(directory, 'index.js'),
      `${JSON.stringify(validEndpoints)};const request={authKey:'retired'}`
    )
    expect(() => inspectDeploymentArtifact(directory, validEndpoints)).toThrow(/retired authorization/)
  })

  it('defines one fail-closed release preparation contract', () => {
    const preparation = readFileSync(join(process.cwd(), 'scripts', 'prepare-production-release.sh'), 'utf8')

    expect(preparation).toMatch(/set -euo pipefail/)
    for (const command of [
      'yarn release:validate-config',
      'yarn lint',
      'yarn data:aos4:verify:beta',
      'yarn build',
      'yarn test --run',
      'yarn release:inspect-artifact',
    ]) {
      expect(preparation, `${command} is present`).toContain(command)
    }
    expect(preparation).not.toContain('yarn tsc --noEmit')
  })

  it('parallelizes independent release gates without testing an incomplete build', () => {
    const directory = mkdtempSync(join(tmpdir(), 'aos-reminders-release-preparation-'))
    temporaryDirectories.push(directory)
    const fakeBin = join(directory, 'bin')
    const logPath = join(directory, 'gates.log')
    mkdirSync(fakeBin)

    const fakeYarn = join(fakeBin, 'yarn')
    writeFileSync(
      fakeYarn,
      `#!/usr/bin/env bash
set -euo pipefail

# The gates under test run three at a time, so three copies of this stub append to one log at once.
# That is only safe where O_APPEND is atomic. On Linux and macOS it is, which is why CI never saw
# this; under WSL the log sits on a DrvFs mount of the Windows drive, where concurrent appends
# overwrite each other -- measured at five of eight lines lost. The surviving log then showed phase
# two starting before phase one finished and failed the ordering assertion, blaming the release
# script for a defect in the harness. flock makes the append atomic on every filesystem; the
# fallback keeps this working anywhere flock is absent, which is exactly where it is not needed.
log_gate() {
  if command -v flock >/dev/null 2>&1; then
    exec 9>>"$RELEASE_GATE_LOG"
    flock 9
    printf '%s\\n' "$1" >&9
    exec 9>&-
  else
    printf '%s\\n' "$1" >> "$RELEASE_GATE_LOG"
  fi
}

log_gate "start:$*"
if [[ "\${RELEASE_FAIL_GATE:-}" == "$*" ]]; then
  exit 23
fi
case "$*" in
  'lint' | 'data:aos4:verify:beta' | 'build' | 'test --run' | 'release:inspect-artifact') sleep 1 ;;
esac
log_gate "end:$*"
`,
      'utf8'
    )
    chmodSync(fakeYarn, 0o755)

    const fakeBinPath = bashPath(fakeBin)
    const result = spawnSync(
      bashCommand(),
      [
        '-c',
        `chmod +x ${shellQuote(`${fakeBinPath}/yarn`)}; ` +
          `PATH=${shellQuote(fakeBinPath)}:/usr/local/bin:/usr/bin:/bin ` +
          `RELEASE_GATE_LOG=${shellQuote(bashPath(logPath))} bash scripts/prepare-production-release.sh`,
      ],
      { cwd: process.cwd(), encoding: 'utf8' }
    )

    expect(result.status, result.stderr).toBe(0)
    const log = readFileSync(logPath, 'utf8').trim().split('\n')
    expect(log.slice(0, 2)).toEqual(['start:release:validate-config', 'end:release:validate-config'])

    const phaseOne = ['lint', 'data:aos4:verify:beta', 'build']
    const firstPhaseOneEnd = Math.min(...phaseOne.map(gate => log.indexOf(`end:${gate}`)))
    expect(phaseOne.every(gate => log.indexOf(`start:${gate}`) < firstPhaseOneEnd)).toBe(true)

    const lastPhaseOneEnd = Math.max(...phaseOne.map(gate => log.indexOf(`end:${gate}`)))
    const phaseTwo = ['test --run', 'release:inspect-artifact']
    expect(phaseTwo.every(gate => log.indexOf(`start:${gate}`) > lastPhaseOneEnd)).toBe(true)
    const firstPhaseTwoEnd = Math.min(...phaseTwo.map(gate => log.indexOf(`end:${gate}`)))
    expect(phaseTwo.every(gate => log.indexOf(`start:${gate}`) < firstPhaseTwoEnd)).toBe(true)

    writeFileSync(logPath, '', 'utf8')
    const failure = spawnSync(
      bashCommand(),
      [
        '-c',
        `chmod +x ${shellQuote(`${fakeBinPath}/yarn`)}; ` +
          `PATH=${shellQuote(fakeBinPath)}:/usr/local/bin:/usr/bin:/bin ` +
          `RELEASE_GATE_LOG=${shellQuote(bashPath(logPath))} ` +
          `RELEASE_FAIL_GATE=${shellQuote('data:aos4:verify:beta')} ` +
          `bash scripts/prepare-production-release.sh`,
      ],
      { cwd: process.cwd(), encoding: 'utf8' }
    )
    expect(failure.status).not.toBe(0)
    const failureLog = readFileSync(logPath, 'utf8')
    expect(failureLog).toContain('start:data:aos4:verify:beta')
    expect(failureLog).not.toContain('start:test --run')
    expect(failureLog).not.toContain('start:release:inspect-artifact')
    // Two runs of the real script, each with a one-second sleep per phase, plus the cost of spawning
    // bash twice -- under WSL that spawn is slow enough on its own to crowd out the default 5s.
  }, 30_000)

  it('runs release preparation before publication from every production entry point', () => {
    const entryPoints = [
      join(process.cwd(), '.github', 'workflows', 'deploy.yml'),
      join(process.cwd(), 'upload.sh'),
      join(process.cwd(), 'CI-build.sh'),
    ]

    for (const entryPoint of entryPoints) {
      const source = readFileSync(entryPoint, 'utf8')
      const installationIndex = source.indexOf('yarn install --frozen-lockfile')
      const preparationIndex = source.indexOf('bash scripts/prepare-production-release.sh')
      const publicationIndex = source.indexOf('bash scripts/deploy-production.sh')

      expect(installationIndex, `${entryPoint} installs dependencies`).toBeGreaterThan(-1)
      expect(preparationIndex, `${entryPoint} prepares the release`).toBeGreaterThan(-1)
      expect(publicationIndex, `${entryPoint} publishes the release`).toBeGreaterThan(-1)
      expect(installationIndex, `${entryPoint} installs before preparation`).toBeLessThan(preparationIndex)
      expect(preparationIndex, `${entryPoint} prepares before publication`).toBeLessThan(publicationIndex)
    }
  })

  it('deploys from master only', () => {
    const workflow = readFileSync(join(process.cwd(), '.github', 'workflows', 'deploy.yml'), 'utf8')

    expect(workflow).toMatch(/branches:\s*\n\s*- master/)
    expect(workflow).not.toMatch(/branches:\s*\[[^\]]*aos4-migration/)
  })

  it('pins the supported AWS credentials action release', () => {
    const workflow = readFileSync(join(process.cwd(), '.github', 'workflows', 'deploy.yml'), 'utf8')
    const actionRefs = [
      ...workflow.matchAll(/^\s+uses:\s+aws-actions\/configure-aws-credentials@(\S+)\s*$/gm),
    ].map(([, ref]) => ref)

    expect(actionRefs).toEqual(['v6.2.3'])
  })
})
