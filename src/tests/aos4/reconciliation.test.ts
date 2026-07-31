import {
  rulesContextId,
  sourceRecordId,
  warscrollId,
  type CanonicalId,
  type RulesContextId,
} from '../../aos4/domain'
import {
  createReconciliationReport,
  linkRecords,
  resolveFactPrecedence,
  validateReviewedOverrides,
  type CandidateFact,
  type LinkedCandidateFact,
  type ReconciliationEntity,
  type ReviewedOverride,
} from '../../aos4/reconcile'

const standard = rulesContextId('20000000-0000-4000-8000-000000000001')
const spearhead = rulesContextId('20000000-0000-4000-8000-000000000002')
const guardId = warscrollId('30000000-0000-4000-8000-000000000001')
const spearheadGuardId = warscrollId('30000000-0000-4000-8000-000000000002')

const entities: ReconciliationEntity[] = [
  {
    id: guardId,
    kind: 'warscroll',
    name: 'Example Guard',
    rulesContextIds: [standard],
    externalIds: {
      wahapedia: ['waha-guard'],
      'games-workshop': ['gw-guard'],
    },
  },
  {
    id: spearheadGuardId,
    kind: 'warscroll',
    name: 'Example Guard',
    rulesContextIds: [spearhead],
    externalIds: {
      wahapedia: ['waha-spearhead-guard'],
      'games-workshop': ['gw-spearhead-guard'],
    },
  },
]

const candidate = (id: string, value: string, overrides: Partial<CandidateFact> = {}): CandidateFact => ({
  id,
  entityKind: 'warscroll',
  entityName: 'Example Guard',
  field: 'move',
  value,
  publisher: 'wahapedia',
  authority: { kind: 'secondary' },
  sourceRecordId: sourceRecordId('wahapedia', id),
  rulesContextIds: [standard],
  externalEntityId: 'waha-guard',
  effectiveDate: '2026-01-01',
  ...overrides,
})

const linked = (
  id: string,
  value: string,
  overrides: Partial<LinkedCandidateFact> = {}
): LinkedCandidateFact => ({
  ...candidate(id, value),
  entityId: guardId,
  linkedBy: 'external-id',
  ...overrides,
})

const reviewedOverride = (
  facts: LinkedCandidateFact[],
  overrides: Partial<ReviewedOverride> = {}
): ReviewedOverride => ({
  id: 'override:guard-move',
  entityId: guardId,
  field: 'move',
  value: '6"',
  reason: 'The official layout is ambiguous; adjudicated against the errata.',
  author: 'maintainer@example.test',
  reviewedAt: '2026-07-27T12:00:00.000Z',
  sourceRecordIds: facts.map(fact => fact.sourceRecordId),
  rulesContextIds: [standard],
  ...overrides,
})

