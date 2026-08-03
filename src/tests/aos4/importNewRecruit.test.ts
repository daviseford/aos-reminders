// @vitest-environment jsdom

import fs from 'node:fs'
import path from 'node:path'

import { strToU8, zipSync } from 'fflate'

import type { ParsedRoster } from '../../aos4/import'
import {
  decodeAos4RosterFile,
  MAX_EXPANDED_ROSTER_BYTES,
  MAX_ROSTER_FILE_BYTES,
  MAX_ROSTER_JSON_DEPTH,
} from '../../importers'
import { parseRosterXml, xmlToRosterJson } from '../support/newRecruit'

/**
 * `units` adds entries to the force's own `<selections>`; `extra` appends a sibling container.
 *
 * The distinction only matters to the `.json` transliteration: JSON keys a container by its tag,
 * so two `<selections>` siblings cannot both survive it — the second wins. Real New Recruit
 * exports carry one container per name, which is what `units` models, so the JSON cases build on
 * that and leave `extra` to the XML-only ones that predate it.
 */
const rosterXml = (
  overrides: { game?: string; extra?: string; name?: string; units?: string } = {}
): string => `<?xml version="1.0" encoding="UTF-8"?>
<roster id="roster-1" name="${overrides.name ?? 'Imported Thunderhost'}" battleScribeVersion="2.03"
  generatedBy="https://newrecruit.eu" gameSystemName="${overrides.game ?? 'Age of Sigmar 4.0'}"
  xmlns="http://www.battlescribe.net/schema/rosterSchema">
  <forces>
    <force id="force-1" name="✦ General's Handbook 2026-27" catalogueName="Stormcast Eternals">
      <selections>${overrides.units ?? ''}
        <selection id="formation-slot" name="Battle Formation" number="1" type="upgrade">
          <selections>
            <selection id="formation" name="Thunderhead Host" number="1" type="upgrade"
              from="group" group="Battle Formations: Stormcast Eternals" />
          </selections>
        </selection>
        <selection id="spell-slot" name="Spell Lore" number="1" type="upgrade">
          <selections>
            <selection id="spell-lore" name="Lore of the Storm" number="1" type="upgrade"
              from="group" group="Spell Lores">
              <profiles>
                <profile id="ignored-rule" name="Rules prose must not import" typeName="Ability (Spell)" />
              </profiles>
            </selection>
          </selections>
        </selection>
      </selections>
      <forces>
        <force id="regiment-1" name="Regiment" catalogueName="Stormcast Eternals">
          <selections>
            <selection id="hero" name="Knight-Vexillor" number="1" type="unit">
              <selections>
                <selection id="hero-model" name="Knight-Vexillor" number="1" type="model" />
                <selection id="artefact" name="Mirrorshield" number="1" type="upgrade"
                  from="group" group="Artefacts of Power::Heaven-wrought Armoury" />
              </selections>
              <profiles>
                <profile id="ignored-profile" name="A profile name is not a selection" typeName="Unit" />
              </profiles>
            </selection>
            <selection id="unit" name="Annihilators (Scourge of Aqshy)" number="2" type="unit">
              <selections>
                <selection id="unit-model" name="Annihilators" number="6" type="model" />
              </selections>
            </selection>
          </selections>
        </force>
      </forces>
      ${overrides.extra ?? ''}
    </force>
  </forces>
</roster>`

const asRos = (xml: string) => ({
  name: 'army.ros',
  bytes: strToU8(xml),
})

const asRosz = (entries: Record<string, Uint8Array>) => ({
  name: 'army.rosz',
  bytes: zipSync(entries, { level: 9 }),
})

/**
 * The `.json` New Recruit would have exported alongside this XML.
 *
 * Built with the same transliteration the fixture corpus checks the real captures against, so
 * these synthetic cases exercise the adapter on the shape New Recruit actually emits — numeric
 * ids, arrays where XML had containers — rather than one hand-written to suit the reader.
 */
const asJson = (xml: string, name = 'army.json') => ({
  name,
  bytes: strToU8(JSON.stringify({ roster: xmlToRosterJson(parseRosterXml(xml)) })),
})

