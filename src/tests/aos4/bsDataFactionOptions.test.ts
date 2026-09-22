import { extractBsDataFactionOptions, mergeBsDataFactionOptions } from '../../aos4/data/bsdata'
import type { GamesWorkshopRosterOptionFact } from '../../aos4/data/gamesWorkshop'
import type { WahapediaDataset } from '../../aos4/data/wahapedia'
import type { WahapediaHtmlReconciliation } from '../../aos4/data/wahapediaHtml'

const CHECKSUM = 'a'.repeat(64)
const encode = (value: string): Uint8Array => new TextEncoder().encode(value)

/**
 * A BSData battletome catalogue links a Realm-shaking Rampage option into every eligible hero's
 * own selection group, so the same option name and rules text legitimately appears more than once
 * under a `Realm-shaking Rampages` group name. This fixture models that shape with two separate
 * `selectionEntryGroup` elements sharing the group name (mirroring the existing "a seasonal and a
 * battletome group of the same name" ambiguity the extractor already searches across).
 */
const catalogue = (
  secondSlamEffect: string
): string => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue library="true" name="Test - Faction" type="catalogue">
  <sharedSelectionEntryGroups>
    <selectionEntryGroup name="Realm-shaking Rampages" id="g-1" hidden="false">
      <selectionEntries>
        <selectionEntry type="upgrade" name="Battered Shrimp" id="e-1" hidden="false">
          <profiles>
            <profile name="Battered Shrimp" typeName="Ability (Activated)" id="p-1" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">Pick an enemy unit within 12&quot; and inflict D3 mortal damage.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
        <selectionEntry type="upgrade" name="Colossal Slam" id="e-2" hidden="false">
          <profiles>
            <profile name="Colossal Slam" typeName="Ability (Activated)" id="p-2" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">Pick a point within 12&quot; and inflict D6 mortal damage to units within 3&quot;.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>
    <selectionEntryGroup name="Realm-shaking Rampages" id="g-2" hidden="false">
      <selectionEntries>
        <selectionEntry type="upgrade" name="Battered Shrimp" id="e-3" hidden="false">
          <profiles>
            <profile name="Battered Shrimp" typeName="Ability (Activated)" id="p-3" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">Pick an enemy unit within 12&quot; and inflict D3 mortal damage.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
        <selectionEntry type="upgrade" name="Colossal Slam" id="e-4" hidden="false">
          <profiles>
            <profile name="Colossal Slam" typeName="Ability (Activated)" id="p-4" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">${secondSlamEffect}</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>
  </sharedSelectionEntryGroups>
