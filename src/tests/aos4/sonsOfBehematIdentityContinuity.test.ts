import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Ability, CanonicalId, ContentGroup, Faction } from '../../aos4/domain'
import type { IdentityRegistry } from '../../aos4/generate/identityRegistry'
import { projectReminders, reminderOccurrenceId } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import { createAos4ArmyDocument } from '../../aos4/state'
import { createAos4ReminderViewModel, migrateAos4ReminderPreferences } from '../../aos4/view'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'

/**
 * Review round 1 on corpus 2026-09-25 (PR #2023, issue #1999). Hidden, note, and order preferences
 * are keyed by reminder occurrence ID, which embeds the canonical ability ID, so an ability ID that
 * moves to a different rule carries a player's hides and notes onto that rule — and
 * `migrateAos4ReminderPreferences` would even re-key a stale one onto it. The first identity remap
 * paired only freshly minted aliases, so the positional Wahapedia aliases that already existed kept
 * their index-era IDs while the page slots now print battletome rules. These pin the reviewed
 * rebinds: every ID that shipped in a corpus up to 2026-09-24 still names the rule it named then.
 */

const catalog = AOS4_FULL_CATALOG
const standard = catalog.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const historical = catalog.rulesContexts.find(context => context.status === 'historical')!
const entityById = new Map(catalog.entities.map(entity => [entity.id, entity]))
const sob = catalog.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Sons of Behemat'
)!

const registry = JSON.parse(
  readFileSync(path.join(process.cwd(), 'data', 'aos4', 'identities', 'corpus.json'), 'utf8')
) as IdentityRegistry

