import {
  findDeclaredRulesContext,
  type Aos4ImportDiagnostic,
  type Aos4ImportPreview as Aos4ImportPreviewModel,
  type ParsedRoster,
} from '../../../aos4/import'
import { AOS4_CATALOG } from '../../../aos4/generated'
import { useTheme } from 'context/useTheme'

interface ImportPreviewProps {
  diagnostics: Aos4ImportDiagnostic[]
  onContextChange: (rulesContextId: string) => void
  parsedRoster?: ParsedRoster
  preview?: Aos4ImportPreviewModel
  selectedContextId: string
}

const sourceLabels: Record<ParsedRoster['source'], string> = {
  'listbot-text': 'Listbot 4.0',
  'official-app-text': 'Warhammer Age of Sigmar app',
  'roster-xml': 'New Recruit roster file',
}

const importableContexts = AOS4_CATALOG.rulesContexts
  .filter(context => ['current', 'seasonal', 'legends'].includes(context.status))
  .sort((left, right) => left.name.localeCompare(right.name))

const DiagnosticList = ({ diagnostics }: { diagnostics: Aos4ImportDiagnostic[] }) => {
  if (!diagnostics.length) return null
  return (
    <div className="mt-3">
      {diagnostics.map((diagnostic, index) => (
        <div
          className={`alert alert-${diagnostic.severity === 'error' ? 'danger' : 'warning'} py-2 mb-2`}
          key={`${diagnostic.code}-${diagnostic.line ?? 'roster'}-${index}`}
          role={diagnostic.severity === 'error' ? 'alert' : 'status'}
        >
          {diagnostic.line ? `Line ${diagnostic.line}: ` : ''}
          {diagnostic.message}
        </div>
      ))}
    </div>
  )
}

const ImportPreview = ({
  diagnostics,
  onContextChange,
  parsedRoster,
  preview,
  selectedContextId,
}: ImportPreviewProps) => {
  const { theme } = useTheme()
  if (!parsedRoster) return <DiagnosticList diagnostics={diagnostics} />

  const proposedContext = AOS4_CATALOG.rulesContexts.find(
    context => context.id === preview?.proposedDocument?.rulesContextId
  )
  const declaredContext = findDeclaredRulesContext(AOS4_CATALOG, parsedRoster.declaredContext)

  return (
    <section aria-labelledby="import-preview-heading" className="mt-4">
      <h3 className="h5" id="import-preview-heading">
        Import preview
      </h3>
      <dl className="row mb-2">
        <dt className="col-4">Source</dt>
        <dd className="col-8">{sourceLabels[parsedRoster.source]}</dd>
        <dt className="col-4">Army</dt>
        <dd className="col-8">{parsedRoster.proposedName}</dd>
        <dt className="col-4">Faction</dt>
        <dd className="col-8">{parsedRoster.declaredFaction ?? 'Not declared'}</dd>
        <dt className="col-4">Ruleset</dt>
        <dd className="col-8">
          {proposedContext?.name ?? parsedRoster.declaredContext ?? 'Application default'}
        </dd>
      </dl>

      {!declaredContext && (
        <>
          <label className="fw-bold" htmlFor="import-rules-context">
            Which ruleset do you want to use?
          </label>
          <select
            className={`form-control ${theme.bgColor} ${theme.text}`}
            id="import-rules-context"
            onChange={event => onContextChange(event.target.value)}
            value={selectedContextId}
          >
            <option value="">Use the default ruleset</option>
            {importableContexts.map(context => (
              <option key={context.id} value={context.id}>
                {context.name}
              </option>
            ))}
          </select>
        </>
      )}

      <DiagnosticList diagnostics={diagnostics} />
    </section>
  )
}

export default ImportPreview
