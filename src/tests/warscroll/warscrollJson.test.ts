import { getWarscrollArmyFromPdf } from 'utils/warscroll/getWarscrollArmy'
import { readFileSync } from 'fs'
import { parsePdf } from 'utils/pdf/pdfUtils'
import path from 'path'
import {
  BIG_WAAAGH,
  CITIES_OF_SIGMAR,
  KHARADRON_OVERLORDS,
  NIGHTHAUNT,
  ORDER_GRAND_ALLIANCE,
  SERAPHON,
  SLAANESH,
} from 'meta/factions'

const getFile = (filename: string): string[] => {
  return JSON.parse(readFileSync(path.resolve(`src/tests/fixtures/warscroll/json/${filename}`), 'utf8'))
}

describe('getWarscrollArmyFromPdf', () => {
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
