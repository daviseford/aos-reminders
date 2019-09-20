import pdfjsLib from 'pdfjs-dist'
import { uniq } from 'lodash'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/textUtils'
import { isDev } from 'utils/env'

const sep = ', '
const commaAlt = `&&`
const HEADER = 'HEADER'

export const getPdfPages = async typedarray => {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`

    //Step 5:PDFJS should be able to read this
    const pdf = await pdfjsLib.getDocument(typedarray as any).promise

    var numPages: number[] = []
    for (let i = 0; i < pdf.numPages; i++) {
      numPages.push(i)
    }

    const pages = await Promise.all(
      numPages.map(async pageNumber => {
        const page = await pdf.getPage(pageNumber + 1)
        //@ts-ignore
        const textContent = await page.getTextContent({ normalizeWhitespace: true })
        return textContent.items
          .map(x => {
            // First time this appears, we are starting units
            // fontName: "g_d0_f1"
            // height: 17.99999925
            // str: "Leader"
            if (x.height > 15) return HEADER

            // Sample unit name = Keeper of Secrets, 13.600000000000001, g_d0_f2
            if (x.height > 13 && x.fontName === 'g_d0_f2') return `ITEM: ${x.str}`

            // if (isDev) console.log(x.str, x.height, x.fontName)

            return x.str
          })
          .join(' ')
      })
    )

    if (isDev) console.log('Copy me to JSON to debug: ', pages)

    return pages
  } catch (err) {
    console.error(err)
    return ['Error: Unable to read file.']
  }
}

export const handleAzyrPages = (pages: string[]): string[] => {
  const cleanedPages = pages.map(cleanAzyrText)
  const joinedPages = uniq(cleanedPages.join(sep).split(sep))

  const splitText = joinedPages
    .filter(x => {
      // if (isDev) console.log('Missing a prefix: ' + x)
      return !joinedPages.some(s => s.includes(x) && s !== x)
    })
    .map(x => x.replace(/&&/g, ',').replace(/AMPERSAND/g, '&'))

  if (isDev) console.table(splitText)

  return splitText
}

const handleFirstPass = (text: string) => {
  const titlePass = text
    .replace(/HEADER( HEADER)+/g, HEADER)
    .replace(/([A-Z]) ([a-z])/g, `$1$2`)
    .replace(/Role: {1,}(Leader|Battleline|Other)( {1,})?, {1,}Behemoth /g, 'Role: Leader  ')
    .replace(/( )?[‘’]/g, `'`) // Replace special quotes
    .replace(/[“”]/g, `"`) // Replace special quotes
    .replace(/([a-z])- ([a-z])/g, `$1-$2`) // Flesh- eater Courts -> Flesh-eater Courts
    .replace(/([\w]) {1,3}'s /g, `$1's `) // Ford 's -> Ford's
    .replace(/&/g, 'AMPERSAND') // Save any existing ampersands
    .replace(typoRegexp, match => commonTypos[match]) // Handle any known typos
    .replace(/General/g, ' ') // Handle any known typos
    .replace(allegianceRegexp, 'ALLEGIANCE:')
    .replace(/Realm of Battle:/g, 'REALMSCAPE:')
    .replace(/,/g, commaAlt) // Save any existing commas
    .replace(/ITEM: /g, sep)
    .replace(/([\w]) &&/g, `$1${commaAlt}`) // Remove leading whitespace in front of existing commas
    .replace(/Mercenary Company: {1,3}([\w-' ]+)(HEADER|Extra Command|(?:$))/g, mercenaryReplacer)
    .replace(/Extra Command [\w]+ Purchased \(.+\)/g, '') // Get rid of command point info

  const secondaryPass = titlePass
    .replace(
      /.+?Allegiance:([\w-' ]+)(HEADER|ALLEGIANCE:|REALMSCAPE:|MERCENARY COMPANY:|,|(?:$))/g,
      factionReplacer
    )
    .replace(
      /REALMSCAPE:.+(AQSHY|CHAMON|GHUR|GHYRAN|HYSH|SHYISH|STYGXX|ULGU)&& [\w- ]+?(HEADER|,|MERCENARY|(?:$))/g,
      realmscapeReplacer
    )
    .replace(unitRegexp, 'Role: UNIT')
    .replace(endlessRegexp, 'Role: ENDLESS SPELL')
    .replace(/Role: {1,4}Battalion/g, 'Role: BATTALION')
    .replace(spellRegexp, 'Spell:')
    .replace(/Army deemed .+valid/gi, ' ')
    .replace(/by Azyr Roster Builder/g, ' ')
    .replace(/[0-9]{1,4}pts[/][0-9]{1,4}pts Allies/gi, ' ')
    .replace(/[0-9]{1,4}pts/g, ' ')
    .replace(/Quantity: {2}[0-9]{1,2}/gi, ' ')
    .replace(markRegexp, ' ')
    .replace(/ {3}[\w-& ]+ See the .+? of this unit/gi, ' ')
    .replace(/This unit is also a Leader. Their details are listed within the Leader section./gi, sep)
    .replace(/\|/g, sep)
    .replace(/((Kharadron Code|ALLEGIANCE): [\w-&;' ]+) HEADER/g, `$1${sep}`) // KO stuff
    .replace(/HEADER/g, ' ')

  return secondaryPass
}

const cleanAzyrText = (text: string) => {
  const firstPass = handleFirstPass(text)

  // if (isDev) console.log('firstPass', firstPass)

  const secondPass = firstPass
    .replace(/ {2,4}/g, ' ')
    .replace(sceneryRegExp, ', SCENERY: $1, ')
    // This one in case of a '(s)' on the end of a trait/weapon
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w-' ]+)(\(.+?\))? (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      traitReplacer
    )
    .split(',')
    .map(x => x.trim())
    .filter(x => !!x)
    .join(sep)

  // if (isDev) console.log('secondPass', secondPass)

  const thirdPass = secondPass
    // You really do have to run this twice, really :(
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      `$1: $2${sep}$3`
    )
    // These next two lines handle Nagash, Supreme Lord of the Undead
    .replace(/(^|Role: UNIT +| {2})([\w-' ]+(&&| {2})[\w-' ]+) Role: +(UNIT)/g, `$1 ${sep} UNIT: $2  `)
    .replace(
      /(,| {2})([\w-' ]+?)&& ([\w-' ]+?) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g,
      `${sep}$4: $2${commaAlt} $3 ,`
    )

  // if (isDev) console.log('thirdPass', thirdPass)

  const fourthPass = thirdPass
    // Now handle normal units
    .replace(/(,| {2})([\w-' ]+) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/ {2,4}/g, ' ')
    .replace(/(,| {2})?([\w-' ]+) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/(Artefact|Command Trait|Mount Trait|Spell|Upgrade|Weapon):/g, upper)
    .replace(/(UNIT:|,) ([\w-&' ]+) Ally/g, 'ALLY: $2') // Tag ally units
    .split(',')
    .join(sep)
    .split(sep)
    .map(x => x.replace(/ {2,}/g, ' ').trim())
    .filter(x => !!x)
    .join(sep)

  // if (isDev) console.log('fourthPass', fourthPass)

  return fourthPass
}

const factionReplacer = (match: string, p1: string, p2: string) => `FACTION: ${p1.trim()}${sep}${p2}`

const mercenaryReplacer = (match: string, p1: string, p2: string) => {
  const suffix = p2 === 'Extra Command' ? p2 : ``
  return `${sep}MERCENARY COMPANY: ${p1.trim()}${sep}${suffix}`
}

const realmscapeReplacer = (match: string, p1: string, p2: string) => {
  const suffix = p2.toUpperCase() === 'MERCENARY' ? p2 : ``
  return `${sep}REALMSCAPE: ${p1.trim()}${sep}${suffix}`
}

const traitReplacer = (match: string, p1: string, p2: string, p3: string, p4: string) => {
  return `${p1}: ${p2}${p3 || ''}${sep}${p4}`
}

const upper = (match: string) => match.toUpperCase()

const spellTypes = ['Spell', 'Prayer']
const spellRegexp = new RegExp(`(${spellTypes.join('|')}):`, 'g')

const unitTypes = ['Leader', 'Battleline', 'Artillery', 'Behemoth', 'Other']
const unitRegexp = new RegExp(`Role: {1,4}(${unitTypes.join('|')})`, 'g')

const endlessTypes = ['Endless Spell', 'Magmic Invocation', 'Judgement of Khorne']
const endlessRegexp = new RegExp(`Role: {1,4}(${endlessTypes.join('|')})`, 'g')

const allegianceTypes = [
  'Enclave',
  'Glade',
  'Grand Court',
  'Greatfray',
  'Host',
  'Lodge',
  'Skyport',
  'Slaughterhost',
  'Stormhost',
  'Temple',
]
const allegianceRegexp = new RegExp(`(${allegianceTypes.join('|')}):`, 'g')

const commonTypos = {
  'Allher d': 'Allherd',
  'Amar anthine': 'Amaranthine',
  'Ar tiller y': 'Artillery',
  'Balefir e': 'Balefire',
  'Bear er': 'Bearer',
  'Black ened': 'Blackened',
  'Boltst orm': 'Boltstorm',
  'Decr epify': 'Decrepify',
  'Def ender': 'Defender',
  'Desecr ator': 'Desecrator',
  'Dominat or': 'Dominator',
  'Dr aining': 'Draining',
  'Dr ead': 'Dread',
  'Ether eal': 'Ethereal',
  'Gener al': '',
  'Gr eatblade': 'Greatblade',
  'Inv ocation': 'Invocation',
  'Khar adr on Ov erlor ds': 'Kharadron Overlords',
  'Khar adron': 'Kharadron',
  'Mak er': 'Maker',
  'Master y': 'Mastery',
  'Mercenar y Company': 'Mercenary Company',
  'mor e': 'more',
  'Ov erlords': 'Overlords',
  'Pist ol': 'Pistol',
  'Pr ogr ess': 'Progress',
  'Pur chased': 'Purchased',
  'Sacr ament': 'Sacrament',
  'Shar d': 'Shard',
  'Sk ewer': 'Skewer',
  'Sky Port': 'Skyport',
  'Sla yer': 'Slayer',
  'Souldr aught': 'Souldraught',
  'Standar d': 'Standard',
  'Starstrik e': 'Starstrike',
  'T ype': 'Type',
  'Warpfir e': 'Warpfire',
  'Wick ed': 'Wicked',
}

const typoRegexp = new RegExp(Object.keys(commonTypos).join('|'), 'g')
const markRegexp = new RegExp(`Mark( of Chaos)?: {1,3}(${SUPPORTED_FACTIONS.map(titleCase).join('|')})`, 'gi')

const scenery = ['Penumbral Engine']
const sceneryRegExp = new RegExp(`(${scenery.join('|')})`, 'g')
