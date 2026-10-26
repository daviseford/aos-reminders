import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { ArtifactManifest } from '../../aos4/data'
import {
  armyFactions,
  type Ability,
  type CanonicalId,
  type ContentEntity,
  type Warscroll,
} from '../../aos4/domain'
import { AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { decodeAos4TextRoster } from '../../importers'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * Corpus 2026-10-14 (#1757). Games Workshop re-published *Regiments of Renown* without the Gotrek
 * Gurnisson page and published the October 2026 Khazalite Holds battle profiles, regiments, and
 * Spearhead packs. The Spearhead pack prints both Khazalite Holds Spearhead armies complete, so it is
 * read directly into Spearhead-only content. The matched-play faction, its battle-profile rows, and
 * its two new Regiments of Renown need Battletome: Khazalite Holds, which no accepted source prints,
 * so those packs stay reference evidence and Fyreslayers keep their in-force values. The delisted
 * Legends compendium and September 2025 Regiments of Renown are no longer pinned.
 */

const readJson = <T>(...segments: string[]): T =>
  JSON.parse(readFileSync(path.join(process.cwd(), 'data', 'aos4', ...segments), 'utf8')) as T

const manifest = readJson<ArtifactManifest>('manifests', 'accepted-2026-10-20.json')
const review = readJson<{
  officialDocuments: Array<{ title: string; documentKind: string; artifact: { checksum: string } }>
}>('reviews', 'corpus-2026-10-20.json')
const identities = readJson<{
  entries: Array<{
    kind: string
    canonicalId: string
    aliases: Array<{ externalId: string; publisher: string }>
  }>
}>('identities', 'corpus.json')

const RETIRED = {
  legendsCompendium: '0ba8c36cd64b1090df06fb2f76d56b226b6cfe85dd28923ea13386b652894d29',
  regimentsOfRenownSeptember2025: '256609b95c19f6c5d8c705760f0b580906dc27015368f4ebf3dc3db2f6f757e5',
}
const REGIMENTS_OF_RENOWN_OCTOBER_2026 = '39bde41dbfd564bf3e841dee7ef7133a9c5e39cb6efc50faf16b158d861fd078'
const KH_BATTLE_PROFILES = '557e149b1a71cff84b10276d0f46db26bb83533cb0e5a148a30cd6999ff49f29'
const KH_REGIMENTS = '0361f30cff3152c0a4a8c29798bd960e27fbbe1e1cc64b634503ced9e8b5d9e6'
const KH_SPEARHEAD = '2c66cb0eba59bb6ee6930e213145f4c73fbc20e9d99d9abc19b9a80876a6ce48'

const entities = AOS4_FULL_CATALOG.entities
const entityById = new Map(entities.map(entity => [entity.id, entity]))
const entityNamed = (kind: string, name: string) =>
  entities.find(entity => entity.kind === kind && entity.name === name)
const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
const khazaliteHolds = entities.find(
  entity => entity.kind === 'faction' && entity.name === 'Khazalite Holds'
)!
const related = (kind: string, from: string) =>
  AOS4_FULL_CATALOG.relationships
    .filter(relationship => relationship.kind === kind && relationship.from === from)
    .map(relationship => entityById.get(relationship.to)!)
const groupOf = (name: string, groupType: string) =>
  related('offers', khazaliteHolds.id).find(
    entity => entity.kind === 'content-group' && entity.name === name && entity.groupType === groupType
  )!
/** Everything reachable through offers and includes from the given roots (default: Khazalite Holds' offers). */
const reachable = (roots?: ContentEntity[]): ContentEntity[] => {
  const seen = new Map<CanonicalId, ContentEntity>()
  const visit = (entity: ContentEntity) => {
    if (seen.has(entity.id)) return
    seen.set(entity.id, entity)
    ;[...related('offers', entity.id), ...related('includes', entity.id)].forEach(visit)
  }
  ;(roots ?? related('offers', khazaliteHolds.id)).forEach(visit)
  return Array.from(seen.values())
}

describe('October 2026 official intake (corpus 2026-10-14)', () => {
  it('pins the current publications and none of the delisted ones', () => {
    const pinned = new Set(manifest.artifacts.map(artifact => artifact.checksum))
    expect(pinned.has(RETIRED.legendsCompendium)).toBe(false)
    expect(pinned.has(RETIRED.regimentsOfRenownSeptember2025)).toBe(false)
    ;[REGIMENTS_OF_RENOWN_OCTOBER_2026, KH_BATTLE_PROFILES, KH_REGIMENTS, KH_SPEARHEAD].forEach(checksum =>
      expect(pinned.has(checksum)).toBe(true)
    )
  })

  it('keeps the Regiments of Renown publication identity across the re-publication', () => {
    const entry = identities.entries.find(
      candidate =>
        candidate.kind === 'publication' &&
        candidate.aliases.some(alias => alias.externalId === `official:${REGIMENTS_OF_RENOWN_OCTOBER_2026}`)
    )
    expect(entry?.canonicalId).toBe('publication:a34c95ee-e843-5efe-9275-0e1bb633ab48')
    expect(entry?.aliases.map(alias => alias.externalId)).toContain(
      `official:${RETIRED.regimentsOfRenownSeptember2025}`
    )
    expect(entityNamed('publication', 'Regiments of Renown')?.id).toBe(entry?.canonicalId)
  })

  describe('Khazalite Holds Spearhead, read from the official pack', () => {
    it('offers both printed Spearheads beside its matched-play contexts', () => {
      // Corpus 2026-10-20b (#2087) adds the matched-play faction additively; Spearhead stays.
      const contexts = khazaliteHolds.rulesContextIds.map(id => {
        const context = AOS4_FULL_CATALOG.rulesContexts.find(candidate => candidate.id === id)!
        return `${context.mode}:${context.status}`
      })
      expect(contexts.sort()).toEqual([
        'spearhead:current',
        'standard:current',
        'standard:past-season',
        'standard:seasonal',
      ])
      expect(armyFactions(AOS4_FULL_CATALOG).map(faction => faction.id)).toContain(khazaliteHolds.id)
      const units = (army: string) =>
        related('includes', groupOf(army, 'supplemental-content').id)
          .filter(entity => entity.kind === 'warscroll')
          .map(entity => entity.name)
          .sort()
      expect(units('Drakkblud’s Clanguard')).toEqual([
        'Clanshields',
        'Gholems of Gazul',
        'Hjulda Drakkblud',
        'Oathkeeper Cannon',
      ])
      expect(units('Magmic Fyrd')).toEqual([
        'Auric Hearthguard',
        'Auric Runefather on Magmadroth',
        'Auric Runesmiter',
        'Vulkyn Flameseekers',
      ])
    })

    it('carries the printed warscrolls with official provenance in the Spearhead context only', () => {
      // Matched-play Khazalite Holds (#2087) is reachable too, so walk only what the faction offers
      // in the Spearhead context.
      const content = reachable(
        related('offers', khazaliteHolds.id).filter(
          entity => entity.rulesContextIds.length === 1 && entity.rulesContextIds[0] === spearhead.id
        )
      )
      expect(content.length).toBeGreaterThan(50)
      content.forEach(entity => {
        expect(entity.rulesContextIds).toEqual([spearhead.id])
        expect(entity.sourceRefs.length).toBeGreaterThan(0)
        entity.sourceRefs.forEach(reference => expect(reference.sourceRecordId).toContain(KH_SPEARHEAD))
      })
      const spearheadWarscroll = (name: string) =>
        content.find(entity => entity.kind === 'warscroll' && entity.name === name) as Warscroll
      const hjulda = spearheadWarscroll('Hjulda Drakkblud')
      expect(hjulda).toMatchObject({
        characteristics: { move: '4"', save: '3+', control: '2', health: '5' },
        keywords: ['HERO', 'INFANTRY'],
      })
      const runefather = spearheadWarscroll('Auric Runefather on Magmadroth')
      expect(runefather.characteristics).toMatchObject({
        move: '10"',
        save: '4+',
        control: '5',
        health: '14',
        ward: '6+',
      })
    })

    it('projects the selected Spearhead rules as reminders at their printed timings', () => {
      const army = groupOf('Drakkblud’s Clanguard', 'supplemental-content')
      // The army's battle traits, regiment abilities, and enhancements groups.
      const ownGroups = related('offers', khazaliteHolds.id).filter(
        entity => entity.kind === 'content-group' && entity.groupType === 'drakkbluds-clanguard'
      )
      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [khazaliteHolds.id, army.id, ...ownGroups.map(group => group.id)],
        rulesContextId: spearhead.id,
      })
      expect(selection.diagnostics).toEqual([])
      const reminders = projectReminders(AOS4_FULL_CATALOG, selection)
      const at = (name: string) =>
        reminders.filter(reminder => reminder.name === name).map(reminder => reminder.timing.raw)
      expect(at('HONOUR THOSE WITH GAZUL')).toEqual(['Once Per Turn, Your Hero Phase'])
      expect(at('BROWBEATER')).toEqual(['Your Hero Phase'])
      expect(at('OATHKEEPER APPRENTICE RUNESTRIKER')).toEqual(['Once Per Turn (Army), Your Shooting Phase'])
      expect(at('TOUGH AS STONE')).toEqual(['Passive'])
    })

    it('keeps the printed preface that governs Fiery Reinforcements', () => {
      const ability = entityNamed('ability', 'FIERY REINFORCEMENTS') as Ability
      expect(ability.text.effect).toContain('not set up during the deployment phase')
      expect(ability.text.effect).toContain('within 1" of a battlefield edge')
    })

    it('keys every Khazalite Holds identity on the pack section, not the artifact bytes', () => {
      const spearheadAliases = identities.entries.flatMap(entry =>
        entry.aliases.filter(
          alias => alias.publisher === 'games-workshop' && alias.externalId.startsWith('spearhead:')
        )
      )
      expect(spearheadAliases.length).toBeGreaterThan(50)
      spearheadAliases.forEach(alias => expect(alias.externalId).not.toContain(KH_SPEARHEAD))
    })

    it('lands an imported unit-less Khazalite Holds roster in the default matched-play context', () => {
      // Until corpus 2026-10-20b (#2087) the faction existed only in Spearhead, so this roster landed
      // there. With matched play shipped, a roster naming only the faction takes the default context.
      const { parsedRoster } = decodeAos4TextRoster(
        [
          'Clanguard 0/0 pts',
          '-----',
          'Khazalite Holds',
          '-----',
          'Created with Warhammer Age of Sigmar: The App',
          'App: v1.36.0 (1) | Data: v466',
          '',
        ].join('\n')
      )
      const preview = resolveParsedRoster(AOS4_FULL_CATALOG, parsedRoster!, {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => 'army:khazalite-holds',
      })
      expect(preview.proposedDocument).toMatchObject({
        rulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        explicitSelectionIds: [khazaliteHolds.id],
      })
    })
  })

  describe('matched-play Khazalite Holds ships additively (corpus 2026-10-20b, #2087)', () => {
    it('keeps Spearhead content Spearhead-only and offers the universal manifestations in matched play', () => {
      // The faction itself now spans Spearhead and matched play; everything else the pack sources stays.
      entities
        .filter(entity => entity.kind !== 'publication' && entity.id !== khazaliteHolds.id)
        .filter(entity =>
          entity.sourceRefs.some(reference => reference.sourceRecordId.includes(KH_SPEARHEAD))
        )
        .forEach(entity => expect(entity.rulesContextIds).toEqual([spearhead.id]))
      const manifestation = entityNamed('warscroll', 'Purple Sun of Shyish') as Warscroll
      expect(manifestation.factionIds).toContain(khazaliteHolds.id)
    })

    it('cites the battle profiles and regiments packs as official evidence for the new content', () => {
      ;[
        ['Battle Profiles - Khazalite Holds', KH_BATTLE_PROFILES],
        ['Regiments of Renown - Khazalite Holds', KH_REGIMENTS],
      ].forEach(([title, checksum]) => {
        expect(
          review.officialDocuments.find(document => document.artifact.checksum === checksum)
        ).toMatchObject({
          title,
          documentKind: 'reference',
        })
      })
      const citing = (checksum: string) =>
        entities
          .filter(entity => entity.sourceRefs.some(reference => reference.sourceRecordId.includes(checksum)))
          .map(entity => `${entity.kind}:${entity.name}`)
      expect(citing(KH_REGIMENTS).sort()).toEqual([
        'content-group:Fjori’s Vengeance',
        'content-group:Thengin’s Grudgesettlers',
        'publication:Regiments of Renown - Khazalite Holds',
      ])
      expect(citing(KH_BATTLE_PROFILES)).toEqual(
        expect.arrayContaining([
          'publication:Battle Profiles - Khazalite Holds',
          'content-group:Fjori’s Vengeance',
          'content-group:Thengin’s Grudgesettlers',
          'warscroll:Runewright',
          'battle-profile:Runewright battle profile',
        ])
      )
    })

    it('offers the source-supported Armies of Renown and leaves the source-blocked cards out', () => {
      const army = (name: string) =>
        related('offers', khazaliteHolds.id).find(
          entity =>
            entity.kind === 'content-group' && entity.name === name && entity.groupType === 'army-of-renown'
        )
      const contents = (name: string) =>
        related('includes', army(name)!.id)
          .flatMap(group => related('includes', group.id))
          .map(entity => entity.name)
          .sort()
      expect(contents('Throngankor Alliance')).toEqual([
        'Allied Grudgement',
        'Duardin Pride',
        'Hammer and Anvil',
        'Redeclaration of Alliance',
        'Rune of Defence',
        'Rune of Spirit',
        'Stone and Sky',
        'Stronger When Alloyed',
        'The Vice',
        'Throngankor Flare',
      ])
      expect(contents('Fyrd of Fyrepeak')).toEqual([
        'Grimmdron Grudges',
        'Rune of Fortune',
        'Rune of Guarding',
        'Rune of Speed',
        'Rune of Spellbreaking',
        'Rune of Striking',
      ])
      // Translated from the French edition with no English source yet: absent, not supported.
      expect(army('Throng of Valankrom')).toBeUndefined()
      ;[
        'Transport Duardin',
        'Grimnir’s Wrath Will Burn Bright!',
        "Grimnir's Wrath Will Burn Bright!",
      ].forEach(name => expect(entityNamed('ability', name)).toBeUndefined())
      const khazaliteRunefather = entities.find(
        entity =>
          entity.kind === 'warscroll' &&
          entity.name === 'Auric Runefather on Magmadroth' &&
          entity.factionIds.includes(khazaliteHolds.id) &&
          !entity.rulesContextIds.includes(spearhead.id)
      )!
      expect(related('includes', khazaliteRunefather.id).map(entity => entity.name)).not.toContain(
        'Warrior-kings'
      )
    })

    it('keeps the in-force Fyreslayers points beside the Khazalite Holds profiles', () => {
      // The Khazalite Holds profiles print 110 for both heroes; they apply to the Khazalite Holds
      // copies only. The Fyreslayers warscrolls keep their own profiles and points.
      const points = (name: string, faction: string) => {
        const factionId = entities.find(entity => entity.kind === 'faction' && entity.name === faction)!.id
        const warscroll = entities.find(
          entity =>
            entity.kind === 'warscroll' && entity.name === name && entity.factionIds.includes(factionId)
        )!
        const profile = entities.find(
          entity => entity.kind === 'battle-profile' && entity.warscrollId === warscroll.id
        )
        return profile?.kind === 'battle-profile' ? profile.points : undefined
      }
      expect(points('Auric Flamekeeper', 'Fyreslayers')).toBe(80)
      expect(points('Grimhold Exile', 'Fyreslayers')).toBe(90)
      expect(points('Auric Flamekeeper', 'Khazalite Holds')).toBe(110)
      expect(points('Grimhold Exile', 'Khazalite Holds')).toBe(110)
    })

    it('follows the ea96eba3 BSData correction for Thrynn only (corpus 2026-10-26)', () => {
      // BSData ea96eba3 dropped Companion from Thrynn on War Throne's Karak War Council's Armoury but
      // still prints it on High Kyng Valankrom's. No official source prints either, so both stay as
      // BSData records them, and the canonical weapon IDs are unchanged.
      const keywords = (id: string) => {
        const weapon = entityById.get(id as never)!
        expect(weapon.name).toBe("Karak War Council's Armoury")
        return weapon.kind === 'weapon' ? weapon.keywords.map(keyword => keyword.kind) : undefined
      }
      expect(keywords('weapon:c3948477-8a8f-5c39-8847-cca7ebdf7e10')).toEqual([])
      expect(keywords('weapon:d4786c12-fe78-5ab8-b391-aeb255239457')).toEqual(['companion'])
    })
  })
})