/**
 * A roster's content, without positions in the file it arrived in.
 *
 * Line numbers describe the upload, not the army: the same list is one minified line as `.json`
 * and a handful as `.ros`, so they are the one thing the three formats cannot agree on.
 */
const withoutLines = (roster?: ParsedRoster) =>
  roster && { ...roster, selections: roster.selections.map(selection => ({ ...selection, line: 0 })) }

const findSignature = (bytes: Uint8Array, signature: number): number => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  for (let offset = 0; offset <= bytes.byteLength - 4; offset += 1) {
    if (view.getUint32(offset, true) === signature) return offset
  }
  throw new Error(`Signature ${signature.toString(16)} not found`)
}

describe('New Recruit .ros and .rosz import', () => {
  it('decodes equivalent composition from XML and a single-entry archive', async () => {
    const xml = rosterXml()
    const [plain, compressed] = await Promise.all([
      decodeAos4RosterFile(asRos(xml)),
      decodeAos4RosterFile(asRosz({ 'army.ros': strToU8(xml) })),
    ])

    expect(plain.diagnostics).toEqual([])
    expect(compressed).toEqual(plain)
    expect(plain.parsedRoster).toMatchObject({
      source: 'roster-xml',
      proposedName: 'Imported Thunderhost',
      declaredFaction: 'Stormcast Eternals',
      declaredContext: "General's Handbook 2026-27",
    })
    expect(plain.parsedRoster?.selections).toEqual([
      { line: 10, label: 'Thunderhead Host', kindHint: 'battle-formation' },
      { line: 16, label: 'Lore of the Storm', kindHint: 'spell-lore' },
      { line: 28, label: 'Knight-Vexillor', kindHint: 'warscroll' },
      { line: 31, label: 'Mirrorshield', kindHint: 'artefact-of-power' },
      { line: 38, label: 'Annihilators (Scourge of Aqshy)', kindHint: 'warscroll', count: 2 },
    ])
    expect(plain.parsedRoster?.selections.map(selection => selection.label)).not.toEqual(
      expect.arrayContaining(['Rules prose must not import', 'A profile name is not a selection'])
    )
  })

  it('carries the Legends opt-in and marks only selections the builder filed as Legends', async () => {
    const extra = `<selections>
      <selection id="allow-legends" name="Allow Legends" number="1" type="upgrade" from="entry">
        <categories><category id="config" name="Configuration" primary="true" /></categories>
      </selection>
      <selection id="legends-unit" name="Celestar Ballista" number="1" type="unit">
        <categories>
          <category id="acaf-8bb6-d6f-3e2a" name="Legends" entryId="acaf-8bb6-d6f-3e2a" primary="false" />
        </categories>
      </selection>
      <selection id="current-unit" name="Liberators" number="1" type="unit">
        <selections>
          <selection id="nested-upgrade" name="Grandhammer" number="1" type="upgrade"
            from="group" group="Artefacts of Power::Nested">
            <categories><category id="nested" name="Legends" primary="false" /></categories>
          </selection>
        </selections>
      </selection>
    </selections>`
    const result = await decodeAos4RosterFile(asRos(rosterXml({ extra })))

    expect(result.diagnostics).toEqual([])
    expect(result.parsedRoster?.allowsLegends).toBe(true)
    expect(result.parsedRoster?.selections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Celestar Ballista', kindHint: 'warscroll', isLegends: true }),
        expect.objectContaining({ label: 'Liberators', kindHint: 'warscroll' }),
        // The nested upgrade's category describes the upgrade, and must not tag the unit.
        expect.objectContaining({ label: 'Grandhammer', isLegends: true }),
      ])
    )
    const liberators = result.parsedRoster?.selections.find(selection => selection.label === 'Liberators')
    expect(liberators?.isLegends).toBeUndefined()
  })

  /**
   * New Recruit files each manifestation warscroll as a `unit` nested under the chosen
   * manifestation lore, so the "units sit directly in a force" rule alone would drop them and the
   * imported army would lose the manifestations' own abilities (#1854). The lore's `Summon X`
   * upgrades stay out — the catalog's lore group already carries the summoning spells — and a
   * `unit` nested inside an ordinary unit is still that unit's internals, not an army unit.
   */
  it('imports manifestation units nested under their lore, and only those', async () => {
    const units = `
      <selection id="manifestation-slot" name="Manifestation Lore" number="1" type="upgrade">
        <selections>
          <selection id="manifestation-lore" name="Manifestations of the Storm" number="1" type="upgrade"
            from="group" group="Manifestation Lores">
            <selections>
              <selection id="manifestation-unit" name="Stormstrike Axe" number="1" type="unit"
                from="group" group="Manifestations of the Storm" />
              <selection id="manifestation-summon" name="Summon Stormstrike Axe" number="1" type="upgrade"
                from="group" group="Manifestations of the Storm" />
            </selections>
          </selection>
        </selections>
      </selection>
      <selection id="terrain" name="Zontari Endrin Dock" number="1" type="unit">
        <selections>
          <selection id="terrain-part" name="Auto-Endrin" number="1" type="unit" />
        </selections>
      </selection>`
    const xml = rosterXml({ units })
    const [fromXml, fromJson] = await Promise.all([
      decodeAos4RosterFile(asRos(xml)),
      decodeAos4RosterFile(asJson(xml)),
    ])

    expect(fromXml.diagnostics).toEqual([])
    expect(fromXml.parsedRoster?.selections).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Manifestations of the Storm', kindHint: 'manifestation-lore' }),
        expect.objectContaining({ label: 'Stormstrike Axe', kindHint: 'warscroll' }),
      ])
    )
    const labels = fromXml.parsedRoster?.selections.map(selection => selection.label)
    expect(labels).not.toContain('Summon Stormstrike Axe')
    expect(labels).not.toContain('Auto-Endrin')
    expect(withoutLines(fromJson.parsedRoster)).toEqual(withoutLines(fromXml.parsedRoster))
  })

  it('ignores harmless ZIP metadata but rejects multiple rosters and traversal names', async () => {
    const xml = strToU8(rosterXml())
    const metadata = await decodeAos4RosterFile(
      asRosz({ '__MACOSX/._army.ros': new Uint8Array(), 'army.ros': xml })
    )
    const multiple = await decodeAos4RosterFile(asRosz({ 'one.ros': xml, 'two.ROS': xml }))
    const traversal = await decodeAos4RosterFile(asRosz({ '../army.ros': xml }))

    expect(metadata.parsedRoster?.declaredFaction).toBe('Stormcast Eternals')
    expect(multiple.parsedRoster).toBeUndefined()
    expect(multiple.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsafe-input', severity: 'error' })
    )
    expect(traversal.parsedRoster).toBeUndefined()
    expect(traversal.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'unsafe-input', severity: 'error' })
    )
  })

  it('rejects oversized raw, compressed, declared-expanded, and actual-expanded inputs', async () => {
    const raw = await decodeAos4RosterFile({
      name: 'huge.ros',
      bytes: new Uint8Array(MAX_ROSTER_FILE_BYTES + 1),
    })
    const compressed = await decodeAos4RosterFile({
      name: 'huge.rosz',
      bytes: new Uint8Array(MAX_ROSTER_FILE_BYTES + 1),
    })
    const expandedXml = strToU8(`<roster>${' '.repeat(MAX_EXPANDED_ROSTER_BYTES)}</roster>`)
    const declaredExpanded = await decodeAos4RosterFile(asRosz({ 'huge.ros': expandedXml }))

    const falsified = asRosz({ 'huge.ros': expandedXml }).bytes.slice()
    const central = findSignature(falsified, 0x02014b50)
    const local = findSignature(falsified, 0x04034b50)
    new DataView(falsified.buffer).setUint32(central + 24, 1, true)
    new DataView(falsified.buffer).setUint32(local + 22, 1, true)
    const actualExpanded = await decodeAos4RosterFile({ name: 'huge.rosz', bytes: falsified })

    ;[raw, compressed, declaredExpanded, actualExpanded].forEach(result => {
      expect(result.parsedRoster).toBeUndefined()
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({ code: 'input-too-large', severity: 'error' })
      )
    })
  })

  it('rejects encrypted archives and malformed, active-content, multi-root, and wrong-edition XML', async () => {
    const encrypted = asRosz({ 'army.ros': strToU8(rosterXml()) }).bytes.slice()
    const central = findSignature(encrypted, 0x02014b50)
    const view = new DataView(encrypted.buffer)
    view.setUint16(central + 8, view.getUint16(central + 8, true) | 1, true)

    const results = await Promise.all([
      decodeAos4RosterFile({ name: 'army.rosz', bytes: encrypted }),
      decodeAos4RosterFile(asRos('<roster>')),
      decodeAos4RosterFile(asRos(`<!DOCTYPE roster [<!ENTITY x "boom">]>${rosterXml()}`)),
      decodeAos4RosterFile(asRos(rosterXml({ extra: '<roster />' }))),
      decodeAos4RosterFile(asRos(rosterXml({ game: 'Age of Sigmar 3.0' }))),
      decodeAos4RosterFile({ name: 'army.txt', bytes: strToU8(rosterXml()) }),
    ])

    results.forEach(result => {
      expect(result.parsedRoster).toBeUndefined()
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({ code: expect.stringMatching(/unsafe-input|unsupported-source/) })
      )
    })
  })

  it('caps total XML selection nodes before extracting composition', async () => {
    const selections = Array.from(
      { length: 1_001 },
      (_, index) => `<selection id="s-${index}" name="Unit ${index}" number="1" type="unit" />`
    ).join('')
    const result = await decodeAos4RosterFile(
      asRos(rosterXml({ extra: `<selections>${selections}</selections>` }))
    )

    expect(result.parsedRoster).toBeUndefined()
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ code: 'input-too-large', severity: 'error' })
    )
  })

  it('keeps fflate behind a dynamic production import', () => {
    const source = fs.readFileSync(path.resolve(process.cwd(), 'src/importers/rosterFile.ts'), 'utf8')

    expect(source).toContain("await import('fflate')")
    expect(source).not.toMatch(/^import .* from ['"]fflate['"]/m)
  })
})

