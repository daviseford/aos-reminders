import GenericDestructiveModal from 'components/modals/generic/generic_destructive_modal'
import { useTheme } from 'context/useTheme'
import React, { useCallback, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
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
  appearance?: 'icon' | 'menuItem'
  className?: string
  isVisible: boolean
  text?: string
  setVisibility?: () => void
  size?: number
  type?: TVisibilityIconType
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
    appearance = 'icon',
    text = '',
    className = '',
    withConfirmation = false,
  } = props
  const { theme } = useTheme()

  const icon = icons[type]
  const VisibilityComponent = isVisible ? icon.visible : icon.hidden
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    withConfirmation ? openModal() : handleSetVisibility(e)
  }

  const handleSetVisibility = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault?.()
      setVisibility?.()
    },
    [setVisibility]
  )

  return (
    <>
      {appearance === 'icon' && (
        <IconContext.Provider value={{ size: `${size}em`, className: className || theme.text }}>
          <VisibilityComponent onClick={handleClick} />
        </IconContext.Provider>
      )}
      {appearance === 'menuItem' && (
        <Dropdown.Item className={className} onClick={handleClick}>
          {isVisible ? `Hide` : `Show`}
          {text && ` ${text}`}
        </Dropdown.Item>
      )}
      {modalIsOpen && (
        <GenericDestructiveModal
          closeModal={closeModal}
          confirmText={'Hide'}
          isOpen={modalIsOpen}
          onConfirm={handleSetVisibility}
          headerText={'Hide Rule?'}
        />
      )}
    </>
  )
}
