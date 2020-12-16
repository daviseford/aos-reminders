import { readFileSync } from 'fs'
import {
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DESTRUCTION_GRAND_ALLIANCE,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LUMINETH_REALMLORDS,
  MEGA_GARGANT_MERCENARIES,
  NIGHTHAUNT,
  NURGLE,
  OGOR_MAWTRIBES,
  ORDER_GRAND_ALLIANCE,
  ORRUK_WARCLANS,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVENTIDE,
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
  it('should correctly read StormcastStormkeep1', () => {
    const pdfText = getFile('StormcastStormkeep1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res).toEqual({
      allyFactionNames: [MEGA_GARGANT_MERCENARIES],
      allySelections: {
        [MEGA_GARGANT_MERCENARIES]: { battalions: [], units: ['Bundo Whalebiter - Kraken-Eater'] },
      },
      allyUnits: ['Bundo Whalebiter'],
      errors: [],
      factionName: STORMCAST_ETERNALS,
      subFactionName: 'Celestial Senitels',
      origin_realm: 'Ghur',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: ['Hammers of Sigmar (Stormhost)'],
        artifacts: [
          'Scroll of Condemnation',
          'Staff of Focus',
          'Hammer of Might',
          'Blade of Heroes',
          'Gift of the Six Smiths',
          'Staff of Azyr',
          'Scroll of Unravelling',
          'God-forged Blade',
        ],
        battalions: [
          'Stormkeep Patrol',
          'Soulstrike Brotherhood',
          'Stormtower Garrison',
          'Stormkeep Brotherhood',
          'Skyborne Slayers',
          'Cleansing Phalanx',
          'Wardens of the Stormkeep',
        ],
        command_abilities: [
          'Furious Retribution',
          'Soul of the Stormhost',
          'Soul Energy of the First Host',
          'Vengeful Determination',
          'Sombre Exemplar',
        ],
        endless_spells: ['The Burning Head'],
        mount_traits: ['Savage Loyalty', 'Keen-clawed', 'Thunder Caller', 'Lithe-Limbed'],
        prayers: [],
        scenery: [],
        spells: [
          'Terrifying Aspect',
          'Azyrite Halo',
          'Lightning Blast',
          'Celestial Blades',
          'Empower',
          'Lightning Pulse',
          'Healing Light',
          'Amethyst Gale',
        ],
        command_traits: ['We Cannot Fail'],
        triumphs: [],
        units: [
          'Astreia Solbright',
          'Errant-Questor',
          'Knight-Questor',
          'Lord-Arcanum on Gryph-Charger',
          'Neave Blacktalon',
          'Vandus Hammerhand',
          'Lynus Ghalmorian on Gryph Charger',
          'Evocators on Celestial Dracolines',
          'Vanguard-Raptors with Longstrike Crossbows',
          'The Farstriders',
          'Prosecutors with Celestial Hammers',
          'Decimators',
          'Celestar Ballista',
          'Lord-Veritant',
          'Gryph-Hounds',
          'Vanguard-Hunters',
          'Castigators',
          'Knight-Vexillor',
          'Liberators',
          'Lord-Celestant',
          'Judicators',
          'Protectors',
          'Evocators',
          'Sequitors',
        ],
      },
      unknownSelections: [],
    })
    expect(res.errors).toEqual([])
  })

  it('should correctly read Tzeentch1', () => {
    const pdfText = getFile('Tzeentch1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('Eternal Conflagration')
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
    expect(res.selections.flavors).toEqual(['Breaker Tribe'])
    expect(res.selections.command_traits).toEqual([
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
    expect(res.selections.flavors).toEqual(['Taker Tribe'])
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
      subFactionName: '',
      origin_realm: GHUR,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: ['Syar'],
        artifacts: [
          "Mountain's Gift",
          'Simulacra Amulet',
          "Predator's Torc (Ghur)",
          'Hearthstone Amulet',
          'The Perfect Blade',
        ],
        battalions: ['Alarith Temple', 'Auralan Legion', 'Dawnrider Lance', 'Teclian Vanguard'],
        command_abilities: [
          'Deplete Reserves',
          'Unshakeable Faith of the Mountains',
          'Unflinching Valour',
          'Faith of the Mountains',
        ],
        endless_spells: ['Hyshian Twinstones', 'Soulscream Bridge', 'Shards of Valagharr'],
        mount_traits: [],
        prayers: [],
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
          'Gravitic Reduction',
          'Darkness of the Soul',
          'Power of Hysh',
          'Protection of Teclis',
          'Storm of Searing White Light',
        ],
        command_traits: ['Loremaster - Alarith', 'Goading Arrogance'],
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
      unknownSelections: [],
    })
    expect(res.errors).toEqual([])
  })
  it("correctly imports Braum's list", () => {
    const pdfText = getFile('BraumSeraphonTTSList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.subFactionName).toEqual('Starborne')
    expect(res.selections.flavors).toContain('Fangs of Sotek')
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
      errors: [
        // These battalions aren't valid/present in a Starborne army
        {
          severity: 'warn',
          text: 'Eternal Temple-host',
        },
        {
          severity: 'warn',
          text: 'Firelance Temple-host',
        },
        {
          severity: 'warn',
          text: 'Shadowstrike Temple-host',
        },
        {
          severity: 'warn',
          text: 'Sunclaw Temple-host',
        },
        {
          severity: 'warn',
          text: 'Thunderquake Temple-host',
        },
      ],
      factionName: SERAPHON,
      subFactionName: 'Starborne',
      origin_realm: CHAMON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
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
          'Firelance Starhost',
          'Shadowstrike Starhost',
          'Sunclaw Starhost',
          'Thunderquake Starhost',
        ],
        command_abilities: [
          'Prime Guardian',
          'Gift from the Heavens',
          'Ripperdactyl Assault',
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
        flavors: [],
        mount_traits: [],
        prayers: [],
        scenery: [],
        spells: [
          'Mystical Unforging',
          'Extend Astromatrix',
          'Bind Endless Spell',
          'Walk Between Realms',
          'Drain Magic',
          'Celestial Apotheosis',
          'Celestial Deliverance',
          "Comet's Call",
          'Blazing Starlight',
          'Control Fate',
        ],
        command_traits: ['Mighty Warleader'],
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
      unknownSelections: [],
    })
  })

  it('does not import the wrong trait (issue #863)', () => {
    const pdfText = getFile('BloodVulture')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.command_traits).not.toContain("Blood Vulture's Gaze")
    expect(res.selections.mount_traits).toContain('Metalcruncher')
    expect(res.errors).toEqual([])
  })

  it('imports Seraphon Constellations properly', () => {
    const pdfText = getFile('1000-Firelance_Starhost')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.flavors).toContain("Dracothion's Tail")
    expect(res.subFactionName).toEqual('Starborne')
    expect(res.errors).toEqual([])
  })

  it('imports Seraphon Constellations properly (1)', () => {
    const pdfText = getFile('1000-Sunclaw_Temple-host')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.flavors).toContain("Koatl's Claw")
    expect(res.subFactionName).toEqual('Coalesced') // auto-added because of Koatl's Claw
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
      factionName: KHARADRON_OVERLORDS,
      subFactionName: '',
      origin_realm: 'Ghur',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: ['Barak-Zilfin, The Windswept City (Skyport)'],
        artifacts: [
          'Spell in a Bottle',
          'Aethercharged Rune',
          'Proclamator Mask-hailer',
          'Miniaturised Aethermatic Repulsion Field',
          'Seismic Shock-gauntlets',
          'Cyclonic Aethometer',
          "Svaregg-Stein 'Illuminator' Flarepistol",
          'Voidstone Orb',
          'Staff of Ocular Optimisation',
          'Aethersped Hammer',
          'Galeforce Stave',
          'Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)',
          "Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)",
          "Coalbeard's Collapsible Compartments (Great Endrinwork)",
          'Breath of Morgrim',
          'Prudency Chutes (Great Endrinwork)',
          "Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)",
          'The Last Word (Great Endrinwork)',
          "Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)",
        ],
        battalions: [
          'Grand Armada',
          'Grundstok Escort Wing',
          'Intrepid Prospectors',
          'Iron Sky Attack Squadron',
          'Iron Sky Command',
        ],
        command_abilities: [
          'Master of the Skies',
          'On My Mark, Fire!',
          'Repel Boarders!',
          'Up And At Them!',
          'First Rule of Grungsson',
          'By Grungni, I Have My Eye On You!',
        ],
        endless_spells: [],
        mount_traits: [],
        prayers: [],
        scenery: [],
        spells: [],
        command_traits: [
          'ARTYCLE: Master the Skies',
          'AMENDMENT: Trust to Your Guns',
          'FOOTNOTE: Show Them Your Steel',
          'Grudgebearer',
          'Master Commander',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
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
      unknownSelections: [],
    })
    expect(res.errors).toEqual([])
  })

  it('reads Warpcog Convocation correctly with no errors', () => {
    const pdfText = getFile('WarpcogList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVENTIDE)
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
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Arkhan the Black, Mortarch of Sacrament can belong to Legions Of Nagash or Legion Of Grief. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Nagash, Supreme Lord of the Undead can belong to Legions Of Nagash or Legion Of Grief. Please add this unit manually.',
      },
    ])
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
          text: 'Aetherspheric Endrinds',
        },
      ],
      factionName: KHARADRON_OVERLORDS,
      subFactionName: '',
      origin_realm: CHAMON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: ['Barak-Zilfin, The Windswept City (Skyport)'],
        artifacts: ['Staff of Ocular Optimisation'],
        battalions: [],
        command_abilities: [],
        endless_spells: [],
        scenery: [],
        spells: [],
        mount_traits: [],
        prayers: [],
        command_traits: [
          "FOOTNOTE: There's No Trading With Some People",
          'Cunning Fleetmaster',
          'Master Commander',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
          'ARTYCLE: Master the Skies',
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
    expect(res.selections.flavors).toEqual(['Vostarg (Lodge)'])
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
      allyFactionNames: [SKAVENTIDE],
      allySelections: { [SKAVENTIDE]: { battalions: ['Congregation of Filth'], units: [] } },
      allyUnits: [],
      errors: [],
      factionName: NURGLE,
      subFactionName: '',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        artifacts: [],
        battalions: [],
        command_abilities: [],
        endless_spells: [],
        flavors: [],
        mount_traits: [],
        prayers: [],
        scenery: [],
        spells: ['Miasma of Pestilence'],
        command_traits: [],
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
      flavors: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      command_abilities: ['Gift from the Heavens'],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Celestial Deliverance', 'Blazing Starlight'],
      command_traits: ['Great Rememberer'],
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
      flavors: ['Anvilgard'],
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
      command_abilities: [
        'Make an Example of the Weak (Anvilgard)',
        'Command Underlings',
        'Inspire Hatred',
        'Target Sighted',
        'Rousing Battle Cry',
        'Hold the Line',
        'Lord of the Deepwood Host',
        'Feast of Bones',
      ],
      endless_spells: ['Quicksilver Swords'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [
        "Strike of Eagles (Tempest's Eye)",
        'Choking Fumes (Greywater Fastness)',
        'Crystal Aegis (Hallowheart)',
        'Twin-Tailed Comet (Hammerhal)',
        'Sap Strength (Anvilgard, Har Kuron)',
        'Sear Wounds (Hallowheart)',
        'Comet of Casandora',
        'Chain Lightning (Azyr)',
        'Burning Gaze',
        'Bladewind',
        'Wings of Fire (Hammerhal)',
        'Cindercloud (Hammerhal)',
        'Lifesurge (The Living City)',
        'Cage of Thorns (The Living City)',
        'Ironoak Skin (The Living City)',
        'Descending Ash Cloud (Greywater Fastness)',
        'Eroding Blast (Greywater Fastness)',
        'Amber Tide (The Phoenicium)',
        'Phoenix Cry (The Phoenicium)',
        'Golden Mist (The Phoenicium)',
        'Shadow Daggers (Anvilgard, Har Kuron)',
        'Vitriolic Spray (Anvilgard, Har Kuron)',
        'Roaming Wildfire (Hallowheart)',
        'Elemental Cyclone (Hallowheart)',
        'Warding Brand (Hallowheart)',
        'Ignite Weapons (Hallowheart)',
        "Aura of Glory (Tempest's Eye)",
        "Celestial Visions (Tempest's Eye)",
        'The Withering (Har Kuron)',
        'Steed of Shadows (Har Kuron)',
        'Pit of Shadows (Har Kuron)',
        'Wildform (Ghur)',
        'Fireball (Aqshy)',
        'Mystifying Miasma (Ulgu)',
        'Pall of Doom (Shyish)',
        "Pha's Protection (Hysh)",
        'Transmutation of Lead (Chamon)',
        'Shield of Thorns (Ghyran)',
        'Amber Spear',
        'Word of Pain',
        'Armour of Thorns',
      ],
      command_traits: [
        'Black Market Bounty (Anvilgard Battle Trait)',
        'Jutting Bones (Drakeblood Curse)',
        'Secretive Warlock (Anvilgard)',
        'Acidic Blood (Drakeblood Curse)',
        'Fell Gaze (Drakeblood Curse)',
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

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual('Big Waaagh')
    expect(res.selections).toEqual({
      flavors: [],
      artifacts: ['Savage Trophy', "Glowin' Tattooz", 'Mystic Waaagh! Paint', 'Kattanak Pelt'],
      battalions: ["Kunnin' Rukk"],
      command_abilities: ['Voice of Gork', 'Savage Attack'],
      endless_spells: [],
      scenery: [],
      spells: [
        "Da Blazin' Eyes",
        'Brutal Beast Spirits',
        'Bone Krusha',
        'Green Puke',
        'Fists of Gork',
        'Bone Spirit',
      ],
      mount_traits: ["Fast 'Un", "Weird 'Un"],
      prayers: [],
      command_traits: ["Dead Kunnin'"],
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
    ])
  })

  it('reads a warscroll pdf file with metadata correctly', () => {
    const pdfText = getFile('SeraphonWithMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      flavors: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      command_abilities: ['Gift from the Heavens'],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Celestial Deliverance', 'Blazing Starlight'],
      command_traits: ['Great Rememberer'],
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
      flavors: [],
      artifacts: ['Whip of Subversion', 'The Rod of Misrule', 'Fallacious Gift'],
      battalions: ['Hedonite Host', 'Supreme Sybarites', 'Epicurean Revellers', 'Seeker Cavalcade'],
      command_abilities: [
        'Grisly Trophy',
        'Bloodslick Ground',
        'Arcane Influence',
        'Bloated Blessings',
        'Revel in Agony',
        'Excess of Violence',
      ],
      endless_spells: ['Chronomantic Cogs'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Phantasmagoria', 'Soulslice Shards', 'Cacophonic Choir', 'Acquiescence'],
      command_traits: [
        'Inspirer',
        'Strongest Alone',
        'Hunter of Godbeasts',
        'Delusions of Infallibility',
        'Monarch of Lies',
      ],
      triumphs: [],
      units: [
        'Beastlord',
        'Daemon Prince',
        'Keeper of Secrets w/ Ritual Knife',
        'Viceleader, Herald of Slaanesh',
        'Cygor',
        'Ghorgon',
        'Daemonettes',
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
    expect(res.selections.command_traits).toEqual(['Secretive Warlock (Anvilgard)'])
    expect(res.selections.spells).toEqual([
      'Sap Strength (Anvilgard, Har Kuron)',
      'Elemental Cyclone (Hallowheart)',
      'Wings of Fire (Hammerhal)',
      'Cindercloud (Hammerhal)',
      'Twin-Tailed Comet (Hammerhal)',
      'Lifesurge (The Living City)',
      'Cage of Thorns (The Living City)',
      'Ironoak Skin (The Living City)',
      'Descending Ash Cloud (Greywater Fastness)',
      'Eroding Blast (Greywater Fastness)',
      'Choking Fumes (Greywater Fastness)',
      'Amber Tide (The Phoenicium)',
      'Phoenix Cry (The Phoenicium)',
      'Golden Mist (The Phoenicium)',
      'Shadow Daggers (Anvilgard, Har Kuron)',
      'Vitriolic Spray (Anvilgard, Har Kuron)',
      'Roaming Wildfire (Hallowheart)',
      'Sear Wounds (Hallowheart)',
      'Warding Brand (Hallowheart)',
      'Crystal Aegis (Hallowheart)',
      'Ignite Weapons (Hallowheart)',
      "Aura of Glory (Tempest's Eye)",
      "Strike of Eagles (Tempest's Eye)",
      "Celestial Visions (Tempest's Eye)",
      'The Withering (Har Kuron)',
      'Steed of Shadows (Har Kuron)',
      'Pit of Shadows (Har Kuron)',
      'Wildform (Ghur)',
      'Chain Lightning (Azyr)',
      'Fireball (Aqshy)',
      'Mystifying Miasma (Ulgu)',
      'Pall of Doom (Shyish)',
      "Pha's Protection (Hysh)",
      'Transmutation of Lead (Chamon)',
      'Shield of Thorns (Ghyran)',
      'Amber Spear',
      'Comet of Casandora',
      'Burning Gaze',
      'Word of Pain',
      'Bladewind',
      'Armour of Thorns',
    ])
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
    expect(res.selections.command_traits).toEqual([
      "FOOTNOTE: There's No Reward Without Risk",
      "FOOTNOTE: There's No Trading With Some People",
      'Master Commander',
      "FOOTNOTE: There's Always a Breeze if You Look for it",
      "AMENDMENT: Don't Argue With the Wind",
      'ARTYCLE: Master the Skies',
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
      flavors: [],
      mount_traits: [],
      prayers: ['Wrath of Khaine'],
      artifacts: ['Obstinate Blade (Order)'],
      battalions: ['Shadow Patrol'],
      command_abilities: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: ['Doomfire', 'Enfeebling Foe'],
      command_traits: ['Dauntless (Order)'],
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

    expect(res.factionName).toEqual(ORRUK_WARCLANS)
    expect(res.subFactionName).toEqual('Ironjawz')
    expect(res.selections).toEqual({
      flavors: ['Da Choppas'],
      artifacts: ['Destroyer', 'Megaskull Staff'],
      battalions: [],
      command_abilities: ['Rabble Rouser', 'Voice of Gork', 'Go on Ladz, Get Stuck In!'],
      endless_spells: [],
      mount_traits: ["Fast 'Un"],
      prayers: [],
      scenery: [],
      spells: [],
      command_traits: ['Checked Out'],
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
      flavors: [],
      artifacts: [],
      battalions: [],
      command_abilities: [],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      command_traits: [],
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
      flavors: [],
      artifacts: [],
      battalions: [],
      command_abilities: ['Pack Alpha'],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Storm Lance'],
      command_traits: [],
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
      flavors: [],
      artifacts: [],
      battalions: [],
      command_abilities: ['Pack Alpha'],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Storm Lance'],
      command_traits: [],
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
      flavors: [],
      artifacts: [],
      battalions: [],
      command_abilities: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      command_traits: [],
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
      flavors: [],
      artifacts: [],
      battalions: [],
      command_abilities: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Spore Maws'],
      command_traits: ['Boss Shaman'],
      triumphs: [],
      units: ['Fungoid Cave-Shaman'],
    })
  })

  it('reads a basic warscroll pdf file (no metadata) correctly (1)', () => {
    const pdfText = getFile('NightHauntIssue')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.selections).toEqual({
      flavors: [],
      artifacts: ['Midnight Tome'],
      battalions: [],
      command_abilities: [],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Shademist'],
      command_traits: ['Spiteful Spirit'],
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
        units: ['Sisters of Slaughter', 'Morathi-Khaine'],
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
      flavors: [],
      artifacts: ['Zoetic Dial'],
      battalions: [
        'Eternal Starhost',
        'Sunclaw Starhost',
        'Firelance Starhost',
        'Shadowstrike Starhost',
        'Thunderquake Starhost',
      ],
      command_abilities: ['Prime Guardian', 'Gift from the Heavens'],
      endless_spells: ['Balewind Vortex'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Walk Between Realms', 'Celestial Deliverance'],
      command_traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Bastiladon',
        'Saurus Guard',
        'Saurus Eternity Warden',
        'Saurus Warriors',
        'Saurus Knights',
      ],
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
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: ['Celestial Deliverance'],
        command_traits: ['Master of Star Rituals'],
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
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: ['Celestial Deliverance'],
        command_traits: ['Master of Star Rituals'],
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
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: ['Celestial Deliverance'],
        command_traits: ['Master of Star Rituals'],
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
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        flavors: [],
        mount_traits: [],
        prayers: [],
        artifacts: ['Blade of Realities'],
        battalions: [],
        command_abilities: [],
        endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
        scenery: [],
        spells: [],
        command_traits: ['Disciplined Fury'],
        triumphs: [],
        units: ['Engine of the Gods', 'Chameleon Skinks', 'Saurus Warriors', 'Bastiladon', 'Dread Saurian'],
      },
      unknownSelections: [],
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
