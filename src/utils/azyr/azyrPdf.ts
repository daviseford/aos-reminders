import pdfjsLib from 'pdfjs-dist'
import { uniq, sortBy } from 'lodash'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/textUtils'
import { isDev } from 'utils/env'
import { TImportParsers } from 'types/import'

const sep = ', '
const commaAlt = `&&`
const HEADER = 'HEADER'

type TGetPdfPages = (typedarray: string) => Promise<{ pdfPages: string[]; parser: TImportParsers }>

export const getPdfPages: TGetPdfPages = async typedarray => {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`

    //Step 5:PDFJS should be able to read this
    const pdf = await pdfjsLib.getDocument(typedarray).promise

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
      })
    )

    let heights: number[] = []
    const pdfText = pages.flat()

    pdfText.forEach(x => heights.push(x.height))
    const { headerHeight, itemHeight } = getTextHeights(heights)

    const result = pdfText
      .map(x => {
        // First time this appears, we are starting units
        // fontName: "g_d0_f1"
        // height: 17.99999925
        // str: "Leader"
        if (x.height >= headerHeight) return HEADER

        if (x.height >= itemHeight) return `ITEM: ${x.str.trim()}`

        return x.str
      })
      .join(' ')

    const pdfPages = [result]
    const isWarscroll = pdfPages.some(x => x.includes('Warscroll Builder'))
    const isAzyr = isWarscroll ? false : checkIfAzyr(pdfPages)
    const parser: TImportParsers = isWarscroll ? 'Warscroll Builder' : isAzyr ? 'Azyr' : 'Unknown'

    if (isDev) console.log('PDF Import string, copy me to JSON to debug: ', pdfPages)

    return { pdfPages, parser }
  } catch (err) {
    console.error(err)
    return { pdfPages: [], parser: 'Unknown' }
  }
}

const checkIfAzyr = (pdfPages: string[]): boolean => {
  const matches = ['azyr', 'play type', 'game type', 'army deemed']
  return new RegExp(matches.join('|'), 'gi').test(pdfPages[0])
}

export const handleAzyrPages = (pages: string[]): string[] => {
  const cleanedPages = pages.map(newHandleText)
  const joinedPages = cleanedPages[0]

  if (isDev) console.table(joinedPages)

  return joinedPages
}

const newHandleText = (text: string): string[] => {
  const preppedText = text
    .replace(/([A-Z]) ([a-z])/g, `$1$2`)
    .replace(/Role: {1,}(Leader|Battleline|Other)( {1,})?, {1,}Behemoth /g, 'Role: Leader  ')
    .replace(/( )?[‘’]/g, `'`) // Replace special quotes
    .replace(/[“”]/g, `"`) // Replace special quotes
    .replace(/([a-z])- ([a-z])/g, `$1-$2`) // Flesh- eater Courts -> Flesh-eater Courts
    .replace(/([\w]) {1,3}'s /g, `$1's `) // Ford 's -> Ford's
    .replace(typoRegexp, match => commonTypos[match]) // Handle any known typos
    .replace(/Quantity: {2}[0-9]{1,2}/gi, ' ') // Remove "Quantity: 1"
    .replace(/[0-9]{1,4}pts/g, ' ') // Remove '123pts'
    .replace(/&/g, 'AMPERSAND') // Save any existing ampersands
    .replace(/General/g, ' ') // Handle any known typos
    .replace(/,/g, commaAlt) // Save any existing commas

  const items = preppedText.split('ITEM: ')
  const title = handleTitle(items.shift() as string)
  const processedItems = uniq(items.map(handleItem).flat())

  return title.concat(processedItems).map(x => x.replace(/&&/g, ',').replace(/AMPERSAND/g, '&'))
}

const handleItem = (text: string): string[] => {
  const firstPass = text
    .replace(/HEADER/g, ' ')
    .replace(/.+See the .+? of this unit/gi, '')
    .replace(/.+This unit is also a Leader.+ the Leader section./gi, '')
    .replace(/Army deemed .+valid/gi, ' ')
    .replace(/by Azyr Roster Builder/gi, ' ')
    .replace(/[0-9]{1,4}pts[/][0-9]{1,4}pts Allies/gi, ' ')
    .replace(/[0-9]{1,4}pts/g, ' ')
    .replace(/\|/g, sep)
    .replace(/ {2,4}/g, ' ')
    .replace(unitRegexp, 'Role: UNIT')
    .replace(endlessRegexp, 'Role: ENDLESS SPELL')
    .replace(/Role: {1,4}Battalion/g, 'Role: BATTALION')
    .replace(spellRegexp, 'Spell:')
    .replace(sceneryRegExp, ', SCENERY: $1, ')
    .replace(markRegexp, ' ')
    // This one in case of a '(s)' on the end of a trait/weapon
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w-' ]+)(\(.+?\))? (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      traitReplacer
    )

  const secondPass = splitItem(firstPass)
    .join(sep)
    // You really do have to run this twice, really :(
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      `${sep}$1: $2${sep}$3`
    )
    // These next two lines handle Nagash, Supreme Lord of the Undead
    .replace(/(^|Role: UNIT +| {2})([\w-' ]+(&&| {2})[\w-' ]+) Role: +(UNIT)/g, `$1 ${sep} UNIT: $2  `)
    .replace(
      /(,| {2})([\w-' ]+?)&& ([\w-' ]+?) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g,
      `$4: $2${commaAlt} $3${sep}`
    )
    // Now handle normal units
    .replace(/(,| {2})([\w-' ]+) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/ {2,4}/g, ' ')
    .replace(/(,| {2})?([\w-' ]+) Role:[ ]+(UNIT|BATTALION|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/(Artefact|Command Trait|Mount Trait|Spell|Upgrade|Weapon):/g, upper)
    .replace(/(UNIT:|,) ([\w-&' ]+) Ally/g, 'ALLY: $2') // Tag ally units
    .replace(/\/ Allies/g, '')
    .split(',')
    .join(sep)

  return splitItem(secondPass)
}

const handleTitle = (text: string): string[] => {
  const firstTitlePass = text
    .replace(/HEADER( HEADER)+/g, HEADER)
    .replace(allegianceRegexp, 'ALLEGIANCE:')
    .replace(/Realm of Battle:/g, 'REALMSCAPE:')
    .replace(/ITEM: /g, sep) // Replace ITEM placeholder with commas
    .replace(/([\w]) &&/g, `$1${commaAlt}`) // Remove leading whitespace in front of existing commas
    .replace(/Mercenary Company: {1,3}([\w-' ]+)(HEADER|Extra Command|(?:$))/g, mercenaryReplacer)
    .replace(/Extra Command [\w]+ Purchased \(.+\)/g, '') // Get rid of command point info

  const secondTitlePass = firstTitlePass
    .replace(
      /.+?Allegiance:([\w-' ]+)(HEADER|ALLEGIANCE:|REALMSCAPE:|MERCENARY COMPANY:|,|(?:$))/g,
      factionReplacer
    )
    .replace(
      /REALMSCAPE:.+(AQSHY|CHAMON|GHUR|GHYRAN|HYSH|SHYISH|STYGXX|ULGU)&& [\w- ]+?(HEADER|,|MERCENARY|(?:$))/g,
      realmscapeReplacer
    )
    .replace(/Army deemed .+valid/gi, ' ')
    .replace(/by Azyr Roster Builder/g, ' ')
    .replace(/[0-9]{1,4}pts[/][0-9]{1,4}pts Allies/gi, ' ')
    .replace(/[0-9]{1,4}pts/g, ' ')
    .replace(/\|/g, sep)
    .replace(/((Kharadron Code|ALLEGIANCE): [\w-&;' ]+) HEADER/g, `$1${sep}`) // KO stuff
    .replace(/HEADER/g, ' ')

  return splitItem(secondTitlePass)
}

const splitItem = (text: string): string[] => {
  return text
    .split(',')
    .map(x => x.replace(/ {2,}/g, ' ').trim())
    .filter(x => !!x)
}

const getTextHeights = (heights: number[]) => {
  const textHeights = sortBy(uniq(heights)).reverse()

  let headerHeight = 99
  let itemHeight = 99

  // A faction/realm-only pdf only has 3, so we don't bother setting this
  if (textHeights.length > 3) {
    // Meeting Engagement has 6 fontSizes, others have 5
    // textHeights[0] === Army Name
    // textHeights[1] === "Total: "
    headerHeight = textHeights[textHeights.length - 3]
    itemHeight = textHeights[textHeights.length - 2]
    // last(textHeights) === Traits and options
  }
  return { headerHeight, itemHeight }
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
  return `${sep}${p1}: ${p2}${p3 || ''}${sep}${p4}`
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
  'L ORDS': 'LORDS',
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
