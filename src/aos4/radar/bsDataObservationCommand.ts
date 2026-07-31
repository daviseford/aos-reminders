import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getHeader,
  readResponseBody,
  requestWithTimeout,
  createPinnedHttpsTransport,
  resolveDnsAddresses,
  validateAcquisitionUrl,
} from '../data'
import { stableJson } from '../generate/serialization'
import { readRulesRadarConfig } from './config'
import { observeBsDataRadar, type BsDataFetch, type BsDataRadarObserverResult } from './observers/bsData'

interface Arguments {
  configPath: string
  outputDirectory: string
  workflowUrl?: string
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseBsDataObservationArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    configPath: path.join('data', 'aos4', 'radar', 'config.json'),
    outputDirectory: path.join('.cache', 'aos4', 'radar', 'observation'),
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--config') {
      parsed.configPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.outputDirectory = nextValue(values, index, value)
      index += 1
    } else if (value === '--workflow-url') {
      parsed.workflowUrl = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  return parsed
}

export const runBsDataObservation = async (
  arguments_: Arguments,
  rootPath = process.cwd()
): Promise<BsDataRadarObserverResult> => {
  const config = readRulesRadarConfig(path.resolve(rootPath, arguments_.configPath), rootPath)
  const transport = createPinnedHttpsTransport()
  const fetch: BsDataFetch = async request => {
    const validated = await validateAcquisitionUrl(request.url, {
      allowedHosts: ['api.github.com'],
      resolveAddresses: resolveDnsAddresses,
    })
    const response = await requestWithTimeout(
      transport,
      {
        url: validated.url,
        headers: request.headers,
        approvedAddresses: validated.approvedAddresses,
      },
      30_000
    )
    const bytes = await readResponseBody(response, request.maxBytes)
    return {
      status: response.status,
      finalUrl: validated.url,
      headers: {
        ...(getHeader(response.headers, 'x-ratelimit-remaining')
          ? { 'x-ratelimit-remaining': getHeader(response.headers, 'x-ratelimit-remaining')! }
          : {}),
      },
      bytes,
    }
  }
  const result = await observeBsDataRadar(
    { config, workflowUrl: arguments_.workflowUrl },
    { now: () => new Date().toISOString(), fetch }
  )
  const outputDirectory = path.resolve(rootPath, arguments_.outputDirectory)
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(path.join(outputDirectory, 'bsdata-lane.json'), stableJson(result.lane), 'utf8')
  if (result.observation) {
    await writeFile(
      path.join(outputDirectory, 'bsdata-observation.json'),
      stableJson(result.observation),
      'utf8'
    )
  }
  return result
}

const run = async (): Promise<void> => {
  const result = await runBsDataObservation(parseBsDataObservationArguments(process.argv.slice(2)))
  if (result.lane.events.some(event => event.class === 'operational')) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
