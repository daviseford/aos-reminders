import { readFileSync } from 'fs'
import path from 'path'
import {
  BEASTS_OF_CHAOS,
  BONESPLITTERZ,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGION_OF_BLOOD,
  SERAPHON,
  STORMCAST_ETERNALS,
  LEGION_OF_NIGHT,
  LEGION_OF_SACRAMENT,
  NIGHTHAUNT,
} from 'meta/factions'
import { getBattlescribeArmy } from 'utils/battlescribe/getBattlescribeArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/battlescribe/html/${filename}.html`), 'utf8')
}

describe('getBattlescribeArmy', () => {
  it('should work with Nighthaunt1', () => {
    const parsedText = getFile('Nighthaunt1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([])
  })
  it('should work with LoS1', () => {
    const parsedText = getFile('LoS1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(LEGION_OF_SACRAMENT)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Shroudguard',
      },
    ])
  })

  it('should work with LoN1', () => {
    const parsedText = getFile('LoN1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(LEGION_OF_NIGHT)
    expect(res.errors).toEqual([])
  })

  xit('should work with LoB1', () => {
    const parsedText = getFile('LoB1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(LEGION_OF_BLOOD)
    expect(res.errors).toEqual([])
  })

  it('should work with BoC', () => {
    const parsedText = getFile('BoC1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      // Herdstone is "Uncategorized"
      // TODO: Figure that out :)
      errors: [
        {
          text: 'Herdstone',
          severity: 'warn',
        },
      ],
      realmscape_feature: null,
      realmscape: 'Ghyran',
      unknownSelections: [],
      factionName: 'BEASTS_OF_CHAOS',
      selections: {
        allegiances: [],
        artifacts: [
          'Bleating Gnarlstaff (Brayherds)',
          "Ignax's Scales (Aqshy)",
          'Ruby Ring (Aqshy)',
          'Crown of Flames (Aqshy)',
          'Glyph-etched Talisman (Warherds)',
          'Magmaforged Blade (Aqshy)',
          'Onyx Blade (Aqshy)',
          'Smouldering Helm (Aqshy)',
          'Thunderstrike Lodestone (Thunderscorn)',
          'Volcanic Axe (Brayherds)',
        ],
        battalions: ['Depraved Drove', 'Marauding Brayherd'],
        commands: ['Grisly Trophy', "Slaughterer's Call"],
        endless_spells: [
          'Balewind Vortex',
          'Lauchon the Soulseeker',
          "Ravenak's Gnashing Jaws",
          'Soulscream Bridge',
        ],
        scenery: [
          // 'Herdstone',
          'Penumbral Engine',
        ],
        spells: [
          'Arcane Bolt',
          'Mystic Shield',
          'Summon Lightning',
          'Thunderwave (Thunderscorn Wizard)',
          'Devolve',
          'Vicious Stranglethorns (Brayherd Wizard)',
          'Boon of Mutation',
        ],
        traits: [],
        triumphs: [],
        units: [
          'Beastlord',
          'Doombull',
          'Dragon Ogor Shaggoth',
          'Great Bray-Shaman',
          'Tzaangor Shaman',
          'Chaos Gargant',
          'Cygor',
          'Gors',
          'Ungors',
          'Centigors',
          'Dragon Ogors',
          'Razorgors',
          'Tzaangor Enlightened',
          'Tzaangors',
        ],
      },
    })
  })

  it('should work with FEC', () => {
    const parsedText = getFile('FEC1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.realmscape).toEqual('Chamon')
    expect(res.selections.allegiances).toEqual(['Gristlegore (Grand Court)'])
    expect(res.selections.artifacts).toEqual([
      'The Grim Garland (Royal Treasury)',
      'The Dermal Robe (Royal Treasury)',
      'Carrion Wand (Noble Heirlooms)',
      'Blood-river Chalice (Royal Treasury)',
      'Ghurish Mawshard',
    ])
    // As with Herdstone, this is "Uncategorized"
    expect(res.errors).toEqual([{ text: 'Charnel Throne', severity: 'warn' }])
  })

  it('should work with Dok', () => {
    const parsedText = getFile('Dok1')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections).toEqual({
      allegiances: ['Hagg Nar (Temple)'],
      artifacts: [
        "Ignax's Scales (Aqshy)",
        'Ruby Ring (Aqshy)',
        'Rune of Ulgu (Wizard)',
        'Thousand and One Dark Blessings',
        'Cursed Blade',
        'Purefire Brazier (Aqshy)',
        'The Mirror Glaive (Wizard)',
        'Thermalrider Cloak (Aqshy)',
        'Crone Blade',
        'Smouldering Helm (Aqshy)',
        'Khainite Pendant (Priest)',
        'Magmadroth Blood Vials (Aqshy)',
      ],
      battalions: ['Cauldron Guard', 'Shadowhammer Compact', 'Temple Nest'],
      commands: [],
      endless_spells: ['Emerald Lifeswarm', 'Quicksilver Swords', 'Soulsnare Shackles'],
      scenery: [],
      spells: [
        'Arcane Bolt',
        'Enfeebling Foe',
        'Mystic Shield',
        'The Withering (Wizard)',
        "Arnzipal's Black Horror",
        'Doomfire',
      ],
      traits: [],
      triumphs: [],
      units: [
        'Bloodwrack Medusa',
        'Bloodwrack Shrine',
        'Hag Queen',
        'Hag Queen on Cauldron of Blood',
        'Morathi, High Oracle of Khaine',
        'Slaughter Queen',
        'Slaughter Queen on Cauldron of Blood',
        'Avatar of Khaine',
        'Sisters of Slaughter',
        'Witch Aelves',
        'Blood Sisters',
        'Blood Stalkers',
        'Doomfire Warlocks',
        'Khinerai Heartrenders',
        'Khinerai Lifetakers',
      ],
    })
    expect(res.errors).toEqual([])
  })

  it('should work with Fyreslayers', () => {
    const parsedText = getFile('Fyreslayers1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.allegiances).toEqual(['Hermdar (Lodge)'])
    // As with Herdstone, this is "Uncategorized"
    expect(res.errors).toEqual([{ text: 'Magmic Battleforge', severity: 'warn' }])
  })

  it('should work with Khorne2', () => {
    const parsedText = getFile('Khorne2')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      { text: 'Herdstone', severity: 'warn' },
      {
        text:
          'Allied Chaos Spawn can belong to Beasts Of Chaos or Slaves To Darkness. Please add this unit manually.',
        severity: 'ally-warn',
      },
    ])
  })

  it('should work with Bonesplitterz1', () => {
    const parsedText = getFile('Bonesplitterz1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(BONESPLITTERZ)
    // This is characterized as a Super Battalion by Battlescribe
    expect(res.errors).toEqual([{ text: 'Icebone Warclan', severity: 'warn' }])
  })

  it('should work with Gloomspite1', () => {
    const parsedText = getFile('Gloomspite1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.errors).toEqual([
      { text: 'Spider Rider Skitterswarm', severity: 'warn' },
      { text: 'Night Shroud', severity: 'warn' },
      { text: 'Speed of the Spider God', severity: 'warn' },
      { text: 'Venom of the Spider God', severity: 'warn' },
    ])
  })

  it('should work with IDK1', () => {
    const parsedText = getFile('IDK1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.errors).toEqual([
      { text: 'Awakening the Wood', severity: 'warn' },
      { text: 'Unleash Spites', severity: 'warn' },
      { text: 'Verdant Blessing', severity: 'warn' },
    ])
  })

  it('should work with Khorne1', () => {
    const parsedText = getFile('Khorne1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    // TODO: Fix once https://github.com/daviseford/aos-reminders/issues/640 is merged
    expect(res.errors).toEqual([
      // Skull altar is uncategorized
      { text: 'Skull Altar', severity: 'warn' },
      { text: 'Gigantic Chaos Spawn (of Khorne)', severity: 'warn' },
      { text: 'Mazrall the Butcher', severity: 'warn' },
      { text: 'Furies (of Khorne)', severity: 'warn' },
    ])
  })

  it('should work with KO2', () => {
    const parsedText = getFile('KO2')
    const res = getBattlescribeArmy(parsedText)

    console.log(res)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.allegiances).toEqual(['Barak-Mhornar, City of Shadow'])
    expect(res.selections.endless_spells).toEqual(['Lauchon the Soulseeker'])
    expect(res.selections.traits).toEqual([
      'Prosecute Wars With All Haste',
      'Seek New Prospects',
      'Who Strikes First, Strikes Hardest',
    ])
    expect(res.selections.scenery).toEqual(['Penumbral Engine'])
    expect(res.errors).toEqual([])
  })

  it('should work with KO1', () => {
    const parsedText = getFile('KO1')
    const res = getBattlescribeArmy(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.allegiances).toEqual(['Barak-Urbaz, The Market City (Skyport)'])
    expect(res.selections.commands).toEqual(['Invoke the Code', 'First Rule of Grungsson'])
    expect(res.selections.endless_spells).toEqual(['Geminids of Uhl-Gysh', 'Shards of Valagharr'])
    expect(res.selections.units).toEqual([
      'Aether-Khemist',
      'Aetheric Navigator',
      'Arkanaut Admiral',
      'Bjorgen Thundrik',
      'Brokk Grungsson, Lord-Magnate of Barak-Nar',
      'Endrinmaster',
      'Arkanaut Frigate',
      'Arkanaut Ironclad',
      'Grundstok Gunhauler',
      'Arkanaut Company',
      'Endrinriggers',
      'Grundstok Thunderers',
      'Skywardens',
      "Thundrik's Profiteers",
    ])
    expect(res.selections.battalions).toEqual([
      'Aetherstrike Force',
      'Grand Armada',
      'Grundstok Escort Wing',
      'Iron Sky Command',
      'Iron Sky Squadron',
    ])
    expect(res.selections.artifacts).toEqual([
      'Aethersight Loupe (SKY-PORT TREASURE)',
      "Gattlesson's Endless Repeater (AETHERMATIC WEAPON)",
      'Ghyrropian Gauntlets (Ghyran)',
      'The Sunderblade (Ghyran)',
      'Jade Diadem (Ghyran)',
      'Greenglade Flask (Ghyran)',
      'Staff of Ocular Optimisation (AETHERMATIC WEAPON)',
      'Malefic Skymines (GREAT ENDRINWORK)',
      'The Last Word (GREAT ENDRINWORK)',
      'Prudency Chutes (GREAT ENDRINWORK)',
    ])
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
