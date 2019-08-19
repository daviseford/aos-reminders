import React from 'react'
import { IconContext } from 'react-icons'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

interface IVisibilityToggleProps {
  isVisible: boolean
  setVisibility: (e) => void
  size?: number
}

export const VisibilityToggle: React.FC<IVisibilityToggleProps> = props => {
  const { isVisible, setVisibility, size = 1.4 } = props
  const VisibilityComponent = isVisible ? MdVisibility : MdVisibilityOff
  return (
    <>
      <IconContext.Provider value={{ size: `${size}em` }}>
        <VisibilityComponent onClick={setVisibility} />
      </IconContext.Provider>
    </>
  )
}
