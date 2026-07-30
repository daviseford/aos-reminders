import { useIsMobile } from 'components/aos4/useIsMobile'
import { useTheme } from 'context/useTheme'
import { MdExpandMore, MdRemove } from 'react-icons/md'

interface CollapsibleCardHeaderProps {
  /** id of the card body this header controls, so assistive tech can associate the two */
  bodyId: string
  isExpanded: boolean
  onToggle: () => void
  title: string
}

/**
 * The shared header for the builder and reminder cards.
 *
 * It is a real <button> rather than a div with role="button" so that Enter and Space both activate
 * it, the expanded state is announced, and focus behaves natively. The card-header element keeps its
 * background, border, and radius; the padding moves onto the button so the whole header stays
 * clickable. Rendered output is unchanged.
 */
export const CollapsibleCardHeader = ({
  bodyId,
  isExpanded,
  onToggle,
  title,
}: CollapsibleCardHeaderProps) => {
  const { theme } = useTheme()
  const isMobile = useIsMobile()

  return (
    <div className={`${theme.cardHeader} p-0`}>
      <button
        aria-controls={bodyId}
        aria-expanded={isExpanded}
        className={isMobile ? 'CardHeaderToggle-Mobile' : 'CardHeaderToggle'}
        onClick={onToggle}
        type="button"
      >
        <div className={`d-flex justify-content-${isMobile ? 'end' : 'center'} align-items-center`}>
          <div className={`flex-grow-1 text-center ${isMobile ? '' : 'ps-5'}`}>
            <h2 className="CardHeaderTitle">{title}</h2>
          </div>
          <div className={`${isMobile ? 'pe-0' : 'px-3'} d-print-none`}>
            {isExpanded ? <MdRemove aria-hidden /> : <MdExpandMore aria-hidden />}
          </div>
        </div>
      </button>
    </div>
  )
}

export default CollapsibleCardHeader
