import { useTheme } from 'context/useTheme'
import { FaTrash } from 'react-icons/fa'
import { MdFileDownload, MdFileUpload, MdRefresh, MdSave, MdShare, MdVisibility } from 'react-icons/md'

interface ToolbarProps {
  hiddenCount: number
  onClearArmy: () => void
  onDownloadPdf: () => void
  onImportArmy: () => void
  onOpenSavedArmies: () => void
  onResetArmy: () => void
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
    <button type="button" className={theme.genericButtonBlock} disabled={disabled} onClick={onClick}>
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
  onResetArmy,
  onShareArmy,
  onShowAll,
  subscriberActionDisabled,
}: ToolbarProps) => (
  <div className="container d-print-none">
    <div className="row justify-content-center pt-3">
      <div className={buttonWrapperClass}>
        <ToolbarButton onClick={onClearArmy}>
          <FaTrash className="mr-2" />
          Clear Army
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton onClick={onResetArmy}>
          <MdRefresh className="mr-2" />
          Reset Army
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton onClick={onDownloadPdf}>
          <MdFileDownload className="mr-2" />
          Download PDF
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={subscriberActionDisabled} onClick={onImportArmy}>
          <MdFileUpload className="mr-2" />
          Import Army
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={subscriberActionDisabled} onClick={onOpenSavedArmies}>
          <MdSave className="mr-2" />
          My Armies
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={subscriberActionDisabled} onClick={onShareArmy}>
          <MdShare className="mr-2" />
          Share Army
        </ToolbarButton>
      </div>
      <div className={buttonWrapperClass}>
        <ToolbarButton disabled={!hiddenCount} onClick={onShowAll}>
          <MdVisibility className="mr-2" />
          Show Hidden{hiddenCount ? ` (${hiddenCount})` : ''}
        </ToolbarButton>
      </div>
    </div>
  </div>
)

export default Toolbar
