import type { Ability, ContentGroup, Faction } from '../../aos4/domain'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'

/**
 * The July 2026 Battletome: Ogor Mawtribes replaces the index-era roster options: four battle
 * formations, three heroic traits, three artefacts of power, the army-wide battle traits, and
 * both lores (beta reports #1828 and the 2026-08-02 Discord report). From 2026-08-01c to
 * 2026-08-28 the package shipped provisionally from commit-pinned BSData transcriptions with
 * reviewed contextOverrides retiring the index-era set to the historical context.
 *
 * On 2026-08-28 Wahapedia published the battletome-current faction page, and the 2026-08-28b
 * revision completed the swap: the re-pinned page now supplies the whole package as ordinary
 * secondary facts (rendered in the page's uppercase ability style, like every other faction),
 * the community source entries and contextOverrides are retired, and the index-era options are
 * gone from the source entirely — Wahapedia no longer publishes them on any accepted page, so
 * they left the corpus with the page that carried them.
 */

// The Wahapedia page title-cases group names ("Hunger-Filled Tribe") where the official Battle
// Profiles document prints "Hunger-filled Tribe"; the page casing ships, matching how every other
// faction's group names are taken from its accepted page.
const BATTLETOME_FORMATIONS = [
  { name: 'Hunger-Filled Tribe', ability: 'FEAST OF BLOODSHED' },
  { name: 'Vanguard of the Mawpath', ability: 'SMASH AND GRAB' },
  { name: 'Hinterland Hunters', ability: 'PROWLING PREDATORS' },
  { name: 'Maw-Cult Fanatics', ability: 'GRUB’S UP, MATEYS!' },
]
const BATTLETOME_TRAITS = ['THE CRUSHERGUTS', 'LEAVE NOT A MORSEL', 'DREADED FAR AND WIDE']
const BATTLETOME_ARTEFACTS = ['TROPHY RACK', 'CARVALOX HIDE', 'MANTLE OF ENTRAILS']
const INDEX_ERA_FORMATIONS = [
  'Heralds of the Everwinter',
  'Blackpowder Fanatics',
  'Beast Handlers',
  'Prophets of the Gulping God',
]

const standard = AOS4_FULL_CATALOG.rulesContexts.find(
  context => context.mode === 'standard' && context.status === 'current'
)!
const artifactById = new Map(AOS4_FULL_CATALOG.sourceArtifacts.map(artifact => [artifact.id, artifact]))
const recordById = new Map(AOS4_FULL_CATALOG.sourceRecords.map(record => [record.id, record]))

const ogor = AOS4_FULL_CATALOG.entities.find(
  (entity): entity is Faction => entity.kind === 'faction' && entity.name === 'Ogor Mawtribes'
)!

const offeredGroups = (groupType: string): ContentGroup[] => {
  const offered = new Set(
    AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'offers' && relationship.from === ogor.id)
      .map(relationship => relationship.to)
  )
  return AOS4_FULL_CATALOG.entities.filter(
    (entity): entity is ContentGroup =>
      entity.kind === 'content-group' && entity.groupType === groupType && offered.has(entity.id)
  )
}

