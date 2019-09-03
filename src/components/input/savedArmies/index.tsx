import React from 'react'
import { SaveArmyBtn } from './save_army_btn'
import { ShowSavedArmies } from './saved_armies'

export const SaveLoadArmies = () => {
  const colClass = `col-12`

  return (
    <div className="row d-flex justify-content-center pt-3">
      <div className={colClass}>
        <SaveArmyBtn />
      </div>
      <div className={colClass}>
        <ShowSavedArmies />
      </div>
    </div>
  )
}
