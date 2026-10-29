import { createHash } from 'node:crypto'
import type { SourceRecordId } from '../domain'
import type { WahapediaDataset, WahapediaFactionAbilityRecord, WahapediaRecordMeta } from '../data'

/**
 * A reviewed faction variant (#1757): an official re-publication gives another faction its own
 * version of an Army of Renown or warscroll the secondary source prints for one faction only
 * (October 2026: Lofnir Drothkeepers, The Duardin Ascendant and the Chosen Axes move to Khazalite
 * Holds while Faction Pack: Fyreslayers keeps them). The copy keeps the secondary record's source
 * provenance, takes its own identity, and is offered by `factionId`; overrides naming the variant
 * (`variantFactionId`) change the copy only, so the original faction's rules and ids never move.
 */
export interface CorpusFactionVariant {
  /** Dataset id of the faction that offers the copy. */
  factionId: string
  /** The Army of Renown root (faction-ability type) or warscroll record the copy is made from. */
  sourceRecordId: SourceRecordId
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

/**
 * A rule an official page prints for a variant that no secondary record carries (Lofnir
 * Drothkeepers' Blazing Vengeance, October 2026 Armies of Renown page 3). Its provenance is the
 * official page record, the first `officialSourceRecordIds` entry.
 */
export interface CorpusVariantAbility {
  factionId: string
  /** The copied group (faction-ability subtype) it joins, named by the original group's record. */
  groupSourceRecordId: SourceRecordId
  name: string
  /** The printed timing bar, e.g. `Passive` or `Once Per Turn (Army), Any Combat Phase`. */
  timing: string
  declare?: string
  effect: string
  reason: string
  officialSourceRecordIds: SourceRecordId[]
}

const variantId = (id: string, factionId: string): string => `${id}~${factionId}`

const variantMeta = (meta: WahapediaRecordMeta, factionId: string): WahapediaRecordMeta => ({
  ...meta,
  identitySourceRecordId:
    `${meta.identitySourceRecordId ?? meta.sourceRecordId}%7Cvariant%3A${factionId}` as SourceRecordId,
  variantFactionId: factionId,
})

const slug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

export const applyFactionVariants = (
  dataset: WahapediaDataset,
  variants: CorpusFactionVariant[] = [],
  abilities: CorpusVariantAbility[] = []
): WahapediaDataset => {
  if (!variants.length && !abilities.length) return dataset
  const factionIds = new Set(dataset.factions.map(faction => faction.id))
  const next: WahapediaDataset = {
    ...dataset,
    factions: [...dataset.factions],
    factionAbilityTypes: [...dataset.factionAbilityTypes],
    factionAbilitySubtypes: [...dataset.factionAbilitySubtypes],
    factionAbilities: [...dataset.factionAbilities],
    warscrolls: [...dataset.warscrolls],
    warscrollAbilities: [...dataset.warscrollAbilities],
    warscrollWeapons: [...dataset.warscrollWeapons],
    warscrollKeywords: [...dataset.warscrollKeywords],
    warscrollBases: [...dataset.warscrollBases],
  }
  const seen = new Set<string>()
  variants.forEach(variant => {
    const key = `${variant.sourceRecordId}|${variant.factionId}`
    if (
      seen.has(key) ||
      !factionIds.has(variant.factionId) ||
      !variant.reason.trim() ||
      !variant.officialSourceRecordIds.length
    ) {
      throw new Error(`Faction variant ${key} is malformed, repeated, or names an unknown faction`)
    }
    seen.add(key)
    const types = dataset.factionAbilityTypes.filter(
      type => type.meta.sourceRecordId === variant.sourceRecordId
    )
    const warscrolls = dataset.warscrolls.filter(
      record => record.meta.sourceRecordId === variant.sourceRecordId
    )
    if (types.length + warscrolls.length !== 1) {
      throw new Error(
        `Faction variant ${key} must name exactly one Army of Renown or warscroll record (found ${
          types.length + warscrolls.length
        })`
      )
    }
    const target = variant.factionId
    if (types.length) {
      const [type] = types
      if (type.factionId === target)
        throw new Error(`Faction variant ${key} copies a record onto its own faction`)
      next.factionAbilityTypes.push({
        ...type,
        id: variantId(type.id, target),
        factionId: target,
        meta: variantMeta(type.meta, target),
      })
      dataset.factionAbilitySubtypes
        .filter(subtype => subtype.typeId === type.id && subtype.factionId === type.factionId)
        .forEach(subtype =>
          next.factionAbilitySubtypes.push({
            ...subtype,
            id: variantId(subtype.id, target),
            typeId: variantId(type.id, target),
            factionId: target,
            meta: variantMeta(subtype.meta, target),
          })
        )
      dataset.factionAbilities
        .filter(ability => ability.typeId === type.id && ability.factionId === type.factionId)
        .forEach(ability =>
          next.factionAbilities.push({
            ...ability,
            factionId: target,
            typeId: variantId(ability.typeId, target),
            subtypeId: ability.subtypeId ? variantId(ability.subtypeId, target) : ability.subtypeId,
            meta: variantMeta(ability.meta, target),
          })
        )
      return
    }
    const [warscroll] = warscrolls
    if (warscroll.factionId === target)
      throw new Error(`Faction variant ${key} copies a record onto its own faction`)
    const copyId = variantId(warscroll.id, target)
    next.warscrolls.push({
      ...warscroll,
      id: copyId,
      factionId: target,
      meta: variantMeta(warscroll.meta, target),
    })
    const children = <T extends { warscrollId: string; meta: WahapediaRecordMeta }>(records: T[]): T[] =>
      records
        .filter(record => record.warscrollId === warscroll.id)
        .map(record => ({ ...record, warscrollId: copyId, meta: variantMeta(record.meta, target) }))
    next.warscrollAbilities.push(...children(dataset.warscrollAbilities))
    next.warscrollWeapons.push(...children(dataset.warscrollWeapons))
    next.warscrollKeywords.push(...children(dataset.warscrollKeywords))
    next.warscrollBases.push(...children(dataset.warscrollBases))
  })

  // A copy in a context its new faction did not field yet (Legends, for Khazalite Holds) extends that
  // faction's contexts, or no offer edge could connect them.
  const kindsByFaction = new Map<string, Set<string>>()
  const noteKinds = (factionId: string, meta: WahapediaRecordMeta) =>
    (meta.rulesContextKinds ?? (meta.rulesContextKind ? [meta.rulesContextKind] : [])).forEach(kind =>
      kindsByFaction.set(factionId, new Set([...Array.from(kindsByFaction.get(factionId) ?? []), kind]))
    )
  next.factionAbilityTypes.forEach(
    record => record.meta.variantFactionId && noteKinds(record.factionId, record.meta)
  )
  next.warscrolls.forEach(record => record.meta.variantFactionId && noteKinds(record.factionId, record.meta))
  next.factions = next.factions.map(faction => {
    const needed = kindsByFaction.get(faction.id)
    const current = faction.meta.rulesContextKinds
    if (!needed || !current) return faction
    const missing = Array.from(needed).filter(kind => !current.includes(kind as (typeof current)[number]))
    return missing.length
      ? {
          ...faction,
          meta: { ...faction.meta, rulesContextKinds: [...current, ...(missing as typeof current)].sort() },
        }
      : faction
  })

  abilities.forEach(added => {
    const subtype = next.factionAbilitySubtypes.find(
      record =>
        record.meta.sourceRecordId === added.groupSourceRecordId &&
        record.meta.variantFactionId === added.factionId
    )
    const officialRecord = added.officialSourceRecordIds[0]
    const checksum = decodeURIComponent(String(officialRecord ?? '')).match(
      /^source-record:games-workshop:([0-9a-f]{64}):page:\d+$/
    )?.[1]
    if (
      !subtype ||
      !checksum ||
      !added.name.trim() ||
      !added.timing.trim() ||
      !added.effect.trim() ||
      !added.reason.trim()
    ) {
      throw new Error(
        `Variant ability ${added.name} must join a copied group of ${added.factionId} and cite an official page`
      )
    }
    const type = next.factionAbilityTypes.find(
      record => record.id === subtype.typeId && record.factionId === added.factionId
    )!
    const lines = next.factionAbilities
      .filter(record => record.subtypeId === subtype.id && record.factionId === added.factionId)
      .map(record => Number.parseInt(record.line, 10) || 0)
    const record: WahapediaFactionAbilityRecord = {
      factionId: added.factionId,
      typeId: type.id,
      typeName: type.name,
      subtypeId: subtype.id,
      subtypeName: subtype.name,
      line: String(Math.max(0, ...lines) + 1),
      name: added.name,
      descriptionHtml: `${added.declare ? `<b>Declare:</b> ${added.declare}<br>` : ''}<b>Effect:</b> ${added.effect}`,
      legendHtml: '',
      abilityType: '',
      isReaction: /^Reaction\b/i.test(added.timing),
      conditionHtml: added.timing,
      keywordsHtml: '',
      abilityPhase: '',
      pointsType: '',
      points: '',
      meta: {
        file: 'Faction_abilities.csv',
        row: 0,
        artifactId: `artifact:sha256:${checksum}` as WahapediaRecordMeta['artifactId'],
        sourceRecordId: officialRecord,
        recordChecksum: createHash('sha256')
          .update(JSON.stringify([added.name, added.timing, added.declare ?? '', added.effect]))
          .digest('hex'),
        section: `variant-ability:${slug(added.name)}`,
        ...(subtype.meta.rulesContextKinds ? { rulesContextKinds: subtype.meta.rulesContextKinds } : {}),
        identitySourceRecordId:
          `${officialRecord}%23${slug(added.name)}%7Cvariant%3A${added.factionId}` as SourceRecordId,
        officialSourceRecordIds: added.officialSourceRecordIds,
        variantFactionId: added.factionId,
      },
    }
    next.factionAbilities.push(record)
  })
  return next
}
