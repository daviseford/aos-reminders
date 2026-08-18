import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { stableCompactJson, stableJson } from '../generate/serialization'
import {
  decideRulesRadarAlarm,
  renderRulesRadarAlarmBody,
  renderRulesRadarAlarmSubject,
  type RulesRadarAlarmDecision,
} from './alarm'
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
  alarmOutputDirectory: string
  configPath: string
  notifyGitHub: boolean
}

export interface RulesRadarNotificationInput {
  report: RadarReport
  outputPath: string
  alarmOutputDirectory?: string
  notifyGitHub: boolean
  issueOptions: RulesRadarIssueOptions
  /** Owner/repository pair used to link the managed issue in alarm artifacts. */
  repository?: string
}

export interface RulesRadarNotificationDependencies {
  client?: RulesRadarGitHubClient
}

export interface RulesRadarNotificationResult {
  action: 'dry-run' | RulesRadarIssueSynchronization['action']
  report: RadarReport
  alarm: RulesRadarAlarmDecision
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
    alarmOutputDirectory: '',
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
    } else if (value === '--alarm-output') {
      parsed.alarmOutputDirectory = nextValue(values, index, value)
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
  if (!parsed.alarmOutputDirectory) parsed.alarmOutputDirectory = path.dirname(parsed.outputPath)
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

const writeNew = (filePath: string, contents: string): Promise<void> =>
  writeFile(filePath, contents, { encoding: 'utf8', flag: 'wx' })

const managedIssueUrl = (
  repository: string | undefined,
  issueNumber: number | undefined
): string | undefined => {
  if (!repository || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || issueNumber === undefined) {
    return undefined
  }
  return `https://github.com/${repository}/issues/${issueNumber}`
}

const writeAlarmArtifacts = async (
  directory: string,
  report: RadarReport,
  decision: RulesRadarAlarmDecision,
  issueUrl: string | undefined
): Promise<void> => {
  const writes: Promise<void>[] = [
    writeNew(
      path.join(directory, 'alarm.json'),
      stableJson({
        ...decision,
        ...(decision.send ? { subject: renderRulesRadarAlarmSubject(report) } : {}),
      })
    ),
  ]
  if (report.materialEventCount > 0) {
    writes.push(
      writeNew(path.join(directory, 'alarm-subject.txt'), `${renderRulesRadarAlarmSubject(report)}\n`),
      writeNew(path.join(directory, 'alarm-body.md'), renderRulesRadarAlarmBody(report, { issueUrl }))
    )
  }
  await Promise.all(writes)
}

export const runRulesRadarNotification = async (
  input: RulesRadarNotificationInput,
  dependencies: RulesRadarNotificationDependencies = {}
): Promise<RulesRadarNotificationResult> => {
  const report = validateRulesRadarReport(input.report)
  if (input.notifyGitHub && !dependencies.client) {
    throw new Error('A GitHub client is required when notification is enabled')
  }
  const alarmOutputDirectory = input.alarmOutputDirectory ?? path.dirname(input.outputPath)
  await writeNew(input.outputPath, renderManagedRulesRadarIssueBody(report))
  if (!input.notifyGitHub) {
    // A report-only run is evidence gathering, not a signal: the alarm never sends.
    const alarm = { ...decideRulesRadarAlarm(null, report), send: false, reason: 'report-only dry run' }
    await writeAlarmArtifacts(alarmOutputDirectory, report, alarm, undefined)
    return {
      action: 'dry-run',
      report,
      alarm,
      operationalFailure: report.operationalEventCount > 0,
    }
  }
  const synchronization = await synchronizeRulesRadarIssue(report, dependencies.client!, input.issueOptions)
  const alarm = decideRulesRadarAlarm(synchronization.previousReport, synchronization.report)
  await writeAlarmArtifacts(
    alarmOutputDirectory,
    synchronization.report,
    alarm,
    managedIssueUrl(input.repository, synchronization.issue?.number)
  )
  return {
    action: synchronization.action,
    report: synchronization.report,
    alarm,
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
      alarmOutputDirectory: path.resolve(rootPath, arguments_.alarmOutputDirectory),
      notifyGitHub: arguments_.notifyGitHub,
      issueOptions: {
        assignee: config.github.assignee,
        labels: config.github.labels,
      },
      repository: config.github.repository,
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
