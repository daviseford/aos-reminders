import { readFileSync } from 'node:fs'
import path from 'node:path'
import { extractBsDataWarscrolls, mergeBsDataWarscrolls, parseXmlDocument } from '../../aos4/data/bsdata'
import type { GamesWorkshopUnitProfileFact } from '../../aos4/data/gamesWorkshop'
import type { WahapediaDataset } from '../../aos4/data/wahapedia'
import type { WahapediaHtmlReconciliation } from '../../aos4/data/wahapediaHtml'
import type { CorpusCommunityWarscrollSource } from '../../aos4/generate/corpus'

const FIXTURE = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue library="true" name="Test - Library" type="catalogue">
  <sharedSelectionEntries>
    <selectionEntry type="unit" import="true" name="Testfist Brute" hidden="false" id="a-1">
      <entryLinks>
        <entryLink import="true" name="General" hidden="false" id="e-1" type="selectionEntry" targetId="t-1"/>
      </entryLinks>
      <profiles>
        <profile name="Testfist Brute" typeName="Unit" hidden="false" id="p-1">
          <characteristics>
            <characteristic name="Move">6&quot;</characteristic>
            <characteristic name="Health">8</characteristic>
            <characteristic name="Save">4+</characteristic>
            <characteristic name="Control">3</characteristic>
          </characteristics>
        </profile>
        <profile name="Iron Hide" typeName="Ability (Passive)" hidden="false" id="p-2">
          <characteristics>
            <characteristic name="Keywords"/>
            <characteristic name="Effect">Add 1 to save rolls for combat attacks that target this unit.</characteristic>
          </characteristics>
        </profile>
        <profile name="Test Smash" typeName="Ability (Activated)" hidden="false" id="p-3">
          <characteristics>
            <characteristic name="Timing">Once Per Turn (Army), Any Combat Phase</characteristic>
            <characteristic name="Declare">Pick a visible **^^Testers^^** unit within 3&quot; of this unit.</characteristic>
            <characteristic name="Effect">Roll a dice. On a 2+, inflict D3 mortal damage on the target.</characteristic>
            <characteristic name="Keywords">**^^Rampage^^**</characteristic>
          </characteristics>
        </profile>
        <profile name="Test Bolt" typeName="Ability (Spell)" hidden="false" id="p-4">
          <characteristics>
            <characteristic name="Timing">Your Hero Phase</characteristic>
            <characteristic name="Casting Value">6</characteristic>
            <characteristic name="Declare">Pick a visible enemy unit, then make a casting roll of 2D6.</characteristic>
            <characteristic name="Effect">Inflict D3 mortal damage on the target.</characteristic>
            <characteristic name="Keywords">**^^Spell^^**</characteristic>
          </characteristics>
        </profile>
      </profiles>
      <categoryLinks>
        <categoryLink name="HERO" hidden="false" id="c-1" targetId="ct-1" primary="true"/>
        <categoryLink name="TESTERS" hidden="false" id="c-2" targetId="ct-2" primary="false"/>
        <categoryLink name="WARD (5+)" hidden="false" id="c-3" targetId="ct-3" primary="false"/>
      </categoryLinks>
      <selectionEntries>
        <selectionEntry type="model" import="true" name="Testfist Brute" hidden="false" id="m-1">
          <selectionEntries>
            <selectionEntry type="upgrade" import="true" name="Big Club" hidden="false" id="u-1">
              <profiles>
                <profile name="Big Club" typeName="Melee Weapon" hidden="false" id="w-1">
                  <characteristics>
                    <characteristic name="Atk">5</characteristic>
                    <characteristic name="Hit">3+</characteristic>
                    <characteristic name="Wnd">3+</characteristic>
                    <characteristic name="Rnd">1</characteristic>
                    <characteristic name="Dmg">2</characteristic>
                    <characteristic name="Ability">Crit (Mortal)</characteristic>
                  </characteristics>
                </profile>
              </profiles>
            </selectionEntry>
          </selectionEntries>
          <rules>
            <rule name="Base Size" id="r-1" hidden="true">
              <description>60mm</description>
            </rule>
          </rules>
        </selectionEntry>
      </selectionEntries>
    </selectionEntry>
  </sharedSelectionEntries>
