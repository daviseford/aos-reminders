import matchAll from 'string.prototype.matchall'

export const parsePdf = (pdfText: string) => {
  const regex = /^\((.+)\) Tj$/gm
  const matches = matchAll(pdfText, regex)

  const result = [...matches].map(x => x[1].trim())

  return result
}

export const getWarscrollArmyFromPdf = (pdfText: string[]) => {
  const text = pdfText
    .map(x => x.replace(/\\\([0-9]+\\\)/g, '')) // Remove point values e.g. "Slann Starmaster (360)"
    .map(x => x.replace(/[0-9]+ x /g, '')) // Remove quantity from units e.g. "3 x Razordons"
    .map(x => x.trim())
    .filter(x => !!x && x !== 'Warscroll Builder on www.warhammer-community.com')

  let factionName = ''
  let factionRealm = ''

  let selector = ''

  const selections = text.reduce(
    (accum, t) => {
      // Get Allegiance and Mortal Realm
      // e.g. 'Allegiance: Seraphon - Mortal Realm: Ghyran',
      if (t.startsWith('Allegiance:')) {
        const parts = t.split('-', 2).map(t => t.trim())
        factionName = parts[0].substring(12).trim()
        if (parts.length > 1 && t.includes('Mortal Realm:')) {
          factionRealm = parts[1].substring(14).trim()
        }
        return accum
      }

      if (['LEADERS', 'UNITS', 'BEHEMOTHS'].includes(t)) {
        selector = 'units'
        return accum
      }

      if (t === 'BATTALIONS') {
        selector = 'battalions'
        return accum
      }

      if (t === 'ENDLESS SPELLS / TERRAIN') {
        selector = 'endless_spells'
        return accum
      }

      if (t.startsWith('- ')) {
        if (t.startsWith('- Command Trait : ')) {
          const trait = t.split('- Command Trait : ')[1].trim()
          accum.traits = accum.traits.concat(trait)
          return accum
        }
        if (t.startsWith('- Artefact : ')) {
          const artifact = t.split('- Artefact : ')[1].trim()
          accum.artifacts = accum.artifacts.concat(artifact)
          return accum
        }
        if (t.startsWith('- Spell : ')) {
          const spell = t.split('- Spell : ')[1].trim()
          accum.spells = accum.spells.concat(spell)
          return accum
        }
        return accum
      }

      // Check for end of file stuff
      if (['TOTAL: ', 'LEADERS: ', 'ARTEFACTS: '].some(e => t.startsWith(e))) {
        return accum
      }

      // Add item to accum
      if (selector) {
        accum[selector] = accum[selector].concat(t)
      }

      return accum
    },
    {
      allegiances: [] as string[],
      artifacts: [] as string[],
      battalions: [] as string[],
      endless_spells: [] as string[],
      scenery: [] as string[],
      spells: [] as string[],
      traits: [] as string[],
      units: [] as string[],
    }
  )

  return { selections, factionName, factionRealm }
}
