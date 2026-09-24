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
  BsDataRegimentOfRenownExtractionResult,
  BsDataRegimentOfRenownFact,
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

  // BSData category links carry warscroll keywords, but the catalogues also attach roster-builder
  // constraint categories (`NON-GUTBUSTERS`, `NON-BEASTCLAW`, ... added at d7377e94 for the Ogor
  // Armies of Renown) that no official warscroll prints. Those are builder plumbing, not keywords.
  const keywords = childElements(entry, 'categoryLinks')
    .flatMap(links => childElements(links, 'categoryLink'))
    .map(link => plainText(link.attributes.name ?? '').toUpperCase())
    .filter(keyword => keyword && !isRosterConstraintCategory(keyword))
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
    const section = `option:${slug(option.name)}`
    const recordId = (suffix: string) =>
      sourceRecordId('bsdata', `${artifactChecksum}:${section}${suffix ? `:${suffix}` : ''}`)
    if (matches.length > 1) {
      // A catalogue may link the same option into several selection-entry groups (e.g. a
      // Realm-shaking Rampage offered once per eligible hero): identical repeats of the exact same
      // rules text collapse to a single fact. Differing copies stay a fail-closed diagnostic —
      // never guess which one is current.
      const signatures = new Set(
        matches
          .map(match => extractAbilityProfiles(match, option.name, recordId, []))
          .map(abilities => abilities.map(ability => ability.recordChecksum).join('|'))
      )
      if (signatures.size > 1) {
        diagnostics.push({
          code: 'duplicate-option',
          severity: 'error',
          message:
            `Option ${JSON.stringify(option.name)} appears ${matches.length} times in group ` +
            `${JSON.stringify(option.groupName)} with differing rules text`,
          unit: option.name,
        })
        return
      }
      matches = [matches[0]]
    }
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

/** The root id of BSData's `۞ Regiments of Renown` catalogue, the only file regiments come from. */
export const BSDATA_REGIMENTS_OF_RENOWN_CATALOGUE_ID = '1ed8-2e23-1563-c119'

const REGIMENT_ENTRY_PREFIX = 'Regiment of Renown: '

export interface BsDataRegimentOfRenownSpec {
  /** The regiment name without the `Regiment of Renown: ` entry prefix, e.g. `Krong the Club`. */
  name: string
}

const isForceCondition = (condition: XmlElement): boolean =>
  condition.attributes.type === 'instanceOf' && condition.attributes.scope === 'force'

/**
 * The force a regiment's entry is unhidden by. BSData models buying a regiment as adding a force
 * entry; the regiment's own rules entry and its members key their visibility on that force.
 */
const regimentForceIds = (entry: XmlElement): string[] =>
  Array.from(
    new Set(
      childElements(entry, 'modifiers')
        .flatMap(modifiers => childElements(modifiers, 'modifier'))
        .filter(modifier => modifier.attributes.field === 'hidden' && modifier.attributes.value === 'false')
        .flatMap(modifier => descendantElements(modifier, 'condition'))
        .filter(isForceCondition)
        .map(condition => condition.attributes.childId ?? '')
        .filter(Boolean)
    )
  )

type RegimentMemberLink = { name: string; count: number } | { name: string; ambiguous: string }

/**
 * A member is an entry link whose own modifier group, conditioned on exactly the regiment's
 * force, unhides it and sets both its min and max constraints to the same count. Anything else
 * (an or-group, extra conditions, min ≠ max) is reported rather than interpreted.
 */
const regimentMemberLinks = (root: XmlElement, entryId: string, forceId: string): RegimentMemberLink[] =>
  descendantElements(root, 'entryLink')
    .filter(link => link.attributes.targetId !== entryId)
    .flatMap((link): RegimentMemberLink[] => {
      const groups = childElements(link, 'modifierGroups')
        .flatMap(modifierGroups => childElements(modifierGroups, 'modifierGroup'))
        .filter(group =>
          descendantElements(group, 'condition').some(condition => condition.attributes.childId === forceId)
        )
      if (!groups.length) return []
      const name = plainText(link.attributes.name ?? '')
      if (groups.length !== 1) return [{ name, ambiguous: `${groups.length} modifier groups name the force` }]
      const [group] = groups
      const conditions = descendantElements(group, 'condition')
      if (group.attributes.type !== 'and' || conditions.length !== 1 || !isForceCondition(conditions[0])) {
        return [{ name, ambiguous: 'the force condition is not the sole and-condition' }]
      }
      const constraints = childElements(link, 'constraints').flatMap(item =>
        childElements(item, 'constraint')
      )
      const constraintId = (type: string): string | undefined =>
        constraints.find(constraint => constraint.attributes.type === type)?.attributes.id
      const modifiers = childElements(group, 'modifiers').flatMap(item => childElements(item, 'modifier'))
      const setValue = (field: string | undefined): number | undefined =>
        field === undefined
          ? undefined
          : integerValue(
              modifiers.find(
                modifier => modifier.attributes.type === 'set' && modifier.attributes.field === field
              )?.attributes.value
            )
      const minimum = setValue(constraintId('min'))
      const maximum = setValue(constraintId('max'))
      const unhidden = modifiers.some(
        modifier => modifier.attributes.field === 'hidden' && modifier.attributes.value === 'false'
      )
      if (!unhidden || minimum === undefined || minimum !== maximum || minimum < 1) {
        return [{ name, ambiguous: `min ${minimum ?? '?'} / max ${maximum ?? '?'} is not one fixed count` }]
      }
      return [{ name, count: minimum }]
    })

