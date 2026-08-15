import {
  computeAos4PublicationImpacts,
  formatChangelogValue,
  isAos4ChangelogStampBehind,
  totalAos4ChangelogImpact,
  unacknowledgedAos4PublicationIds,
  type Aos4PublicationImpact,
  type Aos4PublishedChangelog,
  type ChangeFieldDelta,
} from '../../../aos4/changelog'
import {
  acknowledgeAos4Publication,
  advanceAos4ChangelogStamp,
  catchUpAos4Changelog,
  type Aos4ArmyDocument,
} from '../../../aos4/state'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { Link } from 'react-router'
import { centerContentClass } from 'theme/helperClasses'
import { logBannerClose, logBannerView } from 'utils/analytics'
import { ROUTES } from 'utils/env'

export interface ChangelogBannerProps {
  /** The published changelog artifact; absent while loading or after a failed import (fail-open). */
  artifact?: Aos4PublishedChangelog
  document: Aos4ArmyDocument
  /** The slot's usual occupant, rendered whenever this banner has nothing to say. */
  fallback?: ReactNode
  /** Canonical ability IDs hidden in this army's reminders, so their changes can be labeled. */
  hiddenAbilityIds: readonly string[]
  /** Precomputed per-publication impacts for this army and artifact; absent while the artifact is. */
  impacts?: readonly Aos4PublicationImpact[]
  isGameMode: boolean
  /** Canonical ability IDs this army's reminder projection carries, hidden ones included. */
  projectedAbilityIds: readonly string[]
  setDocument: Dispatch<SetStateAction<Aos4ArmyDocument>>
}

const changeNoun = (count: number): string => (count === 1 ? '1 change' : `${count} changes`)

/**
 * The in-army rules update banner for the home screen's single banner slot.
 *
 * Edit mode only, and document-based rather than localStorage-based: dismissing a publication
 * acknowledges it on the army document itself, so the dismissal travels with the army through
 * save, share, and cloud sync, and a different army still gets its own banner.
 */
