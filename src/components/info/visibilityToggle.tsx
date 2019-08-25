import React, { useCallback } from 'react'
import { IconContext, IconType } from 'react-icons'
import {
  MdExpandMore,
  MdRemove,
  MdUnfoldLess,
  MdUnfoldMore,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md'

export type TVisibilityIconType = 'eye' | 'fold' | 'minus'

interface IVisibilityToggleProps {
  isVisible: boolean
  setVisibility?: () => void
  size?: number
  type?: TVisibilityIconType
  className?: string
}

const icons: { [key in TVisibilityIconType]: { visible: IconType; hidden: IconType } } = {
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
  const { isVisible, setVisibility, size = 1.4, type = 'eye', className = '' } = props
  const icon = icons[type]
  const VisibilityComponent = isVisible ? icon.visible : icon.hidden
  const handleSetVisibility = useCallback(
    e => {
      e.preventDefault()
      return setVisibility ? setVisibility() : null
    },
    [setVisibility]
  )

  return (
    <>
      <IconContext.Provider value={{ size: `${size}em`, className }}>
        <VisibilityComponent onClick={handleSetVisibility} />
      </IconContext.Provider>
    </>
  )
}
