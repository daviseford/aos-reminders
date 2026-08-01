import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type SourceRecordId } from '../../domain'
import type { GamesWorkshopBattleProfileFact, GamesWorkshopUnitProfileFact } from '../gamesWorkshop'
import type { ArtifactManifestEntry } from '../manifest'
import type {
  WahapediaDataset,
  WahapediaRecordMeta,
  WahapediaWarscrollAbilityRecord,
  WahapediaWarscrollRecord,
  WahapediaWarscrollWeaponRecord,
} from '../wahapedia'
import type { WahapediaHtmlReconciliation } from '../wahapediaHtml'
import type { BsDataAbilityFact, BsDataWarscrollFact } from './records'

/**
 * Merge reviewed BSData warscroll facts into the current dataset.
 *
 * BSData is the community fallback tier: it may only supply what neither an official document nor
 * Wahapedia provides — here, the rules text of units whose existence, points, unit sizes, bases,
 * and roster notes are already established by accepted official battle-profile facts. Every
 * overlapping field is taken from the official fact, and any disagreement is preserved as a
 * reconciliation discrepancy resolved official-side.
 */

export interface BsDataCommunitySourceInput {
  artifact: ArtifactManifestEntry
  /** Repository slug (e.g. BSData/age-of-sigmar-4th) used for commit-stable identity aliases. */
  repository: string
  facts: BsDataWarscrollFact[]
  /** Official page source records that establish this content (policy condition (a)). */
  officialSourceRecordIds: SourceRecordId[]
}

export interface BsDataMergeResult {
  dataset: WahapediaDataset
  reconciliation: WahapediaHtmlReconciliation
}

const canonical = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

const normalizedList = (values: string[]): string =>
  [...values]
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join('|')

const abilityCondition = (ability: BsDataAbilityFact): string =>
  ability.kind === 'passive' ? 'Passive' : ability.timing

const abilityDescription = (ability: BsDataAbilityFact): string =>
  ability.declare ? `Declare: ${ability.declare}\nEffect: ${ability.effect}` : `Effect: ${ability.effect}`

const abilityPoints = (ability: BsDataAbilityFact): { pointsType: string; points: string } => {
  if (ability.costValue === undefined) return { pointsType: '', points: '' }
  if (ability.kind === 'spell') return { pointsType: 'Spell', points: String(ability.costValue) }
  if (ability.kind === 'prayer') return { pointsType: 'Prayer', points: String(ability.costValue) }
  if (ability.kind === 'command') return { pointsType: 'Command', points: String(ability.costValue) }
  return { pointsType: '', points: '' }
}

const abilityTypeLabel: Record<BsDataAbilityFact['kind'], string> = {
  activated: 'Ability (Activated)',
  passive: 'Ability (Passive)',
  spell: 'Ability (Spell)',
  prayer: 'Ability (Prayer)',
  command: 'Ability (Command)',
}

