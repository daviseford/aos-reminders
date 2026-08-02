import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { WahapediaHtmlReconciliation } from '../../aos4/data'
import type { CorpusOfficialDocument, CorpusReview } from '../../aos4/generate/corpus'
import {
  DEFAULT_PROFILE_ONLY_DEVIATIONS_PATH,
  loadProfileOnlyDeviationLedger,
  parseProfileOnlyDeviationLedger,
  profileOnlyGateIssues,
  type ProfileOnlyDeviationLedger,
} from '../../aos4/generate/profileOnlyGate'

/**
 * The official-first intake gate (#1820): a profile-only official unit fact is the signal that
 * Games Workshop published content whose rules no accepted source carries. Any such fact without
 * an explicit reviewed deviation (rationale + target date) must fail the strict generation gate
 * and `yarn data:aos4:verify:beta` - and therefore the deployment workflow - with the unit name
 * and source publication in the failure. The accepted baseline is exactly one deferred entry:
 * The Emberwatch (Warhammer Legends).
 */

const SUPPLEMENT_CHECKSUM = '052a8f5ca298950eea814ef8795160134aa4eb152896dc894dfdb1553ba55750'

const officialDocuments: Pick<CorpusOfficialDocument, 'artifact' | 'title'>[] = [
  {
    title: 'Battle Profiles - Ogor Mawtribes',
    artifact: { checksum: SUPPLEMENT_CHECKSUM } as never,
  },
]

const syntheticFact = (
  overrides: Partial<WahapediaHtmlReconciliation['unmatchedOfficialUnitFacts'][number]> = {}
): WahapediaHtmlReconciliation['unmatchedOfficialUnitFacts'][number] => ({
  factChecksum: 'f'.repeat(64),
  sourceRecordId: `source-record:games-workshop:${SUPPLEMENT_CHECKSUM}%3Apage%3A2` as never,
  faction: 'Ogor Mawtribes',
  context: 'standard',
  name: 'Newly Published Unit',
  unitSize: 3,
  points: 200,
  reason: 'No current warscroll rules were available.',
  ...overrides,
})

const emptyLedger: ProfileOnlyDeviationLedger = { schemaVersion: 1, deviations: [] }

const deviationFor = (
  fact: { faction: string; name: string },
  overrides: Partial<ProfileOnlyDeviationLedger['deviations'][number]> = {}
): ProfileOnlyDeviationLedger => ({
  schemaVersion: 1,
  deviations: [
    {
      faction: fact.faction,
      name: fact.name,
      reason: 'Reviewed deferral for testing.',
      targetDate: '2026-12-31',
      recordedAt: '2026-08-01',
      ...overrides,
    },
  ],
})

describe('the official-first intake gate (#1820)', () => {
  it('fails closed on a profile-only increase without a reviewed deviation, naming the unit and publication', () => {
    const fact = syntheticFact()
    const issues = profileOnlyGateIssues([fact], emptyLedger, officialDocuments)
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({
      code: 'unaccepted-profile-only-unit',
      severity: 'error',
      subject: 'Ogor Mawtribes: Newly Published Unit',
    })
    expect(issues[0].message).toContain('Newly Published Unit')
    expect(issues[0].message).toContain('Battle Profiles - Ogor Mawtribes')
    expect(issues[0].message).toContain('drives reviewed rules intake immediately')
    expect(issues[0].message).toContain(DEFAULT_PROFILE_ONLY_DEVIATIONS_PATH)
  })

  it('passes the same increase once a reviewed deviation records a rationale and target date', () => {
    const fact = syntheticFact()
    expect(profileOnlyGateIssues([fact], deviationFor(fact), officialDocuments)).toEqual([])
  })

  it('rejects deviations without a rationale or valid dates', () => {
    const fact = syntheticFact()
    const missingReason = profileOnlyGateIssues(
      [fact],
      deviationFor(fact, { reason: '   ' }),
      officialDocuments
    )
    expect(missingReason).toEqual([expect.objectContaining({ code: 'invalid-profile-only-deviation' })])
    const badDate = profileOnlyGateIssues(
      [fact],
      deviationFor(fact, { targetDate: 'soon' }),
      officialDocuments
    )
    expect(badDate).toEqual([expect.objectContaining({ code: 'invalid-profile-only-deviation' })])
  })

  it('rejects duplicated and stale deviations so resolved gaps cannot shield a regression', () => {
    const fact = syntheticFact()
    const duplicated: ProfileOnlyDeviationLedger = {
      schemaVersion: 1,
      deviations: [...deviationFor(fact).deviations, ...deviationFor(fact).deviations],
    }
    expect(profileOnlyGateIssues([fact], duplicated, officialDocuments)).toEqual([
      expect.objectContaining({ code: 'invalid-profile-only-deviation' }),
    ])

    const stale = profileOnlyGateIssues([], deviationFor(fact), officialDocuments)
    expect(stale).toEqual([
      expect.objectContaining({
        code: 'stale-profile-only-deviation',
        subject: 'Ogor Mawtribes: Newly Published Unit',
      }),
    ])
  })

  it('treats a missing ledger as empty so the gate still fails closed', async () => {
    const ledger = await loadProfileOnlyDeviationLedger(
      path.join(process.cwd(), 'data', 'aos4', 'reviews', 'no-such-ledger.json')
    )
    expect(ledger).toEqual({ schemaVersion: 1, deviations: [] })
    expect(profileOnlyGateIssues([syntheticFact()], ledger, officialDocuments)).toEqual([
      expect.objectContaining({ code: 'unaccepted-profile-only-unit' }),
    ])
  })

  it('accepts the current baseline: the accepted reconciliation passes with the recorded ledger', () => {
    const reconciliation = JSON.parse(
      readFileSync(
        path.join(process.cwd(), 'data', 'aos4', 'reports', 'corpus-2026-08-01f-reconciliation.json'),
        'utf8'
      )
    ) as WahapediaHtmlReconciliation
    const review = JSON.parse(
      readFileSync(path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-01f.json'), 'utf8')
    ) as CorpusReview
    const ledger = parseProfileOnlyDeviationLedger(
      JSON.parse(readFileSync(path.join(process.cwd(), DEFAULT_PROFILE_ONLY_DEVIATIONS_PATH), 'utf8'))
    )
    // The accepted 2026-08-01d population is exactly The Emberwatch, deferred for its Legends
    // context; the gate must be green on this baseline.
    expect(reconciliation.unmatchedOfficialUnitFacts).toHaveLength(1)
    expect(ledger.deviations).toEqual([
      expect.objectContaining({
        faction: 'Warhammer Legends',
        name: 'The Emberwatch',
        targetDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      }),
    ])
    expect(ledger.deviations[0].reason).toMatch(/legends/i)
    expect(
      profileOnlyGateIssues(reconciliation.unmatchedOfficialUnitFacts, ledger, review.officialDocuments)
    ).toEqual([])
  })
})
