import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type SourceRecordId } from '../../domain'
import type { ArtifactManifestEntry } from '../manifest'
import type { WahapediaDataset, WahapediaRecordMeta } from '../wahapedia'
import type { GamesWorkshopSpearheadAbility, GamesWorkshopSpearheadArmy } from './spearhead'

export interface OfficialSpearheadSourceInput {
  artifact: ArtifactManifestEntry
  /** Dataset id for a faction no secondary source carries (reviewed, stable across re-uploads). */
  factionId: string
  factionName: string
  /** Reviewed display names, keyed by the extracted (printed) army name. */
  armyNames: Record<string, string>
  armies: GamesWorkshopSpearheadArmy[]
}

const SUBTYPES = [
  ['battle-traits', 'Battle Traits', 'battleTraits'],
  ['regiment-abilities', 'Regiment Abilities', 'regimentAbilities'],
  ['enhancements', 'Enhancements', 'enhancements'],
] as const

const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

const abilityDescription = (ability: GamesWorkshopSpearheadAbility): string =>
  [
    ...(ability.preface ? [ability.preface] : []),
    ...(ability.declare ? [`Declare: ${ability.declare}`] : []),
    `Effect: ${ability.effect}`,
  ].join('\n')

/**
 * Merges official Spearhead armies into the dataset as Wahapedia-shaped Spearhead records, so
 * generation builds them exactly like a Spearhead decoded from a Wahapedia faction page: the army
 * is a characteristic-less parent warscroll offering its unit warscrolls, and its battle traits,
 * regiment abilities, and enhancements are a faction-ability type with three subtypes.
 *
 * Each record is a section of the official artifact citing its printed page; its identity alias
 * drops the artifact checksum so a re-upload of the same pack keeps every canonical id.
 */