export const ChangelogBanner = ({
  artifact,
  document,
  fallback = null,
  hiddenAbilityIds,
  impacts,
  isGameMode,
  projectedAbilityIds,
  setDocument,
}: ChangelogBannerProps) => {
  const [showDetails, setShowDetails] = useState(false)
  /*
   * The behind-window dismissal is session-only React state, never written to the document: the
   * generic banner carries no publication to acknowledge, and persisting a blanket dismissal
   * would silence every future update too.
   */
  const [behindDismissed, setBehindDismissed] = useState(false)
  const loggedViews = useRef(new Set<string>())

  const revision = artifact?.revision ?? null
  const stamp = document.changelog?.lastSeenRevision
  const behind = Boolean(artifact && isAos4ChangelogStampBehind(artifact, document))

  const activeImpacts = useMemo(() => {
    if (!artifact || revision === null || !stamp || behind || stamp === revision || isGameMode) return []
    const unacknowledged = new Set<string>(unacknowledgedAos4PublicationIds(artifact, document))
    return (impacts ?? []).filter(
      impact => impact.total > 0 && unacknowledged.has(impact.publication.publicationId)
    )
  }, [artifact, behind, document, impacts, isGameMode, revision, stamp])

  let mode: 'none' | 'behind' | 'rollup' = 'none'
  if (!isGameMode && artifact && revision !== null && stamp) {
    if (behind) mode = behindDismissed ? 'none' : 'behind'
    else if (activeImpacts.length) mode = 'rollup'
  }

  useEffect(() => {
    const names =
      mode === 'behind'
        ? ['changelog:behind']
        : mode === 'rollup'
          ? activeImpacts.map(impact => `changelog:${impact.publication.publicationId}`)
          : []
    // Bounded IDs only, never rules text; each name is logged once per mount.
    names.forEach(name => {
      if (loggedViews.current.has(name)) return
      loggedViews.current.add(name)
      logBannerView(name)
    })
  }, [activeImpacts, mode])

  if (mode === 'none') return <>{fallback}</>

  if (mode === 'behind') {
    /*
     * Following the link is the explicit "I've seen the changelog" act: the catch-up stamps the
     * army AND acknowledges every retained publication (clearing removal records with them), so
     * the updates suppressed behind this generic banner never resurface as news at the next
     * acceptance.
     */
    const handleFollowLink = () => {
      if (!artifact || revision === null) return
      setDocument(current =>
        catchUpAos4Changelog(current, {
          revision,
          retainedPublicationIds: artifact.retainedPublicationIds,
        })
      )
    }
    const handleDismiss = () => {
      logBannerClose('changelog:behind')
      setBehindDismissed(true)
    }
    return (
      <div className="alert alert-info text-center fade show d-flex my-0 d-print-none" role="alert">
        <div className={`flex-grow-1 ${centerContentClass}`}>
          <span>
            Your army was last reviewed several updates ago.{' '}
            <Link className="alert-link" onClick={handleFollowLink} to={ROUTES.CHANGELOG}>
              See the rules updates
            </Link>
          </span>
        </div>
        <button
          type="button"
          className="btn-close align-self-start ms-2 flex-shrink-0"
          aria-label="Dismiss rules update notification"
          onClick={handleDismiss}
        />
      </div>
    )
  }

  const handleDismissPublication = (publicationId: string) => {
    if (!artifact || revision === null) return
    logBannerClose(`changelog:${publicationId}`)
    setDocument(current => {
      const acknowledged = acknowledgeAos4Publication(current, publicationId)
      const impacts = computeAos4PublicationImpacts(artifact, {
        document: acknowledged,
        projectedAbilityIds,
      })
      return advanceAos4ChangelogStamp(acknowledged, {
        currentRevision: revision,
        retainedPublicationIds: artifact.retainedPublicationIds,
        affectingPublicationIds: impacts
          .filter(impact => impact.total > 0)
          .map(impact => impact.publication.publicationId),
      })
    })
  }

  const total = totalAos4ChangelogImpact(activeImpacts)
  const summaryName =
    activeImpacts.length === 1 ? activeImpacts[0].publication.name : `${activeImpacts.length} rules updates`

  return (
    <div className="alert alert-info fade show my-0 d-print-none" role="alert">
      <div className={`text-center ${centerContentClass}`}>
        <span>
          <strong>{summaryName}</strong> made {changeNoun(total)} to this army.{' '}
          <button
            type="button"
            className="btn btn-sm btn-link alert-link p-0 align-baseline"
            aria-expanded={showDetails}
            onClick={() => setShowDetails(current => !current)}
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </button>
        </span>
      </div>
      {showDetails && (
        <div className="text-start mt-2">
          {activeImpacts.map(impact => (
            <PublicationDetail
              key={impact.publication.publicationId}
              hiddenAbilityIds={hiddenAbilityIds}
              impact={impact}
              onDismiss={handleDismissPublication}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const FieldList = ({ fields }: { fields: ChangeFieldDelta[] }) => (
  <ul className="mb-0">
    {fields.map(delta => (
      <li key={delta.field}>
        <small>{delta.field}: </small>
        <del>{formatChangelogValue(delta.previous)}</del> &rarr; {formatChangelogValue(delta.next)}
      </li>
    ))}
  </ul>
)

const PublicationDetail = ({
  hiddenAbilityIds,
  impact,
  onDismiss,
}: {
  hiddenAbilityIds: readonly string[]
  impact: Aos4PublicationImpact
  onDismiss: (publicationId: string) => void
}) => (
  <div className="mb-2">
    <div className="d-flex align-items-start">
      <strong className="flex-grow-1">
        {impact.publication.name}
        {impact.publication.effectiveDate ? ` (${impact.publication.effectiveDate})` : ''}
      </strong>
      {/* flex-shrink-0 keeps the 24px hit box intact when the publication name runs long. */}
      <button
        type="button"
        className="btn-close ms-2 flex-shrink-0"
        aria-label={`Dismiss ${impact.publication.name}`}
        onClick={() => onDismiss(impact.publication.publicationId)}
      />
    </div>
    <ul className="mb-0">
      {impact.reminderChanges.map(record => (
        <li key={`reminder:${record.entityId}`}>
          <strong>{record.name}</strong>{' '}
          <small>
            Changed
            {hiddenAbilityIds.includes(record.entityId) ? ' (hidden in your reminders)' : ''}
          </small>
          <FieldList fields={record.fields} />
        </li>
      ))}
      {impact.profileChanges.map(record => (
        <li key={`profile:${record.entityId}`}>
          <strong>{record.name}</strong> <small>Unit profile changed</small>
          <FieldList fields={record.fields} />
        </li>
      ))}
      {impact.removals.map(record => (
        <li key={`removed:${record.entityId}`}>
          <strong>{record.name}</strong> <small>Removed</small>
          <ul className="mb-0">
            {Object.entries(record.removedFacts).map(([field, value]) => (
              <li key={field}>
                <small>{field}: </small>
                <del>{formatChangelogValue(value)}</del>
              </li>
            ))}
          </ul>
        </li>
      ))}
      {impact.unexplainedRemovedSelections.map(selection => (
        <li key={`selection:${selection.selectionId}`}>
          A unit or option this army had selected is no longer available.
        </li>
      ))}
    </ul>
  </div>
)
