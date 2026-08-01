import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createPinnedHttpsTransport,
  readResponseBody,
  requestWithTimeout,
  resolveDnsAddresses,
  validateAcquisitionUrl,
} from '../data'
import { stableJson } from '../generate/serialization'
import {
  evaluateProvisionalWatch,
  validateProvisionalWatchConfig,
  type ProvisionalWatchFetch,
} from './provisionalWatch'

/**
 * Run the provisional-verification watch: fetch each reviewed watch page live and report which
 * sentinel strings have appeared. The command only writes a report and notification bodies; the
 * workflow decides whether to post them, and nothing here touches accepted data.
 */

interface Arguments {
  configPath: string
  outputDirectory: string
}

const ALLOWED_HOSTS = ['wahapedia.ru', 'raw.githubusercontent.com']

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseProvisionalWatchArguments = (values: string[]): Arguments => {
  const parsed: Arguments = {
    configPath: path.join('data', 'aos4', 'radar', 'provisional-watch.json'),
    outputDirectory: path.join('.cache', 'aos4', 'radar', 'provisional-watch'),
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--config') {
      parsed.configPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.outputDirectory = nextValue(values, index, value)
      index += 1
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  return parsed
}

const run = async (): Promise<void> => {
  const arguments_ = parseProvisionalWatchArguments(process.argv.slice(2))
  const config = validateProvisionalWatchConfig(
    JSON.parse(await readFile(path.resolve(arguments_.configPath), 'utf8'))
  )
  const transport = createPinnedHttpsTransport()
  const fetch: ProvisionalWatchFetch = async url => {
    const validated = await validateAcquisitionUrl(url, {
      allowedHosts: ALLOWED_HOSTS,
      resolveAddresses: resolveDnsAddresses,
    })
    const response = await requestWithTimeout(
      transport,
      {
        url: validated.url,
        headers: { 'accept-encoding': 'identity' },
        approvedAddresses: validated.approvedAddresses,
      },
      60_000
    )
    const bytes = await readResponseBody(response, 32 * 1024 * 1024)
    return { status: response.status, body: new TextDecoder('utf-8', { fatal: false }).decode(bytes) }
  }
  const report = await evaluateProvisionalWatch(config, {
    fetch,
    now: () => new Date().toISOString(),
  })
  const outputDirectory = path.resolve(arguments_.outputDirectory)
  await mkdir(outputDirectory, { recursive: true })
  await writeFile(path.join(outputDirectory, 'report.json'), stableJson(report), 'utf8')
  for (const notification of report.notifications) {
    await writeFile(
      path.join(outputDirectory, `issue-${notification.issueNumber}-comment.md`),
      notification.body,
      'utf8'
    )
  }
  report.findings.forEach(finding => {
    console.log(
      `${finding.id}: ${finding.availability}, ${finding.found.length}/${
        finding.found.length + finding.missing.length
      } sentinels present`
    )
  })
  console.log(
    `Provisional watch report: ${path.join(outputDirectory, 'report.json')} (${
      report.notifications.length
    } notification(s))`
  )
  // An inaccessible watch page is an operational failure: the watch did not actually observe.
  if (report.findings.some(finding => finding.availability === 'inaccessible')) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
