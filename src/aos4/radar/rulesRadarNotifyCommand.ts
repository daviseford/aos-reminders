import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableCompactJson } from '../generate/serialization'
import { createRadarReport } from './compare'
import { readRulesRadarConfig } from './config'
import {
  createGitHubIssueClient,
  renderManagedRulesRadarIssueBody,
  synchronizeRulesRadarIssue,
  type RulesRadarGitHubClient,
  type RulesRadarIssueOptions,
  type RulesRadarIssueSynchronization,
} from './githubIssue'
import type { RadarReport } from './model'

export interface RulesRadarNotifyArguments {
  reportPath: string
  outputPath: string
  configPath: string
  notifyGitHub: boolean
}

export interface RulesRadarNotificationInput {
  report: RadarReport
  outputPath: string
  notifyGitHub: boolean
  issueOptions: RulesRadarIssueOptions
}

export interface RulesRadarNotificationDependencies {
  client?: RulesRadarGitHubClient
}

export interface RulesRadarNotificationResult {
  action: 'dry-run' | RulesRadarIssueSynchronization['action']
  report: RadarReport
  operationalFailure: boolean
}

const nextValue = (values: string[], index: number, flag: string): string => {
  const value = values[index + 1]
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`)
  return value
}

export const parseRulesRadarNotifyArguments = (values: string[]): RulesRadarNotifyArguments => {
  const parsed: RulesRadarNotifyArguments = {
    reportPath: '',
    outputPath: 'managed-issue-body.md',
    configPath: path.join('data', 'aos4', 'radar', 'config.json'),
    notifyGitHub: false,
  }
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index]
    if (value === '--report') {
      parsed.reportPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--output') {
      parsed.outputPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--config') {
      parsed.configPath = nextValue(values, index, value)
      index += 1
    } else if (value === '--notify-github') {
      parsed.notifyGitHub = true
    } else {
      throw new Error(`Unknown argument: ${value}`)
    }
  }
  if (!parsed.reportPath) throw new Error('--report is required')
  return parsed
}

export const validateRulesRadarReport = (value: unknown): RadarReport => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as RadarReport).lanes)) {
    throw new Error('Rules Radar report has an incompatible schema')
  }
  const normalized = createRadarReport((value as RadarReport).lanes)
  if (stableCompactJson(value) !== stableCompactJson(normalized)) {
    throw new Error('Rules Radar report does not match its deterministic lane projection')
  }
  return normalized
}

export const runRulesRadarNotification = async (
  input: RulesRadarNotificationInput,
  dependencies: RulesRadarNotificationDependencies = {}
): Promise<RulesRadarNotificationResult> => {
  const report = validateRulesRadarReport(input.report)
  if (input.notifyGitHub && !dependencies.client) {
    throw new Error('A GitHub client is required when notification is enabled')
  }
  await writeFile(input.outputPath, renderManagedRulesRadarIssueBody(report), {
    encoding: 'utf8',
    flag: 'wx',
  })
  if (!input.notifyGitHub) {
    return {
      action: 'dry-run',
      report,
      operationalFailure: report.operationalEventCount > 0,
    }
  }
  const synchronization = await synchronizeRulesRadarIssue(report, dependencies.client!, input.issueOptions)
  return {
    action: synchronization.action,
    report: synchronization.report,
    operationalFailure: synchronization.report.operationalEventCount > 0,
  }
}

const run = async (): Promise<void> => {
  const arguments_ = parseRulesRadarNotifyArguments(process.argv.slice(2))
  const rootPath = process.cwd()
  const config = readRulesRadarConfig(path.resolve(rootPath, arguments_.configPath), rootPath)
  const report = validateRulesRadarReport(
    JSON.parse(await readFile(path.resolve(rootPath, arguments_.reportPath), 'utf8')) as unknown
  )
  const token = arguments_.notifyGitHub ? process.env.GITHUB_TOKEN : undefined
  if (arguments_.notifyGitHub && !token) {
    throw new Error('GITHUB_TOKEN is required when --notify-github is enabled')
  }
  const result = await runRulesRadarNotification(
    {
      report,
      outputPath: path.resolve(rootPath, arguments_.outputPath),
      notifyGitHub: arguments_.notifyGitHub,
      issueOptions: {
        assignee: config.github.assignee,
        labels: config.github.labels,
      },
    },
    {
      ...(token
        ? {
            client: createGitHubIssueClient({
              repository: config.github.repository,
              token,
            }),
          }
        : {}),
    }
  )
  if (result.operationalFailure) process.exitCode = 1
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run().catch(error => {
    console.error(error)
    process.exitCode = 1
  })
}
