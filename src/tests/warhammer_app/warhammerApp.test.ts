import { readFileSync } from 'fs'
import { GLOOMSPITE_GITZ, NURGLE, SKAVEN, SYLVANETH } from 'meta/factions'
import path from 'path'
import { getWarhammerAppArmy } from 'utils/warhammer_app/getWarhammerAppArmy'

const getFile = (filename: string): string => {
  return readFileSync(path.resolve(`src/tests/fixtures/warhammer_app/${filename}.txt`), 'utf8')
}

describe('getWarhammerAppArmy', () => {
  it('should correctly read 1706904119603-Warhammer_App', () => {
    const parsedText = getFile('1706904119603-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain("Gryselle's Arenai")
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1707162510353-Warhammer_App', () => {
    const parsedText = getFile('1707162510353-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain('Kruleboyz Monsta-killaz')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1707409327935-Warhammer_App', () => {
    const parsedText = getFile('1707409327935-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(NURGLE)
    expect(res.selections.units).toContain('Skabbik Plagueseeker')
    expect(res.selections.units).toContain("Skabbik's Plaguepack")
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1707428733911-Warhammer_App', () => {
    const parsedText = getFile('1707428733911-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.subFactionName).toEqual('Host of the Everchosen')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1707522049892-Warhammer_App', () => {
    const parsedText = getFile('1707522049892-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.grand_strategies).toContain('The Scales Balanced')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1707564526882-Warhammer_App', () => {
    const parsedText = getFile('1707564526882-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain('Grotmas Gitz')
  })

  it('should correctly read Sylvaneth_Seasons_vs_Subfaction', () => {
    const parsedText = getFile('Sylvaneth_Seasons_vs_Subfaction')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(SYLVANETH)
    expect(res.selections.flavors).toContain('Oakenbrow')
    expect(res.subFactionName).toEqual('The Dwindling')
  })

  it('should correctly read Dec_22_update', () => {
    const parsedText = getFile('Dec_22_update')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(GLOOMSPITE_GITZ)
    expect(res.selections.flavors).toContain("Glogg's Megamob")
    expect(res.selections.units).toContain('Loonboss')
    expect(res.selections.grand_strategies).toContain('Sever the Head')
    expect(res.selections.spells).toContain('Itchy Nuisance')
    expect(res.selections.battalions).toContain('Battle Regiment')
    expect(res.selections.battalions).toContain('Linebreaker')
    expect(res.selections.battalions).toContain('Warlord')
    expect(res.selections.scenery).toContain('Bad Moon Loonshrine')
  })

  it('should correctly read 1640117854602-Warhammer_App', () => {
    const parsedText = getFile('1640117854602-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)

    expect(res.selections.units).toContain('Liberators')
    expect(res.selections.units).toContain('Knight-Incantor')
    expect(res.selections.units).toContain('Gardus Steel Soul')
    expect(res.selections.units).toContain('Lord-Arcanum on Tauralon')
    expect(res.selections.units).toContain('Lord-Relictor')
    expect(res.selections.units).toContain('Dracothian Guard Fulminators')
    expect(res.selections.units).toContain('Vanguard-Raptors with Longstrike Crossbows')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632565338858-Warhammer_App', () => {
    const parsedText = getFile('1632565338858-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Fuethan')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1633021235077-Warhammer_App', () => {
    const parsedText = getFile('1633021235077-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Blessed Sons')
  })

  // This shouldn't work, it's actually a Warscroll Builder list
  it('should correctly read 1631987356655-Warhammer_App', () => {
    const parsedText = getFile('1631987356655-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.errors).toEqual([
      {
        severity: 'error',
        text: 'There was a problem parsing this text. Please try copy + pasting it again from the Warhammer App.',
      },
    ])
  })

  it('should correctly read 1632069915266-Warhammer_App', () => {
    const parsedText = getFile('1632069915266-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.artifacts).toContain('Amulet of Silvered Sigmarite')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632078223244-Warhammer_App', () => {
    const parsedText = getFile('1632078223244-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.factionName).toEqual(SKAVEN)
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632087431639-Warhammer_App', () => {
    const parsedText = getFile('1632087431639-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.flavors).toContain('Dhom-Hain')
  })

  it('should correctly read 1632089083030-Warhammer_App', () => {
    const parsedText = getFile('1632089083030-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.units).toContain('Daemon Prince')
    expect(res.errors).toEqual([])
  })

  it('should correctly read 1632120973397-Warhammer_App', () => {
    const parsedText = getFile('1632120973397-Warhammer_App')
    const res = getWarhammerAppArmy(parsedText)
    expect(res.selections.battalions).toContain('Redemption Brotherhood')
    expect(res.errors).toEqual([])
  })
})
