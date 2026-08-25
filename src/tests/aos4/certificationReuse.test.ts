import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
  AOS4_REVIEW_PROMPT_VERSION,
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  AOS4_REVIEW_SCHEMA_VERSION,
  canReuseCertificationShards,
  createReviewAssignment,
  createCertificationReuseIndex,
  createReviewCampaignExecution,
  certificationExecutionProjection,
  checksumReviewRecord,
  checksumCertificationText,
  loadCertificationReviewerResults,
  loadReusableCertificationEvidence,
  partitionReusableReviewEvidence,
  reviewCampaignExecutionIssues,
  reviewerConfigurationId,
  shouldCompactCertificationOverlay,
  validateReviewLedger,
  type PriorCertificationReviewEvidence,
  type ReviewAssignment,
  type ReviewCalibration,
  type ReviewPacketIndexEntry,
  type ReviewPacketSafeIndex,
  type ReviewerMetadata,
  type ReviewerResult,
} from '../../aos4/review'

const digest = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex')
const packetId = (value: string): ReviewerResult['packetId'] => `review-packet:sha256:${digest(value)}`
const reviewer = (overrides: Partial<ReviewerMetadata> = {}): ReviewerMetadata => ({
  id: 'deterministic-reviewer',
  kind: 'agent',
  tool: 'aos4-deterministic-evidence-auditor',
  model: AOS4_DETERMINISTIC_REVIEW_ENGINE_VERSION,
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  promptVersion: AOS4_REVIEW_PROMPT_VERSION,
  ...overrides,
})

const entry = (key = 'one'): ReviewPacketIndexEntry => ({
  pairKey: `review-pair:sha256:${digest(`${key}:pair`)}`,
  candidateKey: `source-record:${key}`,
  category: 'source-record',
  blindPacketId: packetId(`${key}:blind`),
  blindPacketChecksum: digest(`${key}:blind`),
  comparisonPacketId: packetId(`${key}:comparison`),
  comparisonPacketChecksum: digest(`${key}:comparison`),
  cohortIds: ['high-risk:reaction'],
  authorityClasses: ['secondary'],
  factionIds: [],
  rulesContextIds: [],
  blindDerivationRequired: true,
  assignmentStatus: 'unassigned',
  calibration: false,
  countsTowardCoverage: true,
  projectsToRuntime: true,
  samplingMetadataChecksum: digest(`${key}:sampling`),
})

const index = (entries = [entry()]): ReviewPacketSafeIndex => ({
  schemaVersion: 1,
  revision: 'aos4-reuse-fixture',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  entries,
  coverage: {
    officialRecords: { assigned: 0, expected: 0 },
    reconciliationDiscrepancies: { assigned: 0, expected: 0 },
    profileOnlyFacts: { assigned: 0, expected: 0 },
    sourceRecords: { assigned: entries.length, expected: entries.length },
    ignoredRecords: { assigned: 0, expected: 0 },
    factionContextStrata: [],
    highRiskCohorts: ['high-risk:reaction'],
  },
})

const reviewResult = (
  assignment: ReviewAssignment,
  packet: ReviewerResult['packetId'],
  checksum: string,
  lane: 'blind' | 'comparison',
  overrides: Partial<ReviewerResult> = {}
): ReviewerResult => ({
  schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
  assignmentId: assignment.id,
  packetId: packet,
  packetChecksum: checksum,
  reviewerConfigurationId: reviewerConfigurationId(assignment.reviewer),
  reviewedAt: lane === 'blind' ? '2026-08-02T12:01:00.000Z' : '2026-08-02T12:02:00.000Z',
  outcome: 'pass',
  rationale: 'The checksum-bound evidence agrees.',
  ...(lane === 'blind' ? { blindExpectedInterpretation: { checksum: digest('interpretation') } } : {}),
  findings: [],
  ...overrides,
})

const calibration = (assignment: ReviewAssignment, withReceipt = true): ReviewCalibration => {
  const receipt = {
    assignmentId: assignment.id,
    blindResultsChecksum: digest(`${assignment.id}:controls:blind`),
    comparisonResultsChecksum: digest(`${assignment.id}:controls:comparison`),
    controlPairKeysChecksum: digest('controls'),
  }
  return {
    schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
    reviewerConfigurationId: reviewerConfigurationId(assignment.reviewer),
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    calibratedAt: '2026-08-02T12:00:00.000Z',
    seededBlockerMajorDefects: 1,
    foundSeededBlockerMajorDefects: 1,
    unsupportedExpectedValues: 0,
    insufficientEvidenceCases: 1,
    correctCannotVerifyCases: 1,
    passed: true,
    ...(withReceipt ? { evidence: { ...receipt, receiptChecksum: checksumReviewRecord(receipt) } } : {}),
  }
}

