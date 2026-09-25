import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, ContentEntity } from '../../aos4/domain'
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
// Games Workshop re-uploaded the September 2026 core Battle Profiles on 2026-09-25 (same title
// and date; Khainite Shadowstalkers 100 -> 130 points); corpus 2026-09-25 re-pinned it (#1999).
const SEPTEMBER_BATTLE_PROFILES = '952d125157bdb4fc363e0f93ac521941d9a32d4caa6c00059c24cc63e8a6a20a'

const entityById = new Map<string, ContentEntity>(
  AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity])
)
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
    const oathOfConquest = ability('ability:0431ee16-d68c-52e0-950f-b681e7300f41')
    expect(oathOfConquest.text.effect).toMatch(/not within friendly territory/)
    ;[helsmiths, oathOfConquest].forEach(entity => expect(citesSeptemberRulesUpdates(entity)).toBe(true))
  })

  it('retires the Always On Guard override once the re-pinned page carries the erratum natively', () => {
    // The Scourge of Aqshy Cracked Heels ability shipped from a reviewed override (MEGA-GARGANT ->
    // BIG) until the Sons of Behemat faction page was re-pinned in corpus 2026-09-25 (#1999); the
    // page now prints the September wording itself, so the override retired (the Damned Vessel
    // precedent) and the text ships from the page alone.
    const alwaysOnGuard = ability('ability:544038f6-fd29-500a-b4a0-24cbcd5e5ca7')
    expect(alwaysOnGuard.text.effect).toMatch(/friendly BIG unit\.$/)
    expect(citesSeptemberRulesUpdates(alwaysOnGuard)).toBe(false)
  })

  it('leaves the errata the machine review cannot verify on their secondary text, recorded on #1999', () => {
    // The independent review only certifies override text whose new words appear in the cited
    // official excerpt. Errata that only delete words (Lightning Master, Abyssal Dweller, the
    // Ossiarch Bonereapers relentless-discipline surcharge), errata that edit a phrase inside
    // secondary text (Rolling Ash-clouds, Lingering Burns), and Spectral Alchemy's long
    // replacement cannot pass it, so they stay recorded discrepancies rather than overrides.
    for (const id of [
      'ability:475c9bd8-e54e-5466-8d39-4db37bda29ab',
      'ability:52df4c79-548b-52b8-b3f9-66bcbf3da517',
      'ability:de5519bc-8f30-5721-ae93-77969e28a8b2',
      'ability:4fc244a1-5dc2-57a3-b6a3-8b54adb4e2f4',
      'ability:78ea2b56-28bb-5181-a038-8cc6a6874ef6',
      'ability:6888f2e1-92a2-5d69-ad67-6385cc400af7',
      'ability:10efb9b5-ecf1-5d26-9874-16d4edae29fd',
      'ability:0115b296-d1dc-5af0-b6bc-f68336df4212',
      'ability:b7dd89c9-5f3f-5358-b0ec-dc922bd0963f',
      'ability:64e4d2a6-d00c-5060-a657-15aa9a9b3715',
      'ability:7b2718a8-31b4-5026-8373-51db06934a53',
    ]) {
      expect(citesSeptemberRulesUpdates(ability(id))).toBe(false)
    }
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
