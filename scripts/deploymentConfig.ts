import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

export interface DeploymentEndpoints {
  armyApiUrl: string
  subscriptionApiUrl: string
}

const endpointNames = {
  armyApiUrl: 'VITE_ARMY_API_URL',
  subscriptionApiUrl: 'VITE_SUBSCRIPTION_API_URL',
} satisfies Record<keyof DeploymentEndpoints, string>

const productionApiHost = /^[a-z0-9-]+\.execute-api\.us-east-1\.amazonaws\.com$/i
const nonProductionStage = /\/(?:dev|development|local|preview|qa|staging|test)(?:\/|$)/i

const validateEndpoint = (name: string, value: string): string => {
  if (!value?.trim()) throw new Error(`${name} is required for a production build.`)

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error(`${name} must be an absolute URL.`)
  }

  if (url.protocol !== 'https:') throw new Error(`${name} must use HTTPS.`)
  if (!productionApiHost.test(url.hostname)) {
    throw new Error(`${name} must identify a production HTTP API in us-east-1.`)
  }
  if (url.username || url.password || url.port || url.search || url.hash) {
    throw new Error(`${name} cannot contain credentials, a port, query parameters, or a fragment.`)
  }
  if (nonProductionStage.test(url.pathname)) {
    throw new Error(`${name} cannot identify a non-production stage.`)
  }
  if (/placeholder|your-/i.test(value)) {
    throw new Error(`${name} cannot contain a placeholder.`)
  }

  return value.replace(/\/+$/, '')
}

export const validateDeploymentEndpoints = (endpoints: DeploymentEndpoints): DeploymentEndpoints => {
  const validated = Object.fromEntries(
    Object.entries(endpointNames).map(([key, name]) => [
      key,
      validateEndpoint(name, endpoints[key as keyof DeploymentEndpoints]),
    ])
  ) as unknown as DeploymentEndpoints

  if (validated.armyApiUrl === validated.subscriptionApiUrl) {
    throw new Error('Army and subscription API endpoints must be distinct.')
  }
  return validated
}

export const deploymentEndpointsFromEnvironment = (
  environment: NodeJS.ProcessEnv = process.env
): DeploymentEndpoints =>
  validateDeploymentEndpoints({
    armyApiUrl: environment.VITE_ARMY_API_URL || '',
    subscriptionApiUrl: environment.VITE_SUBSCRIPTION_API_URL || '',
  })

const artifactExtensions = new Set(['.css', '.html', '.js', '.json', '.webmanifest'])

const artifactFiles = (directory: string): string[] => {
  if (!statSync(directory).isDirectory()) throw new Error(`${directory} is not a build directory.`)
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return artifactFiles(path)
    const extension = entry.name.includes('.') ? `.${entry.name.split('.').pop()}` : ''
    return artifactExtensions.has(extension) ? [path] : []
  })
}

export const inspectDeploymentArtifact = (
  directory: string,
  endpoints: DeploymentEndpoints
): { filesInspected: number } => {
  const validated = validateDeploymentEndpoints(endpoints)
  const files = artifactFiles(directory)
  if (!files.length) throw new Error('The build artifact contains no inspectable files.')
  const contents = files.map(file => readFileSync(file, 'utf8')).join('\n')

  for (const [key, name] of Object.entries(endpointNames)) {
    const endpoint = validated[key as keyof DeploymentEndpoints]
    if (!contents.includes(endpoint)) throw new Error(`The build artifact does not contain ${name}.`)
  }
  if (/\bauthKey\b|SUBSCRIPTION_AUTH_KEY/.test(contents)) {
    throw new Error('The build artifact contains retired authorization material.')
  }

  return { filesInspected: files.length }
}
