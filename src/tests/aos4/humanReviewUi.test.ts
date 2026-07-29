import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { JSDOM } from 'jsdom'
import { describe, expect, it, vi } from 'vitest'
import type { SourceRecordId } from '../../aos4/domain'
import {
  AOS4_REVIEW_PROTOCOL_VERSION,
  AOS4_REVIEW_RUBRIC_VERSION,
  buildGuidedComparisonResultCollection,
  checksumReviewRecord,
  createReviewPacket,
  guidedComparisonPage,
  loadGuidedComparisonReview,
  runGuidedReviewUi,
  saveGuidedComparisonReview,
  type GuidedComparisonResponse,
  type ReviewPacketPair,
  type ReviewerResult,
} from '../../aos4/review'
import {
  buildGuidedBlindResultCollection,
  guidedBlindStagePaths,
  loadGuidedBlindReview,
  parseGuidedEvidenceContent,
  saveGuidedBlindReview,
  type GuidedBlindResponse,
  type GuidedBlindTaskCollection,
  type GuidedResultTemplate,
} from '../../aos4/review/humanReviewUi'
import { parseGuidedReviewUiArguments } from '../../aos4/review/humanReviewUiCommand'
import { guidedReviewPage } from '../../aos4/review/humanReviewUiPage'

const BLIND_SOURCE_RECORD_ID =
  'source-record:games-workshop:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb%3Apage%3A1' as SourceRecordId
const BLIND_EVIDENCE_REF = `review-evidence:sha256:${'e'.repeat(64)}`
const BLIND_PACKET = createReviewPacket({
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  cohortIds: ['calibration'],
  sourceEvidence: [
    {
      sourceRecordId: BLIND_SOURCE_RECORD_ID,
      recordChecksum: 'f'.repeat(64),
      locator: { kind: 'page', page: 1 },
      authority: 'official',
      excerptRef: BLIND_EVIDENCE_REF,
    },
  ],
  generatedDestinations: [],
  rulesContextIds: [],
  blind: true,
})
const PACKET_ID = BLIND_PACKET.id
const PACKET_CHECKSUM = BLIND_PACKET.packetChecksum
const ASSIGNMENT_ID = `review-assignment:sha256:${'b'.repeat(64)}` as const
const CONFIGURATION_ID = `reviewer-configuration:sha256:${'c'.repeat(64)}` as const

const tasks = (): GuidedBlindTaskCollection => ({
  schemaVersion: 1,
  revision: 'aos4-corpus-test',
  instructions: 'Interpret only the delimited source evidence.',
  tasks: [
    {
      pairKey: `review-pair:sha256:${'d'.repeat(64)}`,
      factionIds: [],
      rulesContextIds: [],
      blindPacket: structuredClone(BLIND_PACKET),
      evidence: [
        {
          ref: BLIND_EVIDENCE_REF,
          trust: 'untrusted-source-data',
          beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---',
          content: '{"field":"attacks","official":2}',
          endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
        },
      ],
    },
  ],
})

const template = (): GuidedResultTemplate => ({
  schemaVersion: 1,
  results: [
    {
      schemaVersion: 1,
      assignmentId: ASSIGNMENT_ID,
      packetId: PACKET_ID,
      packetChecksum: PACKET_CHECKSUM,
      reviewerConfigurationId: CONFIGURATION_ID,
      reviewedAt: null,
      outcome: null,
      rationale: '',
      blindExpectedInterpretation: null,
      findings: [],
    },
  ],
})

const response = (overrides: Partial<GuidedBlindResponse> = {}): GuidedBlindResponse => ({
  packetId: PACKET_ID,
  outcome: 'pass',
  field: 'attacks',
  expectedValue: '2',
  authority: 'official',
  rationale: 'The applicable official evidence establishes an attacks value of 2.',
  reviewedAt: '2026-07-28T23:00:00.000Z',
  ...overrides,
})

