import { readFileSync } from 'fs'
import { SERAPHON } from 'meta/factions'
import path from 'path'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { cleanWarhammerAppText } from 'utils/warhammer_app/warhammerAppUtils'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarhammerAppArmy', () => {
  it('should correctly read Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const cleanedText = cleanWarhammerAppText(parsedText)
    const res = getWarhammerAppArmy(cleanedText)

    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        artifacts: ['Amulet of Destiny', 'Serpent God Dagger'],
        battalions: ['Battle Regiment', 'Command Entourage', 'Hunters of the Heartlands'],
        command_abilities: ['Parting Shot', 'Supreme Gift from the Heavens', 'Herald of the Old Ones'],
        command_traits: ['Old and Grizzled'],
        core_rules: [],
        endless_spells: ['Soulsnare Shackles', 'The Burning Head'],
        flavors: ['Fangs of Sotek'],
        grand_strategies: ['Prized Sorcery'],
        mount_traits: [],
        prayers: ['Heal'],
        scenery: ['Realmshaper Engine'],
        spells: [
          'Tide of Serpents',
          'Hand of Glory',
          'Celestial Apotheosis',
          'Celestial Deliverance',
          'Celestial Equilibrium',
          'Drain Magic',
          'Mystical Unforging',
          'Stellar Tempest',
          'Walk Between Realms',
          "Comet's Call",
          'Blazing Starlight',
        ],
        triumphs: ['Inspired'],
        units: [
          'Razordon Hunting Pack',
          'Lord Kroak',
          'Saurus Astrolith Bearer',
          'Saurus Guard',
          'Skink Oracle on Troglodon',
          'Skink Priest',
          'Skink Starpriest',
          'Skinks',
          'Chameleon Skinks',
        ],
      },
      subFactionName: 'Starborne',
      unknownSelections: [],
    })
    expect(res.errors).toEqual([])
  })

  it('should correctly read Fyreslayers1', () => {
    const parsedText = getFile('Fyreslayers1')
    const cleanedText = cleanWarhammerAppText(parsedText)
    const res = getWarhammerAppArmy(cleanedText)
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text: 'Allied Warden King can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
    ])
  })

  it('should correctly read Seraphon2', () => {
    const parsedText = getFile('Seraphon2')
    const cleanedText = cleanWarhammerAppText(parsedText)
    const res = getWarhammerAppArmy(cleanedText)
    expect(res.selections.units).toContain('Bastiladon')
    expect(res.errors).toEqual([])
  })
})
