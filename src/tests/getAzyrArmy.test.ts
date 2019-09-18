import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/azyr/azyrUtils'

import { BEASTS_OF_CHAOS, FYRESLAYERS, SKAVEN, KHARADRON_OVERLORDS, SERAPHON } from 'meta/factions'
import { AQSHY, ULGU } from 'types/realmscapes'

import BoC1 from './fixtures/azyr/json/BoC1.json'
import Fyreslayers2 from './fixtures/azyr/json/Fyreslayers2.json'
import KO1 from './fixtures/azyr/json/KO1.json'
import Seraphon1 from './fixtures/azyr/json/Seraphon1.json'
import Skaven1 from './fixtures/azyr/json/Skaven1.json'

describe('getAzyrArmyFromPdf', () => {
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
        traits: [],
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
      // TODO: Remove once #427 is merged in
      errors: [
        {
          severity: 'warn',
          text: 'Thunderscorn Stormherd',
        },
      ],
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
          // 'Thunderscorn Stormherd',  // TODO: Add once #427 is merged in
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
