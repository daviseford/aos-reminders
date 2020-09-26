import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSupportedFaction } from 'meta/factions'
import { Game } from 'meta/game_structure'
import { IArmy } from 'types/army'
import { IArmyStore } from 'types/store'
import { getArmy } from 'utils/getArmy/getArmy'

const initialState: IArmyStore = {
  army: {
    Abilities: [],
    Allegiances: [],
    AllegianceType: '',
    Artifacts: [],
    Battalions: [],
    Commands: [],
    EndlessSpells: [],
    Game: Game,
    Scenery: [],
    Spells: [],
    Traits: [],
    Triumphs: [],
    Units: [],
  },
  allyArmies: {},
}

const army = createSlice({
  name: 'army',
  initialState,
  reducers: {
    deleteAllyArmy: (state, action: PayloadAction<TSupportedFaction>) => {
      delete state.allyArmies[action.payload]
    },
    resetAllArmies: () => initialState,
    resetAllyArmies: state => {
      state.allyArmies = initialState.allyArmies
    },
    resetArmy: state => {
      state.army = initialState.army
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
