import type { PrintDocument, PrintPageSize, PrintPreset } from '../../aos4/print'
import { Fragment } from 'react'

interface PrintViewProps {
  document: PrintDocument
  preset: PrintPreset
  pageSize: PrintPageSize
}

const PAGE_RULE: Record<PrintPageSize, string> = {
  a4: 'A4',
  letter: 'Letter',
}

/**
 * Option B: browser printing from a purpose-built print view.
 *
 * It reads the same `PrintDocument` as the PDF renderer, so the two paths cannot drift in content.
 * Pagination is the browser's job here — `break-inside: avoid` in print.scss keeps a rule whole.
 */
const PrintView = ({ document, preset, pageSize }: PrintViewProps) => {
  const marginIn = preset.page.marginTopIn

  return (
    <div className={`PrintView PrintView--${preset.id}`}>
      <style>{`@page { size: ${PAGE_RULE[pageSize]}; margin: ${marginIn}in; }`}</style>

      <div className="PrintView-banner">
        <h1 className="PrintView-title">{document.title}</h1>
        {document.subtitle && <p className="PrintView-subtitle">{document.subtitle}</p>}
      </div>

      <div className="PrintView-flow">
        {document.sections.map(section => (
          <Fragment key={section.key}>
            <div className="PrintView-heading">{section.heading}</div>
            {section.rules.map(rule => (
              <div className="PrintView-rule" key={rule.id}>
                <div className="PrintView-ruleTitle">{rule.title}</div>
                {rule.paragraphs.map((paragraph, index) => (
                  <p
                    className={paragraph.role === 'ruleNote' ? 'PrintView-note' : 'PrintView-body'}
                    key={index}
                  >
                    {paragraph.label && <span className="PrintView-label">{paragraph.label}: </span>}
                    {paragraph.text}
                  </p>
                ))}
              </div>
            ))}
          </Fragment>
        ))}
      </div>

      {document.summary && (
        <div className="PrintView-summary">
          <div className="PrintView-summaryHeading">{document.summary.heading}</div>
          {document.summary.lines.map(line => (
            <p className="PrintView-summaryLine" key={line}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div className="PrintView-footer">
        {document.footer.map(line => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  )
}

export default PrintView
