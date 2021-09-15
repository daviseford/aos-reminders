import { readFileSync } from 'fs'
import path from 'path'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarhammerAppArmy', () => {
  xit('should correctly read Seraphon1', () => {
    const parsedText = getFile('Seraphon1')
    // const res = getWarscrollArmyFromPdf(parsedText)
    // expect(res.selections.command_traits).toContain('Devoted Disciple')
    // expect(res.errors).toEqual([])
  })

  xit('should correctly read Fyreslayers1', () => {
    const parsedText = getFile('Fyreslayers1')
    // const res = getWarscrollArmyFromPdf(parsedText)
    // expect(res.selections.command_traits).toContain('Devoted Disciple')
    // expect(res.errors).toEqual([])
  })
})
