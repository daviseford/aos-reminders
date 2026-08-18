import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type SourceRecordId } from '../../domain'
import type {
  GamesWorkshopBattleProfileFact,
  GamesWorkshopRosterOptionFact,
  GamesWorkshopUnitProfileFact,
} from '../gamesWorkshop'
import type { ArtifactManifestEntry } from '../manifest'
import type {
  WahapediaDataset,
  WahapediaRecordMeta,
  WahapediaWarscrollAbilityRecord,
  WahapediaWarscrollRecord,
  WahapediaWarscrollWeaponRecord,
} from '../wahapedia'
import type { WahapediaHtmlReconciliation } from '../wahapediaHtml'
import type {
  BsDataAbilityFact,
  BsDataFactionOptionFact,
  BsDataFactionOptionType,
  BsDataWarscrollFact,
} from './records'

/**
 * Merge reviewed BSData warscroll facts into the current dataset.
 *
 * Policy note (owner decision 2026-08-18, issue #1757): BSData is now a peer secondary alongside
 * Wahapedia and its edits are accepted as fact. The conditions described below are the superseded
 * three-tier policy, which this module still enforces until the review schema's `policyTier` /
 * `status` vocabulary is flattened; they are legacy gates, not a live source-authority claim.
 *
 * BSData was the community fallback tier: it may only supply rules text Wahapedia does not
 * currently provide — for units whose existence, points, unit sizes, bases, and roster notes are
 * already established by accepted official battle-profile facts. Every overlapping field is taken
 * from the official fact, and any disagreement is preserved as a reconciliation discrepancy
 * resolved official-side.
 *
 * "Does not currently provide" has two reviewed shapes (owner ruling extended for issue #1850):
 * a unit Wahapedia has never carried (the Ogor supplement units), and a unit whose accepted
 * Wahapedia text an official publication has since superseded — a battletome rewrite Wahapedia
 * demonstrably has not caught up with. The second requires a reviewed `replacesSourceRecordId`
 * pin naming the stale current-standard datasheet: the community record adopts that datasheet's
 * identity, the stale rows are dispositioned superseded, the intake stays provisional with a
 * watch sentinel, and the pin fails closed on any mismatch. BSData still never overrides an
 * official fact, and never replaces Wahapedia text the official sources have not superseded.
 *
 * Issue #1880 extends the replacement shape twice (owner ruling 2026-08-03): a reviewed
 * `renamesFrom` lets a pin replace a datasheet whose name the official publication changed
 * ("Ogor Gluttons" → "Gluttons"), and a reviewed terrain anchor lets faction-terrain sheets
 * replace on the strength of an effective official roster-option fact of type `Faction Terrain`
 * — terrain has no battle-profile unit row, so the roster-option fact is the official
 * publication that establishes the content.
 */

export interface BsDataCommunitySourceInput {
  artifact: ArtifactManifestEntry
  /** Repository slug (e.g. BSData/age-of-sigmar-4th) used for commit-stable identity aliases. */
  repository: string
  facts: BsDataWarscrollFact[]
  /** Official page source records that establish this content (policy condition (a)). */
  officialSourceRecordIds: SourceRecordId[]
  /**
   * Accepted Wahapedia datasheet records the reviewed units replace, by catalogue section
   * (issue #1850): the community record adopts the replaced record's identity and the replaced
   * datasheet's records are dispositioned superseded. See
   * `CorpusCommunityWarscrollUnit.replacesSourceRecordId`.
   */
  replacesBySection?: Record<string, SourceRecordId>
  /**
   * Stale names of replaced datasheets whose official name changed, by catalogue section
   * (issue #1880). Each entry must pair with a `replacesBySection` pin; the merge fails closed
   * unless the replaced record is named exactly this.
   */
  renamesBySection?: Record<string, string>
  /**
   * Catalogue sections anchored on an effective official `Faction Terrain` roster-option fact
   * instead of a unit fact (issue #1880). Terrain has no battle-profile unit row; the
   * roster-option fact supplies name, faction, points, and notes.
   */
  terrainAnchorSections?: string[]
}

