import { useTheme } from 'context/useTheme'
import { FaTrash } from 'react-icons/fa'
import { MdFileDownload, MdFileUpload, MdSave, MdShare, MdVisibility } from 'react-icons/md'

interface ToolbarProps {
  hiddenCount: number
  onClearArmy: () => void
  onDownloadPdf: () => void
  onImportArmy: () => void
  onOpenSavedArmies: () => void
  onShareArmy: () => void
  onShowAll: () => void
  subscriberActionDisabled?: boolean
}

const buttonWrapperClass = 'col-6 col-sm-4 col-lg px-2 pb-2'

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

const Toolbar = ({
  hiddenCount,
  onClearArmy,
  onDownloadPdf,
  onImportArmy,
  onOpenSavedArmies,
  onShareArmy,
  onShowAll,
  subscriberActionDisabled,
}: ToolbarProps) => (
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
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={subscriberActionDisabled} onClick={onOpenSavedArmies}>
          <MdSave className="me-2" />
          My Armies
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={subscriberActionDisabled} onClick={onShareArmy}>
          <MdShare className="me-2" />
          Share Army
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={!hiddenCount} onClick={onShowAll}>
          <MdVisibility className="me-2" />
          Show Hidden{hiddenCount ? ` (${hiddenCount})` : ''}
        </ToolbarButton>
      </div>
    </div>
  </div>
)

export default Toolbar