const comparableName = (name: string): string =>
  name
    .normalize('NFKD')
    .replace(/[‘’'`]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase()

const ability = (id: string): Ability | undefined => {
  const entity = entityById.get(id as CanonicalId)
  return entity?.kind === 'ability' ? entity : undefined
}

/** Ability IDs as shipped by corpus 2026-09-24 (BSData era) or earlier (index era). */
const SHIPPED = {
  takeARunAtIt: 'ability:a360c53c-df0a-50fb-85f9-10fabc7219c5',
  argyBargy: 'ability:13d8bb83-4f64-5004-974e-1b2a5b5d5844',
  wrathfulRampage: 'ability:ae71f48a-1b79-5bce-9da3-406d4a24dfab',
  haringBack: 'ability:f8fa02ea-d702-5cef-9261-186ab818f3a8',
  theBigOne: 'ability:e1a3415a-cd18-55b7-ba39-326649f1ba72',
  earthshakingRoar: 'ability:bf3b29a5-2991-59b4-a8da-448ca2b7c4b6',
  colossalSlam: 'ability:d6ea6bfe-2718-5dbb-a2c5-b67afce5bc0f',
  gatebreakerBattleDamaged: 'ability:a063b070-0b9f-5ba9-9481-979346299b3f',
  timberrrrr: 'ability:b31d7031-c272-5df8-9840-885aed75fd90',
  gargantCharge: 'ability:41383ca0-7320-543d-a8a9-4498c2297015',
  jumpUpAndDown: 'ability:44044eb5-f44b-5713-8247-a05ca340ab50',
} as const

describe('Sons of Behemat identity continuity across the 2026-09-25 swap (PR #2023)', () => {
  it('keeps every shipped Sons of Behemat ability ID on the rule it named', () => {
    expect(
      Object.fromEntries(Object.entries(SHIPPED).map(([key, id]) => [key, ability(id)?.name ?? null]))
    ).toEqual({
      // The five army-wide battle traits rejoin the IDs they shipped under from BSData.
      takeARunAtIt: 'TAKE A RUN AT IT',
      argyBargy: 'ARGY BARGY',
      wrathfulRampage: 'WRATHFUL RAMPAGE',
      haringBack: 'HARING BACK',
      theBigOne: 'THE BIG ONE',
      // Two index-era battle traits are now Realm-shaking Rampages with the same name, timing, and
      // effect, so they keep their index-era IDs.
      earthshakingRoar: 'EARTHSHAKING ROAR',
      colossalSlam: 'COLOSSAL SLAM',
      gatebreakerBattleDamaged: 'BATTLE DAMAGED',
      // Retired index-era rules resolve to nothing rather than to their slot's new occupant.
      timberrrrr: null,
      gargantCharge: null,
      jumpUpAndDown: null,
    })
    const gatebreaker = catalog.entities.find(
      entity => entity.kind === 'warscroll' && entity.name === 'Scourge of Aqshy Gatebreaker Mega-Gargant'
    )!
    const gatebreakerAbilities = catalog.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === gatebreaker.id)
      .map(relationship => entityById.get(relationship.to)!)
      .filter((entity): entity is Ability => entity.kind === 'ability')
    const flail = gatebreakerAbilities.find(entry => entry.name === 'FORTCRUSHA FLAIL')!
    expect(flail.id).not.toBe(SHIPPED.gatebreakerBattleDamaged)
    expect(gatebreakerAbilities.find(entry => entry.name === 'BATTLE DAMAGED')?.id).toBe(
      SHIPPED.gatebreakerBattleDamaged
    )
  })

  it('keeps every Sons of Behemat page identity on the name it was minted under', () => {
    // Reviewed renames: the same rule under a new name. Anything else is a slot rebinding.
    const reviewedRenames = new Map([
      // Recorded secondary disagreement: Wahapedia's name for the BSData-era trait.
      ['ability:ae71f48a-1b79-5bce-9da3-406d4a24dfab', 'WRATHFUL RAMPAGE'],
      // The September 2026 rewrite splits the flail into two named profiles; this is the first.
      ['weapon:d8119cab-47cc-5e06-8e78-59121c5d4a83', 'Fortcrusha Flail: Crushing Blow'],
    ])
    const sonsOfBehematEntries = registry.entries.filter(entry =>
      entry.aliases.some(
        alias =>
          alias.externalId.includes('/factions/sons-of-behemat/') ||
          alias.externalId.includes('battle-traits-sons-of-behemat')
      )
    )
    expect(sonsOfBehematEntries.length).toBeGreaterThan(150)
    const renamed = sonsOfBehematEntries.flatMap(entry => {
      const entity = entityById.get(entry.canonicalId)
      return entity && comparableName(entity.name) !== comparableName(entry.name)
        ? [[entry.canonicalId, entity.name] as const]
        : []
    })
    expect(new Map(renamed)).toEqual(reviewedRenames)
  })

  it('binds every positional Sons of Behemat page alias to the rule its slot now prints', () => {
    // Review round 2 (PR #2023): the merge pairs a page record with its export row by name, so a
    // positional alias left on the slot's previous rule is masked today but would misbind the next
    // time the row pairing is lost. Every emitted page slot must own its alias outright.
    const positional =
      /^html:https:\/\/wahapedia\.ru\/aos4\/factions\/sons-of-behemat\/.*[/:](ability|weapon):\d+$/
    const ownerByAlias = new Map(
      registry.entries.flatMap(entry =>
        entry.aliases.map(alias => [alias.externalId, entry.canonicalId] as const)
      )
    )
    const prefix = 'source-record:wahapedia:'
    // Choice groups cite the same records; only the ability or weapon owns the slot's alias.
    const slots = catalog.entities.flatMap(entity =>
      entity.kind !== 'ability' && entity.kind !== 'weapon'
        ? []
        : entity.sourceRefs
            .filter(reference => reference.sourceRecordId.startsWith(prefix))
            .map(reference => decodeURIComponent(reference.sourceRecordId.slice(prefix.length)))
            // A slot whose alias was never registered binds through its export row or BSData entry.
            .filter(alias => positional.test(alias) && ownerByAlias.has(alias))
            .map(alias => ({ alias, id: entity.id }))
    )
    expect(slots.length).toBeGreaterThan(100)
    expect(slots.filter(slot => ownerByAlias.get(slot.alias) !== slot.id)).toEqual([])
    const page = 'html:https://wahapedia.ru/aos4/factions/sons-of-behemat/warscrolls.html#datasheet:'
    const nameOf = (alias: string) => entityById.get(ownerByAlias.get(`${page}${alias}`)!)?.name
    expect(
      [2, 3, 4].map(slot => nameOf(`Scourge-of-Aqshy-Gatebreaker-Mega-Gargant/ability:${slot}`))
    ).toEqual(['IT’S GOIN’ DOWN', 'BATTLE DAMAGED', 'OFF IN A HUFF'])
    expect([2, 3, 4].map(slot => nameOf(`Scourge-of-Aqshy-Mancrusher-Gargant/weapon:${slot}`))).toEqual([
      '’Eadbutt',
      'Mighty Kick',
      'Massive Club',
    ])
    // The rules those slots used to print keep their export aliases, so their IDs stay registered.
    ;[
      ['Warscrolls_abilities.csv:000003618:2', 'LONGSHANKS'],
      ['Warscrolls_abilities.csv:000003618:3', 'SON OF BEHEMAT'],
    ].forEach(([alias, name]) =>
      expect(registry.entries.find(entry => entry.canonicalId === ownerByAlias.get(alias))?.name).toBe(name)
    )
  })

  it('applies a stored hide and note to the same rule, and never to a retired rule’s slot', () => {
    const selection = resolveSelection(catalog, { explicitIds: [sob.id], rulesContextId: standard.id })
    const projected = projectReminders(catalog, selection)
    const occurrenceFor = (abilityId: string) => {
      const entry = ability(abilityId)!
      return reminderOccurrenceId(entry.id, entry.timings[0])
    }
    // The occurrence keys a document saved on corpus 2026-09-24; the semantic timing is unchanged.
    const bsDataEra = [
      [SHIPPED.takeARunAtIt, 'TAKE A RUN AT IT', 'turn-phase:movement|active|your|normal|1:turn:army'],
      [SHIPPED.argyBargy, 'ARGY BARGY', 'turn-phase:charge|active|your|normal|1:turn:army'],
      [SHIPPED.wrathfulRampage, 'WRATHFUL RAMPAGE', 'turn-phase:combat|active|any|normal|1:turn:army'],
      [SHIPPED.haringBack, 'HARING BACK', 'turn-phase:end-of-turn|active|your|normal|1:turn:army'],
      [SHIPPED.theBigOne, 'THE BIG ONE', 'turn-phase:end-of-turn|active|your|normal|1:turn:army'],
    ] as const
    bsDataEra.forEach(([abilityId, , timing]) =>
      expect(occurrenceFor(abilityId)).toBe(`reminder:${abilityId}@${timing}`)
    )
    const retiredKey = `reminder:${SHIPPED.timberrrrr}@always|passive|neutral|normal|unlimited`
    const document = createAos4ArmyDocument({
      id: 'continuity',
      name: 'Continuity',
      rulesContextId: standard.id,
      explicitSelectionIds: [sob.id],
      reminderPreferences: {
        ...Object.fromEntries(
          bsDataEra.map(([abilityId, name, timing]) => [
            `reminder:${abilityId}@${timing}`,
            { hidden: true, note: `note for ${name}` },
          ])
        ),
        [retiredKey]: { note: 'note for the index-era TIMBERRRRR!' },
      },
    })
    const reminders = createAos4ReminderViewModel(catalog, document)
    bsDataEra.forEach(([abilityId, name, timing]) => {
      const reminder = reminders.find(entry => entry.id === `reminder:${abilityId}@${timing}`)!
      expect(reminder).toMatchObject({ name, hidden: true, note: `note for ${name}` })
    })
    expect(reminders.some(reminder => reminder.note === 'note for the index-era TIMBERRRRR!')).toBe(false)
    // The retired ability projects nothing, so migration has no occurrence to re-key it onto.
    const migrated = migrateAos4ReminderPreferences(
      document,
      projected.map(reminder => ({ id: reminder.id, abilityIds: reminder.abilityIds }))
    )
    expect(migrated).toBe(document)
  })

  it('keeps the Scourge of Ghyran formations and heroic traits historical and reachable', () => {
    const groups = ['Big Toes', 'Manskittle Mob'].map(name =>
      catalog.entities.find(
        (entity): entity is ContentGroup => entity.kind === 'content-group' && entity.name === name
      )!
    )
    const ghyranTraits = catalog.entities.find(
      (entity): entity is ContentGroup =>
        entity.kind === 'content-group' &&
        entity.name === 'Big Personalities' &&
        entity.rulesContextIds.includes(historical.id)
    )!
    ;[...groups, ghyranTraits].forEach(group => {
      expect(group.rulesContextIds).toEqual([historical.id])
      expect(
        catalog.relationships.some(
          relationship =>
            relationship.kind === 'offers' && relationship.from === sob.id && relationship.to === group.id
        )
      ).toBe(true)
    })
    const pick = (allowsHistorical: boolean) =>
      resolveSelection(catalog, {
        explicitIds: [sob.id, groups[0].id, groups[1].id, ghyranTraits.id],
        rulesContextId: standard.id,
        ...(allowsHistorical ? { allowsHistorical: true } : {}),
      })
    const names = projectReminders(catalog, pick(true)).map(reminder => reminder.name)
    ;['LOFTY LOUTS', 'STRIKE! HUR HUR!', 'GRABBY', 'TERRIFYING HULK', 'MEGA-GRUMP'].forEach(name =>
      expect(names).toContain(name)
    )
    // Without the historical overlay the picks stay out of the current army, as on master.
    expect(projectReminders(catalog, pick(false)).map(reminder => reminder.name)).not.toContain('LOFTY LOUTS')
  })

  it('projects each battletome Army of Renown instead of the regular battle traits', () => {
    const regular = ['TAKE A RUN AT IT', 'ARGY BARGY', 'WRATHFUL RAMPAGE', 'HARING BACK', 'THE BIG ONE']
    ;['King Brodd’s Stomp', 'Matriarch’s Mob', 'Stomper Tribe'].forEach(name => {
      const root = catalog.entities.find(
        (entity): entity is ContentGroup =>
          entity.kind === 'content-group' && entity.groupType === 'army-of-renown' && entity.name === name
      )!
      const selection = resolveSelection(catalog, {
        explicitIds: [sob.id, root.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      const names = projectReminders(catalog, selection).map(reminder => reminder.name)
      regular.forEach(trait => expect(names).not.toContain(trait))
      const battleTraits = catalog.relationships
        .filter(relationship => relationship.kind === 'includes' && relationship.from === root.id)
        .map(relationship => entityById.get(relationship.to)!)
        .find(
          (entity): entity is ContentGroup =>
            entity.kind === 'content-group' && entity.name === 'Battle Traits'
        )!
      const traitNames = catalog.relationships
        .filter(relationship => relationship.kind === 'includes' && relationship.from === battleTraits.id)
        .map(relationship => entityById.get(relationship.to)!.name)
      expect(traitNames.length).toBeGreaterThan(0)
      traitNames.forEach(trait => expect(names).toContain(trait))
    })
  })

  it('restores the RAMPAGE keyword the official King Brodd’s Stomp pages print', () => {
    ;['WRATH OF BRODD', 'SMASH IT ALL TO BITS', 'DOUBLE STOMP', 'CRAFTY CREEPERS', 'WATCH THIS!'].forEach(
      name => {
        const trait = catalog.entities.find(
          (entity): entity is Ability => entity.kind === 'ability' && entity.name === name
        )!
        expect([...trait.keywords].sort()).toEqual(['DESTRUCTIVE IMPULSE', 'RAMPAGE'])
      }
    )
  })
})
