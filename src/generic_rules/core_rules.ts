import { DURING_GAME } from 'types/phases'

const CoreRules = {
  'Unit Coherency': {
    name: `Unit Coherency`,
    desc: `Units must be set up and finish every move as a single coherent group. A unit with 2 to 5 models is coherent if each model in the unit is w7ithin 1" horizontally and 6" vertically of at least 1 other model in the unit. A unit with more than 5 models is coherent if each model in the unit is within 1" horizontally and 6" vertically of at least 2 other models in the unit. If a friendly unit is not coherent at the end of a turn or after you set it up, you must remove models in the unit from play, one at a time, until it is coherent.`,
    when: [DURING_GAME],
  },
}

export default CoreRules
