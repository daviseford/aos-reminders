import { createHash } from 'node:crypto'
import { artifactId, sourceRecordId, type AbilityActor, type SourceRecordId } from '../../domain'
import { normalizeSourceText } from '../../normalize'
import type { GamesWorkshopBattleProfileFact, GamesWorkshopUnitProfileFact } from '../gamesWorkshop'
import type {
  WahapediaDataset,
  WahapediaGeneralRulesApplication,
  WahapediaRecordMeta,
  WahapediaWarscrollAbilityRecord,
  WahapediaWarscrollRecord,
  WahapediaWarscrollWeaponRecord,
} from '../wahapedia'
import type {
  WahapediaHtmlFactionPageRecord,
  WahapediaHtmlRecordMeta,
  WahapediaHtmlRulesPageRecord,
  WahapediaHtmlWarscrollRecord,
} from './records'

export interface WahapediaHtmlReconciliation {
  schemaVersion: 1
  pages: number
  matchedOfficialUnitFacts: number
  unmatchedOfficialUnitFacts: Array<{
    factChecksum: string
    sourceRecordId: SourceRecordId
    faction: string
    context: GamesWorkshopUnitProfileFact['context']
    name: string
    unitSize: number
    points: number
    reason: string
  }>
  discrepancies: Array<{
    url: string
    field: 'name' | 'unitSize' | 'points' | 'baseSizes' | 'regimentOptions' | 'notes'
    secondary: string
    official: string
    officialSourceRecordId: SourceRecordId
  }>
}

export interface WahapediaHtmlMergeResult {
  dataset: WahapediaDataset
  reconciliation: WahapediaHtmlReconciliation
}

export interface WahapediaRulesPageReview {
  url: string
  application: WahapediaGeneralRulesApplication
  reason: string
  contextKinds?: Partial<
    Record<WahapediaHtmlRulesPageRecord['context'], NonNullable<WahapediaRecordMeta['rulesContextKinds']>>
  >
  groups?: Array<{
    externalId: string
    application: WahapediaGeneralRulesApplication
    reason: string
  }>
}

const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

