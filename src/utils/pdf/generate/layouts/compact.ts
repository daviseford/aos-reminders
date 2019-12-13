import jsPDF from 'jspdf'
import { getVisibleReminders } from 'utils/pdf/generate/getVisibleReminders'
import CompactPDFLayout from 'utils/pdf/generate/layouts/compactLayoutUtils'
import { Logo } from 'utils/pdf/generate/logo'
import { titleCase } from 'utils/textUtils'
import { TPdfStyles, IPrintPdf } from 'types/pdf'

const Styles: TPdfStyles = {
  army: {
    fontSize: 6,
    spacing: 0.14,
    style: 'normal',
  },
  armyEnd: {
    fontSize: 8,
    spacing: 0.14,
    style: 'bold',
  },
  armyFooter: {
    fontSize: 8,
    spacing: 0.2,
    style: 'bold',
  },
  armyName: {
    fontSize: 8,
    spacing: 0.2,
    style: 'bold',
  },
  break: {
    fontSize: 0,
    spacing: 0.03,
    style: 'normal',
  },
  desc: {
    fontSize: 7,
    spacing: 0.14,
    style: 'normal',
  },
  phase: {
    fontSize: 8,
    spacing: 0.2,
    style: 'bold',
  },
  spacer: {
    fontSize: 0,
    spacing: 0.1,
    style: 'normal',
  },
  title: {
    fontSize: 7,
    spacing: 0.14,
    style: 'bold',
  },
  titlespacer: {
    fontSize: 0.04,
    spacing: 0.01,
    style: 'normal',
  },
}

const PageOpts = {
  xMargin: 0.3,
  yMargin: 0.75,
  pageHeight: 12,
  pageBottom: 12 - 0.75, // pageHeight - yMargin,
  colLineWidth: 8.5,
  colTitleLineWidth: 8, // colLineWidth - 2,
  maxLineWidth: 17,
  maxTitleLineWidth: 17 - 2, // maxLineWidth - 2,
}

export const saveCompactPdf = (data: IPrintPdf): jsPDF => {
  const { factionName, hiddenReminders, reminders, ...currentArmy } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  const Layout = new CompactPDFLayout(doc, PageOpts, Styles, { factionName, ...currentArmy })

  doc
    .setFont('helvetica')
    .setTextColor(0, 0, 0)
    .setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2
  Layout.getReminderText(visibleReminders) // Get the reminders into the class
  const pages = Layout.splitTextToPagesCompact() // And now extract the pages

  const col1X = 4.2

  pages.forEach((page, pageNum) => {
    if (pageNum !== 0) doc.addPage()
    let [x, y, colY] = [PageOpts.xMargin, PageOpts.yMargin, PageOpts.yMargin]

    page.forEach((t, i) => {
      // Don't add spacers to the start or end of page
      if ((i === 0 || i === page.length - 1) && ['spacer', 'titlespacer', 'break'].includes(t.type)) return

      const isPhase = t.type === 'phase'
      const isArmy = t.type.startsWith('army')
      const style = Styles[t.type]
      const textX = isPhase || isArmy ? centerX : t.position === 'col1' ? col1X : x
      const textAlign = isPhase || isArmy ? 'center' : 'left'
      const textY = t.position === 'col1' ? colY : y

      doc
        .setFontSize(style.fontSize)
        .setFontStyle(style.style)
        .text(t.text, textX, textY, null, null, textAlign)

      if (isPhase) {
        doc
          .setLineWidth(0.0001)
          .setDrawColor(28, 117, 149)
          .roundedRect(
            x - 0.1,
            y - style.spacing + 0.04,
            pageWidth - PageOpts.xMargin * 2 + 0.1,
            style.spacing + 0.015,
            0.05,
            0.05,
            'S'
          )
      }

      if (t.type === 'armyName') {
        const lineY = y - style.spacing
        doc
          .setLineWidth(0.0001)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, lineY, pageWidth - PageOpts.xMargin + 0.1, lineY)
      }

      if (t.type === 'armyEnd') {
        const lineY = y + style.spacing
        doc
          .setLineWidth(0.0001)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, lineY, pageWidth - PageOpts.xMargin + 0.1, lineY)
      }

      if (t.position === 'col1') {
        colY = colY + style.spacing
        if (colY > y) y = colY
      } else {
        y = y + style.spacing
        if (t.position !== 'col0') colY = y
      }

      // Add page numbers and watermark on the first pass of a page
      if (i === 0) {
        const watermarkY = 0.33
        doc
          .setTextColor(128, 128, 128)
          .setFontSize(Styles.desc.fontSize)
          .setFontStyle(Styles.desc.style)
          .text(`${pageNum + 1}`, pageWidth - PageOpts.xMargin - 0.11, watermarkY)
          .setFontStyle(Styles.title.style)
          .text(`aosreminders.com`, centerX, watermarkY, null, null, 'center')
          .setTextColor(0, 0, 0) // Set color back to black

        const [logoW, logoH] = [1.43 / 3.5, 1 / 3.5]
        doc.addImage(Logo, 'png', PageOpts.xMargin + 0.11, watermarkY - logoH / 2 - 0.05, logoW, logoH)
      }

      // If there's enough room on the last page, add the fullsize logo to it
      if (pageNum === pages.length - 1 && i === page.length - 1) {
        const [logoW, logoH, logoSpacer] = [1.43, 1, 0.4]

        if (y + logoH + logoSpacer <= PageOpts.pageBottom) {
          doc.addImage(Logo, 'png', centerX - logoW / 2 + 0.15, y + logoSpacer)
        }
      }
    })
  })

  return doc
}
