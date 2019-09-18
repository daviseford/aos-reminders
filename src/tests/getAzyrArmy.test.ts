import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getInitialAzyrArmy } from 'utils/azyr/getAzyrArmy'

import { BEASTS_OF_CHAOS, FYRESLAYERS, SKAVEN, KHARADRON_OVERLORDS, SERAPHON } from 'meta/factions'
import { AQSHY } from 'types/realmscapes'

import BoC1 from './fixtures/azyr/json/BoC1.json'
import Fyreslayers2 from './fixtures/azyr/json/Fyreslayers2.json'
import KO1 from './fixtures/azyr/json/KO1.json'
import Seraphon1 from './fixtures/azyr/json/Seraphon1.json'
import Skaven1 from './fixtures/azyr/json/Skaven1.json'

describe('getAzyrArmyFromPdf', () => {
  it('handles Seraphon1', () => {
    const pages = handleAzyrPages(Seraphon1)
    const res = getInitialAzyrArmy(pages)
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
          'Skink Priest',
          'Saurus Warriors',
        ],
      },
      unknownSelections: [],
    })
  })

  it('handles KO1', () => {
    const pages = handleAzyrPages(KO1)
    const res = getInitialAzyrArmy(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: KHARADRON_OVERLORDS,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Barak-Thryng, City of the Ancestors'],
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
    const res = getInitialAzyrArmy(pages)
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
        artifacts: ['Vigordust Injector'],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: ['Death Frenzy', 'Skitterleap', 'More-more-more Warp Power!'],
        traits: ['Master of Magic'],
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
      unknownSelections: [],
    })
  })

  it('handles Fyreslayers2', () => {
    const pages = handleAzyrPages(Fyreslayers2)
    const res = getInitialAzyrArmy(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: FYRESLAYERS,
      realmscape_feature: null,
      realmscape: AQSHY,
      selections: {
        allegiances: ['Hermdar'],
        artifacts: ['Tyrant Slayer'],
        battalions: [],
        commands: [],
        endless_spells: ['Runic Fyrewall'],
        scenery: [],
        spells: ['Prayer of Ash'],
        traits: ['Warrior Indominate', 'Fire-claw Adult'],
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
    const res = getInitialAzyrArmy(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
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
        artifacts: ['The Knowing Eye', 'Blackened Armour of Chaos'],
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
        spells: ['Sundering Blades', 'Tendrils of Atrophy', 'Titanic Fur'],
        traits: ['Rampant Juggernaut'],
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