const canonical = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[â€™’']/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const comparableOfficialName = (value: string): string =>
  canonical(
    value
      .replace(/^Legion of the First Prince\s+/i, '')
      .replace(/^Kruleboyz\s+/i, '')
      .replace(
        /\bHearthguard Berzerkers with Berzerker Broadaxes\b/i,
        'Hearthguard Berzerker with Berzerker Broadaxes'
      )
      .replace(
        /^((?:Scourge of Aqshy )?)Infernal Enrapturess$/i,
        '$1Infernal Enrapturess, Herald of Slaanesh'
      )
      .replace(/\bHobgrot Vandalz\b/i, 'Hobgrotz Vandalz')
      .replace(/\bRatling Guns\b/i, 'Ratling Gun')
      .replace(/\bSpirit Host\b/i, 'Spirit Hosts')
      .replace(/\bSkeletal Steed\b/i, 'Skeleton Steed')
      .replace(/\bThe Knives of the Crone\b/i, 'Knives of the Crone')
      .replace(/\bThe Emberwatch\b/i, 'Emberwatch')
      .replace(/\bPlague Censer Bearers\b/i, 'Plague Censer Bearer')
  )

const normalizedList = (values: string[]): string =>
  [...values]
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join('|')

const contextForOldWarscroll = (
  record: WahapediaWarscrollRecord,
  dataset: WahapediaDataset
): 'spearhead' | 'other' => {
  if (/\bspearhead\s*:/i.test(record.notesHtml)) return 'spearhead'
  const source = dataset.sources.find(candidate => candidate.id === record.sourceId)
  if (source && /\bspearhead\b/i.test(source.name)) return 'spearhead'
  return 'other'
}

const isLegendsOldWarscroll = (
  record: WahapediaWarscrollRecord | undefined,
  dataset: WahapediaDataset
): boolean => {
  if (!record) return false
  if (record.meta.rulesContextKinds?.includes('legends')) return true
  const source = dataset.sources.find(candidate => candidate.id === record.sourceId)
  return Boolean(source && /\blegends?\b/i.test(source.name)) || /\blegends?\b/i.test(record.notesHtml)
}

const pathFor = (value: string): string => {
  try {
    return new URL(value, 'https://wahapedia.ru').pathname.replace(/\/+$/, '').toLowerCase()
  } catch {
    return ''
  }
}

const identityMatch = <TRecord extends { name: string; meta: WahapediaRecordMeta }>(
  records: TRecord[],
  name: string,
  line: number
): TRecord | undefined =>
  records.find(
    record =>
      canonical(record.name) === canonical(name) &&
      (record.meta.row === line ||
        records.filter(item => canonical(item.name) === canonical(name)).length === 1)
  )

const metaFromHtml = (
  meta: WahapediaHtmlRecordMeta,
  file: WahapediaRecordMeta['file'],
  contextKinds: WahapediaRecordMeta['rulesContextKinds'],
  identityMeta?: WahapediaRecordMeta,
  officialSourceRecordIds?: SourceRecordId[]
): WahapediaRecordMeta => ({
  file,
  row: 0,
  artifactId: meta.artifactId,
  sourceRecordId: meta.sourceRecordId,
  recordChecksum: meta.recordChecksum,
  section: meta.section,
  rulesContextKinds: contextKinds,
  ...(identityMeta ? { identitySourceRecordId: identityMeta.sourceRecordId } : {}),
  ...(officialSourceRecordIds?.length ? { officialSourceRecordIds } : {}),
})

const derivedMeta = (
  page: WahapediaHtmlWarscrollRecord,
  file: WahapediaRecordMeta['file'],
  section: string,
  value: unknown,
  contextKinds: WahapediaRecordMeta['rulesContextKinds']
): WahapediaRecordMeta => ({
  file,
  row: 0,
  artifactId: artifactId(page.artifact.checksum),
  sourceRecordId: sourceRecordId('wahapedia', `html:${page.sourceUrl}#${section}`),
  recordChecksum: checksum(value),
  section,
  rulesContextKinds: contextKinds,
})

const htmlContextKinds = (
  page: WahapediaHtmlWarscrollRecord,
  facts: GamesWorkshopUnitProfileFact[]
): NonNullable<WahapediaRecordMeta['rulesContextKinds']> => {
  const contexts = new Set<NonNullable<WahapediaRecordMeta['rulesContextKinds']>[number]>()
  facts.forEach(fact => contexts.add(fact.context))
  if (!contexts.size) contexts.add(page.context)
  return Array.from(contexts).sort()
}

const matchingFacts = (
  page: WahapediaHtmlWarscrollRecord,
  facts: GamesWorkshopUnitProfileFact[],
  legendsIdentity: boolean
): GamesWorkshopUnitProfileFact[] =>
  facts.filter(fact => {
    if (page.context === 'spearhead' || page.context === 'historical') {
      return false
    }
    const matchingContext =
      page.context === 'standard'
        ? fact.context === 'standard' || (fact.context === 'legends' && legendsIdentity)
        : fact.context === page.context
    if (!matchingContext) {
      return false
    }
    const officialName = comparableOfficialName(fact.name)
    const pageNames = new Set([
      comparableOfficialName(page.name),
      comparableOfficialName(
        decodeURIComponent(new URL(page.sourceUrl).pathname.split('/').at(-1) ?? '').replaceAll('-', ' ')
      ),
    ])
    if (!pageNames.has(officialName)) return false
    if (fact.context === 'legends') return page.context === 'legends' || legendsIdentity
    return canonical(fact.faction) === canonical(page.factionName)
  })

const primaryFact = (
  page: WahapediaHtmlWarscrollRecord,
  facts: GamesWorkshopUnitProfileFact[]
): GamesWorkshopUnitProfileFact | undefined =>
  facts.find(
    fact => fact.context === page.context && canonical(fact.faction) === canonical(page.factionName)
  ) ??
  facts.find(
    fact => fact.context === 'standard' && canonical(fact.faction) === canonical(page.factionName)
  ) ??
  facts[0]

const spearheadGroup = (page: WahapediaHtmlWarscrollRecord): string =>
  page.context === 'spearhead' ? (page.externalId.split(':')[0] ?? '') : ''

const discrepancy = (
  page: WahapediaHtmlWarscrollRecord,
  fact: GamesWorkshopUnitProfileFact,
  field: WahapediaHtmlReconciliation['discrepancies'][number]['field'],
  secondary: unknown,
  official: unknown
): WahapediaHtmlReconciliation['discrepancies'][number] | undefined => {
  const secondaryValue = Array.isArray(secondary) ? normalizedList(secondary) : String(secondary ?? '')
  const officialValue = Array.isArray(official) ? normalizedList(official) : String(official ?? '')
  if (secondaryValue === officialValue) return undefined
  return {
    url: page.sourceUrl,
    field,
    secondary: secondaryValue,
    official: officialValue,
    officialSourceRecordId: fact.sourceRecordId,
  }
}

const generalRuleActor = (descriptionHtml: string): AbilityActor => {
  const text = normalizeSourceText(descriptionHtml).text
  if (/\bterrain feature\b/i.test(text)) return 'terrain'
  if (/\bmanifestation\b/i.test(text)) return 'manifestation'
  if (/\bplayer\b/i.test(text) && !/\bunit\b/i.test(text)) return 'player'
  if (/\barmy\b/i.test(text) && !/\bunit\b/i.test(text)) return 'army'
  return 'unit'
}

export const mergeCurrentWahapediaWarscrollPages = (
  dataset: WahapediaDataset,
  pages: WahapediaHtmlWarscrollRecord[],
  officialFacts: GamesWorkshopBattleProfileFact[],
  factionPages: WahapediaHtmlFactionPageRecord[] = [],
  rulesPages: WahapediaHtmlRulesPageRecord[] = [],
  rulesPageReviews: WahapediaRulesPageReview[] = []
): WahapediaHtmlMergeResult => {
  const duplicateReviewUrls = rulesPageReviews
    .map(review => review.url)
    .filter((url, index, values) => values.indexOf(url) !== index)
  if (duplicateReviewUrls.length) {
    throw new Error(
      `Duplicate Wahapedia rules-page reviews: ${Array.from(new Set(duplicateReviewUrls)).join(', ')}`
    )
  }
  const reviewByUrl = new Map(rulesPageReviews.map(review => [review.url, review]))
  const unexpectedReviews = rulesPageReviews.filter(
    review => !rulesPages.some(page => page.sourceUrl === review.url)
  )
  if (unexpectedReviews.length) {
    throw new Error(
      `Reviewed Wahapedia rules pages are absent from the accepted artifacts: ${unexpectedReviews
        .map(review => review.url)
        .join(', ')}`
    )
  }
  rulesPages.forEach(page => {
    const review = reviewByUrl.get(page.sourceUrl)
    if (!review?.reason.trim()) {
      throw new Error(`Wahapedia rules page ${page.sourceUrl} has no reviewed application rationale`)
    }
    const reviewedGroupIds = (review.groups ?? []).map(group => group.externalId)
    const duplicateGroupIds = reviewedGroupIds.filter(
      (externalId, index) => reviewedGroupIds.indexOf(externalId) !== index
    )
    if (duplicateGroupIds.length) {
      throw new Error(
        `Duplicate rules-group reviews for ${page.sourceUrl}: ${Array.from(new Set(duplicateGroupIds)).join(
          ', '
        )}`
      )
    }
    const pageGroupIds = new Set(page.groups.map(group => group.externalId))
    const unexpectedGroups = (review.groups ?? []).filter(group => !pageGroupIds.has(group.externalId))
    if (unexpectedGroups.length) {
      throw new Error(
        `Reviewed rules groups are absent from ${page.sourceUrl}: ${unexpectedGroups
          .map(group => group.externalId)
          .join(', ')}`
      )
    }
    const missingRationales = (review.groups ?? []).filter(group => !group.reason.trim())
    if (missingRationales.length) {
      throw new Error(
        `Reviewed rules groups have no application rationale for ${page.sourceUrl}: ${missingRationales
          .map(group => group.externalId)
          .join(', ')}`
      )
    }
  })

  const officialUnits = officialFacts.filter(
    (fact): fact is GamesWorkshopUnitProfileFact => fact.kind === 'unit'
  )
  const factionIdByName = new Map(dataset.factions.map(faction => [canonical(faction.name), faction.id]))
  const liveFactionIds = new Set(
    factionPages.flatMap(page => {
      const factionId = factionIdByName.get(canonical(page.factionName))
      return factionId ? [factionId] : []
    })
  )
  const oldWarscrollByPath = new Map(
    dataset.warscrolls.filter(record => pathFor(record.link)).map(record => [pathFor(record.link), record])
  )
  const retainedWarscrolls = dataset.warscrolls.filter(
    record => contextForOldWarscroll(record, dataset) === 'spearhead' && !liveFactionIds.has(record.factionId)
  )
  const retainedIds = new Set(retainedWarscrolls.map(record => record.id))
  const matchedOfficialFactChecksums = new Set<string>()
  const discrepancies: WahapediaHtmlReconciliation['discrepancies'] = []
  const newWarscrolls: WahapediaWarscrollRecord[] = []
  const newAbilities: WahapediaWarscrollAbilityRecord[] = []
  const newWeapons: WahapediaWarscrollWeaponRecord[] = []
  const newKeywords: WahapediaDataset['warscrollKeywords'] = []
  const newBases: WahapediaDataset['warscrollBases'] = []
  const availability = [...dataset.regimentOfRenownFactions].filter(record =>
    retainedIds.has(record.warscrollId)
  )
  const mergedIdByPage = new Map<string, string>()
  const mergedRecordByPage = new Map<string, WahapediaWarscrollRecord>()
  const pageKey = (page: WahapediaHtmlWarscrollRecord, externalId = page.externalId): string =>
    `${page.artifact.checksum}:${externalId}`
  const pageIdentityCounts = new Map<string, number>()
  pages.forEach(page => {
    const key = [page.factionName, page.context, page.name].map(canonical).join('|')
    pageIdentityCounts.set(key, (pageIdentityCounts.get(key) ?? 0) + 1)
  })

  pages
    .slice()
    .sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))
    .forEach(page => {
      const nameCandidates = dataset.warscrolls.filter(
        record =>
          canonical(record.name) === canonical(page.name) &&
          canonical(dataset.factions.find(faction => faction.id === record.factionId)?.name ?? '') ===
            canonical(page.factionName) &&
          (page.context === 'spearhead'
            ? contextForOldWarscroll(record, dataset) === 'spearhead'
            : contextForOldWarscroll(record, dataset) !== 'spearhead')
      )
      const group = spearheadGroup(page)
      const groupCandidates = group
        ? nameCandidates.filter(record => canonical(record.notesHtml).includes(canonical(group)))
        : []
      const canReuseWarscrollIdentity =
        pageIdentityCounts.get([page.factionName, page.context, page.name].map(canonical).join('|')) === 1
      const old = canReuseWarscrollIdentity
        ? (oldWarscrollByPath.get(pathFor(page.sourceUrl)) ??
          (groupCandidates.length === 1
            ? groupCandidates[0]
            : nameCandidates.length === 1
              ? nameCandidates[0]
              : undefined))
        : undefined
      const facts = matchingFacts(page, officialUnits, isLegendsOldWarscroll(old, dataset))
      facts.forEach(fact => matchedOfficialFactChecksums.add(fact.factChecksum))
      const official = primaryFact(page, facts)
      const contextKinds = htmlContextKinds(page, facts)
      const warscrollId =
        old?.id ?? `html-${createHash('sha256').update(page.sourceUrl).digest('hex').slice(0, 16)}`
      const officialSourceRecordIds = facts.map(fact => fact.sourceRecordId)

      if (official) {
        ;[
          discrepancy(page, official, 'name', page.name, official.name),
          discrepancy(page, official, 'unitSize', page.unitSize, official.unitSize),
          discrepancy(page, official, 'points', page.points, official.points),
          discrepancy(page, official, 'baseSizes', page.baseSizes, official.baseSizes),
          discrepancy(page, official, 'regimentOptions', page.regimentOptions, official.regimentOptions),
          discrepancy(page, official, 'notes', page.notes, official.notes),
        ].forEach(item => {
          if (item) discrepancies.push(item)
        })
      }

      const factionId = factionIdByName.get(canonical(page.factionName)) ?? old?.factionId ?? ''
      const record: WahapediaWarscrollRecord = {
        id: warscrollId,
        name: official?.name ?? page.name,
        factionId,
        sourceId: old?.sourceId ?? '',
        legendHtml: '',
        regimentOptions: (official?.regimentOptions ?? page.regimentOptions).join(', '),
        notesHtml: (official?.notes ?? page.notes).join('; '),
        descriptionHtml: page.descriptionHtml,
        role: old?.role ?? '',
        virtual: false,
        noReinforced:
          page.canBeReinforced === undefined ? (old?.noReinforced ?? null) : !page.canBeReinforced,
        link: page.sourceUrl,
        move: page.characteristics.move,
        save: page.characteristics.save,
        control: page.characteristics.control,
        health: page.characteristics.health,
        ward: page.characteristics.ward ?? '',
        unitSize: String(official?.unitSize ?? page.unitSize ?? ''),
        cost: String(official?.points ?? page.points ?? ''),
        meta: metaFromHtml(page.meta, 'Warscrolls.csv', contextKinds, old?.meta, officialSourceRecordIds),
      }
      newWarscrolls.push(record)
      mergedIdByPage.set(pageKey(page), warscrollId)
      mergedRecordByPage.set(pageKey(page), record)

      const oldAbilities = old ? dataset.warscrollAbilities.filter(item => item.warscrollId === old.id) : []
      page.abilities.forEach(ability => {
        const identity = identityMatch(oldAbilities, ability.name, ability.line)
        newAbilities.push({
          warscrollId,
          line: String(ability.line),
          name: ability.name,
          descriptionHtml: ability.descriptionHtml,
          legendHtml: '',
          abilityType: ability.abilityType,
          isReaction: ability.isReaction,
          conditionHtml: ability.conditionHtml,
          keywordsHtml: ability.keywordsHtml,
          abilityPhase: ability.abilityPhase,
          pointsType: ability.pointsType,
          points: ability.points,
          meta: metaFromHtml(ability.meta, 'Warscrolls_abilities.csv', contextKinds, identity?.meta),
        })
      })

      const oldWeapons = old ? dataset.warscrollWeapons.filter(item => item.warscrollId === old.id) : []
      page.weapons.forEach(weapon => {
        const identity = identityMatch(oldWeapons, weapon.name, weapon.line)
        newWeapons.push({
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
          abilitiesHtml: weapon.abilitiesHtml,
          hasBattleDamage: null,
          meta: metaFromHtml(weapon.meta, 'Warscrolls_weapons.csv', contextKinds, identity?.meta),
        })
      })

      page.keywords.forEach((keyword, index) => {
        const value = { warscrollId, keyword, index: index + 1 }
        newKeywords.push({
          warscrollId,
          keyword,
          isFactionKeyword: null,
          parameter: '',
          meta: derivedMeta(page, 'Warscrolls_keywords.csv', `keyword:${index + 1}`, value, contextKinds),
        })
      })
      ;(official?.baseSizes ?? page.baseSizes).forEach((base, index) => {
        const value = { warscrollId, base, index: index + 1 }
        newBases.push({
          warscrollId,
          line: String(index + 1),
          model: '',
          base,
          meta: derivedMeta(page, 'Warscrolls_bases.csv', `base:${index + 1}`, value, contextKinds),
        })
      })

      facts.forEach(fact => {
        const offeredFactionId = factionIdByName.get(canonical(fact.faction))
        if (!offeredFactionId || offeredFactionId === factionId) return
        const value = { warscrollId, factionId: offeredFactionId, fact: fact.factChecksum }
        availability.push({
          warscrollId,
          factionId: offeredFactionId,
          meta: derivedMeta(
            page,
            'Warscrolls_RoRfactions.csv',
            `availability:${offeredFactionId}`,
            value,
            contextKinds
          ),
        })
      })
    })

  pages.forEach(page => {
    if (!page.parentExternalId) return
    const record = mergedRecordByPage.get(pageKey(page))
    const parentWarscrollId = mergedIdByPage.get(pageKey(page, page.parentExternalId))
    if (record && parentWarscrollId) record.parentWarscrollId = parentWarscrollId
  })

  const keptAbilities = dataset.warscrollAbilities.filter(record => retainedIds.has(record.warscrollId))
  const keptWeapons = dataset.warscrollWeapons.filter(record => retainedIds.has(record.warscrollId))
  const keptKeywords = dataset.warscrollKeywords.filter(record => retainedIds.has(record.warscrollId))
  const keptBases = dataset.warscrollBases.filter(record => retainedIds.has(record.warscrollId))
  const keptOrganisation = dataset.warscrollOrganisation.filter(record => retainedIds.has(record.warscrollId))
  const replacedWarscrollIds = new Set(
    dataset.warscrolls.filter(record => !retainedIds.has(record.id)).map(record => record.id)
  )
  const replacedFactionIds = new Set(
    factionPages.map(page => {
      const factionId = factionIdByName.get(canonical(page.factionName))
      if (!factionId) {
        throw new Error(`Wahapedia faction page has no matching export faction: ${page.factionName}`)
      }
      return factionId
    })
  )
  const retainedFactionAbilityTypes = dataset.factionAbilityTypes.filter(
    record => !replacedFactionIds.has(record.factionId)
  )
  const retainedFactionAbilitySubtypes = dataset.factionAbilitySubtypes.filter(
    record => !replacedFactionIds.has(record.factionId)
  )
  const retainedFactionAbilities = dataset.factionAbilities.filter(
    record => !replacedFactionIds.has(record.factionId)
  )
  const htmlFactionAbilityTypes: WahapediaDataset['factionAbilityTypes'] = []
  const htmlFactionAbilitySubtypes: WahapediaDataset['factionAbilitySubtypes'] = []
  const htmlFactionAbilities: WahapediaDataset['factionAbilities'] = []
  const groupIdentityCounts = new Map<string, number>()
  const abilityIdentityCounts = new Map<string, number>()
  factionPages.forEach(page => {
    const factionId = factionIdByName.get(canonical(page.factionName))
    const groupByExternalId = new Map(page.groups.map(group => [group.externalId, group]))
    page.groups.forEach(group => {
      const parent = group.parentExternalId ? groupByExternalId.get(group.parentExternalId) : undefined
      const key = [factionId ?? '', parent?.name ?? '', group.name].map(canonical).join('|')
      groupIdentityCounts.set(key, (groupIdentityCounts.get(key) ?? 0) + 1)
    })
    page.abilities.forEach(ability => {
      const group = groupByExternalId.get(ability.groupExternalId)
      const parent = group?.parentExternalId ? groupByExternalId.get(group.parentExternalId) : group
      const key = [
        factionId ?? '',
        parent?.name ?? '',
        group?.parentExternalId ? group.name : '',
        ability.name,
      ]
        .map(canonical)
        .join('|')
      abilityIdentityCounts.set(key, (abilityIdentityCounts.get(key) ?? 0) + 1)
    })
  })

  factionPages
    .slice()
    .sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))
    .forEach(page => {
      const factionId = factionIdByName.get(canonical(page.factionName))
      if (!factionId) return
      const groupByExternalId = new Map(page.groups.map(group => [group.externalId, group]))
      const generatedIdByExternalId = new Map(
        page.groups.map(group => [
          group.externalId,
          `html-${createHash('sha256')
            .update(`${page.sourceUrl}#${group.externalId}`)
            .digest('hex')
            .slice(0, 16)}`,
        ])
      )
      page.groups.forEach(group => {
        const id = generatedIdByExternalId.get(group.externalId)!
        const parent = group.parentExternalId ? groupByExternalId.get(group.parentExternalId) : undefined
        const groupIdentityKey = [factionId, parent?.name ?? '', group.name].map(canonical).join('|')
        const canReuseGroupIdentity = groupIdentityCounts.get(groupIdentityKey) === 1
        if (group.parentExternalId) {
          const oldMatches = dataset.factionAbilitySubtypes.filter(
            record =>
              record.factionId === factionId &&
              canonical(record.name) === canonical(group.name) &&
              canonical(
                dataset.factionAbilityTypes.find(
                  type => type.factionId === factionId && type.id === record.typeId
                )?.name ?? ''
              ) === canonical(parent?.name ?? '')
          )
          htmlFactionAbilitySubtypes.push({
            factionId,
            id,
            name: group.name,
            typeId: generatedIdByExternalId.get(group.parentExternalId) ?? '',
            descriptionHtml: '',
            legendHtml: '',
            meta: metaFromHtml(
              group.meta,
              'Faction_ability_subtypes.csv',
              [group.context],
              canReuseGroupIdentity && oldMatches.length === 1 ? oldMatches[0].meta : undefined
            ),
          })
          return
        }
        const oldMatches = dataset.factionAbilityTypes.filter(
          record => record.factionId === factionId && canonical(record.name) === canonical(group.name)
        )
        htmlFactionAbilityTypes.push({
          factionId,
          id,
          name: group.name,
          descriptionHtml: '',
          ...(group.armyOfRenown ? { armyOfRenown: true as const } : {}),
          meta: metaFromHtml(
            group.meta,
            'Faction_ability_types.csv',
            [group.context],
            canReuseGroupIdentity && oldMatches.length === 1 ? oldMatches[0].meta : undefined
          ),
        })
      })
      page.abilities.forEach(ability => {
        const group = groupByExternalId.get(ability.groupExternalId)
        if (!group) {
          throw new Error(`Wahapedia faction ability ${ability.name} has no group ${ability.groupExternalId}`)
        }
        const parent = group.parentExternalId ? groupByExternalId.get(group.parentExternalId) : group
        const oldMatches = dataset.factionAbilities.filter(record => {
          if (record.factionId !== factionId || canonical(record.name) !== canonical(ability.name)) {
            return false
          }
          if (canonical(record.typeName) !== canonical(parent?.name ?? '')) return false
          return group.parentExternalId
            ? canonical(record.subtypeName) === canonical(group.name)
            : !record.subtypeName.trim()
        })
        const abilityIdentityKey = [
          factionId,
          parent?.name ?? '',
          group.parentExternalId ? group.name : '',
          ability.name,
        ]
          .map(canonical)
          .join('|')
        const canReuseAbilityIdentity = abilityIdentityCounts.get(abilityIdentityKey) === 1
        htmlFactionAbilities.push({
          factionId,
          typeId: generatedIdByExternalId.get(parent?.externalId ?? '') ?? '',
          typeName: parent?.name ?? '',
          subtypeId: group.parentExternalId ? (generatedIdByExternalId.get(group.externalId) ?? '') : '',
          subtypeName: group.parentExternalId ? group.name : '',
          line: String(ability.line),
          name: ability.name,
          descriptionHtml: ability.descriptionHtml,
          legendHtml: '',
          abilityType: ability.abilityType,
          isReaction: ability.isReaction,
          conditionHtml: ability.conditionHtml,
          keywordsHtml: ability.keywordsHtml,
          abilityPhase: ability.abilityPhase,
          pointsType: ability.pointsType,
          points: ability.points,
          meta: metaFromHtml(
            ability.meta,
            'Faction_abilities.csv',
            [ability.context],
            canReuseAbilityIdentity && oldMatches.length === 1 ? oldMatches[0].meta : undefined
          ),
        })
      })
    })

  const generalRulesPages: NonNullable<WahapediaDataset['generalRulesPages']> = []
  const generalRuleGroups: NonNullable<WahapediaDataset['generalRuleGroups']> = []
  const generalRuleAbilities: NonNullable<WahapediaDataset['generalRuleAbilities']> = []
  rulesPages
    .slice()
    .sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))
    .forEach(page => {
      const review = reviewByUrl.get(page.sourceUrl)!
      const contextKindsFor = (
        context: WahapediaHtmlRulesPageRecord['context']
      ): NonNullable<WahapediaRecordMeta['rulesContextKinds']> => review.contextKinds?.[context] ?? [context]
      const pageId = `html-${createHash('sha256')
        .update(`${page.sourceUrl}#rules-page`)
        .digest('hex')
        .slice(0, 16)}`
      const generatedIdByExternalId = new Map(
        page.groups.map(group => [
          group.externalId,
          `html-${createHash('sha256')
            .update(`${page.sourceUrl}#${group.externalId}`)
            .digest('hex')
            .slice(0, 16)}`,
        ])
      )
      generalRulesPages.push({
        id: pageId,
        title: page.title,
        application: review.application,
        reason: review.reason,
        meta: metaFromHtml(page.meta, 'WahapediaRules.html', contextKindsFor(page.context)),
      })
      const groupReviewByExternalId = new Map((review.groups ?? []).map(group => [group.externalId, group]))
      page.groups.forEach(group => {
        const groupReview = groupReviewByExternalId.get(group.externalId)
        const parentId = group.parentExternalId
          ? generatedIdByExternalId.get(group.parentExternalId)
          : undefined
        if (group.parentExternalId && !parentId) {
          throw new Error(`Wahapedia rules group ${group.name} has no parent ${group.parentExternalId}`)
        }
        generalRuleGroups.push({
          id: generatedIdByExternalId.get(group.externalId)!,
          pageId,
          name: group.name,
          ...(parentId ? { parentId } : {}),
          application: groupReview?.application ?? review.application,
          reason: groupReview?.reason ?? review.reason,
          meta: metaFromHtml(group.meta, 'WahapediaRules.html', contextKindsFor(group.context)),
        })
      })
      page.abilities.forEach(ability => {
        const groupId = generatedIdByExternalId.get(ability.groupExternalId)
        if (!groupId) {
          throw new Error(`Wahapedia rules ability ${ability.name} has no group ${ability.groupExternalId}`)
        }
        generalRuleAbilities.push({
          groupId,
          actor: generalRuleActor(ability.descriptionHtml),
          line: String(ability.line),
          name: ability.name,
          descriptionHtml: ability.descriptionHtml,
          legendHtml: '',
          abilityType: ability.abilityType,
          isReaction: ability.isReaction,
          conditionHtml: ability.conditionHtml,
          keywordsHtml: ability.keywordsHtml,
          abilityPhase: ability.abilityPhase,
          pointsType: ability.pointsType,
          points: ability.points,
          meta: metaFromHtml(ability.meta, 'WahapediaRules.html', contextKindsFor(ability.context)),
        })
      })
    })

  const supersededMetas = [
    ...(dataset.supersededMetas ?? []),
    ...dataset.warscrolls.filter(record => replacedWarscrollIds.has(record.id)).map(record => record.meta),
    ...dataset.warscrollAbilities
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.warscrollWeapons
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.warscrollKeywords
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.warscrollBases
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.warscrollOrganisation
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.regimentOfRenownFactions
      .filter(record => replacedWarscrollIds.has(record.warscrollId))
      .map(record => record.meta),
    ...dataset.factionAbilityTypes
      .filter(record => replacedFactionIds.has(record.factionId))
      .map(record => record.meta),
    ...dataset.factionAbilitySubtypes
      .filter(record => replacedFactionIds.has(record.factionId))
      .map(record => record.meta),
    ...dataset.factionAbilities
      .filter(record => replacedFactionIds.has(record.factionId))
      .map(record => record.meta),
  ]

  return {
    dataset: {
      ...dataset,
      htmlArtifacts: Array.from(
        new Map(
          [
            ...pages.map(page => page.artifact),
            ...factionPages.map(page => page.artifact),
            ...rulesPages.map(page => page.artifact),
          ].map(artifact => [artifact.checksum, artifact])
        ).values()
      ),
      supersededMetas: Array.from(new Map(supersededMetas.map(meta => [meta.sourceRecordId, meta])).values()),
      warscrolls: [...retainedWarscrolls, ...newWarscrolls],
      warscrollAbilities: [...keptAbilities, ...newAbilities],
      warscrollWeapons: [...keptWeapons, ...newWeapons],
      warscrollKeywords: [...keptKeywords, ...newKeywords],
      warscrollBases: [...keptBases, ...newBases],
      warscrollOrganisation: keptOrganisation,
      regimentOfRenownFactions: availability,
      factionAbilityTypes: [...retainedFactionAbilityTypes, ...htmlFactionAbilityTypes],
      factionAbilitySubtypes: [...retainedFactionAbilitySubtypes, ...htmlFactionAbilitySubtypes],
      factionAbilities: [...retainedFactionAbilities, ...htmlFactionAbilities],
      generalRulesPages,
      generalRuleGroups,
      generalRuleAbilities,
    },
    reconciliation: {
      schemaVersion: 1,
      pages: pages.filter(page => page.recordKind === 'warscroll').length,
      matchedOfficialUnitFacts: matchedOfficialFactChecksums.size,
      unmatchedOfficialUnitFacts: officialUnits
        .filter(fact => !matchedOfficialFactChecksums.has(fact.factChecksum))
        .map(fact => ({
          factChecksum: fact.factChecksum,
          sourceRecordId: fact.sourceRecordId,
          faction: fact.faction,
          context: fact.context,
          name: fact.name,
          unitSize: fact.unitSize,
          points: fact.points,
          reason:
            'No current Wahapedia warscroll page was available; the official profile is retained as an explicit profile-only gap.',
        }))
        .sort(
          (left, right) => left.faction.localeCompare(right.faction) || left.name.localeCompare(right.name)
        ),
      discrepancies: discrepancies.sort(
        (left, right) => left.url.localeCompare(right.url) || left.field.localeCompare(right.field)
      ),
    },
  }
}
