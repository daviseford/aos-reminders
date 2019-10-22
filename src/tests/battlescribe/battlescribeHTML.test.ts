import { readFileSync } from 'fs'
import path from 'path'
import { SERAPHON } from 'meta/factions'
import { getBattleScribeArmy } from 'utils/battlescribe/getBattlescribeArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattleScribeArmy', () => {
  it('should work with Seraphon', () => {
    const parsedText = getFile('Seraphon2')
    const res = getBattleScribeArmy(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Blade of Realities', 'Light of Dracothian', 'Coronal Shield'],
      battalions: ["Dracothian's Tail", "Klaq-Tor's Talons", 'Lightning Echelon', 'Skyborne Slayers'],
      commands: ['Impeccable Foresight', 'Ancient Warlord', 'Saurian Savagery'],
      endless_spells: [],
      scenery: [],
      spells: ['Arcane Bolt', 'Celestial Deliverance', 'Claws of Glory', "Comet's Call", 'Mystic Shield'],
      traits: [],
      triumphs: [],
      units: [
        'Drakesworn Templar',
        'Engine of the Gods',
        'Knight-Zephyros',
        'Lord Kroak',
        'Saurus Astrolith Bearer',
        'Skink Priest',
        'Bastiladon',
        'Stegadon',
        'Celestar Ballista',
        'Razordons',
        'Salamanders',
        'Saurus Guard',
        'Saurus Knights',
        'Skinks',
        'Chameleon Skinks',
        'Kroxigor',
        'Protectors',
        'Ripperdactyl Riders',
        'Skink Handlers',
        'Terradon Riders',
        'Vanguard-Raptors with Hurricane Crossbows',
      ],
    })
  })
})
