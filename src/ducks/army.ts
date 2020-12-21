import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSupportedFaction } from 'meta/factions'
import DefaultAppState from 'store/initialAppState'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy/getArmy'

const army = createSlice({
  name: 'army',
  initialState: DefaultAppState.army,
  reducers: {
    deleteAllyArmy: (state, action: PayloadAction<TSupportedFaction>) => {
      delete state.allyArmies[action.payload]
    },
    resetAllArmies: () => DefaultAppState.army,
    resetAllyArmies: state => {
      state.allyArmies = DefaultAppState.army.allyArmies
    },
    resetArmy: state => {
      state.army = DefaultAppState.army.army
    },
    switchAllyArmy: (state, action: PayloadAction<{ next: TSupportedFaction; prev: TSupportedFaction }>) => {
      const { next, prev } = action.payload
      delete state.allyArmies[prev]
      const nextAllyArmy = getArmy(next)
      if (nextAllyArmy) state.allyArmies[next] = nextAllyArmy
    },
    updateAllyArmy: (state, action: PayloadAction<{ factionName: TSupportedFaction; Army: IArmy }>) => {
      const { factionName, Army } = action.payload
      state.allyArmies[factionName] = Army
    },
    updateAllyArmies: (state, action: PayloadAction<{ factionName: TSupportedFaction; Army: IArmy }[]>) => {
      action.payload.forEach(update => {
        const { factionName, Army } = update
        state.allyArmies[factionName] = Army
      })
    },
    updateArmy: (state, action: PayloadAction<IArmy>) => {
      state.army = action.payload
    },
  },
})

export const armyActions = army.actions
export default army.reducer
