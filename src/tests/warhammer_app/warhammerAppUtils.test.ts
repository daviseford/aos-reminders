import { readFileSync } from 'fs'
import path from 'path'
import { cleanWarhammerAppText, warhammerAppPlaceholders } from 'utils/warhammer_app/warhammerAppUtils'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('warhammerAppUtils', () => {
  it('correctly format Fyreslayers1', () => {
    const parsedText = getFile('Fyreslayers1')
    const cleanedText = cleanWarhammerAppText(parsedText)

    expect(cleanedText).toEqual([
      'Army Name: Fyreslayers1',
      // 'Army Notes: Some notes go here',
      'Army Faction: Fyreslayers',
      'Subfaction: Greyfyrd',
      // 'General: Auric Runefather',
      'Units',
      'Auric Runefather',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Command Traits: Destroyer of Foes',
      'Artefacts of Power: Helm of Obsidia',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Bundo Whalebiter (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Fjul-Grimnir',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Auric Runemaster',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Auric Runesmiter',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Ancestor Helm',
      'Prayers: Prayer Of Ash',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Auric Runesmiter on Magmadroth',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Auric Runeson',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Helm of Obsidia',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Auric Runeson on Magmadroth',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Battlesmith',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Draught of Magmalt Ale',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Fjul-Grimnir',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Warden King (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Core Battalions',
      'Alpha-Beast Pack',
      'Alpha-Beast Pack',
      'Battle Regiment',
      warhammerAppPlaceholders.END_OF_LIST,
      'Invalid: Created with Warhammer Age of Sigmar: The App',
    ])
  })

  it('correctly format Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const cleanedText = cleanWarhammerAppText(parsedText)

    expect(cleanedText).toEqual([
      'Army Name: Hammerfest',
      'Army Faction: Seraphon',
      'Army Type: Starborne',
      'Subfaction: Fangs of Sotek',
      // 'Battlepack: Pitched Battles',
      // 'Points Limit: 2000 pts',

      'Grand Strategies: Prized Sorcery',

      'Triumphs: Inspired',

      // TODO: I think the Battle Trait bonuses are auto-added by flavors anyways
      // so we can just ignore them here
      // 'Battle Trait Bonus: First to Battle, Parting Shot',

      'Core Battalions',
      'Battle Regiment',
      // This will be a problem, no demarcation between Battalions/Units section

      'Razordon Hunting Pack',
      // 'Battalion Slot Filled: Troops',
      // 'Battlefield Role: Other',
      // 'Reinforced: Once',
      // 'Points Cost: 190 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      // 'Lord Kroak (General)',
      'Lord Kroak',
      // 'Battalion Slot Filled: Commander',
      // 'Battlefield Role: Leader',
      // 'Points Cost: 430 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Saurus Astrolith Bearer',
      // 'Battalion Slot Filled: Sub-commander',
      // 'Battlefield Role: Leader',
      // 'Points Cost: 150 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Saurus Guard',
      // 'Battalion Slot Filled: Troops',
      // 'Battlefield Role: Battleline',
      // 'Points Cost: 115 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Command Entourage',
      'Magnificent Bonus: Artefact of Power',
      'Skink Oracle on Troglodon',
      // 'Battalion Slot Filled: Commander',
      // 'Battlefield Role: Behemoth, Leader',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Amulet of Destiny',
      'Spells: Tide of Serpents',
      // 'Points Cost: 270 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Skink Priest',
      // 'Battalion Slot Filled: Sub-commander',
      // 'Battlefield Role: Leader',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Prayers: Heal',
      // 'Points Cost: 80 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Skink Starpriest',
      // 'Battalion Slot Filled: Sub-commander',
      // 'Battlefield Role: Leader',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Spells: Hand of Glory',
      // 'Points Cost: 130 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Hunters of the Heartlands',
      'Skinks',
      // 'Battalion Slot Filled: Troops',
      // 'Battlefield Role: Battleline',
      // 'Reinforced: Once',
      // 'Points Cost: 150 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Skinks',
      // 'Battalion Slot Filled: Troops',
      // 'Battlefield Role: Battleline',
      // 'Reinforced: Once',
      // 'Points Cost: 150 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Chameleon Skinks',
      // 'Battalion Slot Filled: Troops',
      // 'Battlefield Role: Other',
      // 'Reinforced: Once',
      // 'Points Cost: 230 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      warhammerAppPlaceholders.ENDLESS_SPELLS,
      'Soulsnare Shackles',
      // 'Points Cost: 65 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'The Burning Head',
      // 'Points Cost: 20 pts',
      warhammerAppPlaceholders.END_OF_ENTRY,

      warhammerAppPlaceholders.TERRAIN,
      'Realmshaper Engine',
      warhammerAppPlaceholders.END_OF_LIST,
      'Valid: Created with Warhammer Age of Sigmar: The App',
    ])
  })

  it('correctly format Ironjawz1', () => {
    const parsedText = getFile('Ironjawz1')
    const cleanedText = cleanWarhammerAppText(parsedText)
    console.log(cleanedText)
    expect(cleanedText).toEqual([
      'Army Name: Ironjawz1',
      'Army Faction: Orruk Warclans',
      'Army Type: Ironjawz',
      'Subfaction: Ironsunz',
      'Units',
      'Fungoid Cave-Shaman (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Gordrakk',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Orruk Megaboss',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Command Traits: Mega Bossy',
      'Artefacts of Power: The Boss Skewer',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Mollog (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Megaboss on Maw-krusha',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Command Traits: Heroic Stature',
      'Artefacts of Power: Arcane Tome',
      "Mount Traits: Smelly 'Un",
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Orruk Ardboys',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Orruk Brutes',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Shootas (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Stabbas (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Aleguzzler Gargant (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Core Battalions',
      'Command Entourage',
      'Magnificent Bonus: Spell',
      'Orruk Megaboss',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Armour of Gork',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Orruk Warchanter',
      warhammerAppPlaceholders.ENHANCEMENTS,
      'Artefacts of Power: Vial of Manticore Venom',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Orruk Weirdnob Shaman',
      warhammerAppPlaceholders.ENHANCEMENTS,
      "Spells: Da Great Big Green Hand of Gork, Bash 'Em Ladz",
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Gordrakk',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Fungoid Cave-Shaman (Ally)',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Warlord',
      warhammerAppPlaceholders.ENDLESS_SPELLS,
      'Emerald Lifeswarm',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Chronomantic Cogs',
      warhammerAppPlaceholders.END_OF_ENTRY,

      'Aethervoid Pendulum',
      warhammerAppPlaceholders.END_OF_ENTRY,

      warhammerAppPlaceholders.END_OF_LIST,
      'Invalid: Created with Warhammer Age of Sigmar: The App',
    ])
  })
})
