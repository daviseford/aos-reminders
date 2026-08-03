import { createHash } from 'node:crypto'
import { sourceRecordId, type SourceRecordId } from '../../domain'
import { childElements, descendantElements, parseXmlDocument, type XmlElement } from './xml'
import type {
  BsDataAbilityFact,
  BsDataDiagnostic,
  BsDataExtractionResult,
  BsDataFactionOptionExtractionResult,
  BsDataFactionOptionFact,
  BsDataFactionOptionType,
  BsDataWarscrollFact,
  BsDataWeaponFact,
} from './records'

/**
 * Extract structured warscroll facts for an explicit, reviewed set of units from a pinned BSData
 * catalogue. Only the named units are extracted: the community fallback tier is scoped per unit by
 * the review, never taken wholesale.
 */

const slug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

/** Strip BSData text markup (`**bold**`, `^^smallcaps^^`) and normalize whitespace. */
const plainText = (value: string): string =>
  value
    .replace(/\*\*/g, '')
    .replace(/\^\^/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim()

const characteristicText = (profile: XmlElement, name: string): string | undefined => {
  const value = descendantElements(profile, 'characteristic').find(
    characteristic => characteristic.attributes.name === name
  )
  return value === undefined ? undefined : plainText(value.text)
}

const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

const splitKeywords = (value: string | undefined): string[] =>
  (value ?? '')
    .split(/\s*,\s*/)
    .map(keyword => keyword.trim().toUpperCase())
    .filter(Boolean)

const integerValue = (value: string | undefined): number | undefined => {
  if (value === undefined || !/^\d+$/.test(value.trim())) return undefined
  return Number.parseInt(value.trim(), 10)
}

interface AbilityProfileShape {
  kind: BsDataAbilityFact['kind']
  costCharacteristic?: string
}

const ABILITY_PROFILE_TYPES: Record<string, AbilityProfileShape> = {
  'Ability (Activated)': { kind: 'activated' },
  'Ability (Passive)': { kind: 'passive' },
  'Ability (Spell)': { kind: 'spell', costCharacteristic: 'Casting Value' },
  'Ability (Prayer)': { kind: 'prayer', costCharacteristic: 'Chanting Value' },
  'Ability (Command)': { kind: 'command', costCharacteristic: 'Cost' },
}

const WEAPON_PROFILE_TYPES: Record<string, 'melee' | 'ranged'> = {
  'Melee Weapon': 'melee',
  'Ranged Weapon': 'ranged',
}

const unitEntries = (root: XmlElement): XmlElement[] =>
  descendantElements(root, 'selectionEntry').filter(entry => entry.attributes.type === 'unit')

/**
 * Extract every Ability profile carried by an entry. Shared between unit warscrolls and faction
 * roster options; the caller supplies the record-ID naming scheme.
 */
const extractAbilityProfiles = (
  entry: XmlElement,
  ownerName: string,
  recordId: (suffix: string) => ReturnType<typeof sourceRecordId>,
  diagnostics: BsDataDiagnostic[]
): BsDataAbilityFact[] => {
  const abilities: BsDataAbilityFact[] = []
  descendantElements(entry, 'profile').forEach(profile => {
    const typeName = profile.attributes.typeName ?? ''
    const abilityShape = ABILITY_PROFILE_TYPES[typeName]
    if (!abilityShape) return
    const effect = plainText(characteristicText(profile, 'Effect') ?? '')
    if (!effect) {
      diagnostics.push({
        code: 'missing-ability-effect',
        severity: 'error',
        message: `Ability ${profile.attributes.name ?? '(unnamed)'} on ${ownerName} has no effect text`,
        unit: ownerName,
      })
      return
    }
    const declare = plainText(characteristicText(profile, 'Declare') ?? '')
    const line = abilities.length + 1
    const costValue = abilityShape.costCharacteristic
      ? integerValue(characteristicText(profile, abilityShape.costCharacteristic))
      : undefined
    const withoutChecksum = {
      line,
      name: plainText(profile.attributes.name ?? ''),
      kind: abilityShape.kind,
      timing: plainText(characteristicText(profile, 'Timing') ?? ''),
      ...(declare ? { declare } : {}),
      effect,
      keywords: splitKeywords(plainText(characteristicText(profile, 'Keywords') ?? '')),
      ...(costValue === undefined ? {} : { costValue }),
      sourceRecordId: recordId(`ability:${line}`),
    }
    abilities.push({ ...withoutChecksum, recordChecksum: checksum(withoutChecksum) })
  })
  return abilities
}

const extractUnit = (
  entry: XmlElement,
  artifactChecksum: string,
  diagnostics: BsDataDiagnostic[]
): BsDataWarscrollFact | undefined => {
  const name = entry.attributes.name ?? ''
  const section = `unit:${slug(name)}`
  const recordId = (suffix: string) =>
    sourceRecordId('bsdata', `${artifactChecksum}:${section}${suffix ? `:${suffix}` : ''}`)
  const profiles = descendantElements(entry, 'profile')
  const unitProfile = profiles.find(profile => profile.attributes.typeName === 'Unit')
  if (!unitProfile) {
    diagnostics.push({
      code: 'missing-characteristic',
      severity: 'error',
      message: `Unit ${name} has no Unit characteristics profile`,
      unit: name,
    })
    return undefined
  }
  const characteristics = {
    move: characteristicText(unitProfile, 'Move') ?? '',
    save: characteristicText(unitProfile, 'Save') ?? '',
    control: characteristicText(unitProfile, 'Control') ?? '',
    health: characteristicText(unitProfile, 'Health') ?? '',
  }
  const missing = Object.entries(characteristics)
    .filter(([, value]) => !value)
    .map(([key]) => key)
  if (missing.length) {
    diagnostics.push({
      code: 'missing-characteristic',
      severity: 'error',
      message: `Unit ${name} is missing characteristics: ${missing.join(', ')}`,
      unit: name,
    })
    return undefined
  }

  const abilities: BsDataAbilityFact[] = []
  const weapons: BsDataWeaponFact[] = []
  profiles.forEach(profile => {
    const typeName = profile.attributes.typeName ?? ''
    if (typeName === 'Unit') return
    const abilityShape = ABILITY_PROFILE_TYPES[typeName]
    if (abilityShape) {
      const effect = plainText(characteristicText(profile, 'Effect') ?? '')
      if (!effect) {
        diagnostics.push({
          code: 'missing-ability-effect',
          severity: 'error',
          message: `Ability ${profile.attributes.name ?? '(unnamed)'} on ${name} has no effect text`,
          unit: name,
        })
        return
      }
      const declare = plainText(characteristicText(profile, 'Declare') ?? '')
      const line = abilities.length + 1
      const costValue = abilityShape.costCharacteristic
        ? integerValue(characteristicText(profile, abilityShape.costCharacteristic))
        : undefined
      const withoutChecksum = {
        line,
        name: plainText(profile.attributes.name ?? ''),
        kind: abilityShape.kind,
        timing: plainText(characteristicText(profile, 'Timing') ?? ''),
        ...(declare ? { declare } : {}),
        effect,
        keywords: splitKeywords(plainText(characteristicText(profile, 'Keywords') ?? '')),
        ...(costValue === undefined ? {} : { costValue }),
        sourceRecordId: recordId(`ability:${line}`),
      }
      abilities.push({ ...withoutChecksum, recordChecksum: checksum(withoutChecksum) })
      return
    }
    const weaponType = WEAPON_PROFILE_TYPES[typeName]
    if (weaponType) {
      const line = weapons.length + 1
      const abilityText = plainText(characteristicText(profile, 'Ability') ?? '')
      const range = plainText(characteristicText(profile, 'Rng') ?? '')
      const withoutChecksum = {
        line,
        name: plainText(profile.attributes.name ?? ''),
        weaponType,
        ...(weaponType === 'ranged' && range ? { range } : {}),
        attacks: plainText(characteristicText(profile, 'Atk') ?? ''),
        hit: plainText(characteristicText(profile, 'Hit') ?? ''),
        wound: plainText(characteristicText(profile, 'Wnd') ?? ''),
        rend: plainText(characteristicText(profile, 'Rnd') ?? ''),
        damage: plainText(characteristicText(profile, 'Dmg') ?? ''),
        abilityLabels:
          abilityText && abilityText !== '-'
            ? abilityText
                .split(/\s*,\s*/)
                .map(label => label.trim())
                .filter(Boolean)
            : [],
        sourceRecordId: recordId(`weapon:${line}`),
      }
      weapons.push({ ...withoutChecksum, recordChecksum: checksum(withoutChecksum) })
      return
    }
    diagnostics.push({
      code: 'unknown-profile-type',
      severity: 'error',
      message: `Unit ${name} carries an unrecognized profile type ${JSON.stringify(typeName)}`,
      unit: name,
    })
  })

  const keywords = childElements(entry, 'categoryLinks')
    .flatMap(links => childElements(links, 'categoryLink'))
    .map(link => plainText(link.attributes.name ?? '').toUpperCase())
    .filter(Boolean)
  const baseSizes = Array.from(
    new Set(
      descendantElements(entry, 'rule')
        .filter(rule => rule.attributes.name === 'Base Size')
        .flatMap(rule => childElements(rule, 'description').map(description => plainText(description.text)))
        .filter(Boolean)
    )
  )

  const withoutChecksum = {
    kind: 'unit-warscroll' as const,
    name: plainText(name),
    section,
    characteristics,
    keywords,
    abilities,
    weapons,
    baseSizes,
    sourceRecordId: recordId(''),
  }
  return { ...withoutChecksum, factChecksum: checksum(withoutChecksum) }
}

export interface BsDataFactionOptionSpec {
  /** The option name exactly as the BSData catalogue spells it. */
  name: string
  optionType: BsDataFactionOptionType
  /** The `selectionEntryGroup` name the option must be found in. */
  groupName: string
  /** Reviewed routing metadata carried onto the fact; see `BsDataFactionOptionFact`. */
  faction?: string
  typeSourceRecordId?: SourceRecordId
}

/**
 * A lore is transcribed as one `selectionEntryGroup` whose member entries are its spells or
 * prayers, and army-wide battle traits as one `selectionEntry` carrying every trait ability, so
 * those option kinds extract the whole container rather than a named entry inside a group.
 */
const CONTAINER_OPTION_TYPES = new Set<BsDataFactionOptionType>(['spell-lore', 'prayer-lore', 'battle-trait'])

/**
 * Extract structured faction roster-option facts (battle formations, heroic traits, artefacts)
 * for an explicit, reviewed set of options from a pinned BSData faction catalogue. Only the named
 * options are extracted: the community fallback tier is scoped per option by the review, never
 * taken wholesale.
 */
export const extractBsDataFactionOptions = (
  bytes: Uint8Array,
  artifactChecksum: string,
  options: BsDataFactionOptionSpec[]
): BsDataFactionOptionExtractionResult => {
  const diagnostics: BsDataDiagnostic[] = []
  const source = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  const parsed = parseXmlDocument(source)
  if (!parsed.root) {
    return {
      facts: [],
      diagnostics: parsed.errors.map(error => ({
        code: 'invalid-xml',
        severity: 'error',
        message: error,
      })),
    }
  }
  const root = parsed.root
  const groups = descendantElements(root, 'selectionEntryGroup')
  const facts: BsDataFactionOptionFact[] = []
  options.forEach(option => {
    let matches: XmlElement[]
    if (CONTAINER_OPTION_TYPES.has(option.optionType)) {
      // The container itself is the option: a lore is a `selectionEntryGroup` whose entries are
      // its spells or prayers, and army-wide battle traits are one `selectionEntry` carrying the
      // trait abilities. The reviewed name and group name are the container's own name.
      matches =
        option.optionType === 'battle-trait'
          ? descendantElements(root, 'selectionEntry').filter(
              entry => (entry.attributes.name ?? '').trim() === option.groupName
            )
          : groups.filter(candidate => (candidate.attributes.name ?? '').trim() === option.groupName)
    } else {
      // A catalogue may carry several groups with the same name (e.g. a seasonal and a battletome
      // `Plunder of the Mawtribes`); search them all and fail closed on an ambiguous option name.
      const namedGroups = groups.filter(
        candidate => (candidate.attributes.name ?? '').trim() === option.groupName
      )
      if (!namedGroups.length) {
        diagnostics.push({
          code: 'option-not-found',
          severity: 'error',
          message: `Group ${JSON.stringify(option.groupName)} is not present in the catalogue`,
          unit: option.name,
        })
        return
      }
      matches = namedGroups.flatMap(group =>
        descendantElements(group, 'selectionEntry').filter(
          entry => (entry.attributes.name ?? '').trim() === option.name
        )
      )
    }
    if (!matches.length) {
      diagnostics.push({
        code: 'option-not-found',
        severity: 'error',
        message: `Option ${JSON.stringify(option.name)} is not present in group ${JSON.stringify(option.groupName)}`,
        unit: option.name,
      })
      return
    }
    if (matches.length > 1) {
      diagnostics.push({
        code: 'duplicate-option',
        severity: 'error',
        message: `Option ${JSON.stringify(option.name)} appears ${matches.length} times in group ${JSON.stringify(option.groupName)}`,
        unit: option.name,
      })
      return
    }
    const section = `option:${slug(option.name)}`
    const recordId = (suffix: string) =>
      sourceRecordId('bsdata', `${artifactChecksum}:${section}${suffix ? `:${suffix}` : ''}`)
    const abilities = extractAbilityProfiles(matches[0], option.name, recordId, diagnostics)
    if (!abilities.length) {
      diagnostics.push({
        code: 'missing-option-ability',
        severity: 'error',
        message: `Option ${JSON.stringify(option.name)} carries no ability profile`,
        unit: option.name,
      })
      return
    }
    const withoutChecksum = {
      kind: 'faction-option' as const,
      optionType: option.optionType,
      name: plainText(option.name),
      section,
      groupName: option.groupName,
      abilities,
      sourceRecordId: recordId(''),
    }
    facts.push({
      ...withoutChecksum,
      factChecksum: checksum(withoutChecksum),
      // Routing metadata is reviewed configuration, not transcription content: it stays outside
      // the pinned fact checksum so re-routing never masquerades as a source change.
      ...(option.faction ? { faction: option.faction } : {}),
      ...(option.typeSourceRecordId ? { typeSourceRecordId: option.typeSourceRecordId } : {}),
    })
  })
  return { facts, diagnostics }
}

export const extractBsDataWarscrolls = (
  bytes: Uint8Array,
  artifactChecksum: string,
  unitNames: string[]
): BsDataExtractionResult => {
  const diagnostics: BsDataDiagnostic[] = []
  const source = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
  const parsed = parseXmlDocument(source)
  if (!parsed.root) {
    return {
      facts: [],
      diagnostics: parsed.errors.map(error => ({
        code: 'invalid-xml',
        severity: 'error',
        message: error,
      })),
    }
  }
  const entries = unitEntries(parsed.root)
  const facts: BsDataWarscrollFact[] = []
  unitNames.forEach(unitName => {
    const matches = entries.filter(entry => (entry.attributes.name ?? '').trim() === unitName)
    if (!matches.length) {
      diagnostics.push({
        code: 'unit-not-found',
        severity: 'error',
        message: `Unit ${JSON.stringify(unitName)} is not present in the catalogue`,
        unit: unitName,
      })
      return
    }
    if (matches.length > 1) {
      diagnostics.push({
        code: 'duplicate-unit',
        severity: 'error',
        message: `Unit ${JSON.stringify(unitName)} appears ${matches.length} times in the catalogue`,
        unit: unitName,
      })
      return
    }
    const fact = extractUnit(matches[0], artifactChecksum, diagnostics)
    if (fact) facts.push(fact)
  })
  return { facts, diagnostics }
}
