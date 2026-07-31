import { mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  RULES_RADAR_ISSUE_MARKER,
  createRadarLane,
  createRadarReport,
  parseRulesRadarNotifyArguments,
  renderRulesRadarIssueBody,
  runRulesRadarNotification,
  type RulesRadarGitHubClient,
  type RulesRadarGitHubComment,
  type RulesRadarGitHubIssue,
} from '../../aos4/radar'

const temporaryDirectories: string[] = []
const observedAt = '2026-07-29T20:00:00.000Z'

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map(directory => rm(directory, { recursive: true, force: true }))
  )
})

describe('AoS 4 Rules Radar notification command', () => {
  it('defaults to a mutation-free dry run', () => {
    expect(parseRulesRadarNotifyArguments(['--report', 'report.json'])).toEqual({
      reportPath: 'report.json',
      outputPath: 'managed-issue-body.md',
      configPath: path.join('data', 'aos4', 'radar', 'config.json'),
      notifyGitHub: false,
    })
    expect(() => parseRulesRadarNotifyArguments([])).toThrow(/--report/)
  })

  it('writes the exact deterministic report body inside the managed envelope', async () => {
    const directory = await temporaryDirectory()
    const report = createRadarReport([createRadarLane('games-workshop', observedAt, [])])
    const client = new MutationRejectingClient()
    const outputPath = path.join(directory, 'managed.md')

    const result = await runRulesRadarNotification(
      {
        report,
        outputPath,
        notifyGitHub: false,
        issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
      },
      { client }
    )

    const body = await readFile(outputPath, 'utf8')
    expect(result.action).toBe('dry-run')
    expect(body).toContain(RULES_RADAR_ISSUE_MARKER)
    expect(body).toContain(renderRulesRadarIssueBody(report))
    expect(client.calls).toBe(0)
  })

  it('requires an injected GitHub client before enabling mutations', async () => {
    const directory = await temporaryDirectory()
    const report = createRadarReport([createRadarLane('wahapedia', observedAt, [])])

    await expect(
      runRulesRadarNotification({
        report,
        outputPath: path.join(directory, 'managed.md'),
        notifyGitHub: true,
        issueOptions: { assignee: 'daviseford', labels: ['maintenance'] },
      })
    ).rejects.toThrow(/client/)
  })
})

class MutationRejectingClient implements RulesRadarGitHubClient {
  calls = 0

  async listIssues(): Promise<RulesRadarGitHubIssue[]> {
    this.calls += 1
    throw new Error('GitHub must not be called during a dry run')
  }

  async listComments(): Promise<RulesRadarGitHubComment[]> {
    throw new Error('unexpected')
  }

  async createIssue(): Promise<RulesRadarGitHubIssue> {
    throw new Error('unexpected')
  }

  async updateIssue(): Promise<RulesRadarGitHubIssue> {
    throw new Error('unexpected')
  }

  async createComment(): Promise<RulesRadarGitHubComment> {
    throw new Error('unexpected')
  }
}

const temporaryDirectory = async (): Promise<string> => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'aos4-radar-notify-'))
  temporaryDirectories.push(directory)
  return directory
}
