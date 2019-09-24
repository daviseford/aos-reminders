import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'

import {
  BEASTS_OF_CHAOS,
  FYRESLAYERS,
  KHARADRON_OVERLORDS,
  MERCENARY_COMPANIES,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  STORMCAST_ETERNALS,
} from 'meta/factions'
import { AQSHY, ULGU } from 'types/realmscapes'

import BoC1 from './fixtures/azyr/json/BoC1.json'
import Fyreslayers2 from './fixtures/azyr/json/Fyreslayers2.json'
import KO1 from './fixtures/azyr/json/KO1.json'
import KO2 from './fixtures/azyr/json/KO2.json'
import KO4 from './fixtures/azyr/json/KO4.json'
import KO5 from './fixtures/azyr/json/KO5.json'
import Seraphon1 from './fixtures/azyr/json/Seraphon1.json'
import Skaven1 from './fixtures/azyr/json/Skaven1.json'
import Skryre1 from './fixtures/azyr/json/Skryre1.json'
import Slaanesh1 from './fixtures/azyr/json/Slaanesh1.json'
import Slaanesh2 from './fixtures/azyr/json/Slaanesh2.json'
import Stormcast4 from './fixtures/azyr/json/Stormcast4.json'

describe('getAzyrArmyFromPdf', () => {
  it('handles KO5', () => {
    const pages = handleAzyrPages(KO5)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Seek New Prospects',
      'AMENDMENT: Prosecute Wars With All Haste',
      "FOOTNOTE: There's no Trading With Some People",
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
    ])
  })

  it('handles KO2', () => {
    const pages = handleAzyrPages(KO2)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Respect Your Commanders',
      'AMENDMENT: Trust Aethermatics, Not Superstition',
      'FOOTNOTE: Without Our Ships, We Are Naught',
      'Champion of Progress',
    ])

    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Prosecutors',
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
