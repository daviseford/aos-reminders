import pdfjsLib from 'pdfjs-dist'
import { uniq } from 'lodash'
import { isDev } from 'utils/env'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/textUtils'

const sep = ', '
const commaAlt = `&&`
const HEADER = 'HEADER'

export const getAzyrPdfText = async typedarray => {
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
            // x.fontName
            // g_d0_f1 == bold
            // g_d0_f2 == not bold

            // First time this appears, we are starting units
            // fontName: "g_d0_f1"
            // height: 17.99999925
            // str: "Leader"
            if (x.height > 15) return HEADER

            return x.str
          })
          .join(' ')
      })
    )

    if (isDev) console.log('Copy me to JSON to debug: ', pages)

    return handleAzyrPages(pages)
  } catch (err) {
    console.error(err)
  }
}

export const handleAzyrPages = (pages: string[]) => {
  const cleanedPages = pages.map(cleanAzyrText)

  // console.log('cleanedPages', cleanedPages)

  const joinedPages = uniq(cleanedPages.join(sep).split(sep))

  const splitText = joinedPages
    .filter(x => {
      if (prefixTypes.some(pre => x.startsWith(`${pre}:`))) return true

      // if (isDev) console.log('Missing a prefix: ' + x)

      return !joinedPages.some(s => s.includes(x) && s !== x)
    })
    .map(x => x.replace(/&&/g, ',').replace(/AMPERSAND/g, '&'))

  if (isDev) console.table(splitText)

  return splitText
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

const handleFirstPass = (text: string) => {
  const firstRun = text
    .replace(/HEADER( HEADER)+/g, HEADER)
    .replace(/([A-Z]) ([a-z])/g, `$1$2`)
    .replace(/Role: {1,}(Leader|Battleline|Other)( {1,})?, {1,}Behemoth /g, 'Role: Leader  ')
    .replace(/ [‘’]/g, `'`)
    .replace(/[‘’]/g, `'`)
    .replace(/([a-z])- ([a-z])/g, `$1-$2`) // Flesh- eater Courts -> Flesh-eater Courts
    .replace(/([\w]) {1,3}'s /g, `$1's `)
    .replace(/&/g, 'AMPERSAND')
    .replace(typoRegexp, match => commonTypos[match])
    .replace(allegianceRegexp, 'ALLEGIANCE:')
    .replace(/Realm of Battle:/g, 'REALMSCAPE:')
    .replace(/,/g, commaAlt) // Save any existing commas
    .replace(/([\w]) &&/g, `$1${commaAlt}`) // Remove leading whitespace in front of existing commas
    .replace(/Mercenary Company: {1,3}([\w-' ]+)(Extra Command|HEADER|(?:$))/g, mercenaryReplacer)
    .replace(/Extra Command [\w]+ Purchased \(.+\)/g, '')

  if (isDev) console.log('handleFirst', firstRun)

  const secondRun = firstRun
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
    .replace(spellRegexp, 'Spell:')
    .replace(/Army deemed .+valid/g, ' ')
    .replace(/by Azyr Roster Builder/g, ' ')
    .replace(/[0-9]{1,4}pts[/][0-9]{1,4}pts Allies/g, ' ')
    .replace(/[0-9]{1,4}pts/g, ' ')
    .replace(/Quantity: {2}[0-9]{1,2}/g, ' ')
    .replace(markRegexp, ' ')
    .replace(/ {3}[\w-& ]+ See the .+? of this unit/g, ' ')
    .replace(/This unit is also a Leader. Their details are listed within the Leader section./g, sep)
    .replace(/\|/g, sep)
    .replace(/((Kharadron Code|ALLEGIANCE): [\w-&;' ]+) HEADER/g, `$1${sep}`) // KO stuff
    .replace(/HEADER/g, ' ')

  if (isDev) console.log('handleSecond', secondRun)

  return secondRun
}

const cleanAzyrText = (text: string) => {
  const firstRun = handleFirstPass(text)

  if (isDev) console.log('combinedFirst', firstRun)

  const secondRun = firstRun
    .replace(/ {2,4}/g, ' ')
    .replace(sceneryRegExp, ', SCENERY: $1, ')
    // This one in case of a '(s)' on the end of a trait/weapon
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w-' ]+)(\(.+?\)) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      `$1: $2$3${sep}$4`
    )
    // This one for normal
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w-' ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      `$1: $2${sep}$3`
    )
    .split(',')
    .map(x => x.trim())
    .filter(x => !!x)
    .join(sep)

  if (isDev) console.log('secondRun', secondRun)

  const thirdRun = secondRun
    // Have to run this twice, really :(
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      `$1: $2${sep}$3`
    )
    // These next two lines handle Nagash, Supreme Lord of the Undead
    .replace(/(^|Role: UNIT +| {2})([\w-' ]+(&&| {2})[\w-' ]+) Role: +(UNIT)/g, `$1 ${sep} UNIT: $2  `)
    .replace(
      /(,| {2})([\w-' ]+?)&& ([\w-' ]+?) Role:[ ]+(UNIT|Battalion|ENDLESS SPELL)/g,
      `${sep}$4: $2${commaAlt} $3 ,`
    )

  if (isDev) console.log('thirdRun', thirdRun)

  const fourthRun = thirdRun
    // Now handle normal units
    .replace(/(,| {2})([\w-' ]+) Role:[ ]+(UNIT|Battalion|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/ {2,4}/g, ' ')
    .replace(/(,| {2})?([\w-' ]+) Role:[ ]+(UNIT|Battalion|ENDLESS SPELL)/g, `${sep}$3: $2${sep}`)
    .replace(/Battalion:/g, 'BATTALION:')
    .replace(/Command Trait:/g, 'COMMAND TRAIT:')
    .replace(/Mount Trait:/g, 'MOUNT TRAIT:')
    .replace(/Spell:/g, 'SPELL:')
    .replace(/Weapon:/g, 'WEAPON:')
    .replace(/Artefact:/g, 'ARTIFACT:')
    .replace(/Upgrade:/g, 'UPGRADE:')
    .replace(/(UNIT:|,) ([\w-&' ]+) Ally/g, 'ALLY: $2')
    .split(',')
    .join(sep)
    .split(sep)
    .map(x => x.replace(/ {2,}/g, ' ').trim())
    .filter(x => !!x)
    .join(sep)

  if (isDev) console.log('fourthRun', fourthRun)

  return fourthRun
}

const spellTypes = ['Spell', 'Prayer']
const spellRegexp = new RegExp(`(${spellTypes.join('|')}):`, 'g')

const unitTypes = ['Leader', 'Battleline', 'Artillery', 'Behemoth', 'Other']
const unitRegexp = new RegExp(`Role: {1,4}(${unitTypes.join('|')})`, 'g')

const endlessTypes = ['Endless Spell', 'Magmic Invocation', 'Judgement of Khorne']
const endlessRegexp = new RegExp(`Role: {1,4}(${endlessTypes.join('|')})`, 'g')

const prefixTypes = [
  'ALLEGIANCE',
  'ALLY',
  'ARTIFACT',
  'BATTALION',
  'COMMAND TRAIT',
  'ENDLESS SPELL',
  'FACTION',
  'MERCENARY COMPANY',
  'MOUNT TRAIT',
  'REALMSCAPE',
  'SPELL',
  'SPELL',
  'UNIT',
  'UPGRADE',
  'WEAPON',
]

const allegianceTypes = [
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
  'Ar tiller y': 'Artillery',
  'Bear er': 'Bearer',
  'Boltst orm': 'Boltstorm',
  'Def ender': 'Defender',
  'Gener al': '',
  'Khar adr on Ov erlor ds': 'Kharadron Overlords',
  'Khar adron': 'Kharadron',
  'Mercenar y Company': 'Mercenary Company',
  'Inv ocation': 'Invocation',
  'Pist ol': 'Pistol',
  'Pur chased': 'Purchased',
  'Sky Port': 'Skyport',
  'Standar d': 'Standard',
  'Starstrik e': 'Starstrike',
  'T ype': 'Type',
  'Warpfir e': 'Warpfire',
  'Dominat or': 'Dominator',
  'Allher d': 'Allherd',
  'Desecr ator': 'Desecrator',
  'Sla yer': 'Slayer',
  'Dr ead': 'Dread',
  'Sacr ament': 'Sacrament',
  'Master y': 'Mastery',
  'Ether eal': 'Ethereal',
  'Pr ogr ess': 'Progress',
  'Black ened': 'Blackened',
  'Decr epify': 'Decrepify',
  'Amar anthine': 'Amaranthine',
  'Balefir e': 'Balefire',
  'Wick ed': 'Wicked',
  'Shar d': 'Shard',
  'Souldr aught': 'Souldraught',
  'Gr eatblade': 'Greatblade',
  'Dr aining': 'Draining',
  'Mak er': 'Maker',
  'Sk ewer': 'Skewer',
  'mor e': 'more',
}

const typoRegexp = new RegExp(Object.keys(commonTypos).join('|'), 'g')
const markRegexp = new RegExp(`Mark( of Chaos)?: {1,3}(${SUPPORTED_FACTIONS.map(titleCase).join('|')})`, 'gi')

const scenery = ['Penumbral Engine']
const sceneryRegExp = new RegExp(`(${scenery.join('|')})`, 'g')
