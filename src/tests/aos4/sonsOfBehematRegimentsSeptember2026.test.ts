import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, CanonicalId, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders, reminderOccurrenceId } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel, migrateAos4ReminderPreferences } from '../../aos4/view'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * The September 2026 Sons of Behemat battletome rewrote four Regiments of Renown (official
 * *Regiments of Renown – Sons of Behemat*, 2026-09-09, pages 1-4). Wahapedia republishes every
 * regiment on each inclusion faction's collection page, and until corpus 2026-10-02 every pinned
 * copy except the 2026-09-30 Ossiarch Bonereapers one still printed the pre-September faction-pack
 * datasheet, so the majority rule shipped the old rules (issue #1999). Corpus 2026-10-02 re-pins the
 * Ironjawz collection, which prints all four rewrites, and a reviewed variant choice keeps that copy
 * over the stale majority. Rules that kept their name keep their canonical id, so saved notes and
 * hides follow them; rules the rewrite removed retire, and nothing is re-keyed onto them.
 */

const REVIEW_PATH = path.join(process.cwd(), 'data', 'aos4', 'reviews', 'corpus-2026-10-02.json')
const IRONJAWZ_COLLECTION =
  'source-record:wahapedia:html:https://wahapedia.ru/aos4/factions/ironjawz/warscrolls.html'
const PACK =
  'source-record:games-workshop:a5030c646f10ed0e49a7667657bf8c08feb94badc4bbfbedfa49fd25905784d4%3Apage%3A'

const seasonal = AOS4_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
const entityById = new Map(AOS4_CATALOG.entities.map(entity => [entity.id, entity]))
const factionByName = (name: string): Faction =>
  AOS4_CATALOG.entities.find(
    (entity): entity is Faction => entity.kind === 'faction' && entity.name === name
  )!
const factionNameById = new Map(
  AOS4_CATALOG.entities.flatMap(entity => (entity.kind === 'faction' ? [[entity.id, entity.name]] : []))
)
const group = (id: string): ContentGroup => entityById.get(id as CanonicalId) as ContentGroup
const ability = (id: string): Ability => entityById.get(id as CanonicalId) as Ability
const abilitiesOf = (groupId: string): Ability[] =>
  AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'includes' && relationship.from === groupId)
    .map(relationship => entityById.get(relationship.to))
    .filter((entity): entity is Ability => entity?.kind === 'ability')
    .sort((left, right) => left.name.localeCompare(right.name))
const offeredBy = (groupId: string): string[] =>
  AOS4_CATALOG.relationships
    .filter(relationship => relationship.kind === 'offers' && relationship.to === groupId)
    .map(relationship => factionNameById.get(relationship.from as never)!)
    .sort()

const REGIMENTS = {
  odo: {
    id: 'content-group:c104eccb-979e-575f-b187-66224bb4d295',
    name: 'Odo Godswallow',
    slug: 'Odo-Godswallow',
    page: 1,
    inclusion: ['Gloomspite Gitz', 'Ironjawz', 'Kruleboyz', 'Ogor Mawtribes'],
  },
  bundo: {
    id: 'content-group:9b34fc84-669b-5732-be58-d184e5507dcd',
    name: 'Bundo Whalebiter',
    slug: 'Bundo-Whalebiter',
    page: 2,
    inclusion: [
      'Cities of Sigmar',
      'Daughters of Khaine',
      'Fyreslayers',
      'Gloomspite Gitz',
      'Idoneth Deepkin',
      'Ironjawz',
      'Kharadron Overlords',
      'Kruleboyz',
      'Lumineth Realm-lords',
      'Ogor Mawtribes',
      'Seraphon',
      'Stormcast Eternals',
      'Sylvaneth',
    ],
  },
  grunnock: {
    id: 'content-group:b007ac41-4abb-5d6b-a492-db38dbf3dd0d',
    name: 'One-eyed Grunnock',
    slug: 'One-eyed-Grunnock',
    page: 3,
    inclusion: [
      'Blades of Khorne',
      'Disciples of Tzeentch',
      'Gloomspite Gitz',
      'Hedonites of Slaanesh',
      'Helsmiths of Hashut',
      'Ironjawz',
      'Kruleboyz',
      'Maggotkin of Nurgle',
      'Ogor Mawtribes',
      'Skaven',
      'Slaves to Darkness',
    ],
  },
  drogg: {
    id: 'content-group:5451f021-f79e-581e-abf3-07ea49ec454d',
    name: 'Big Drogg Fort-Kicka',
    slug: 'Big-Drogg-Fort-Kicka',
    page: 4,
    inclusion: [
      'Flesh-eater Courts',
      'Gloomspite Gitz',
      'Ironjawz',
      'Kruleboyz',
      'Nighthaunt',
      'Ogor Mawtribes',
      'Ossiarch Bonereapers',
      'Soulblight Gravelords',
    ],
  },
} as const

