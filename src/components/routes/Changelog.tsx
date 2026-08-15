import { LinkNewTab } from 'components/helpers/link'
import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import { lazy, Suspense, useEffect, useState } from 'react'
import { formatChangelogValue } from '../../aos4/changelog/format'
import type { Aos4PublishedChangelog } from '../../aos4/changelog/ledger'
import type { ChangeFieldDelta, ChangelogJsonValue, ChangeRecord } from '../../aos4/changelog/types'
import { titleCase } from '../../aos4/view/reminders'

const Navbar = lazy(() => import('components/page/navbar'))

/* The FAQ's reading column: answers stay near 75 characters a line at every breakpoint. */
const columnClass = 'col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-5'

/*
 * The artifact is loaded with a dynamic import so its bytes never join the route's static import
 * graph: the page chunk stays copy-sized and the JSON ships as its own lazy chunk. Display names
 * ride on the records themselves, so the page never needs the 11 MB catalog either.
 */
type LoadState =
  { status: 'loading' } | { status: 'error' } | { status: 'loaded'; changelog: Aos4PublishedChangelog }

const Changelog = () => {
  const { theme } = useTheme()
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })
    import('../../aos4/generated/changelog/changelog.json')
      .then(module => {
        // The JSON import infers plain-string literal types; the ledger owns the real branded shape.
        if (!cancelled) {
          setState({ status: 'loaded', changelog: module.default as unknown as Aos4PublishedChangelog })
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  useEffect(() => {
    if (state.status !== 'loaded') return
    /*
     * Publication sections carry anchors, so /changelog#publication:... has to survive arrival.
     * The targets only exist once the artifact has rendered, hence this runs on load rather than
     * on mount. `instant`, as on the FAQ: Bootstrap 5.3's root scroll-behavior: smooth turns a
     * bare scrollIntoView into an animation the browser's load-time scrolling cancels.
     */
    const { hash } = window.location
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    if (target) target.scrollIntoView({ behavior: 'instant' })
  }, [state.status])

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2 d-print-none`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} ${theme.text} pt-3 pb-5`}>
        <div className="row justify-content-center">
          <div className={columnClass}>
            <PageHeader />
            {state.status === 'loading' && <LoadingChangelog />}
            {state.status === 'error' && <ChangelogUnavailable onRetry={() => setAttempt(n => n + 1)} />}
            {state.status === 'loaded' && <LoadedChangelog changelog={state.changelog} />}
          </div>
        </div>
      </div>

      {/* Footer carries the Contact links and the Games Workshop fan-made disclaimer for every page. */}
      <Footer />
    </div>
  )
}

const PageHeader = () => (
  <div className="text-center">
    {/* Rendered at h2 size so the page gains a top-level heading without a visual change. */}
    <h1 className="h2">Rules Updates</h1>
    <p className="mb-2">
      <small>
        Powered by{' '}
        <LinkNewTab className="FaqLink" href="//wahapedia.ru/aos4/the-rules/">
          Wahapedia
        </LinkNewTab>
      </small>
    </p>
    <hr />
  </div>
)

const LoadingChangelog = () => (
  <div className="text-center py-4" role="status">
    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
    Loading rules updates&hellip;
  </div>
)