describe('New Recruit .json import', () => {
  /**
   * The headline contract: New Recruit's third export is the same list, so it has to import to the
   * same army. Anything less would mean a player's reminders depended on which button they pressed
   * in the builder.
   */
  it('decodes the same roster as the .ros it transliterates', async () => {
    const xml = rosterXml()
    const [fromXml, fromJson] = await Promise.all([
      decodeAos4RosterFile(asRos(xml)),
      decodeAos4RosterFile(asJson(xml)),
    ])

    expect(fromJson.diagnostics).toEqual([])
    expect(withoutLines(fromJson.parsedRoster)).toEqual(withoutLines(fromXml.parsedRoster))
    expect(fromJson.parsedRoster?.source).toEqual('roster-xml')
    expect(fromJson.parsedRoster?.selections.every(selection => selection.line >= 1)).toBe(true)
  })

  it('carries the Legends opt-in and per-selection Legends tags across the transliteration', async () => {
    const units = `
      <selection id="allow-legends" name="Allow Legends" number="1" type="upgrade" from="entry">
        <categories><category id="config" name="Configuration" primary="true" /></categories>
      </selection>
      <selection id="legends-unit" name="Celestar Ballista" number="1" type="unit">
        <categories>
          <category id="acaf-8bb6-d6f-3e2a" name="Legends" entryId="acaf-8bb6-d6f-3e2a" primary="false" />
        </categories>
      </selection>`
    const xml = rosterXml({ units })
    const [fromXml, fromJson] = await Promise.all([
      decodeAos4RosterFile(asRos(xml)),
      decodeAos4RosterFile(asJson(xml)),
    ])

    expect(fromJson.parsedRoster?.allowsLegends).toBe(true)
    expect(withoutLines(fromJson.parsedRoster)).toEqual(withoutLines(fromXml.parsedRoster))
  })

  /**
   * New Recruit types any attribute that round-trips as a number, so a selection id of all digits
   * arrives as a JSON number. Nothing may assume an id is textual.
   */
  it('reads selections whose ids the export typed as numbers', async () => {
    const units = `
      <selection id="52408" name="Numeric Id Unit" number="1" type="unit" />`
    const json = asJson(rosterXml({ units }))
    const roster = JSON.parse(new TextDecoder().decode(json.bytes)).roster

    expect(roster.forces[0].selections.some((selection: { id: unknown }) => selection.id === 52408)).toBe(
      true
    )
    const result = await decodeAos4RosterFile(json)
    expect(result.diagnostics).toEqual([])
    expect(result.parsedRoster?.selections).toContainEqual(
      expect.objectContaining({ label: 'Numeric Id Unit', kindHint: 'warscroll' })
    )
  })

  /**
   * Nesting is what tells an army's units apart from the models and upgrades inside them. XML
   * spells that level out and the JSON export leaves it implicit, so the adapter has to restore
   * it — get this wrong and every model becomes a unit of its own.
   */
  it('does not mistake nested models and upgrades for army units', async () => {
    const result = await decodeAos4RosterFile(asJson(rosterXml()))
    const labels = result.parsedRoster?.selections.map(selection => selection.label)

    expect(labels).toEqual([
      'Thunderhead Host',
      'Lore of the Storm',
      'Knight-Vexillor',
      'Mirrorshield',
      'Annihilators (Scourge of Aqshy)',
    ])
  })

  it('rejects malformed JSON, foreign JSON documents, and the wrong game edition', async () => {
    const results = await Promise.all([
      decodeAos4RosterFile({ name: 'army.json', bytes: strToU8('{"roster":') }),
      decodeAos4RosterFile({ name: 'army.json', bytes: strToU8('[]') }),
      decodeAos4RosterFile({ name: 'army.json', bytes: strToU8('{"army":{"name":"nope"}}') }),
      decodeAos4RosterFile({
        name: 'army.json',
        bytes: strToU8(JSON.stringify({ roster: {}, extra: 1 })),
      }),
      decodeAos4RosterFile(asJson(rosterXml({ game: 'Age of Sigmar 3.0' }))),
      // A roster is decoded by content, so the extension cannot smuggle one reader's file past another.
      decodeAos4RosterFile({ name: 'army.json', bytes: strToU8(rosterXml()) }),
      decodeAos4RosterFile({ ...asJson(rosterXml()), name: 'army.ros' }),
    ])

    results.forEach(result => {
      expect(result.parsedRoster).toBeUndefined()
      expect(result.diagnostics).toContainEqual(
        expect.objectContaining({ code: expect.stringMatching(/unsafe-input|unsupported-source/) })
      )
    })
  })

  it('refuses runaway nesting and oversized selection counts', async () => {
    let deep: Record<string, unknown> = { gameSystemName: 'Age of Sigmar 4.0', battleScribeVersion: '2.03' }
    for (let depth = 0; depth <= MAX_ROSTER_JSON_DEPTH; depth += 1) deep = { selections: [deep] }

    const selections = Array.from({ length: 1_001 }, (_, index) => ({
      id: `s-${index}`,
      name: `Unit ${index}`,
      number: 1,
      type: 'unit',
    }))
    const results = await Promise.all([
      decodeAos4RosterFile({ name: 'army.json', bytes: strToU8(JSON.stringify({ roster: deep })) }),
      decodeAos4RosterFile(
        asJson(rosterXml({ units: '<selection id="s" name="U" number="1" type="unit" />' }))
      ),
      decodeAos4RosterFile({
        name: 'army.json',
        bytes: strToU8(
          JSON.stringify({
            roster: {
              name: 'Too Many',
              gameSystemName: 'Age of Sigmar 4.0',
              battleScribeVersion: '2.03',
              forces: [{ catalogueName: 'Stormcast Eternals', selections }],
            },
          })
        ),
      }),
    ])

    expect(results[0].parsedRoster).toBeUndefined()
    expect(results[0].diagnostics).toContainEqual(expect.objectContaining({ code: 'unsafe-input' }))
    // The middle case is the control: the same shape, under the limits, still imports.
    expect(results[1].parsedRoster).toBeDefined()
    expect(results[2].parsedRoster).toBeUndefined()
    expect(results[2].diagnostics).toContainEqual(expect.objectContaining({ code: 'input-too-large' }))
  })
})
