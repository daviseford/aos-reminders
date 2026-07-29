import fs from 'node:fs'
import path from 'node:path'

import { strToU8, zipSync } from 'fflate'

import { decodeAos4RosterFile, MAX_EXPANDED_ROSTER_BYTES, MAX_ROSTER_FILE_BYTES } from '../../importers/aos4'

const rosterXml = (
  overrides: { game?: string; extra?: string; name?: string } = {}
): string => `<?xml version="1.0" encoding="UTF-8"?>
<roster id="roster-1" name="${overrides.name ?? 'Imported Thunderhost'}" battleScribeVersion="2.03"
  generatedBy="https://newrecruit.eu" gameSystemName="${overrides.game ?? 'Age of Sigmar 4.0'}"
  xmlns="http://www.battlescribe.net/schema/rosterSchema">
  <forces>
    <force id="force-1" name="✦ General's Handbook 2026-27" catalogueName="Stormcast Eternals">
      <selections>
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
      { line: 38, label: 'Annihilators', kindHint: 'warscroll', count: 2 },
    ])
    expect(plain.parsedRoster?.selections.map(selection => selection.label)).not.toEqual(
      expect.arrayContaining(['Rules prose must not import', 'A profile name is not a selection'])
    )
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
    const source = fs.readFileSync(path.resolve(process.cwd(), 'src/importers/aos4/rosterFile.ts'), 'utf8')

    expect(source).toContain("await import('fflate')")
    expect(source).not.toMatch(/^import .* from ['"]fflate['"]/m)
  })
})
