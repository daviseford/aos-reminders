import { readFileSync } from 'fs'
import { GLOOMSPITE_GITZ, SERAPHON, SKAVEN } from 'meta/factions'
import path from 'path'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarhammerAppArmy', () => {
  it('should correctly read Dec_22_update', () => {
    const parsedText = getFile('Dec_22_update')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.flavors).toContain("Glogg's Megamob")
    expect(res.selections.units).toContain('Loonboss')
    expect(res.selections.grand_strategies).toContain('Sever the Head')
    expect(res.selections.spells).toContain('Itchy Nuisance')
    expect(res.selections.battalions).toContain('Battle Regiment')
    expect(res.selections.battalions).toContain('Linebreaker')
    expect(res.selections.battalions).toContain('Warlord')
    expect(res.selections.scenery).toContain('Bad Moon Loonshrine')
  })

  it('should correctly read 1640117854602-Warhammer_App', () => {
    const parsedText = getFile('1640117854602-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)

    expect(res.selections.units).toContain('Liberators')
    expect(res.selections.units).toContain('Knight-Incantor')
    expect(res.selections.units).toContain('Gardus Steel Soul')
    expect(res.selections.units).toContain('Lord-Arcanum on Tauralon')
    expect(res.selections.units).toContain('Lord-Relictor')
    expect(res.selections.units).toContain('Dracothian Guard Fulminators')
    expect(res.selections.units).toContain('Vanguard-Raptors with Longstrike Crossbows')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1635442222774-Warhammer_App', () => {
    const parsedText = getFile('1635442222774-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.command_traits).toContain('Acidic Blood (Drakeblood Curse)')
  })

  it('should correctly read 1632565338858-Warhammer_App', () => {
    const parsedText = getFile('1632565338858-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Fuethan')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632626188332-Warhammer_App', () => {
    const parsedText = getFile('1632626188332-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.command_traits).toContain('Mighty War Leader')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1633021235077-Warhammer_App', () => {
    const parsedText = getFile('1633021235077-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Blessed Sons')
  })

  // This shouldn't work, it's actually a Warscroll Builder list
  it('should correctly read 1631987356655-Warhammer_App', () => {
    const parsedText = getFile('1631987356655-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'error',
        text: 'There was a problem parsing this text. Please try copy + pasting it again from the Warhammer App.',
      },
    ])
  })

  it('should correctly read 1632069915266-Warhammer_App', () => {
    const parsedText = getFile('1632069915266-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.artifacts).toContain('Amulet of Silvered Sigmarite')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632078223244-Warhammer_App', () => {
    const parsedText = getFile('1632078223244-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(SKAVEN)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632087431639-Warhammer_App', () => {
    const parsedText = getFile('1632087431639-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Dhom-Hain')
  })

  it('should correctly read 1632089083030-Warhammer_App', () => {
    const parsedText = getFile('1632089083030-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain('Daemon Prince')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632120973397-Warhammer_App', () => {
    const parsedText = getFile('1632120973397-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.battalions).toContain('Redemption Brotherhood')
    expect(res.errors).toEqual([])
  })

  it('should correctly read Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const res = getWarhammerAppArmy(parsedText)

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
        incarnates: [],
        monstrous_rampages: [],
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

  it('should correctly read Seraphon2', () => {
    const parsedText = getFile('Seraphon2')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain('Bastiladon')
    expect(res.errors).toEqual([])
  })
})
