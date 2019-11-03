import { readFileSync } from 'fs'
import path from 'path'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import {
  BIG_WAAAGH,
  BONESPLITTERZ,
  CITIES_OF_SIGMAR,
  DESTRUCTION_GRAND_ALLIANCE,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  GLOOMSPITE_GITZ,
  IRONJAWZ,
  KHORNE,
  ORDER_GRAND_ALLIANCE,
  SERAPHON,
  SKAVEN,
  SLAANESH,
  STORMCAST_ETERNALS,
  SYLVANETH,
  TZEENTCH,
} from 'meta/factions'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}`), 'utf8'))
}

describe('getWarscrollArmyFromPdf', () => {
  it('should work with FEC', () => {
    const parsedText = getFile('1572735282204-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Enrapturing Circlet', () => {
    const parsedText = getFile('1572660547365-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SLAANESH)
    expect(warscrollTxt.selections.artifacts).toContain('Enrapturing Circlet (Godseekers Host)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak', () => {
    const parsedText = getFile('1572694928061-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Flaypelt Cloak (part 2)', () => {
    const parsedText = getFile('1572695046339-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.selections.artifacts).toContain('Flaypelt Cloak (Verminus)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Warpcog Convocation', () => {
    const parsedText = getFile('1571895994578-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    // These attributes come from the Warpcog Convocation battalion
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'Arkhspark Voltik',
      },
      {
        severity: 'warn',
        text: 'Rattlegauge Warplock',
      },
    ])
  })

  it('should work with Dark Wizardry', () => {
    const parsedText = getFile('1572497009675-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.selections.traits).toContain('Dark Wizardry (Royalty)')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Blade of Endless Bloodshed', () => {
    const parsedText = getFile('1571896391287-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(KHORNE)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Windthief Charm', () => {
    const parsedText = getFile('1572003972006-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(TZEENTCH)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Hammers of Augury', () => {
    const parsedText = getFile('1572043447588-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(STORMCAST_ETERNALS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Destroyer of Foes', () => {
    const parsedText = getFile('1572123301755-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Bonesplitterz spells', () => {
    const parsedText = getFile('1572206506395-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with legacy Order units', () => {
    const parsedText = getFile('1572245593799-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(warscrollTxt.errors).toEqual([
      {
        severity: 'warn',
        text: 'Archmage',
      },
      {
        severity: 'warn',
        text: 'Swordmasters',
      },
      {
        severity: 'warn',
        text: 'Spireguard',
      },
      {
        severity: 'warn',
        text: 'High Warden',
      },
    ])
  })

  it('should work with allied endless spells', () => {
    const parsedText = getFile('1571327027143-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections.endless_spells).toContain('Everblaze Comet')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Horn of the Consort', () => {
    const parsedText = getFile('1571520651334-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SYLVANETH)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.artifacts).toEqual(['Horn of the Consort'])
  })

  it('should work with Ironjawz allied with Gloomspite Gitz', () => {
    const parsedText = getFile('1571425644480-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(IRONJAWZ)
    expect(warscrollTxt.selections.artifacts).toEqual(["Metalrippa's Klaw", 'Thermalrider Cloak (Aqshy)'])
    expect(warscrollTxt.allyFactionNames).toEqual([BONESPLITTERZ, GLOOMSPITE_GITZ])
    expect(warscrollTxt.allySelections).toEqual({
      BONESPLITTERZ: { units: ['Wurrgog Prophet'] },
      GLOOMSPITE_GITZ: { units: ['Fungoid Cave-Shaman'] },
    })
    expect(warscrollTxt.selections.units).toEqual([
      'Megaboss on Maw-Krusha',
      'Orruk Megaboss',
      'Orruk Warchanter',
      'Orruk Ardboys',
      'Orruk Brutes',
      'Orruk Gore-gruntas',
    ])
    expect(warscrollTxt.selections.endless_spells).toContain('Scuttletide')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Bonesplitterz', () => {
    const parsedText = getFile('1571329765256-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Grundstock Thunderers', () => {
    const parsedText = getFile('1571347470427-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.units).toContain('Grundstok Thunderers')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Horribly Resilient typo', () => {
    const parsedText = getFile('1571263525536-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Anointed on Frostheart Phoenix', () => {
    const parsedText = getFile('1571285206236-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.units).toContain('Anointed on Frostheart Phoenix')
    expect(warscrollTxt.errors).toEqual([])
  })

  // Uncomment when https://github.com/daviseford/aos-reminders/issues/598 is complete
  xit('should work with Firebelly', () => {
    const parsedText = getFile('1571287948786-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(DESTRUCTION_GRAND_ALLIANCE)
    expect(warscrollTxt.selections.units).toContain('Firebelly')
    expect(warscrollTxt.errors).toEqual([])
  })

  it("should work with Bonesplitterz Burnin' Tattooz", () => {
    const parsedText = getFile('1571240331862-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.selections.allegiances).toEqual(['Drakkfoot Clan'])
    expect(warscrollTxt.selections.artifacts).toEqual(["Burnin' Tattooz"])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571220408099-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.selections.spells).toContain('Vitriolic Spray (Anvilgard)')
    expect(warscrollTxt.selections.traits).toContain('Secretive Warlock (Anvilgard)')
    expect(warscrollTxt.selections.units).toContain('Knight-Azyros')
    expect(warscrollTxt.selections.units).toContain('Prosecutors with Celestial Hammers')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with FEC Command Traits', () => {
    const parsedText = getFile('1571084621521-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FLESH_EATER_COURTS)
    expect(warscrollTxt.selections.traits).toEqual(['The Feast Day (Delusion)', 'Dark Acolyte (Nobility)'])
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.unknownSelections).toEqual([])
  })

  it('should work with The Grand Fyrd of Furios Peak', () => {
    const parsedText = getFile('1571131908806-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(FYRESLAYERS)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections.battalions).toEqual([
      'Forge Brethren',
      'Lords of Vostarg',
      'Lords of the Lodge',
      'The Grand Fyrd of Furios Peak',
      'Vostarg Forge Brethren',
      'Vostarg Warrior Kinband',
      'Warrior Kinband',
    ])
  })

  xit('should work with Voltik', () => {
    const parsedText = getFile('1571158898802-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SKAVEN)
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571165179317-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.units).toContain('Orruk Warboss')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571171962804-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.selections.units).toContain('Orruk Warboss')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should figure out allies from context clues', () => {
    const parsedText = getFile('1571040089053-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)
    expect(warscrollTxt).toEqual({
      allyFactionNames: [],
      allySelections: {},
      allyUnits: [],
      errors: [],
      factionName: 'CITIES_OF_SIGMAR',
      realmscape_feature: null,
      realmscape: null,
      selections: {
        allegiances: ['Greywater Fastness'],
        artifacts: ['Runic Munitions (Greywater Fastness)', "Aiban's Hidden Blade (Chamon)"],
        battalions: [],
        commands: [],
        endless_spells: [],
        scenery: [],
        spells: ['Choking Fumes (Greywater Fastness)', 'Transmutation of Lead (Chamon)'],
        traits: ['Ghoul Mere Ranger (Greywater Fastness)'],
        triumphs: [],
        units: [
          'Runelord',
          'Irondrakes',
          'Gyrobombers',
          'Battlemage',
          'Liberators',
          'Cogsmith',
          'Freeguild Guard',
          'Helblaster Volley Gun',
        ],
      },
      unknownSelections: [
        'Warhammer & Shield',
        'Grandhammers',
        'Warblade & Shield',
        'Grandblades',
        'Halberds and Shields',
      ],
    })
  })
})