/** Ability ids as shipped up to corpus 2026-10-01: kept where the rule kept its name. */
const KEPT = {
  mightyWalloper: 'ability:8796630f-2378-5faa-89e7-fd48f551d1cd',
  deadCunning: 'ability:14ee6fd6-fec5-51f9-b1b2-78d452f346b6' as CanonicalId<'ability'>,
  grievousHalitosis: 'ability:5e4397fc-7fd6-572e-9ba0-73dd193d6eaa',
}
const BUNDO_ID = 'content-group:9b34fc84-669b-5732-be58-d184e5507dcd' as CanonicalId<'content-group'>
/** The rules the rewrite removed: four regiment copies of Timberrrrr! and Shake the Earth. */
const RETIRED = [
  'ability:8326184b-9475-56e9-af78-60df0a41e0e3',
  'ability:009c5ebb-1472-554c-98df-b10d64fc5a69',
  'ability:f22aee93-5cab-5b4c-8a11-7c1bd4f97521',
  'ability:b1634c11-890b-55a6-80b6-4634ba12aff1',
  'ability:7982f5d4-03ef-58f5-9f7c-f4bd379678c9',
]

describe('September 2026 Sons of Behemat Regiments of Renown (issue #1999)', () => {
  it('ships each regiment from the reviewed Ironjawz copy with the official citation', () => {
    const review = JSON.parse(readFileSync(REVIEW_PATH, 'utf8')) as {
      regimentsOfRenown: Array<{
        sourceRecordId: string
        officialSourceRecordIds: string[]
        variantReason?: string
      }>
    }
    Object.values(REGIMENTS).forEach(regiment => {
      const entry = review.regimentsOfRenown.find(
        candidate =>
          decodeURIComponent(candidate.sourceRecordId) ===
          `${IRONJAWZ_COLLECTION}#datasheet:${regiment.slug}/warscroll`
      )!
      expect(entry.variantReason).toMatch(/stale majority/)
      expect(entry.officialSourceRecordIds).toContain(`${PACK}${regiment.page}`)
      const refs = AOS4_FULL_CATALOG.entities
        .find(entity => String(entity.id) === regiment.id)!
        .sourceRefs.map(reference => decodeURIComponent(reference.sourceRecordId))
      expect(refs).toContain(`${IRONJAWZ_COLLECTION}#datasheet:${regiment.slug}/warscroll`)
    })
    // Only these four regiments override the majority.
    expect(review.regimentsOfRenown.filter(entry => entry.variantReason).length).toBe(4)
  })

  it('offers each regiment to exactly its official inclusion factions', () => {
    Object.values(REGIMENTS).forEach(regiment => {
      expect(group(regiment.id).name).toBe(regiment.name)
      expect(offeredBy(regiment.id)).toEqual(regiment.inclusion)
    })
  })

  it('prints Odo Godswallow’s Protective Wards and reworded Mighty Walloper (page 1)', () => {
    const [walloper, wards] = abilitiesOf(REGIMENTS.odo.id)
    expect(walloper.id).toBe(KEPT.mightyWalloper)
    expect(walloper.keywords).toEqual([])
    expect(walloper.timings[0].raw).toBe('Once Per Turn (Army), Any Combat Phase')
    expect(walloper.text).toEqual({
      declare: 'Pick an enemy MONSTER in combat with the unit in this Regiment of Renown to be the target.',
      effect:
        'For the rest of the turn, the unit in this Regiment of Renown’s Menhir Club has Crit (2 Hits) but all attacks made with that weapon this turn must target that enemy MONSTER.',
    })
    expect(wards).toMatchObject({
      name: 'PROTECTIVE WARDS',
      abilityKind: 'passive',
      text: { effect: 'The unit in this Regiment of Renown has WARD (6+).' },
    })
  })

  it('makes Bundo Whalebiter’s Dead Cunning once per battle with three choices (page 2)', () => {
    const abilities = abilitiesOf(REGIMENTS.bundo.id)
    expect(abilities.map(entry => entry.id)).toEqual([KEPT.deadCunning])
    const [deadCunning] = abilities
    expect(deadCunning.keywords).toEqual([])
    expect(deadCunning.timings[0]).toMatchObject({
      raw: 'Once Per Battle (Army), Any Combat Phase',
      usage: { limit: 1, period: 'battle', scope: 'army' },
    })
    expect(deadCunning.text.effect).toMatch(
      /^For the rest of the turn, the unit in this Regiment of Renown has STRIKE-LAST and WARD \(5\+\)\./
    )
    ;['A Kunnin’ Ruse:', 'A Nasty Surprise:', 'Tricked Ya!:'].forEach(choice =>
      expect(deadCunning.text.effect).toContain(choice)
    )
  })

  it('gives One-eyed Grunnock Titanic Stride and Earth-shaking Stomp (page 3)', () => {
    const abilities = abilitiesOf(REGIMENTS.grunnock.id)
    expect(abilities.map(entry => [entry.name, entry.abilityKind])).toEqual([
      ['EARTH-SHAKING STOMP', 'passive'],
      ['TITANIC STRIDE', 'passive'],
    ])
    expect(abilities[0].text.effect).toBe(
      'Subtract 1 from hit rolls for combat attacks made by enemy INFANTRY and CAVALRY units while they are in combat with the unit in this Regiment of Renown.'
    )
    expect(abilities[1].text.effect).toBe(
      'The unit in this Regiment of Renown can use CHARGE abilities even if it used a RETREAT ability in the same turn. In addition, no mortal damage is inflicted on the unit in this Regiment of Renown by RETREAT abilities.'
    )
  })

  it('gives Big Drogg Fort-Kicka Fortress Wrekka and the end-of-turn Grievous Halitosis (page 4)', () => {
    const [wrekka, halitosis] = abilitiesOf(REGIMENTS.drogg.id)
    expect(halitosis.id).toBe(KEPT.grievousHalitosis)
    expect(halitosis.keywords).toEqual([])
    expect(halitosis.timings[0]).toMatchObject({
      raw: 'Once Per Turn (Army), End of Any Turn',
      window: { kind: 'turn-phase', phase: 'end-of-turn' },
    })
    expect(halitosis.text.effect).toBe(
      'Roll a dice for each model in the target unit. For each 6, inflict 1 mortal damage on the target. If any enemy models are slain by this ability, the target has a maximum control score of 1 for the rest of the turn.'
    )
    // The secondary page misspells "declared"; the official page prints this reaction split across
    // two layout columns, which the machine review cannot ground, so the typo is recorded, not
    // overridden.
    expect(wrekka.name).toBe('FORTRESS WREKKA')
    expect(wrekka.timings[0]).toMatchObject({
      kind: 'reaction',
      raw: 'Once Per Battle (Army), Reaction: You delcared the ‘Rip It Up and Chuck It’ ability for the unit in this Regiment of Renown',
      usage: { limit: 1, period: 'battle', scope: 'army' },
    })
    expect(wrekka.text.effect).toBe(
      'After picking the target for that ability, roll a number of dice equal to the current battle round number. For each 4+, add 1 to the Attacks characteristic of the unit in this Regiment of Renown’s Hurled Boulder for the rest of the turn.'
    )
  })

  it('retires Timberrrrr! and Shake the Earth from the four regiments', () => {
    RETIRED.forEach(id => expect(entityById.has(id as CanonicalId)).toBe(false))
    Object.values(REGIMENTS).forEach(regiment =>
      expect(abilitiesOf(regiment.id).map(entry => entry.name)).not.toContain('TIMBERRRRR!')
    )
    expect(abilitiesOf(REGIMENTS.drogg.id).every(entry => !entry.keywords.includes('RAMPAGE'))).toBe(true)
  })

  it('keeps a saved note on Dead Cunning and drops one on a retired Timberrrrr!', () => {
    const ironjawz = factionByName('Ironjawz')
    // Corpus 2026-10-01 keyed Dead Cunning once per turn; the rule keeps its id, so the note is
    // migrated to the once-per-battle occurrence and never lands on another rule.
    const savedKey = `reminder:${KEPT.deadCunning}@turn-phase:combat|active|any|normal|1:turn:army`
    const retiredKey = `reminder:${RETIRED[1]}@always|passive|neutral|normal|unlimited`
    const document = createAos4ArmyDocument({
      id: 'bundo',
      name: 'Bundo',
      rulesContextId: seasonal.id,
      explicitSelectionIds: [ironjawz.id, BUNDO_ID],
      reminderPreferences: {
        [savedKey]: { note: 'save for the big one' },
        [retiredKey]: { note: 'note for the old TIMBERRRRR!' },
      },
    })
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: [ironjawz.id, BUNDO_ID],
      rulesContextId: seasonal.id,
    })
    expect(selection.diagnostics).toEqual([])
    const projected = projectReminders(AOS4_CATALOG, selection)
    const deadCunning = projected.find(reminder => reminder.abilityIds.includes(KEPT.deadCunning))!
    expect(deadCunning.id).toBe(reminderOccurrenceId(KEPT.deadCunning, ability(KEPT.deadCunning).timings[0]))
    const migrated = migrateAos4ReminderPreferences(
      document,
      projected.map(reminder => ({ id: reminder.id, abilityIds: reminder.abilityIds }))
    )
    const reminders = createAos4ReminderViewModel(AOS4_CATALOG, migrated)
    expect(reminders.find(reminder => reminder.id === deadCunning.id)?.note).toBe('save for the big one')
    expect(reminders.some(reminder => reminder.note === 'note for the old TIMBERRRRR!')).toBe(false)
  })
})
