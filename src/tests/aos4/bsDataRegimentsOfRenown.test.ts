import { extractBsDataRegimentsOfRenown, mergeBsDataRegimentsOfRenown } from '../../aos4/data/bsdata'
import type { GamesWorkshopRegimentOfRenownFact } from '../../aos4/data/gamesWorkshop'
import type { WahapediaDataset, WahapediaWarscrollRecord } from '../../aos4/data/wahapedia'
import type { WahapediaHtmlReconciliation } from '../../aos4/data/wahapediaHtml'

/**
 * Krong the Club (issue #1999) is the first Regiment of Renown whose rules text no Wahapedia page
 * carries. BSData's `Regiments of Renown.cat` does: the regiment is an `upgrade` selection entry
 * carrying its two abilities, and the member is an entry link the regiment's force unhides with a
 * min = max = N constraint. The fixture mirrors the pinned catalogue's shape (commit `8836d9f9`,
 * lines 2245-2269 and 6379-6420) with a second regiment beside it so extraction provably stays
 * scoped to the reviewed name.
 */

const CHECKSUM = 'b'.repeat(64)
const ROR_CATALOGUE_ID = '1ed8-2e23-1563-c119'
const encode = (value: string): Uint8Array => new TextEncoder().encode(value)

interface FixtureOptions {
  catalogueId?: string
  krongEntries?: number
  krongProfiles?: boolean
  krongMemberLink?: boolean
  krongMemberMax?: number
}

const krongEntry = (profiles: boolean): string => `
    <selectionEntry name="Regiment of Renown: Krong the Club" id="b1c8-8c01-a823-68c2" hidden="true" type="upgrade">
      <modifiers>
        <modifier field="hidden" type="set" value="false">
          <conditions>
            <condition childId="force-krong" field="selections" scope="force" shared="true" type="instanceOf" value="1"/>
          </conditions>
        </modifier>
      </modifiers>
      ${
        profiles
          ? `<profiles>
        <profile name="Devastating Collapse" id="d16b" hidden="false" typeName="Ability (Passive)">
          <attributes>
            <attribute name="Color">Red</attribute>
            <attribute name="Type">Offensive</attribute>
          </attributes>
          <characteristics>
            <characteristic name="Keywords"/>
            <characteristic name="Effect">When the unit in this Regiment of Renown is destroyed, before removing it from play, you and your opponent must roll off. If you roll higher, inflict 3 mortal damage on each unit (friendly and enemy) within its combat range.</characteristic>
          </characteristics>
        </profile>
        <profile name="Jump Up and Down" id="e9d5" hidden="false" typeName="Ability (Activated)">
          <characteristics>
            <characteristic name="Timing">Once Per Turn (Army), Any Combat Phase</characteristic>
            <characteristic name="Declare">If the unit in this Regiment of Renown charged this turn, pick an enemy unit in combat with it to be the target.</characteristic>
            <characteristic name="Effect">Roll a dice for each model in the target unit. Add 1 to each roll if the target is contesting an objective you do not control. For each 6+, inflict 1 mortal damage on the target. Then, if any of the rolls were an unmodified 1, resolve the effect of the &apos;Devastating Collapse&apos; ability as if the unit in this Regiment of Renown had been destroyed (it is neither destroyed nor removed from play).</characteristic>
            <characteristic name="Keywords">**^^Rampage^^**</characteristic>
            <characteristic name="Used By"/>
          </characteristics>
        </profile>
      </profiles>`
          : ''
      }
    </selectionEntry>`

const memberLink = (name: string, force: string, max: number): string => `
    <entryLink name="${name}" id="link-${force}" hidden="true" targetId="unit-${force}" type="selectionEntry">
      <constraints>
        <constraint id="min-${force}" field="selections" scope="force" shared="true" type="min" value="0"/>
        <constraint id="max-${force}" field="selections" scope="force" shared="true" type="max" value="0"/>
      </constraints>
      <modifierGroups>
        <modifierGroup type="and">
          <conditions>
            <condition childId="${force}" field="selections" scope="force" shared="true" type="instanceOf" value="1"/>
          </conditions>
          <modifiers>
            <modifier field="min-${force}" type="set" value="1"/>
            <modifier field="max-${force}" type="set" value="${max}"/>
            <modifier field="hidden" type="set" value="false"/>
          </modifiers>
        </modifierGroup>
      </modifierGroups>
    </entryLink>`