export const mergeBsDataWarscrolls = (
  dataset: WahapediaDataset,
  reconciliation: WahapediaHtmlReconciliation,
  sources: BsDataCommunitySourceInput[],
  officialFacts: GamesWorkshopBattleProfileFact[]
): BsDataMergeResult => {
  if (!sources.length) return { dataset, reconciliation }
  const officialUnits = officialFacts.filter(
    (fact): fact is GamesWorkshopUnitProfileFact => fact.kind === 'unit'
  )
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const matchedChecksums = new Set<string>()
  const discrepancies = [...reconciliation.discrepancies]
  const newWarscrolls: WahapediaWarscrollRecord[] = []
  const newAbilities: WahapediaWarscrollAbilityRecord[] = []
  const newWeapons: WahapediaWarscrollWeaponRecord[] = []
  const newKeywords: WahapediaDataset['warscrollKeywords'] = []
  const newBases: WahapediaDataset['warscrollBases'] = []

  sources.forEach(source => {
    const sourceArtifactId = artifactId(source.artifact.checksum)
    ;[...source.facts]
      .sort((left, right) => left.section.localeCompare(right.section))
      .forEach(fact => {
        const official = officialUnits.find(
          candidate => candidate.context === 'standard' && canonical(candidate.name) === canonical(fact.name)
        )
        if (!official) {
          throw new Error(
            `BSData warscroll ${fact.name} has no matching effective official unit fact; ` +
              'the community fallback tier requires an official publication establishing the content'
          )
        }
        matchedChecksums.add(official.factChecksum)
        const factionId = factionIdByName.get(canonical(official.faction))
        if (!factionId) {
          throw new Error(`BSData warscroll ${fact.name} names an unknown faction ${official.faction}`)
        }
        const sourceUrl = `${source.artifact.finalUrl}#${fact.section}`
        if (fact.name !== official.name) {
          discrepancies.push({
            url: sourceUrl,
            field: 'name',
            secondary: fact.name,
            official: official.name,
            officialSourceRecordId: official.sourceRecordId,
          })
        }
        if (fact.baseSizes.length && normalizedList(fact.baseSizes) !== normalizedList(official.baseSizes)) {
          discrepancies.push({
            url: sourceUrl,
            field: 'baseSizes',
            secondary: normalizedList(fact.baseSizes),
            official: normalizedList(official.baseSizes),
            officialSourceRecordId: official.sourceRecordId,
          })
        }
        const contextKinds: NonNullable<WahapediaRecordMeta['rulesContextKinds']> = ['standard']
        const warscrollId = `bsdata-${createHash('sha256').update(fact.sourceRecordId).digest('hex').slice(0, 16)}`
        const identityFor = (recordSourceId: SourceRecordId): SourceRecordId => {
          // Identity aliases must survive BSData refreshes: strip the artifact checksum and key the
          // alias on the repository and catalogue section instead.
          const suffix = decodeURIComponent(String(recordSourceId)).slice(
            `source-record:bsdata:${source.artifact.checksum}:`.length
          )
          return sourceRecordId('bsdata', `${source.repository}:${suffix}`)
        }
        const meta = (
          recordSourceId: SourceRecordId,
          recordChecksum: string,
          file: WahapediaRecordMeta['file'],
          officialSourceRecordIds?: SourceRecordId[]
        ): WahapediaRecordMeta => ({
          file,
          row: 0,
          artifactId: sourceArtifactId,
          sourceRecordId: recordSourceId,
          identitySourceRecordId: identityFor(recordSourceId),
          recordChecksum,
          section: fact.section,
          rulesContextKinds: contextKinds,
          ...(officialSourceRecordIds?.length ? { officialSourceRecordIds } : {}),
        })
        newWarscrolls.push({
          id: warscrollId,
          name: official.name,
          factionId,
          sourceId: '',
          legendHtml: '',
          regimentOptions: official.regimentOptions.join(', '),
          notesHtml: official.notes.join('; '),
          descriptionHtml: '',
          role: '',
          virtual: false,
          noReinforced: null,
          link: sourceUrl,
          move: fact.characteristics.move,
          save: fact.characteristics.save,
          control: fact.characteristics.control,
          health: fact.characteristics.health,
          ward: '',
          unitSize: String(official.unitSize),
          cost: String(official.points),
          meta: meta(fact.sourceRecordId, fact.factChecksum, 'BSDataLibrary.cat', [official.sourceRecordId]),
        })
        fact.abilities.forEach(ability => {
          const points = abilityPoints(ability)
          newAbilities.push({
            warscrollId,
            line: String(ability.line),
            name: ability.name,
            descriptionHtml: abilityDescription(ability),
            legendHtml: '',
            abilityType: abilityTypeLabel[ability.kind],
            isReaction: /\breaction\s*:/i.test(ability.timing),
            conditionHtml: abilityCondition(ability),
            keywordsHtml: ability.keywords.join(', '),
            abilityPhase: '',
            pointsType: points.pointsType,
            points: points.points,
            meta: meta(ability.sourceRecordId, ability.recordChecksum, 'BSDataLibrary.cat'),
          })
        })
        fact.weapons.forEach(weapon => {
          newWeapons.push({
            warscrollId,
            line: String(weapon.line),
            name: weapon.name,
            range: weapon.range ?? '',
            attacks: weapon.attacks,
            hit: weapon.hit,
            wound: weapon.wound,
            rend: weapon.rend,
            damage: weapon.damage,
            weaponType: weapon.weaponType === 'melee' ? 'MELEE' : 'RANGED',
            abilitiesHtml: weapon.abilityLabels.join(', '),
            hasBattleDamage: null,
            meta: meta(weapon.sourceRecordId, weapon.recordChecksum, 'BSDataLibrary.cat'),
          })
        })
        fact.keywords.forEach((keyword, index) => {
          const value = { warscrollId, keyword, index: index + 1 }
          newKeywords.push({
            warscrollId,
            keyword,
            isFactionKeyword: null,
            parameter: '',
            meta: meta(
              sourceRecordId('bsdata', `${source.artifact.checksum}:${fact.section}:keyword:${index + 1}`),
              checksum(value),
              'BSDataLibrary.cat'
            ),
          })
        })
        official.baseSizes.forEach((base, index) => {
          const value = { warscrollId, base, index: index + 1 }
          newBases.push({
            warscrollId,
            line: String(index + 1),
            model: '',
            base,
            meta: meta(
              sourceRecordId('bsdata', `${source.artifact.checksum}:${fact.section}:base:${index + 1}`),
              checksum(value),
              'BSDataLibrary.cat'
            ),
          })
        })
      })
  })

  return {
    dataset: {
      ...dataset,
      warscrolls: [...dataset.warscrolls, ...newWarscrolls],
      warscrollAbilities: [...dataset.warscrollAbilities, ...newAbilities],
      warscrollWeapons: [...dataset.warscrollWeapons, ...newWeapons],
      warscrollKeywords: [...dataset.warscrollKeywords, ...newKeywords],
      warscrollBases: [...dataset.warscrollBases, ...newBases],
    },
    reconciliation: {
      ...reconciliation,
      matchedOfficialUnitFacts: reconciliation.matchedOfficialUnitFacts + matchedChecksums.size,
      unmatchedOfficialUnitFacts: reconciliation.unmatchedOfficialUnitFacts.filter(
        fact => !matchedChecksums.has(fact.factChecksum)
      ),
      discrepancies: discrepancies.sort(
        (left, right) => left.url.localeCompare(right.url) || left.field.localeCompare(right.field)
      ),
    },
  }
}
