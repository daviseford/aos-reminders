import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type SourceRecordId } from '../../domain'
import type { WahapediaHtmlReconciliation } from '../wahapediaHtml'
import type { WahapediaDataset, WahapediaRecordMeta } from '../wahapedia'
import type {
  GamesWorkshopBattleProfileFact,
  GamesWorkshopRosterOptionFact,
  GamesWorkshopUnitProfileFact,
} from './battleProfiles'

/** An effective official row with the artifact it was read from. */
export interface OfficialProfileFactWithArtifact {
  artifactChecksum: string
  status: 'effective' | 'superseded'
  fact: GamesWorkshopBattleProfileFact
}

/**
 * A reviewed official unit whose rules no accepted source carries (#1757, BSData takedown): the
 * unit stays selectable from its official battle-profile row alone. The review pins the identity
 * alias the unit already resolves through, so its canonical id (and every saved army naming it)
 * is unchanged while the rules text, weapons and characteristics are absent.
 */
export interface CorpusProfileOnlyWarscroll {
  name: string
  /** The official row's faction (`Warhammer Legends` for a Legends row). */
  faction: string
  context: 'standard' | 'seasonal' | 'legends'
  /** The faction that offers the unit when it differs from the row's faction (Legends rows). */
  offeringFaction?: string
  /**
   * `faction-terrain`: the unit is Faction Terrain, which no battle-profile unit row prints; its
   * effective official `Faction Terrain` roster option establishes it instead (single model).
   */
  anchor?: 'faction-terrain'
  /** The alias the existing canonical identity is keyed on. */
  identitySourceRecordId: SourceRecordId
  reason: string
}

const canonical = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()

const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

/** A Faction Terrain roster option read as the single-model unit it establishes. */
const terrainAsUnit = (option: GamesWorkshopRosterOptionFact): GamesWorkshopUnitProfileFact => ({
  kind: 'unit',
  key: option.key,
  page: option.page,
  row: option.row,
  faction: option.faction,
  context: option.context,
  name: option.name,
  unitSize: 1,
  points: option.points,
  regimentOptions: [],
  relevantKeywords: [],
  notes: option.notes,
  baseSizes: [],
  sourceRecordId: option.sourceRecordId,
  factChecksum: option.factChecksum,
})

export const mergeOfficialProfileOnlyWarscrolls = (
  dataset: WahapediaDataset,
  reconciliation: WahapediaHtmlReconciliation,
  entries: CorpusProfileOnlyWarscroll[],
  officialFacts: OfficialProfileFactWithArtifact[]
): WahapediaDataset => {
  if (!entries.length) return dataset
  const unmatched = new Set(reconciliation.unmatchedOfficialUnitFacts.map(fact => fact.factChecksum))
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const warscrolls = [...dataset.warscrolls]
  const keywords = [...dataset.warscrollKeywords]
  const bases = [...dataset.warscrollBases]
  const seen = new Set<string>()

  entries.forEach(entry => {
    const key = `${canonical(entry.faction)}|${entry.context}|${canonical(entry.name)}`
    if (seen.has(key)) throw new Error(`Profile-only warscroll ${entry.name} is reviewed twice`)
    seen.add(key)
    const facts = officialFacts
      .filter(
        record =>
          record.status === 'effective' &&
          canonical(record.fact.faction) === canonical(entry.faction) &&
          canonical(record.fact.name) === canonical(entry.name) &&
          (entry.anchor === 'faction-terrain'
            ? record.fact.kind === 'roster-option' &&
              record.fact.optionType === 'Faction Terrain' &&
              entry.context === 'standard' &&
              record.fact.context === 'standard'
            : record.fact.kind === 'unit' && record.fact.context === entry.context)
      )
      .map(record => ({
        artifactChecksum: record.artifactChecksum,
        fact:
          record.fact.kind === 'unit'
            ? record.fact
            : terrainAsUnit(record.fact as GamesWorkshopRosterOptionFact),
        terrain: record.fact.kind !== 'unit',
      }))
    if (facts.length !== 1) {
      throw new Error(
        `Profile-only warscroll ${entry.name} matches ${facts.length} effective official unit facts; ` +
          'exactly one official row must establish it'
      )
    }
    const [{ fact, artifactChecksum, terrain }] = facts
    // Only an official row no accepted rules source matched ships profile-only; a matched row
    // already has a warscroll, and the deviation ledger gates every unmatched one.
    if (!terrain && !unmatched.has(fact.factChecksum)) {
      throw new Error(`Profile-only warscroll ${entry.name} is already matched by a rules source`)
    }
    const offering = entry.offeringFaction ?? entry.faction
    const factionId = factionIdByName.get(canonical(offering))
    if (!factionId)
      throw new Error(`Profile-only warscroll ${entry.name} names an unknown faction ${offering}`)
    if (warscrolls.some(record => record.meta.identitySourceRecordId === entry.identitySourceRecordId)) {
      throw new Error(`Profile-only warscroll ${entry.name} reuses an identity alias already in the dataset`)
    }

    const section = `profile-only:${fact.key}`
    const id = `gw-profile-${createHash('sha256').update(`${fact.sourceRecordId}#${section}`).digest('hex').slice(0, 16)}`
    const meta = (recordSourceId: SourceRecordId, recordChecksum: string): WahapediaRecordMeta => ({
      file: 'GamesWorkshopBattleProfiles.pdf',
      row: fact.row,
      artifactId: artifactId(artifactChecksum),
      sourceRecordId: recordSourceId,
      recordChecksum,
      section,
      rulesContextKinds: [entry.context],
      officialSourceRecordIds: [fact.sourceRecordId],
    })
    warscrolls.push({
      id,
      profileOnly: true,
      name: fact.name,
      factionId,
      sourceId: '',
      legendHtml: '',
      regimentOptions: fact.regimentOptions.join(', '),
      notesHtml: fact.notes.join('; '),
      descriptionHtml: '',
      role: '',
      virtual: false,
      noReinforced: null,
      link: '',
      move: '',
      save: '',
      control: '',
      health: '',
      ward: '',
      unitSize: String(fact.unitSize),
      cost: String(fact.points),
      meta: {
        // The unit's own record (the page record serves every context the page prints, which would
        // widen a seasonal-only row into standard play); the page is cited as official evidence.
        ...meta(sourceRecordId('games-workshop', `${artifactChecksum}:${section}`), fact.factChecksum),
        identitySourceRecordId: entry.identitySourceRecordId,
      },
    })
    // The row's "relevant keywords" are the only keywords an official source prints for the unit.
    fact.relevantKeywords.forEach((keyword, index) => {
      const value = { id, keyword, index: index + 1 }
      keywords.push({
        warscrollId: id,
        keyword: keyword.toUpperCase(),
        isFactionKeyword: null,
        parameter: '',
        meta: meta(
          sourceRecordId('games-workshop', `${fact.factChecksum}:${section}:keyword:${index + 1}`),
          checksum(value)
        ),
      })
    })
    fact.baseSizes.forEach((base, index) => {
      const value = { id, base, index: index + 1 }
      bases.push({
        warscrollId: id,
        line: String(index + 1),
        model: '',
        base,
        meta: meta(
          sourceRecordId('games-workshop', `${fact.factChecksum}:${section}:base:${index + 1}`),
          checksum(value)
        ),
      })
    })
  })

  return { ...dataset, warscrolls, warscrollKeywords: keywords, warscrollBases: bases }
}
