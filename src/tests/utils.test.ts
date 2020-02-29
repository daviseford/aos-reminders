import { AQSHY, ULGU } from 'types/realmscapes'
import { getRealmscape } from 'utils/realmUtils'

describe('realmUtils', () => {
  it('should return the correct realm from a given string', () => {
    const test1 = `Something from ${AQSHY}`
    const test2 = `A thing from ${ULGU}, wahoo`
    const test3 = `Incorrect capitalization of ULGU will not work`
    expect(getRealmscape(test1)).toEqual(AQSHY)
    expect(getRealmscape(test2)).toEqual(ULGU)
    expect(getRealmscape(test3)).toEqual(null)
  })
})
