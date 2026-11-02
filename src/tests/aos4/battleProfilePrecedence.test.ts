import type { GamesWorkshopBattleProfileFact } from '../../aos4/data'
import { resolveBattleProfilePrecedence } from '../../aos4/generate/corpusCommand'

/**
 * The newer official publication wins (#1757). The 14 October 2026 Battle Profiles - Khazalite
 * Holds printed Gotrek Gurnisson at 220 points; the 28 October core Battle Profiles prints 320, so
 * the core row is effective. The September 2026 Sons of Behemat supplement, newer than the July core,
 * still wins over it.
 */
const regiment = (name: string, points: number): GamesWorkshopBattleProfileFact =>
  ({
    kind: 'regiment-of-renown',
    name,
    points,
    faction: 'Regiments of Renown',
  }) as unknown as GamesWorkshopBattleProfileFact
const unit = (faction: string, name: string): GamesWorkshopBattleProfileFact =>
  ({ kind: 'unit', name, faction, points: 100 }) as unknown as GamesWorkshopBattleProfileFact
// `lastModified` is network metadata and deliberately contradicts the publication date in one case
// below: precedence must follow the reviewed official publicationDate only.
const document = (
  title: string,
  documentKind: 'battle-profiles' | 'battle-profile-supplement',
  publicationDate?: string,
  lastModified = 'Fri, 01 Jan 2027 00:00:00 GMT'
) =>
  ({
    title,
    documentKind,
    ...(publicationDate ? { publicationDate } : {}),
    artifact: { checksum: title, lastModified },
  }) as never

const statuses = (result: ReturnType<typeof resolveBattleProfilePrecedence>) =>
  result.reviewed.map(record => `${record.documentTitle}:${record.fact.name}:${record.status}`)

describe('official battle-profile precedence (#1757)', () => {
  it('lets a newer core document supersede an older supplement’s regiment row', () => {
    const result = resolveBattleProfilePrecedence(
      [
        {
          document: document(
            'Core October 28',
            'battle-profiles',
            '2026-10-28',
            'Thu, 22 Oct 2026 13:18:59 GMT'
          ),
          facts: [regiment('Gotrek Gurnisson', 320)],
        },
        {
          document: document(
            'Khazalite supplement',
            'battle-profile-supplement',
            '2026-10-14',
            'Sat, 31 Oct 2026 09:00:00 GMT'
          ),
          facts: [regiment('Gotrek Gurnisson', 220), unit('Khazalite Holds', 'Thrynn')],
        },
      ],
      new Set(['Khazalite Holds'])
    )
    expect(statuses(result)).toEqual([
      'Core October 28:Gotrek Gurnisson:effective',
      'Khazalite supplement:Gotrek Gurnisson:superseded',
      // The core prints no Khazalite Holds unit rows, so the supplement's units stay effective.
      'Khazalite supplement:Thrynn:effective',
    ])
    expect(result.effective.map(fact => (fact as { points: number }).points)).toEqual([320, 100])
  })

  it('still lets a newer supplement supersede the older core rows', () => {
    const result = resolveBattleProfilePrecedence(
      [
        {
          document: document('Core July', 'battle-profiles', '2026-07-15'),
          facts: [regiment('Bundo Whalebiter', 150), unit('Sons of Behemat', 'Mancrusher Gargant')],
        },
        {
          document: document('Sons of Behemat September', 'battle-profile-supplement', '2026-09-10'),
          facts: [regiment('Bundo Whalebiter', 160), unit('Sons of Behemat', 'Mancrusher Gargant')],
        },
      ],
      new Set(['Sons of Behemat'])
    )
    expect(statuses(result)).toEqual([
      'Core July:Bundo Whalebiter:superseded',
      'Core July:Mancrusher Gargant:superseded',
      'Sons of Behemat September:Bundo Whalebiter:effective',
      'Sons of Behemat September:Mancrusher Gargant:effective',
    ])
  })

  it('fails closed when a main document and a supplement print the same row on the same date', () => {
    expect(() =>
      resolveBattleProfilePrecedence(
        [
          { document: document('Core', 'battle-profiles', '2026-10-28'), facts: [regiment('X', 1)] },
          {
            document: document('Supplement', 'battle-profile-supplement', '2026-10-28'),
            facts: [regiment('X', 2)],
          },
        ],
        new Set()
      )
    ).toThrow(/same date/)
  })

  it('fails closed on a document it cannot order', () => {
    expect(() =>
      resolveBattleProfilePrecedence(
        [{ document: document('Undated', 'battle-profiles'), facts: [regiment('X', 1)] }],
        new Set()
      )
    ).toThrow(/no reviewed publicationDate/)
  })
})
