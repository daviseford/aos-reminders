import { readFileSync } from 'fs'
import path from 'path'
import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import {
  CITIES_OF_SIGMAR,
  FLESH_EATER_COURTS,
  FYRESLAYERS,
  SKAVEN,
  BIG_WAAAGH,
  BONESPLITTERZ,
} from 'meta/factions'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}`), 'utf8'))
}

describe('getWarscrollArmyFromPdf', () => {
  it("should work with Bonesplitterz Burnin' Tattooz", () => {
    const parsedText = getFile('1571240331862-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BONESPLITTERZ)
    expect(warscrollTxt.selections.allegiances).toEqual(['Drakkfoot Clan'])
    expect(warscrollTxt.selections.artifacts).toEqual(["Burnin' Tattooz"])
    expect(warscrollTxt.errors).toEqual([])
  })

  it('should work with Cities of Sigmar', () => {
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

  it('should work with Cities of Sigmar', () => {
    const parsedText = getFile('1571233444845-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(CITIES_OF_SIGMAR)

    // TODO: This should be empty once we add ally detection
    expect(warscrollTxt.errors).toEqual([
      { text: 'Knight-Azyros', severity: 'warn' },
      { text: 'Desolators', severity: 'warn' },
    ])
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

  xit('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571165179317-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
    expect(warscrollTxt.errors).toEqual([])
  })

  xit('should work with Orruk Warboss', () => {
    const parsedText = getFile('1571171962804-Warscroll_Builder.json')
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

    expect(warscrollTxt.factionName).toEqual(BIG_WAAAGH)
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
