import pdfjsLib from 'pdfjs-dist'
import { uniq } from 'lodash'

const sep = ', '

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
        return textContent.items.map(({ str }) => str).join(' ')
      })
    )

    const cleanedPages = pages.map(cleanAzyrText)
    console.log(cleanedPages)
    const splitText = uniq(cleanedPages.join(sep).split(sep))
    console.log(splitText)
    return splitText
  } catch (err) {
    console.error(err)
  }
}

// Fyreslayers Play Type: Matched | Game T ype: Meeting Engagement | Grand Alliance: Order | Allegiance: Fyreslayers Lodge: Hermdar Realm of Battle: AQSHY, The Realm of FIRE Spearhead Leader Other Main Body Leader 200pts Fjul-Grimnir Role: Leader Quantity: 1 200pts The Chosen Axes Role: Other Quantity: 3
// Battleline Behemoth Rearguard Leader Behemoth 260pts Auric Runesmiter Gener al Role: Leader , Behemoth Quantity: 1 Command T rait: Warrior Indominate Artefact: Tyrant Sla yer Prayer: Prayer of Ash Mount T rait: Fire-claw Adult 160pts Vulkite Berzerkers Role: Battleline Quantity: 10 Auric Runesmiter See the "Leader " occurr ence of this unit 240pts Auric Runeson Role: Leader , Behemoth Quantity: 1
// Total: 1000/1000pts 0pts/0pts Allies Army deemed valid by Azyr Roster Builder Other Magmic Inv ocations Auric Runeson See the "Leader " occurr ence of this unit 100pts Doomseeker Role: Other Quantity: 1 40pts Runic Fyrewall Role: Magmic Inv ocation
const cleanAzyrText = (text: string) => {
  return (
    text
      .replace(/([A-Z]) ([a-z])/g, `$1$2`)
      .replace(/Gener al/g, '')
      .replace(/T ype/g, 'Type')
      .replace(/Mercenar y Company/g, 'Mercenary Company')
      .replace(/.+Play Type:  .+  \|  /g, '') // Removes "[army name] Play Type:  Open  |  Grand Alliance:  Order  |  "
      .replace(/(Allegiance:  .+) Leader Battleline/g, `$1, `)
      .replace(/(Allegiance: [\w- ]+) ([\w]+:)/g, '$1, $2')
      .replace(/(Mercenary Company: ([\w- ]+)),/g, ', MERCENARY COMPANY: $2, ')
      .replace(/Quantity:  [0-9]{1,2}/g, '') // Removes "Quantity:  1"
      .replace(/ See the .+ of this unit/g, sep)
      .replace(/Army deemed .+ by Azyr Roster Builder/g, '')
      .replace(/Total: [0-9]{1,4}[/][0-9]{1,4}pts [0-9]{1,4}pts[/][0-9]{1,4}pts Allies/g, '')
      .replace(
        /Realm of Battle:.+(AQSHY|CHAMON|GHUR|GHYRAN|HYSH|SHYISH|STYGXX|ULGU), [\w- ]+,/g,
        ', REALMSCAPE: $1, '
      )
      .replace(/ {2,4}/g, ' ')
      .replace(
        /(Artefact|Spell|Weapon|Command Trait|Mount Trait): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait| {1,3})/g,
        '$1: $2, $3'
      )
      .replace(/[0-9]{1,4}pts/g, '')
      .replace(/Total: /g, '')
      .replace(/Allegiance: /g, 'ALLEGIANCE: ')
      .split(',')
      .map(x => x.trim())
      .filter(x => !!x)
      .join(sep)
      // Have to run this twice, really :(
      .replace(
        /(Artefact|Spell|Weapon|Command Trait|Mount Trait): ([\w- ]+) (Artefact|Spell|Weapon|Command Trait|Mount Trait| {1,3})/g,
        '$1: $2, $3'
      )
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
      .replace(/(UNIT:|,) ([\w- ]+) Ally/g, 'ALLY: $2')
      .replace(/(Artillery|Battalions|Endless Spells)/g, '')
      .split(',')
      .map(x => {
        x = x.trim()
        return x.replace(/^(Behemoth|Other) /g, '')
      })
      .filter(x => !!x && x !== 'Behemoth' && x !== 'Other')
      .join(sep)
      .split(',')
      .map(x => x.trim())
      .filter(x => !!x)
      .join(sep)
  )
}
