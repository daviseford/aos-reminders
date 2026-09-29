import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, BattleProfile, ContentEntity } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * The September 2026 core Battle Profiles marks removed text with a strikethrough rule, which
 * pdf.js reports as a path rather than a text attribute, so until corpus 2026-09-29 the extractor
 * read struck text as live (#1757). The page renders and the drawing operators agree on 47 struck
 * lines: 33 "This unit cannot be reinforced." notes, the three-line Favoured Spawning note on the
 * Scourge of Aqshy Saurus Scar-Veteran on Aggradon, and every cell of the page 59 Stumblefoot
 * Gargant Regiment of Renown row, printed DELETED. The same review found the Scourge of Aqshy
 * Vengorian Lord's Frenzied Surge still carrying RAMPAGE after the official rewrite dropped it.
 */

interface LedgerRecord {
  disposition: string
  fact: {
    kind: string
    name: string
    context: string
    notes: string[]
    struckNotes?: string[]
    sourceRecordId: string
  }
}

const ledger = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'aos4', 'catalog', 'official-battle-profiles.json'), 'utf8')
) as { records: LedgerRecord[] }

const REINFORCEMENT = 'This unit cannot be reinforced.'
const struckFacts = ledger.records.map(record => record.fact).filter(fact => fact.struckNotes?.length)
const battleProfiles = AOS4_FULL_CATALOG.entities.filter(
  (entity): entity is BattleProfile => entity.kind === 'battle-profile'
)
const profilesFor = (fact: LedgerRecord['fact']): BattleProfile[] =>
  battleProfiles.filter(
    profile =>
      profile.name === `${fact.name} battle profile` &&
      profile.sourceRefs.some(reference => reference.sourceRecordId === fact.sourceRecordId)
  )

describe('struck text in the September 2026 Battle Profiles (#1757)', () => {
  it('records exactly the struck notes the official document prints', () => {
    expect(struckFacts).toHaveLength(34)
    const reinforcement = struckFacts.filter(fact => fact.struckNotes!.includes(REINFORCEMENT))
    expect(reinforcement).toHaveLength(33)
    expect(reinforcement.map(fact => fact.name)).toEqual(
      expect.arrayContaining([
        'Khainite Shadowstalkers',
        'Scourge of Aqshy Khainite Shadowstalkers',
        'Pyregheists',
        'Gutter Runners',
        'Corvus Cabal',
      ])
    )
    expect(struckFacts.filter(fact => !fact.struckNotes!.includes(REINFORCEMENT))).toEqual([
      expect.objectContaining({
        name: 'Scourge of Aqshy Saurus Scar-Veteran on Aggradon',
        context: 'seasonal',
        struckNotes: ['This Hero can join an eligible regiment as a Favoured Spawning.'],
      }),
    ])
    struckFacts.forEach(fact => fact.struckNotes!.forEach(note => expect(fact.notes).not.toContain(note)))
  })

  it('no longer ships a reinforcement restriction the official row strikes', () => {
    struckFacts
      .filter(fact => fact.struckNotes!.includes(REINFORCEMENT))
      .forEach(fact => {
        const profiles = profilesFor(fact)
        expect(profiles, fact.name).not.toHaveLength(0)
        profiles.forEach(profile => expect(profile.notes, fact.name).not.toContain(REINFORCEMENT))
      })
  })

  it('no longer ships the struck Favoured Spawning note', () => {
    const [scarVeteran] = struckFacts.filter(
      fact => fact.context === 'seasonal' && /Scar-Veteran/.test(fact.name)
    )
    const profiles = profilesFor(scarVeteran)
    expect(profiles).toHaveLength(1)
    expect(profiles[0].notes.join(' ')).not.toMatch(/Favoured Spawning/)
    expect(profiles[0].notes).toContain(
      'This unit is legal for Matched Play for battles fought using the General’s Handbook 2026-27 battlepack.'
    )
  })

  it('extracts no fact from the DELETED Stumblefoot Gargant row', () => {
    expect(ledger.records.map(record => record.fact.name)).not.toContain('Stumblefoot Gargant')
  })
})

describe('the September 2026 Frenzied Surge rewrite (#1757)', () => {
  it('drops the RAMPAGE keyword the official rewrite no longer prints', () => {
    const entity: ContentEntity | undefined = AOS4_FULL_CATALOG.entities.find(
      candidate => String(candidate.id) === 'ability:2077bff2-10e1-53ab-b46c-85d5226d7ce4'
    )
    expect(entity?.kind).toBe('ability')
    const frenziedSurge = entity as Ability
    expect(frenziedSurge.name).toBe('FRENZIED SURGE')
    expect(frenziedSurge.keywords).toEqual([])
    expect(frenziedSurge.timings.map(timing => timing.raw)).toEqual([
      'Once Per Turn (Army), Any Charge Phase',
    ])
  })
})
