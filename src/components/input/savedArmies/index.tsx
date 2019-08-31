import React from 'react'
import { SaveArmyBtn } from './save_army_btn'
import { ShowSavedArmies } from './saved_armies'

export const SaveLoadArmies = () => (
  <div className="row justify-content-center pt-3">
    <SaveArmyBtn />
    <ShowSavedArmies />
  </div>
)
