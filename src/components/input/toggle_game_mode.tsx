import React from 'react'
import Switch from 'react-switch'
import { useAppStatus } from 'context/useAppStatus'
import { centerContentClass } from 'theme/helperClasses'

const ToggleGameMode = () => {
  const { isGameMode, toggleGameMode } = useAppStatus()

  const enableEditMode = () => isGameMode && toggleGameMode()
  const enableGameMode = () => !isGameMode && toggleGameMode()

  const spanClass = `align-self-center pb-2`

  return (
    <div className={`${centerContentClass} text-white`}>
      <div className={`d-inline-flex flex-row`}>
        <span
          className={`${spanClass} mr-2 ${isGameMode ? `` : `font-weight-bold`}`}
          onClick={enableEditMode}
        >
          Edit
        </span>
        <label htmlFor="visual-theme-switch" className="mb-0">
          <Switch
            onChange={toggleGameMode}
            checked={isGameMode}
            onColor="#1C7595"
            onHandleColor="#E9ECEF"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={80}
            className="react-switch"
            id="visual-theme-switch"
          />
        </label>
        <span
          className={`${spanClass} ml-2 ${isGameMode ? `font-weight-bold` : ``}`}
          onClick={enableGameMode}
        >
          Play
        </span>
      </div>
    </div>
  )
}

export default ToggleGameMode