export interface BsDataMergeResult {
  dataset: WahapediaDataset
  reconciliation: WahapediaHtmlReconciliation
}

/**
 * The official fields a community warscroll merges against, regardless of whether the official
 * anchor is a battle-profile unit fact or a `Faction Terrain` roster-option fact (issue #1880).
 */
interface OfficialAnchor {
  name: string
  faction: string
  points: number
  notes: string[]
  unitSize: number
  baseSizes: string[]
  regimentOptions: string[]
  sourceRecordId: SourceRecordId
  factChecksum: string
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

export interface BsDataFactionOptionSourceInput {
  artifact: ArtifactManifestEntry
  /** Repository slug (e.g. BSData/age-of-sigmar-4th) used for commit-stable identity aliases. */
  repository: string
  facts: BsDataFactionOptionFact[]
  /** Official page source records that establish this content (policy condition (a)). */
  officialSourceRecordIds: SourceRecordId[]
}

const OPTION_TYPE_LABELS: Record<
  BsDataFactionOptionType,
  { officialOptionType: string; typeGroupName: string }
> = {
  'battle-formation': { officialOptionType: 'Battle Formation', typeGroupName: 'Battle Formations' },
  'heroic-trait': { officialOptionType: 'Heroic Trait', typeGroupName: 'Heroic Traits' },
  'artefact-of-power': { officialOptionType: 'Artefact of Power', typeGroupName: 'Artefacts of Power' },
  'spell-lore': { officialOptionType: 'Spell Lore', typeGroupName: 'Spell Lore' },
  'prayer-lore': { officialOptionType: 'Prayer Lore', typeGroupName: 'Prayer Lore' },
  // Army-wide battle traits have no battle-profile row: the empty official option type routes the
  // merge to the source-level official anchor instead of a per-option roster-option match.
  'battle-trait': { officialOptionType: '', typeGroupName: 'Battle Traits' },
}

/** Options that are their own subtype card set: per-ability names and records are preserved. */
const OWN_SUBTYPE_OPTION_TYPES = new Set<BsDataFactionOptionType>([
  'battle-formation',
  'spell-lore',
  'prayer-lore',
])

const bsDataGeneratedId = (seed: string): string =>
  `bsdata-${createHash('sha256').update(seed).digest('hex').slice(0, 16)}`

/**
 * Merge reviewed BSData faction roster-option facts (battle formations, heroic traits, artefacts)
 * into the current dataset.
 *
 * Like the warscroll merge, this is the community fallback tier: every option must be established
 * by an effective official roster-option fact, the official spelling wins the displayed name, and
 * disagreements are preserved as reconciliation discrepancies resolved official-side. Battle
 * formations become their own faction-ability subtype; heroic traits and artefacts join one new
 * subtype per BSData group so they present like their Wahapedia-sourced counterparts.
 */
export const mergeBsDataFactionOptions = (
  dataset: WahapediaDataset,
  reconciliation: WahapediaHtmlReconciliation,
  sources: BsDataFactionOptionSourceInput[],
  officialFacts: GamesWorkshopBattleProfileFact[]
): BsDataMergeResult => {
  if (!sources.length) return { dataset, reconciliation }
  const officialOptions = officialFacts.filter(
    (fact): fact is GamesWorkshopRosterOptionFact => fact.kind === 'roster-option'
  )
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const discrepancies = [...reconciliation.discrepancies]
  const newSubtypes: WahapediaDataset['factionAbilitySubtypes'] = []
  const newAbilities: WahapediaDataset['factionAbilities'] = []

  sources.forEach(source => {
    const sourceArtifactId = artifactId(source.artifact.checksum)
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
      section: string,
      officialSourceRecordIds?: SourceRecordId[]
    ): WahapediaRecordMeta => ({
      file: 'BSDataCatalogue.cat',
      row: 0,
      artifactId: sourceArtifactId,
      sourceRecordId: recordSourceId,
      identitySourceRecordId: identityFor(recordSourceId),
      recordChecksum,
      section,
      rulesContextKinds: ['standard'],
      ...(officialSourceRecordIds?.length ? { officialSourceRecordIds } : {}),
    })
    /** Shared subtypes for grouped options (heroic traits, artefacts), keyed per faction+group. */
    const sharedSubtypes = new Map<string, { id: string; name: string; lines: number }>()

    ;[...source.facts]
      .sort((left, right) => left.section.localeCompare(right.section))
      .forEach(fact => {
        const labels = OPTION_TYPE_LABELS[fact.optionType]
        let official: GamesWorkshopRosterOptionFact | undefined
        let factionId: string | undefined
        if (fact.optionType === 'battle-trait') {
          // No battle-profile row names army-wide battle traits: the reviewed entry supplies the
          // faction and the source-level official evidence carries the fallback-tier anchor.
          if (!fact.faction) {
            throw new Error(
              `BSData battle traits ${fact.name} name no faction; the reviewed option must ` +
                'supply one because no official roster-option fact establishes battle traits'
            )
          }
          factionId = factionIdByName.get(canonical(fact.faction))
          if (!factionId) {
            throw new Error(`BSData battle traits ${fact.name} name an unknown faction ${fact.faction}`)
          }
        } else {
          const matches = officialOptions.filter(
            candidate =>
              candidate.context === 'standard' &&
              canonical(candidate.optionType) === canonical(labels.officialOptionType) &&
              canonical(candidate.name) === canonical(fact.name)
          )
          if (matches.length !== 1) {
            // Legacy three-tier gate (superseded 2026-08-18, #1757); wording flattens with the schema.
            throw new Error(
              `BSData faction option ${fact.name} matches ${matches.length} effective official ` +
                `roster-option facts; the community fallback tier requires exactly one official ` +
                'publication establishing the content'
            )
          }
          official = matches[0]
          factionId = factionIdByName.get(canonical(official.faction))
          if (!factionId) {
            throw new Error(`BSData faction option ${fact.name} names an unknown faction ${official.faction}`)
          }
        }
        const optionFactionId = factionId
        const typeCandidates = dataset.factionAbilityTypes.filter(
          candidate =>
            candidate.factionId === optionFactionId &&
            canonical(candidate.name) === canonical(labels.typeGroupName) &&
            (!fact.typeSourceRecordId || candidate.meta.sourceRecordId === fact.typeSourceRecordId)
        )
        if (typeCandidates.length !== 1) {
          throw new Error(
            `BSData faction option ${fact.name} matches ${typeCandidates.length} ` +
              `${labels.typeGroupName} groups for its faction; pin the reviewed ` +
              'typeSourceRecordId to exactly one faction-page ability-type record'
          )
        }
        const type = typeCandidates[0]
        const sourceUrl = `${source.artifact.finalUrl}#${fact.section}`
        if (official && fact.name !== official.name) {
          discrepancies.push({
            url: sourceUrl,
            field: 'name',
            secondary: fact.name,
            official: official.name,
            officialSourceRecordId: official.sourceRecordId,
          })
        }
        if (
          (fact.optionType === 'heroic-trait' || fact.optionType === 'artefact-of-power') &&
          fact.abilities.length !== 1
        ) {
          throw new Error(
            `BSData faction option ${fact.name} carries ${fact.abilities.length} abilities; a ` +
              'heroic trait or artefact is exactly one ability card'
          )
        }
        let subtypeId: string
        let subtypeName: string
        let lineOffset = 0
        if (OWN_SUBTYPE_OPTION_TYPES.has(fact.optionType)) {
          const displayName = official?.name ?? fact.name
          subtypeId = bsDataGeneratedId(fact.sourceRecordId)
          subtypeName = displayName
          newSubtypes.push({
            factionId: optionFactionId,
            id: subtypeId,
            name: displayName,
            typeId: type.id,
            descriptionHtml: '',
            legendHtml: '',
            meta: meta(
              fact.sourceRecordId,
              fact.factChecksum,
              fact.section,
              official ? [official.sourceRecordId] : source.officialSourceRecordIds
            ),
          })
        } else if (fact.optionType === 'battle-trait') {
          // Army-wide battle traits sit directly on the faction's mandatory Battle Traits type,
          // exactly like their secondary-sourced predecessors: no subtype wrapper.
          subtypeId = ''
          subtypeName = ''
        } else {
          const key = `${optionFactionId}:${fact.optionType}:${canonical(fact.groupName)}`
          let shared = sharedSubtypes.get(key)
          if (!shared) {
            const groupSection = `option-group:${fact.groupName
              .normalize('NFKD')
              .replace(/[’']/g, '')
              .replace(/[^A-Za-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
              .toLowerCase()}`
            const groupSourceRecordId = sourceRecordId(
              'bsdata',
              `${source.artifact.checksum}:${groupSection}`
            )
            shared = { id: bsDataGeneratedId(groupSourceRecordId), name: fact.groupName, lines: 0 }
            sharedSubtypes.set(key, shared)
            newSubtypes.push({
              factionId: optionFactionId,
              id: shared.id,
              name: fact.groupName,
              typeId: type.id,
              descriptionHtml: '',
              legendHtml: '',
              meta: meta(
                groupSourceRecordId,
                checksum({ factionId: optionFactionId, group: fact.groupName, optionType: fact.optionType }),
                groupSection,
                source.officialSourceRecordIds
              ),
            })
          }
          subtypeId = shared.id
          subtypeName = shared.name
          lineOffset = shared.lines
          shared.lines += fact.abilities.length
        }
        // A single-card roster option (trait, artefact) IS its one ability card: it displays
        // under its official name and carries the option-level record identity so the audit
        // trail consumes the reviewed option record. A formation, lore, or battle-trait set keeps
        // the transcribed names and per-ability records of the abilities it grants.
        const singleCard = fact.optionType === 'heroic-trait' || fact.optionType === 'artefact-of-power'
        const abilityOfficialIds = official ? [official.sourceRecordId] : source.officialSourceRecordIds
        fact.abilities.forEach(ability => {
          const points = abilityPoints(ability)
          newAbilities.push({
            factionId: optionFactionId,
            typeId: type.id,
            typeName: type.name,
            subtypeId,
            subtypeName,
            line: String(lineOffset + ability.line),
            name: singleCard && official ? official.name : ability.name,
            descriptionHtml: abilityDescription(ability),
            legendHtml: '',
            abilityType: abilityTypeLabel[ability.kind],
            isReaction: /\breaction\s*:/i.test(ability.timing),
            conditionHtml: abilityCondition(ability),
            keywordsHtml: ability.keywords.join(', '),
            abilityPhase: '',
            pointsType: points.pointsType,
            points: points.points,
            meta: singleCard
              ? meta(fact.sourceRecordId, fact.factChecksum, fact.section, abilityOfficialIds)
              : meta(ability.sourceRecordId, ability.recordChecksum, fact.section, abilityOfficialIds),
          })
        })
      })
  })

