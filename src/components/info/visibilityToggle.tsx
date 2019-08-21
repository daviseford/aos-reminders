import React from 'react'
import { IconContext, IconType } from 'react-icons'
import { MdVisibility, MdVisibilityOff, MdUnfoldLess, MdUnfoldMore } from 'react-icons/md'

export type TVisibilityIconType = 'eye' | 'fold'

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