/**
 * Extract structured Regiment of Renown facts for an explicit, reviewed set of regiments from
 * the pinned BSData `Regiments of Renown.cat` (issue #1999). Only the named regiments are
 * extracted, and every missing or ambiguous shape is an error: the regiment's rules text is the
 * only thing BSData supplies, and its members are a cross-check the merge compares against the
 * official battle-profile row, never an authority.
 */
export const extractBsDataRegimentsOfRenown = (
  bytes: Uint8Array,
  artifactChecksum: string,
  specs: BsDataRegimentOfRenownSpec[]
): BsDataRegimentOfRenownExtractionResult => {
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
  if (root.name !== 'catalogue' || root.attributes.id !== BSDATA_REGIMENTS_OF_RENOWN_CATALOGUE_ID) {
    return {
      facts: [],
      diagnostics: [
        {
          code: 'regiment-catalogue-mismatch',
          severity: 'error',
          message:
            `Regiments of Renown come only from the catalogue ${BSDATA_REGIMENTS_OF_RENOWN_CATALOGUE_ID}; ` +
            `this file's root is <${root.name} id=${JSON.stringify(root.attributes.id ?? '')}>`,
        },
      ],
    }
  }
  const upgrades = descendantElements(root, 'selectionEntry').filter(
    entry => entry.attributes.type === 'upgrade'
  )
  const facts: BsDataRegimentOfRenownFact[] = []
  specs.forEach(spec => {
    const fail = (code: BsDataDiagnostic['code'], message: string): void => {
      diagnostics.push({ code, severity: 'error', message, unit: spec.name })
    }
    const matches = upgrades.filter(
      entry => (entry.attributes.name ?? '').trim() === `${REGIMENT_ENTRY_PREFIX}${spec.name}`
    )
    if (!matches.length) {
      fail('regiment-not-found', `Regiment ${JSON.stringify(spec.name)} is not present in the catalogue`)
      return
    }
    if (matches.length > 1) {
      fail('duplicate-regiment', `Regiment ${JSON.stringify(spec.name)} appears ${matches.length} times`)
      return
    }
    const [entry] = matches
    const section = `regiment:${slug(spec.name)}`
    const recordId = (suffix: string) =>
      sourceRecordId('bsdata', `${artifactChecksum}:${section}${suffix ? `:${suffix}` : ''}`)
    const diagnosticsBefore = diagnostics.length
    const abilities = extractAbilityProfiles(entry, spec.name, recordId, diagnostics)
    if (diagnostics.length !== diagnosticsBefore) return
    if (!abilities.length) {
      fail('missing-regiment-ability', `Regiment ${JSON.stringify(spec.name)} carries no ability profile`)
      return
    }
    const forceIds = regimentForceIds(entry)
    if (forceIds.length !== 1) {
      fail(
        'missing-regiment-member',
        `Regiment ${JSON.stringify(spec.name)} names ${forceIds.length} unhiding forces, so its members cannot be located`
      )
      return
    }
    const links = regimentMemberLinks(root, entry.attributes.id ?? '', forceIds[0])
    const linkNames = links.map(link => link.name)
    const ambiguous = [
      ...links.flatMap(link => ('ambiguous' in link ? [`${link.name} (${link.ambiguous})`] : [])),
      // A member linked more than once has no single fixed count; never sum the links.
      ...linkNames
        .filter((name, index) => linkNames.indexOf(name) !== index)
        .map(name => `${name} (linked more than once)`),
    ]
    if (ambiguous.length) {
      fail(
        'ambiguous-regiment-member',
        `Regiment ${JSON.stringify(spec.name)} has members without one fixed count: ${ambiguous.join(', ')}`
      )
      return
    }
    const counts = new Map<string, number>()
    links.forEach(link => {
      if ('count' in link) counts.set(link.name, link.count)
    })
    if (!counts.size) {
      fail('missing-regiment-member', `Regiment ${JSON.stringify(spec.name)} has no member entry link`)
      return
    }
    const withoutChecksum = {
      kind: 'regiment-of-renown' as const,
      name: plainText(spec.name),
      section,
      abilities,
      members: Array.from(counts, ([name, count]) => ({ name, count })).sort((left, right) =>
        left.name.localeCompare(right.name)
      ),
      sourceRecordId: recordId(''),
    }
    facts.push({ ...withoutChecksum, factChecksum: checksum(withoutChecksum) })
  })
  return { facts, diagnostics }
}

/** BSData pseudo-categories that exist only to express roster constraints (`NON-<keyword>`). */
const isRosterConstraintCategory = (keyword: string): boolean => /^NON-/.test(keyword)

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