const membersOf = (group: ContentGroup): Ability[] => {
  const included = new Set(
    AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.from === group.id)
      .map(relationship => relationship.to)
  )
  return AOS4_FULL_CATALOG.entities.filter(
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

describe('Ogor battletome faction package ships from the verified Wahapedia page (2026-08-28b swap)', () => {
  it.each(BATTLETOME_FORMATIONS)(
    'offers the $name battle formation in the current context with a reminder',
    ({ name, ability }) => {
      const formation = offeredGroups('battle-formation').find(group => group.name === name)
      expect(formation).toBeDefined()
      expect(formation!.rulesContextIds).toContain(standard.id)
      expect(hasProvisionalCommunityAttribution(formation!)).toBe(false)

      const abilities = membersOf(formation!)
      expect(abilities.map(member => member.name)).toEqual([ability])

      const selection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [ogor.id, formation!.id],
        rulesContextId: standard.id,
      })
      expect(selection.diagnostics).toEqual([])
      const reminders = projectReminders(AOS4_FULL_CATALOG, selection).filter(reminder =>
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
    expect(
      membersOf(traits!)
        .map(member => member.name)
        .sort()
    ).toEqual([...BATTLETOME_TRAITS].sort())
    membersOf(traits!).forEach(member => expect(hasProvisionalCommunityAttribution(member)).toBe(false))

    const artefacts = offeredGroups('artefact-of-power').filter(
      group => group.name === 'Plunder of the Mawtribes' && group.rulesContextIds.includes(standard.id)
    )
    // The seasonal Scourge of Aqshy artefacts and the battletome artefacts share the group name.
    const battletome = artefacts.find(group => membersOf(group).some(member => member.name === 'TROPHY RACK'))
    expect(battletome).toBeDefined()
    expect(
      membersOf(battletome!)
        .map(member => member.name)
        .sort()
    ).toEqual([...BATTLETOME_ARTEFACTS].sort())
  })

  it('no longer carries the superseded index-era options anywhere', () => {
    // Until 2026-08-28 the index-era set survived in the historical context because Wahapedia
    // still published it; the battletome-current page dropped it entirely, so it left the
    // corpus with the page that carried it. Only genuinely historical sections (the White
    // Dwarf-era formations) remain in the historical context.
    INDEX_ERA_FORMATIONS.forEach(name => {
      expect(offeredGroups('battle-formation').find(group => group.name === name)).toBeUndefined()
    })
    expect(
      offeredGroups('heroic-trait').filter(group => group.name === 'Traits of Endless Hunger')
    ).toHaveLength(1)
    const artefactGroups = offeredGroups('artefact-of-power').filter(
      group => group.name === 'Plunder of the Mawtribes'
    )
    // The battletome artefacts and the seasonal Scourge of Aqshy artefacts share the name; the
    // index-era artefact set is gone.
    expect(artefactGroups).toHaveLength(2)
    const memberNames = artefactGroups.flatMap(group => membersOf(group).map(member => member.name))
    expect(memberNames).not.toContain('GRUESOME TROPHIES')
    expect(memberNames).not.toContain('ELIXIR OF THE FROSTWYRM')
    expect(memberNames).not.toContain('THE FANG OF GHUR')
  })

  it('ships the battletome lores from the page and drops the index-era lores with the source', () => {
    const spellLore = offeredGroups('spell-lore').find(group => group.name === 'Lore of Gut Magic')
    expect(spellLore).toBeDefined()
    expect(spellLore!.rulesContextIds).toContain(standard.id)
    expect(hasProvisionalCommunityAttribution(spellLore!)).toBe(false)
    expect(
      membersOf(spellLore!)
        .map(member => member.name)
        .sort()
    ).toEqual(['BLOOD FEAST', 'SHINCRUNCHER', 'TALLOWFLAGE'])

    const prayerLore = offeredGroups('prayer-lore').find(group => group.name === 'Lore of the Everwinter')
    expect(prayerLore).toBeDefined()
    expect(prayerLore!.rulesContextIds).toContain(standard.id)
    expect(hasProvisionalCommunityAttribution(prayerLore!)).toBe(false)
    expect(
      membersOf(prayerLore!)
        .map(member => member.name)
        .sort()
    ).toEqual(['FORTIFYING HOARFROST', 'FREEZING TAILWINDS', 'PULVERISING HAILSTORM'])

    expect(offeredGroups('spell-lore').find(group => group.name === 'Lore of Maw-magic')).toBeUndefined()
    expect(offeredGroups('prayer-lore').find(group => group.name === 'Everwinter Prayers')).toBeUndefined()
  })

  it('ships the battletome battle traits from the page and drops the index-era set', () => {
    // Battle traits apply automatically: selecting the faction alone must produce the battletome
    // reminders (the Discord beta report showed index-era Trampling Charge still firing).
    const selection = resolveSelection(AOS4_FULL_CATALOG, {
      explicitIds: [ogor.id],
      rulesContextId: standard.id,
    })
    expect(selection.diagnostics).toEqual([])
    const reminderNames = projectReminders(AOS4_FULL_CATALOG, selection).map(reminder => reminder.name)
    ;['EAT ’EM ALIVE', 'BULL CHARGE', 'JAWS OF THE BEAST', 'CLOSING THE JAWS'].forEach(name =>
      expect(reminderNames).toContain(name)
    )
    ;['TRAMPLING CHARGE', 'RAVENOUS BRUTES', 'FEAST ON FLESH'].forEach(name =>
      expect(reminderNames).not.toContain(name)
    )

    const battleTraitNames = ['EAT ’EM ALIVE', 'BULL CHARGE', 'JAWS OF THE BEAST', 'CLOSING THE JAWS']
    const battleTraitAbilities = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is Ability =>
        entity.kind === 'ability' &&
        battleTraitNames.includes(entity.name) &&
        entity.rulesContextIds.includes(standard.id)
    )
    expect(battleTraitAbilities).toHaveLength(4)
    battleTraitAbilities.forEach(ability => {
      expect(hasProvisionalCommunityAttribution(ability)).toBe(false)
    })

    // The index-era set is gone with the page that carried it: Wahapedia no longer publishes
    // the index battle traits on any accepted page, in any context. The one same-named
    // survivor is The Roving Maw Army of Renown's own "Trampling Charge" battle trait, which
    // the battletome page still carries inside that army's replacing package.
    const indexEra = AOS4_FULL_CATALOG.entities.filter(
      (entity): entity is Ability =>
        entity.kind === 'ability' &&
        ['TRAMPLING CHARGE', 'RAVENOUS BRUTES', 'FEAST ON FLESH'].includes(entity.name)
    )
    expect(indexEra).toHaveLength(1)
    const rovingMawTraitGroups = AOS4_FULL_CATALOG.relationships
      .filter(relationship => relationship.kind === 'includes' && relationship.to === indexEra[0].id)
      .map(relationship => relationship.from)
    const owners = rovingMawTraitGroups.flatMap(groupId =>
      AOS4_FULL_CATALOG.relationships
        .filter(relationship => relationship.kind === 'includes' && relationship.to === groupId)
        .map(relationship => relationship.from)
    )
    const ownerNames = owners.map(id => AOS4_FULL_CATALOG.entities.find(entity => entity.id === id)?.name)
    expect(ownerNames).toEqual(['The Roving Maw'])
  })
})
