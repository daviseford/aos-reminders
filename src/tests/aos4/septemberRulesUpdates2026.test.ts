import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, Entity } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * The September 2026 Games Workshop update (Rules Radar alarm in #1757, recorded on #1999):
 * Rules Updates, core Battle Profiles, six re-published Scourge of Aqshy packs, a re-published
 * Battletome Supplement: Cities of Sigmar, and the Bubonic Cell Spearhead, accepted as corpus
 * 2026-09-23 with publication identity continuity.
 *
 * Wahapedia had not republished any affected page, so the rules text the corpus ships from it
 * is corrected with reviewed ability-text and timing overrides that cite the exact September
 * page records. Changes the override vocabulary cannot express (ability renames, keyword
 * additions, characteristic and weapon-set changes, a command-point cost removal) stay recorded
 * discrepancies on #1999 rather than invented mechanisms.
 */

interface OfficialBattleProfileRecord {
  artifactChecksum: string
  status: 'effective' | 'superseded'
  disposition: string
  fact: { kind: string; name: string; points: number; faction: string }
}

const readJson = <T>(...segments: string[]): T =>
  JSON.parse(readFileSync(path.join(process.cwd(), ...segments), 'utf8')) as T

const ledger = readJson<{ records: OfficialBattleProfileRecord[] }>(
  'data',
  'aos4',
  'catalog',
  'official-battle-profiles.json'
)

const SEPTEMBER_RULES_UPDATES = '03f602f23a103504ca24b5bf5ac3c4f7fc83be769696d55252928ae5009de315'
const SEPTEMBER_BATTLE_PROFILES = 'b18134461e9acd9480fb66da2aa5c83fb99b75679c6d8fe9256c5c976d46dc18'

const entityById = new Map<string, Entity>(AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity]))
const ability = (id: string): Ability => {
  const entity = entityById.get(id)
  if (entity?.kind !== 'ability') throw new Error(`No ability ${id}`)
  return entity
}
const citesSeptemberRulesUpdates = (entity: Ability): boolean =>
  entity.sourceRefs.some(reference => reference.sourceRecordId.includes(SEPTEMBER_RULES_UPDATES))

describe('the September 2026 Games Workshop update (#1757)', () => {
  it('applies reviewed September ability text over the lagging secondary pages', () => {
    const helsmiths = ability('ability:2bcbb4de-f74a-550e-9a31-8101f0d6a1d4')
    expect(helsmiths.name).toBe('BULLS OF THE ZIGGURAT')
    expect(helsmiths.text.effect).toBe(
      'Add 1" to the Move characteristic of friendly HELSMITHS OF HASHUT units for each daemonic power point that unit has.'
    )
    const ossiarch = ability('ability:de5519bc-8f30-5721-ae93-77969e28a8b2')
    expect(ossiarch.name).toBe('IMPASSIVE RETREAT')
    expect(ossiarch.text.effect).not.toMatch(/reinforced/)
    const alwaysOnGuard = ability('ability:544038f6-fd29-500a-b4a0-24cbcd5e5ca7')
    expect(alwaysOnGuard.text.effect).toMatch(/friendly BIG unit\.$/)
    ;[helsmiths, ossiarch, alwaysOnGuard].forEach(entity =>
      expect(citesSeptemberRulesUpdates(entity)).toBe(true)
    )
  })

  it('applies the reviewed September timings', () => {
    const shadowyAura = ability('ability:1ef7d0b1-150c-5a02-9bb9-7592ee952d82')
    expect(shadowyAura.abilityKind).toBe('passive')
    expect(shadowyAura.timings.map(timing => timing.raw)).toEqual(['Passive'])
    expect(shadowyAura.text.reactionTrigger).toBeUndefined()
    expect(ability('ability:2077bff2-10e1-53ab-b46c-85d5226d7ce4').timings.map(timing => timing.raw)).toEqual(
      ['Once Per Turn (Army), Any Charge Phase']
    )
    expect(ability('ability:f414cae1-26b4-5790-a27c-82b80f48bc67').timings.map(timing => timing.raw)).toEqual(
      ['Once Per Turn (Army), Any Hero Phase']
    )
    const impossibleToDestroy = ability('ability:f425f0f0-e3d4-58ae-a4f7-4ca3e375e308')
    expect(impossibleToDestroy.abilityKind).toBe('active')
    expect(impossibleToDestroy.text.effect).toBe('Heal (6) this unit.')
  })

  it('leaves the Legends copies the errata do not name unchanged', () => {
    // Oracular Visions: the erratum names the Chaos Sorcerer Lord, not the Legends manticore rider.
    expect(ability('ability:7624aa9f-2747-55bc-93d9-e970b188b265').text.effect).toMatch(/Otherwise/)
    expect(ability('ability:013adfd3-8fd6-56bf-90db-b1f015454be8').text.effect).toBe(
      'On a 3+, the target has WARD (5+) until the start of your next turn.'
    )
  })

  it('keeps the Summon Shyish Reaper Army of Renown copies explicitly unresolved at 9"', () => {
    // The August and September 2026 errata change only the battletome Manifestation Lore (12",
    // already shipped). BSData sets the two Army of Renown copies to 12"; no official text names
    // them, so the shipped Wahapedia 9" copies stay and the disagreement stays recorded.
    for (const id of [
      'ability:29b435ca-1b95-5dbc-a229-0b426059d82e',
      'ability:60de0166-0d8c-5ffe-9892-144cc2f91093',
    ]) {
      expect(ability(id).text.effect).toMatch(/wholly within 9" of the caster/)
      expect(citesSeptemberRulesUpdates(ability(id))).toBe(false)
    }
    expect(ability('ability:1764fc3b-08ad-5707-80f0-4f0afb9b6721').text.effect).toMatch(/within 12"/)
  })

  it('takes every battle profile from the September 2026 core document', () => {
    const effective = ledger.records.filter(record => record.status === 'effective')
    expect(new Set(effective.map(record => record.artifactChecksum))).toEqual(
      new Set([SEPTEMBER_BATTLE_PROFILES])
    )
    // Exactly one effective official Krong the Club anchor (it was printed by both the Sons of
    // Behemat supplement and the September core document).
    const krong = ledger.records.filter(
      record => record.fact.kind === 'regiment-of-renown' && record.fact.name === 'Krong the Club'
    )
    expect(krong).toEqual([
      expect.objectContaining({
        artifactChecksum: SEPTEMBER_BATTLE_PROFILES,
        status: 'effective',
        fact: expect.objectContaining({ points: 140 }),
      }),
    ])
    // The core document re-prices the July 2026 Ogor Mawtribes supplement units.
    const ogor = (name: string) =>
      effective.find(record => record.fact.kind === 'unit' && record.fact.name === name)?.fact.points
    expect(ogor('Maulbeast Raiders')).toBe(210)
    expect(ogor('Redd the Maw, High Slaughtermaster')).toBe(420)
  })
})
