import { createSlice, createSelector } from 'redux-starter-kit'
import { IArmy, TUnits, TAllyArmies } from 'types/army'
import { Game } from 'meta/game_structure'
import { TSupportedFaction } from 'meta/factions'

type TInitialStateType = {
  army: IArmy
  allyArmies: TAllyArmies
}

const initialState: TInitialStateType = {
  army: {
    Abilities: [],
    Artifacts: [],
    Battalions: [],
    EndlessSpells: [],
    Spells: [],
    Traits: [],
    Units: [],
    Game: Game,
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
    updateAllyArmy,
    updateArmy,
  },
})

army.selectors.getArmy = createSelector(
  ['army.army'],
  army => army
)

army.selectors.getAllyArmies = createSelector(
  ['army.allyArmies'],
  allyArmies => allyArmies
)
