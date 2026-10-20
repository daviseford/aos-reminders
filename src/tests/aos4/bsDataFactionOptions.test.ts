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

describe('BSData faction options for a faction with no faction page (#1757)', () => {
  const dataset = (withType: boolean): WahapediaDataset =>
    ({
      factions: [
        { id: 'FYR', name: 'Fyreslayers', link: '', meta: {} as never },
        { id: 'GW-KHZ', name: 'Khazalite Holds', link: '', meta: {} as never },
      ],
      factionAbilityTypes: withType
        ? [
            {
              factionId: 'GW-KHZ',
              id: 'type-rampages',
              name: 'Realm-shaking Rampages',
              descriptionHtml: '',
              meta: { sourceRecordId: 'source-record:wahapedia:khz-rampages-type' } as never,
            },
          ]
        : [],
      factionAbilitySubtypes: [],
      factionAbilities: [],
    }) as unknown as WahapediaDataset

  const reconciliation: WahapediaHtmlReconciliation = {
    schemaVersion: 1,
    pages: 0,
    matchedOfficialUnitFacts: 0,
    unmatchedOfficialUnitFacts: [],
    discrepancies: [],
  }

  // The same option name printed for two factions, as Khazalite Holds re-publishes Fyreslayers rows.
  const official = (faction: string, name: string): GamesWorkshopRosterOptionFact => ({
    kind: 'roster-option',
    key: `page:2:roster-option:${faction}:${name}`,
    page: 2,
    row: 1,
    faction,
    context: 'standard',
    optionType: 'Realm-shaking Rampage',
    name,
    points: 20,
    notes: [],
    sourceRecordId: `source-record:games-workshop:${faction}:${name}` as never,
    factChecksum: `official-${faction}-${name}`,
  })
  const officialFacts = ['Fyreslayers', 'Khazalite Holds'].flatMap(faction => [
    official(faction, 'Battered Shrimp'),
    official(faction, 'Colossal Slam'),
  ])

  const extracted = extractBsDataFactionOptions(
    encode(catalogue('Pick a point within 12" and inflict D6 mortal damage to units within 3".')),
    CHECKSUM,
    [
      { name: 'Battered Shrimp', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
      { name: 'Colossal Slam', optionType: 'realm-shaking-rampage', groupName: 'Realm-shaking Rampages' },
    ]
  )

  const merge = (input: { faction?: string; createsTypeSections?: string[] }, withType = false) =>
    mergeBsDataFactionOptions(
      dataset(withType),
      reconciliation,
      [
        {
          artifact: {
            requestUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Khazalite.cat',
            finalUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Khazalite.cat',
            redirectChain: [],
            retrievedAt: '2026-10-20T00:00:00.000Z',
            adapterVersion: 'bsdata-cat/1',
            mediaType: 'text/plain',
            byteLength: 1,
            checksum: CHECKSUM,
          },
          repository: 'BSData/age-of-sigmar-4th',
          facts: extracted.facts,
          officialSourceRecordIds: [officialFacts[2].sourceRecordId],
          ...input,
        },
      ],
      officialFacts
    )
  const sections = extracted.facts.map(fact => fact.section)

  it('refuses to guess between same-name official rows of two factions', () => {
    expect(() => merge({ createsTypeSections: sections })).toThrow(/matches 2 effective official/)
  })

  it('creates one officially anchored group for the reviewed faction and attaches every option to it', () => {
    const merged = merge({ faction: 'Khazalite Holds', createsTypeSections: sections })
    const created = merged.dataset.factionAbilityTypes
    expect(created).toHaveLength(1)
    expect(created[0]).toMatchObject({ factionId: 'GW-KHZ', name: 'Realm-shaking Rampages' })
    expect(created[0].meta.officialSourceRecordIds).toEqual([
      'source-record:games-workshop:Khazalite Holds:Battered Shrimp',
    ])
    expect(merged.dataset.factionAbilities).toHaveLength(2)
    merged.dataset.factionAbilities.forEach(ability => {
      expect(ability.factionId).toBe('GW-KHZ')
      expect(ability.typeId).toBe(created[0].id)
    })
  })

  it('fails closed when a created group would shadow a faction-page record', () => {
    expect(() => merge({ faction: 'Khazalite Holds', createsTypeSections: sections }, true)).toThrow(
      /already has a faction-page record/
    )
  })

  it('still requires a faction-page record when the review does not create the group', () => {
    expect(() => merge({ faction: 'Khazalite Holds' })).toThrow(/matches 0 Realm-shaking Rampages groups/)
  })
})

describe('BSData seasonal options and group pins (#1757)', () => {
  const twoLores = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue library="true" name="Test - Lores" type="catalogue">
  <sharedSelectionEntryGroups>
    ${['old', 'new']
      .map(
        version => `<selectionEntryGroup name="Gifts" id="g-${version}" hidden="false">
      <selectionEntries>
        <selectionEntry type="upgrade" name="Gift" id="e-${version}" hidden="false">
          <profiles>
            <profile name="Gift" typeName="Ability (Prayer)" id="p-${version}" hidden="false">
              <characteristics>
                <characteristic name="Timing">Your Hero Phase</characteristic>
                <characteristic name="Chanting Value">4</characteristic>
                <characteristic name="Effect">The ${version} effect.</characteristic>
                <characteristic name="Keywords"/>
              </characteristics>
            </profile>
          </profiles>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>`
      )
      .join('\n')}
  </sharedSelectionEntryGroups>
</catalogue>
`
  const spec = { name: 'Gifts', optionType: 'prayer-lore' as const, groupName: 'Gifts' }

  it('reads only the pinned group when a catalogue repeats a lore name with different rules', () => {
    expect(extractBsDataFactionOptions(encode(twoLores), CHECKSUM, [spec]).diagnostics).toEqual([
      expect.objectContaining({ code: 'duplicate-option' }),
    ])
    const pinned = extractBsDataFactionOptions(encode(twoLores), CHECKSUM, [{ ...spec, groupId: 'g-new' }])
    expect(pinned.diagnostics).toEqual([])
    expect(pinned.facts[0].abilities[0].effect).toBe('The new effect.')
  })

  it('anchors a seasonal option on the seasonal official row and offers it seasonally only', () => {
    const facts = extractBsDataFactionOptions(encode(twoLores), CHECKSUM, [
      { ...spec, groupId: 'g-new' },
    ]).facts
    const officialLore = (context: 'standard' | 'seasonal'): GamesWorkshopRosterOptionFact => ({
      kind: 'roster-option',
      key: `page:2:roster-option:${context}`,
      page: 2,
      row: 1,
      faction: 'Khazalite Holds',
      context,
      optionType: 'Prayer Lore',
      name: 'Gifts',
      points: 0,
      notes: [],
      sourceRecordId: `source-record:games-workshop:${context}` as never,
      factChecksum: `official-${context}`,
    })
    const merged = mergeBsDataFactionOptions(
      {
        factions: [{ id: 'GW-KHZ', name: 'Khazalite Holds', link: '', meta: {} as never }],
        factionAbilityTypes: [],
        factionAbilitySubtypes: [],
        factionAbilities: [],
      } as unknown as WahapediaDataset,
      {
        schemaVersion: 1,
        pages: 0,
        matchedOfficialUnitFacts: 0,
        unmatchedOfficialUnitFacts: [],
        discrepancies: [],
      },
      [
        {
          artifact: { checksum: CHECKSUM, finalUrl: 'https://example.invalid/Lores.cat' } as never,
          repository: 'BSData/age-of-sigmar-4th',
          facts,
          officialSourceRecordIds: ['source-record:games-workshop:seasonal' as never],
          faction: 'Khazalite Holds',
          createsTypeSections: [facts[0].section],
          seasonalSections: [facts[0].section],
        },
      ],
      [officialLore('standard'), officialLore('seasonal')]
    )
    const [type] = merged.dataset.factionAbilityTypes
    const [subtype] = merged.dataset.factionAbilitySubtypes
    expect(type.meta.rulesContextKinds).toEqual(['seasonal'])
    expect(subtype.meta).toMatchObject({
      rulesContextKinds: ['seasonal'],
      officialSourceRecordIds: ['source-record:games-workshop:seasonal'],
    })
    merged.dataset.factionAbilities.forEach(ability =>
      expect(ability.meta.rulesContextKinds).toEqual(['seasonal'])
    )
  })
})

describe('BSData Army of Renown root for a faction with no faction page (#1757)', () => {
  const profile = (
    name: string,
    id: string
  ) => `<profile name="${name}" typeName="Ability (Passive)" id="${id}" hidden="false">
            <characteristics>
              <characteristic name="Effect">${name} effect.</characteristic>
              <characteristic name="Keywords"/>
            </characteristics>
          </profile>`
  const armyCatalogue = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue library="false" name="Test - Army" type="catalogue">
  <selectionEntries>
    <selectionEntry type="upgrade" name="Battle Traits: Test Army" id="bt" hidden="false">
      <profiles>
        ${profile('First Trait', 'p-1')}
        ${profile('Second Trait', 'p-2')}
      </profiles>
    </selectionEntry>
  </selectionEntries>
  <sharedSelectionEntryGroups>
    <selectionEntryGroup name="Heroic Traits: Test Army" id="g-h" hidden="false">
      <selectionEntries>
        <selectionEntry type="upgrade" name="Bold" id="e-h" hidden="false">
          <profiles>
            ${profile('Bold', 'p-3')}
          </profiles>
        </selectionEntry>
      </selectionEntries>
    </selectionEntryGroup>
  </sharedSelectionEntryGroups>
</catalogue>
`
  const facts = extractBsDataFactionOptions(encode(armyCatalogue), CHECKSUM, [
    {
      name: 'Battle Traits: Test Army',
      optionType: 'battle-trait',
      groupName: 'Battle Traits: Test Army',
      faction: 'Khazalite Holds',
    },
    { name: 'Bold', optionType: 'heroic-trait', groupName: 'Heroic Traits: Test Army' },
  ]).facts
  const merge = (faction?: string) =>
    mergeBsDataFactionOptions(
      {
        factions: [{ id: 'GW-KHZ', name: 'Khazalite Holds', link: '', meta: {} as never }],
        factionAbilityTypes: [],
        factionAbilitySubtypes: [],
        factionAbilities: [],
      } as unknown as WahapediaDataset,
      {
        schemaVersion: 1,
        pages: 0,
        matchedOfficialUnitFacts: 0,
        unmatchedOfficialUnitFacts: [],
        discrepancies: [],
      },
      [
        {
          artifact: { checksum: CHECKSUM, finalUrl: 'https://example.invalid/Army.cat' } as never,
          repository: 'BSData/age-of-sigmar-4th',
          facts,
          officialSourceRecordIds: ['source-record:games-workshop:battle-profiles' as never],
          armyOfRenown: 'Test Army',
          ...(faction ? { faction } : {}),
        },
      ],
      []
    )

  it('creates one marked root with a subgroup per option kind', () => {
    expect(facts).toHaveLength(2)
    const merged = merge('Khazalite Holds')
    expect(merged.dataset.factionAbilityTypes).toEqual([
      expect.objectContaining({ factionId: 'GW-KHZ', name: 'Test Army', armyOfRenown: true }),
    ])
    const [root] = merged.dataset.factionAbilityTypes
    expect(merged.dataset.factionAbilitySubtypes.map(subtype => [subtype.name, subtype.typeId])).toEqual([
      ['Battle Traits', root.id],
      ['Heroic Traits', root.id],
    ])
    expect(merged.dataset.factionAbilities.map(ability => [ability.subtypeName, ability.name])).toEqual([
      ['Battle Traits', 'First Trait'],
      ['Battle Traits', 'Second Trait'],
      ['Heroic Traits', 'Bold'],
    ])
  })

  it('fails closed without a reviewed source faction', () => {
    expect(() => merge()).toThrow(/needs a reviewed, known source faction/)
  })
})
