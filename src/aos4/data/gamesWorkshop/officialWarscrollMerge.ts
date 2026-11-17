import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type SourceRecordId } from '../../domain'
import type { WahapediaHtmlReconciliation } from '../wahapediaHtml'
import type { WahapediaDataset, WahapediaRecordMeta } from '../wahapedia'
import type { GamesWorkshopUnitProfileFact } from './battleProfiles'
import type { OfficialProfileFactWithArtifact } from './profileOnlyMerge'
import type { OfficialWarscrollPage } from './scourgeWarscroll'

/**
 * A reviewed official warscroll page (#1757): a seasonal faction pack prints the warscroll in full,
 * and no accepted secondary source carries it. The page supplies the rules; the official
 * battle-profile row it must match supplies points, unit size, bases and regiment options. The unit
 * keeps the identity alias it already resolves through.
 */
export interface CorpusOfficialWarscrollPage {
  artifactChecksum: string
  page: number
  /** The title as the page prints it (the battle-profile row may prefix the season). */
  printedTitle: string
  /** The official battle-profile row's name, faction and context. */
  name: string
  faction: string
  context: 'standard' | 'seasonal'
  identitySourceRecordId: SourceRecordId
  /** Checksum of the extracted warscroll; a layout or text change fails closed. */
  checksum: string
  reason: string
}

const canonical = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

export const mergeOfficialWarscrollPages = (
  dataset: WahapediaDataset,
  reconciliation: WahapediaHtmlReconciliation,
  sources: Array<{ entry: CorpusOfficialWarscrollPage; warscroll: OfficialWarscrollPage }>,
  officialFacts: OfficialProfileFactWithArtifact[]
): { dataset: WahapediaDataset; reconciliation: WahapediaHtmlReconciliation } => {
  if (!sources.length) return { dataset, reconciliation }
  const next: WahapediaDataset = {
    ...dataset,
    warscrolls: [...dataset.warscrolls],
    warscrollAbilities: [...dataset.warscrollAbilities],
    warscrollWeapons: [...dataset.warscrollWeapons],
    warscrollKeywords: [...dataset.warscrollKeywords],
    warscrollBases: [...dataset.warscrollBases],
  }
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const matched = new Set<string>()

  sources.forEach(({ entry, warscroll }) => {
    if (warscroll.checksum !== entry.checksum) {
      throw new Error(
        `Official warscroll ${entry.name} no longer matches its reviewed extraction (${warscroll.checksum})`
      )
    }
    const facts = officialFacts.filter(
      record =>
        record.status === 'effective' &&
        record.fact.kind === 'unit' &&
        record.fact.context === entry.context &&
        canonical(record.fact.faction) === canonical(entry.faction) &&
        canonical(record.fact.name) === canonical(entry.name)
    )
    if (facts.length !== 1) {
      throw new Error(
        `Official warscroll ${entry.name} matches ${facts.length} effective official unit facts`
      )
    }
    const fact = facts[0].fact as GamesWorkshopUnitProfileFact
    if (
      !reconciliation.unmatchedOfficialUnitFacts.some(
        candidate => candidate.factChecksum === fact.factChecksum
      )
    ) {
      throw new Error(`Official warscroll ${entry.name} is already matched by a rules source`)
    }
    const factionId = factionIdByName.get(canonical(entry.faction))
    if (!factionId)
      throw new Error(`Official warscroll ${entry.name} names an unknown faction ${entry.faction}`)
    matched.add(fact.factChecksum)

    const pageRecord = sourceRecordId('games-workshop', `${entry.artifactChecksum}:page:${entry.page}`)
    const id = `gw-warscroll-${createHash('sha256').update(`${entry.artifactChecksum}#${warscroll.section}`).digest('hex').slice(0, 16)}`
    const meta = (section: string, value: unknown): WahapediaRecordMeta => ({
      file: 'GamesWorkshopRules.pdf',
      row: 0,
      artifactId: artifactId(entry.artifactChecksum),
      sourceRecordId: sourceRecordId('games-workshop', `${entry.artifactChecksum}:${section}`),
      // Checksum-free, so a re-upload of the same pack keeps every canonical id.
      identitySourceRecordId: sourceRecordId('games-workshop', `official-warscroll:${section}`),
      recordChecksum: checksum(value),
      section,
      rulesContextKinds: [entry.context],
      officialSourceRecordIds: [pageRecord],
    })
    const record = {
      id,
      name: fact.name,
      factionId,
      sourceId: '',
      legendHtml: '',
      regimentOptions: fact.regimentOptions.join(', '),
      notesHtml: [...fact.notes, ...warscroll.notes].join('; '),
      descriptionHtml: '',
      role: '',
      virtual: false,
      noReinforced: null,
      link: '',
      move: warscroll.move,
      save: warscroll.save,
      control: warscroll.control,
      health: warscroll.health,
      ward: warscroll.ward,
      unitSize: String(fact.unitSize),
      cost: String(fact.points),
    }
    next.warscrolls.push({
      ...record,
      meta: {
        ...meta(warscroll.section, record),
        identitySourceRecordId: entry.identitySourceRecordId,
        officialSourceRecordIds: [pageRecord, fact.sourceRecordId],
      },
    })
    warscroll.abilities.forEach((ability, index) => {
      const abilityRecord = {
        warscrollId: id,
        line: String(index + 1),
        name: ability.name,
        descriptionHtml: [
          ...(ability.declare ? [`Declare: ${ability.declare}`] : []),
          `Effect: ${ability.effect}`,
        ].join('\n'),
        legendHtml: ability.legend,
        abilityType: '',
        isReaction: /\breaction\s*:/i.test(ability.timing),
        conditionHtml: ability.timing,
        keywordsHtml: ability.keywords.join(', '),
        abilityPhase: '',
        pointsType: '',
        points: '',
      }
      next.warscrollAbilities.push({ ...abilityRecord, meta: meta(ability.section, abilityRecord) })
    })
    warscroll.weapons.forEach(weapon => {
      const weaponRecord = {
        warscrollId: id,
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
      next.warscrollWeapons.push({ ...weaponRecord, meta: meta(weapon.section, weaponRecord) })
    })
    warscroll.keywords.forEach((keyword, index) => {
      const keywordRecord = { warscrollId: id, keyword, isFactionKeyword: null, parameter: '' }
      next.warscrollKeywords.push({
        ...keywordRecord,
        meta: meta(`${warscroll.section}/keyword:${index + 1}`, keywordRecord),
      })
    })
    fact.baseSizes.forEach((base, index) => {
      const baseRecord = { warscrollId: id, line: String(index + 1), model: '', base }
      next.warscrollBases.push({
        ...baseRecord,
        meta: meta(`${warscroll.section}/base:${index + 1}`, baseRecord),
      })
    })
  })

  return {
    dataset: next,
    reconciliation: {
      ...reconciliation,
      matchedOfficialUnitFacts: reconciliation.matchedOfficialUnitFacts + matched.size,
      unmatchedOfficialUnitFacts: reconciliation.unmatchedOfficialUnitFacts.filter(
        fact => !matched.has(fact.factChecksum)
      ),
    },
  }
}
