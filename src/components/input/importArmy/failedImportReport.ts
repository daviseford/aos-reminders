import type { Aos4ImportDiagnostic } from '../../../aos4/import'
import { GITHUB_URL } from 'utils/env'

interface FailedImportReport {
  diagnostics: readonly Aos4ImportDiagnostic[]
  file: Blob
  fileName: string
}

const MAX_ISSUE_DIAGNOSTICS = 10
const REPORT_FILE_NAME = 'aos-reminders-failed-import'

const githubAttachmentName = (fileName: string): string => {
  const lowerName = fileName.toLocaleLowerCase('en')
  if (lowerName.endsWith('.rosz')) return `${REPORT_FILE_NAME}.rosz.zip`
  if (lowerName.endsWith('.ros')) return `${REPORT_FILE_NAME}.ros.xml`
  if (lowerName.endsWith('.json')) return `${REPORT_FILE_NAME}.json`
  if (lowerName.endsWith('.zip')) return `${REPORT_FILE_NAME}.zip`
  if (lowerName.endsWith('.xml')) return `${REPORT_FILE_NAME}.xml`
  if (lowerName.endsWith('.log')) return `${REPORT_FILE_NAME}.log`
  return `${REPORT_FILE_NAME}.txt`
}

const issueBody = (attachmentName: string, diagnostics: readonly Aos4ImportDiagnostic[]): string => {
  const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === 'error')
  const diagnosticLines = diagnostics
    .slice(0, MAX_ISSUE_DIAGNOSTICS)
    .map(diagnostic => {
      const line = diagnostic.line ? `, line ${diagnostic.line}` : ''
      return `- \`${diagnostic.code}\` (${diagnostic.severity}${line})`
    })
    .join('\n')
  const remainingDiagnostics =
    diagnostics.length > MAX_ISSUE_DIAGNOSTICS
      ? `\n- ${diagnostics.length - MAX_ISSUE_DIAGNOSTICS} more diagnostics omitted from this draft.`
      : ''

  return `## ${hasErrors ? 'Failed import' : 'Import warning'}

AoS Reminders ${hasErrors ? 'could not import this roster.' : 'imported this roster with warnings.'}

## Reproduction file

Attach the downloaded \`${attachmentName}\` file to this issue before submitting it. Its contents are
the exact roster input that produced these diagnostics. Its generic name and any extra \`.xml\`,
\`.zip\`, or \`.txt\` suffix only make the file type attachable on GitHub.

GitHub issues are public. Please remove any private information before attaching the file.
The original filename, roster content, and diagnostic messages were not added to this draft.

## Import diagnostics

${diagnosticLines || '- No diagnostic was available.'}${remainingDiagnostics}
`
}

const createFailedImportIssueUrl = (
  attachmentName: string,
  diagnostics: readonly Aos4ImportDiagnostic[]
): string => {
  const url = new URL(`${GITHUB_URL}/issues/new`, 'https://aosreminders.com')
  const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === 'error')
  url.searchParams.set('title', hasErrors ? '[BUG] Failed roster import' : '[BUG] Roster import warning')
  url.searchParams.set('body', issueBody(attachmentName, diagnostics))
  return url.toString()
}

export const sendFailedImportReport = ({ diagnostics, file, fileName }: FailedImportReport): void => {
  const attachmentName = githubAttachmentName(fileName)
  window.open(createFailedImportIssueUrl(attachmentName, diagnostics), '_blank', 'noopener,noreferrer')

  const downloadUrl = URL.createObjectURL(file)
  const download = document.createElement('a')
  download.href = downloadUrl
  download.download = attachmentName
  download.hidden = true
  document.body.appendChild(download)
  download.click()
  download.remove()
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
}