</catalogue>
`

describe('BSData Realm-shaking Rampage extraction: identical-duplicate collapse', () => {
  it('collapses an option repeated under identically-named groups when the rules text is identical', () => {
    const bytes = encode(
      catalogue('Pick a point within 12" and inflict D6 mortal damage to units within 3".')
    )
    const result = extractBsDataFactionOptions(bytes, CHECKSUM, [
      { name: 'Battered Shrimp', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
      { name: 'Colossal Slam', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
    ])
    expect(result.diagnostics).toEqual([])
    expect(result.facts).toHaveLength(2)
    const shrimp = result.facts.find(fact => fact.name === 'Battered Shrimp')
    expect(shrimp?.optionType).toBe('realm-shaking-rampage')
    expect(shrimp?.abilities).toHaveLength(1)
    expect(shrimp?.abilities[0].effect).toBe('Pick an enemy unit within 12" and inflict D3 mortal damage.')
  })

  it('fails closed instead of guessing when the repeated option carries differing rules text', () => {
    const bytes = encode(catalogue('A completely different effect that disagrees with the other copy.'))
    const result = extractBsDataFactionOptions(bytes, CHECKSUM, [
      { name: 'Colossal Slam', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
    ])
    expect(result.facts).toEqual([])
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: 'duplicate-option', severity: 'error' }),
    ])
    expect(result.diagnostics[0].message).toMatch(/differing rules text/)
  })
})

describe('BSData Realm-shaking Rampage merge into the current dataset', () => {
  const buildDataset = (): WahapediaDataset =>
    ({
      factions: [{ id: 'SOB', name: 'Sons of Behemat', link: '', meta: {} as never }],
      factionAbilityTypes: [
        {
          factionId: 'SOB',
          id: 'type-rampages',
          name: 'Realm-shaking Rampages',
          descriptionHtml: '',
          meta: { sourceRecordId: 'source-record:wahapedia:sob-rampages-type' } as never,
        },
      ],
      factionAbilitySubtypes: [],
      factionAbilities: [],
    }) as unknown as WahapediaDataset

  const emptyReconciliation: WahapediaHtmlReconciliation = {
    schemaVersion: 1,
    pages: 0,
    matchedOfficialUnitFacts: 0,
    unmatchedOfficialUnitFacts: [],
    discrepancies: [],
  }

  const officialRampage = (name: string): GamesWorkshopRosterOptionFact => ({
    kind: 'roster-option',
    key: `page:2:roster-option:${name}`,
    page: 2,
    row: 1,
    faction: 'Sons of Behemat',
    context: 'standard',
    optionType: 'Realm-shaking Rampage',
    name,
    points: 20,
    notes: [],
    sourceRecordId: `source-record:games-workshop:official-page:${name}` as never,
    factChecksum: `official-${name}`,
  })

  it('merges a collapsed realm-shaking-rampage option as a single ability card under a shared subtype', () => {
    const bytes = encode(
      catalogue('Pick a point within 12" and inflict D6 mortal damage to units within 3".')
    )
    const extracted = extractBsDataFactionOptions(bytes, CHECKSUM, [
      { name: 'Battered Shrimp', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
      { name: 'Colossal Slam', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
    ])
    expect(extracted.diagnostics).toEqual([])

    const official = [officialRampage('Battered Shrimp'), officialRampage('Colossal Slam')]
    const merged = mergeBsDataFactionOptions(
      buildDataset(),
      emptyReconciliation,
      [
        {
          artifact: {
            requestUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Sons.cat',
            finalUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Sons.cat',
            redirectChain: [],
            retrievedAt: '2026-09-20T00:00:00.000Z',
            adapterVersion: 'bsdata-cat/1',
            mediaType: 'text/plain',
            byteLength: 1,
            checksum: CHECKSUM,
          },
          repository: 'BSData/age-of-sigmar-4th',
          facts: extracted.facts,
          officialSourceRecordIds: [official[0].sourceRecordId],
        },
      ],
      official
    )
    expect(merged.dataset.factionAbilitySubtypes).toHaveLength(1)
    expect(merged.dataset.factionAbilitySubtypes[0].name).toBe('Realm-shaking Rampages')
    expect(merged.dataset.factionAbilities).toHaveLength(2)
    const names = merged.dataset.factionAbilities.map(ability => ability.name).sort()
    expect(names).toEqual(['Battered Shrimp', 'Colossal Slam'])
    merged.dataset.factionAbilities.forEach(ability => {
      expect(ability.subtypeId).toBe(merged.dataset.factionAbilitySubtypes[0].id)
      expect(ability.typeId).toBe('type-rampages')
    })
  })

  it('refuses a realm-shaking-rampage option that carries more than one ability', () => {
    const twoAbilityCatalogue = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue library="true" name="Test - Faction" type="catalogue">
  <sharedSelectionEntryGroups>
    <selectionEntryGroup name="Realm-shaking Rampages" id="g-1" hidden="false">
      <selectionEntries>
        <selectionEntry type="upgrade" name="Hammer Throw" id="e-1" hidden="false">
          <profiles>
            <profile name="Hammer Throw" typeName="Ability (Activated)" id="p-1" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">First effect.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
            <profile name="Hammer Throw (extra)" typeName="Ability (Activated)" id="p-2" hidden="false">
              <characteristics>
                <characteristic name="Timing">Once Per Battle (Army), Any Combat Phase</characteristic>
                <characteristic name="Effect">Second effect.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>
  </sharedSelectionEntryGroups>
</catalogue>
`
    const extracted = extractBsDataFactionOptions(encode(twoAbilityCatalogue), CHECKSUM, [
      { name: 'Hammer Throw', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
    ])
    expect(extracted.diagnostics).toEqual([])
    expect(() =>
      mergeBsDataFactionOptions(
        buildDataset(),
        emptyReconciliation,
        [
          {
            artifact: {
              requestUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Sons.cat',
              finalUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Sons.cat',
              redirectChain: [],
              retrievedAt: '2026-09-20T00:00:00.000Z',
              adapterVersion: 'bsdata-cat/1',
              mediaType: 'text/plain',
              byteLength: 1,
              checksum: CHECKSUM,
            },
            repository: 'BSData/age-of-sigmar-4th',
            facts: extracted.facts,
            officialSourceRecordIds: [officialRampage('Hammer Throw').sourceRecordId],
          },
        ],
        [officialRampage('Hammer Throw')]
      )
    ).toThrow(/exactly one ability card/)
  })
})
