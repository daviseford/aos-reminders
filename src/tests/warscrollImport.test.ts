import { getWarscrollArmyFromPdf, getWarscrollArmyFromText } from 'utils/warscroll/getWarscrollArmy'
import { readFileSync } from 'fs'
import { parsePdf } from 'utils/pdf/pdfUtils'
import { SERAPHON } from 'meta/factions'

// getWarscrollArmyFromPdf
// getWarscrollArmyFromText
describe('getWarscrollArmyFromPdf', () => {
  it('reads a basic warscroll pdf file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonNoMetadata.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

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
        'Razordons',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a warscroll pdf file with metadata correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonWithMetadata.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

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
        'Razordons',
        'Ripperdactyl Riders',
        'Skinks',
        'Bastiladon w/ Ark of Sotek',
      ],
    })
  })

  it('reads a complex warscroll pdf file with allies correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/pdf/SeraphonMultipleAllies.pdf', 'utf8')
    const parsedText = parsePdf(pdfText)
    const warscrollTxt = getWarscrollArmyFromPdf(parsedText)

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
})

describe('getWarscrollArmyFromText', () => {
  it('reads a basic warscroll text file correctly', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonNoMetadata.txt', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonWithMetadata.txt', 'utf8')
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
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/SeraphonMultipleAllies.txt', 'utf8')
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

  it('detects and returns an error if reading a short summary txt', () => {
    const pdfText = readFileSync(__dirname + '/fixtures/warscroll/txt/ShortSummary.txt', 'utf8')
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
