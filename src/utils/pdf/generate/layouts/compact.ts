import jsPDF from 'jspdf'
import { getVisibleReminders } from 'utils/pdf/generate/getVisibleReminders'
import PdfLayout from 'utils/pdf/generate/layouts/layoutUtils'
import { Logo } from 'utils/pdf/generate/logo'
import { titleCase } from 'utils/textUtils'
import { TPdfStyles, IPrintPdf } from 'types/pdf'

const Styles: TPdfStyles = {
  army: {
    fontSize: 9,
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
    spacing: 0.23,
    style: 'bold',
  },
  armyName: {
    fontSize: 12,
    spacing: 0.25,
    style: 'bold',
  },
  break: {
    fontSize: 0,
    spacing: 0.11,
    style: 'normal',
  },
  desc: {
    fontSize: 9,
    spacing: 0.18,
    style: 'normal',
  },
  phase: {
    fontSize: 12,
    spacing: 0.22,
    style: 'bold',
  },
  spacer: {
    fontSize: 0,
    spacing: 0.24,
    style: 'normal',
  },
  title: {
    fontSize: 9,
    spacing: 0.18,
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
  pageHeight: 13,
  pageBottom: 13 - 0.75, // pageHeight - yMargin,
  maxLineWidth: 10.4,
  maxTitleLineWidth: 10.4 - 2, // maxLineWidth - 2,
}

export const saveCompactPdf = (data: IPrintPdf): jsPDF => {
  const { factionName, hiddenReminders, reminders, ...currentArmy } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  const Layout = new PdfLayout(PageOpts, Styles)

  doc
    .setFont('helvetica')
    .setTextColor(0, 0, 0)
    .setProperties({ title: `AoS Reminders - ${titleCase(factionName)}` })

  const pageWidth = doc.internal.pageSize.getWidth()
  const centerX = pageWidth / 2
  const reminderText = Layout.getReminderText(doc, visibleReminders)
  const armyText = Layout.getArmyText(doc, { factionName, ...currentArmy })
  const phaseInfo = Layout.getPhaseInfo(reminderText)
  const pages = Layout.splitTextToPages(reminderText, phaseInfo, armyText)

  pages.forEach((page, pageNum) => {
    if (pageNum !== 0) doc.addPage()
    let [x, y] = Layout.getInitialXY()

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