  return {
    dataset: {
      ...dataset,
      factionAbilitySubtypes: [...dataset.factionAbilitySubtypes, ...newSubtypes],
      factionAbilities: [...dataset.factionAbilities, ...newAbilities],
    },
    reconciliation: {
      ...reconciliation,
      discrepancies: discrepancies.sort(
        (left, right) => left.url.localeCompare(right.url) || left.field.localeCompare(right.field)
      ),
    },
  }
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
  const officialTerrainOptions = officialFacts.filter(
    (fact): fact is GamesWorkshopRosterOptionFact =>
      fact.kind === 'roster-option' && fact.optionType === 'Faction Terrain'
  )
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const matchedChecksums = new Set<string>()
  const discrepancies = [...reconciliation.discrepancies]
  const newWarscrolls: WahapediaWarscrollRecord[] = []
  const newAbilities: WahapediaWarscrollAbilityRecord[] = []
  const newWeapons: WahapediaWarscrollWeaponRecord[] = []
  const newKeywords: WahapediaDataset['warscrollKeywords'] = []
  const newBases: WahapediaDataset['warscrollBases'] = []
  /** Dataset ids of the replaced Wahapedia warscroll records (issue #1850). */
  const replacedWarscrollIds = new Set<string>()

  sources.forEach(source => {
    const sourceArtifactId = artifactId(source.artifact.checksum)
    ;[...source.facts]
      .sort((left, right) => left.section.localeCompare(right.section))
      .forEach(fact => {
        const terrainAnchor = source.terrainAnchorSections?.includes(fact.section) ?? false
        let official: OfficialAnchor
        if (terrainAnchor) {
          /**
           * Faction terrain has no battle-profile unit row: the effective official roster-option
           * fact is the official publication that establishes it (issue #1880). That fact carries
           * no unit size, bases, or regiment options — terrain is a single model with no regiment
           * options, and the transcription supplies the bases no official field covers.
           */
          const matches = officialTerrainOptions.filter(
            candidate =>
              candidate.context === 'standard' && canonical(candidate.name) === canonical(fact.name)
          )
          if (matches.length !== 1) {
            // Legacy three-tier gate (superseded 2026-08-18, #1757); wording flattens with the schema.
            throw new Error(
              `BSData terrain ${fact.name} matches ${matches.length} effective official Faction Terrain ` +
                'roster-option facts; the community fallback tier requires exactly one official ' +
                'publication establishing the content'
            )
          }
          const [option] = matches
          official = {
            name: option.name,
            faction: option.faction,
            points: option.points,
            notes: option.notes,
            unitSize: 1,
            baseSizes: fact.baseSizes,
            regimentOptions: [],
            sourceRecordId: option.sourceRecordId,
            factChecksum: option.factChecksum,
          }
        } else {
          const unit = officialUnits.find(
            candidate =>
              candidate.context === 'standard' && canonical(candidate.name) === canonical(fact.name)
          )
          if (!unit) {
            // Legacy three-tier gate (superseded 2026-08-18, #1757); wording flattens with the schema.
            throw new Error(
              `BSData warscroll ${fact.name} has no matching effective official unit fact; ` +
                'the community fallback tier requires an official publication establishing the content'
            )
          }
          official = unit
        }
        /**
         * A rewrite replaces an accepted Wahapedia datasheet (issue #1850): the community record
         * adopts the replaced record's identity so canonical IDs are unchanged, and the replaced
         * record's own rows leave the live dataset as superseded. The official fact was already
         * matched by the page being replaced, so it is not counted a second time.
         */
        const replacePin = source.replacesBySection?.[fact.section]
        const replaced = replacePin
          ? dataset.warscrolls.find(record => record.meta.sourceRecordId === replacePin)
          : undefined
        if (replacePin) {
          if (!replaced) {
            throw new Error(
              `BSData warscroll ${fact.name} replaces ${replacePin}, which is not an accepted dataset record`
            )
          }
          if (replacedWarscrollIds.has(replaced.id)) {
            throw new Error(
              `BSData warscroll ${fact.name} replaces ${replacePin}, which another reviewed unit already replaces`
            )
          }
          if (!(replaced.meta.rulesContextKinds ?? []).includes('standard')) {
            throw new Error(
              `BSData warscroll ${fact.name} replaces ${replacePin}, but that record is not current-standard ` +
                '(a battletome rewrite replaces the current text, never a Spearhead or overlay record)'
            )
          }
          if (canonical(replaced.name) !== canonical(official.name)) {
            // A battletome rename (issue #1880) passes only when the review pins the stale name.
            const renamedFrom = source.renamesBySection?.[fact.section]
            if (!renamedFrom || canonical(replaced.name) !== canonical(renamedFrom)) {
              throw new Error(
                `BSData warscroll ${fact.name} replaces ${replacePin}, but that record is named ${replaced.name}`
              )
            }
          }
          replacedWarscrollIds.add(replaced.id)
        }
        if ((!replacePin || source.renamesBySection?.[fact.section]) && !terrainAnchor) {
          // An unpinned community warscroll is the match for its official unit fact. A rename pin
          // links an official fact the replaced page could never have matched (the page carries
          // the stale name), so the community record is that match too and must be counted
          // (issue #1880). Roster-option anchors are never official unit facts: do not count them.
          matchedChecksums.add(official.factChecksum)
        }
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
        const warscrollMeta = meta(fact.sourceRecordId, fact.factChecksum, 'BSDataLibrary.cat', [
          official.sourceRecordId,
        ])
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
          // Identity continuity: the rewrite keeps the replaced datasheet's canonical identity.
          meta: replaced
            ? {
                ...warscrollMeta,
                // Adopt the replaced record's own identity alias: an HTML datasheet that itself
                // adopted a CSV-era identity keys its canonical ID on that alias, not on its URL.
                identitySourceRecordId: replaced.meta.identitySourceRecordId ?? replaced.meta.sourceRecordId,
              }
            : warscrollMeta,
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

  /**
   * A replaced datasheet's rows leave the live dataset and become superseded dispositions,
   * exactly like the bulk CSV rows the current HTML replaced: retained for audit, unable to
   * enter the current runtime beside the rewrite that carries their identity forward.
   */
  const keepRecord = (record: { warscrollId: string }): boolean =>
    !replacedWarscrollIds.has(record.warscrollId)
  const supersededMetas = [
    ...(dataset.supersededMetas ?? []),
    ...dataset.warscrolls.filter(record => replacedWarscrollIds.has(record.id)).map(record => record.meta),
    ...dataset.warscrollAbilities.filter(record => !keepRecord(record)).map(record => record.meta),
    ...dataset.warscrollWeapons.filter(record => !keepRecord(record)).map(record => record.meta),
    ...dataset.warscrollKeywords.filter(record => !keepRecord(record)).map(record => record.meta),
    ...dataset.warscrollBases.filter(record => !keepRecord(record)).map(record => record.meta),
    ...(dataset.warscrollOrganisation ?? []).filter(record => !keepRecord(record)).map(record => record.meta),
    ...(dataset.regimentOfRenownFactions ?? [])
      .filter(record => !keepRecord(record))
      .map(record => record.meta),
  ]

  return {
    dataset: {
      ...dataset,
      supersededMetas: Array.from(new Map(supersededMetas.map(meta => [meta.sourceRecordId, meta])).values()),
      warscrolls: [
        ...dataset.warscrolls.filter(record => !replacedWarscrollIds.has(record.id)),
        ...newWarscrolls,
      ],
      warscrollAbilities: [...dataset.warscrollAbilities.filter(keepRecord), ...newAbilities],
      warscrollWeapons: [...dataset.warscrollWeapons.filter(keepRecord), ...newWeapons],
      warscrollKeywords: [...dataset.warscrollKeywords.filter(keepRecord), ...newKeywords],
      warscrollBases: [...dataset.warscrollBases.filter(keepRecord), ...newBases],
      warscrollOrganisation: (dataset.warscrollOrganisation ?? []).filter(keepRecord),
      regimentOfRenownFactions: (dataset.regimentOfRenownFactions ?? []).filter(keepRecord),
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
