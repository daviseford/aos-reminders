import path from 'path'
import { readFileSync } from 'fs'
import { handleAzyrPages } from 'utils/azyr/azyrPdf'
import { getAzyrArmyFromPdf } from 'utils/azyr/getAzyrArmy'
import { isPoorlySpacedMatch } from 'utils/import/isPoorlySpacedMatch'

import {
  BEASTS_OF_CHAOS,
  BIG_WAAAGH,
  BONESPLITTERZ,
  CITIES_OF_SIGMAR,
  DAUGHTERS_OF_KHAINE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IDONETH_DEEPKIN,
  IRONJAWZ,
  KHARADRON_OVERLORDS,
  KHORNE,
  LEGIONS_OF_GRIEF,
  MERCENARY_COMPANIES,
  NIGHTHAUNT,
  OGOR_MAWTRIBES,
  OSSIARCH_BONEREAPERS,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  SLAVES_TO_DARKNESS,
  STORMCAST_ETERNALS,
  TZEENTCH,
} from 'meta/factions'
import { AQSHY, ULGU } from 'types/realmscapes'
import { SeraphonConstellations } from 'army/seraphon/allegiances'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/azyr/json/${filename}.json`), 'utf8'))
}

describe('getAzyrArmyFromPdf', () => {
  it('handles Seraphon5', () => {
    const fileTxt = getFile('Seraphon5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.COALESCED)
    expect(res.selections.allegiances).toContain(SeraphonConstellations.THUNDER_LIZARD)
    expect(res.errors).toEqual([])
  })

  // TODO Fix by adding legacy units to Order
  xit('handles 1582094113733-Azyr', () => {
    const fileTxt = getFile('1582094113733-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1582914528373-Azyr', () => {
    const fileTxt = getFile('1582914528373-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })
  it('handles 1583001514847-Azyr', () => {
    const fileTxt = getFile('1583001514847-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1583363189608-Azyr', () => {
    const fileTxt = getFile('1583363189608-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
    expect(res.selections.traits).toContain('Rage Unchained (Daemon)')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584088830450-Azyr', () => {
    const fileTxt = getFile('1584088830450-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.traits).toContain('Ionrach: Emissary of the Deep Places')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Eidolon of Mathlann'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles 1584173198145-Azyr', () => {
    const fileTxt = getFile('1584173198145-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1584173207896-Azyr', () => {
    const fileTxt = getFile('1584173207896-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles 1584223772080-Azyr', () => {
    const fileTxt = getFile('1584223772080-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.allegiances).toContain('Coalesced')
    expect(res.errors).toEqual([])
  })

  it('handles 1584242711185-Azyr', () => {
    const fileTxt = getFile('1584242711185-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toContain('The Eyes of the Nine')
    expect(res.errors).toEqual([])
  })

  it('handles 1584271452754-Azyr', () => {
    const fileTxt = getFile('1584271452754-Azyr')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Bound Emerald Lifeswarm',
      },
      {
        severity: 'warn',
        text: 'Bound Purple Sun of Shyish',
      },
    ])
  })

  it('handles KO9', () => {
    const fileTxt = getFile('KO9')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO10', () => {
    const fileTxt = getFile('KO10')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO11', () => {
    const fileTxt = getFile('KO11')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO12', () => {
    const fileTxt = getFile('KO12')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Auric Runefather'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles KO13', () => {
    const fileTxt = getFile('KO13')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO14', () => {
    const fileTxt = getFile('KO14')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles KO15', () => {
    const fileTxt = getFile('KO15')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.traits).toContain('Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)')
    expect(res.errors).toEqual([])
  })

  it('handles KO16', () => {
    const fileTxt = getFile('KO16')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ally-warn',
        text:
          'Allied Warden King can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
      {
        severity: 'ally-warn',
        text:
          'Allied Ironbreakers can belong to Cities Of Sigmar or Dispossessed. Please add this unit manually.',
      },
    ])
  })

  it('handles KO17', () => {
    const fileTxt = getFile('KO17')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // TODO FIX
    expect(res.errors).toEqual([
      {
        severity: 'error',
        text: 'There was a problem reading this file.',
      },
    ])
  })

  it('handles Nurgle4', () => {
    const fileTxt = getFile('Nurgle4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([])
  })

  it('handles Tzeentch5', () => {
    const fileTxt = getFile('Tzeentch5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
  })

  it('handles Tzeentch4', () => {
    const fileTxt = getFile('Tzeentch4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res).toEqual({
      allyFactionNames: [SLAANESH],
      allySelections: { SLAANESH: { battalions: [], units: ['Keeper of Secrets w/ Ritual Knife'] } },
      allyUnits: ['Keeper of Secrets'],
      errors: [],
      factionName: 'TZEENTCH',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Guild of Summoners'],
        artifacts: ['Brimstone Familiar'],
        battalions: [],
        commands: ['Will of the Arcane Lords'],
        endless_spells: [
          'Purple Sun of Shyish',
          'Realmscourge Rupture (Slaves)',
          'Prismatic Palisade',
          'Suffocating Gravetide',
          'Balewind Vortex',
          'Aethervoid Pendulum',
          'Soulsnare Shackles',
        ],
        scenery: [],
        spells: [
          'Glimpse the Future',
          'Arcane Suggestion',
          'Shield of Fate',
          "Tzeentch's Firestorm",
          'Infernal Flames',
          'Gestalt Sorcery',
        ],
        traits: ['Prophet of the Ostensible'],
        triumphs: [],
        units: ['Gaunt Summoner of Tzeentch', 'Kairic Acolytes'],
      },
      unknownSelections: [],
    })

    expect(res.errors).toEqual([])
  })

  it('handles Slaanesh4', () => {
    const fileTxt = getFile('Slaanesh4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.selections.artifacts).toContain("Guardian's Coronet (Hysh)")
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bladebringer'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles IDK4', () => {
    const fileTxt = getFile('IDK4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)

    expect(res.selections.allegiances).toEqual(['Dhom Hain (Enclave)'])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Eidolon of Mathlann'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Khorne6', () => {
    const fileTxt = getFile('Khorne6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain("A'rgath, the King of Blades")
    expect(res.selections.traits).toEqual(['Berserker Lord (Mortal)'])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Tzeentch3', () => {
    const fileTxt = getFile('Tzeentch3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(TZEENTCH)
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast7', () => {
    const fileTxt = getFile('Stormcast7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.battalions).toContain('Skyborne Slayers')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD11', () => {
    const fileTxt = getFile('StD11')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD1', () => {
    const fileTxt = getFile('StD1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.spells).toContain('Binding Damnation (Slaves)')
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles BigWaaagh3', () => {
    const fileTxt = getFile('BigWaaagh3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.spells).toContain("Get 'Em Beat (Ironjawz)")
    expect(res.errors).toEqual([])
  })

  it('handles deprecated KO8', () => {
    const fileTxt = getFile('KO8')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // These are classified as Mount Traits instead of artifacts
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Gattlesson's Endless Repeater",
      },
      {
        severity: 'warn',
        text: 'Hammer of Aethermatic Might',
      },
      {
        severity: 'warn',
        text: 'Sledgeshock Hammer',
      },
      {
        severity: 'warn',
        text: 'These Are Just Guidelines',
      },
      {
        severity: 'warn',
        text: 'Incredible Self-healing Hull',
      },
    ])
  })

  it('handles Seraphon3', () => {
    const fileTxt = getFile('Seraphon3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Coronal Shield',
      },
      {
        severity: 'warn',
        text: 'Claws of Glor y',
      },
      {
        severity: 'warn',
        text: 'Celestial Swarm',
      },
    ])
  })

  it('handles Seraphon4', () => {
    const fileTxt = getFile('Seraphon4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Claws of Glor y',
      },
      {
        severity: 'warn',
        text: 'Skink Prophet',
      },
    ])
  })

  it('handles Slaanesh3', () => {
    const fileTxt = getFile('Slaanesh3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bladebringer'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD8', () => {
    const fileTxt = getFile('StD8')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })
  it('handles StD9', () => {
    const fileTxt = getFile('StD9')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })
  it('handles StD10', () => {
    const fileTxt = getFile('StD10')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    // Warpfire Dragon is a Destruction unit
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Warpfire Dragon',
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD2', () => {
    const fileTxt = getFile('StD2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD3', () => {
    const fileTxt = getFile('StD3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.allegiances).toEqual(['Host of the Everchosen'])
    expect(res.errors).toEqual([])
  })

  it('handles StD4', () => {
    const fileTxt = getFile('StD4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD5', () => {
    const fileTxt = getFile('StD5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
        },
      ],
      factionName: SLAVES_TO_DARKNESS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Host of the Everchosen'],
        artifacts: [],
        battalions: [],
        commands: ['Dark Prophecy', 'By My Will', 'All-seeing Dominion', 'Spurred by the Gods'],
        endless_spells: [],
        scenery: [],
        spells: [],
        traits: [],
        triumphs: [],
        units: [
          'Archaon the Everchosen',
          'Chaos Lord',
          'Chaos Warriors',
          'Chaos Knights',
          'Varanguard',
          'Furies',
          'Untamed Beasts',
        ],
      },
      unknownSelections: ['Aspiring Champion'],
    })
  })

  it('handles StD6', () => {
    const fileTxt = getFile('StD6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res.selections.allegiances).toEqual(['Cabalists'])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Chaos Lord'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles StD7', () => {
    const fileTxt = getFile('StD7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAVES_TO_DARKNESS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: SLAVES_TO_DARKNESS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Host of the Everchosen'],
        artifacts: [],
        battalions: [],
        commands: ['Dark Prophecy', 'By My Will', 'All-seeing Dominion'],
        endless_spells: ['Eightfold Doom-Sigil (Slaves)'],
        scenery: [],
        spells: ['Whispers of Chaos (Slaves)'],
        traits: [],
        triumphs: [],
        units: ['Archaon the Everchosen', 'Varanguard'],
      },
      unknownSelections: [],
    })
  })

  it('handles deprecated KO7', () => {
    const fileTxt = getFile('KO7')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Hammer of Aethermatic Might',
      },
    ])
  })

  it('handles Ironjawz3', () => {
    const fileTxt = getFile('Ironjawz3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections.traits).toContain("Burstin' with Power")
    expect(res.errors).toEqual([])
  })

  it('handles Ironjawz2', () => {
    const fileTxt = getFile('Ironjawz2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IRONJAWZ)
    expect(res.selections.spells).toContain('Brain-bursta')
    expect(res.errors).toEqual([])
  })

  it('handles LoG3', () => {
    const fileTxt = getFile('LoG3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGIONS_OF_GRIEF)
    expect(res.selections.traits).toContain('Amethyst Glow')
    expect(res.errors).toEqual([])
  })

  it('handles BCR3 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([
      { severity: 'warn', text: "Braggoth's Beast Hammer" }, // no longer exists
      { severity: 'warn', text: 'Svard Alfrostun' }, // no longer exists
    ])
  })

  it('handles BCR2 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([])
  })

  it('handles BCR1 (legacy, recognize as Ogor Mawtribes)', () => {
    const fileTxt = getFile('BCR1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES) // BCR are not supported anymore, switch to Ogor Mawtribes
    expect(res.errors).toEqual([
      { severity: 'warn', text: "Braggoth's Beast Hammer" }, // no longer exists
      { severity: 'warn', text: 'Svard Alfrostun' }, // no longer exists
    ])
  })

  it('handles CoS5', () => {
    const fileTxt = getFile('CoS5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections.traits).toContain('Druid of the Everspring (Living City)')
    expect(res.errors).toEqual([])
  })

  it('handles Gloomspite2', () => {
    const fileTxt = getFile('Gloomspite2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.battalions).toEqual(['Spider Rider Skitterswarm', 'Skitterstrand Nest'])
    expect(res.errors).toEqual([])
  })

  it('handles IDK3', () => {
    const fileTxt = getFile('IDK3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.allegiances).toEqual(['Fuethan (Enclave)'])
    expect(res.errors).toEqual([])
  })

  it('handles IDK2', () => {
    const fileTxt = getFile('IDK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(IDONETH_DEEPKIN)
    expect(res.selections.allegiances).toEqual(['Fuethan (Enclave)'])
    expect(res.realmscape).toEqual('Ghur')
    expect(res.selections.artifacts).toEqual(['Gryph-feather Charm (Ghur)'])
    expect(res.selections.traits).toEqual(['Born From Agony'])
    expect(res.selections.units).toEqual([
      'Volturnos, High King of the Deep',
      'Akhelian King',
      'Akhelian Morrsarr Guard',
      'Akhelian Ishlaen Guard',
      'Akhelian Allopexes',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes1', () => {
    const fileTxt = getFile('OgorMawtribes1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes2', () => {
    const fileTxt = getFile('OgorMawtribes2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes3', () => {
    const fileTxt = getFile('OgorMawtribes3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.selections.allegiances).toEqual(['Boulderhead (Mawtribe)'])
    expect(res.selections.artifacts).toEqual(['Brand of the Svard'])
    expect(res.selections.spells).toEqual(['Pulverising Hailstorm'])
    expect(res.selections.traits).toEqual(['Belligerent Charger', 'Fleshgreed', 'Lord of Beasts'])
    expect(res.selections.units).toEqual([
      'Frostlord on Stonehorn',
      'Huskard on Thundertusk',
      'Stonehorn Beastriders',
      'Thundertusk Beastriders',
      'Mournfang Pack',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles OgorMawtribes4', () => {
    const fileTxt = getFile('OgorMawtribes4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OGOR_MAWTRIBES)
    expect(res.errors).toEqual([])
  })

  it('handles OBR1', () => {
    const fileTxt = getFile('OBR1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles OBR2', () => {
    const fileTxt = getFile('OBR2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles OBR3', () => {
    const fileTxt = getFile('OBR3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(OSSIARCH_BONEREAPERS)
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast6', () => {
    const fileTxt = getFile('Stormcast6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Nighthaunt2', () => {
    const fileTxt = getFile('Nighthaunt2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(NIGHTHAUNT)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Knight of Shrouds'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles BigWaaagh2', () => {
    const fileTxt = getFile('BigWaaagh2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(BIG_WAAAGH)
    expect(res.errors).toEqual([])
  })

  it('handles Seraphon2', () => {
    const fileTxt = getFile('Seraphon2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SERAPHON)
    expect(res.selections.artifacts).toEqual(["Anraheirs's Claw (Ghur)", 'Gryph-feather Charm (Ghur)'])
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: "Dracothion's Tail",
      },
      {
        severity: 'warn',
        text: 'Meteoric Convocation',
      },
      {
        severity: 'warn',
        text: 'Salamanders',
      },
      {
        severity: 'warn',
        text: 'Skink Handlers',
      },
    ])
  })

  it('handles Khorne5', () => {
    const fileTxt = getFile('Khorne5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([])
  })

  it('handles Khorne4', () => {
    const fileTxt = getFile('Khorne4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Khorne3', () => {
    const fileTxt = getFile('Khorne3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.selections.artifacts).toContain('The Brazen Rune')
    expect(res.errors).toEqual([])
  })

  it('handles Khorne2', () => {
    const fileTxt = getFile('Khorne2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHORNE)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Bloodthirster'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles LoG2', () => {
    const fileTxt = getFile('LoG2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(LEGIONS_OF_GRIEF)
    expect(res.errors).toEqual([])
  })

  it('handles FEC3', () => {
    const fileTxt = getFile('FEC3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Abhorrant Ghoul King'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles Bonesplitterz2', () => {
    const fileTxt = getFile('Bonesplitterz2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(BONESPLITTERZ)
    expect(res.errors).toEqual([])
    expect(res.selections.allegiances).toEqual(['Icebone Clan'])
    expect(res.selections.battalions).toEqual(["Kunnin' Rukk"])
    expect(res.selections.artifacts).toEqual(["Mork's Boney Bitz", 'Kattanak Pelt'])
  })

  it('handles DoK2', () => {
    const fileTxt = getFile('DoK2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(DAUGHTERS_OF_KHAINE)
    expect(res.selections).toEqual({
      allegiances: ['The Kraith (Temple)'],
      artifacts: ['Crimson Shard (Priest)', 'Venom of Nagendra'],
      battalions: [],
      commands: ['Worship Through Bloodshed'],
      endless_spells: [],
      scenery: [],
      spells: ["Martyr's Sacrifice (Priest)", 'Mindrazor (Wizard)', "Arnzipal's Black Horror"],
      traits: [],
      triumphs: [],
      units: ['Hag Queen on Cauldron of Blood', 'Morathi, High Oracle of Khaine', 'Sisters of Slaughter'],
    })
  })

  it('handles FEC2', () => {
    const fileTxt = getFile('FEC2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FLESH_EATER_COURTS)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Abhorrant Ghoul King'. Please check that we have imported the correct one.",
        },
      ],
      factionName: 'FLESH_EATER_COURTS',
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Gristlegore (Grand Court)'],
        artifacts: ['The Grim Garland (Royal Treasury)', 'Ghurish Mawshard'],
        battalions: ['Royal Menagerie'],
        commands: ['Call to War', 'Summon Men-at-arms'],
        endless_spells: ['Cadaverous Barricade', 'Aethervoid Pendulum'],
        scenery: [],
        spells: ['Monstrous Vigour', 'Blood Feast'],
        traits: ['The Feast Day (Delusion)', 'Savage Strike'],
        triumphs: [],
        units: ['Abhorrant Ghoul King', 'Royal Terrorgheist'],
      },
      unknownSelections: [],
    })
  })

  it('handles CoS1', () => {
    const fileTxt = getFile('CoS1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(res.selections).toEqual({
      allegiances: ['Greywater Fastness'],
      artifacts: ['Wand of Restoration (Ghyran)'],
      battalions: ['Greywater Artillery Company'],
      commands: ['Salvo Fire', 'Target Sighted'],
      endless_spells: [],
      scenery: [],
      spells: [
        'Descending Ash Cloud (Greywater Fastness)',
        'Choking Fumes (Greywater Fastness)',
        'Rune Lore',
        'Chain Lightning (Azyr)',
        'Fireball (Aqshy)',
        'Mystifying Miasma (Ulgu)',
        'Pall of Doom (Shyish)',
        "Pha's Protection (Hysh)",
        'Shield of Thorns (Ghyran)',
        'Transmutation of Lead (Chamon)',
        'Wildform (Ghur)',
        'Rune Lore: Ancestral Shield',
        'Rune Lore: Forge Fire',
      ],
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
    const fileTxt = getFile('CoS2')
    const pages = handleAzyrPages(fileTxt)
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
      commands: [
        'Salvo Fire',
        'Hold the Line',
        'Rousing Battle Cry',
        'Command Underlings',
        'Inspire Hatred',
        'Target Sighted',
      ],
      endless_spells: ['Prismatic Palisade'],
      scenery: [],
      spells: [
        'Eroding Blast (Greywater Fastness)',
        'Rune Lore',
        'Burning Gaze',
        "Pha's Protection (Hysh)",
        'Bladewind',
      ],
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

  it('handles Gloomspite3', () => {
    const fileTxt = getFile('Gloomspite3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.artifacts).toContain("Nibbla's 'Itty Ring")
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Loonboss'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('handles CoS3', () => {
    const fileTxt = getFile('CoS3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections.units).toEqual(['Battlemage', 'Freeguild General', 'Dreadspears'])
    expect(res.selections.traits).toEqual(['Aggressive General (Hammerhal)'])
  })

  it('handles CoS4', () => {
    const fileTxt = getFile('CoS4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.selections).toEqual({
      allegiances: ['Anvilgard'],
      artifacts: ['Venomfang Blade (Anvilgard)'],
      battalions: [],
      commands: ['Make an Example of the Weak'],
      endless_spells: [],
      scenery: [],
      spells: ['Sap Strength (Anvilgard)', 'Amber Spear', 'Wildform (Ghur)'],
      traits: ['Blackfang Crimelord (Anvilgard)', 'Hidden Agents (Anvilgard Battle Trait)'],
      triumphs: [],
      units: ['Battlemage on Griffon', 'Freeguild Handgunners', 'War Hydra'],
    })
  })

  it('handle deprecated KO6', () => {
    const fileTxt = getFile('KO6')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.errors).toEqual([
      {
        severity: 'warn',
        text: 'Aethershock Earbuster',
      },
    ])
  })

  it('handles deprecated KO5', () => {
    const fileTxt = getFile('KO5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      'ARTYCLE: Seek New Prospects',
      'FOOTNOTE: Who Strikes First, Strikes Hardest',
      'AMENDMENT: Prosecute Wars With All Haste',
      "FOOTNOTE: There's No Trading With Some People",
      'Opportunistic Privateers',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles deprecated KO4', () => {
    const fileTxt = getFile('KO4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(KHARADRON_OVERLORDS)
    expect(res.selections.traits).toEqual([
      "FOOTNOTE: There's Always a Breeze if You Look for it",
      "AMENDMENT: Don't Argue With the Wind",
      'ARTYCLE: Master the Skies',
      'FOOTNOTE: Without Our Ships, We Are Naught',
      'Master Commander',
    ])
    expect(res.errors).toEqual([])
  })

  it('handles Stormcast4', () => {
    const fileTxt = getFile('Stormcast4')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.traits).toEqual(['Keen-clawed', 'Lithe-Limbed'])
  })

  it('handles Slaanesh1', () => {
    const fileTxt = getFile('Slaanesh1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.allyFactionNames).toEqual([MERCENARY_COMPANIES])
  })

  it('handles Slaanesh2', () => {
    const fileTxt = getFile('Slaanesh2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(SLAANESH)
    expect(res.selections).toEqual({
      allegiances: ['Pretenders Host'],
      artifacts: [
        'The Crown of Dark Secrets (Pretenders)',
        'Sceptre of Domination (Pretenders)',
        'Sliverslash (Pretenders)',
      ],
      battalions: [],
      commands: ['Excess of Violence'],
      endless_spells: [],
      scenery: [],
      spells: [
        'Hysterical Frenzy (Daemon)',
        'Slothful Stupor (Greater Daemon)',
        'Soulslice Shards (Daemon)',
        'Cacophonic Choir',
        'Overwhelming Acquiescence',
      ],
      traits: ['True Child of Slaanesh (Pretenders)', 'Monarch of Lies (Pretenders)'],
      triumphs: [],
      units: [
        'Keeper of Secrets w/ Living Whip',
        'The Contorted Epitome',
        'The Masque',
        'Keeper of Secrets w/ Ritual Knife',
      ],
    })
  })

  it('handles Skryre1', () => {
    const fileTxt = getFile('Skryre1')
    const pages = handleAzyrPages(fileTxt)
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
    const fileTxt = getFile('Seraphon1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'Fangs of Sotek',
        },
      ],
      factionName: SERAPHON,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: [],
        artifacts: [],
        battalions: ['Sunclaw Starhost'],
        commands: ['Gift from the Heavens', 'Herald of the Old Ones'],
        endless_spells: [],
        scenery: [],
        spells: ["Comet's Call"],
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

  it('handles deprecated KO1', () => {
    const fileTxt = getFile('KO1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'warn',
          text: 'These Are Just Guidelines',
        },
      ],
      factionName: KHARADRON_OVERLORDS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Barak-Thryng, City of the Ancestors (Skyport)'],
        artifacts: ['Grudgehammer'],
        battalions: [],
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
          'ARTYCLE: Settle the Grudges',
          'AMENDMENT: Trust to Your Guns',
          'FOOTNOTE: Honour the Gods, Just in Case',
          'ARTYCLE: Chronicle of Grudges',
          'AMENDMENT: Take Help Where You Can Get It',
          'Supremely Stubborn',
        ],
        triumphs: [],
        units: [
          'Aether-Khemist',
          'Aetheric Navigator',
          'Arkanaut Admiral',
          'Bjorgen Thundrik',
          'Brokk Grungsson, Lord-Magnate of Barak-Nar',
          'Endrinmaster with Dirigible Suit',
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
    const fileTxt = getFile('Skaven1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Grey Seer'. Please check that we have imported the correct one.",
        },
      ],
      factionName: SKAVEN,
      origin_realm: null,
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
          'Wither',
          'Warp Lightning',
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
      unknownSelections: [],
    })
  })

  it('handles Fyreslayers2', () => {
    const fileTxt = getFile('Fyreslayers2')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Auric Runesmiter'. Please check that we have imported the correct one.",
        },
        {
          severity: 'ambiguity-warn',
          text:
            "Azyr lists more than one unit as 'Auric Runeson'. Please check that we have imported the correct one.",
        },
      ],
      factionName: FYRESLAYERS,
      origin_realm: null,
      realmscape_feature: null,
      realmscape: AQSHY,
      selections: {
        allegiances: ['Hermdar (Lodge)'],
        artifacts: ['Tyrant Slayer'],
        battalions: [],
        commands: ['Skull-breakers and Oath-takers', 'Honour Our Oaths', 'Dauntless Assault'],
        endless_spells: ['Runic Fyrewall'],
        scenery: [],
        spells: ['Prayer of Ash'],
        traits: ['Fire-claw Adult', 'Warrior Indominate'],
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
    const fileTxt = getFile('BoC1')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res).toEqual({
      allyFactionNames: ['SLAVES_TO_DARKNESS'],
      allySelections: {
        SLAVES_TO_DARKNESS: {
          battalions: [],
          units: [
            'Sayl the Faithless',
            'Theddra Skull-Scryer',
            'Darkoath Warqueen',
            'Untamed Beasts',
            'Godsworn Hunt',
            'Furies',
          ],
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
      origin_realm: null,
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
        commands: ['Grisly Trophy', "Slaughterer's Call"],
        endless_spells: [],
        scenery: [],
        spells: [
          'Sundering Blades (Thunderscorn Wizard)',
          'Tendrils of Atrophy (Brayherd Wizard)',
          'Titanic Fury (Brayherd Wizard)',
          'Summon Lightning',
          'Devolve',
          'Boon of Mutation',
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

  it('warns about ambiguous selections', () => {
    const fileTxt = getFile('Stormcast5')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(STORMCAST_ETERNALS)
    expect(res.selections.units).toEqual([
      'Lord-Arcanum',
      'Lord-Celestant',
      'Evocators',
      'Prosecutors with Celestial Hammers',
      'Vanguard-Raptors with Hurricane Crossbows',
    ])
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Celestant'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Evocators'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Prosecutors'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Vanguard-Raptors'. Please check that we have imported the correct one.",
      },
    ])
  })

  it('warns about ambiguous selections in allies', () => {
    const fileTxt = getFile('Fyreslayers3')
    const pages = handleAzyrPages(fileTxt)
    const res = getAzyrArmyFromPdf(pages)
    expect(res.factionName).toEqual(FYRESLAYERS)
    expect(res.selections.units).toEqual(['Auric Runeson', 'Vulkite Berzerkers'])
    expect(res.allySelections[STORMCAST_ETERNALS]).toEqual({
      battalions: [],
      units: ['Lord-Arcanum', 'Evocators', 'Prosecutors with Stormcall Javelins'],
    })
    expect(res.errors).toEqual([
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Auric Runeson'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Lord-Arcanum'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Evocators'. Please check that we have imported the correct one.",
      },
      {
        severity: 'ambiguity-warn',
        text:
          "Azyr lists more than one unit as 'Prosecutors'. Please check that we have imported the correct one.",
      },
    ])
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