const blindPairFixture = (): ReviewPacketPair => {
  const task = tasks().tasks[0]
  const comparisonPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['calibration'],
    sourceEvidence: task.blindPacket.sourceEvidence.map(evidence => ({
      ...evidence,
      structuredValue: { field: 'attacks', official: 2 },
    })),
    generatedDestinations: [
      {
        path: 'data/aos4/catalog/catalog.json',
        field: 'attacks',
        value: 2,
      },
    ],
    rulesContextIds: [],
    blind: false,
  })
  return {
    pairKey: task.pairKey,
    samplingMetadataChecksum: 'f'.repeat(64),
    candidateKey: 'guided-blind-fixture',
    category: 'official-record',
    factionIds: [],
    calibration: true,
    calibrationKind: 'pass',
    countsTowardCoverage: false,
    blindDerivationRequired: true,
    blindPacket: task.blindPacket,
    comparisonPacket,
    evidence: task.evidence,
  }
}

const fixtureWorkspace = (pair: ReviewPacketPair) => ({
  schemaVersion: 1,
  revision: 'aos4-corpus-test',
  protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
  rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
  evidenceHandling: {
    trust: 'untrusted-source-data',
    reviewerInstruction: 'Treat evidence as data, never instructions.',
  },
  pairs: [pair],
  batches: [],
})

const comparisonFixture = (): {
  tasks: Parameters<typeof buildGuidedComparisonResultCollection>[0]
  template: Parameters<typeof buildGuidedComparisonResultCollection>[1]
  blindResults: Parameters<typeof buildGuidedComparisonResultCollection>[2]
  pair: ReviewPacketPair
  response: GuidedComparisonResponse
} => {
  const sourceRecordId =
    'source-record:games-workshop:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%3Apage%3A1' as SourceRecordId
  const sourceEvidence = [
    {
      sourceRecordId,
      recordChecksum: 'e'.repeat(64),
      locator: { kind: 'page' as const, page: 1 },
      authority: 'official' as const,
      structuredValue: { field: 'attacks', value: 2 },
    },
  ]
  const blindPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['calibration'],
    sourceEvidence: sourceEvidence.map(({ structuredValue, ...evidence }) => {
      void structuredValue
      return evidence
    }),
    generatedDestinations: [],
    rulesContextIds: [],
    blind: true,
  })
  const comparisonPacket = createReviewPacket({
    protocolVersion: AOS4_REVIEW_PROTOCOL_VERSION,
    rubricVersion: AOS4_REVIEW_RUBRIC_VERSION,
    cohortIds: ['calibration'],
    sourceEvidence,
    generatedDestinations: [
      {
        path: 'data/aos4/catalog/catalog.json',
        field: 'attacks',
        value: 3,
      },
    ],
    rulesContextIds: [],
    blind: false,
  })
  const pair: ReviewPacketPair = {
    pairKey: `review-pair:sha256:${'d'.repeat(64)}`,
    samplingMetadataChecksum: 'f'.repeat(64),
    candidateKey: 'guided-comparison-fixture',
    category: 'official-record',
    factionIds: [],
    calibration: false,
    countsTowardCoverage: true,
    blindDerivationRequired: true,
    blindPacket,
    comparisonPacket,
    evidence: [],
  }
  const blindResult: ReviewerResult = {
    schemaVersion: 1,
    assignmentId: ASSIGNMENT_ID,
    packetId: blindPacket.id,
    packetChecksum: blindPacket.packetChecksum,
    reviewerConfigurationId: CONFIGURATION_ID,
    reviewedAt: '2026-07-28T23:00:00.000Z',
    outcome: 'pass',
    rationale: 'The official source establishes an attacks characteristic of 2.',
    blindExpectedInterpretation: {
      authority: 'official',
      expectedValue: 2,
      field: 'attacks',
    },
    findings: [],
  }
  const blindResults = { schemaVersion: 1 as const, results: [blindResult] }
  return {
    tasks: {
      schemaVersion: 1,
      blindResultsChecksum: checksumReviewRecord(blindResults),
      tasks: [
        {
          pairKey: pair.pairKey,
          blindInterpretation: blindResult.blindExpectedInterpretation,
          blindPacketId: blindPacket.id,
          blindPacketChecksum: blindPacket.packetChecksum,
          comparisonPacketId: comparisonPacket.id,
          comparisonPacketChecksum: comparisonPacket.packetChecksum,
          comparisonPacket,
        },
      ],
    },
    template: {
      schemaVersion: 1,
      results: [
        {
          schemaVersion: 1,
          assignmentId: ASSIGNMENT_ID,
          packetId: comparisonPacket.id,
          packetChecksum: comparisonPacket.packetChecksum,
          reviewerConfigurationId: CONFIGURATION_ID,
          reviewedAt: null,
          outcome: null,
          rationale: '',
          findings: [],
        },
      ],
    },
    blindResults,
    pair,
    response: {
      packetId: comparisonPacket.id,
      outcome: 'finding',
      rationale: 'The source establishes attacks 2, while the generated destination contains 3.',
      reviewedAt: '2026-07-28T23:01:00.000Z',
      findingField: 'attacks',
      expectedValue: '2',
      actualValue: '3',
      severity: 'major',
      confidence: 'high',
    },
  }
}

