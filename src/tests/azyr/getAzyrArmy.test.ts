import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'

import {
  BEASTS_OF_CHAOS,
  BONESPLITTERZ,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  DISPOSSESSED,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_GRIEF,
  MERCENARY_COMPANIES,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  STORMCAST_ETERNALS,
} from 'meta/factions'
import { AQSHY, ULGU } from 'types/realmscapes'

import BoC1 from '../fixtures/azyr/json/BoC1.json'
import Bonesplitterz2 from '../fixtures/azyr/json/Bonesplitterz2.json'
import CoS1 from '../fixtures/azyr/json/CoS1.json'
import CoS2 from '../fixtures/azyr/json/CoS2.json'
import CoS3 from '../fixtures/azyr/json/CoS3.json'
import CoS4 from '../fixtures/azyr/json/CoS4.json'
import DoK2 from '../fixtures/azyr/json/DoK2.json'
import FEC2 from '../fixtures/azyr/json/FEC2.json'
import FEC3 from '../fixtures/azyr/json/FEC3.json'
import Fyreslayers2 from '../fixtures/azyr/json/Fyreslayers2.json'
import Khorne2 from '../fixtures/azyr/json/Khorne2.json'
import KO1 from '../fixtures/azyr/json/KO1.json'
import KO2 from '../fixtures/azyr/json/KO2.json'
import KO4 from '../fixtures/azyr/json/KO4.json'
import KO5 from '../fixtures/azyr/json/KO5.json'
import LoG2 from '../fixtures/azyr/json/LoG2.json'
import Seraphon1 from '../fixtures/azyr/json/Seraphon1.json'
import Skaven1 from '../fixtures/azyr/json/Skaven1.json'
import Skryre1 from '../fixtures/azyr/json/Skryre1.json'
import Slaanesh1 from '../fixtures/azyr/json/Slaanesh1.json'
import Slaanesh2 from '../fixtures/azyr/json/Slaanesh2.json'
import Stormcast4 from '../fixtures/azyr/json/Stormcast4.json'

