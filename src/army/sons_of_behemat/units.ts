import { TUnits } from 'types/army'
import { CHARGE_PHASE, COMBAT_PHASE, START_OF_CHARGE_PHASE } from 'types/phases'
import CommonSonsOfBehematData from './common'

// Unit Names
export const Units: TUnits = [
  {
    name: `Gatebreaker Mega-Gargant`,
    effects: CommonSonsOfBehematData.EFFECTS.GatebreakerMegaGargantEffects,
  },
  {
    name: `Kraken-eater Mega-Gargant`,
    effects: CommonSonsOfBehematData.EFFECTS.KrakenEaterMegaGargantEffects,
  },
  {
    name: `Warstomper Mega-Gargant`,
    effects: CommonSonsOfBehematData.EFFECTS.WarstomperMegaGargantEffects,
  },
  {
    name: `Mancrusher Gargants`,
    effects: [
      {
        name: `Keep Up!`,
        desc: `If this unit is within 12" of a friendly MEGA-GARGANT at the start of the charge phase, it can attempt to charge in that charge phase even if it ran in the same turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Stomping Charge`,
        desc: `After a model from this unit makes a charge move, pick 1 enemy unit within 1" of it and roll a dice. If the roll is equal to or greater than the Stomping Charge value for the charging model shown on the damage table above, that unit suffers D3 mortal wounds. If this unit has more than 1 model, do not allocate the mortal wounds until all of the models in this unit have made their charge moves.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Stuff 'Em In Me Bag`,
        desc: `After a model from this unit piles in, you can pick 1 enemy model within 3" of it and roll a dice. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]
