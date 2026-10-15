import { readFileSync } from 'node:fs'
import { access, mkdir, mkdtemp, readFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  balancedFreshShardGroups,
  defaultAdversarialReviewJobs,
  deterministicReviewerMetadata,
  parseAdversarialReviewArguments,
  runFreshWorkers,
} from '../../aos4/review/adversarialReviewCommand'
import { runAdversarialReviewWorkerTask } from '../../aos4/review/adversarialReviewWorkerCommand'
import { type ReviewPacketPair } from '../../aos4/review/packets'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  createReviewAssignment,
  createReviewPacket,
  serializeReviewRecord,
  type ReviewerResult,
} from '../../aos4/review/records'
import { writeCreateOnlyDirectory, writeCreateOnlyFilesDirectory } from '../../aos4/review/reviewWorkspace'
import type { SourceRecordId } from '../../aos4/domain'

const pair = (): ReviewPacketPair => {
  const sourceEvidence = [
    {
      sourceRecordId: `source-record:games-workshop:${'a'.repeat(64)}%3Apage%3A1` as SourceRecordId,
      recordChecksum: 'b'.repeat(64),
      locator: { kind: 'page' as const, page: 1 },
      authority: 'official' as const,
      excerptRef: `review-evidence:sha256:${'c'.repeat(64)}`,
      structuredValue: {
        applicationStatus: 'effective',
        disposition: 'applied-to-runtime',
        fact: {
          kind: 'unit',
          name: 'Fixture Unit',
          points: 100,
          unitSize: 1,
          baseSizes: ['25mm'],
          regimentOptions: [],
          notes: [],
        },
      },
    },
  ]
  const blindPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['official-fact'],
    sourceEvidence: sourceEvidence.map(evidence => ({
      sourceRecordId: evidence.sourceRecordId,
      recordChecksum: evidence.recordChecksum,
      locator: evidence.locator,
      authority: evidence.authority,
      excerptRef: evidence.excerptRef,
    })),
    generatedDestinations: [],
    rulesContextIds: [],
    blind: true,
  })
  const comparisonPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['official-fact'],
    sourceEvidence,
    generatedDestinations: [
      {
        path: 'data/aos4/catalog/official-battle-profiles.json',
        field: 'record',
        value: sourceEvidence[0].structuredValue,
      },
    ],
    rulesContextIds: [],
    blind: false,
  })
  return {
    pairKey: 'review-pair:parallel-fixture',
    candidateKey: 'official-record:parallel-fixture',
    category: 'official-record',
    factionIds: [],
    samplingMetadataChecksum: 'd'.repeat(64),
    calibration: false,
    countsTowardCoverage: true,
    blindDerivationRequired: true,
    blindPacket,
    comparisonPacket,
    evidence: [
      {
        ref: sourceEvidence[0].excerptRef,
        trust: 'untrusted-source-data',
        beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---',
        content: 'Fixture Unit 1 100 25mm',
        endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
      },
    ],
  }
}

const fixtureWorker = fileURLToPath(
  new URL('../fixtures/aos4/adversarialReview/fixtureWorker.mjs', import.meta.url)
)

const isLive = (pid: number): boolean => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

const workerTask = (workspace: string, revision: string) => ({
  schemaVersion: 1 as const,
  revision,
  workspace,
  assignmentId: createReviewAssignment({
    packetIds: [`review-packet:sha256:${'e'.repeat(64)}`],
    reviewer: deterministicReviewerMetadata('parallel-process-fixture'),
    execution: 'local',
    assignedAt: '2026-08-02T12:00:00.000Z',
  }).id,
  reviewer: deterministicReviewerMetadata('parallel-process-fixture'),
  blindReviewedAt: '2026-08-02T12:01:00.000Z',
  comparisonReviewedAt: '2026-08-02T12:02:00.000Z',
})

