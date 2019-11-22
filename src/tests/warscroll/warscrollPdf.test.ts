import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import { readFileSync } from 'fs'
import { parsePdf } from 'utils/pdf/pdfUtils'
import path from 'path'
import {
  BIG_WAAAGH,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FYRESLAYERS,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  NIGHTHAUNT,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SLAANESH,
  STORMCAST_ETERNALS,
  SYLVANETH,
} from 'meta/factions'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/warscroll/pdf/${filename}`), 'utf8')
}

describe('getWarscrollArmyFromPdf', () => {
  it('reads Ossiarch Bonereapers full pdf', () => {
    const pdfText = getFile('OBR1.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('reads Fyreslayers battalions properly', () => {
    const pdfText = getFile('3droth2k.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.selections.allegiances).toEqual(['Vostarg (Lodge)'])
    expect(warscrollTxt.selections.battalions).toEqual(['Lords of the Lodge'])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('reads Ogor Mawtribes full pdf', () => {
    const pdfText = getFile('OgorMawtribes1.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(OGOR_MAWTRIBES)
    expect(warscrollTxt.selections.battalions).toContain("Kin-eater's Bully Boys")
    expect(warscrollTxt.errors).toEqual([])
  })

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = getFile('SeraphonNoMetadata.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ['Meteoric Convocation', 'Claws of Glory'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Razordons',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a CoS warscroll pdf file correctly', () => {
    const pdfText = getFile('CoS1.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.unknownSelections).toEqual([
      'Witch Rod',
      'Shield & Lance',
      'Vicious Blade & Wicked Cutlass',
    ])
    expect(warscrollTxt.selections).toEqual({
      allegiances: ['Anvilgard'],
      artifacts: [
        "Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)",
        'Armour of Mallus (Hammerhal)',
        'Whitefire Tome (Hallowheart)',
        'Asphyxica Censer (Anvilgard)',
        'Drakescale Cloak (Anvilgard)',
        "Saint's Blade (Hammerhal)",
        'Deepmire Cloak (The Living City)',
        "Patrician's Helm (Tempest's Eye)",
        'Entangling Blade (Ghyran)',
      ],
      battalions: ['Greywater Artillery Company'],
      commands: [],
      endless_spells: ['Quicksilver Swords'],
      scenery: [],
      spells: [
        "Strike of Eagles (Tempest's Eye)",
        'Choking Fumes (Greywater Fastness)',
        'Crystal Aegis (Hallowheart)',
        'Twin-Tailed Comet (Hammerhal)',
        'Sap Strength (Anvilgard)',
        'Sear Wounds (Hallowheart)',
        'Warding Brand (Hallowheart)',
        'Ignite Weapons (Hallowheart)',
        'Elemental Cyclone (Hallowheart)',
        'Shield of Thorns (Ghyran)',
      ],
      traits: [
        'Black Market Bounty (Anvilgard Battle Trait)',
        'Jutting Bones (Drakeblood Curse)',
        'Secretive Warlock (Anvilgard)',
        'Acidic Blood (Drakeblood Curse)',
        'Fell Gaze (Drakeblood Curse)',
        'Blackfang Crimelord (Anvilgard)',
      ],
      triumphs: [],
      units: [
        'Celestial Hurricanum with Celestial Battlemage',
        'Luminark of Hysh with White Battlemage',
        'Sorceress on Black Dragon',
        'Steam Tank with Commander',
        'Freeguild General on Griffon',
        'Freeguild General',
        'Nomad Prince',
        'Cogsmith',
        'Battlemage',
        'Battlemage on Griffon',
        'Black Ark Corsairs',
        'Drakespawn Chariots',
        'Dark Riders',
        'Kharibdyss',
        'War Hydra',
        'Helblaster Volley Gun',
        'Helstorm Rocket Battery',
      ],
    })
  })

  it('reads a Big Waaagh warscroll pdf file correctly', () => {
    const pdfText = getFile('BigWaaagh1.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: [
        'Amberglaive (Ghur)',
        'Savage Trophy (Bonesplitterz)',
        "Glowin' Tattooz (Bonesplitterz)",
        'Mystic Waaagh! Paint (Bonesplitterz)',
      ],
      battalions: ["Kunnin' Rukk"],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: [
        "Da Blazin' Eyes (Ironjawz)",
        'Brutal Beast Spirits (Bonesplitterz)',
        'Bone Krusha (Bonesplitterz)',
      ],
      traits: ["Fast 'Un (Ironjawz)", "Dead Kunnin' (Bonesplitterz)", "Weird 'Un (Ironjawz)"],
      triumphs: [],
      units: [
        'Gordrakk the Fist of Gork',
        'Orruk Weirdnob Shaman',
        'Savage Big Boss',
        'Wurrgog Prophet',
        'Maniak Weirdnob',
        'Orruk Ardboys',
        'Savage Boarboy Maniaks',
        'Savage Orruk Morboys',
        "Ironskull's Boyz",
      ],
    })
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'Kattanak Pelt',
      },
    ])
  })

  it('reads a warscroll pdf file with metadata correctly', () => {
    const pdfText = getFile('SeraphonWithMetadata.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ['Meteoric Convocation', 'Claws of Glory'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Razordons',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a slaanesh warscroll pdf file correctly', () => {
    const pdfText = getFile('SlaaneshList.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAANESH)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.allyFactionNames).toEqual([])
    expect(warscrollTxt.allyUnits).toEqual([])
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: [
        'Whip of Subversion (Invaders Host)',
        'The Rod of Misrule (Invaders Host)',
        'Fallacious Gift (Invaders Host)',
      ],
      battalions: ['Hedonite Host'],
      commands: [],
      endless_spells: ['Chronomantic Cogs'],
      scenery: [],
      spells: ['Phantasmagoria (Daemon)', 'Soulslice Shards (Daemon)'],
      traits: [
        'Delusions of Infallibility (Invaders Host)',
        'Inspirer (Pretenders Host)',
        'Strongest Alone (Pretenders Host)',
        'Hunter of Godbeasts (Pretenders Host)',
        'Monarch of Lies (Pretenders Host)',
      ],
      triumphs: [],
      units: [
        'Beastlord',
        'Daemon Prince',
        'Keeper of Secrets w/ Ritual Knife',
        'Lord of Chaos',
        'Viceleader, Herald of Slaanesh',
        'Cygor',
        'Ghorgon',
      ],
    })
  })

  it('reads Command Traits/Artifacts and gets the spells attached to them', () => {
    const pdfText = getFile('CommandTraitWithSpell.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.artifacts).toEqual(['Whitefire Tome (Hallowheart)'])
    expect(warscrollTxt.selections.traits).toEqual(['Secretive Warlock (Anvilgard)'])
    expect(warscrollTxt.selections.spells).toEqual([
      'Sap Strength (Anvilgard)',
      'Elemental Cyclone (Hallowheart)',
    ])
  })

  it('reads a KO warscroll pdf file correctly', () => {
    const pdfText = getFile('KOList.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.traits).toEqual([
      "FOOTNOTE: There's no Trading With Some People",
      "FOOTNOTE: There's no Reward Without Risk",
    ])
    expect(warscrollTxt.selections.units).toEqual([
      'Aether-Khemist',
      'Grundstok Thunderers',
      'Arkanaut Ironclad',
    ])
  })

  it('reads an Order meeting engagement pdf file correctly', () => {
    const pdfText = getFile('OrderMeetingEngagement.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Obstinate Blade (Order)'],
      battalions: ['Shadow Patrol'],
      commands: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: [],
      traits: ['Dauntless (Order)'],
      triumphs: [],
      units: [
        'Doomfire Warlocks',
        'Bloodwrack Medusa',
        'Khinerai Heartrenders',
        'Sisters of Slaughter',
        'Avatar of Khaine',
      ],
    })
  })

  it('reads an Ironjawz warscroll pdf correctly', () => {
    const pdfText = getFile('Ironjawz.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(IRONJAWZ)
    expect(warscrollTxt.selections).toEqual({
      allegiances: ['Da Choppas'],
      artifacts: ['Destroyer'],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: [],
      traits: ['Checked Out', "Fast 'Un"],
      triumphs: [],
      units: [
        'Gordrakk the Fist of Gork',
        'Megaboss on Maw-Krusha',
        "Ironskull's Boyz",
        'Orruk Ardboys',
        'Orruk Brutes',
        'Orruk Gore-gruntas',
      ],
    })
  })

  xit('correctly imports the Drakesworn Templar without mistaking its lance for a spell', () => {
    const pdfText = getFile('Drakesworn.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: [],
      traits: [],
      triumphs: [],
      units: ['Drakesworn Templar'],
    })
  })

  it('correctly imports the Drakesworn Templar and LAoCD together', () => {
    const pdfText = getFile('DrakeswornandLAoCD.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Storm Lance'],
      traits: [],
      triumphs: [],
      units: ['Drakesworn Templar', 'Lord-Arcanum on Celestial Dracoline'],
    })
  })

  xit('correctly imports the LAoCD and its Storm Lance spell', () => {
    const pdfText = getFile('LAoCD.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Storm Lance'],
      traits: [],
      triumphs: [],
      units: ['Lord-Arcanum on Celestial Dracoline'],
    })
  })

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = getFile('NightHauntIssue.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(NIGHTHAUNT)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Midnight Tome'],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Shademist'],
      traits: ['Spiteful Spirit'],
      triumphs: [],
      units: ['Lord Executioner'],
    })
  })

  it('reads a complex warscroll pdf file with allies correctly', () => {
    const pdfText = getFile('SeraphonMultipleAllies.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.allySelections).toEqual({
      DAUGHTERS_OF_KHAINE: {
        units: ['Sisters of Slaughter', 'Morathi, High Oracle of Khaine'],
      },
      KHARADRON_OVERLORDS: { units: ['Grundstok Gunhauler'] },
      STORMCAST_ETERNALS: { units: ['Knight-Incantor', 'Concussors'] },
      SYLVANETH: { units: ['Kurnoth Hunters'] },
    })
    expect(warscrollTxt.allyFactionNames).toEqual([
      DAUGHTERS_OF_KHAINE,
      KHARADRON_OVERLORDS,
      STORMCAST_ETERNALS,
      SYLVANETH,
    ])
    expect(warscrollTxt.allyUnits).toEqual([
      'Knight-Incantor',
      'Morathi High Oracle of Khaine',
      'Concussors',
      'Kurnoth Hunters',
      'Grundstok Gunhauler',
    ])
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Zoetic Dial'],
      battalions: ['Eternal Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: ['Walk Between Realms'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: ['Slann Starmaster', 'Bastiladon w/ Ark of Sotek'],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with stats) correctly', () => {
    const pdfText = getFile('NewFormatWithMetadata.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: [],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ['Meteoric Convocation'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordons',
          'Saurus Guard',
          'Stegadon w/ Skystreak Bow',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with character names) correctly', () => {
    const pdfText = getFile('NewFormatWithNames.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: [],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ['Meteoric Convocation'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordons',
          'Saurus Guard',
          'Stegadon w/ Skystreak Bow',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with stats and character names) correctly', () => {
    const pdfText = getFile('NewFormatWithNamesAndMetadata.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: [],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ['Meteoric Convocation'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordons',
          'Saurus Guard',
          'Stegadon w/ Skystreak Bow',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with allies) correctly', () => {
    const pdfText = getFile('SeraphonNewList.pdf')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt).toEqual({
      allyFactionNames: [STORMCAST_ETERNALS],
      allySelections: {
        STORMCAST_ETERNALS: {
          units: [
            'Celestant-Prime',
            'Knight-Vexillor',
            'Lynus Ghalmorian on Gryph Charger',
            'Concussors',
            'Evocators',
            'Celestar Ballista',
          ],
        },
      },
      allyUnits: [
        'Celestant-Prime',
        'Knight-Vexillor',
        'Lynus Ghalmorian on Gryph-Charger',
        'Concussors',
        'Evocators',
        'Aleguzzler Gargant',
        'Celestar Ballista',
        // TODO: Why is Dread Saurian here?
        'Dread Saurian',
      ],
      errors: [],
      factionName: SERAPHON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Blade of Realities'],
        battalions: [],
        commands: [],
        endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
        scenery: [],
        spells: [],
        traits: ['Disciplined Fury'],
        triumphs: [],
        units: [
          'Engine of the Gods',
          'Chameleon Skinks',
          'Saurus Warriors',
          'Bastiladon w/ Solar Engine',
          'Bastiladon w/ Ark of Sotek',
          'Dread Saurian',
        ],
      },
      unknownSelections: ['Meteoric Standard', 'Clubs'],
    })
  })
})