const evidenceFor = (
  entries = [entry()],
  assignedReviewer = reviewer(),
  withReceipt = true
): PriorCertificationReviewEvidence => {
  const assignment = createReviewAssignment({
    packetIds: entries.flatMap(value => [value.blindPacketId, value.comparisonPacketId]),
    reviewer: assignedReviewer,
    execution: 'local',
    assignedAt: '2026-08-02T11:59:00.000Z',
  })
  return {
    index: index(entries),
    assignments: [assignment],
    calibrations: [calibration(assignment, withReceipt)],
    calibrationResults: [reviewResult(assignment, packetId('control'), digest('control'), 'blind')],
    results: entries.flatMap(value => [
      reviewResult(assignment, value.blindPacketId, value.blindPacketChecksum, 'blind'),
      reviewResult(assignment, value.comparisonPacketId, value.comparisonPacketChecksum, 'comparison'),
    ]),
  }
}

describe('certification verdict reuse', () => {
  it('reuses unchanged shards only when every evaluation input remains bound', () => {
    const unchanged = {
      hasReuseIndex: true,
      freshPairs: 0,
      sourceReviewIndexChecksum: digest('index'),
      currentReviewIndexChecksum: digest('index'),
      sourceInventoryChecksum: digest('inventory'),
      currentInventoryChecksum: digest('inventory'),
      sourceAcceptedManifestChecksum: digest('manifest'),
      currentAcceptedManifestChecksum: digest('manifest'),
    }

    expect(canReuseCertificationShards(unchanged)).toBe(true)
    expect(
      canReuseCertificationShards({
        ...unchanged,
        currentAcceptedManifestChecksum: digest('changed-manifest'),
      })
    ).toBe(false)
  })

  it('compacts incremental evidence before overlay ancestry can grow unbounded', () => {
    expect([0, 1, 2, 3, 4].map(shouldCompactCertificationOverlay)).toEqual([false, false, false, true, true])
  })

  it('reuses exact verdicts from a compact certification receipt without loading result bodies', () => {
    const prior = evidenceFor()
    prior.reuseIndex = createCertificationReuseIndex(
      prior.index,
      {
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        assignments: prior.assignments,
        calibrations: prior.calibrations,
        results: prior.results,
        findings: [],
        resolutions: [],
        verifications: [],
      },
      prior.calibrationResults,
      { status: 'pass', revision: prior.index.revision } as never
    )
    prior.results = []

    const partition = partitionReusableReviewEvidence(index(), prior, reviewer())

    expect(partition.reusedEntries).toHaveLength(1)
    expect(partition.freshEntries).toEqual([])
    expect(partition.results).toEqual([])

    prior.reuseIndex.entries[0].comparisonPacketChecksum = digest('changed')
    expect(partitionReusableReviewEvidence(index(), prior, reviewer()).freshEntries).toHaveLength(1)
  })

  it('retains calibration compatibility when compact evidence omits packet-index entries', () => {
    const live = entry('live')
    const control: ReviewPacketIndexEntry = {
      ...entry('control'),
      calibration: true,
      calibrationKind: 'defect',
      countsTowardCoverage: false,
      projectsToRuntime: false,
    }
    const current = index([live, control])
    const prior = evidenceFor([live])
    prior.index = current
    prior.reuseIndex = createCertificationReuseIndex(
      current,
      {
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        assignments: prior.assignments,
        calibrations: prior.calibrations,
        results: prior.results,
        findings: [],
        resolutions: [],
        verifications: [],
      },
      prior.calibrationResults,
      { status: 'pass', revision: current.revision } as never
    )
    prior.index = { ...current, entries: [] }
    prior.results = []

    const partition = partitionReusableReviewEvidence(current, prior, reviewer())

    expect(partition.reusedEntries.map(value => value.pairKey)).toEqual([live.pairKey])
    expect(partition.freshEntries).toEqual([])
  })

  it('reuses an exact passing pair without rewriting its evidence', () => {
    const current = index()
    const prior = evidenceFor()
    const partition = partitionReusableReviewEvidence(current, prior, reviewer())

    expect(partition.reusedEntries.map(value => value.pairKey)).toEqual([current.entries[0].pairKey])
    expect(partition.freshEntries).toEqual([])
    expect(partition.assignments).toEqual(prior.assignments)
    expect(partition.calibrations).toEqual(prior.calibrations)
    expect(partition.calibrationResults).toEqual(prior.calibrationResults)
    expect(new Set(partition.results)).toEqual(new Set(prior.results))
    expect(
      partition.results.find(value => value.packetId === current.entries[0].blindPacketId)?.reviewedAt
    ).toBe('2026-08-02T12:01:00.000Z')
  })

  it('makes every live pair fresh when the calibration controls change', () => {
    const one = entry('one')
    const two = entry('two')
    const control: ReviewPacketIndexEntry = {
      ...entry('control'),
      calibration: true,
      calibrationKind: 'defect',
      countsTowardCoverage: false,
      projectsToRuntime: false,
    }
    const partition = partitionReusableReviewEvidence(
      index([one, two, control]),
      evidenceFor([one, two]),
      reviewer()
    )

    expect(partition.reusedEntries).toEqual([])
    expect(partition.freshEntries.map(value => value.pairKey)).toEqual([one.pairKey, two.pairKey])
    expect(partition.assignments).toEqual([])
    expect(partition.calibrations).toEqual([])
  })

  it.each([
    [
      'pair key',
      (value: ReviewPacketSafeIndex) =>
        (value.entries[0].pairKey = `review-pair:sha256:${digest('changed')}`),
    ],
    [
      'blind packet ID',
      (value: ReviewPacketSafeIndex) => (value.entries[0].blindPacketId = packetId('changed')),
    ],
    [
      'blind packet checksum',
      (value: ReviewPacketSafeIndex) => (value.entries[0].blindPacketChecksum = digest('changed')),
    ],
    [
      'comparison packet ID',
      (value: ReviewPacketSafeIndex) => (value.entries[0].comparisonPacketId = packetId('changed')),
    ],
    [
      'comparison packet checksum',
      (value: ReviewPacketSafeIndex) => (value.entries[0].comparisonPacketChecksum = digest('changed')),
    ],
    ['protocol', (value: ReviewPacketSafeIndex) => (value.protocolVersion = 'aos4-review/v2')],
    ['rubric', (value: ReviewPacketSafeIndex) => (value.rubricVersion = 'aos4-rubric/v3')],
  ])('makes the pair fresh when its %s changes', (_label, mutate) => {
    const current = index()
    mutate(current)
    const partition = partitionReusableReviewEvidence(current, evidenceFor(), reviewer())
    expect(partition.reusedEntries).toEqual([])
    expect(partition.freshEntries).toHaveLength(1)
  })

  it.each([
    ['prompt', { promptVersion: 'aos4-review-prompt/v2' }],
    ['tool', { tool: 'different-auditor' }],
    ['prior model and engine version', { model: 'evidence-auditor/v2' }],
  ])('makes the pair fresh when the reviewer %s changes', (_label, overrides) => {
    const partition = partitionReusableReviewEvidence(index(), evidenceFor(), reviewer(overrides))
    expect(partition.reusedEntries).toEqual([])
    expect(partition.freshEntries).toHaveLength(1)
  })

  it.each(['source record', 'generated destination', 'context', 'cohort'])(
    'invalidates a pair when a %s change produces a new packet checksum',
    semanticInput => {
      const current = index()
      current.entries[0].comparisonPacketChecksum = digest(`changed:${semanticInput}`)
      const partition = partitionReusableReviewEvidence(current, evidenceFor(), reviewer())
      expect(partition.freshEntries).toHaveLength(1)
    }
  )

  it.each([
    ['partial', (prior: PriorCertificationReviewEvidence) => prior.results.pop()],
    [
      'stale',
      (prior: PriorCertificationReviewEvidence) => (prior.results[0].packetChecksum = digest('stale')),
    ],
    [
      'finding',
      (prior: PriorCertificationReviewEvidence) => {
        prior.results[0].outcome = 'finding'
        prior.results[0].findings = [{ id: `review-finding:sha256:${digest('finding')}` } as never]
      },
    ],
    [
      'cannot verify',
      (prior: PriorCertificationReviewEvidence) => (prior.results[0].outcome = 'cannot-verify'),
    ],
    ['unknown assignment', (prior: PriorCertificationReviewEvidence) => (prior.assignments = [])],
    ['duplicate result', (prior: PriorCertificationReviewEvidence) => prior.results.push(prior.results[0])],
  ])('treats %s prior evidence as fresh work', (_label, mutate) => {
    const prior = evidenceFor()
    mutate(prior)
    const partition = partitionReusableReviewEvidence(index(), prior, reviewer())
    expect(partition.reusedEntries).toEqual([])
    expect(partition.freshEntries).toHaveLength(1)
  })

  it('ignores obsolete prior pairs and keeps missing current pairs fresh', () => {
    const one = entry('one')
    const obsolete = entry('obsolete')
    const missing = entry('missing')
    const partition = partitionReusableReviewEvidence(
      index([one, missing]),
      evidenceFor([one, obsolete]),
      reviewer()
    )
    expect(partition.reusedEntries.map(value => value.pairKey)).toEqual([one.pairKey])
    expect(partition.freshEntries.map(value => value.pairKey)).toEqual([missing.pairKey])
  })

  it('resolves receipt-bound calibrations by assignment when configurations match', () => {
    const one = entry('one')
    const two = entry('two')
    const first = evidenceFor([one])
    const second = evidenceFor([two])
    const prior: PriorCertificationReviewEvidence = {
      index: index([one, two]),
      assignments: [...first.assignments, ...second.assignments],
      calibrations: [...first.calibrations, ...second.calibrations],
      calibrationResults: [...first.calibrationResults, ...second.calibrationResults],
      results: [...first.results, ...second.results],
    }
    const partition = partitionReusableReviewEvidence(index([one, two]), prior, reviewer())
    expect(partition.reusedEntries).toHaveLength(2)
    expect(partition.calibrations.map(value => value.evidence?.assignmentId)).toEqual(
      prior.assignments.map(value => value.id)
    )
    expect(
      validateReviewLedger({
        schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
        assignments: prior.assignments,
        calibrations: prior.calibrations,
        results: prior.results,
        findings: [],
        resolutions: [],
        verifications: [],
      })
    ).toEqual([])
  })

  it('keeps the single-assignment configuration/rubric fallback for legacy evidence', () => {
    const prior = evidenceFor([entry()], reviewer(), false)
    const partition = partitionReusableReviewEvidence(index(), prior, reviewer())
    expect(partition.reusedEntries).toHaveLength(1)
    expect(partition.calibrations).toEqual(prior.calibrations)
  })

  it('binds a no-op campaign to exact pair sets and contributing assignments', () => {
    const prior = evidenceFor()
    const controlsOnlyAssignment = createReviewAssignment({
      packetIds: [packetId('fresh-control')],
      reviewer: reviewer(),
      execution: 'local',
      assignedAt: '2026-08-02T12:03:00.000Z',
    })
    const execution = createReviewCampaignExecution({
      revision: prior.index.revision,
      campaignAt: '2026-08-02T12:03:00.000Z',
      reviewer: reviewer(),
      reusedPairKeys: prior.index.entries.map(value => value.pairKey),
      freshPairKeys: [],
      freshAssignmentId: controlsOnlyAssignment.id,
      contributingAssignmentIds: [prior.assignments[0].id, controlsOnlyAssignment.id],
      reuseSource: {
        directory: 'data/aos4/certifications/prior',
        manifestChecksum: digest('prior manifest'),
      },
    })

    expect(
      reviewCampaignExecutionIssues(
        execution,
        prior.index,
        [...prior.assignments, controlsOnlyAssignment],
        prior.results
      )
    ).toEqual([])
    expect(certificationExecutionProjection(execution)).toMatchObject({
      mode: 'incremental',
      totalPairs: 1,
      reusedPairs: 1,
      freshPairs: 0,
      checksum: expect.stringMatching(/^[0-9a-f]{64}$/),
    })

    execution.pairSets.reusedChecksum = digest('tampered')
    expect(
      reviewCampaignExecutionIssues(
        execution,
        prior.index,
        [...prior.assignments, controlsOnlyAssignment],
        prior.results
      )
    ).toContain('execution reused and fresh pair sets do not partition the current live population')
  })

  it('reports malformed execution metadata instead of throwing', () => {
    const prior = evidenceFor()

    expect(
      reviewCampaignExecutionIssues(
        { schemaVersion: 1 } as never,
        prior.index,
        prior.assignments,
        prior.results
      )
    ).toEqual(['execution metadata does not match the current review engine and revision'])
  })

  it('rejects a reuse source whose internal file differs from its manifest binding', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-reuse-'))
    try {
      const directory = path.join(repoRoot, 'certification')
      await mkdir(directory)
      const manifest = JSON.parse(
        await readFile(
          path.join(
            process.cwd(),
            'data/aos4/certifications/aos4-corpus-2026-08-25b-machine-r1/manifest.json'
          ),
          'utf8'
        )
      )
      // The retained manifests bind a compact reuse index, which the loader reads before the
      // general inputs; drop it so the corrupted accepted-manifest binding is reached first.
      manifest.inputs = manifest.inputs.filter(
        (input: { name: string }) => input.name !== 'review-reuse-index'
      )
      manifest.inputs[0] = {
        ...manifest.inputs[0],
        path: 'corrupt.json',
        checksum: digest('expected bytes'),
      }
      await writeFile(path.join(repoRoot, 'corrupt.json'), 'different bytes', 'utf8')
      await writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifest), 'utf8')
      await writeFile(
        path.join(directory, '.complete.json'),
        '{"kind":"aos4-create-only-directory","schemaVersion":1}\n',
        'utf8'
      )

      await expect(loadReusableCertificationEvidence(directory, repoRoot)).rejects.toThrow(
        'input checksum mismatch: accepted-manifest'
      )
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('rejects a cycle between compact certification reuse indexes', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-reuse-cycle-'))
    try {
      const directories = [path.join(repoRoot, 'first'), path.join(repoRoot, 'second')]
      await Promise.all(directories.map(directory => mkdir(directory)))
      const prior = evidenceFor()
      const baseReuseIndex = createCertificationReuseIndex(
        prior.index,
        {
          schemaVersion: AOS4_REVIEW_SCHEMA_VERSION,
          assignments: prior.assignments,
          calibrations: prior.calibrations,
          results: prior.results,
          findings: [],
          resolutions: [],
          verifications: [],
        },
        prior.calibrationResults,
        { status: 'pass', revision: prior.index.revision } as never
      )
      const manifestFor = (directory: string, reuseIndexText: string) => ({
        schemaVersion: 1,
        revision: prior.index.revision,
        status: 'pass',
        certifiedAt: '2026-08-02T12:03:00.000Z',
        inputs: [
          {
            name: 'review-reuse-index',
            path: `${directory}/reuse-index.json`,
            checksum: checksumCertificationText(reuseIndexText),
          },
        ],
        protocol: {
          protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
          rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
          checksum: digest('protocol'),
        },
        coverage: {
          officialRecords: { reviewed: 0, expected: 0 },
          reconciliationDiscrepancies: { reviewed: 0, expected: 0 },
          profileOnlyFacts: { reviewed: 0, expected: 0 },
          sourceRecords: { reviewed: 1, expected: 1 },
          ignoredRecords: { reviewed: 0, expected: 0 },
          factionContextStrata: { reviewed: 0, expected: 0 },
          highRiskCohorts: { reviewed: 1, expected: 1 },
        },
        ledgerChecksum: digest('ledger'),
        inventoryChecksum: digest('inventory'),
        sourceObservedAt: '2026-08-02T12:00:00.000Z',
      })
      const firstReuseIndex = JSON.stringify({
        ...baseReuseIndex,
        entries: [],
        reuseSource: { directory: 'second', manifestChecksum: digest('second manifest') },
        reusedPairKeys: [prior.index.entries[0].pairKey],
      })
      const secondReuseIndex = JSON.stringify({
        ...baseReuseIndex,
        entries: [],
        reuseSource: { directory: 'first', manifestChecksum: digest('first manifest') },
        reusedPairKeys: [prior.index.entries[0].pairKey],
      })
      const manifests = [manifestFor('first', firstReuseIndex), manifestFor('second', secondReuseIndex)]
      await Promise.all(
        directories.flatMap((directory, index) => [
          writeFile(path.join(directory, 'reuse-index.json'), [firstReuseIndex, secondReuseIndex][index]),
          writeFile(path.join(directory, 'manifest.json'), JSON.stringify(manifests[index])),
          writeFile(
            path.join(directory, '.complete.json'),
            '{"kind":"aos4-create-only-directory","schemaVersion":1}\n'
          ),
        ])
      )

      await expect(loadReusableCertificationEvidence(directories[0], repoRoot)).rejects.toThrow(
        'reuse index overlay cycle detected'
      )
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })

  it('resolves checksum-bound result overlays and rejects mutated parent evidence', async () => {
    const repoRoot = await mkdtemp(path.join(tmpdir(), 'aos4-certification-overlay-'))
    try {
      const parentDirectory = path.join(repoRoot, 'parent')
      const childDirectory = path.join(repoRoot, 'child')
      await Promise.all([mkdir(parentDirectory), mkdir(childDirectory)])
      const assignment = createReviewAssignment({
        packetIds: [packetId('parent'), packetId('fresh')],
        reviewer: reviewer(),
        execution: 'local',
        assignedAt: '2026-08-02T11:59:00.000Z',
      })
      const parentResults = [reviewResult(assignment, packetId('parent'), digest('parent'), 'blind')]
      const freshResults = [reviewResult(assignment, packetId('fresh'), digest('fresh'), 'comparison')]
      const parentText = JSON.stringify(parentResults)
      await writeFile(path.join(parentDirectory, 'results.json'), parentText, 'utf8')
      const manifestFor = (inputs: Array<{ name: string; path: string; checksum: string }>) => ({
        schemaVersion: 1,
        revision: 'overlay-fixture',
        status: 'pass',
        certifiedAt: '2026-08-02T12:03:00.000Z',
        inputs,
        protocol: {
          protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
          rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
          checksum: digest('protocol'),
        },
        coverage: {
          officialRecords: { reviewed: 0, expected: 0 },
          reconciliationDiscrepancies: { reviewed: 0, expected: 0 },
          profileOnlyFacts: { reviewed: 0, expected: 0 },
          sourceRecords: { reviewed: 1, expected: 1 },
          ignoredRecords: { reviewed: 0, expected: 0 },
          factionContextStrata: { reviewed: 0, expected: 0 },
          highRiskCohorts: { reviewed: 0, expected: 0 },
        },
        ledgerChecksum: digest('ledger'),
        inventoryChecksum: digest('inventory'),
        sourceObservedAt: '2026-08-02T12:00:00.000Z',
      })
      const parentManifest = manifestFor([
        {
          name: 'review-results',
          path: 'parent/results.json',
          checksum: checksumCertificationText(parentText),
        },
      ])
      await writeFile(path.join(parentDirectory, 'manifest.json'), JSON.stringify(parentManifest), 'utf8')
      const freshText = JSON.stringify(freshResults)
      const overlay = {
        schemaVersion: 1,
        kind: 'review-result-overlay',
        revision: 'overlay-fixture',
        reuseSource: {
          directory: 'parent',
          manifestChecksum: checksumReviewRecord(parentManifest),
        },
        reusedPacketIds: [parentResults[0].packetId],
        reusedResults: 1,
        shards: [{ inputName: 'review-results-shard-0001', results: 1 }],
      }
      const overlayText = JSON.stringify(overlay)
      await Promise.all([
        writeFile(path.join(childDirectory, 'results.json'), overlayText, 'utf8'),
        writeFile(path.join(childDirectory, 'fresh.json'), freshText, 'utf8'),
      ])
      const childManifest = manifestFor([
        {
          name: 'review-results',
          path: 'child/results.json',
          checksum: checksumCertificationText(overlayText),
        },
        {
          name: 'review-results-shard-0001',
          path: 'child/fresh.json',
          checksum: checksumCertificationText(freshText),
        },
      ])
      await writeFile(path.join(childDirectory, 'manifest.json'), JSON.stringify(childManifest), 'utf8')
      await Promise.all(
        [parentDirectory, childDirectory].map(directory =>
          writeFile(
            path.join(directory, '.complete.json'),
            '{"kind":"aos4-create-only-directory","schemaVersion":1}\n',
            'utf8'
          )
        )
      )

      await expect(loadCertificationReviewerResults(childDirectory, repoRoot)).resolves.toEqual([
        ...parentResults,
        ...freshResults,
      ])

      await writeFile(path.join(parentDirectory, 'results.json'), '[]', 'utf8')
      await expect(loadCertificationReviewerResults(childDirectory, repoRoot)).rejects.toThrow(
        'input checksum mismatch: review-results'
      )
    } finally {
      await rm(repoRoot, { recursive: true, force: true })
    }
  })
})
