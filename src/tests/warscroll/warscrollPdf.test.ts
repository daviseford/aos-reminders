import { SeraphonFaction } from 'factions/seraphon'
import { readFileSync } from 'fs'
import {
  BEASTS_OF_CHAOS,
  CHAOS_GRAND_ALLIANCE,
  CITIES_OF_SIGMAR,
  DESTRUCTION_GRAND_ALLIANCE,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
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
  SLAVES_TO_DARKNESS,
  SONS_OF_BEHEMAT,
  SOULBLIGHT_GRAVELORDS,
  STORMCAST_ETERNALS,
  TZEENTCH,
} from 'meta/factions'
import path from 'path'
import { DEPRECATED_AOS_3 } from 'utils/import/options'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/warscroll/pdf/${filename}.pdf`), 'utf8')
}

describe('getWarscrollArmyFromPdf', () => {
  it('should correctly read New_BoC1', () => {
    const pdfText = getFile('New_BoC1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(BEASTS_OF_CHAOS)
    expect(res.selections.artifacts).toContain('The Knowing Eye (Brayherds)')
    expect(res.selections.battalions).toContain('Warlord')
    expect(res.selections.command_traits).toContain('Rampant Juggernaut (Warherd)')
    expect(res.selections.flavors).toContain('Gavespawn')
    expect(res.selections.grand_strategies).toContain('Pillars of Belief')
    expect(res.selections.spells).toContain('Ghost-mist')
    expect(res.selections.triumphs).toContain('Indomitable')
  })

  it('should correctly read New_Khorne1', () => {
    const pdfText = getFile('New_Khorne1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.selections.artifacts).toContain('Halo of Blood')
    expect(res.selections.artifacts).toContain('Skullshard Mantle')
    expect(res.selections.artifacts).toContain('The Slaughterhelm')
    expect(res.selections.command_traits).toContain('Unrivalled Battlelust')
    expect(res.selections.endless_spells).toContain('Hexgorger Skulls')
    expect(res.selections.flavors).toEqual(['The Flayed'])
    expect(res.selections.grand_strategies).toContain('Dominating Presence')
    expect(res.selections.prayers).toContain('Guidance')
    expect(res.selections.spells).toContain('Levitate')
    expect(res.selections.triumphs).toEqual([])
  })

  it('should correctly read New_Seraphon1', () => {
    const pdfText = getFile('New_Seraphon1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.flavors).toContain("Dracothion's Tail")
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)

    expect(res.allyUnits).toEqual(['Gotrek Gurnisson', 'Bundo Whalebiter'])
    expect(res.selections.artifacts).toContain('Light of Dracothion')
    expect(res.selections.command_traits).toContain('Vast Intellect')
    expect(res.selections.grand_strategies).toContain('Hold the Line')
    expect(res.selections.spells).toContain('Celestial Equilibrium')
    expect(res.selections.spells).toContain('Mystical Unforging')
    expect(res.selections.triumphs).toEqual([])
  })

  it('should correctly read New_Slaanesh1', () => {
    const pdfText = getFile('New_Slaanesh1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.selections.artifacts).toContain('Bindings of Slaanesh')
    expect(res.selections.command_traits).toContain('High Priest')
    expect(res.selections.flavors).toContain('Scarlet Cavalcade')
    expect(res.selections.grand_strategies).toContain('Sever the Head')
    expect(res.selections.triumphs).toEqual(['Bloodthirsty'])
    expect(res.subFactionName).toEqual('Godseekers Host')
  })

  it('should correctly read New_Tzeentch1', () => {
    const pdfText = getFile('New_Tzeentch1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.selections.artifacts).toContain('Amulet of Destiny')
    expect(res.selections.artifacts).toContain('Brimstone Familiar')
    expect(res.selections.command_traits).toContain('Coruscating Flames')
    expect(res.selections.endless_spells).toContain('The Burning Head')
    expect(res.selections.flavors).toContain('The Eternal Conflagration')
    expect(res.selections.grand_strategies).toContain("Predator's Domain")
    expect(res.selections.spells).toContain('Flaming Weapon')
    expect(res.selections.spells).toContain('Unchecked Mutation')
  })

  it('should correctly read New_CoS1', () => {
    const pdfText = getFile('New_CoS1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toContain(CITIES_OF_SIGMAR)
    expect(res.selections.artifacts).toContain('Sawfang Dust (Misthavn Narcotic)')
    expect(res.selections.artifacts).toContain('Strangler-kelp Noose (Misthavn)')
    expect(res.selections.battalions).toContain('Alpha-Beast Pack')
    expect(res.selections.battalions).toContain('Grand Battery')
    expect(res.selections.battalions).toContain('Hunters of the Heartlands')
    expect(res.selections.command_traits).toContain('Heroic Stature')
    expect(res.selections.endless_spells).toContain('Prismatic Palisade')
    expect(res.selections.flavors).toContain('Misthavn')
    expect(res.selections.grand_strategies).toContain('Hold the Line')
    expect(res.selections.spells).toContain('Flaming Weapon')
    expect(res.selections.triumphs).toContain('Inspired')
    expect(res.selections.units).toContain('Freeguild General')
    expect(res.selections.units).toContain('Helstorm Rocket Battery')
    expect(res.selections.units).toContain('Sisters of the Thorn')
    expect(res.selections.units).toContain('Steam Tank with Commander')
  })

  it('should correctly read New_Nurgle1', () => {
    const pdfText = getFile('New_Nurgle1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.selections.artifacts).toContain('Vial of Manticore Venom')
    expect(res.selections.battalions).toContain('Alpha-Beast Pack')
    expect(res.selections.battalions).toContain('Command Entourage - Strategists')
    expect(res.selections.battalions).toContain('Command Entourage')
    expect(res.selections.battalions).toContain('Hunters of the Heartlands')
    expect(res.selections.battalions).toContain('Linebreaker')
    expect(res.selections.battalions).toContain('Vanguard')
    expect(res.selections.command_traits).toContain('Skilled Leader')
    expect(res.selections.endless_spells).toContain('Umbral Spellportal')
    expect(res.selections.flavors).toContain('Droning Guard')
    expect(res.selections.grand_strategies).toContain('Beast Master')
    expect(res.selections.prayers).toContain('Guidance')
    expect(res.selections.spells).toContain('Levitate')
    expect(res.selections.triumphs).toContain('Bloodthirsty')
  })

  it('should correctly read New_Nurgle1_withStats', () => {
    const pdfText = getFile('New_Nurgle1_withStats')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.selections.artifacts).toContain('Vial of Manticore Venom')
    expect(res.selections.battalions).toContain('Alpha-Beast Pack')
    expect(res.selections.battalions).toContain('Command Entourage - Strategists')
    expect(res.selections.battalions).toContain('Command Entourage')
    expect(res.selections.battalions).toContain('Hunters of the Heartlands')
    expect(res.selections.battalions).toContain('Linebreaker')
    expect(res.selections.battalions).toContain('Vanguard')
    expect(res.selections.command_traits).toContain('Skilled Leader')
    expect(res.selections.endless_spells).toContain('Umbral Spellportal')
    expect(res.selections.flavors).toContain('Droning Guard')
    expect(res.selections.grand_strategies).toContain('Beast Master')
    expect(res.selections.prayers).toContain('Guidance')
    expect(res.selections.spells).toContain('Levitate')
    expect(res.selections.triumphs).toContain('Bloodthirsty')
  })

  it('should correctly read New_Nurgle1_withAlly', () => {
    const pdfText = getFile('New_Nurgle1_withAlly')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(NURGLE)
    expect(res.selections.artifacts).toContain('Vial of Manticore Venom')
    expect(res.selections.battalions).toContain('Alpha-Beast Pack')
    expect(res.selections.battalions).toContain('Command Entourage - Strategists')
    expect(res.selections.battalions).toContain('Command Entourage')
    expect(res.selections.battalions).toContain('Hunters of the Heartlands')
    expect(res.selections.battalions).toContain('Linebreaker')
    expect(res.selections.battalions).toContain('Vanguard')
    expect(res.selections.command_traits).toContain('Skilled Leader')
    expect(res.selections.endless_spells).toContain('Umbral Spellportal')
    expect(res.selections.flavors).toContain('Droning Guard')
    expect(res.selections.grand_strategies).toContain('Beast Master')
    expect(res.selections.prayers).toContain('Guidance')
    expect(res.selections.spells).toContain('Levitate')
    expect(res.selections.triumphs).toContain('Bloodthirsty')

    // Ally units
    expect(res.allyFactionNames).toContain(SLAVES_TO_DARKNESS)
    expect(res.allySelections[SLAVES_TO_DARKNESS]?.units).toEqual(['Fomoroid Crusher', 'Raptoryx'])
  })

  it('should correctly read SoulblightGravelords1', () => {
    const pdfText = getFile('SoulblightGravelords1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SOULBLIGHT_GRAVELORDS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        artifacts: ['Sangsyron', 'Ulfenkarnian Phylactery'],
        battalions: [],
        command_abilities: [
          'Pack Alpha',
          'Tactical Insight',
          'Arise! Arise!',
          'A Queen Amongst Monsters',
          'Vigour of Undeath',
          'Supreme Lord of the Undead',
          "Twilight's Allure",
          'Fist of Nagash',
          'Call to the Hunt',
          'Mustering Howl',
          'Disciplined Advance',
          'Festering Feast',
          'Lord of Bones',
        ],
        command_traits: [],
        endless_spells: [],
        grand_strategies: [],
        flavors: [],
        incarnates: [],
        monstrous_rampages: [],
        mount_traits: [],
        prayers: [],
        scenery: [],
        spells: [
          'Amethystine Pinions',
          'Soulpike',
          'Vile Transference',
          'Invigorating Aura',
          'Under a Killing Moon',
          'Lycancurse',
          'Blood Siphon',
          'Shudder',
          "Death's Downpour",
          'Wind of Death',
          'Hand of Dust',
          'Soul Stealer',
          "Vanhel's Danse Macabre",
          'Dark Mist',
          'Fiendish Lure',
          'Quickblood',
          'Necrotising Bolt',
          'Curse of Exsanguination',
          'Clotted Deluge',
        ],
        core_rules: [],
        triumphs: [],
        units: [
          'Belladamma Volga',
          'Bloodseeker Palanquin',
          'Coven Throne',
          'Gorslav the Gravekeeper',
          'Kritza',
          'Lady Annika',
          'Lauka Vai',
          'Mannfred von Carstein',
          'Nagash, Supreme Lord of the Undead',
          'Necromancer',
          'Neferata',
          'Prince Duvalle',
          'Prince Vhordrai',
          'Radukar the Beast',
          'Torgillius the Chamberlain',
          'Watch Captain Halgrim',
          'Radukar the Wolf',
          'Vampire Lord on Zombie Dragon',
          'Vengorian Lords',
          'Wight King',
          'Wight King on Skeletal Steed',
          'Vargskyr',
          'Vyrkos Blood-born',
          'Kosargi Nightguard',
        ],
      },
      subFactionName: 'Vyrkos Dynasty',
      unknownSelections: [],
    })
  })

  it('should correctly read ArkhanCurse', () => {
    const pdfText = getFile('ArkhanCurse')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    // Fixes #1256
    expect(res.selections.units).toContain('Arkhan the Black, Mortarch of Sacrament')
    // This is a good test of how we extract mandatory objects from mandatory objects
    expect(res.selections.spells).toContain('Curse of Years')
  })

  it('should correctly read Tzeentch1', () => {
    const pdfText = getFile('Tzeentch1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.selections.flavors).toContain('The Eternal Conflagration')
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
      'The Great Wrecka (Breaker Tribe)',
      'Kingslaughter Cowl (Breaker Tribe)',
    ])
    expect(res.selections.units).toEqual(['Gatebreaker', 'Kraken-Eater', 'Warstomper', 'Mancrusher Gargant'])
    expect(res.errors).toEqual([
      {
        reason: DEPRECATED_AOS_3,
        severity: 'deprecation-warn',
        text: 'Incandescent Rageblade',
      },
    ])
  })

  it('should correctly read SoB1', () => {
    const pdfText = getFile('SoB1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)
    expect(res.factionName).toEqual(SONS_OF_BEHEMAT)
    expect(res.selections.flavors).toEqual(['Taker Tribe'])
    expect(res.selections.units).toEqual([
      'Gatebreaker',
      'Kraken-Eater',
      'Warstomper',
      'Mancrusher Gargant',
      'Bonegrinder Mega-Gargant',
    ])
  })

  it('correctly reads Lumineth1', () => {
    const pdfText = getFile('Lumineth1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.selections.units).toContain('Archmage Teclis')
    expect(res.selections.spells).toContain('Etheral Blessings')
    expect(res.factionName).toEqual(LUMINETH_REALMLORDS)
  })
  it("correctly imports Braum's list", () => {
    const pdfText = getFile('BraumSeraphonTTSList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)
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
  })

  it('does not import the wrong trait (issue #863)', () => {
    const pdfText = getFile('BloodVulture')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.command_traits).not.toContain("Blood Vulture's Gaze")
    expect(res.selections.mount_traits).toContain('Metalcruncher')
  })

  it('imports Seraphon Constellations properly', () => {
    const pdfText = getFile('1000-Firelance_Starhost')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.flavors).toContain("Dracothion's Tail")
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Starborne)
  })

  it('imports Seraphon Constellations properly (1)', () => {
    const pdfText = getFile('1000-Sunclaw_Temple-host')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.flavors).toContain("Koatl's Claw")
    expect(res.subFactionName).toEqual(SeraphonFaction.subFactionKeyMap.Coalesced) // auto-added because of Koatl's Claw
  })

  it('reads 2020 KO pdf', () => {
    const pdfText = getFile('KO_2020')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
  })

  it('reads Warpcog Convocation correctly', () => {
    const pdfText = getFile('WarpcogList')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.battalions).toEqual([])
  })

  it('does not include Quicksilver Swords via unknownSelections', () => {
    const pdfText = getFile('KhorneDaemonPrincewithSword')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.units).toEqual(['Daemon Prince'])
    expect(res.selections.endless_spells).toEqual([])
  })

  it('reads Ossiarch Bonereapers full pdf', () => {
    const pdfText = getFile('OBR1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
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
      origin_realm: 'Chamon',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        grand_strategies: [],
        flavors: ['Barak-Zilfin, The Windswept City (Skyport)'],
        artifacts: ['Staff of Ocular Optimisation'],
        battalions: [],
        command_abilities: [],
        endless_spells: [],
        scenery: [],
        spells: [],
        mount_traits: [],
        incarnates: [],
        monstrous_rampages: [],
        prayers: [],
        command_traits: [
          "FOOTNOTE: There's No Trading With Some People",
          'Cunning Fleetmaster',
          'Master Commander',
          "FOOTNOTE: There's Always a Breeze if You Look for it",
          "AMENDMENT: Don't Argue With the Wind",
          'ARTYCLE: Master the Skies',
        ],
        core_rules: [],
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

  it('reads 3droth2k properly', () => {
    const pdfText = getFile('3droth2k')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.flavors).toEqual(['Vostarg'])
  })

  it('reads Ogor Mawtribes full pdf', () => {
    const pdfText = getFile('OgorMawtribes1')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
  })

  it('reads a unit with ignored unknown selections', () => {
    const pdfText = getFile('IgnoreUnknown')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CHAOS_GRAND_ALLIANCE)
    expect(res.selections.endless_spells).toEqual([])
    expect(res.selections.artifacts).toEqual([])
    expect(res.unknownSelections).toEqual([])
  })

  it('reads a basic warscroll pdf file (no metadata) correctly', () => {
    const pdfText = getFile('SeraphonNoMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      grand_strategies: [],
      flavors: [],
      incarnates: [],
      monstrous_rampages: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: [],
      command_abilities: ['Gift from the Heavens'],
      endless_spells: ['Chronomantic Cogs'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ["Comet's Call", 'Blazing Starlight'],
      command_traits: ['Great Rememberer'],
      core_rules: [],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Razordon Hunting Pack',
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
    expect(res.unknownSelections).toEqual([])
    expect(res.selections).toEqual({
      flavors: ['Anvilgard'],
      grand_strategies: [],
      incarnates: [],
      monstrous_rampages: [],
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
      battalions: [],
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
        'Shield of Thorns (Ghyran)',
        'Amber Spear',
        'Wildform (Ghur)',
      ],
      command_traits: [
        'Black Market Bounty (Anvilgard Battle Trait)',
        'Jutting Bones (Drakeblood Curse)',
        'Secretive Warlock (Anvilgard)',
        'Acidic Blood (Drakeblood Curse)',
        'Fell Gaze (Drakeblood Curse)',
      ],
      core_rules: [],
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

  it('reads a warscroll pdf file with metadata correctly', () => {
    const pdfText = getFile('SeraphonWithMetadata')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections).toEqual({
      grand_strategies: [],
      flavors: [],
      incarnates: [],
      monstrous_rampages: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: [],
      command_abilities: ['Gift from the Heavens'],
      endless_spells: ['Chronomantic Cogs'],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ["Comet's Call", 'Blazing Starlight'],
      command_traits: ['Great Rememberer'],
      core_rules: [],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Razordon Hunting Pack',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon',
      ],
    })
  })

  it('reads Command Traits/Artifacts and gets the spells attached to them', () => {
    const pdfText = getFile('CommandTraitWithSpell')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)

    expect(res.selections.artifacts).toEqual(['Whitefire Tome (Hallowheart)'])
    expect(res.selections.command_traits).toEqual(['Secretive Warlock (Anvilgard)'])
    expect(res.selections.spells).toEqual([
      'Sap Strength (Anvilgard, Har Kuron)',
      'Elemental Cyclone (Hallowheart)',
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

    expect(res.selections).toEqual({
      grand_strategies: [],
      flavors: [],
      incarnates: [],
      monstrous_rampages: [],
      mount_traits: [],
      prayers: [],
      artifacts: ['Obstinate Blade (Order)'],
      battalions: ['Shadow Patrol'],
      command_abilities: [],
      endless_spells: [],
      scenery: [],
      spells: ['Doomfire', 'Enfeebling Foe'],
      command_traits: ['Dauntless (Order)'],
      core_rules: [],
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

  it('correctly imports the Drakesworn Templar without mistaking its lance for a spell', () => {
    const pdfText = getFile('Drakesworn')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections).toEqual({
      grand_strategies: [],
      flavors: [],
      artifacts: [],
      battalions: [],
      incarnates: [],
      monstrous_rampages: [],
      command_abilities: [],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      command_traits: [],
      core_rules: [],
      triumphs: [],
      units: ['Drakesworn Templar'],
    })
  })

  it('correctly imports the Loonboss and its command ability', () => {
    const pdfText = getFile('Loonboss')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(res.selections).toEqual({
      grand_strategies: [],
      flavors: [],
      incarnates: [],
      monstrous_rampages: [],
      artifacts: [],
      battalions: [],
      command_abilities: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      command_traits: [],
      core_rules: [],
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
      grand_strategies: [],
      flavors: [],
      artifacts: [],
      incarnates: [],
      monstrous_rampages: [],
      battalions: [],
      command_abilities: ["I'm Da Boss, Now Stab 'Em Good!"],
      endless_spells: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: ['Spore Maws'],
      command_traits: ['Boss Shaman'],
      core_rules: [],
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
      grand_strategies: [],
      incarnates: [],
      monstrous_rampages: [],
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
      core_rules: [],
      triumphs: [],
      units: ['Lord Executioner'],
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
      ],
      factionName: SERAPHON,
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        grand_strategies: [],
        incarnates: [],
        monstrous_rampages: [],
        flavors: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Supreme Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: [
          'Celestial Apotheosis',
          'Celestial Deliverance',
          'Celestial Equilibrium',
          'Drain Magic',
          'Mystical Unforging',
          'Stellar Tempest',
          'Walk Between Realms',
          "Comet's Call",
        ],
        command_traits: ['Master of Star Rituals'],
        core_rules: [],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordon Hunting Pack',
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
      ],
      factionName: SERAPHON,
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        grand_strategies: [],
        incarnates: [],
        monstrous_rampages: [],
        flavors: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Supreme Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: [
          'Celestial Apotheosis',
          'Celestial Deliverance',
          'Celestial Equilibrium',
          'Drain Magic',
          'Mystical Unforging',
          'Stellar Tempest',
          'Walk Between Realms',
          "Comet's Call",
        ],
        command_traits: ['Master of Star Rituals'],
        core_rules: [],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordon Hunting Pack',
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
      ],
      factionName: SERAPHON,
      subFactionName: '',
      origin_realm: 'Ghyran',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        grand_strategies: [],
        flavors: [],
        incarnates: [],
        monstrous_rampages: [],
        artifacts: ['Incandescent Rectrices'],
        battalions: [],
        command_abilities: ['Supreme Gift from the Heavens', 'Wrath of the Seraphon'],
        endless_spells: ['Emerald Lifeswarm'],
        mount_traits: [],
        prayers: [],
        scenery: ['Penumbral Engine'],
        spells: [
          'Celestial Apotheosis',
          'Celestial Deliverance',
          'Celestial Equilibrium',
          'Drain Magic',
          'Mystical Unforging',
          'Stellar Tempest',
          'Walk Between Realms',
          "Comet's Call",
        ],
        command_traits: ['Master of Star Rituals'],
        core_rules: [],
        triumphs: [],
        units: [
          'Lord Kroak',
          'Engine of the Gods',
          'Saurus Oldblood on Carnosaur',
          'Kroxigor',
          'Razordon Hunting Pack',
          'Saurus Guard',
          'Stegadon',
        ],
      },
      unknownSelections: [],
    })
  })

  it('imports blue horrors as horrors (issue #907)', () => {
    const pdfText = getFile('BlueHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)

    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })

  it('imports brimstone horrors as horrors (issue #907)', () => {
    const pdfText = getFile('BrimstoneHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)

    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })

  it('imports pink horrors as horrors (issue #907)', () => {
    const pdfText = getFile('PinkHorrors')
    const parsedText = parsePdf(pdfText)
    const res = getWarscrollArmyFromPdf(parsedText)

    expect(res.factionName).toEqual(TZEENTCH)

    expect(res.selections.units).toEqual(['Horrors of Tzeentch'])
  })
})
