import { createSlice } from 'redux-starter-kit'
import { IArmy } from 'types/army'
import { Game } from 'meta/game_structure'
import { TSupportedFaction } from 'meta/factions'
import { getArmy } from 'utils/getArmy/getArmy'
import { IArmyStore } from 'types/store'

const initialState: IArmyStore = {
  army: {
    Abilities: [],
    Allegiances: [],
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

const resetArmy = (state, action) => {
  state.army = initialState.army
}
const resetAllyArmies = (state, action) => {
  state.allyArmies = initialState.allyArmies
}
const updateArmy = (state, action: { payload: IArmy }) => {
  state.army = action.payload
}
const updateAllyArmy = (state, action: { payload: { factionName: TSupportedFaction; Army: IArmy } }) => {
  const { factionName, Army } = action.payload
  state.allyArmies[factionName] = Army
}
const updateAllyArmies = (state, action: { payload: { factionName: TSupportedFaction; Army: IArmy }[] }) => {
  action.payload.forEach(update => {
    const { factionName, Army } = update
    state.allyArmies[factionName] = Army
  })
}
const switchAllyArmy = (state, action: { payload: { next: TSupportedFaction; prev: TSupportedFaction } }) => {
  const { next, prev } = action.payload
  delete state.allyArmies[prev]
  state.allyArmies[next] = getArmy(next)
}
const deleteAllyArmy = (state, action: { payload: TSupportedFaction }) => {
  delete state.allyArmies[action.payload]
}

export const army = createSlice({
  slice: 'army',
  initialState,
  reducers: {
    deleteAllyArmy,
    resetAllArmies: (state, action) => initialState,
    resetAllyArmies,
    resetArmy,
    switchAllyArmy,
    updateAllyArmies,
    updateAllyArmy,
    updateArmy,
  },
})
