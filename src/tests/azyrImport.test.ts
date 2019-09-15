import { readFileSync } from 'fs'
import { getAzyrPdfText, handleAzyrPages } from 'components/input/azyr/azyrPdf'

import SeraphonJSON from './fixtures/azyr/pdf/Seraphon.json'
import ChamonJSON from './fixtures/azyr/pdf/Chamon.json'
import NagashJSON from './fixtures/azyr/pdf/Newgash.json'
import NoRealmJSON from './fixtures/azyr/pdf/NoRealmscape.json'

const pdfText = readFileSync(__dirname + '/fixtures/azyr/pdf/Cats.and.Judicators.2000.pdf').buffer

// TODO: Get this to work :(
// https://github.com/mozilla/pdf.js/issues/7612
xdescribe('getAzyrArmy', () => {
  it('does it', async () => {
    const typedArray = new Uint8Array(pdfText as any)
    const res = await getAzyrPdfText(typedArray)
    console.log(res)
  }, 300000)
})

/**
 * Testing the Azyr import is a little wonky,
 * because as of right now,
 * importing PDF's locally doesn't work in the local test environment
 *
 * The workaround is to `yarn start` and drop your PDF in the box
 * Then copy the output that says "Copy me" into a JSON file
 *
 * Then test against that JSON below
 */
describe('handleAzyrPages', () => {
  it('handles a simple Seraphon army', () => {
    const res = handleAzyrPages(SeraphonJSON)
    expect(res).toEqual([
      'FACTION: Seraphon',
      'UNIT: Slann Starmaster',
      'UNIT: Engine of the Gods',
      'UNIT: Saurus Astrolith Bearer',
      'UNIT: Skink Priest',
      'UNIT: Saurus Warriors',
      'BATTALION: Fangs of Sotek',
      'BATTALION: Sunclaw Starhost',
    ])
  })

  it('handles a Chamon-only pdf', () => {
    const res = handleAzyrPages(ChamonJSON)
    expect(res).toEqual(['FACTION: Death', 'REALMSCAPE: CHAMON'])
  })

  it('handles a faction-only pdf', () => {
    const res = handleAzyrPages(NoRealmJSON)
    expect(res).toEqual(['FACTION: Death'])
  })

  it('handles a Nagash army', () => {
    const res = handleAzyrPages(NagashJSON)
    console.log(res)
    expect(res).toEqual([
      'FACTION: Grand Host of Nagash',
      'REALMSCAPE: SHYISH',
      'UNIT: Necromancer',
      'UNIT: Nagash, Supreme Lord of the Undead',
      'UNIT: Grave Guard',
      'UPGRADE: Standar d Bear er',
      'UPGRADE: Hornblower',
      'UNIT: Chainrasp Horde',
      'ENDLESS SPELL: Umbral Spellportal',
      'ENDLESS SPELL: Purple Sun of Shyish',
    ])
  })
})