describe('bounded adversarial review workers', () => {
  it('balances fresh pair counts and validates job arguments', () => {
    const groups = balancedFreshShardGroups(
      [10, 9, 1].map((count, index) => ({
        index,
        path: `packets/shard-${index}.json`,
        freshPairKeys: Array.from({ length: count }, (_, pairIndex) => `${index}:${pairIndex}`),
      })),
      2
    )
    expect(
      groups.map(group => group.reduce((total, shard) => total + shard.freshPairKeys.length, 0))
    ).toEqual([10, 10])
    expect(
      parseAdversarialReviewArguments([
        '--campaign-at',
        '2026-08-02T12:00:00.000Z',
        '--jobs',
        '8',
        '--reuse-certification',
        'data/aos4/certifications/prior',
      ])
    ).toMatchObject({ jobs: 8, reuseCertification: 'data/aos4/certifications/prior' })
    expect(() =>
      parseAdversarialReviewArguments(['--campaign-at', '2026-08-02T12:00:00.000Z', '--jobs', '0'])
    ).toThrow('--jobs requires an integer from 1 to 32')
    expect([1, 2, 20].map(defaultAdversarialReviewJobs)).toEqual([1, 1, 8])
  })

  it('rejects campaign instants that are malformed or later than the current time', () => {
    const now = new Date('2026-09-23T19:10:00.000Z')

    expect(parseAdversarialReviewArguments(['--campaign-at', '2026-09-23T19:10:00.000Z'], now)).toMatchObject(
      { campaignAt: '2026-09-23T19:10:00.000Z' }
    )
    expect(parseAdversarialReviewArguments(['--campaign-at', '2026-09-12T15:56:24Z'], now)).toMatchObject({
      campaignAt: '2026-09-12T15:56:24Z',
    })
    expect(() => parseAdversarialReviewArguments(['--campaign-at', '2026-09-23T19:10:00.001Z'], now)).toThrow(
      '--campaign-at 2026-09-23T19:10:00.001Z is later than the current time 2026-09-23T19:10:00.000Z'
    )
    expect(() => parseAdversarialReviewArguments(['--campaign-at', '2026-09-23T20:00:00Z'], now)).toThrow(
      'is later than the current time'
    )
    expect(() => parseAdversarialReviewArguments(['--campaign-at', '2026-09-23'], now)).toThrow(
      '--campaign-at requires an ISO timestamp'
    )
    // Rolled-over dates parse in V8 (02-30 becomes 03-02) but are not canonical instants.
    expect(() => parseAdversarialReviewArguments(['--campaign-at', '2026-02-30T00:00:00Z'], now)).toThrow(
      '--campaign-at requires an ISO timestamp'
    )
    expect(() => parseAdversarialReviewArguments(['--campaign-at', '2026-09-22T24:00:00Z'], now)).toThrow(
      '--campaign-at requires an ISO timestamp'
    )
  })

  it('persists blind results before producing comparison results', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'aos4-adversarial-worker-'))
    try {
      const workspace = path.join(root, 'workspace')
      const output = path.join(root, 'output')
      const fixturePair = pair()
      await writeCreateOnlyFilesDirectory(
        workspace,
        new Map([
          ['packets/shard-0001.json', serializeReviewRecord({ schemaVersion: 1, pairs: [fixturePair] })],
        ])
      )
      const reviewer = deterministicReviewerMetadata('parallel-fixture')
      const assignment = createReviewAssignment({
        packetIds: [fixturePair.blindPacket.id, fixturePair.comparisonPacket.id],
        reviewer,
        execution: 'local',
        assignedAt: '2026-08-02T12:00:00.000Z',
      })
      const receipt = await runAdversarialReviewWorkerTask(
        {
          schemaVersion: 1,
          revision: 'aos4-worker-fixture',
          workspace,
          assignmentId: assignment.id,
          reviewer,
          blindReviewedAt: '2026-08-02T12:01:00.000Z',
          comparisonReviewedAt: '2026-08-02T12:02:00.000Z',
          shards: [
            {
              index: 0,
              path: 'packets/shard-0001.json',
              freshPairKeys: [fixturePair.pairKey],
            },
          ],
        },
        output
      )
      const results = JSON.parse(await readFile(path.join(output, receipt.shards[0].path), 'utf8'))
        .results as ReviewerResult[]
      expect(results.map(result => result.reviewedAt)).toEqual([
        '2026-08-02T12:01:00.000Z',
        '2026-08-02T12:02:00.000Z',
      ])
      await expect(access(path.join(output, 'blind-results/shard-0001.json'))).resolves.toBeUndefined()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('publishes no worker output when a shard is incomplete', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'aos4-adversarial-worker-failure-'))
    try {
      const workspace = path.join(root, 'workspace')
      const output = path.join(root, 'output')
      await writeCreateOnlyFilesDirectory(
        workspace,
        new Map([['packets/shard-0001.json', serializeReviewRecord({ schemaVersion: 1, pairs: [] })]])
      )
      const reviewer = deterministicReviewerMetadata('parallel-fixture')
      const assignment = createReviewAssignment({
        packetIds: [`review-packet:sha256:${'e'.repeat(64)}`],
        reviewer,
        execution: 'local',
        assignedAt: '2026-08-02T12:00:00.000Z',
      })
      await expect(
        runAdversarialReviewWorkerTask(
          {
            schemaVersion: 1,
            revision: 'aos4-worker-fixture',
            workspace,
            assignmentId: assignment.id,
            reviewer,
            blindReviewedAt: '2026-08-02T12:01:00.000Z',
            comparisonReviewedAt: '2026-08-02T12:02:00.000Z',
            shards: [
              {
                index: 0,
                path: 'packets/shard-0001.json',
                freshPairKeys: ['missing-pair'],
              },
            ],
          },
          output
        )
      ).rejects.toThrow('missing fresh pairs')
      await expect(access(output)).rejects.toThrow()
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('settles sibling processes before cleaning up a failed parallel run', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'aos4-adversarial-worker-process-failure-'))
    try {
      const output = path.join(root, 'output')
      let siblingPid: number | undefined
      let siblingLiveAtFailure: boolean | undefined
      await expect(
        writeCreateOnlyDirectory(output, async staging => {
          try {
            await runFreshWorkers(
              staging,
              workerTask(path.join(root, 'workspace'), 'aos4-worker-process-fixture'),
              [
                [{ index: 0, path: 'packets/shard-0001.json', freshPairKeys: ['missing-pair'] }],
                [{ index: 1, path: 'packets/shard-0002.json', freshPairKeys: ['live-pair'] }],
              ],
              (taskPath, workerOutput) => ({
                file: process.execPath,
                args: [fixtureWorker, '--task', taskPath, '--output', workerOutput],
              })
            )
          } catch (error) {
            // The failure reaches this callback before writeCreateOnlyDirectory removes staging. Read
            // synchronously: a caller that rejected without settling its sibling would be checked here
            // before the terminated process had gone.
            siblingPid = Number(readFileSync(path.join(root, 'sibling.pid'), 'utf8'))
            siblingLiveAtFailure = isLive(siblingPid)
            throw error
          }
        })
      ).rejects.toThrow('Fixture worker shard is missing fresh pairs')
      expect(siblingPid).toBeGreaterThan(0)
      expect(siblingLiveAtFailure).toBe(false)
      await expect(access(output)).rejects.toThrow()
      expect((await readdir(root)).filter(name => name.startsWith(`${path.basename(output)}.tmp-`))).toEqual(
        []
      )
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('keeps a spawn failure as the failure and still settles the live sibling', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'aos4-adversarial-worker-spawn-failure-'))
    try {
      const output = path.join(root, 'output')
      await expect(
        writeCreateOnlyDirectory(output, staging =>
          runFreshWorkers(
            staging,
            workerTask(path.join(root, 'workspace'), 'aos4-worker-process-fixture'),
            [
              [{ index: 0, path: 'packets/shard-0001.json', freshPairKeys: ['unspawned-pair'] }],
              [{ index: 1, path: 'packets/shard-0002.json', freshPairKeys: ['live-pair'] }],
            ],
            (taskPath, workerOutput) =>
              taskPath.endsWith('worker-task-0001.json')
                ? { file: path.join(root, 'missing-executable'), args: [] }
                : {
                    file: process.execPath,
                    args: [fixtureWorker, '--task', taskPath, '--output', workerOutput],
                  }
          ).then(() => undefined)
        )
      ).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(access(output)).rejects.toThrow()
      expect((await readdir(root)).filter(name => name.startsWith(`${path.basename(output)}.tmp-`))).toEqual(
        []
      )
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('runs the real worker command in its own process', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'aos4-adversarial-worker-process-'))
    try {
      const workspace = path.join(root, 'workspace')
      const staging = path.join(root, 'staging')
      const fixturePair = pair()
      await writeCreateOnlyFilesDirectory(
        workspace,
        new Map([
          ['packets/shard-0001.json', serializeReviewRecord({ schemaVersion: 1, pairs: [fixturePair] })],
        ])
      )
      await mkdir(staging)
      const results = await runFreshWorkers(staging, workerTask(workspace, 'aos4-worker-process-fixture'), [
        [{ index: 0, path: 'packets/shard-0001.json', freshPairKeys: [fixturePair.pairKey] }],
      ])
      expect(Array.from(results.keys())).toEqual([0])
      const result = results.get(0)!
      expect(result.path).toBe(path.join(staging, 'worker-0001', 'results', 'shard-0001.json'))
      expect(result.resultCount).toBe(2)
      const written = JSON.parse(await readFile(result.path, 'utf8')).results as ReviewerResult[]
      expect(written.map(entry => entry.reviewedAt)).toEqual([
        '2026-08-02T12:01:00.000Z',
        '2026-08-02T12:02:00.000Z',
      ])
    } finally {
      await rm(root, { recursive: true, force: true })
    }
    // The only case here that starts the real worker command, which runs under vite-node: one runtime
    // startup, measured at ~1-10s depending on host load against the 5s default. The ordering of a
    // failed parallel run is covered above with a plain Node fixture so it does not pay two startups.
  }, 60_000)
})
