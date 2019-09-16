import pdfjsLib from 'pdfjs-dist'
import { uniq } from 'lodash'
import { isDev } from 'utils/env'
import { SUPPORTED_REALMSCAPES } from 'types/realmscapes'
import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/textUtils'

const sep = ', '
const commaAlt = `&&`

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
      console.log('Missing a prefix: ' + x)
      return !joinedPages.some(s => s.includes(x) && s !== x)
    })
    .map(x => x.replace(/&&/g, ','))

  if (isDev) console.table(splitText)

  return splitText
}

const leaderReplacer = (text, p1, p2) => {
  if (p2.startsWith('Leader')) return `${p1}, `
  return `${p1}, ${p2}`
}

const cleanAzyrText = (text: string) => {
  const firstRun = text
    .replace(/([A-Z]) ([a-z])/g, `$1$2`)
    .replace(typoRegexp, match => commonTypos[match])
    .replace(/Extra Command [\w]+ Purchased \(.+\)/g, '')
    .replace(/.+Play Type: {2}.+ {2}\| {2}/g, '') // Removes "[army name] Play Type:  Open  |  Grand Alliance:  Order  |  "
    .replace(/(Allegiance: {2}.+?) (Leader Battleline|Leader|Realm of Battle)/g, leaderReplacer)
    .replace(
      /Realm of Battle:.+(AQSHY|CHAMON|GHUR|GHYRAN|HYSH|SHYISH|STYGXX|ULGU), [\w- ]+(Leader Battleline|,|(?:$))/g,
      ', REALMSCAPE: $1, '
    )
    .replace(/Leader Battleline/g, '')

  if (isDev) console.log('firstRun', firstRun)

  const secondRun = firstRun
    .replace(/(Allegiance: [\w- ]+) ([\w]+:)/g, '$1, $2')
    .replace(/(Mercenary Company: ([\w- ]+)),/g, ', MERCENARY COMPANY: $2, ')
    .replace(/Quantity: {2}[0-9]{1,2}/g, '') // Removes "Quantity:  1"
    .replace(/ See the .+ of this unit/g, sep)
    .replace(/Army deemed .+ by Azyr Roster Builder/g, '')
    .replace(/Total: [0-9]{1,4}[/][0-9]{1,4}pts [0-9]{1,4}pts[/][0-9]{1,4}pts Allies/g, '')
    .replace(/ {2,4}/g, ' ')
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      '$1: $2, $3'
    )
    .replace(/[0-9]{1,4}pts/g, '')
    .replace(/Total: /g, '')
    .replace(/Allegiance: /g, 'FACTION: ')
    .split(',')
    .map(x => x.trim())
    .filter(x => !!x)
    .join(sep)

  const thirdRun = secondRun
    // Have to run this twice, really :(
    .replace(
      /(Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait|Upgrade| {1,3})/g,
      '$1: $2, $3'
    )
    // These next two lines handle Nagash, Supreme Lord of the Undead
    .replace(/  ([\w]+(,| {2})[\w- ]+) Role:[ ]+(Leader)/g, `${commaAlt} $3: $1 ${commaAlt}`)
    .replace(/&& (.+)(, )(.+) &&/g, `, $1${commaAlt} $3, `)
    // Now handle normal units
    .replace(
      /(,| {2})([\w- ]+) Role:[ ]+(Leader|Battleline|Artillery|Behemoth|Battalion|Endless Spell|Other)/g,
      ', $3: $2, '
    )
    .replace(/ {2,4}/g, ' ')
    .replace(
      /(,| {2})?([\w- ]+) Role:[ ]+(Leader|Battleline|Artillery|Behemoth|Battalion|Endless Spell|Other)/g,
      ', $3: $2, '
    )
    .replace(/(Leader|Battleline|Artillery|Behemoth|Other):/g, 'UNIT:')
    .replace(/Battalion:/g, 'BATTALION:')
    .replace(/Endless Spell:/g, 'ENDLESS SPELL:')
    .replace(/Command Trait:/g, 'COMMAND TRAIT:')
    .replace(/Mount Trait:/g, 'MOUNT TRAIT:')
    .replace(/Spell:/g, 'SPELL:')
    .replace(/Weapon:/g, 'WEAPON:')
    .replace(/Artefact:/g, 'ARTIFACT:')
    .replace(/Upgrade:/g, 'UPGRADE:')
    .replace(/(UNIT:|,) ([\w- ]+) Ally/g, 'ALLY: $2')
    .replace(/ [‘’]/g, `'`)
    .replace(/[‘’]/g, `'`)
    .replace(/(Artillery|Battalions|Endless Spells)/g, '')
    .split(',')
    .map(x => {
      x = x.trim()
      x = x.replace(/Behemoth /g, '')
      x = x.replace(/^Other /g, '')

      const allegianceMatch = allegianceTypes.find(a => x.startsWith(`${a}:`))
      if (allegianceMatch) x = x.replace(allegianceMatch, 'ALLEGIANCE')

      x = x.trim()

      x = x.replace(new RegExp(`([\w]) (${prefixTypes.join('|')}):`, 'g'), replacer)

      return x
    })
    .join(sep)
    .split(sep)
    .map(x => x.replace(/^(Leader|Battleline|Artillery|Behemoth|Other)$/g, ''))
    .filter(x => !!x)
    .join(sep)

  return thirdRun
}

const replacer = (match: string, p1: string, p2: string) => {
  console.log(match, 'asdad', p1)
  return `${p1}, ${p2}:`
}

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

const allegianceTypes = ['Host', 'Glade', 'Lodge', 'Greatfray']

const commonTypos = {
  'Ar tiller y': 'Artillery',
  'Bear er': 'Bearer',
  'Boltst orm': 'Boltstorm',
  'Def ender': 'Defender',
  'Gener al': '',
  'Mercenar y Company': 'Mercenary Company',
  'Pist ol': 'Pistol',
  'Pur chased': 'Purchased',
  'Standar d': 'Standard',
  'Starstrik e': 'Starstrike',
  'T ype': 'Type',
}

const typoRegexp = new RegExp(Object.keys(commonTypos).join('|'), 'g')
