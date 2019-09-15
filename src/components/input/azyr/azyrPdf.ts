import pdfjsLib from 'pdfjs-dist'

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

    const cleanedPages = pages.map(cleanAzyrText).map(x => x.split('  '))
    const text = cleanAzyrText(pages.join('\n'))
    console.log(cleanedPages)

    return text
  } catch (err) {}
}

// Fyreslayers Play Type: Matched | Game T ype: Meeting Engagement | Grand Alliance: Order | Allegiance: Fyreslayers Lodge: Hermdar Realm of Battle: AQSHY, The Realm of FIRE Spearhead Leader Other Main Body Leader 200pts Fjul-Grimnir Role: Leader Quantity: 1 200pts The Chosen Axes Role: Other Quantity: 3
// Battleline Behemoth Rearguard Leader Behemoth 260pts Auric Runesmiter Gener al Role: Leader , Behemoth Quantity: 1 Command T rait: Warrior Indominate Artefact: Tyrant Sla yer Prayer: Prayer of Ash Mount T rait: Fire-claw Adult 160pts Vulkite Berzerkers Role: Battleline Quantity: 10 Auric Runesmiter See the "Leader " occurr ence of this unit 240pts Auric Runeson Role: Leader , Behemoth Quantity: 1
// Total: 1000/1000pts 0pts/0pts Allies Army deemed valid by Azyr Roster Builder Other Magmic Inv ocations Auric Runeson See the "Leader " occurr ence of this unit 100pts Doomseeker Role: Other Quantity: 1 40pts Runic Fyrewall Role: Magmic Inv ocation
const cleanAzyrText = (text: string) => {
  return (
    text
      .replace(/([A-Z]) ([a-z])/g, `$1$2`)
      // .replace(/ {2,5}/g, ' ')
      .replace(/Gener al/g, '')
      .replace(/T ype/g, 'Type')
      .replace(/Army deemed .+ by Azyr Roster Builder/g, '')
      .replace(/Total: [0-9]{1,4}[/][0-9]{1,4}pts [0-9]{1,4}pts[/][0-9]{1,4}pts Allies/g, '')
      .replace(/[0-9]{1,4}pts/g, '')
  )
}
