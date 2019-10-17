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
  SERAPHON,
  SKAVEN,
} from 'meta/factions'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}`), 'utf8'))
}

describe('getWarscrollArmyFromPdf', () => {
  // Uncomment when https://github.com/daviseford/aos-reminders/issues/575 is resolved
  xit('should work with allied endless spells', () => {
    const parsedText = getFile('1571327027143-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections.endless_spells).toContain('Everblaze Comet')
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Bonesplitterz', () => {
    const parsedText = getFile('1571329765256-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.errors).toEqual([])
  })

  // TODO: Uncomment once we add ally detection
  xit('should work with allied Grundstock Thunderers', () => {
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

    // TODO: This should be empty once we add ally detection
    expect(warscrollTxt.errors).toEqual([
      { text: 'Knight-Azyros', severity: 'warn' },
      { text: 'Prosecutors with Celestial Hammers', severity: 'warn' },
    ])
  })

  xit('should work with Cities of Sigmar and allies', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)

    // TODO: This should be empty once we add ally detection
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
      // We should consider adding some logic that would look up Liberators
      // (by searching all armies in the same Grand Alliance)
      // Find out they are in SCE and add SCE as an ally + Liberators as an allyUnit
      // For now, this is an acceptable error
      // This is mainly a mockup of what a WSB JSON test should look like
      errors: [{ text: 'Liberators', severity: 'warn' }],
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