describe('getAzyrArmyFromPdf', () => {
  it('handles Khorne2', () => {
    const pages = handleAzyrPages(Khorne2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([])
  })

  it('handles LoG2', () => {
    const pages = handleAzyrPages(LoG2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGIONS_OF_GRIEF)
    expect(res.errors).toEqual([])
  })

  it('handles FEC3', () => {
    const pages = handleAzyrPages(FEC3)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([])
  })

  it('handles Bonesplitterz2', () => {
    const pages = handleAzyrPages(Bonesplitterz2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.errors).toEqual([])
    expect(res.selections.allegiances).toEqual(['Icebone Clan'])
    expect(res.selections.battalions).toEqual(["Kunnin' Rukk"])
    expect(res.selections.artifacts).toEqual(["Mork's Boney Bitz", 'Kattanak Pelt'])
  })

  it('handles DoK2', () => {
    const pages = handleAzyrPages(DoK2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections).toEqual({
      allegiances: ['The Kraith (Temple)'],
      artifacts: ['Crimson Shard (Priest)'],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ["Martyr's Sacrifice (Priest)", 'Mindrazor (Wizard)'],
      traits: [],
      triumphs: [],
      units: ['Hag Queen on Cauldron of Blood', 'Morathi, High Oracle of Khaine', 'Sisters of Slaughter'],
    })
  })

  it('handles FEC2', () => {
    const pages = handleAzyrPages(FEC2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'FLESH_EATER_COURTS',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Gristlegore (Grand Court)'],
        artifacts: ['Ghurish Mawshard', 'The Grim Garland (Royal Treasury)'],
        battalions: ['Royal Menagerie'],
        commands: [],
        endless_spells: ['Cadaverous Barricade', 'Aethervoid Pendulum'],
        scenery: [],
        spells: ['Monstrous Vigour', 'Blood Feast'],
        traits: ['Savage Strike', 'The Feast Day (Delusion)'],
        triumphs: [],
        units: ['Abhorrant Ghoul King', 'Royal Terrorgheist'],
      },
      unknownSelections: [],
    })
  })

  it('handles CoS1', () => {
    const pages = handleAzyrPages(CoS1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      allegiances: ['Greywater Fastness'],
      artifacts: ['Wand of Restoration (Ghyran)'],
      battalions: ['Greywater Artillery Company'],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Descending Ash Cloud (Greywater Fastness)', 'Choking Fumes (Greywater Fastness)'],
      traits: ['Drillmaster (Greywater Fastness)'],
      triumphs: [],
      units: [
        'Battlemage',
        'Cogsmith',
        'Runelord',
        'Freeguild Guard',
        'Freeguild Handgunners',
        'Steam Tank with Commander',
        'Helblaster Volley Gun',
        'Dark Riders',
        'Freeguild Greatswords',
      ],
    })
  })

  it('handles CoS2', () => {
    const pages = handleAzyrPages(CoS2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      allegiances: ['Greywater Fastness'],
      artifacts: [
        'The Sunderblade (Ghyran)',
        "Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)",
        'Steam-piston Plate Mail (Greywater Fastness)',
      ],
      battalions: [
        'Aetherguard Windrunners',
        'Greywater Artillery Company',
        'Hammerhalian Lancers',
        'Phoenix Flight',
        'Viridian Pathfinders',
        'Whitefire Retinue',
      ],
      commands: [],
      endless_spells: ['Prismatic Palisade'],
      scenery: [],
      spells: ['Eroding Blast (Greywater Fastness)'],
      traits: ['Seat on the Council (Greywater Fastness)'],
      triumphs: [],
      units: [
        'Freeguild General',
        'Freeguild General on Griffon',
        'Knight-Azyros',
        'Luminark of Hysh with White Battlemage',
        'Sorceress on Black Dragon',
        'Steam Tank with Commander',
        'Freeguild Handgunners',
        'Ironbreakers',
        'War Hydra',
        'Celestar Ballista',
        'Helblaster Volley Gun',
        'Helstorm Rocket Battery',
      ],
    })
  })

  it('handles CoS3', () => {
    const pages = handleAzyrPages(CoS3)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toEqual(['Battlemage', 'Freeguild General', 'Dreadspears'])
    expect(res.selections.traits).toEqual(['Aggressive General (Hammerhal)'])
  })

  it('handles CoS4', () => {
    const pages = handleAzyrPages(CoS4)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections).toEqual({
      allegiances: ['Anvilgard'],
      artifacts: ['Venomfang Blade (Anvilgard)'],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Sap Strength (Anvilgard)'],
      traits: ['Blackfang Crimelord (Anvilgard)', 'Hidden Agents (Anvilgard Battle Trait)'],
      triumphs: [],
      units: ['Battlemage on Griffon', 'Freeguild Handgunners', 'War Hydra'],
    })
  })

  it('handles KO5', () => {
    const pages = handleAzyrPages(KO5)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Seek New Prospects',
      'AMENDMENT: Prosecute Wars With All Haste',
      "FOOTNOTE: There's no Trading With Some People",
      'FOOTNOTE: Who Strikes First, Strikes Hardest',
    ])
  })

  it('handles KO4', () => {
    const pages = handleAzyrPages(KO4)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Master the Skies',
      "AMENDMENT: Don't Argue With the Wind",
      'FOOTNOTE: Without Our Ships, We Are Naught',
      "FOOTNOTE: There's Always a Breeze if You Look for it",
    ])
  })

  it('handles KO2', () => {
    const pages = handleAzyrPages(KO2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.allyFactionNames).toEqual([CITIES_OF_SIGMAR, DISPOSSESSED, STORMCAST_ETERNALS])
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Respect Your Commanders',
      'AMENDMENT: Trust Aethermatics, Not Superstition',
      'FOOTNOTE: Through Knowledge, Power',
      'FOOTNOTE: Without Our Ships, We Are Naught',
      'Champion of Progress',
    ])

    expect(res.allySelections).toEqual({
      CITIES_OF_SIGMAR: { units: ['Gyrobombers', 'Gyrocopters'] },
      DISPOSSESSED: { units: ['Quarrellers', 'Thunderers'] },
      STORMCAST_ETERNALS: {
        units: [
          'Prosecutors with Stormcall Javelins',
          'Lord-Arcanum',
          'Knight-Incantor',
          'Lord-Exorcist',
          'Evocators',
          "Steelheart's Champions",
        ],
      },
    })

    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Hammerers can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Ironbreakers can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Irondrakes can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
    ])
  })

  it('handles Stormcast4', () => {
    const pages = handleAzyrPages(Stormcast4)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.traits).toEqual(['Keen-clawed (Mount)', 'Lithe-Limbed (Mount)'])
  })

  it('handles Slaanesh1', () => {
    const pages = handleAzyrPages(Slaanesh1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.allyFactionNames).toEqual([MERCENARY_COMPANIES])
  })

  it('handles Slaanesh2', () => {
    const pages = handleAzyrPages(Slaanesh2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections).toEqual({
      allegiances: ['Pretenders (Host)'],
      artifacts: [
        'The Crown of Dark Secrets (Pretenders Host)',
        'Sceptre of Domination (Pretenders Host)',
        'Sliverslash (Pretenders Host)',
      ],
      battalions: [],
      commands: [],
      endless_spells: [],
      scenery: [],
      spells: ['Hysterical Frenzy (Daemon)', 'Slothful Stupor (Greater Daemon)', 'Soulslice Shards (Daemon)'],
      traits: ['True Child of Slaanesh (Pretenders Host)', 'Monarch of Lies (Pretenders Host)'],
      triumphs: [],
      units: [
        'Keeper of Secrets w/ Ritual Knife',
        'The Contorted Epitome',
        'The Masque',
        'Keeper of Secrets w/ Living Whip',
      ],
    })
  })

  it('handles Skryre1', () => {
    const pages = handleAzyrPages(Skryre1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SKAVEN)
    expect(res.selections.allegiances).toContain('Warpstone Sparks (Skryre)')
    expect(res.selections.endless_spells).toEqual(['Bell of Doom (Skaven)'])
    expect(res.selections.units).toEqual([
      'Arch-Warlock',
      'Warlock Bombardier',
      'Doomwheel',
      'Warplock Jezzails',
      'Ratling Gun',
      'Stormfiends',
    ])
  })

  it('handles Seraphon1', () => {
    const pages = handleAzyrPages(Seraphon1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SERAPHON,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: [],
        battalions: ['Fangs of Sotek', 'Sunclaw Starhost'],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: [],
        traits: [],
        triumphs: [],
        units: [
          'Slann Starmaster',
          'Engine of the Gods',
          'Saurus Astrolith Bearer',
          'Skink Priest w/ Cloak of Feathers',
          'Saurus Warriors',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles KO1', () => {
    const pages = handleAzyrPages(KO1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: KHARADRON_OVERLORDS,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Barak-Thryng, City of the Ancestors (Skyport)'],
        artifacts: [],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: [],
        traits: [
          'ARTYCLE: Settle the Grudges',
          'AMENDMENT: Trust to Your Guns',
          'FOOTNOTE: Honour the Gods, Just in Case',
          'FOOTNOTE: These Are Just Guidelines',
        ],
        triumphs: [],
        units: [
          'Aether-Khemist',
          'Aetheric Navigator',
          'Arkanaut Admiral',
          'Bjorgen Thundrik',
          'Brokk Grungsson, Lord-Magnate of Barak-Nar',
          'Endrinmaster',
          'Arkanaut Company',
          'Grundstok Gunhauler',
          'Arkanaut Frigate',
          'Arkanaut Ironclad',
          "Thundrik's Profiteers",
          'Skywardens',
          'Grundstok Thunderers',
          'Endrinriggers',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles Skaven1', () => {
    const pages = handleAzyrPages(Skaven1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SKAVEN,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['Vigordust Injector (Skryre)'],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: [
          'Death Frenzy (Grey Seer)',
          'Skitterleap (Grey Seer)',
          'More-more-more Warp Power! (Skryre Wizard)',
        ],
        traits: ['Master of Magic (Masterclan)'],
        triumphs: [],
        units: [
          'Grey Seer',
          'Warlock Bombardier',
          'Clanrats',
          'Warplock Jezzails',
          'Plague Monks',
          'Skryre Acolytes',
        ],
      },
      // These are all upgrades, and we would not expect to find them
      unknownSelections: [
        'Clawleader',
        'Clanr at Standard Bearer',
        'Clanr at Bell-ringer',
        'Bringer-of-the-Word',
        'Standard Bearers',
        'Plague Harbingers',
      ],
    })
  })

  it('handles Fyreslayers2', () => {
    const pages = handleAzyrPages(Fyreslayers2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: FYRESLAYERS,
      realmscape_feature: null,
      realmscape: AQSHY,
      selections: {
        allegiances: ['Hermdar (Lodge)'],
        artifacts: ['Tyrant Slayer'],
        battalions: [],
        commands: [],
        endless_spells: ['Runic Fyrewall'],
        scenery: [],
        spells: ['Prayer of Ash'],
        traits: ['Warrior Indominate', 'Fire-claw Adult (Mount)'],
        triumphs: [],
        units: [
          'Fjul-Grimnir',
          'The Chosen Axes',
          'Auric Runesmiter',
          'Vulkite Berzerkers',
          'Auric Runeson',
          'Doomseeker',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles BoC1', () => {
    const pages = handleAzyrPages(BoC1)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: ['SLAVES_TO_DARKNESS'],
      allySelections: {
        SLAVES_TO_DARKNESS: {
          units: ['Sayl the Faithless', 'Theddra Skull-Scryer', 'Darkoath Warqueen', 'Godsworn Hunt'],
        },
      },
      allyUnits: [
        'Sayl the Faithless',
        'Theddra Skull-Scryer',
        'Darkoath Warqueen',
        'Untamed Beasts',
        'Godsworn Hunt',
        'Furies',
      ],
      errors: [],
      factionName: BEASTS_OF_CHAOS,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: ['The Knowing Eye (Brayherds)', 'Blackened Armour of Chaos (Warherds)'],
        battalions: [
          'Brass Despoilers',
          'Depraved Drove',
          'Desolating Beastherd',
          'Hungering Warherd',
          'Marauding Brayherd',
          'Pestilent Throng',
          'Phantasmagoria of Fate',
          'Thunderscorn Stormherd',
        ],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: [
          'Sundering Blades (Thunderscorn Wizard)',
          'Tendrils of Atrophy (Brayherd Wizard)',
          'Titanic Fury (Brayherd Wizard)',
        ],
        traits: ['Rampant Juggernaut (Warherd)'],
        triumphs: [],
        units: [
          'Beastlord',
          'Doombull',
          'Dragon Ogor Shaggoth',
          'Great Bray-Shaman',
          'Tzaangor Shaman',
          'Bullgors',
          'Gors',
          'Ungors',
          'Chaos Gargant',
          'Chimera',
          'Cygor',
          'Ghorgon',
          'Jabberslythe',
          'Bestigors',
          'Centigors',
          'Chaos Spawn',
          'Chaos Warhounds',
          'Cockatrice',
          'Dragon Ogors',
          'Razorgors',
          'Tuskgor Chariots',
          'Tzaangor Enlightened',
          'Tzaangor Skyfires',
          'Tzaangors',
          'Ungor Raiders',
        ],
      },
      unknownSelections: [],
    })
  })
})

describe('isPoorlySpacedMatch', () => {
  it('handles stuff', () => {
    const sample1 = isPoorlySpacedMatch('Vigor dust Inject or', 'Vigordust Injector (Skryre)')
    expect(sample1).toBeTruthy()

    const sample2 = isPoorlySpacedMatch(
      'Blade of the Thir teen Dominions',
      `Blade of the Thirteen Dominions (${ULGU})`
    )
    expect(sample2).toBeTruthy()

    const sample3 = isPoorlySpacedMatch(
      'Bar ak-Thr yng, City of the Ancest ors',
      `Barak-Thryng, City of the Ancestors`
    )
    expect(sample3).toBeTruthy()
  })
})
