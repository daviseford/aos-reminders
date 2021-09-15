import { readFileSync } from 'fs'
import path from 'path'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarscrollArmyFromJson', () => {
  xit('should correctly read 1626346073420-Warscroll_Builder', () => {
    const parsedText = getFile('Seraphon1')
    // const res = getWarscrollArmyFromPdf(parsedText)
    // expect(res.selections.command_traits).toContain('Devoted Disciple')
    // expect(res.errors).toEqual([])
  })
})
