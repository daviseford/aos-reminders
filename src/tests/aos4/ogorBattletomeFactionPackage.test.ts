import type { Ability, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_CATALOG } from '../../aos4/generated'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * The July 2026 Battletome: Ogor Mawtribes replaces the index-era roster options: four battle
 * formations, three heroic traits, and three artefacts of power (beta report #1828). Their
 * existence and official spellings are established by the accepted official Battle Profiles -
 * Ogor Mawtribes document, but Wahapedia does not yet carry their rules (verified 2026-08-01),
 * so under the standing fallback-tier source policy the accepted `corpus-2026-08-01c` review
 * admits the commit-pinned BSData main-branch transcriptions as provisional community facts.
 *
 * Official precedence also moves the superseded index-era options to the historical context:
 * the official document lists only the battletome set for the current context. The two new
 * lores (Lore of Gut Magic, Lore of the Everwinter) are NOT shipped: BSData has not transcribed
 * their spells or prayers yet, so the index-era lores remain current until a source exists.
 *
 * When Wahapedia publishes the battletome faction rules, the standard candidate intake replaces
 * these provisional facts and this test's expectations must move with that acceptance.
 */

const BATTLETOME_FORMATIONS = [
  { name: 'Hunger-filled Tribe', ability: 'Feast of Bloodshed' },
  { name: 'Vanguard of the Mawpath', ability: 'Smash and Grab' },
  { name: 'Hinterland Hunters', ability: 'Prowling Predators' },
  { name: 'Maw-cult Fanatics', ability: "Grub's Up, Mateys!" },
]
const BATTLETOME_TRAITS = ['The Crusherguts', 'Leave Not a Morsel', 'Dreaded Far and Wide']
const BATTLETOME_ARTEFACTS = ['Trophy Rack', 'Carvalox Hide', 'Mantle of Entrails']
const INDEX_ERA_FORMATIONS = [
  'Heralds of the Everwinter',
  'Blackpowder Fanatics',
  'Beast Handlers',
  'Prophets of the Gulping God',
]

const standard = AOS4_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const historical = AOS4_CATALOG.rulesContexts.find(context => context.status === 'historical')!
const artifactById = new Map(AOS4_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_CATALOG.sourceRecords.map(record => [record.id, record]))

const ogor = AOS4_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Ogor Mawtribes'
)!

const offeredGroups = (groupType: string): ContentGroup[] => {
  const offered = new Set(
    AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers' && relationship.from === ogor.id)
      .map(relationship => relationship.to)
  )
  return AOS4_CATALOG.entities.filter(
    (entity): entity is ContentGroup =>
      entity.kind === 'content-group' && entity.groupType === groupType && offered.has(entity.id)
  )
}

const membersOf = (group: ContentGroup): Ability[] => {
  const included = new Set(
    AOS4_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
      .map(relationship => relationship.to)
  )
  return AOS4_CATALOG.entities.filter(
    (entity): entity is Ability => entity.kind === 'ability' && included.has(entity.id)
  )
}

const hasProvisionalCommunityAttribution = (entity: ContentGroup | Ability): boolean =>
  entity.sourceRefs.some(reference => {
    const record = recordById.get(reference.sourceRecordId)
    const artifact = record && artifactById.get(record.artifactId)
    return (
      artifact?.authority.kind === 'community' &&
      artifact.publisher === 'other' &&
      /provisional/i.test(artifact.title)
    )
  })

describe('Ogor battletome faction package ships provisionally from BSData under the fallback-tier policy', () => {
  it.each(BATTLETOME_FORMATIONS)(
    'offers the $name battle formation in the current context with a reminder',
    ({ name, ability }) => {
      const formation = offeredGroups('battle-formation').find(group => group.name === name)
      expect(formation).toBeDefined()
      expect(formation!.rulesContextIds).toContain(standard.id)
      expect(hasProvisionalCommunityAttribution(formation!)).toBe(true)

      const abilities = membersOf(formation!)
      expect(abilities.map(member => member.name)).toEqual([ability])

      const selection = resolveSelection(AOS4_CATALOG, {
        explicitIds: [ogor.id, formation!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      const reminders = projectReminders(AOS4_CATALOG, selection).filter(reminder =>
        reminder.contributingEntityIds.includes(formation!.id)
      )
      expect(reminders.length).toBeGreaterThan(0)
    }
  )

  it('offers the battletome heroic traits and artefacts under their official names', () => {
    const traits = offeredGroups('heroic-trait').find(
      group => group.name === 'Traits of Endless Hunger' && group.rulesContextIds.includes(standard.id)
    )
    expect(traits).toBeDefined()
    expect(membersOf(traits!).map(member => member.name).sort()).toEqual([...BATTLETOME_TRAITS].sort())
    membersOf(traits!).forEach(member => expect(hasProvisionalCommunityAttribution(member)).toBe(true))

    const artefacts = offeredGroups('artefact-of-power').filter(
      group => group.name === 'Plunder of the Mawtribes' && group.rulesContextIds.includes(standard.id)
    )
    // The seasonal Scourge of Aqshy artefacts and the battletome artefacts share the group name.
    const battletome = artefacts.find(group =>
      membersOf(group).some(member => member.name === 'Trophy Rack')
    )
    expect(battletome).toBeDefined()
    expect(membersOf(battletome!).map(member => member.name).sort()).toEqual(
      [...BATTLETOME_ARTEFACTS].sort()
    )
  })

  it('moves the superseded index-era options to the historical context', () => {
    INDEX_ERA_FORMATIONS.forEach(name => {
      const formation = offeredGroups('battle-formation').find(group => group.name === name)
      expect(formation).toBeDefined()
      expect(formation!.rulesContextIds).toEqual([historical.id])
    })
    const oldTraits = offeredGroups('heroic-trait').find(
      group => group.name === 'Traits of Endless Hunger' && group.rulesContextIds.includes(historical.id)
    )
    expect(oldTraits).toBeDefined()
    expect(membersOf(oldTraits!).map(member => member.name).sort()).toEqual([
      'BOOMING ROAR',
      'GREAT GUTLORD',
      'TOUCHED BY THE EVERWINTER',
    ])
    const oldArtefacts = offeredGroups('artefact-of-power').find(
      group => group.name === 'Plunder of the Mawtribes' && group.rulesContextIds.includes(historical.id)
    )
    expect(oldArtefacts).toBeDefined()
  })

  it('keeps the index-era lores current until a source carries the battletome lores', () => {
    // BSData has not transcribed Lore of Gut Magic or Lore of the Everwinter (dangling links at
    // the pinned commit), so the fallback tier cannot supply them and the index-era lores stay.
    const spellLore = offeredGroups('spell-lore').find(group => group.name === 'Lore of Maw-magic')
    expect(spellLore).toBeDefined()
    expect(spellLore!.rulesContextIds).toContain(standard.id)
    const prayerLore = offeredGroups('prayer-lore').find(group => group.name === 'Everwinter Prayers')
    expect(prayerLore).toBeDefined()
    expect(prayerLore!.rulesContextIds).toContain(standard.id)
    expect(
      AOS4_CATALOG.entities.some(entity => entity.kind === 'content-group' && entity.name === 'Lore of Gut Magic')
    ).toBe(false)
  })
})
