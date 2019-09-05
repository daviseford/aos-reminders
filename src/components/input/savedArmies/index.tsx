import React from 'react'
import { ShowSavedArmies } from './saved_armies'

export const SaveLoadArmies = () => {
  const colClass = `col-12 col-xl-8`

  return (
    <div className="row d-flex justify-content-center pt-3">
      <div className={colClass}>
        <ShowSavedArmies />
      </div>
    </div>
  )
}