export const mergeOfficialSpearheads = (
  dataset: WahapediaDataset,
  sources: OfficialSpearheadSourceInput[]
): WahapediaDataset => {
  if (!sources.length) return dataset
  const merged: WahapediaDataset = {
    ...dataset,
    factions: [...dataset.factions],
    warscrolls: [...dataset.warscrolls],
    warscrollAbilities: [...dataset.warscrollAbilities],
    warscrollWeapons: [...dataset.warscrollWeapons],
    warscrollKeywords: [...dataset.warscrollKeywords],
    factionAbilityTypes: [...dataset.factionAbilityTypes],
    factionAbilitySubtypes: [...dataset.factionAbilitySubtypes],
    factionAbilities: [...dataset.factionAbilities],
  }
  sources.forEach(source => {
    if (merged.factions.some(faction => faction.id === source.factionId)) {
      throw new Error(`Official Spearhead faction id ${source.factionId} is already in the dataset`)
    }
    const pageRecord = (page: number): SourceRecordId =>
      sourceRecordId('games-workshop', `${source.artifact.checksum}:page:${page}`)
    const meta = (section: string, value: unknown, page: number): WahapediaRecordMeta => ({
      file: 'GamesWorkshopSpearhead.pdf',
      row: 0,
      artifactId: artifactId(source.artifact.checksum),
      sourceRecordId: sourceRecordId('games-workshop', `${source.artifact.checksum}:spearhead:${section}`),
      identitySourceRecordId: sourceRecordId('games-workshop', `spearhead:${section}`),
      recordChecksum: checksum(value),
      section: `spearhead:${section}`,
      rulesContextKinds: ['spearhead'],
      officialSourceRecordIds: [pageRecord(page)],
    })
    const factionSection = `${source.armies[0]?.section.split(':')[0]}:faction`
    const faction = { id: source.factionId, name: source.factionName, link: source.artifact.finalUrl }
    merged.factions.push({ ...faction, meta: meta(factionSection, faction, source.armies[0]?.pages[0] ?? 1) })

    source.armies.forEach(army => {
      const armyName = source.armyNames[army.name]
      if (!armyName) throw new Error(`Official Spearhead ${army.name} has no reviewed display name`)
      const armyId = `${source.factionId}:${army.section}`
      const [compositionPage, rulesPage] = army.pages
      const type = { factionId: source.factionId, id: armyId, name: armyName, descriptionHtml: '' }
      merged.factionAbilityTypes.push({ ...type, meta: meta(`${army.section}/type`, type, rulesPage) })
      SUBTYPES.forEach(([key, name, field]) => {
        const subtype = {
          factionId: source.factionId,
          id: `${armyId}/${key}`,
          name,
          typeId: armyId,
          descriptionHtml: '',
          legendHtml: '',
        }
        merged.factionAbilitySubtypes.push({
          ...subtype,
          meta: meta(`${army.section}/${key}`, subtype, rulesPage),
        })
        army[field].forEach((ability, index) => {
          const record = {
            factionId: source.factionId,
            typeId: armyId,
            typeName: armyName,
            subtypeId: subtype.id,
            subtypeName: name,
            line: String(index + 1),
            name: ability.name,
            descriptionHtml: abilityDescription(ability),
            legendHtml: ability.legend,
            abilityType: '',
            isReaction: /\breaction\s*:/i.test(ability.timing),
            conditionHtml: ability.timing,
            keywordsHtml: '',
            abilityPhase: '',
            pointsType: '',
            points: '',
          }
          merged.factionAbilities.push({ ...record, meta: meta(ability.section, record, ability.page) })
        })
      })

      const composition = [
        `General: ${army.general}`,
        ...army.units.map(unit => `${unit.count ? `${unit.count} ` : ''}${unit.name}`),
      ].join('; ')
      const parent = {
        id: armyId,
        name: armyName,
        factionId: source.factionId,
        sourceId: '',
        legendHtml: '',
        regimentOptions: '',
        notesHtml: '',
        descriptionHtml: composition,
        role: '',
        virtual: false,
        noReinforced: null,
        link: source.artifact.finalUrl,
        move: '',
        save: '',
        control: '',
        health: '',
        ward: '',
        unitSize: '',
        cost: '',
      }
      merged.warscrolls.push({ ...parent, meta: meta(`${army.section}/army`, parent, compositionPage) })

      army.warscrolls.forEach(warscroll => {
        const warscrollId = `${source.factionId}:${warscroll.section}`
        const record = {
          id: warscrollId,
          parentWarscrollId: armyId,
          name: warscroll.name,
          factionId: source.factionId,
          sourceId: '',
          legendHtml: '',
          regimentOptions: '',
          // The Spearhead note keeps a faction with no current warscrolls out of Legends.
          notesHtml: [`Spearhead: ${armyName}`, ...warscroll.notes].join('; '),
          descriptionHtml: '',
          role: '',
          virtual: false,
          noReinforced: null,
          link: source.artifact.finalUrl,
          move: warscroll.move,
          save: warscroll.save,
          control: warscroll.control,
          health: warscroll.health,
          ward: warscroll.ward,
          unitSize: '',
          cost: '',
        }
        merged.warscrolls.push({ ...record, meta: meta(warscroll.section, record, warscroll.page) })
        warscroll.abilities.forEach((ability, index) => {
          const abilityRecord = {
            warscrollId,
            line: String(index + 1),
            name: ability.name,
            descriptionHtml: abilityDescription(ability),
            legendHtml: ability.legend,
            abilityType: '',
            isReaction: /\breaction\s*:/i.test(ability.timing),
            conditionHtml: ability.timing,
            keywordsHtml: '',
            abilityPhase: '',
            pointsType: '',
            points: '',
          }
          merged.warscrollAbilities.push({
            ...abilityRecord,
            meta: meta(ability.section, abilityRecord, ability.page),
          })
        })
        warscroll.weapons.forEach(weapon => {
          const weaponRecord = {
            warscrollId,
            line: String(weapon.line),
            name: weapon.name,
            range: weapon.range,
            attacks: weapon.attacks,
            hit: weapon.hit,
            wound: weapon.wound,
            rend: weapon.rend,
            damage: weapon.damage,
            weaponType: weapon.weaponType,
            abilitiesHtml: weapon.abilities,
            hasBattleDamage: null,
          }
          merged.warscrollWeapons.push({
            ...weaponRecord,
            meta: meta(weapon.section, weaponRecord, warscroll.page),
          })
        })
        warscroll.keywords.forEach((keyword, index) => {
          const keywordRecord = { warscrollId, keyword, isFactionKeyword: null, parameter: '' }
          merged.warscrollKeywords.push({
            ...keywordRecord,
            meta: meta(`${warscroll.section}/keyword:${index + 1}`, keywordRecord, warscroll.page),
          })
        })
      })
    })
  })
  return merged
}