const ChangelogUnavailable = ({ onRetry }: { onRetry: () => void }) => {
  const { theme } = useTheme()

  return (
    <div className="alert alert-warning text-center" role="alert">
      The rules updates could not be loaded.
      <br />
      <button type="button" className={`${theme.secondaryButton} mt-2`} onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}

const LoadedChangelog = ({ changelog }: { changelog: Aos4PublishedChangelog }) => {
  const isEmpty = !changelog.publications.length && !changelog.records.length && !changelog.corrections.length
  if (isEmpty) return <EmptyChangelog />

  const newest = changelog.publications[0]

  const recordsByPublication = new Map<string, ChangeRecord[]>()
  changelog.records.forEach(record => {
    if (record.attribution.kind !== 'publication') return
    const { publicationId } = record.attribution
    recordsByPublication.set(publicationId, [...(recordsByPublication.get(publicationId) ?? []), record])
  })

  return (
    <>
      {newest && (
        <p className="text-center">Rules data current through {newest.effectiveDate ?? newest.name}.</p>
      )}
      {changelog.publications.map(publication => (
        <PublicationSection
          key={publication.publicationId}
          publication={publication}
          records={recordsByPublication.get(publication.publicationId) ?? []}
        />
      ))}
      {changelog.corrections.length > 0 && <CorrectionsSection corrections={changelog.corrections} />}
    </>
  )
}

/*
 * The empty artifact is what ships today: the ledger is seeded empty until the first acceptance
 * lands. Plain and second person, no marketing.
 */
const EmptyChangelog = () => {
  const { theme } = useTheme()

  return (
    <div className={`${theme.card} mb-4 shadow-sm`}>
      <div className={theme.cardBody}>
        <p className="mb-1">
          <strong>No rules updates recorded yet.</strong>
        </p>
        <p className="mb-0">
          When a Games Workshop update changes the rules behind your reminders, you will find the changes
          listed here, faction by faction.
        </p>
      </div>
    </div>
  )
}

const PublicationSection = ({
  publication,
  records,
}: {
  publication: Aos4PublishedChangelog['publications'][number]
  records: ChangeRecord[]
}) => {
  const { theme } = useTheme()

  return (
    /* The section id is the publicationId, so /changelog#publication:... deep-links this update. */
    <section className={`${theme.card} mb-4 shadow-sm`} id={publication.publicationId}>
      <div className={theme.cardHeader}>
        <h2 className="CardHeaderTitle">
          {publication.name}
          {publication.effectiveDate ? ` (${publication.effectiveDate})` : ''}
        </h2>
      </div>
      <div className={theme.cardBody}>
        {records.length ? (
          <FactionGroups records={records} />
        ) : (
          <p className={`${theme.textMuted} mb-0`}>No changes from this update affect your reminders.</p>
        )}
      </div>
    </section>
  )
}

const CorrectionsSection = ({ corrections }: { corrections: ChangeRecord[] }) => {
  const { theme } = useTheme()

  return (
    <section className={`${theme.card} mb-4 shadow-sm`} id="corrections">
      <div className={theme.cardHeader}>
        <h2 className="CardHeaderTitle">Corrections</h2>
      </div>
      <div className={theme.cardBody}>
        <p>
          Fixes to our own transcriptions of the published rules. These are not attributed to a Games Workshop
          publication.
        </p>
        <FactionGroups records={corrections} />
      </div>
    </section>
  )
}

/*
 * Ownership carries source-faithful faction names index-parallel to the canonical faction IDs, so
 * the heading never needs the catalog. The IDs are opaque UUIDs; the titleCase transform is only a
 * defensive fallback for records missing a carried name. A record owned by several factions appears
 * once, under the joined heading, rather than duplicated per faction.
 */
const factionDisplayName = (factionId: string): string => titleCase(factionId.replace(/^faction:/, ''))

const factionHeading = (record: ChangeRecord): string => {
  const { factionIds, factionNames } = record.ownership
  if (!factionIds.length) return 'Every army'
  return factionIds
    .map((factionId, index) => factionNames?.[index] ?? factionDisplayName(factionId))
    .join(' / ')
}

const groupByFaction = (records: ChangeRecord[]): { heading: string; records: ChangeRecord[] }[] => {
  const groups = new Map<string, ChangeRecord[]>()
  records.forEach(record => {
    const heading = factionHeading(record)
    groups.set(heading, [...(groups.get(heading) ?? []), record])
  })
  return Array.from(groups, ([heading, grouped]) => ({ heading, records: grouped }))
}

const FactionGroups = ({ records }: { records: ChangeRecord[] }) => (
  <>
    {groupByFaction(records).map(group => (
      <div className="mb-3" key={group.heading}>
        {/* .h5 keeps the faction below the section header in size without changing its outline level. */}
        <h3 className="h5 mb-2">{group.heading}</h3>
        {group.records.map(record => (
          <RecordEntry key={`${record.changeKind}:${record.entityId}`} record={record} />
        ))}
      </div>
    ))}
  </>
)

const changeKindLabel: Record<ChangeRecord['changeKind'], string> = {
  added: 'Added',
  modified: 'Changed',
  removed: 'Removed',
}

const RecordEntry = ({ record }: { record: ChangeRecord }) => {
  const { theme } = useTheme()

  return (
    <div className="mb-2">
      <p className="mb-1">
        <strong>{record.name}</strong>{' '}
        <small className={theme.textMuted}>{changeKindLabel[record.changeKind]}</small>
      </p>
      {record.changeKind === 'modified' && <FieldDeltas fields={record.fields} />}
      {record.changeKind === 'added' && <FactList facts={record.addedFacts} removed={false} />}
      {record.changeKind === 'removed' && <FactList facts={record.removedFacts} removed={true} />}
    </div>
  )
}

const FieldDeltas = ({ fields }: { fields: ChangeFieldDelta[] }) => {
  const { theme } = useTheme()

  return (
    <ul className="mb-0">
      {fields.map(delta => (
        <li key={delta.field}>
          <small className={theme.textMuted}>{delta.field}: </small>
          <del>{formatChangelogValue(delta.previous)}</del> &rarr; {formatChangelogValue(delta.next)}
        </li>
      ))}
    </ul>
  )
}

const FactList = ({ facts, removed }: { facts: Record<string, ChangelogJsonValue>; removed: boolean }) => {
  const { theme } = useTheme()

  return (
    <ul className="mb-0">
      {Object.entries(facts).map(([field, value]) => (
        <li key={field}>
          <small className={theme.textMuted}>{field}: </small>
          {removed ? <del>{formatChangelogValue(value)}</del> : formatChangelogValue(value)}
        </li>
      ))}
    </ul>
  )
}

export default Changelog
