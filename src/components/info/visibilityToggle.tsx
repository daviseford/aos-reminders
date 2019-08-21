import React from 'react'
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
  setVisibility: (e) => void
  size?: number
  type?: TVisibilityIconType
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
  const { isVisible, setVisibility, size = 1.4, type = 'eye' } = props
  const icon = icons[type]
  const VisibilityComponent = isVisible ? icon.visible : icon.hidden

  return (
    <>
      <IconContext.Provider value={{ size: `${size}em` }}>
        <VisibilityComponent onClick={setVisibility} />
      </IconContext.Provider>
    </>
  )
}
