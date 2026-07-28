import { useTheme } from 'context/useTheme'
import { FaTrash } from 'react-icons/fa'
import { MdFileDownload, MdRefresh, MdVisibility } from 'react-icons/md'

interface ToolbarProps {
  hiddenCount: number
  onClearArmy: () => void
  onDownloadPdf: () => void
  onResetArmy: () => void
  onShowAll: () => void
}

const buttonWrapperClass = 'col-6 col-sm-6 col-md-6 col-lg-3 col-xl-3 col-xxl-2 px-2 px-sm-3 pb-2'

const ToolbarButton = ({
  children,
  disabled,
  onClick,
}: React.PropsWithChildren<{ disabled?: boolean; onClick: () => void }>) => {
  const { theme } = useTheme()
  return (
    <button type="button" className={theme.genericButtonBlock} disabled={disabled} onClick={onClick}>
      <div className="d-flex align-items-center justify-content-center">{children}</div>
    </button>
  )
}

const Toolbar = ({ hiddenCount, onClearArmy, onDownloadPdf, onResetArmy, onShowAll }: ToolbarProps) => (
  <div className="container d-print-none">
    <div className="row justify-content-center pt-3 mx-xl-5 px-xl-5">
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
        <ToolbarButton disabled={!hiddenCount} onClick={onShowAll}>
          <MdVisibility className="mr-2" />
          Show Hidden{hiddenCount ? ` (${hiddenCount})` : ''}
        </ToolbarButton>
      </div>
    </div>
  </div>
)

export default Toolbar
