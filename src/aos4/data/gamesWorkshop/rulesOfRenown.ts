import { createHash } from 'node:crypto'
import { sourceRecordId, type SourceRecordId } from '../../domain'
import type { BsDataAbilityFact, BsDataAbilityKind, BsDataRegimentOfRenownFact } from '../bsdata/records'

/**
 * Official Rules of Renown pages (one Regiment of Renown per page: name, inclusion list,
 * organisation, then its abilities), read from the page text (#1757). The page prints each
 * ability as `NAME: legend`, optional `Declare:`, `Effect:`, optional `Keywords …`, then its timing
 * bar and casting value; two-column layout can put the timing bar of one ability on the same line
 * as the next ability's name, so the reader splits on names and peels the timing from the tail.
 *
 * The reader is bounded to that template and fails closed: every extracted string must reappear
 * in the page text, every timing must be a known bar, and the caller pins the expected regiment.
 */

const TIMING =
  /(Passive|Reaction: [^\n]+|(?:Once Per (?:Battle|Turn)(?: \(Army\))?, )?(?:Your|Enemy|Any|End of Any|Start of Any) [A-Za-z ]*?(?:Phase|Turn)|(?:Once Per (?:Battle|Turn)(?: \(Army\))?, )?Deployment Phase)(?: (\d+))?$/

const collapse = (value: string): string => value.replace(/\s+/g, ' ').trim()
const squash = (value: string): string => value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
const slug = (value: string): string =>
  value
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
const checksum = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value), 'utf8').digest('hex')

export interface OfficialRegimentOfRenownPage {
  page: number
  text: string
  /** The page's source record (`games-workshop:<artifact>:page:<n>`). */
  pageSourceRecordId: SourceRecordId
}

const kindFor = (timing: string, keywords: string[], declare?: string): BsDataAbilityKind => {
  if (/^Passive$/.test(timing)) return 'passive'
  if (keywords.some(keyword => /^Spell$/i.test(keyword)) || /casting roll/.test(declare ?? '')) return 'spell'
  if (keywords.some(keyword => /^Prayer$/i.test(keyword)) || /chanting roll/.test(declare ?? ''))
    return 'prayer'
  return 'activated'
}

export const extractOfficialRegimentOfRenownPage = (
  input: OfficialRegimentOfRenownPage,
  artifactChecksum: string
): BsDataRegimentOfRenownFact => {
  const lines = input.text
    .replace(/ /g, ' ')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
  const name = collapse(lines[0] ?? '')
  if (!name || !/^REGIMENT OF RENOWN$/.test(lines[1] ?? '')) {
    throw new Error(`Rules of Renown page ${input.page} does not open with a regiment name`)
  }
  const organisationAt = lines.indexOf('ORGANISATION')
  if (organisationAt < 0) throw new Error(`Rules of Renown page ${input.page} has no ORGANISATION`)

  // Members: "♦ 1 Clanshields unit with 10 models", possibly wrapped onto the next line.
  const members: Array<{ name: string; count: number }> = []
  let cursor = organisationAt + 1
  while (cursor < lines.length && /^♦\s*\d/.test(lines[cursor])) {
    let line = lines[cursor].replace(/^♦\s*/, '')
    if (/ with$/.test(line)) {
      cursor += 1
      line = `${line} ${lines[cursor]}`
    }
    const match = line.match(/^(\d+)\s+(.+?)(?:\s+unit\s+with\s+\d+\s+models)?$/)
    if (!match) throw new Error(`Rules of Renown page ${input.page} has an unreadable member ${line}`)
    members.push({ name: match[2].trim(), count: Number.parseInt(match[1], 10) })
    cursor += 1
  }
  if (!members.length) throw new Error(`Rules of Renown page ${input.page} lists no members`)

  const body = lines
    .slice(cursor)
    .join('\n')
    .replace(/\s*RULES OF RENOWN\s*$/, '')
  // An ability name is an upper-case run ending in a colon, at a line start or after a timing bar.
  const nameRegex = /(?:^|\n|(?<=Phase|Passive|\d) )([A-Z][A-Z’'‑\- ]+[A-Z]):\s/g
  const starts = Array.from(body.matchAll(nameRegex)).map(match => ({
    name: match[1],
    index: match.index! + match[0].indexOf(match[1]),
    textStart: match.index! + match[0].length,
  }))
  if (!starts.length) throw new Error(`Rules of Renown page ${input.page} has no abilities`)

  const abilities: BsDataAbilityFact[] = starts.map((start, index) => {
    const end = index + 1 < starts.length ? starts[index + 1].index : body.length
    let block = body.slice(start.textStart, end).trim()
    const timingMatch = block.match(TIMING)
    if (!timingMatch) {
      throw new Error(`Rules of Renown ability ${start.name} on page ${input.page} has no timing bar`)
    }
    const timing = timingMatch[1]
    const costValue = timingMatch[2] ? Number.parseInt(timingMatch[2], 10) : undefined
    block = block.slice(0, timingMatch.index).trim()
    let keywords: string[] = []
    const keywordMatch = block.match(/\nKeywords ([^\n]+)$/)
    if (keywordMatch) {
      keywords = keywordMatch[1].split(',').map(keyword => keyword.trim())
      block = block.slice(0, keywordMatch.index).trim()
    }
    const effectAt = block.indexOf('Effect:')
    if (effectAt < 0) throw new Error(`Rules of Renown ability ${start.name} has no Effect`)
    const declareAt = block.indexOf('Declare:')
    const declare =
      declareAt >= 0 && declareAt < effectAt ? collapse(block.slice(declareAt + 8, effectAt)) : undefined
    const effect = collapse(block.slice(effectAt + 7)).replace(/ ([.,])/g, '$1')
    const abilityName = collapse(start.name).replace(/‑/g, '-')
    const kind = kindFor(timing, keywords, declare)
    const section = `regiment:${slug(name)}:ability:${index + 1}`
    const value = { name: abilityName, timing, declare, effect, keywords, costValue }
    return {
      line: index + 1,
      name: abilityName,
      kind,
      timing,
      ...(declare ? { declare } : {}),
      effect,
      keywords,
      ...(costValue !== undefined ? { costValue } : {}),
      sourceRecordId: sourceRecordId('games-workshop', `${artifactChecksum}:${section}`),
      recordChecksum: checksum(value),
    }
  })

  // Fail closed on anything the page does not print.
  const page = squash(input.text)
  abilities.forEach(ability =>
    [ability.name, ability.timing, ability.declare, ability.effect, ...ability.keywords].forEach(value => {
      if (value && !page.includes(squash(value))) {
        throw new Error(`Rules of Renown ability ${ability.name} text is not printed on page ${input.page}`)
      }
    })
  )

  const section = `regiment:${slug(name)}`
  const fact = { name, members, abilities: abilities.map(({ recordChecksum }) => recordChecksum) }
  return {
    kind: 'regiment-of-renown',
    name: name
      .toLowerCase()
      .replace(
        /(^|[\s-])([a-z])/g,
        (_, prefix: string, letter: string) => `${prefix}${letter.toUpperCase()}`
      ),
    section,
    abilities,
    members,
    sourceRecordId: sourceRecordId('games-workshop', `${artifactChecksum}:${section}`),
    factChecksum: checksum(fact),
  }
}
