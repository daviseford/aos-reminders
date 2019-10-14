import { getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { readFileSync } from 'fs'
import path from 'path'
import { ORDER_GRAND_ALLIANCE, SERAPHON } from 'meta/factions'

const getFile = (filename: string) => {
  return readFileSync(path.resolve(`src/tests/fixtures/warscroll/txt/${filename}`), 'utf8')
}

describe('getWarscrollArmyFromText', () => {
  it('reads a basic warscroll text file correctly', () => {
    const pdfText = getFile('SeraphonNoMetadata.txt')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ['Meteoric Convocation', 'Claws of Glory'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Skinks',
        'Razordons',
        'Ripperdactyl Riders',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a basic warscroll text file correctly', () => {
    const pdfText = getFile('SeraphonWithMetadata.txt')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Incandescent Rectrices', 'Zoetic Dial'],
      battalions: ['Shadowstrike Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex', 'Chronomantic Cogs'],
      scenery: [],
      spells: ['Meteoric Convocation', 'Claws of Glory'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: [
        'Slann Starmaster',
        'Skink Starpriest',
        'Saurus Astrolith Bearer',
        'Skinks',
        'Razordons',
        'Ripperdactyl Riders',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a complex warscroll txt file with allies correctly', () => {
    const pdfText = getFile('SeraphonMultipleAllies.txt')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    // Sisters of Slaughter is not correctly marked as an ally, so it raises an error
    expect(warscrollTxt.errors).toEqual([
      {
        text: 'Sisters of Slaughter',
        severity: 'warn',
      },
    ])

    expect(warscrollTxt.factionName).toEqual(SERAPHON)
    expect(warscrollTxt.allyFactionNames).toEqual([
      'DAUGHTERS_OF_KHAINE',
      'KHARADRON_OVERLORDS',
      'STORMCAST_ETERNALS',
      'SYLVANETH',
    ])
    expect(warscrollTxt.allyUnits).toEqual([
      'Knight-Incantor',
      'Morathi High Oracle of Khaine',
      'Concussors',
      'Kurnoth Hunters',
      'Grundstok Gunhauler',
    ])
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Zoetic Dial'],
      battalions: ['Eternal Starhost'],
      commands: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: ['Walk Between Realms'],
      traits: ['Great Rememberer'],
      triumphs: [],
      units: ['Slann Starmaster', 'Bastiladon w/ Ark of Sotek'],
    })
  })

  it('reads an Order meeting engagement txt file correctly', () => {
    const pdfText = getFile('OrderMeetingEngagement.txt')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    expect(warscrollTxt.factionName).toEqual(ORDER_GRAND_ALLIANCE)
    expect(warscrollTxt.errors).toEqual([])
    expect(warscrollTxt.selections).toEqual({
      allegiances: [],
      artifacts: ['Obstinate Blade (Order)'],
      battalions: ['Shadow Patrol'],
      commands: [],
      endless_spells: ['Balewind Vortex'],
      scenery: [],
      spells: [],
      traits: ['Dauntless (Order)'],
      triumphs: [],
      units: [
        'Doomfire Warlocks',
        'Bloodwrack Medusa',
        'Khinerai Heartrenders',
        'Sisters of Slaughter',
        'Avatar of Khaine',
      ],
    })
  })

  it('detects and returns an error if reading a short summary txt', () => {
    const pdfText = getFile('ShortSummary.txt')
    const warscrollTxt = getWarscrollArmyFromText(pdfText)

    expect(warscrollTxt.errors).toEqual([
      {
        text:
          'Are you using the "Short" summary from Warscroll Builder? Please use the "Full" summary and try again.',
        severity: 'error',
      },
    ])
  })
})