const fixture = ({
  catalogueId = ROR_CATALOGUE_ID,
  krongEntries = 1,
  krongProfiles = true,
  krongMemberLink = true,
  krongMemberMax = 1,
}: FixtureOptions = {}): string => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue name="۞ Regiments of Renown" id="${catalogueId}" type="catalogue" xmlns="http://www.battlescribe.net/schema/catalogueSchema">
  <entryLinks>
    ${krongMemberLink ? memberLink('Mancrusher Gargant', 'force-krong', krongMemberMax) : ''}
    ${memberLink('Treelord', 'force-other', 1)}
  </entryLinks>
  <sharedSelectionEntries>
    ${Array.from({ length: krongEntries }, () => krongEntry(krongProfiles)).join('\n')}
    <selectionEntry name="Regiment of Renown: Other Regiment" id="other" hidden="true" type="upgrade">
      <modifiers>
        <modifier field="hidden" type="set" value="false">
          <conditions>
            <condition childId="force-other" field="selections" scope="force" shared="true" type="instanceOf" value="1"/>
          </conditions>
        </modifier>
      </modifiers>
      <profiles>
        <profile name="Other Ability" id="o-1" hidden="false" typeName="Ability (Passive)">
          <characteristics>
            <characteristic name="Effect">Something unrelated.</characteristic>
          </characteristics>
        </profile>
      </profiles>
    </selectionEntry>
  </sharedSelectionEntries>
