import { readFileSync } from 'fs'
import path from 'path'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'
import { cleanWarhammerAppText } from 'utils/warhammer_app/warhammerAppUtils'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarhammerAppArmy', () => {
  it('should correctly read Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    const cleanedText = cleanWarhammerAppText(parsedText)
    const res = getWarhammerAppArmy(cleanedText)
    console.log(res)
    expect(res.errors).toEqual([])
  })

  xit('should correctly read Fyreslayers1', () => {
    const parsedText = getFile('Fyreslayers1')
    // const res = getWarscrollArmyFromPdf(parsedText)
    // expect(res.selections.command_traits).toContain('Devoted Disciple')
    // expect(res.errors).toEqual([])
  })
})
