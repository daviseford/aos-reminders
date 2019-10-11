import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { readFileSync } from 'fs'
import { parsePdf } from 'utils/pdf/pdfUtils'
import {
  BIG_WAAAGH,
  CITIES_OF_SIGMAR,
  KHARADRON_OVERLORDS,
  NIGHTHAUNT,
  ORDER_GRAND_ALLIANCE,
  SERAPHON,
  SLAANESH,
} from 'meta/factions'

describe('getWarscrollArmyFromPdf', () => {
  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonNoMetadata.pdf', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/CoS1.pdf', 'utf8')
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
        'Warding Brand (Hallowheart)',
        'Choking Fumes (Greywater Fastness)',
        'Ignite Weapons (Hallowheart)',
        'Twin-Tailed Comet (Hammerhal)',
        'Elemental Cyclone (Hallowheart)',
        'Crystal Aegis (Hallowheart)',
        'Sear Wounds (Hallowheart)',
        'Shield of Thorns (Ghyran)',
        'Sap Strength (Anvilgard)',
      ],
      traits: [
        'Black Market Bounty (Anvilgard Battle Trait)',
        'Jutting Bones (Drakeblood Curse)',
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/BigWaaagh1.pdf', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonWithMetadata.pdf', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SlaaneshList.pdf', 'utf8')
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

  it('reads a KO warscroll pdf file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/KOList.pdf', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/OrderMeetingEngagement.pdf', 'utf8')
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

  it('reads a complex warscroll pdf file with allies correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonMultipleAllies.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    // Sisters of Slaughter is not correctly marked as an ally, so it raises an error
    expect(warscrollTxt.errors).toEqual([
      {
        text: 'Sisters of Slaughter',
        severity: 'warn',
      },
    ])

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.allyFactionNames).toEqual([
      'DAUGHTERS_OF_KHAINE',
      'KHARADRON_OVERLORDS',
      'STORMCAST_ETERNALS',
      'SYLVANETH',
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/NewFormatWithMetadata.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'SERAPHON',
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/NewFormatWithNames.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'SERAPHON',
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
    const pdfText = readFileSync(
      __dirname + '/fixtures/warscroll/pdf/NewFormatWithNamesAndMetadata.pdf',
      'utf8'
    )
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'SERAPHON',
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonNewList.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt).toEqual({
      allyFactionNames: ['STORMCAST_ETERNALS'],
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
      factionName: 'SERAPHON',
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

describe('getWarscrollArmyFromText', () => {
  it('reads a basic warscroll text file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonNoMetadata.txt', 'utf8')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

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
        'Skinks',
        'Razordons',
        'Ripperdactyl Riders',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a basic warscroll text file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonWithMetadata.txt', 'utf8')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

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
        'Skinks',
        'Razordons',
        'Ripperdactyl Riders',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a complex warscroll txt file with allies correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonMultipleAllies.txt', 'utf8')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    // Sisters of Slaughter is not correctly marked as an ally, so it raises an error
    expect(warscrollTxt.errors).toEqual([
      {
        text: 'Sisters of Slaughter',
        severity: 'warn',
      },
    ])

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.allyFactionNames).toEqual([
      'DAUGHTERS_OF_KHAINE',
      'KHARADRON_OVERLORDS',
      'STORMCAST_ETERNALS',
      'SYLVANETH',
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

  it('reads an Order meeting engagement txt file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/OrderMeetingEngagement.txt', 'utf8')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

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

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/NightHauntIssue.pdf', 'utf8')
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
      spells: [],
      traits: ['Spiteful Spirit'],
      triumphs: [],
      units: ['Lord Executioner'],
    })
  })

  it('detects and returns an error if reading a short summary txt', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/ShortSummary.txt', 'utf8')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    expect(warscrollTxt.errors).toEqual([
      {
        text:
          'Are you using the "Short" summary from Warscroll Builder? Please use the "Full" summary and try again.',
        severity: 'error',
      },
    ])
  })
})