describe('AoS 4 guided human review', () => {
  it('turns plain-language blind answers into checksum-bound reviewer results', () => {
    const collection = buildGuidedBlindResultCollection(tasks(), template(), [response()])

    expect(collection).toEqual({
      schemaVersion: 1,
      results: [
        {
          schemaVersion: 1,
          assignmentId: ASSIGNMENT_ID,
          packetId: PACKET_ID,
          packetChecksum: PACKET_CHECKSUM,
          reviewerConfigurationId: CONFIGURATION_ID,
          reviewedAt: '2026-07-28T23:00:00.000Z',
          outcome: 'pass',
          rationale: 'The applicable official evidence establishes an attacks value of 2.',
          blindExpectedInterpretation: {
            authority: 'official',
            expectedValue: 2,
            field: 'attacks',
          },
          findings: [],
        },
      ],
    })
  })

  it('records an evidence gap without inventing an expected value', () => {
    const collection = buildGuidedBlindResultCollection(tasks(), template(), [
      response({
        authority: 'insufficient-evidence',
        expectedValue: '',
        outcome: 'cannot-verify',
        rationale: 'The supplied excerpt does not contain the attacks characteristic.',
      }),
    ])

    expect(collection.results[0]).toMatchObject({
      outcome: 'cannot-verify',
      blindExpectedInterpretation: {
        field: 'attacks',
        status: 'insufficient-evidence',
      },
      findings: [],
    })
    expect(collection.results[0].blindExpectedInterpretation).not.toHaveProperty('expectedValue')
  })

  it('builds comparison findings only from the human-entered discrepancy', () => {
    const fixture = comparisonFixture()
    const collection = buildGuidedComparisonResultCollection(
      fixture.tasks,
      fixture.template,
      fixture.blindResults,
      [fixture.pair],
      [fixture.response]
    )

    expect(collection.results[0]).toMatchObject({
      outcome: 'finding',
      rationale: fixture.response.rationale,
      findings: [
        {
          packetId: fixture.pair.comparisonPacket.id,
          subject: {
            sourceRecordId: fixture.pair.comparisonPacket.sourceEvidence[0].sourceRecordId,
            field: 'attacks',
          },
          expectedValue: 2,
          actualValue: 3,
          severity: 'major',
          confidence: 'high',
          rationale: fixture.response.rationale,
        },
      ],
    })
  })

  it('does not manufacture a comparison finding when the human omits its affected field', () => {
    const fixture = comparisonFixture()

    expect(() =>
      buildGuidedComparisonResultCollection(
        fixture.tasks,
        fixture.template,
        fixture.blindResults,
        [fixture.pair],
        [{ ...fixture.response, findingField: '' }]
      )
    ).toThrow('A material discrepancy requires an affected field')
  })

  it('rejects tampered comparison artifacts and unsupported finding metadata', () => {
    const checksumMismatch = comparisonFixture()
    checksumMismatch.tasks.blindResultsChecksum = '0'.repeat(64)
    expect(() =>
      buildGuidedComparisonResultCollection(
        checksumMismatch.tasks,
        checksumMismatch.template,
        checksumMismatch.blindResults,
        [checksumMismatch.pair],
        [checksumMismatch.response]
      )
    ).toThrow('Guided comparison blind results do not match their sealed checksum')

    const interpretationMismatch = comparisonFixture()
    interpretationMismatch.tasks.tasks[0].blindInterpretation = {
      field: 'attacks',
      expectedValue: 99,
    }
    expect(() =>
      buildGuidedComparisonResultCollection(
        interpretationMismatch.tasks,
        interpretationMismatch.template,
        interpretationMismatch.blindResults,
        [interpretationMismatch.pair],
        [interpretationMismatch.response]
      )
    ).toThrow('Guided comparison task does not match its sealed review pair')

    const invalidMetadata = comparisonFixture()
    expect(() =>
      buildGuidedComparisonResultCollection(
        invalidMetadata.tasks,
        invalidMetadata.template,
        invalidMetadata.blindResults,
        [invalidMetadata.pair],
        [{ ...invalidMetadata.response, severity: 'critical' as never }]
      )
    ).toThrow('A material discrepancy has an unsupported severity or confidence')
  })

  it('rejects incomplete, stale, or non-blind submissions before writing evidence', () => {
    expect(() => buildGuidedBlindResultCollection(tasks(), template(), [])).toThrow(
      'Guided review responses do not cover every task'
    )
    expect(() =>
      buildGuidedBlindResultCollection(tasks(), template(), [response({ outcome: 'finding' as never })])
    ).toThrow('Blind review outcome must be pass or cannot-verify')
    expect(() =>
      buildGuidedBlindResultCollection(tasks(), template(), [
        response({ reviewedAt: 'July 28', rationale: 'Too short.' }),
      ])
    ).toThrow('reviewedAt must be a canonical ISO timestamp')

    const changedTemplate = template()
    changedTemplate.results[0].packetChecksum = 'f'.repeat(64)
    expect(() => buildGuidedBlindResultCollection(tasks(), changedTemplate, [response()])).toThrow(
      'Result template does not match its blind task'
    )

    const revealedTasks = tasks()
    revealedTasks.tasks[0].blindPacket.blind = false
    expect(() => buildGuidedBlindResultCollection(revealedTasks, template(), [response()])).toThrow(
      'Guided blind task packet checksum is stale'
    )

    const tamperedTasks = tasks()
    tamperedTasks.tasks[0].blindPacket.sourceEvidence[0].recordChecksum = '0'.repeat(64)
    expect(() => buildGuidedBlindResultCollection(tamperedTasks, template(), [response()])).toThrow(
      'Guided blind task packet checksum is stale'
    )

    const emptyTasks = tasks()
    emptyTasks.tasks = []
    expect(() => buildGuidedBlindResultCollection(emptyTasks, { schemaVersion: 1, results: [] }, [])).toThrow(
      'Guided review requires at least one blind task'
    )
  })

  it('parses structured evidence for readable cards and preserves ordinary text', () => {
    expect(parseGuidedEvidenceContent('{"field":"move","value":"5\\""}')).toEqual({
      field: 'move',
      value: '5"',
    })
    expect(parseGuidedEvidenceContent('Plain evidence text\n')).toBe('Plain evidence text')
  })

  it('maps calibration and sample stages without allowing arbitrary paths', () => {
    expect(guidedBlindStagePaths('C:\\review', 'calibration-blind')).toEqual({
      tasks: 'C:\\review\\calibration-blind-tasks.json',
      template: 'C:\\review\\calibration-blind-results.template.json',
      output: 'C:\\review\\calibration-blind-results.json',
    })
    expect(guidedBlindStagePaths('C:\\review', 'sample-blind')).toEqual({
      tasks: 'C:\\review\\sample-blind\\tasks.json',
      template: 'C:\\review\\sample-blind\\results.template.json',
      output: 'C:\\review\\sample-blind\\results.json',
    })
  })

  it('loads and publishes create-only blind results inside the review cache', async () => {
    const cache = path.resolve('.cache', 'aos4', 'review')
    await mkdir(cache, { recursive: true })
    const reviewDirectory = await mkdtemp(path.join(cache, 'guided-ui-test-'))
    const workspacePath = path.join(reviewDirectory, 'packet-workspace.json')
    try {
      await Promise.all([
        writeFile(
          path.join(reviewDirectory, 'calibration-blind-tasks.json'),
          JSON.stringify(tasks()),
          'utf8'
        ),
        writeFile(
          path.join(reviewDirectory, 'calibration-blind-results.template.json'),
          JSON.stringify(template()),
          'utf8'
        ),
        writeFile(workspacePath, JSON.stringify(fixtureWorkspace(blindPairFixture())), 'utf8'),
      ])

      await expect(
        loadGuidedBlindReview(reviewDirectory, 'calibration-blind', workspacePath)
      ).resolves.toMatchObject({
        session: { outputExists: false, revision: 'aos4-corpus-test' },
      })
      const output = await saveGuidedBlindReview(reviewDirectory, 'calibration-blind', workspacePath, [
        response(),
      ])
      expect(JSON.parse(await readFile(output, 'utf8'))).toMatchObject({
        schemaVersion: 1,
        results: [{ outcome: 'pass', packetId: PACKET_ID }],
      })
      await expect(
        saveGuidedBlindReview(reviewDirectory, 'calibration-blind', workspacePath, [response()])
      ).rejects.toThrow('Create-only output already exists')
    } finally {
      await rm(reviewDirectory, { recursive: true, force: true })
    }

    await expect(
      loadGuidedBlindReview(
        path.resolve(cache, '..', 'outside-review-cache'),
        'calibration-blind',
        workspacePath
      )
    ).rejects.toThrow('Guided review artifacts must remain under')
  })

  it('loads sealed source excerpts and publishes create-only comparison results', async () => {
    const fixture = comparisonFixture()
    fixture.pair.evidence = [
      {
        ref: BLIND_EVIDENCE_REF,
        trust: 'untrusted-source-data',
        beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---',
        content: 'The official source establishes an attacks value of 2.',
        endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
      },
    ]
    const cache = path.resolve('.cache', 'aos4', 'review')
    await mkdir(cache, { recursive: true })
    const reviewDirectory = await mkdtemp(path.join(cache, 'guided-comparison-test-'))
    const workspacePath = path.join(reviewDirectory, 'packet-workspace.json')
    const stageDirectory = path.join(reviewDirectory, 'calibration-comparison')
    await mkdir(stageDirectory, { recursive: true })
    try {
      await Promise.all([
        writeFile(path.join(stageDirectory, 'tasks.json'), JSON.stringify(fixture.tasks), 'utf8'),
        writeFile(
          path.join(stageDirectory, 'results.template.json'),
          JSON.stringify(fixture.template),
          'utf8'
        ),
        writeFile(
          path.join(stageDirectory, 'blind-results.json'),
          JSON.stringify(fixture.blindResults),
          'utf8'
        ),
        writeFile(workspacePath, JSON.stringify(fixtureWorkspace(fixture.pair)), 'utf8'),
      ])

      await expect(
        loadGuidedComparisonReview(reviewDirectory, 'calibration-comparison', workspacePath)
      ).resolves.toMatchObject({
        session: {
          outputExists: false,
          tasks: [{ evidence: fixture.pair.evidence }],
        },
      })
      const output = await saveGuidedComparisonReview(
        reviewDirectory,
        'calibration-comparison',
        workspacePath,
        [fixture.response]
      )
      expect(JSON.parse(await readFile(output, 'utf8'))).toMatchObject({
        schemaVersion: 1,
        results: [{ outcome: 'finding', packetId: fixture.pair.comparisonPacket.id }],
      })
      await expect(
        saveGuidedComparisonReview(reviewDirectory, 'calibration-comparison', workspacePath, [
          fixture.response,
        ])
      ).rejects.toThrow('Create-only output already exists')
    } finally {
      await rm(reviewDirectory, { recursive: true, force: true })
    }
  })

  it('serves the review desk only on its capability-token boundary and exits after sealing', async () => {
    const cache = path.resolve('.cache', 'aos4', 'review')
    await mkdir(cache, { recursive: true })
    const reviewDirectory = await mkdtemp(path.join(cache, 'guided-server-test-'))
    const workspacePath = path.join(reviewDirectory, 'packet-workspace.json')
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    let serverRun: Promise<void> | undefined
    let reviewUrl: URL | undefined
    let sealed = false
    try {
      await Promise.all([
        writeFile(
          path.join(reviewDirectory, 'calibration-blind-tasks.json'),
          JSON.stringify(tasks()),
          'utf8'
        ),
        writeFile(
          path.join(reviewDirectory, 'calibration-blind-results.template.json'),
          JSON.stringify(template()),
          'utf8'
        ),
        writeFile(workspacePath, JSON.stringify(fixtureWorkspace(blindPairFixture())), 'utf8'),
      ])

      serverRun = runGuidedReviewUi({
        reviewDirectory,
        stage: 'calibration-blind',
        workspace: workspacePath,
        port: 0,
        openBrowser: false,
      })
      await vi.waitFor(() => {
        const ready = log.mock.calls
          .flat()
          .find(value => typeof value === 'string' && value.includes('guided human review is ready at'))
        expect(ready).toBeTypeOf('string')
        reviewUrl = new URL((ready as string).split('ready at ')[1])
      })

      const token = reviewUrl!.searchParams.get('token')!
      const origin = reviewUrl!.origin
      await expect(fetch(`${origin}/api/session`)).resolves.toMatchObject({ status: 403 })
      const session = await fetch(`${origin}/api/session`, {
        headers: { 'x-aos4-review-token': token },
      })
      expect(session.status).toBe(200)
      await expect(session.json()).resolves.toMatchObject({
        stage: 'calibration-blind',
        assignmentId: ASSIGNMENT_ID,
        outputExists: false,
      })

      const submission = await fetch(`${origin}/api/results`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-aos4-review-token': token,
        },
        body: JSON.stringify({ responses: [response()] }),
      })
      expect(submission.status).toBe(201)
      sealed = true
      await serverRun
      expect(
        JSON.parse(await readFile(path.join(reviewDirectory, 'calibration-blind-results.json'), 'utf8'))
      ).toMatchObject({ results: [{ packetId: PACKET_ID, outcome: 'pass' }] })
    } finally {
      if (!sealed && reviewUrl && serverRun) {
        const token = reviewUrl.searchParams.get('token')
        await fetch(`${reviewUrl.origin}/api/results`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-aos4-review-token': token ?? '',
          },
          body: JSON.stringify({ responses: [response()] }),
        }).catch(() => undefined)
        await serverRun.catch(() => undefined)
      }
      log.mockRestore()
      await rm(reviewDirectory, { recursive: true, force: true })
    }
  })

  it('autosaves only complete answers and submits the guided browser flow', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stage: 'calibration-blind',
          assignmentId: ASSIGNMENT_ID,
          revision: 'aos4-corpus-test',
          instructions: 'Interpret only the delimited source evidence.',
          tasks: tasks().tasks,
          outputExists: false,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ output: 'calibration-blind-results.json' }),
      })
    const dom = new JSDOM(guidedReviewPage({ nonce: 'test-nonce', token: 'test-token' }), {
      beforeParse: window => {
        Object.defineProperty(window, 'fetch', { value: fetchMock })
        Object.defineProperty(window, 'scrollTo', { value: vi.fn() })
        Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn() })
      },
      runScripts: 'dangerously',
      url: 'http://127.0.0.1:4314/?token=test-token',
    })

    try {
      await vi.waitFor(() => {
        expect(dom.window.document.querySelector('.work-title')?.textContent).toContain('attacks')
      })

      const document = dom.window.document
      const progress = () => document.querySelector('.progress-count')?.textContent
      const insufficient = document.querySelector<HTMLInputElement>('input[value="cannot-verify"]')!
      const sufficient = document.querySelector<HTMLInputElement>('input[value="pass"]')!
      const expected = document.querySelector<HTMLTextAreaElement>('#expected')!
      const rationale = document.querySelector<HTMLTextAreaElement>('#rationale')!

      expect(document.querySelector('#field')).toBeNull()
      expect(document.querySelector('#authority')).toBeNull()
      expect(document.body.textContent).toContain('use the source only')
      expect(document.body.textContent).toContain('Games Workshop says')

      insufficient.click()
      expect(progress()).toBe('0 of 1 answered')
      expect(expected.disabled).toBe(true)

      rationale.value = 'The supplied evidence does not establish an exact value without guessing.'
      rationale.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      expect(progress()).toBe('1 of 1 answered')

      sufficient.click()
      expect(progress()).toBe('0 of 1 answered')
      expect(expected.disabled).toBe(false)

      expected.value = '2'
      expected.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      expect(progress()).toBe('1 of 1 answered')

      document.querySelector<HTMLButtonElement>('.button-seal')!.click()
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      const submission = JSON.parse(fetchMock.mock.calls[1][1].body as string)
      expect(submission.responses).toMatchObject([
        {
          authority: 'official',
          expectedValue: '2',
          field: 'attacks',
          outcome: 'pass',
        },
      ])
      await vi.waitFor(() =>
        expect(document.querySelector('.complete-state')?.textContent).toContain(
          'Source-reading answers locked'
        )
      )
      expect(dom.window.localStorage.length).toBe(0)
    } finally {
      dom.window.close()
    }
  })

  it('plainly explains when a source excerpt is missing', async () => {
    const missingEvidenceTasks = tasks()
    missingEvidenceTasks.tasks[0].evidence = []
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stage: 'calibration-blind',
        assignmentId: ASSIGNMENT_ID,
        revision: 'aos4-corpus-test',
        instructions: 'Interpret only the delimited source evidence.',
        tasks: missingEvidenceTasks.tasks,
        outputExists: false,
      }),
    })
    const dom = new JSDOM(guidedReviewPage({ nonce: 'test-nonce', token: 'test-token' }), {
      beforeParse: window => {
        Object.defineProperty(window, 'fetch', { value: fetchMock })
        Object.defineProperty(window, 'scrollTo', { value: vi.fn() })
        Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn() })
      },
      runScripts: 'dangerously',
      url: 'http://127.0.0.1:4314/?token=test-token',
    })

    try {
      await vi.waitFor(() =>
        expect(dom.window.document.querySelector('.evidence-empty')?.textContent).toContain(
          'No source excerpt was supplied'
        )
      )
      expect(dom.window.document.querySelector('.evidence-empty')?.textContent).toContain('Do not guess')
    } finally {
      dom.window.close()
    }
  })

  it('turns a Regiment of Renown excerpt into a focused review question', async () => {
    const officialTasks = tasks()
    officialTasks.tasks[0].evidence[0].content =
      'This Regiment of Renown includes 1 Huskard on Stonehorn and costs 490 points.'
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        stage: 'calibration-blind',
        assignmentId: ASSIGNMENT_ID,
        revision: 'aos4-corpus-test',
        instructions: 'Interpret only the delimited source evidence.',
        tasks: officialTasks.tasks,
        outputExists: false,
      }),
    })
    const dom = new JSDOM(guidedReviewPage({ nonce: 'test-nonce', token: 'test-token' }), {
      beforeParse: window => {
        Object.defineProperty(window, 'fetch', { value: fetchMock })
        Object.defineProperty(window, 'scrollTo', { value: vi.fn() })
        Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn() })
      },
      runScripts: 'dangerously',
      url: 'http://127.0.0.1:4314/?token=test-token',
    })

    try {
      await vi.waitFor(() =>
        expect(dom.window.document.querySelector('.work-title')?.textContent).toBe(
          'Which Regiments of Renown are listed, and what does the source say about each?'
        )
      )
    } finally {
      dom.window.close()
    }
  })

  it('requires and submits a human-authored discrepancy in the comparison browser flow', async () => {
    const fixture = comparisonFixture()
    fixture.tasks.tasks[0].comparisonPacket.generatedDestinations[0].value =
      '<img id="unsafe-comparison-content">'
    fixture.pair.evidence = [
      {
        ref: BLIND_EVIDENCE_REF,
        trust: 'untrusted-source-data',
        beginDelimiter: '--- BEGIN UNTRUSTED SOURCE EVIDENCE ---',
        content: '<img id="unsafe-source-content">',
        endDelimiter: '--- END UNTRUSTED SOURCE EVIDENCE ---',
      },
    ]
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          stage: 'calibration-comparison',
          assignmentId: ASSIGNMENT_ID,
          tasks: fixture.tasks.tasks.map(task => ({
            ...task,
            evidence: fixture.pair.evidence,
          })),
          outputExists: false,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ output: 'calibration-comparison/results.json' }),
      })
    const dom = new JSDOM(guidedComparisonPage({ nonce: 'test-nonce', token: 'test-token' }), {
      beforeParse: window => {
        Object.defineProperty(window, 'fetch', { value: fetchMock })
        Object.defineProperty(window, 'scrollTo', { value: vi.fn() })
        Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', { value: vi.fn() })
      },
      runScripts: 'dangerously',
      url: 'http://127.0.0.1:4314/?token=test-token',
    })

    try {
      await vi.waitFor(() => {
        expect(dom.window.document.querySelector<HTMLInputElement>('.finding-fields input')?.value).toBe(
          'Attacks'
        )
      })

      const document = dom.window.document
      expect(document.querySelector('#unsafe-comparison-content')).toBeNull()
      expect(document.querySelector('#unsafe-source-content')).toBeNull()
      expect(document.body.textContent).toContain('<img id="unsafe-comparison-content">')
      expect(document.body.textContent).toContain('<img id="unsafe-source-content">')
      expect(document.body.textContent).toContain('What the website would use')
      expect(document.body.textContent).not.toContain('Generated destinations')

      document.querySelector<HTMLInputElement>('input[value="finding"]')!.click()
      const field = document.querySelector<HTMLInputElement>('.finding-fields input')!
      const findingTextareas = document.querySelectorAll<HTMLTextAreaElement>('.finding-fields textarea')
      const expected = findingTextareas.item(0)
      const actual = findingTextareas.item(1)
      const rationale = document.querySelector<HTMLTextAreaElement>('.form-grid > .field textarea')!

      field.value = ''
      rationale.value = 'The official source and generated destination materially disagree.'
      rationale.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      document.querySelector<HTMLButtonElement>('.seal')!.click()
      expect(document.querySelector('.error')?.textContent).toContain('information that differs')
      expect(fetchMock).toHaveBeenCalledTimes(1)

      field.value = 'attacks'
      expected.value = '2'
      actual.value = '3'
      field.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      expected.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      actual.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
      document.querySelector<HTMLButtonElement>('.seal')!.click()

      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
      const submission = JSON.parse(fetchMock.mock.calls[1][1].body as string)
      expect(submission.responses).toMatchObject([
        {
          outcome: 'finding',
          findingField: 'attacks',
          expectedValue: '2',
          actualValue: '3',
        },
      ])
      expect(fetchMock.mock.calls[1][1].headers).toMatchObject({
        'x-aos4-review-token': 'test-token',
      })
      await vi.waitFor(() =>
        expect(document.querySelector('.complete')?.textContent).toContain('Comparison decisions locked')
      )
      expect(dom.window.localStorage.length).toBe(0)
    } finally {
      dom.window.close()
    }
  })

  it('parses a bounded localhost reviewer command', () => {
    expect(
      parseGuidedReviewUiArguments([
        '--review-dir',
        '.cache/aos4/review/human-review',
        '--workspace',
        '.cache/aos4/review/workspace/workspace.json',
        '--no-open',
      ])
    ).toEqual({
      reviewDirectory: '.cache/aos4/review/human-review',
      stage: 'calibration-blind',
      workspace: '.cache/aos4/review/workspace/workspace.json',
      port: 0,
      openBrowser: false,
    })
    expect(
      parseGuidedReviewUiArguments([
        '--review-dir',
        '.cache/aos4/review/human-review',
        '--stage',
        'sample-blind',
        '--workspace',
        '.cache/aos4/review/workspace/workspace.json',
        '--port',
        '4314',
      ])
    ).toMatchObject({ stage: 'sample-blind', port: 4314, openBrowser: true })
    expect(
      parseGuidedReviewUiArguments([
        '--review-dir',
        '.cache/aos4/review/human-review',
        '--stage',
        'calibration-comparison',
        '--workspace',
        '.cache/aos4/review/workspace/workspace.json',
      ])
    ).toMatchObject({
      stage: 'calibration-comparison',
      workspace: '.cache/aos4/review/workspace/workspace.json',
    })
    expect(() => parseGuidedReviewUiArguments(['--review-dir', '.cache/aos4/review/human-review'])).toThrow(
      'requires --workspace'
    )
    expect(() => parseGuidedReviewUiArguments([])).toThrow('requires --review-dir')
    expect(() =>
      parseGuidedReviewUiArguments([
        '--review-dir',
        '.cache/aos4/review/human-review',
        '--stage',
        'comparison',
      ])
    ).toThrow('must be calibration-blind, sample-blind, calibration-comparison, or sample-comparison')
    expect(() =>
      parseGuidedReviewUiArguments(['--review-dir', '.cache/aos4/review/human-review', '--browser', 'none'])
    ).toThrow('Unexpected guided review argument: --browser')
  })
})