</catalogue>
`

const CHECKSUM = 'f'.repeat(64)

const encode = (value: string): Uint8Array => new TextEncoder().encode(value)

describe('BSData community-tier catalogue extraction', () => {
  it('reads well-formed catalogue XML including self-closing elements and entities', () => {
    const parsed = parseXmlDocument(FIXTURE)
    expect(parsed.errors).toEqual([])
    expect(parsed.root?.name).toBe('catalogue')
  })

  it('fails loudly on malformed XML instead of guessing', () => {
    const parsed = parseXmlDocument('<catalogue><selectionEntry></catalogue>')
    expect(parsed.root).toBeUndefined()
    expect(parsed.errors.length).toBeGreaterThan(0)
  })

  it('extracts characteristics, abilities, weapons, keywords, and bases for named units only', () => {
    const result = extractBsDataWarscrolls(encode(FIXTURE), CHECKSUM, ['Testfist Brute'])
    expect(result.diagnostics).toEqual([])
    expect(result.facts).toHaveLength(1)
    const fact = result.facts[0]
    expect(fact.section).toBe('unit:testfist-brute')
    expect(fact.characteristics).toEqual({ move: '6"', save: '4+', control: '3', health: '8' })
    expect(fact.keywords).toEqual(['HERO', 'TESTERS', 'WARD (5+)'])
    expect(fact.baseSizes).toEqual(['60mm'])
    expect(fact.weapons).toEqual([
      expect.objectContaining({
        name: 'Big Club',
        weaponType: 'melee',
        attacks: '5',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '2',
        abilityLabels: ['Crit (Mortal)'],
      }),
    ])
    const abilityNames = fact.abilities.map(ability => `${ability.name}:${ability.kind}`)
    expect(abilityNames).toEqual(['Iron Hide:passive', 'Test Smash:activated', 'Test Bolt:spell'])
    const smash = fact.abilities[1]
    // BSData markup (**bold**, ^^smallcaps^^) is stripped to plain text.
    expect(smash.declare).toBe('Pick a visible Testers unit within 3" of this unit.')
    expect(smash.timing).toBe('Once Per Turn (Army), Any Combat Phase')
    expect(smash.keywords).toEqual(['RAMPAGE'])
    const bolt = fact.abilities[2]
    expect(bolt.costValue).toBe(6)
    // Extraction is deterministic: the same bytes always produce the same fact checksum.
    const again = extractBsDataWarscrolls(encode(FIXTURE), CHECKSUM, ['Testfist Brute'])
    expect(again.facts[0].factChecksum).toBe(fact.factChecksum)
  })

  it('reports a missing unit instead of silently extracting nothing', () => {
    const result = extractBsDataWarscrolls(encode(FIXTURE), CHECKSUM, ['Absent Unit'])
    expect(result.facts).toEqual([])
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: 'unit-not-found', severity: 'error' }),
    ])
  })

  it('merges community facts with official facts winning every overlapping field', () => {
    const extraction = extractBsDataWarscrolls(encode(FIXTURE), CHECKSUM, ['Testfist Brute'])
    const official: GamesWorkshopUnitProfileFact = {
      kind: 'unit',
      key: 'page:1:unit:1',
      page: 1,
      row: 1,
      faction: 'Test Faction',
      context: 'standard',
      name: 'Testfist Brute',
      unitSize: 3,
      points: 210,
      regimentOptions: ['Any Testers'],
      relevantKeywords: [],
      notes: ['This unit cannot be reinforced.'],
      baseSizes: ['60 × 35mm'],
      sourceRecordId: 'source-record:games-workshop:official-page' as never,
      factChecksum: 'official-fact',
    }
    const dataset = {
      factions: [{ id: 'TF', name: 'Test Faction', link: '', meta: {} as never }],
      warscrolls: [],
      warscrollAbilities: [],
      warscrollWeapons: [],
      warscrollKeywords: [],
      warscrollBases: [],
    } as unknown as WahapediaDataset
    const reconciliation: WahapediaHtmlReconciliation = {
      schemaVersion: 1,
      pages: 0,
      matchedOfficialUnitFacts: 0,
      unmatchedOfficialUnitFacts: [
        {
          factChecksum: 'official-fact',
          sourceRecordId: official.sourceRecordId,
          faction: official.faction,
          context: 'standard',
          name: official.name,
          unitSize: official.unitSize,
          points: official.points,
          reason: 'test',
        },
      ],
      discrepancies: [],
    }
    const merged = mergeBsDataWarscrolls(
      dataset,
      reconciliation,
      [
        {
          artifact: {
            requestUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Test.cat',
            finalUrl: 'https://raw.githubusercontent.com/BSData/test/abc/Test.cat',
            redirectChain: [],
            retrievedAt: '2026-08-01T00:00:00.000Z',
            adapterVersion: 'bsdata-cat/1',
            mediaType: 'text/plain',
            byteLength: FIXTURE.length,
            checksum: CHECKSUM,
          },
          repository: 'BSData/test',
          facts: extraction.facts,
          officialSourceRecordIds: [official.sourceRecordId],
        },
      ],
      [official]
    )
    const warscroll = merged.dataset.warscrolls[0]
    // Official facts win: unit size, points, regiment options, and notes come from the official
    // battle profile; BSData supplies only characteristics, keywords, abilities, and weapons.
    expect(warscroll).toMatchObject({
      name: 'Testfist Brute',
      unitSize: '3',
      cost: '210',
      regimentOptions: 'Any Testers',
      move: '6"',
    })
    expect(warscroll.meta.officialSourceRecordIds).toEqual([official.sourceRecordId])
    // Identity aliases are keyed on the repository and section, not the artifact checksum, so a
    // refreshed BSData commit keeps the same canonical entities.
    expect(decodeURIComponent(String(warscroll.meta.identitySourceRecordId))).toBe(
      'source-record:bsdata:BSData/test:unit:testfist-brute'
    )
    expect(merged.dataset.warscrollBases[0].base).toBe('60 × 35mm')
    expect(merged.reconciliation.matchedOfficialUnitFacts).toBe(1)
    expect(merged.reconciliation.unmatchedOfficialUnitFacts).toEqual([])
    // The BSData/official base-size disagreement is preserved as a logged discrepancy.
    expect(merged.reconciliation.discrepancies).toEqual([
      expect.objectContaining({ field: 'baseSizes', official: '60 × 35mm', secondary: '60mm' }),
    ])
  })

  it('refuses community facts that no official publication establishes', () => {
    const extraction = extractBsDataWarscrolls(encode(FIXTURE), CHECKSUM, ['Testfist Brute'])
    expect(() =>
      mergeBsDataWarscrolls(
        {
          factions: [],
          warscrolls: [],
          warscrollAbilities: [],
          warscrollWeapons: [],
          warscrollKeywords: [],
          warscrollBases: [],
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
            artifact: { checksum: CHECKSUM, finalUrl: 'https://example.invalid/x' } as never,
            repository: 'BSData/test',
            facts: extraction.facts,
            officialSourceRecordIds: [],
          },
        ],
        []
      )
    ).toThrow(/no matching effective official unit fact/)
  })
})

describe('the standing fallback-tier policy record in the accepted review', () => {
  const review = JSON.parse(
    readFileSync(path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-08-01e.json'), 'utf8')
  ) as { communityWarscrollSources: CorpusCommunityWarscrollSource[] }

  it('records every community source as commit-pinned, provisional, scoped, and owner-authorized', () => {
    expect(review.communityWarscrollSources).toHaveLength(2)
    review.communityWarscrollSources.forEach(source => {
      expect(source.policyTier).toBe('community-fallback')
      expect(source.status).toBe('provisional-pending-official-verification')
      expect(source.commit).toMatch(/^[0-9a-f]{40}$/)
      expect(source.artifact.finalUrl).toContain(`/${source.commit}/`)
      expect(source.title).toMatch(/provisional/i)
      expect(source.repository).toBe('BSData/age-of-sigmar-4th')
      expect(source.authorizedBy).toMatch(/owner/i)
      expect(source.reason.trim()).not.toBe('')
      expect(source.verificationCondition).toMatch(/wahapedia|official/i)
      expect(source.officialSourceRecordIds.length).toBeGreaterThan(0)
      source.officialSourceRecordIds.forEach(id => expect(id).toMatch(/^source-record:games-workshop:/))
      // Each source is scoped to named units or named faction options, never taken wholesale.
      expect(source.units.length + (source.factionOptions ?? []).length).toBeGreaterThan(0)
      source.units.forEach(unit => expect(unit.recordChecksum).toMatch(/^[0-9a-f]{64}$/))
      ;(source.factionOptions ?? []).forEach(option =>
        expect(option.recordChecksum).toMatch(/^[0-9a-f]{64}$/)
      )
    })
    // Lorai retired from the community tier when Wahapedia published her datasheet (2026-08-01d).
    const unitNames = review.communityWarscrollSources.flatMap(source => source.units.map(unit => unit.name))
    expect(unitNames).toHaveLength(10)
    expect(unitNames).toContain('Redd the Maw, High Slaughtermaster')
    expect(unitNames).not.toContain('Lorai, Child of the Abyss')
    const optionNames = review.communityWarscrollSources.flatMap(source =>
      (source.factionOptions ?? []).map(option => option.name)
    )
    expect(optionNames).toHaveLength(10)
    expect(optionNames).toContain('Hunger-Filled Tribe')
  })
})
