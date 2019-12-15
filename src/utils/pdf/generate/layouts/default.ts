import jsPDF from 'jspdf'
import { getVisibleReminders } from 'utils/pdf/generate/getVisibleReminders'
import PdfLayout from 'utils/pdf/generate/layouts/layoutUtils'
import { Logo } from 'utils/pdf/generate/logo'
import { titleCase } from 'utils/textUtils'
import { TPdfStyles, IPrintPdf } from 'types/pdf'

const Styles: TPdfStyles = {
  army: {
    fontSize: 11,
    spacing: 0.22,
    style: 'normal',
  },
  armyEnd: {
    fontSize: 12,
    spacing: 0.18,
    style: 'bold',
  },
  armyFooter: {
    fontSize: 12,
    spacing: 0.24,
    style: 'bold',
  },
  armyName: {
    fontSize: 14,
    spacing: 0.28,
    style: 'bold',
  },
  break: {
    fontSize: 0,
    spacing: 0.14,
    style: 'normal',
  },
  desc: {
    fontSize: 9.5,
    spacing: 0.18,
    style: 'normal',
  },
  phase: {
    fontSize: 12,
    spacing: 0.24,
    style: 'bold',
  },
  spacer: {
    fontSize: 0,
    spacing: 0.28,
    style: 'normal',
  },
  title: {
    fontSize: 10,
    spacing: 0.2,
    style: 'bold',
  },
  titlespacer: {
    fontSize: 0,
    spacing: 0.1,
    style: 'normal',
  },
}

const PageOpts = {
  xMargin: 0.5,
  yMargin: 0.75,
  pageHeight: 12.4,
  pageBottom: 12.4 - 0.75, // pageHeight - yMargin,
  colLineWidth: 0,
  colTitleLineWidth: 0,
  maxLineWidth: 10.8,
  maxTitleLineWidth: 10.8 - 2, // maxLineWidth - 2,
}

export const saveDefaultPdf = (data: IPrintPdf): jsPDF => {
  const { factionName, hiddenReminders, reminders, ...currentArmy } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  const Layout = new PdfLayout('default', doc, PageOpts, Styles, { factionName, ...currentArmy })

  doc
    .setFont('helvetica')
    .setTextColor(0, 0, 0)
    .setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2

  Layout.getReminderText(visibleReminders)
  const pages = Layout.splitTextToPages()

  pages.forEach((page, pageNum) => {
    if (pageNum !== 0) doc.addPage()
    let [x, y] = [PageOpts.xMargin, PageOpts.yMargin]

    page.forEach((t, i) => {
      // Don't add spacers to the start or end of page
      if ((i === 0 || i === page.length - 1) && ['spacer', 'titlespacer', 'break'].includes(t.type)) return

      const isPhase = t.type === 'phase'
      const isArmy = t.type.startsWith('army')
      const style = Styles[t.type]
      const textX = isPhase || isArmy ? centerX : x
      const textAlign = isPhase || isArmy ? 'center' : 'left'

      doc
        .setFontSize(style.fontSize)
        .setFontStyle(style.style)
        .text(t.text, textX, y, null, null, textAlign)

      if (isPhase) {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
          .roundedRect(
            x - 0.1,
            y - style.spacing + 0.02,
            pageWidth - PageOpts.xMargin * 2 + 0.1,
            style.spacing + 0.08,
            0.05,
            0.05,
            'S'
          )
      }
      if (t.type === 'armyName') {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, y - style.spacing, pageWidth - PageOpts.xMargin + 0.1, y - style.spacing)
      }

      if (t.type === 'armyEnd') {
        doc
          .setLineWidth(0.00055)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, y + style.spacing, pageWidth - PageOpts.xMargin + 0.1, y + style.spacing)
      }

      y = y + style.spacing

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

      // If there's enough room on the last page, add the logo to it
      if (pageNum === pages.length - 1 && i === page.length - 1) {
        const [logoW, logoH, logoSpacer] = [1.43, 1, 0.25]

        if (y + logoH + logoSpacer <= PageOpts.pageBottom) {
          doc.addImage(Logo, 'png', centerX - logoW / 2 + 0.15, y + logoSpacer)
        }
      }
    })
  })

  return doc
}
