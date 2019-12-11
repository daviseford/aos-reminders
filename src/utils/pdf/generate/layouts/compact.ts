import jsPDF from 'jspdf'
import { getVisibleReminders } from 'utils/pdf/generate/getVisibleReminders'
import PdfLayout from 'utils/pdf/generate/layouts/layoutUtils'
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
    spacing: 0.3,
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
    spacing: 0.14,
    style: 'bold',
  },
  spacer: {
    fontSize: 0,
    spacing: 0.14,
    style: 'normal',
  },
  title: {
    fontSize: 7,
    spacing: 0.14,
    style: 'bold',
  },
  titlespacer: {
    fontSize: 0,
    spacing: 0.04,
    style: 'normal',
  },
}

const PageOpts = {
  xMargin: 0.25,
  yMargin: 0.75,
  pageHeight: 19.2,
  pageBottom: 19.2 - 0.75, // pageHeight - yMargin,
  maxLineWidth: 8.5,
  maxTitleLineWidth: 8 - 2, // maxLineWidth - 2,
}

export const saveCompactPdf = (data: IPrintPdf): jsPDF => {
  const { factionName, hiddenReminders, reminders, ...currentArmy } = data

  const visibleReminders = getVisibleReminders(reminders, hiddenReminders)

  const doc = new jsPDF({
    unit: 'in',
    lineHeight: 1.2,
  })

  const Layout = new PdfLayout('compact', PageOpts, Styles)

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

  const col1X = 4.2

  pages.forEach((page, pageNum) => {
    if (pageNum !== 0) doc.addPage()
    let [x, y] = Layout.getInitialXY()
    let colY = y
    let colIdx: 0 | 1 = 0
    let ruleCount = 0

    // debugger
    page.forEach((t, i) => {
      // Don't add spacers to the start or end of page
      if ((i === 0 || i === page.length - 1) && ['spacer', 'titlespacer', 'break'].includes(t.type)) return

      if (t.type === 'phase') {
        colIdx = 0
        ruleCount = 0
      }

      if (t.type === 'title') {
        ruleCount = ruleCount + 1
        if (colIdx === 0) colY = y
      }

      if ((t.type === 'spacer' || t.type === 'titlespacer') && colIdx === 1) {
        y = (colY > y ? colY : y) + Styles.break.spacing
        colY = y
      }

      if (t.type === 'titlespacer' && ruleCount > 0) {
        colIdx = colIdx === 0 ? 1 : 0
      }

      if (t.type === 'titlespacer' && colIdx === 1) return

      const isPhase = t.type === 'phase'
      const isArmy = t.type.startsWith('army')
      const style = Styles[t.type]
      const textX = isPhase || isArmy ? centerX : colIdx === 0 ? x : col1X
      const textAlign = isPhase || isArmy ? 'center' : 'left'
      const textY = colIdx === 0 ? y : colY

      if (isArmy) colIdx = 0

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
            y - style.spacing + 0.01,
            pageWidth - PageOpts.xMargin * 2 + 0.1,
            style.spacing + 0.04,
            0.05,
            0.05,
            'S'
          )
      }
      if (t.type === 'armyName') {
        const lineY = y - style.spacing + 0.15
        doc
          .setLineWidth(0.0001)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, lineY, pageWidth - PageOpts.xMargin + 0.1, lineY)
      }

      if (t.type === 'armyEnd') {
        const lineY = y + style.spacing - 0.09
        doc
          .setLineWidth(0.0001)
          .setDrawColor(28, 117, 149)
          .line(x - 0.1, lineY, pageWidth - PageOpts.xMargin + 0.1, lineY)
      }

      if (colIdx === 0) y = y + style.spacing
      if (colIdx === 1) colY = colY + style.spacing

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
        const [logoW, logoH, logoSpacer] = [1.43, 1, 0.4]

        if (y + logoH + logoSpacer <= PageOpts.pageBottom) {
          doc.addImage(Logo, 'png', centerX - logoW / 2 + 0.15, y + logoSpacer)
        }
      }
    })
  })

  return doc
}
