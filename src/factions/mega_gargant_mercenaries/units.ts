import { pickEffects, tagAs } from 'factions/metatagger'
import SonsOfBehematBattleTraits from 'factions/sons_of_behemat/battle_traits'
import { COMBAT_PHASE, END_OF_COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Units = {
  'Bundo Whalebiter - Kraken-Eater': {
    effects: [
      ...pickEffects(SonsOfBehematBattleTraits, ['KrakenEater']),
      {
        name: `Dead Cunning, For a Gargant`,
        desc: `At the start of the combat phase. you can say that this model will be uncannily cunning. If you do so, this model fights at the end of that phase, but you can reroll hit rolls for attacks made by this model in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'One-Eyed Grunnock - Warstomper': {
    effects: [
      ...pickEffects(SonsOfBehematBattleTraits, ['Warstomper']),
      {
        name: `Shake The Earth`,
        desc: `You can reroll hit rolls of 1 for Jump Up and Down attacks made by this model. In addition, subtract 1 from hit rolls for attacks made by enemy units that are within 6" of this model if this model made any Jump Up and Down attacks earlier in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Big Drogg Fort-Kicka - Gatebreaker': {
    effects: [
      ...pickEffects(SonsOfBehematBattleTraits, ['Gatebreaker']),
      {
        name: `Grievous Halitosis`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 3" of this model and roll a number of dice equal to the number of models from that unit that are within 3" of this model. For each 6, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
