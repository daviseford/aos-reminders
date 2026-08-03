import { createHash } from 'node:crypto'
import { JSDOM } from 'jsdom'
import { artifactId, sourceRecordId } from '../../domain'
import type {
  WahapediaHtmlAbilityRecord,
  WahapediaHtmlCollectionParseResult,
  WahapediaHtmlContext,
  WahapediaHtmlDiagnostic,
  WahapediaHtmlFactionAbilityRecord,
  WahapediaHtmlFactionGroupRecord,
  WahapediaHtmlFactionParseResult,
  WahapediaHtmlInput,
  WahapediaHtmlParseResult,
  WahapediaHtmlRecordMeta,
  WahapediaHtmlRegimentOfRenown,
  WahapediaHtmlRulesParseResult,
  WahapediaHtmlWeaponRecord,
  WahapediaHtmlWarscrollRecord,
} from './records'

const sha256 = (value: string): string => createHash('sha256').update(value, 'utf8').digest('hex')

const repairMojibake = (value: string): string =>
  value
    .replace(/â€™/g, '’')
    .replace(/â€˜/g, '‘')
    .replace(/â€œ/g, '“')
    .replace(/â€/g, '”')
    .replace(/â€“/g, '–')
    .replace(/â€”/g, '—')
    .replace(/Ã—/g, '×')
    .replace(/Â(?=[\s"'’“”])/g, '')

const normalizedText = (element: Element | null | undefined): string =>
  repairMojibake(
    element?.textContent
      ?.replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() ?? ''
  )

const characteristicText = (element: Element | null | undefined): string =>
  normalizedText(element) || (element?.querySelector('img') ? '*' : '')

const recordMeta = (
  input: WahapediaHtmlInput,
  section: string,
  value: unknown,
  scope?: string
): WahapediaHtmlRecordMeta => ({
  artifactId: artifactId(input.artifact.checksum),
  sourceRecordId: sourceRecordId(
    'wahapedia',
    `html:${input.artifact.finalUrl}#${scope ? `${scope}/${section}` : section}`
  ),
  recordChecksum: sha256(JSON.stringify(value)),
  section: scope ? `${scope}/${section}` : section,
})

const pageContext = (sourceTitle: string, name: string, headerText = ''): WahapediaHtmlContext => {
  if (/\bSPEARHEAD WARSCROLL\b/i.test(headerText)) return 'spearhead'
  if (/\bScourge of Aqshy\b/i.test(sourceTitle) || /^Scourge of Aqshy\b/i.test(name)) {
    return 'seasonal'
  }
  if (/\bScourge of Ghyran\b/i.test(sourceTitle) || /^Scourge of Ghyran\b/i.test(name)) {
    return 'historical'
  }
  if (/\bSpearhead\b/i.test(sourceTitle)) return 'spearhead'
  if (/\bLegends?\b/i.test(sourceTitle)) return 'legends'
  return 'standard'
}

const cloneWithout = (element: Element, selector: string): Element => {
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll(selector).forEach(item => item.remove())
  return clone
}

const profileValues = (element: Element): Map<string, string> => {
  const values = new Map<string, string>()
  const clone = element.cloneNode(true) as Element
  clone.querySelectorAll('br').forEach(lineBreak => lineBreak.replaceWith('\n'))
  clone.querySelectorAll('div').forEach(block => block.append('\n'))
  const text = clone.textContent ?? ''
  text
    .split(/\n+/)
    .map(line =>
      line
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter(Boolean)
    .forEach(line => {
      const matches = Array.from(
        line.matchAll(/(Unit Size|Points|Base size|Can be reinforced|Regiment Options|Notes):\s*/gi)
      )
      matches.forEach((match, index) => {
        const start = (match.index ?? 0) + match[0].length
        const end = matches[index + 1]?.index ?? line.length
        values.set(match[1].toLowerCase(), line.slice(start, end).trim())
      })
    })
  return values
}

const integer = (value: string | undefined): number | undefined => {
  if (!value || !/^\d+$/.test(value.trim())) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

const commaList = (value: string | undefined): string[] =>
  value
    ?.split(/\s*,\s*/)
    .map(item => item.trim())
    .filter(Boolean) ?? []

const weaponRecords = (
  root: ParentNode,
  input: WahapediaHtmlInput,
  diagnostics: WahapediaHtmlDiagnostic[],
  scope?: string
): WahapediaHtmlWeaponRecord[] => {
  const records: WahapediaHtmlWeaponRecord[] = []
  const table = root.querySelector('.wsTable table')
  if (!table) return records
  let weaponType: WahapediaHtmlWeaponRecord['weaponType'] | undefined

  for (const row of Array.from(table.querySelectorAll('tr'))) {
    const header = normalizedText(row.matches('.wsHeaderRow') ? row : undefined)
    if (/^RANGED WEAPONS/i.test(header)) weaponType = 'RANGED'
    if (/^MELEE WEAPONS/i.test(header)) weaponType = 'MELEE'
    if (!row.matches('tr.wsDataRow:not(.wsDataRow_short)') || !weaponType) continue
    const nameCell = (Array.from(row.querySelectorAll('.wsDataCell_long')) as HTMLElement[])
      .filter(cell => normalizedText(cell))
      .at(-1)
    const rawCharacteristics = Array.from(row.querySelectorAll('.wsCell')).map(normalizedText)
    let characteristics =
      weaponType === 'MELEE' && rawCharacteristics.length === 6 && rawCharacteristics[0] === ''
        ? rawCharacteristics.slice(1)
        : rawCharacteristics
    const expected = weaponType === 'RANGED' ? 6 : 5
    const sharedCharacteristic = normalizedText(row.querySelector('.colspan_see_below'))
    if (sharedCharacteristic && characteristics.length < expected) {
      characteristics = [
        ...characteristics,
        ...Array.from({ length: expected - characteristics.length }, () => sharedCharacteristic),
      ]
    }
    if (!nameCell || characteristics.length !== expected) {
      diagnostics.push({
        code: 'malformed-weapon-row',
        severity: 'error',
        url: input.artifact.finalUrl,
        section: scope ? `${scope}/weapon:${records.length + 1}` : `weapon:${records.length + 1}`,
        message: `Expected a ${weaponType.toLowerCase()} weapon name and ${expected} characteristics`,
      })
      continue
    }
    const ability = nameCell.querySelector('.wsWeaponAbility')
    const nameClone = nameCell.cloneNode(true) as HTMLElement
    nameClone.querySelectorAll('.wsWeaponAbility').forEach(item => item.remove())
    const name = normalizedText(nameClone)
    const [range, attacks, hit, wound, rend, damage] =
      weaponType === 'RANGED' ? characteristics : ['', ...characteristics]
    const value = {
      line: records.length + 1,
      name,
      range,
      attacks,
      hit,
      wound,
      rend,
      damage,
      weaponType,
      abilitiesHtml: repairMojibake(ability?.innerHTML ?? ''),
    }
    records.push({
      ...value,
      meta: recordMeta(input, `weapon:${value.line}`, value, scope),
    })
  }
  return records
}

const abilityValue = (header: Element, body: Element, line: number) => {
  const cleanBody = cloneWithout(body, '.ShowFluff')
  const nameElement = cleanBody.querySelector(':scope > b')
  const name = normalizedText(nameElement).replace(/:\s*$/, '')
  nameElement?.remove()
  const condition = normalizedText(header)
  // The ability's KEYWORDS strip is a sibling rendered after the body, not part of the header:
  // header `.kwb` spans are keyword *mentions* inside the timing text ("You declared a FIGHT
  // ability"), while the strip carries the ability's own keyword line ("DIRTY TRICK",
  // "SPELL, UNLIMITED") that the retired CSV export shipped in its `keywords` column.
  const keywordsStrip =
    body.nextElementSibling?.classList.contains('abKeywords') === true ? body.nextElementSibling : null
  const keywordHtml = normalizedText(keywordsStrip?.querySelector('.abKeywordsBodyText'))
  const phase =
    condition.match(
      /\b(?:Your|Enemy|Any) (?:Start of Turn|Hero|Movement|Shooting|Charge|Combat|End of Turn)(?: Phase)?\b/i
    )?.[0] ?? ''
  const pointsMatch = condition.match(/\b(Spell|Prayer)\s*\((\d+)\)/i)
  return {
    line,
    name,
    descriptionHtml: repairMojibake(cleanBody.innerHTML.trim()),
    conditionHtml: repairMojibake(header.innerHTML.trim()),
    keywordsHtml: keywordHtml,
    abilityType: header.getAttribute('bgcolor') ?? '',
    abilityPhase: phase,
    isReaction: /\bReaction:/i.test(condition),
    pointsType: pointsMatch?.[1] ?? '',
    points: pointsMatch?.[2] ?? '',
  }
}

/**
 * Read a Regiment of Renown datasheet's INCLUSION and ORGANISATION blocks.
 *
 * A Regiment of Renown datasheet carries no characteristic circle; what defines it is the
 * `•REGIMENT OF RENOWN•` nails header, the INCLUSION block listing the factions whose armies may
 * include the regiment, and the ORGANISATION block linking the member warscrolls the purchase
 * brings. A handful of regiments (single-model bands like Gotrek Gurnisson) publish their
 * organisation as plain text without links; those simply contribute no member links.
 */
const regimentOfRenownStructure = (datasheet: Element): WahapediaHtmlRegimentOfRenown => {
  const sectionContainer = (label: string): Element | undefined => {
    const header = (Array.from(datasheet.querySelectorAll('.wsAbilityHeader')) as Element[]).find(
      candidate => normalizedText(candidate).toUpperCase() === label
    )
    return header?.parentElement ?? undefined
  }
  const inclusion = sectionContainer('INCLUSION')
  const organisation = sectionContainer('ORGANISATION')
  return {
    inclusionFactionNames: inclusion
      ? Array.from(inclusion.querySelectorAll('ul li a')).map(normalizedText).filter(Boolean)
      : [],
    members: organisation
      ? Array.from(organisation.querySelectorAll('a[href]')).flatMap(link => {
          const name = normalizedText(link)
          const href = link.getAttribute('href') ?? ''
          return name && href.includes('#') ? [{ name, href }] : []
        })
      : [],
  }
}

const abilityRecords = (
  root: ParentNode,
  input: WahapediaHtmlInput,
  diagnostics: WahapediaHtmlDiagnostic[],
  scope?: string
): WahapediaHtmlAbilityRecord[] => {
  const headers = Array.from(root.querySelectorAll('.abHeader:not(.abKeywordsBody)'))
  const bodies = Array.from(root.querySelectorAll('.abBody'))
  if (headers.length !== bodies.length) {
    diagnostics.push({
      code: 'ability-pair-mismatch',
      severity: 'error',
      url: input.artifact.finalUrl,
      ...(scope ? { section: scope } : {}),
      message: `Found ${headers.length} ability headers and ${bodies.length} ability bodies`,
    })
  }
  return headers.slice(0, bodies.length).flatMap((header, index) => {
    const value = abilityValue(header, bodies[index], index + 1)
    return value.name ? [{ ...value, meta: recordMeta(input, `ability:${value.line}`, value, scope) }] : []
  })
}

const parseDatasheet = (
  datasheet: Element,
  factionName: string,
  input: WahapediaHtmlInput,
  diagnostics: WahapediaHtmlDiagnostic[],
  scope?: string,
  fallbackGroupId?: string,
  fallbackGroupName?: string
): WahapediaHtmlWarscrollRecord | undefined => {
  const headerName = normalizedText(datasheet.querySelector('.wsHeaderIn'))
  if (!headerName) {
    diagnostics.push({
      code: 'not-warscroll-page',
      severity: 'error',
      url: input.artifact.finalUrl,
      ...(scope ? { section: scope } : {}),
      message: 'A Wahapedia datasheet does not contain an identifiable warscroll name',
    })
    return undefined
  }
  const anchoredExternalId = datasheet.querySelector(':scope > a[name]')?.getAttribute('name')?.trim() ?? ''
  const externalId =
    anchoredExternalId ||
    (!scope
      ? decodeURIComponent(new URL(input.artifact.finalUrl).pathname.split('/').filter(Boolean).at(-1) ?? '')
      : fallbackGroupId
        ? `${fallbackGroupId}:${headerName
            .normalize('NFKD')
            .replace(/[^a-z0-9]+/gi, '-')
            .replace(/^-|-$/g, '')}`
        : '')
  if (!externalId) {
    diagnostics.push({
      code: 'missing-source-id',
      severity: 'error',
      url: input.artifact.finalUrl,
      ...(scope ? { section: scope } : {}),
      message: `Wahapedia warscroll ${headerName} has no stable source anchor`,
    })
    return undefined
  }
  const externalName = decodeURIComponent(externalId).replace(/-/g, ' ').trim()
  const headerCanonical = canonicalFactionName(headerName)
  const externalCanonical = canonicalFactionName(externalName)
  const name =
    !externalId.includes(':') &&
    externalCanonical &&
    headerCanonical &&
    !externalCanonical.includes(headerCanonical) &&
    !headerCanonical.includes(externalCanonical)
      ? externalName
      : headerName
  const recordScope = `datasheet:${externalId}`
  const sourceTitle = repairMojibake(
    (datasheet.querySelector('img.logo3[title]') as HTMLImageElement | null)?.title ?? ''
  )
  const headerText = normalizedText(datasheet.querySelector('.nails-header'))
  const characteristics = {
    move: characteristicText(datasheet.querySelector('.wsMove')),
    health: characteristicText(datasheet.querySelector('.wsWounds')),
    save: characteristicText(datasheet.querySelector('.wsSave')),
    control: characteristicText(datasheet.querySelector('.wsBravery')),
  }
  const characteristicCount = Object.values(characteristics).filter(Boolean).length
  const recordKind: WahapediaHtmlWarscrollRecord['recordKind'] =
    characteristicCount === 0 ? 'content-group' : 'warscroll'
  if (recordKind === 'warscroll') {
    Object.entries(characteristics).forEach(([field, value]) => {
      if (value) return
      diagnostics.push({
        code: 'missing-characteristic',
        severity: 'error',
        url: input.artifact.finalUrl,
        section: field,
        message: `Warscroll ${name} is missing ${field}`,
      })
    })
  }
  const profileElement = datasheet.querySelector('.PitchedBattleProfile')
  const profile = profileElement ? profileValues(profileElement) : new Map<string, string>()
  if (
    recordKind === 'warscroll' &&
    !profileElement &&
    pageContext(sourceTitle, name, headerText) !== 'spearhead'
  ) {
    diagnostics.push({
      code: 'missing-battle-profile',
      severity: 'warning',
      url: input.artifact.finalUrl,
      message: `Warscroll ${name} does not include a Battle Profile block`,
    })
  }
  const ward =
    normalizedText(datasheet.querySelector('.wsWard')) ||
    (Array.from(datasheet.querySelectorAll('.abBody')) as Element[]).flatMap(body => {
      if (!/^WARD SAVE\b/i.test(normalizedText(body))) return []
      return normalizedText(body).match(/\bward value(?: is| of)?\s*(\d\+)\b/i)?.[1] ?? []
    })[0]
  const value = {
    recordKind,
    externalId,
    ...(!anchoredExternalId && fallbackGroupId
      ? {
          parentExternalId: fallbackGroupId,
          ...(fallbackGroupName ? { parentName: fallbackGroupName } : {}),
        }
      : {}),
    name,
    factionName,
    sourceTitle,
    sourceUrl: scope
      ? `${input.artifact.finalUrl}#${encodeURIComponent(externalId)}`
      : input.artifact.finalUrl,
    context: pageContext(sourceTitle, name, headerText),
    characteristics: { ...characteristics, ...(ward ? { ward } : {}) },
    descriptionHtml: repairMojibake(datasheet.querySelector('.wsDescription')?.innerHTML.trim() ?? ''),
    keywords: [
      ...commaList(normalizedText(datasheet.querySelector('.wsKeywordLine1'))),
      ...commaList(normalizedText(datasheet.querySelector('.wsKeywordLine2'))),
    ],
    unitSize: integer(profile.get('unit size')),
    points: integer(profile.get('points')),
    baseSizes: commaList(profile.get('base size')),
    regimentOptions: commaList(profile.get('regiment options')),
    notes: commaList(profile.get('notes')),
    canBeReinforced: profile.has('can be reinforced')
      ? /^yes$/i.test(profile.get('can be reinforced') ?? '')
      : undefined,
  }
  // The marker sits outside the hashed record value, like a faction group's `armyOfRenown`
  // classification: it derives from page structure, so carrying it must not change identity.
  const regimentOfRenown = /\bREGIMENTS? OF RENOWN\b/i.test(headerText)
    ? regimentOfRenownStructure(datasheet)
    : undefined
  return {
    ...value,
    ...(regimentOfRenown ? { regimentOfRenown } : {}),
    weapons: weaponRecords(datasheet, input, diagnostics, recordScope),
    abilities: abilityRecords(datasheet, input, diagnostics, recordScope),
    meta: recordMeta(input, 'warscroll', value, recordScope),
    artifact: input.artifact,
  }
}

const decodeHtml = (
  input: WahapediaHtmlInput
): {
  document?: Document
  diagnostics: WahapediaHtmlDiagnostic[]
  cleanup?: () => void
} => {
  try {
    const html = new TextDecoder('utf-8', { fatal: true }).decode(input.bytes)
    const dom = new JSDOM(html)
    return {
      document: dom.window.document,
      diagnostics: [],
      cleanup: () => dom.window.close(),
    }
  } catch {
    return {
      diagnostics: [
        {
          code: 'invalid-utf8',
          severity: 'error',
          url: input.artifact.finalUrl,
          message: 'Wahapedia HTML is not valid UTF-8',
        },
      ],
    }
  }
}

export const parseWahapediaWarscrollHtml = (input: WahapediaHtmlInput): WahapediaHtmlParseResult => {
  const decoded = decodeHtml(input)
  if (!decoded.document) return { diagnostics: decoded.diagnostics }
  const datasheets = Array.from(decoded.document.querySelectorAll('.datasheet'))
  const factionName = normalizedText(decoded.document.querySelector('.page_header_span2, .page_header_span'))
  if (datasheets.length !== 1 || !factionName) {
    const result: WahapediaHtmlParseResult = {
      diagnostics: [
        ...decoded.diagnostics,
        {
          code: 'not-warscroll-page',
          severity: 'error',
          url: input.artifact.finalUrl,
          message: `The HTML contains ${datasheets.length} datasheets; expected one identifiable faction warscroll`,
        },
      ],
    }
    decoded.cleanup?.()
    return result
  }
  const page = parseDatasheet(datasheets[0], factionName, input, decoded.diagnostics)
  const result = { ...(page ? { page } : {}), diagnostics: decoded.diagnostics }
  decoded.cleanup?.()
  return result
}

/**
 * A faction root page carries the faction's Spearhead warscrolls inline while the rest live on its
 * `warscrolls.html` collection. Factions Wahapedia publishes without a collection page — currently
 * Endless Spells, whose manifestations sit under their lore headings — carry every warscroll on the
 * root page instead, so the caller states which datasheets the root is expected to contribute.
 */
export type WahapediaFactionRootWarscrollScope = 'spearhead' | 'all'

const parseWahapediaWarscrollCollection = (
  input: WahapediaHtmlInput,
  spearheadOnly: boolean
): WahapediaHtmlCollectionParseResult => {
  const decoded = decodeHtml(input)
  if (!decoded.document) return { pages: [], diagnostics: decoded.diagnostics }
  const allDatasheets = Array.from(decoded.document.querySelectorAll('.datasheet'))
  const datasheets = spearheadOnly
    ? allDatasheets.filter(datasheet =>
        /\bSPEARHEAD WARSCROLL\b/i.test(normalizedText(datasheet.querySelector('.nails-header')))
      )
    : allDatasheets
  const factionName = normalizedText(decoded.document.querySelector('.page_header_span2, .page_header_span'))
  if (spearheadOnly && !datasheets.length && factionName) {
    decoded.cleanup?.()
    return { pages: [], diagnostics: decoded.diagnostics }
  }
  if (!datasheets.length || !factionName) {
    const result: WahapediaHtmlCollectionParseResult = {
      pages: [],
      diagnostics: [
        ...decoded.diagnostics,
        {
          code: 'not-warscroll-page',
          severity: 'error',
          url: input.artifact.finalUrl,
          message: 'The HTML does not contain an identifiable faction warscroll collection',
        },
      ],
    }
    decoded.cleanup?.()
    return result
  }
  const pages = datasheets.flatMap((datasheet, index) => {
    const precedingHeading = Array.from(decoded.document!.querySelectorAll('h2'))
      .filter(heading => Boolean(heading.compareDocumentPosition(datasheet) & 4))
      .at(-1)
    const page = parseDatasheet(
      datasheet,
      factionName,
      input,
      decoded.diagnostics,
      `datasheet:${index + 1}`,
      precedingHeading ? headingExternalId(precedingHeading) : undefined,
      precedingHeading ? normalizedText(precedingHeading) : undefined
    )
    return page ? [page] : []
  })
  const existingIds = new Set(pages.map(page => page.externalId))
  const addedParentIds = new Set<string>()
  const pagesWithParents = pages.flatMap(page => {
    if (
      !page.parentExternalId ||
      !page.parentName ||
      existingIds.has(page.parentExternalId) ||
      addedParentIds.has(page.parentExternalId)
    ) {
      return [page]
    }
    const value = {
      recordKind: 'content-group' as const,
      externalId: page.parentExternalId,
      name: page.parentName,
      factionName,
      sourceTitle: page.sourceTitle,
      sourceUrl: `${input.artifact.finalUrl}#${encodeURIComponent(page.parentExternalId)}`,
      context: page.context,
      characteristics: { move: '', health: '', save: '', control: '' },
      descriptionHtml: '',
      keywords: [],
      baseSizes: [],
      regimentOptions: [],
      notes: [],
      weapons: [],
      abilities: [],
    }
    addedParentIds.add(page.parentExternalId)
    return [
      {
        ...value,
        meta: recordMeta(input, 'warscroll', value, `datasheet:${page.parentExternalId}`),
        artifact: input.artifact,
      },
      page,
    ]
  })
  const result = { pages: pagesWithParents, diagnostics: decoded.diagnostics }
  decoded.cleanup?.()
  return result
}

export const parseWahapediaWarscrollCollectionHtml = (
  input: WahapediaHtmlInput
): WahapediaHtmlCollectionParseResult => parseWahapediaWarscrollCollection(input, false)

const canonicalFactionName = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const isNativeWahapediaFactionWarscroll = (page: WahapediaHtmlWarscrollRecord): boolean =>
  page.recordKind === 'warscroll' &&
  page.keywords.some(keyword => canonicalFactionName(keyword) === canonicalFactionName(page.factionName))

/**
 * Keep the datasheets a faction collection natively owns (their keyword line names the faction),
 * plus any explicitly reviewed adoptions: datasheets whose keyword line names another faction but
 * whose roster home is established officially — e.g. Lorai, Child of the Abyss, an Idoneth wizard
 * the official Battle Profiles list under Stormcast Eternals via The Blacktalons.
 *
 * Regiment of Renown datasheets are also kept: they have no keyword line at all (they are
 * purchasable bundles, not units), so the native filter used to drop every one of them and no
 * regiment's abilities could ever reach the corpus (issue #1858). Each collection carries a copy
 * of every regiment its faction may include; `dedupeWahapediaRegimentOfRenownPages` collapses the
 * copies afterwards, and generation fails closed until each kept regiment is reviewed.
 */
export const filterNativeWahapediaFactionWarscrolls = (
  pages: WahapediaHtmlWarscrollRecord[],
  adoptedNames: ReadonlySet<string> = new Set()
): WahapediaHtmlWarscrollRecord[] => {
  const isKeptWarscroll = (page: WahapediaHtmlWarscrollRecord): boolean =>
    isNativeWahapediaFactionWarscroll(page) ||
    (page.recordKind === 'warscroll' && adoptedNames.has(page.name))
  const keptWarscrolls = pages.filter(isKeptWarscroll)
  const requiredGroupIds = new Set(
    keptWarscrolls.flatMap(page => (page.parentExternalId ? [page.parentExternalId] : []))
  )
  return pages.filter(
    page =>
      isKeptWarscroll(page) ||
      (page.recordKind === 'content-group' &&
        (requiredGroupIds.has(page.externalId) || Boolean(page.regimentOfRenown)))
  )
}

const canonicalRegimentName = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const comparableAbilityText = (value: string): string =>
  repairMojibake(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * The variant identity of a Regiment of Renown copy: everything rules-bearing, compared as
 * normalized text so per-page HTML furniture (tooltip ids, styling) does not split identical
 * rules into distinct variants.
 */
const regimentVariantKey = (page: WahapediaHtmlWarscrollRecord): string =>
  JSON.stringify([
    page.name,
    page.points ?? null,
    [...(page.regimentOfRenown?.inclusionFactionNames ?? [])].sort(),
    (page.regimentOfRenown?.members ?? []).map(member => `${member.name}|${member.href}`),
    page.abilities.map(ability => [
      ability.name,
      comparableAbilityText(ability.conditionHtml),
      comparableAbilityText(ability.descriptionHtml),
    ]),
  ])

export interface WahapediaRegimentOfRenownDedupeResult {
  pages: WahapediaHtmlWarscrollRecord[]
  diagnostics: WahapediaHtmlDiagnostic[]
}

/**
 * Collapse the per-faction copies of each Regiment of Renown datasheet into one record.
 *
 * Every collection page republishes each regiment its faction may include — Lord Skaldior's
 * Chosen appears on all six of its inclusion factions' pages — so keeping the filter's output
 * as-is would mint one duplicate entity per copy. One copy per regiment name is kept; identity
 * follows the kept copy's page.
 *
 * Copies of the same regiment are not always byte-identical: Wahapedia has shipped pages where
 * one copy's ability text disagrees with the rest (`INFANTRY` vs `non-INFANTRY`), with no
 * official arbiter in the accepted document set. The rule is deterministic and surfaced rather
 * than silent: the most-republished variant wins (majority), ties break to the lexicographically
 * smaller variant, the kept copy is the winning variant's smallest source URL, and every
 * conflicting variant emits a warning diagnostic that the reviewed warning count must
 * disposition.
 */
export const dedupeWahapediaRegimentOfRenownPages = (
  pages: WahapediaHtmlWarscrollRecord[]
): WahapediaRegimentOfRenownDedupeResult => {
  const diagnostics: WahapediaHtmlDiagnostic[] = []
  const copiesByName = new Map<string, WahapediaHtmlWarscrollRecord[]>()
  pages.forEach(page => {
    if (!page.regimentOfRenown) return
    const key = canonicalRegimentName(page.name)
    copiesByName.set(key, [...(copiesByName.get(key) ?? []), page])
  })
  const keptByName = new Map<string, WahapediaHtmlWarscrollRecord>()
  copiesByName.forEach((copies, key) => {
    const copiesByVariant = new Map<string, WahapediaHtmlWarscrollRecord[]>()
    copies.forEach(copy => {
      const variant = regimentVariantKey(copy)
      copiesByVariant.set(variant, [...(copiesByVariant.get(variant) ?? []), copy])
    })
    const variants = Array.from(copiesByVariant.entries()).sort(
      (left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0])
    )
    const winner = variants[0][1]
      .slice()
      .sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))[0]
    keptByName.set(key, winner)
    if (variants.length > 1) {
      diagnostics.push({
        code: 'regiment-of-renown-variant',
        severity: 'warning',
        url: winner.sourceUrl,
        message:
          `Regiment of Renown "${winner.name}" is published in ${variants.length} conflicting ` +
          `variants across ${copies.length} collection copies and no accepted official document ` +
          `carries its rules text; the majority variant (${variants[0][1].length} of ${copies.length} ` +
          `copies) was kept provisionally pending official verification`,
      })
    }
  })
  return {
    pages: pages.filter(
      page => !page.regimentOfRenown || keptByName.get(canonicalRegimentName(page.name)) === page
    ),
    diagnostics,
  }
}

export const parseWahapediaFactionRootWarscrollsHtml = (
  input: WahapediaHtmlInput,
  scope: WahapediaFactionRootWarscrollScope
): WahapediaHtmlCollectionParseResult => parseWahapediaWarscrollCollection(input, scope === 'spearhead')

/**
 * Decides which datasheets a faction root page contributes, from the pages the caller holds: when a
 * `warscrolls.html` collection accompanies the root, the root contributes only its Spearhead
 * warscrolls and the collection supplies the rest; without one, the root is the only place the
 * faction's warscrolls exist.
 */
export const factionRootWarscrollScope = (
  factionRootUrl: string,
  wahapediaPageUrls: readonly string[]
): WahapediaFactionRootWarscrollScope => {
  const collectionPath = `${new URL(factionRootUrl).pathname}warscrolls.html`.toLowerCase()
  return wahapediaPageUrls.some(url => new URL(url).pathname.toLowerCase() === collectionPath)
    ? 'spearhead'
    : 'all'
}

const headingExternalId = (heading: Element): string => {
  let candidate = heading.previousElementSibling
  for (let distance = 0; candidate && distance < 8; distance += 1) {
    if (candidate.matches('a[name]')) return candidate.getAttribute('name')?.trim() ?? ''
    if (candidate.matches('h1, h2, h3')) break
    candidate = candidate.previousElementSibling
  }
  return ''
}

const headingSourceTitle = (heading: Element): string =>
  repairMojibake((heading.querySelector('img[title]') as HTMLImageElement | null)?.title ?? '')

const headingContext = (
  heading: Element,
  sourceTitle: string,
  inherited?: WahapediaHtmlContext
): WahapediaHtmlContext => {
  if (heading.closest('.sLegendary')) return 'legends'
  const fromTitle = pageContext(sourceTitle, '')
  return fromTitle === 'standard' ? (inherited ?? 'standard') : fromTitle
}

export const parseWahapediaFactionHtml = (input: WahapediaHtmlInput): WahapediaHtmlFactionParseResult => {
  const decoded = decodeHtml(input)
  if (!decoded.document) return { diagnostics: decoded.diagnostics }
  const document = decoded.document
  const factionName = normalizedText(document.querySelector('.page_header_span'))
  if (!factionName) {
    const result: WahapediaHtmlFactionParseResult = {
      diagnostics: [
        ...decoded.diagnostics,
        {
          code: 'not-faction-page',
          severity: 'error',
          url: input.artifact.finalUrl,
          message: 'The HTML does not contain an identifiable Wahapedia faction page',
        },
      ],
    }
    decoded.cleanup?.()
    return result
  }

  const headers = Array.from(document.querySelectorAll('.abHeader:not(.abKeywordsBody)'))
  const bodies = Array.from(document.querySelectorAll('.abBody'))
  if (headers.length !== bodies.length) {
    decoded.diagnostics.push({
      code: 'ability-pair-mismatch',
      severity: 'error',
      url: input.artifact.finalUrl,
      message: `Found ${headers.length} ability headers and ${bodies.length} ability bodies`,
    })
  }
  const bodyByHeader = new Map(
    headers.slice(0, bodies.length).map((header, index) => [header, bodies[index]])
  )
  const groups: WahapediaHtmlFactionGroupRecord[] = []
  const abilities: WahapediaHtmlFactionAbilityRecord[] = []
  const parentByGroup = new Map<WahapediaHtmlFactionGroupRecord, WahapediaHtmlFactionGroupRecord>()
  const groupsWithAbilities = new Set<WahapediaHtmlFactionGroupRecord>()
  // Battletome roots gate their rules behind a `Faction Rules` heading, after the book list and the
  // designers' commentary. A faction page without that heading — Endless Spells — is rules content
  // from its first heading onwards.
  const hasFactionRulesHeading = Array.from(document.querySelectorAll('h2')).some(
    heading => !heading.closest('.tooltip_templates') && /^Faction Rules$/i.test(normalizedText(heading))
  )
  let inFactionRules = !hasFactionRulesHeading
  let excludedSection = false
  let inheritedContext: WahapediaHtmlContext | undefined
  let typeGroup: WahapediaHtmlFactionGroupRecord | undefined
  let subgroup: WahapediaHtmlFactionGroupRecord | undefined
  let skipSubgroup = false
  const abilityCountByGroup = new Map<string, number>()

  // The page classifies an Army of Renown section in one of two structural forms: current sections
  // carry a `div.h2_ArmyOfRenown` marker immediately before the heading; Legends/White Dwarf
  // sections open with the replace-rules sentence naming the army an Army of Renown (the
  // core-rules anchor link is present on some but not all, so the text is the signature). Both
  // forms are the source's own classification, so the flag is captured for review cross-checks —
  // but outside the hashed record value, keeping record identity unchanged.
  const isArmyOfRenownHeading = (heading: Element): boolean => {
    const previous = heading.previousElementSibling
    if (previous?.matches('div.h2_ArmyOfRenown')) return true
    const intro = heading.nextElementSibling
    if (!intro) return false
    const introText = normalizedText(intro)
    return (
      /\bArmy of Renown\b/i.test(introText) &&
      /use (?:the|these) faction rules (?:on these pages )?instead/i.test(introText)
    )
  }

  const addGroup = (
    heading: Element,
    parent?: WahapediaHtmlFactionGroupRecord
  ): WahapediaHtmlFactionGroupRecord | undefined => {
    const name = normalizedText(heading)
    const externalId = headingExternalId(heading)
    if (!name || !externalId) {
      decoded.diagnostics.push({
        code: 'missing-source-id',
        severity: 'error',
        url: input.artifact.finalUrl,
        message: `Faction rule group ${name || '(unnamed)'} has no stable source anchor`,
      })
      return undefined
    }
    const sourceTitle = headingSourceTitle(heading) || parent?.sourceTitle || ''
    const context = headingContext(heading, sourceTitle, parent?.context ?? inheritedContext)
    const value = {
      externalId,
      name,
      context,
      sourceTitle,
      ...(parent ? { parentExternalId: parent.externalId } : {}),
    }
    const group: WahapediaHtmlFactionGroupRecord = {
      ...value,
      ...(!parent && isArmyOfRenownHeading(heading) ? { armyOfRenown: true as const } : {}),
      meta: recordMeta(input, `faction-group:${externalId}`, value),
    }
    groups.push(group)
    if (parent) parentByGroup.set(group, parent)
    return group
  }

  for (const node of Array.from(document.querySelectorAll('h1, h2, h3, .abHeader:not(.abKeywordsBody)'))) {
    if (node.closest('.tooltip_templates')) continue
    const text = normalizedText(node)
    if (node.matches('h2')) {
      if (/^Faction Rules$/i.test(text)) {
        inFactionRules = true
        excludedSection = false
        inheritedContext = undefined
        typeGroup = undefined
        subgroup = undefined
        continue
      }
      if (!inFactionRules) continue
      if (/^PATH TO GLORY$/i.test(text)) {
        excludedSection = true
        inheritedContext = undefined
        typeGroup = undefined
        subgroup = undefined
        continue
      }
      if (/^SPEARHEAD$/i.test(text)) {
        excludedSection = false
        inheritedContext = 'spearhead'
        typeGroup = undefined
        subgroup = undefined
        continue
      }
      excludedSection = false
      const sourceTitle = headingSourceTitle(node)
      const sourceContext = headingContext(node, sourceTitle)
      inheritedContext =
        sourceContext === 'standard' && inheritedContext === 'spearhead' ? 'spearhead' : sourceContext
      typeGroup = addGroup(node)
      subgroup = undefined
      skipSubgroup = false
      continue
    }
    if (!inFactionRules || excludedSection) continue
    if (node.matches('h1')) continue
    if (node.matches('h3')) {
      skipSubgroup = /^Warscrolls$/i.test(text)
      subgroup = skipSubgroup || !typeGroup ? undefined : addGroup(node, typeGroup)
      continue
    }
    // Warscroll abilities belong to their datasheet, never to the surrounding rule group. Battletome
    // roots keep them out through their `Warscrolls` subheading; pages that list datasheets directly
    // under a rule heading need the structural exclusion.
    if (
      !node.matches('.abHeader') ||
      skipSubgroup ||
      node.closest('.sShowPathToGlory') ||
      node.closest('.datasheet')
    ) {
      continue
    }
    const group = subgroup ?? typeGroup
    const body = bodyByHeader.get(node)
    if (!group || !body) {
      decoded.diagnostics.push({
        code: 'orphan-faction-ability',
        severity: 'error',
        url: input.artifact.finalUrl,
        message: `Faction ability ${text || '(unnamed)'} is not attached to a rule group`,
      })
      continue
    }
    const line = (abilityCountByGroup.get(group.externalId) ?? 0) + 1
    abilityCountByGroup.set(group.externalId, line)
    const value = abilityValue(node, body, line)
    if (!value.name) continue
    groupsWithAbilities.add(group)
    const externalId = `${group.externalId}:ability:${line}`
    abilities.push({
      ...value,
      externalId,
      groupExternalId: group.externalId,
      context: group.context,
      meta: recordMeta(input, `faction-ability:${externalId}`, value),
    })
  }

  // Retain by group identity rather than by external ID: a page may anchor its rules index and its
  // warscroll sections to the same name, and only the group that actually carried abilities is real.
  const retained = new Set(groupsWithAbilities)
  groupsWithAbilities.forEach(group => {
    const parent = parentByGroup.get(group)
    if (parent) retained.add(parent)
  })
  const retainedGroups = groups.filter(group => retained.has(group))
  if (!retainedGroups.length || !abilities.length) {
    decoded.diagnostics.push({
      code: 'not-faction-page',
      severity: 'error',
      url: input.artifact.finalUrl,
      message: `Wahapedia faction page ${factionName} contained no supported faction abilities`,
    })
  }
  const result: WahapediaHtmlFactionParseResult = {
    page: {
      factionName,
      sourceUrl: input.artifact.finalUrl,
      groups: retainedGroups,
      abilities,
      artifact: input.artifact,
    },
    diagnostics: decoded.diagnostics,
  }
  decoded.cleanup?.()
  return result
}

const rulesPageBaseContext = (pageTitle: string): WahapediaHtmlContext => {
  if (/\b(?:City of Ash|Fire and Jade|Sand and Bone|Spearhead)\b/i.test(pageTitle)) {
    return 'spearhead'
  }
  if (/\b(?:2024-25|2025-26|Scourge of Ghyran)\b/i.test(pageTitle)) return 'historical'
  if (/\b(?:2026-27|Scourge of Aqshy)\b/i.test(pageTitle)) return 'seasonal'
  return 'standard'
}

const rulesPageContext = (
  pageTitle: string,
  heading: Element,
  inherited?: WahapediaHtmlContext
): WahapediaHtmlContext => {
  if (heading.closest('.sLegendary')) return 'legends'
  const sourceTitle = headingSourceTitle(heading)
  const sourceContext = pageContext(sourceTitle, '')
  if (sourceContext !== 'standard') return sourceContext

  const text = normalizedText(heading)
  if (/^(?:ADVANCED RULES|Commands|Terrain|Magic|Army Composition|Command Models) 2026-27$/i.test(text)) {
    return 'seasonal'
  }
  return inherited ?? rulesPageBaseContext(pageTitle)
}

const isExampleHeading = (value: string): boolean => /\b(?:diagram|example)\b/i.test(value)

const rulesHeadingSlug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'unnamed'

export const parseWahapediaRulesHtml = (input: WahapediaHtmlInput): WahapediaHtmlRulesParseResult => {
  const decoded = decodeHtml(input)
  if (!decoded.document) return { diagnostics: decoded.diagnostics }
  const document = decoded.document
  const title = normalizedText(document.querySelector('.page_header_span'))
  if (!title || !/^\/aos4\/the-rules\//i.test(new URL(input.artifact.finalUrl).pathname)) {
    const result: WahapediaHtmlRulesParseResult = {
      diagnostics: [
        ...decoded.diagnostics,
        {
          code: 'not-rules-page',
          severity: 'error',
          url: input.artifact.finalUrl,
          message: 'The HTML does not contain an identifiable Wahapedia AoS 4 rules page',
        },
      ],
    }
    decoded.cleanup?.()
    return result
  }

  const headers = Array.from(document.querySelectorAll('.abHeader:not(.abKeywordsBody)'))
  const bodies = Array.from(document.querySelectorAll('.abBody'))
  if (headers.length !== bodies.length) {
    decoded.diagnostics.push({
      code: 'ability-pair-mismatch',
      severity: 'error',
      url: input.artifact.finalUrl,
      message: `Found ${headers.length} ability headers and ${bodies.length} ability bodies`,
    })
  }
  const bodyByHeader = new Map(
    headers.slice(0, bodies.length).map((header, index) => [header, bodies[index]])
  )
  const groups: WahapediaHtmlFactionGroupRecord[] = []
  const abilities: WahapediaHtmlFactionAbilityRecord[] = []
  let inheritedContext: WahapediaHtmlContext = rulesPageBaseContext(title)
  let typeGroup: WahapediaHtmlFactionGroupRecord | undefined
  let subgroup: WahapediaHtmlFactionGroupRecord | undefined
  let excludedSection = false
  const abilityCountByGroup = new Map<string, number>()
  const derivedHeadingCounts = new Map<string, number>()
  const derivedGroupNames = new Map<string, string>()

  const addGroup = (
    heading: Element,
    parent?: WahapediaHtmlFactionGroupRecord
  ): WahapediaHtmlFactionGroupRecord | undefined => {
    const name = normalizedText(heading)
    if (!name) {
      decoded.diagnostics.push({
        code: 'missing-source-id',
        severity: 'error',
        url: input.artifact.finalUrl,
        message: 'A rules group has no identifiable heading text',
      })
      return undefined
    }
    const anchoredExternalId = headingExternalId(heading)
    const slug = rulesHeadingSlug(name)
    const occurrence = (derivedHeadingCounts.get(slug) ?? 0) + 1
    derivedHeadingCounts.set(slug, occurrence)
    const externalId = anchoredExternalId || `derived-${slug}-${occurrence}`
    if (!anchoredExternalId) derivedGroupNames.set(externalId, name)
    const context = rulesPageContext(title, heading, parent?.context ?? inheritedContext)
    const value = {
      externalId,
      name,
      context,
      sourceTitle: headingSourceTitle(heading) || title,
      ...(parent ? { parentExternalId: parent.externalId } : {}),
    }
    const group: WahapediaHtmlFactionGroupRecord = {
      ...value,
      meta: recordMeta(input, `rules-group:${externalId}`, value),
    }
    groups.push(group)
    return group
  }

  for (const node of Array.from(document.querySelectorAll('h2, h3, .abHeader:not(.abKeywordsBody)'))) {
    if (node.closest('.tooltip_templates')) continue
    const text = normalizedText(node)
    if (node.matches('h2')) {
      if (/^Books$/i.test(text)) {
        typeGroup = undefined
        subgroup = undefined
        excludedSection = false
        continue
      }
      inheritedContext = rulesPageContext(title, node, inheritedContext)
      excludedSection = isExampleHeading(text)
      typeGroup = excludedSection ? undefined : addGroup(node)
      subgroup = undefined
      continue
    }
    if (node.matches('h3')) {
      inheritedContext = rulesPageContext(title, node, inheritedContext)
      excludedSection = isExampleHeading(text)
      if (excludedSection) {
        subgroup = undefined
        continue
      }
      subgroup = addGroup(node, typeGroup)
      continue
    }
    if (excludedSection || !node.matches('.abHeader')) continue
    const group = subgroup ?? typeGroup
    const body = bodyByHeader.get(node)
    if (!group || !body) {
      decoded.diagnostics.push({
        code: 'orphan-rules-ability',
        severity: 'error',
        url: input.artifact.finalUrl,
        message: `Rules ability ${text || '(unnamed)'} is not attached to a rule group`,
      })
      continue
    }
    const line = (abilityCountByGroup.get(group.externalId) ?? 0) + 1
    abilityCountByGroup.set(group.externalId, line)
    const value = abilityValue(node, body, line)
    if (!value.name) continue
    const externalId = `${group.externalId}:ability:${line}`
    abilities.push({
      ...value,
      externalId,
      groupExternalId: group.externalId,
      context: group.context,
      meta: recordMeta(input, `rules-ability:${externalId}`, value),
    })
  }

  const retainedGroupIds = new Set(abilities.map(ability => ability.groupExternalId))
  groups
    .filter(group => retainedGroupIds.has(group.externalId) && group.parentExternalId)
    .forEach(group => retainedGroupIds.add(group.parentExternalId!))
  const retainedGroups = groups.filter(group => retainedGroupIds.has(group.externalId))
  retainedGroups.forEach(group => {
    const derivedName = derivedGroupNames.get(group.externalId)
    if (!derivedName) return
    decoded.diagnostics.push({
      code: 'missing-source-id',
      severity: 'warning',
      url: input.artifact.finalUrl,
      section: group.meta.section,
      message: `Rules group ${derivedName} uses a deterministic page-local heading locator because Wahapedia supplied no anchor`,
    })
  })
  const pageValue = {
    title,
    sourceUrl: input.artifact.finalUrl,
    context: rulesPageBaseContext(title),
  }
  const result: WahapediaHtmlRulesParseResult = {
    page: {
      ...pageValue,
      groups: retainedGroups,
      abilities,
      meta: recordMeta(input, 'rules-page', pageValue),
      artifact: input.artifact,
    },
    diagnostics: decoded.diagnostics,
  }
  decoded.cleanup?.()
  return result
}