describe('AoS 4 source reconciliation', () => {
  it('links by provider identity before considering a different display name', () => {
    const fact = candidate('waha', '5"', { entityName: 'Localized Guard Name' })
    const result = linkRecords([fact], entities)

    expect(result.unresolved).toEqual([])
    expect(result.linked).toEqual([
      expect.objectContaining({ id: 'waha', entityId: guardId, linkedBy: 'external-id' }),
    ])
  })

  it('links conservative normalized names and reports the weaker match', () => {
    const fact = candidate('name-link', '5"', {
      entityName: 'Example—Guard',
      externalEntityId: undefined,
    })
    const result = linkRecords([fact], [entities[0]])

    expect(result.linked[0]).toMatchObject({
      entityId: guardId,
      linkedBy: 'normalized-name',
    })
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'normalized-name-link', severity: 'warning' })
    )
  })

  it('leaves ambiguous unscoped identities unresolved across rules contexts', () => {
    const fact = candidate('ambiguous', '5"', {
      externalEntityId: undefined,
      rulesContextIds: [],
    })
    const result = linkRecords([fact], entities)

    expect(result.linked).toEqual([])
    expect(result.unresolved).toEqual([fact])
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'ambiguous-entity', severity: 'error' })
    )
  })

  it('does not let an unrelated rules context overwrite the active context', () => {
    const facts = [
      linked('standard-official', '5"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        rulesContextIds: [standard],
      }),
      linked('spearhead-official', '4"', {
        entityId: spearheadGuardId,
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        rulesContextIds: [spearhead],
      }),
    ]

    const standardResult = resolveFactPrecedence(facts, standard)
    const spearheadResult = resolveFactPrecedence(facts, spearhead)

    expect(standardResult.resolutions).toEqual([
      expect.objectContaining({ entityId: guardId, value: '5"', status: 'resolved' }),
    ])
    expect(spearheadResult.resolutions).toEqual([
      expect.objectContaining({
        entityId: spearheadGuardId,
        value: '4"',
        status: 'resolved',
      }),
    ])
  })

  it('prefers the latest official revision and retains every source fact', () => {
    const facts = [
      linked('wahapedia', '7"', { effectiveDate: '2026-07-20' }),
      linked('official-old', '5"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        effectiveDate: '2025-01-01',
      }),
      linked('official-current', '6"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        effectiveDate: '2026-07-27',
      }),
    ]

    const result = resolveFactPrecedence(facts, standard)

    expect(result.resolutions).toEqual([
      expect.objectContaining({
        value: '6"',
        chosenFactIds: ['official-current'],
        retainedFactIds: ['official-current', 'official-old', 'wahapedia'],
      }),
    ])
  })

  it('keeps official precedence while flagging secondary data dated later', () => {
    const facts = [
      linked('secondary-newer', '7"', { effectiveDate: '2026-07-27' }),
      linked('official', '6"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        effectiveDate: '2026-07-01',
      }),
    ]

    const result = resolveFactPrecedence(facts, standard)

    expect(result.resolutions[0]).toMatchObject({ status: 'resolved', value: '6"' })
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'secondary-newer-than-official',
        severity: 'warning',
      })
    )
  })

  it('leaves equally current conflicting official facts unresolved', () => {
    const facts = [
      linked('official-a', '5"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        effectiveDate: '2026-07-27',
      }),
      linked('official-b', '6"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
        effectiveDate: '2026-07-27',
      }),
    ]

    const result = resolveFactPrecedence(facts, standard)

    expect(result.resolutions[0]).toMatchObject({
      status: 'unresolved',
      chosenFactIds: [],
    })
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'conflicting-authoritative-facts',
        severity: 'error',
      })
    )
  })

  it('applies a fully reviewed override while retaining its cited facts', () => {
    const facts = [
      linked('official-a', '5"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
      }),
      linked('official-b', '7"', {
        publisher: 'games-workshop',
        authority: { kind: 'official' },
      }),
    ]
    const override = reviewedOverride(facts)

    const result = resolveFactPrecedence(facts, standard, [override])

    expect(result.resolutions[0]).toMatchObject({
      status: 'resolved',
      value: '6"',
      overrideId: override.id,
      retainedFactIds: ['official-a', 'official-b'],
    })
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'reviewed-override-applied' }))
  })

  it.each([
    ['reason', { reason: '' }, 'invalid-override-reason'],
    ['author', { author: '' }, 'invalid-override-author'],
    ['timestamp', { reviewedAt: 'tomorrow' }, 'invalid-override-date'],
    ['sources', { sourceRecordIds: [] }, 'invalid-override-sources'],
    ['context', { rulesContextIds: [] }, 'invalid-override-context'],
  ])('rejects an override without a valid %s', (_label, changes, code) => {
    const facts = [linked('official', '5"')]
    const result = validateReviewedOverrides(
      [reviewedOverride(facts, changes as Partial<ReviewedOverride>)],
      facts
    )

    expect(result.valid).toEqual([])
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code }))
  })

  it('summarizes unresolved links, resolutions, and diagnostics deterministically', () => {
    const links = linkRecords(
      [
        candidate('linked', '5"'),
        candidate('unmatched', '4"', {
          entityName: 'Missing Unit',
          externalEntityId: undefined,
        }),
      ],
      [entities[0]]
    )
    const precedence = resolveFactPrecedence(links.linked, standard)

    expect(createReconciliationReport(links, precedence)).toEqual({
      linkedFacts: 1,
      unlinkedFacts: 1,
      resolvedFields: 1,
      unresolvedFields: 0,
      diagnostics: {
        'unmatched-entity': 1,
      },
    })
  })

  it('types context and entity identities as canonical values', () => {
    const context: RulesContextId = standard
    const entity: CanonicalId = guardId

    expect(context).toContain('rules-context:')
    expect(entity).toContain('warscroll:')
  })
})
