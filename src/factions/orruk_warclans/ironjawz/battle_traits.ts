import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, DURING_GAME } from 'types/phases'

const IronjawzBattleTraits = {
  'Smashing and Bashing': {
    effects: [
      {
        name: `Smashing and Bashing`,
        desc: `In the combat phase, after a friendly IRONJAWZ unit has made all of its attacks, if the attacks made by that unit resulted in any enemy units being destroyed, 1 friendly IRONJAWZ unit that has not yet fought in that combat phase can fight, instead of doing so later in the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Eager for Battle': {
    effects: [
      {
        name: `Eager for Battle`,
        desc: `Add 1 to charge rolls for friendly IRONJAWZ units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Mad as Hell': {
    effects: [
      {
        name: `Mad as Hell`,
        desc: `At the end of any phase, if any wounds or mortal wounds have been inflicted in that phase on an IRONJAWZ unit that is more than 9" from any enemy units, that IRONJAWZ unit can move D6".`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(IronjawzBattleTraits, 'battle_trait')
