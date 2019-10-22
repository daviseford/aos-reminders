import { readFileSync } from 'fs'
import path from 'path'
import { SERAPHON, FLESH_EATER_COURTS, BEASTS_OF_CHAOS, FYRESLAYERS, STORMCAST_ETERNALS } from 'meta/factions'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattlescribeArmy', () => {
  it('should work with BoC', () => {
    const parsedText = getFile('BoC1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(res.errors).toEqual([])
  })

  xit('should work with FEC', () => {
    const parsedText = getFile('FEC1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.selections.allegiances).toEqual(['Gristlegore (Grand Court)'])
    expect(res.errors).toEqual([])
  })

  xit('should work with Fyreslayers', () => {
    const parsedText = getFile('Fyreslayers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.allegiances).toEqual(['Hermdar (Lodge)'])
    expect(res.errors).toEqual([])
  })

  it('should work with Seraphon', () => {
    const parsedText = getFile('Seraphon2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.allyFactionNames).toEqual([STORMCAST_ETERNALS])
    expect(res.allySelections).toEqual({
      STORMCAST_ETERNALS: {
        units: [
          'Drakesworn Templar',
          'Knight-Zephyros',
          'Celestar Ballista',
          'Protectors',
          'Vanguard-Raptors with Hurricane Crossbows',
        ],
      },
    })
    expect(res.errors).toEqual([
      { text: "Klaq-Tor's Talons", severity: 'warn' },
      { text: 'Lightning Echelon', severity: 'warn' },
      { text: 'Skyborne Slayers', severity: 'warn' },
    ])
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Blade of Realities', 'Light of Dracothion', 'Coronal Shield'],
      battalions: ["Dracothion's Tail"],
      commands: ['Impeccable Foresight', 'Ancient Warlord', 'Saurian Savagery'],
      endless_spells: [],
      scenery: [],
      spells: ['Arcane Bolt', 'Celestial Deliverance', 'Claws of Glory', "Comet's Call", 'Mystic Shield'],
      traits: [],
      triumphs: [],
      units: [
        'Engine of the Gods',
        'Lord Kroak',
        'Saurus Astrolith Bearer',
        'Skink Priest w/ Cloak of Feathers',
        'Bastiladon w/ Ark of Sotek',
        'Stegadon w/ Skystreak Bow',
        'Razordons',
        'Salamanders',
        'Saurus Guard',
        'Saurus Knights',
        'Skinks',
        'Chameleon Skinks',
        'Kroxigor',
        'Ripperdactyl Riders',
        'Skink Handlers',
        'Terradon Riders',
      ],
    })
  })
})
