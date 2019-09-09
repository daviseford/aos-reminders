import matchAll from 'string.prototype.matchall'
import { SERAPHON } from 'meta/factions'

export const parsePdf = (pdfText: string) => {
  const regex = /^\((.+)\) Tj$/gm
  const matches = matchAll(pdfText, regex)

  const result = [...matches].map(x => x[1].trim())

  return result
}

export const getWarscrollArmyFromPdf = (pdfText: string[]) => {
  const cleanedText = pdfText
    .map(txt =>
      txt
        .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
        .replace(/\\\([0-9]+\\\)/g, '') // Remove point values e.g. "Slann Starmaster \(360\)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .trim()
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )

  let factionName = ''
  let factionRealm = ''
  let selector = ''
  let error = null

  const selections = cleanedText.reduce(
    (accum, txt) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      // or 'Davis Ford - Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (txt.includes('Allegiance:')) {
        const nameRemoved = txt.replace(/.+ - Allegiance: /g, '')
        const parts = nameRemoved.split('-').map(t => t.trim())
        const name = parts[0].trim()

        if (warscrollFactionNameMap[name]) {
          factionName = warscrollFactionNameMap[name] || ''
        }

        if (parts.length > 1 && txt.includes('Mortal Realm:')) {
          factionRealm = parts[1].substring(14).trim()
        }
        return accum
      }

      if (['LEADERS', 'UNITS', 'BEHEMOTHS'].includes(txt)) {
        selector = 'units'
        return accum
      }

      if (txt === 'BATTALIONS') {
        selector = 'battalions'
        return accum
      }

      if (txt === 'ENDLESS SPELLS / TERRAIN') {
        selector = 'endless_spells'
        return accum
      }

      if (txt.startsWith('- ')) {
        if (txt.startsWith('- General')) return accum
        if (txt.startsWith('- Command Trait : ')) {
          const trait = txt.split('- Command Trait : ')[1].trim()
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (txt.startsWith('- Artefact : ')) {
          const artifact = txt.split('- Artefact : ')[1].trim()
          accum.artifacts = accum.artifacts.concat(artifact)
          return accum
        }
        if (txt.startsWith('- Spell : ')) {
          const spell = txt.split('- Spell : ')[1].trim()
          accum.spells = accum.spells.concat(spell)
          return accum
        }

        // Add weapon options and other configuration
        if (selector === 'units' && accum[selector].length > 0) {
          const attr = txt
            .split('-')[1]
            .replace('Weapon : ', '')
            .trim()

          if (warscrollUnitOptionMap[attr]) {
            const accumMock = [...accum[selector]]
            accumMock.pop()
            accumMock.push(warscrollUnitOptionMap[attr])
            accum[selector] = accumMock
          }
        }

        return accum
      }

      // Check for end of file stuff
      if (['TOTAL: ', 'LEADERS: ', 'ARTEFACTS: '].some(e => txt.startsWith(e))) {
        selector = ''
        return accum
      }

      // Add item to accum
      if (selector) {
        accum[selector] = accum[selector].concat(txt)
      }

      return accum
    },
    {
      allegiances: [] as string[],
      artifacts: [] as string[],
      battalions: [] as string[],
      commands: [] as string[],
      endless_spells: [] as string[],
      scenery: [] as string[],
      spells: [] as string[],
      traits: [] as string[],
      triumphs: [] as string[],
      units: [] as string[],
    }
  )

  return {
    selections,
    factionName,
    factionRealm,
    error,
    allyFactionNames: [],
    allySelections: [],
    realmscape_feature: null,
    realmscape: null,
  }
}

const warscrollFactionNameMap = {
  Seraphon: SERAPHON,
}

// const warscrollUnitTypoMap = {}

const warscrollUnitOptionMap = {
  'Ark of Sotek': 'Bastiladon w/ Ark of Sotek',
  'Solar Engine': 'Bastiladon w/ Solar Engine',
  'Cloak of Feathers': 'Skink Priest w/ Cloak of Feathers',
  'Priestly Trappings': 'Skink Priest w/ Priestly Trappings',
  'Skystreak Bow': 'Stegadon w/ Skystreak Bow',
  'Sunfire Throwers': 'Stegadon w/ Sunfire Throwers',
  'Ritual Knife': 'Keeper of Secrets w/ Ritual Knife',
  'Living Whip': 'Keeper of Secrets w/ Living Whip',
  'Shining Aegis': 'Keeper of Secrets w/ Shining Aegis',
  'Sinistrous Hand': 'Keeper of Secrets w/ Sinistrous Hand',
}
