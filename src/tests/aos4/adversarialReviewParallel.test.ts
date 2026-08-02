import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  balancedFreshShardGroups,
  createReviewAssignment,
  createReviewPacket,
  deterministicReviewerMetadata,
  parseAdversarialReviewArguments,
  runAdversarialReviewWorkerTask,
  serializeReviewRecord,
  writeCreateOnlyFilesDirectory,
  type ReviewPacketPair,
  type ReviewerResult,
} from '../../aos4/review'
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
})
