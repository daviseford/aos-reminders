import { ConfirmDismissNotificationModal } from 'components/info/confirm_dismiss_notification_modal'
import { useTheme } from 'context/useTheme'
import React, { useCallback, useState } from 'react'
import { IconContext, IconType } from 'react-icons'
import {
  MdAdd,
  MdClear,
  MdExpandMore,
  MdRemove,
  MdUnfoldLess,
  MdUnfoldMore,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'

export type TVisibilityIconType = 'clear' | 'eye' | 'fold' | 'minus'

interface IVisibilityToggleProps {
  isVisible: boolean
  setVisibility?: () => void
  size?: number
  type?: TVisibilityIconType
  className?: string
  withConfirmation?: boolean
}

const icons: Record<TVisibilityIconType, { visible: IconType; hidden: IconType }> = {
  clear: {
    visible: MdClear,
    hidden: MdAdd,
  },
  eye: {
    visible: MdVisibility,
    hidden: MdVisibilityOff,
  },
  fold: {
    visible: MdUnfoldLess,
    hidden: MdUnfoldMore,
  },
  minus: {
    visible: MdRemove,
    hidden: MdExpandMore,
  },
}

export const VisibilityToggle: React.FC<IVisibilityToggleProps> = props => {
  const {
    isVisible,
    setVisibility,
    size = 1.4,
    type = 'eye',
    className = '',
    withConfirmation = false,
  } = props
  const { theme } = useTheme()

  const icon = icons[type]
  const VisibilityComponent = isVisible ? icon.visible : icon.hidden
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleClick = e => {
    e?.preventDefault?.()
    withConfirmation ? openModal() : handleSetVisibility(e)
  }

  const handleSetVisibility = useCallback(
    e => {
      e?.preventDefault?.()
      setVisibility?.()
    },
    [setVisibility]
  )

  return (
    <>
      <IconContext.Provider value={{ size: `${size}em`, className: className || theme.text }}>
        <VisibilityComponent onClick={handleClick} />
      </IconContext.Provider>
      {modalIsOpen && (
        <ConfirmDismissNotificationModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          visibilityHandler={handleSetVisibility}
        />
      )}
    </>
  )
}
