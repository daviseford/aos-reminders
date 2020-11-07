import { SeraphonConstellations } from 'army/seraphon/allegiances'
import { readFileSync } from 'fs'
import {
  BIG_WAAAGH,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DESTRUCTION_GRAND_ALLIANCE,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LUMINETH_REALMLORDS,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SONS_OF_BEHEMAT,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { CHAMON, GHUR } from 'types/realmscapes'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/warscroll/pdf/${filename}.pdf`), 'utf8')
}

describe('getWarscrollArmyFromPdf', () => {
  it('should correctly read Tzeentch1', () => {
    const pdfText = getFile('Tzeentch1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.allegiances).toContain('Eternal Conflagration')
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB3', () => {
    const pdfText = getFile('SoB3')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB2', () => {
    const pdfText = getFile('SoB2')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.selections.allegiances).toEqual(['Breaker Tribe'])
    expect(res.selections.traits).toEqual([
      "Shiny 'Uns (Fierce Loathing)",
      'Extremely Bitter (Breaker Tribe)',
    ])
    expect(res.selections.artifacts).toEqual([
      'Enchanted Portcullis (Breaker Tribe)',
      'Incandescent Rageblade (Aqshy)',
      'The Great Wrecka (Breaker Tribe)',
      'Kingslaughter Cowl (Breaker Tribe)',
    ])
    expect(res.selections.units).toEqual(['Gatebreaker', 'Kraken-Eater', 'Warstomper', 'Mancrusher Gargants'])
    expect(res.errors).toEqual([])
  })

  it('should correctly read SoB1', () => {
    const pdfText = getFile('SoB1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.selections.allegiances).toEqual(['Taker Tribe'])
    expect(res.selections.units).toEqual(['Gatebreaker', 'Kraken-Eater', 'Warstomper', 'Mancrusher Gargants'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Bonegrinder Mega-Gargant',
      },
    ])
  })

  it('should correctly read Warscroll_Builder_Order_Legacy', () => {
    const pdfText = getFile('Warscroll_Builder_Order_Legacy')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.errors).toEqual([])
  })

  it('correctly reads Lumineth1', () => {
    const pdfText = getFile('Lumineth1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.selections.units).toContain('Archmage Teclis')
    expect(res.selections.spells).toContain('Etheral Blessings')
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)

    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: LUMINETH_REALMLORDS,
      origin_realm: GHUR,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Syar'],
        artifacts: ["Predator's Torc (Ghur)", 'Hearthstone Amulet', 'Syari Trueblade (Hysh)'],
        battalions: ['Alarith Temple', 'Auralan Legion', 'Dawnrider Lance', 'Teclian Vanguard'],
        commands: [
          'Deplete Reserves',
          'Unshakeable Faith of the Mountains',
          'Unflinching Valour',
          'Faith of the Mountains',
        ],
        endless_spells: ['Hyshian Twinstones', 'Soulscream Bridge', 'Shards of Valagharr'],
        scenery: [],
        spells: [
          'Etheral Blessings',
          'Voice of the Mountains',
          'Living Fissure',
          'Entomb',
          'Solar Flare',
          'Lambent Light',
          'Speed of Hysh',
          'Total Eclipse',
          'Protection of Teclis',
          'Storm of Searing White Light',
          'Gravitic Reduction',
          'Darkness of the Soul',
          'Power of Hysh',
        ],
        traits: ['Loremaster - Alarith', 'Goading Arrogance'],
        triumphs: [],
        units: [
          'Archmage Teclis',
          'Alarith Stonemage',
          'Avalenor, the Stoneheart King',
          'Scinari Cathallar',
          'The Light of Eltharion',
          'Vanari Auralan Sentinels',
          'Alarith Stoneguard',
          'Vanari Auralan Wardens',
          'Vanari Dawnriders',
          'Alarith Spirit of the Mountain',
        ],
      },
      unknownSelections: ['Stone Mallets', 'Diamondpick Hammers'],
    })
    expect(res.errors).toEqual([])
  })
  it("correctly imports Braum's list", () => {
    const pdfText = getFile('BraumSeraphonTTSList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.selections.allegiances).toContain(SeraphonConstellations.STARBORNE)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.FANGS_OF_SOTEK)
    expect(res.selections.units).toContain('Lord Kroak')
    expect(res.selections.units).toContain('Saurus Astrolith Bearer')
    expect(res.selections.units).toContain('Engine of the Gods')
    expect(res.selections.units).toContain('Saurus Knights')
    expect(res.selections.units).toContain('Saurus Warriors')
    expect(res.selections.units).toContain('Razordon Hunting Pack')
    expect(res.selections.units).toContain('Stegadon')
    expect(res.selections.spells).toContain('Stellar Tempest')
    expect(res.selections.artifacts).toContain('Incandescent Rectrices')
    expect(res.realmscape).toBeNull()
    expect(res.errors).toEqual([])
  })

  it('imports new Seraphon armies correctly', () => {
    const pdfText = getFile('NewSeraphon')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      origin_realm: CHAMON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Starborne'],
        artifacts: [
          'Cloak of Feathers',
          'Incandescent Rectrices',
          'Bloodrage Pendant',
          'Blade of Realities',
          'Sigils of the Prime Hunter',
          'Sacred Stegadon Helm',
          'Itxi Grubs',
          'Plaque of Dominion',
          'Throne of the Lost Gods',
        ],
        battalions: [
          'Eternal Starhost',
          'Eternal Temple-host',
          'Firelance Starhost',
          'Firelance Temple-host',
          'Shadowstrike Starhost',
          'Shadowstrike Temple-host',
          'Sunclaw Starhost',
          'Sunclaw Temple-host',
          'Thunderquake Starhost',
          'Thunderquake Temple-host',
        ],
        commands: [
          'Gift from the Heavens',
          'Ripperdactyl Assault',
          'Prime Guardian',
          'Wrath of the Seraphon',
          'Saurian Savagery',
          'Scent of Weakness',
          'Herald of the Old Ones',
          'Coordinated Strike',
          'Coordinated Attack',
        ],
        endless_spells: [
          'Aethervoid Pendulum',
          'Balewind Vortex',
          'Bound Aethervoid Pendulum',
          'Bound Balewind Vortex',
          'Bound Chronomantic Cogs',
          'Bound Emerald Lifeswarm',
          'Bound Geminids of Uhl-Gysh',
          'Bound Malevolent Maelstrom',
          'Bound Prismatic Palisade',
          'Bound Purple Sun of Shyish',
          'Bound Quicksilver Swords',
          "Bound Ravenak's Gnashing Jaws",
          'Bound Soulsnare Shackles',
          'Bound Suffocating Gravetide',
          'Bound Burning Head',
          'Bound Umbral Spellportal',
        ],
        scenery: [],
        spells: [
          'Mystical Unforging',
          'Extend Astromatrix',
          'Bind Endless Spell',
          'Walk Between Realms',
          'Drain Magic',
          'Celestial Apotheosis',
          "Comet's Call",
          'Celestial Deliverance',
          'Blazing Starlight',
          'Control Fate',
        ],
        traits: ['Mighty Warleader'],
        triumphs: [],
        units: [
          'Engine of the Gods',
          'Lord Kroak',
          'Ripperdactyl Chief',
          'Saurus Astrolith Bearer',
          'Saurus Eternity Warden',
          'Saurus Oldblood',
          'Saurus Oldblood on Carnosaur',
          'Saurus Scar-Veteran on Carnosaur',
          'Saurus Scar-Veteran on Cold One',
          'Saurus Sunblood',
          'Skink Oracle on Troglodon',
          'Skink Priest',
          'Skink Starpriest',
          'Skink Starseer',
          'Slann Starmaster',
          'Stegadon with Skink Chief',
          'Terradon Chief',
          'Chameleon Skinks',
          'Kroxigor',
          'Razordon Hunting Pack',
          'Ripperdactyl Riders',
          'Salamander Hunting Pack',
          'Saurus Guard',
          'Saurus Knights',
          'Saurus Warriors',
          'Skinks',
          'Terradon Riders',
          'Bastiladon',
          'Dread Saurian',
          'Stegadon',
        ],
      },
      unknownSelections: [
        'Suntooth Maul',
        'Warblade',
        'Blades',
        'Meteoric Javelins Celestite Daggers & Star Bucklers',
        'Starstrike Javelins',
        'Ark of Sotek',
        'Sunfire Throwers',
        'Thunder Lizard)',
      ],
    })
    expect(res.errors).toEqual([])
  })

  it('does not import the wrong trait (issue #863)', () => {
    const pdfText = getFile('BloodVulture')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.traits).not.toContain("Blood Vulture's Gaze")
    expect(res.selections.traits).toEqual(['Metalcruncher'])
    expect(res.errors).toEqual([])
  })

  it('imports Seraphon Constellations properly', () => {
    const pdfText = getFile('1000-Firelance_Starhost')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.DRACOTHIONS_TAIL)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.STARBORNE)
    expect(res.errors).toEqual([])
  })

  it('imports Seraphon Constellations properly', () => {
    const pdfText = getFile('1000-Sunclaw_Temple-host')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.KOATLS_CLAW)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.COALESCED) // auto-added because of Koatl's Claw
    expect(res.errors).toEqual([])
  })

  it('reads 2020 KO pdf', () => {
    const pdfText = getFile('KO_2020')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'KHARADRON_OVERLORDS',
      origin_realm: 'Ghur',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Barak-Zilfin, The Windswept City (Skyport)'],
        artifacts: [
          'Spell in a Bottle',
          'Proclamator Mask-hailer',
          'Miniaturised Aethermatic Repulsion Field',
          'Seismic Shock-gauntlets',
          'Cyclonic Aethometer',
          "Svaregg-Stein 'Illuminator' Flarepistol",
          'Voidstone Orb',
          'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)',
          "Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)",
          "Coalbeard's Collapsible Compartments (Great Endrinwork)",
          'Prudency Chutes (Great Endrinwork)',
          "Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)",
          'The Last Word (Great Endrinwork)',
          "Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)",
          'Staff of Ocular Optimisation',
        ],
        battalions: [
          'Grand Armada',
          'Grundstok Escort Wing',
          'Intrepid Prospectors',
          'Iron Sky Attack Squadron',
          'Iron Sky Command',
        ],
        commands: [
          'Master of the Skies',
          'On My Mark, Fire!',
          'Repel Boarders!',
          'Up And At Them!',
          'First Rule of Grungsson',
          'By Grungni, I Have My Eye On You!',
        ],
        endless_spells: [],
        scenery: [],
        spells: [],
        traits: [
          'Grudgebearer',
          'ARTYCLE: Master the Skies',
          'AMENDMENT: Trust to Your Guns',
          'FOOTNOTE: Show Them Your Steel',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
          'Master Commander',
        ],
        triumphs: [],
        units: [
          'Aether-Khemist',
          'Aetheric Navigator',
          'Arkanaut Admiral',
          'Bjorgen Thundrik',
          'Brokk Grungsson, Lord-Magnate of Barak-Nar',
          'Endrinmaster with Dirigible Suit',
          'Endrinmaster with Endrinharness',
          'Arkanaut Company',
          'Endrinriggers',
          'Grundstok Gunhauler',
          'Grundstok Thunderers',
          'Skywardens',
          "Thundrik's Profiteers",
          'Arkanaut Frigate',
          'Arkanaut Ironclad',
        ],
      },
      unknownSelections: [
        'Skypikes',
        'Skyhooks',
        'Drill Launcher',
        'Grapnel Launchers',
        'Drill Cannon',
        'Heavy Skyhook',
        'Barak Zilfin)',
      ],
    })
    expect(res.errors).toEqual([])
  })

  it('reads Warpcog Convocation correctly with no errors', () => {
    const pdfText = getFile('WarpcogList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.battalions).toEqual([
      'Warpcog Convocation',
      'Rattlegauge Warplock (Enginecoven)',
      'Gascloud Chokelung (Enginecoven)',
    ])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Lens of Refraction',
      },
    ])
  })

  it('does not include Quicksilver Swords via unknownSelections', () => {
    const pdfText = getFile('KhorneDaemonPrincewithSword')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.units).toEqual(['Daemon Prince'])
    expect(res.selections.endless_spells).toEqual([])
    expect(res.errors).toEqual([])
  })

  it('reads Ossiarch Bonereapers full pdf', () => {
    const pdfText = getFile('OBR1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('reads deprecated KO pdf (issue #794)', () => {
    const pdfText = getFile('skydorfs')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Aethershock Earbuster',
        },
        {
          severity: 'warn',
          text: 'Aetherspheric Endrins',
        },
      ],
      factionName: 'KHARADRON_OVERLORDS',
      origin_realm: CHAMON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Barak-Zilfin, The Windswept City (Skyport)'],
        artifacts: ['Staff of Ocular Optimisation'],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: [],
        traits: [
          "FOOTNOTE: There's No Trading With Some People",
          'Cunning Fleetmaster',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
          'ARTYCLE: Master the Skies',
          'Master Commander',
        ],
        triumphs: [],
        units: [
          'Aether-Khemist',
          'Aetheric Navigator',
          'Arkanaut Company',
          'Grundstok Thunderers',
          'Endrinriggers',
          'Skywardens',
          'Arkanaut Frigate',
          'Arkanaut Ironclad',
        ],
      },
      unknownSelections: [],
    })
  })

  // TODO: Fix
  xit('reads Fyreslayers battalions properly', () => {
    const pdfText = getFile('3droth2k')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.allegiances).toEqual(['Vostarg (Lodge)'])
    expect(res.selections.battalions).toEqual(['Lords of the Lodge'])
    expect(res.errors).toEqual([])
  })

  it('reads Ogor Mawtribes full pdf', () => {
    const pdfText = getFile('OgorMawtribes1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.battalions).toContain("Kin-eater's Bully Boys")
    expect(res.errors).toEqual([])
  })

  it('reads a unit with ignored unknown selections', () => {
    const pdfText = getFile('IgnoreUnknown')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    expect(res.selections.endless_spells).toEqual([])
    expect(res.selections.artifacts).toEqual([])
    expect(res.unknownSelections).toEqual([])
    expect(res.errors).toEqual([])
  })

  it('reads a Nurgle PDF with a Skaven battalion', () => {
    const pdfText = getFile('NurgleWithSkavenBattalion')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res).toEqual({
      allyFactionNames: ['SKAVEN'],
      allySelections: { [SKAVEN]: { battalions: ['Congregation of Filth'], units: [] } },
      allyUnits: [],
      errors: [],
      factionName: 'NURGLE',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: [],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: ['Miasma of Pestilence'],
        traits: [],
        triumphs: [],
        units: ['Bloab Rotspawned', 'Chaos Chariots', 'Plague Censer Bearers'],
      },
      unknownSelections: [],
    })

    expect(res.errors).toEqual([])
  })

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = getFile('SeraphonNoMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: ['Gift from the Heavens'],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ["Comet's Call", 'Blazing Starlight'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon',
      ],
    })
  })

  it('reads a CoS warscroll pdf file correctly', () => {
    const pdfText = getFile('CoS1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.origin_realm).toEqual(null)
    expect(res.errors).toEqual([])
    expect(res.unknownSelections).toEqual([])
    expect(res.selections).toEqual({
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
      ],
      battalions: ['Greywater Artillery Company'],
      commands: [
        'Make an Example of the Weak',
        'Command Underlings',
        'Inspire Hatred',
        'Target Sighted',
        'Rousing Battle Cry',
        'Hold the Line',
        'Lord of the Deepwood Host',
        'Feast of Bones',
      ],
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
        'Chain Lightning (Azyr)',
        'Comet of Casandora',
        'Burning Gaze',

        'Bladewind',
        'Shield of Thorns (Ghyran)',
        'Amber Spear',
        'Wildform (Ghur)',
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
        'Battlemage (Ghyran)',
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
    const pdfText = getFile('BigWaaagh1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [
        'Savage Trophy (Bonesplitterz)',
        "Glowin' Tattooz (Bonesplitterz)",
        'Mystic Waaagh! Paint (Bonesplitterz)',
      ],
      battalions: ["Kunnin' Rukk"],
      commands: ['Voice of Gork', 'Savage Attack'],
      endless_spells: [],
      scenery: [],
      spells: [
        "Da Blazin' Eyes (Ironjawz)",
        'Brutal Beast Spirits (Bonesplitterz)',
        'Bone Krusha (Bonesplitterz)',
        'Green Puke',
        'Fists of Gork',
        'Bone Spirit',
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
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Amberglaive',
      },
      {
        severity: 'warn',
        text: 'Kattanak Pelt',
      },
    ])
  })

  it('reads a warscroll pdf file with metadata correctly', () => {
    const pdfText = getFile('SeraphonWithMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: ['Gift from the Heavens'],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ["Comet's Call", 'Blazing Starlight'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon',
      ],
    })
  })

  it('reads a slaanesh warscroll pdf file correctly', () => {
    const pdfText = getFile('SlaaneshList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SLAANESH)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Lord of Chaos',
      },
    ])
    expect(res.allyFactionNames).toEqual([])
    expect(res.allyUnits).toEqual([])
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [
        'Whip of Subversion (Invaders)',
        'The Rod of Misrule (Invaders)',
        'Fallacious Gift (Invaders)',
      ],
      battalions: ['Hedonite Host'],
      commands: ['Grisly Trophy', 'Revel in Agony: Slaanesh', 'Excess of Violence'],
      endless_spells: ['Chronomantic Cogs'],
      scenery: [],
      spells: ['Phantasmagoria (Daemon)', 'Soulslice Shards (Daemon)', 'Cacophonic Choir', 'Acquiescence'],
      traits: [
        'Delusions of Infallibility (Invaders)',
        'Inspirer (Pretenders)',
        'Strongest Alone (Pretenders)',
        'Hunter of Godbeasts (Pretenders)',
        'Monarch of Lies (Pretenders)',
      ],
      triumphs: [],
      units: [
        'Beastlord',
        'Daemon Prince',
        'Keeper of Secrets w/ Ritual Knife',
        'Viceleader, Herald of Slaanesh',
        'Cygor',
        'Ghorgon',
      ],
    })
  })

  it('reads Command Traits/Artifacts and gets the spells attached to them', () => {
    const pdfText = getFile('CommandTraitWithSpell')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.errors).toEqual([])
    expect(res.selections.artifacts).toEqual(['Whitefire Tome (Hallowheart)'])
    expect(res.selections.traits).toEqual(['Secretive Warlock (Anvilgard)'])
    expect(res.selections.spells).toEqual(['Sap Strength (Anvilgard)', 'Elemental Cyclone (Hallowheart)'])
  })

  it('reads a deprecated KO warscroll pdf file correctly', () => {
    const pdfText = getFile('KOList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aethershock Earbuster',
      },
      {
        severity: 'warn',
        text: 'Stickler for the Code',
      },
    ])
    expect(res.selections.traits).toEqual([
      "FOOTNOTE: There's No Reward Without Risk",
      "FOOTNOTE: There's No Trading With Some People",
      "FOOTNOTE: There's Always a Breeze if You Look for it",
      "AMENDMENT: Don't Argue With the Wind",
      'ARTYCLE: Master the Skies',
      'Master Commander',
    ])
    expect(res.selections.units).toEqual(['Aether-Khemist', 'Grundstok Thunderers', 'Arkanaut Ironclad'])
  })

  it('reads an Order meeting engagement pdf file correctly', () => {
    const pdfText = getFile('OrderMeetingEngagement')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(res.errors).toEqual([])
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Obstinate Blade (Order)'],
      battalions: ['Shadow Patrol'],
      commands: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: ['Doomfire', 'Enfeebling Foe'],
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
    const pdfText = getFile('Ironjawz')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections).toEqual({
      allegiances: ['Da Choppas'],
      artifacts: ['Destroyer', 'Megaskull Staff'],
      battalions: [],
      commands: ['Rabble Rouser', 'Voice of Gork', 'Go on Ladz, Get Stuck In!'],
      endless_spells: [],
      scenery: [],
      spells: [],
      traits: ["Fast 'Un", 'Checked Out'],
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

  it('correctly imports the Drakesworn Templar without mistaking its lance for a spell', () => {
    const pdfText = getFile('Drakesworn')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections).toEqual({
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
    const pdfText = getFile('DrakeswornandLAoCD')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: ['Pack Alpha'],
      endless_spells: [],
      scenery: [],
      spells: ['Storm Lance'],
      traits: [],
      triumphs: [],
      units: ['Drakesworn Templar', 'Lord-Arcanum on Celestial Dracoline'],
    })
  })

  it('correctly imports the LAoCD and its Storm Lance spell', () => {
    const pdfText = getFile('LAoCD')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: ['Pack Alpha'],
      endless_spells: [],
      scenery: [],
      spells: ['Storm Lance'],
      traits: [],
      triumphs: [],
      units: ['Lord-Arcanum on Celestial Dracoline'],
    })
  })

  it('correctly imports the Loonboss and its command ability', () => {
    const pdfText = getFile('Loonboss')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      scenery: [],
      spells: [],
      traits: [],
      triumphs: [],
      units: ['Loonboss'],
    })
  })

  it('adds the command ability that the Boss Shaman trait gives you', () => {
    const pdfText = getFile('BossShaman')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: [],
      battalions: [],
      commands: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      scenery: [],
      spells: ['Spore Maws'],
      traits: ['Boss Shaman'],
      triumphs: [],
      units: ['Fungoid Cave-Shaman'],
    })
  })

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = getFile('NightHauntIssue')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.selections).toEqual({
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
    const pdfText = getFile('SeraphonMultipleAllies')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.errors).toEqual([])
    expect(res.factionName).toEqual(SERAPHON)
    expect(res.allySelections).toEqual({
      DAUGHTERS_OF_KHAINE: {
        battalions: [],
        units: ['Sisters of Slaughter', 'Morathi, High Oracle of Khaine'],
      },
      KHARADRON_OVERLORDS: { battalions: [], units: ['Grundstok Gunhauler'] },
      STORMCAST_ETERNALS: { battalions: [], units: ['Knight-Incantor', 'Concussors'] },
      SYLVANETH: { battalions: [], units: ['Kurnoth Hunters'] },
    })
    expect(res.allyFactionNames).toEqual([
      DAUGHTERS_OF_KHAINE,
      KHARADRON_OVERLORDS,
      STORMCAST_ETERNALS,
      SYLVANETH,
    ])
    expect(res.allyUnits).toEqual([
      'Knight-Incantor',
      'Morathi High Oracle of Khaine',
      'Concussors',
      'Kurnoth Hunters',
      'Grundstok Gunhauler',
    ])
    expect(res.selections).toEqual({
      allegiances: [],
      artifacts: ['Zoetic Dial'],
      battalions: ['Eternal Starhost'],
      commands: ['Gift from the Heavens'],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: ['Walk Between Realms', "Comet's Call"],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: ['Slann Starmaster', 'Bastiladon'],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with stats) correctly', () => {
    const pdfText = getFile('NewFormatWithMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Meteoric Convocation',
        },
        {
          severity: 'warn',
          text: 'Razordons',
        },
      ],
      factionName: SERAPHON,
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ["Comet's Call", 'Celestial Deliverance'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Saurus Guard',
          'Stegadon',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with character names) correctly', () => {
    const pdfText = getFile('NewFormatWithNames')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Meteoric Convocation',
        },
        {
          severity: 'warn',
          text: 'Razordons',
        },
      ],
      factionName: SERAPHON,
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ["Comet's Call", 'Celestial Deliverance'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Saurus Guard',
          'Stegadon',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with stats and character names) correctly', () => {
    const pdfText = getFile('NewFormatWithNamesAndMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Meteoric Convocation',
        },
        {
          severity: 'warn',
          text: 'Razordons',
        },
      ],
      factionName: SERAPHON,
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        commands: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        scenery: ['Penumbral Engine'],
        spells: ["Comet's Call", 'Celestial Deliverance'],
        traits: ['Master of Star Rituals'],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Saurus Guard',
          'Stegadon',
        ],
      },
      unknownSelections: [],
    })
  })

  it('reads a new (10/7/19) warscroll pdf file (with allies) correctly', () => {
    const pdfText = getFile('SeraphonNewList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res).toEqual({
      allyFactionNames: [STORMCAST_ETERNALS],
      allySelections: {
        STORMCAST_ETERNALS: {
          battalions: [],
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
      origin_realm: 'Ghyran',
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
        units: ['Engine of the Gods', 'Chameleon Skinks', 'Saurus Warriors', 'Bastiladon', 'Dread Saurian'],
      },
      unknownSelections: ['Solar Engine', 'Ark of Sotek'],
    })
  })

  it('imports blue horrors as horrors (issue #907)', () => {
    const pdfText = getFile('BlueHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })

  it('imports brimstone horrors as horrors (issue #907)', () => {
    const pdfText = getFile('BrimstoneHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })

  it('imports pink horrors as horrors (issue #907)', () => {
    const pdfText = getFile('PinkHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })
})
