import { useTheme } from 'context/useTheme'
import { FaTrash } from 'react-icons/fa'
import {
  MdCloud,
  MdCloudUpload,
  MdFileDownload,
  MdFileUpload,
  MdSave,
  MdSaveAs,
  MdShare,
  MdVisibility,
} from 'react-icons/md'

interface ToolbarProps {
  /** The current army mirrors a cloud army, so saving splits into Update Army and Save As. */
  cloudArmyLinked: boolean
  /** Name of that cloud army, so Update Army is never a write to an unnamed target. */
  cloudArmyName?: string
  /** The army on screen differs from the saved copy, so Update Army has something to write. */
  cloudArmyHasChanges?: boolean
  hiddenCount: number
  onClearArmy: () => void
  onDownloadPdf: () => void
  onImportArmy: () => void
  onOpenSavedArmies: () => void
  onSaveArmy: () => void
  onShareArmy: () => void
  onShowAll: () => void
  onUpdateArmy: () => void
  subscriberActionDisabled?: boolean
  updateArmyStatus: 'idle' | 'updating' | 'updated'
}

/*
 * `col-lg-auto`, not `col-lg`: equal-split columns made any button that wrapped onto its own line
 * grow to the full container width. Content-sized cells keep a wrapped button chip-sized and
 * centred; the `.ToolbarButtonCell` floor in index.scss keeps the chips visually even across
 * labels as short as "Save As".
 */
const buttonWrapperClass = 'col-6 col-sm-4 col-lg-auto px-2 pb-2 ToolbarButtonCell'

const ToolbarButton = ({
  children,
  disabled,
  onClick,
}: React.PropsWithChildren<{ disabled?: boolean; onClick: () => void }>) => {
  const { theme } = useTheme()
  return (
    /*
     * TapTargetBlock: Bootstrap's default button padding left these at 38px tall, under the 44px
     * DESIGN.md sets. This is the most-tapped row in the product and it is used mid-turn with one
     * hand, so the six of them are sized by the finger. Applied here rather than on
     * theme.genericButtonBlock, which is also the default for every GenericButton in the app.
     */
    <button
      type="button"
      className={`${theme.genericButtonBlock} TapTargetBlock`}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="d-flex align-items-center justify-content-center text-nowrap">{children}</div>
    </button>
  )
}

const updateArmyLabel = (status: ToolbarProps['updateArmyStatus']): string => {
  if (status === 'updating') return 'Updating…'
  if (status === 'updated') return 'Updated'
  return 'Update Army'
}

const Toolbar = ({
  cloudArmyLinked,
  cloudArmyName,
  cloudArmyHasChanges,
  hiddenCount,
  onClearArmy,
  onDownloadPdf,
  onImportArmy,
  onOpenSavedArmies,
  onSaveArmy,
  onShareArmy,
  onShowAll,
  onUpdateArmy,
  subscriberActionDisabled,
  updateArmyStatus,
}: ToolbarProps) => {
  const { theme } = useTheme()
  /*
   * Absent, not disabled, when there is nothing to save — the rule Show Hidden follows. It stays
   * through "Updating…" and "Updated" so the confirmation is not yanked away by the very save that
   * earned it; the button then leaves, and the line below says the army is up to date.
   */
  const showUpdateArmy = cloudArmyLinked && (cloudArmyHasChanges || updateArmyStatus !== 'idle')

  return (
    <div className="container d-print-none">
      <div className="row justify-content-center pt-3">
        <div className={buttonWrapperClass}>
          <ToolbarButton onClick={onClearArmy}>
            <FaTrash className="me-2" />
            Clear Army
          </ToolbarButton>
        </div>
        <div className={buttonWrapperClass}>
          <ToolbarButton onClick={onDownloadPdf}>
            <MdFileDownload className="me-2" />
            Download PDF
          </ToolbarButton>
        </div>
        <div className={buttonWrapperClass}>
          <ToolbarButton onClick={onImportArmy}>
            <MdFileUpload className="me-2" />
            Import Army
          </ToolbarButton>
        </div>
        {cloudArmyLinked ? (
          <>
            {showUpdateArmy && (
              /*
               * A wider floor than its siblings, because this is the one cell whose label changes.
               * "Updating…" and "Updated" are both narrower than "Update Army", so a content-sized
               * cell shrank mid-save and the centred row slid every other button 8px sideways.
               */
              <div className={`${buttonWrapperClass} ToolbarButtonCell--status`}>
                <ToolbarButton
                  disabled={subscriberActionDisabled || updateArmyStatus === 'updating'}
                  onClick={onUpdateArmy}
                >
                  <MdCloudUpload className="me-2" />
                  {updateArmyLabel(updateArmyStatus)}
                </ToolbarButton>
              </div>
            )}
            <div className={buttonWrapperClass}>
              <ToolbarButton disabled={subscriberActionDisabled} onClick={onSaveArmy}>
                <MdSaveAs className="me-2" />
                Save As
              </ToolbarButton>
            </div>
          </>
        ) : (
          <div className={buttonWrapperClass}>
            <ToolbarButton disabled={subscriberActionDisabled} onClick={onSaveArmy}>
              <MdSave className="me-2" />
              Save Army
            </ToolbarButton>
          </div>
        )}
        <div className={buttonWrapperClass}>
          <ToolbarButton disabled={subscriberActionDisabled} onClick={onOpenSavedArmies}>
            <MdCloud className="me-2" />
            My Armies
          </ToolbarButton>
        </div>
        <div className={buttonWrapperClass}>
          <ToolbarButton disabled={subscriberActionDisabled} onClick={onShareArmy}>
            <MdShare className="me-2" />
            Share Army
          </ToolbarButton>
        </div>
        {/* Absent, not disabled, until a reminder is hidden: a control with nothing to act on is noise. */}
        {hiddenCount > 0 && (
          <div className={buttonWrapperClass}>
            <ToolbarButton onClick={onShowAll}>
              <MdVisibility className="me-2" />
              Show Hidden ({hiddenCount})
            </ToolbarButton>
          </div>
        )}
      </div>

      {/*
       * Update Army is a write to a record on the player's account. Naming that record here is what
       * stops it being an overwrite of something they can only identify from memory — which was the
       * state of things when two same-named armies were trivial to create.
       */}
      {cloudArmyLinked && cloudArmyName && (
        <p className={`small text-center mb-0 pb-2 ${theme.textMuted}`}>
          Cloud army: <strong>{cloudArmyName}</strong>
          {/*
           * Said in words, because the absence of a button is not a message. Without this, an army
           * that is already saved and one whose Update Army has simply gone missing look the same.
           */}
          {cloudArmyHasChanges ? ' · unsaved changes' : ' · up to date'}
        </p>
      )}
    </div>
  )
}

export default Toolbar
