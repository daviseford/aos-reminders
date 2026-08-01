import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inspectDeploymentArtifact, validateDeploymentEndpoints } from '../../scripts/deploymentConfig'
import { afterEach, describe, expect, it } from 'vitest'

const validEndpoints = {
  armyApiUrl: 'https://army123.execute-api.us-east-1.amazonaws.com',
  subscriptionApiUrl: 'https://subs123.execute-api.us-east-1.amazonaws.com',
}

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

  it('keeps every release gate before AWS mutation and deploys only master', () => {
    const workflow = readFileSync(join(process.cwd(), '.github', 'workflows', 'deploy.yml'), 'utf8')
    const publicationIndex = workflow.indexOf('bash scripts/deploy-production.sh')

    expect(workflow).toMatch(/branches:\s*\n\s*- master/)
    expect(workflow).not.toMatch(/branches:\s*\[[^\]]*aos4-migration/)
    for (const command of [
      'yarn release:validate-config',
      'yarn lint',
      'yarn test --run',
      'yarn data:aos4:verify:beta',
      'yarn tsc --noEmit',
      'yarn build',
      'yarn release:inspect-artifact',
    ]) {
      const commandIndex = workflow.indexOf(command)
      expect(commandIndex, `${command} is present`).toBeGreaterThan(-1)
      expect(commandIndex, `${command} runs before publication`).toBeLessThan(publicationIndex)
    }
  })
})
