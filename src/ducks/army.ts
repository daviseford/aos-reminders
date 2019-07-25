import { createSlice, createSelector } from 'redux-starter-kit'
import { IArmy } from 'types/army'
import { Game } from 'meta/game_structure'

type TInitialStateType = {
  army: IArmy
  allyArmy: IArmy | null
}

const initialState: TInitialStateType = {
  army: {
    Abilities: [],
    Artifacts: [],
    Battalions: [],
    Traits: [],
    Units: [],
    Game: Game,
  },
  allyArmy: null,
}

const resetArmy = (state, action) => {
  state.army = initialState.army
}
const resetAllyArmy = (state, action) => {
  state.allyArmy = initialState.allyArmy
}
const updateArmy = (state, action) => {
  state.army = action.payload
}
const updateAllyArmy = (state, action) => {
  state.allyArmy = action.payload
}

export const army = createSlice({
  slice: 'army',
  initialState,
  reducers: {
    resetAllArmies: (state, action) => initialState,
    resetAllyArmy,
    resetArmy,
    updateAllyArmy,
    updateArmy,
  },
})

army.selectors.getArmy = createSelector(
  ['army.army'],
  army => army
)

army.selectors.getAllyArmy = createSelector(
  ['army.allyArmy'],
  allyArmy => allyArmy
)
