import { pickEffects, tagAs } from 'factions/metatagger'
import SonsOfBehematUnits from 'factions/sons_of_behemat/units'
import { COMBAT_PHASE, END_OF_COMBAT_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Units = {
  'Odo Godswallow - Beast-Smasher': {
    effects: [
      ...pickEffects(SonsOfBehematUnits, ['Beast-Smasher']),
      {
        name: `Mighty Wallopwer`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy Monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Bundo Whalebiter - Kraken-Eater': {
    effects: [
      ...pickEffects(SonsOfBehematUnits, ['Kraken-Eater']),
      {
        name: `Dead Cunning, for a Gargant`,
        desc: `At the start of the combat phase. you can say that this model will be uncannily cunning. If you do so, the strike-last effect applies to this unit until the end of that phase. but you can add 1 to hit and wound rolls for attacks made by this model in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'One-Eyed Grunnock - Warstomper': {
    effects: [
      ...pickEffects(SonsOfBehematUnits, ['Warstomper']),
      {
        name: `Shake The Earth`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units within 6" of this model if this unit made any Jump Up and Down attacks earlier in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Big Drogg Fort-Kicka - Gatebreaker': {
    effects: [
      ...pickEffects(SonsOfBehematUnits, ['Gatebreaker']),
      {
        name: `Grievous Halitosis`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 3" of this unit and roll a number of dice equal to the number of models from that unit that are within 3" of this model. For each 6, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