</catalogue>
`

const codes = (options: FixtureOptions = {}): string[] =>
  extractBsDataRegimentsOfRenown(encode(fixture(options)), CHECKSUM, [
    { name: 'Krong the Club' },
  ]).diagnostics.map(diagnostic => diagnostic.code)

describe('BSData Regiment of Renown extraction (issue #1999, Krong the Club)', () => {
  it('extracts exactly the reviewed regiment: its two abilities and its member cross-check', () => {
    const extraction = extractBsDataRegimentsOfRenown(encode(fixture()), CHECKSUM, [
      { name: 'Krong the Club' },
    ])
    expect(extraction.diagnostics).toEqual([])
    expect(extraction.facts).toHaveLength(1)
    const [fact] = extraction.facts
    expect(fact).toMatchObject({
      kind: 'regiment-of-renown',
      name: 'Krong the Club',
      section: 'regiment:krong-the-club',
      members: [{ name: 'Mancrusher Gargant', count: 1 }],
    })
    expect(decodeURIComponent(String(fact.sourceRecordId))).toBe(
      `source-record:bsdata:${CHECKSUM}:regiment:krong-the-club`
    )
    expect(fact.factChecksum).toMatch(/^[0-9a-f]{64}$/)
    expect(
      fact.abilities.map(ability => [ability.name, ability.kind, ability.timing, ability.keywords])
    ).toEqual([
      ['Devastating Collapse', 'passive', '', []],
      ['Jump Up and Down', 'activated', 'Once Per Turn (Army), Any Combat Phase', ['RAMPAGE']],
    ])
    const jump = fact.abilities[1]
    expect(jump.declare).toBe(
      'If the unit in this Regiment of Renown charged this turn, pick an enemy unit in combat with it to be the target.'
    )
    expect(jump.effect).toContain("resolve the effect of the 'Devastating Collapse' ability")
    // Builder metadata (`Color`, `Type`) is never a rules fact.
    expect(JSON.stringify(fact)).not.toMatch(/Offensive|"Red"/)
    // The unrelated regiment beside it neither leaks its abilities nor its member.
    expect(JSON.stringify(fact)).not.toMatch(/Other Ability|Treelord/)
  })

  it('is repeatable: the same bytes give the same checksums', () => {
    const first = extractBsDataRegimentsOfRenown(encode(fixture()), CHECKSUM, [{ name: 'Krong the Club' }])
    const second = extractBsDataRegimentsOfRenown(encode(fixture()), CHECKSUM, [{ name: 'Krong the Club' }])
    expect(second).toEqual(first)
  })

  it('fails closed on every missing or ambiguous source shape', () => {
    expect(codes({ krongEntries: 0 })).toEqual(['regiment-not-found'])
    expect(codes({ krongEntries: 2 })).toEqual(['duplicate-regiment'])
    expect(codes({ krongProfiles: false })).toEqual(['missing-regiment-ability'])
    expect(codes({ krongMemberLink: false })).toEqual(['missing-regiment-member'])
    expect(codes({ krongMemberMax: 2 })).toEqual(['ambiguous-regiment-member'])
    expect(codes({ catalogueId: 'aaaa-bbbb-cccc-dddd' })).toEqual(['regiment-catalogue-mismatch'])
  })
})

describe('BSData Regiment of Renown merge (issue #1999, Krong the Club)', () => {
  const artifact = {
    requestUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Regiments%20of%20Renown.cat',
    finalUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Regiments%20of%20Renown.cat',
    redirectChain: [],
    retrievedAt: '2026-09-23T00:00:00.000Z',
    adapterVersion: 'bsdata-cat/1',
    mediaType: 'text/plain',
    byteLength: 1,
    checksum: CHECKSUM,
  }
  const PAGE_FIVE = 'source-record:games-workshop:regiments-of-renown-pack:page:5' as never
  const official = (
    overrides: Partial<GamesWorkshopRegimentOfRenownFact> = {}
  ): GamesWorkshopRegimentOfRenownFact => ({
    kind: 'regiment-of-renown',
    key: 'page:3:regiment-of-renown:4',
    page: 3,
    row: 4,
    faction: 'Regiments of Renown',
    context: 'standard',
    name: 'Krong the Club',
    points: 140,
    unitSummary: ['• 1 Mancrusher Gargant'],
    notes: [
      'This Regiment of Renown can be included in the following factions: Blades of Khorne, Ironjawz, Skaven.',
    ],
    sourceRecordId: 'source-record:games-workshop:battle-profiles-sob:page:3' as never,
    factChecksum: 'official-krong',
    ...overrides,
  })
  const meta = (sourceRecordId: string, kinds: Array<'standard' | 'spearhead'>) =>
    ({ sourceRecordId, rulesContextKinds: kinds }) as never
  const warscroll = (
    id: string,
    name: string,
    factionId: string,
    kinds: Array<'standard' | 'spearhead'>,
    extra: Partial<WahapediaWarscrollRecord> = {}
  ): WahapediaWarscrollRecord =>
    ({
      id,
      name,
      factionId,
      move: '8"',
      save: '5+',
      control: '5',
      health: '12',
      meta: meta(`source-record:test:${id}`, kinds),
      ...extra,
    }) as unknown as WahapediaWarscrollRecord
  const otherRegiment = warscroll('html-other', 'Other Regiment', 'SKV', ['standard'], {
    regimentOfRenown: true,
    regimentOfRenownMemberIds: ['bsdata-mancrusher'],
    move: '',
    save: '',
    control: '',
    health: '',
  })
  const dataset = (warscrolls: WahapediaWarscrollRecord[] = []): WahapediaDataset =>
    ({
      factions: [
        { id: 'BOK', name: 'Blades of Khorne', link: '', meta: {} as never },
        { id: 'IJ', name: 'Ironjawz', link: '', meta: {} as never },
        { id: 'SKV', name: 'Skaven', link: '', meta: {} as never },
        { id: 'SOB', name: 'Sons of Behemat', link: '', meta: {} as never },
      ],
      warscrolls: [
        warscroll('bsdata-mancrusher', 'Mancrusher Gargant', 'SOB', ['standard']),
        warscroll('html-spearhead-mancrusher', 'Mancrusher Gargant', 'SOB', ['spearhead']),
        otherRegiment,
        ...warscrolls,
      ],
      warscrollAbilities: [],
      regimentOfRenownFactions: [
        {
          warscrollId: 'html-other',
          factionId: 'SKV',
          meta: { sourceRecordId: 'source-record:test:avail' } as never,
        },
      ],
    }) as unknown as WahapediaDataset
  const reconciliation: WahapediaHtmlReconciliation = {
    schemaVersion: 1,
    pages: 0,
    matchedOfficialUnitFacts: 7,
    unmatchedOfficialUnitFacts: [],
    discrepancies: [],
  }
  const extracted = () =>
    extractBsDataRegimentsOfRenown(encode(fixture()), CHECKSUM, [{ name: 'Krong the Club' }]).facts
  const merge = (input: WahapediaDataset, officialFacts: GamesWorkshopRegimentOfRenownFact[]) =>
    mergeBsDataRegimentsOfRenown(
      input,
      reconciliation,
      [{ artifact, repository: 'BSData/test', facts: extracted(), officialSourceRecordIds: [PAGE_FIVE] }],
      officialFacts
    )

  it('takes rules text from BSData and identity, inclusion, membership, and points from the official fact', () => {
    const input = dataset()
    const before = JSON.stringify(input)
    const merged = merge(input, [official()])
    const regiment = merged.dataset.warscrolls.find(record => record.name === 'Krong the Club')!
    expect(regiment).toMatchObject({
      regimentOfRenown: true,
      name: 'Krong the Club',
      // The member's faction carries the record; generation never lets a regiment's carrier
      // offer it.
      factionId: 'SOB',
      cost: '140',
      // The current-standard gargant, never its Spearhead twin.
      regimentOfRenownMemberIds: ['bsdata-mancrusher'],
      move: '',
    })
    expect(regiment.id).toMatch(/^bsdata-[0-9a-f]{16}$/)
    expect(regiment.meta.rulesContextKinds).toEqual(['standard'])
    expect(decodeURIComponent(String(regiment.meta.identitySourceRecordId))).toBe(
      'source-record:bsdata:BSData/test:regiment:krong-the-club'
    )
    expect(regiment.meta.officialSourceRecordIds).toEqual([official().sourceRecordId, PAGE_FIVE].sort())
    expect(
      merged.dataset.regimentOfRenownFactions
        .filter(record => record.warscrollId === regiment.id)
        .map(record => record.factionId)
        .sort()
    ).toEqual(['BOK', 'IJ', 'SKV'])
    expect(
      merged.dataset.warscrollAbilities
        .filter(record => record.warscrollId === regiment.id)
        .map(record => [record.name, record.abilityType, record.conditionHtml, record.keywordsHtml])
    ).toEqual([
      ['Devastating Collapse', 'Ability (Passive)', 'Passive', ''],
      ['Jump Up and Down', 'Ability (Activated)', 'Once Per Turn (Army), Any Combat Phase', 'RAMPAGE'],
    ])
    // Nothing else moved: the unrelated regiment, its member, and its availability are untouched,
    // the input is not mutated, and regiment rows never count as matched official unit facts.
    expect(merged.dataset.warscrolls.filter(record => record.name !== 'Krong the Club')).toEqual(
      input.warscrolls
    )
    expect(
      merged.dataset.regimentOfRenownFactions.filter(record => record.warscrollId === 'html-other')
    ).toEqual(input.regimentOfRenownFactions)
    expect(JSON.stringify(input)).toBe(before)
    expect(merged.reconciliation.matchedOfficialUnitFacts).toBe(7)
  })

  it('fails closed without exactly one effective official anchor', () => {
    expect(() => merge(dataset(), [])).toThrow(/official regiment-of-renown fact/)
    expect(() => merge(dataset(), [official(), official({ key: 'page:9:regiment-of-renown:1' })])).toThrow(
      /official regiment-of-renown fact/
    )
  })

  it('fails closed on an inclusion list it cannot resolve exactly', () => {
    expect(() =>
      merge(dataset(), [
        official({
          notes: [
            'This Regiment of Renown can be included in the following factions: Ironjawz, Legion of the First Prince.',
          ],
        }),
      ])
    ).toThrow(/unknown inclusion faction: Legion of the First Prince/)
    expect(() => merge(dataset(), [official({ notes: [] })])).toThrow(/inclusion/)
    expect(() => merge(dataset(), [official({ notes: ['Something else entirely.'] })])).toThrow(/inclusion/)
  })

  it('fails closed when the official organisation and the BSData member link disagree', () => {
    expect(() => merge(dataset(), [official({ unitSummary: ['• 2 Mancrusher Gargant'] })])).toThrow(/members/)
    expect(() => merge(dataset(), [official({ unitSummary: ['• 1 Gatebreaker Mega-Gargant'] })])).toThrow(
      /members/
    )
  })

  it('fails closed unless the member resolves to exactly one current-standard warscroll', () => {
    const spearheadOnly = {
      ...dataset(),
      warscrolls: dataset().warscrolls.filter(record => record.id !== 'bsdata-mancrusher'),
    } as WahapediaDataset
    expect(() => merge(spearheadOnly, [official()])).toThrow(/current-standard warscroll/)
    const twice = dataset([warscroll('html-second-mancrusher', 'Mancrusher Gargant', 'SOB', ['standard'])])
    expect(() => merge(twice, [official()])).toThrow(/current-standard warscroll/)
  })

  it('refuses to add a second source for a regiment Wahapedia already classifies', () => {
    const duplicate = dataset([
      warscroll('html-krong', 'Krong the Club', 'BOK', ['standard'], {
        regimentOfRenown: true,
        move: '',
        save: '',
        control: '',
        health: '',
      }),
    ])
    expect(() => merge(duplicate, [official()])).toThrow(/duplicate-regiment-of-renown-source/)
  })
})
