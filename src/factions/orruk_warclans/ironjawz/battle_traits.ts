import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_CHARGE_PHASE, START_OF_ROUND } from 'types/phases'

const IronjawzBattleTraits = {
  'Battle Tactics': {
    effects: [
      {
        name: `Squish Da Puny Gitz`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the IRONJAWZ keyword and there is at least 1 enemy Battleline unit on the battlefield. You complete this tactic if there are no enemy Battleline units on the battlefield at the end of this turn.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Ironjawz Waaaagh!': {
    effects: [
      {
        name: `Ironjawz Waaaagh!`,
        desc: `Once per battle, at the start of your charge phase, you can pick 1 friendly IRONJAWZ general on the battlefield and say that they are calling an Ironjawz Waaagh!. Until the end of that turn, add 1 to charge rolls for friendly IRONJAWZ units and improve the Rend characteristic of melee weapons used by friendly IRONJAWZ units by 1.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Smashing and Bashing': {
    effects: [
      {
        name: `Smashing and Bashing`,
        desc: `In the combat phase, after a friendly IRONJAWZ unit has fought, if any enemy units were destroyed by an attack made by that unit, you can pick 1 friendly IRONJAWZ unit that has not yet fought in that combat phase and that is within 3" of an enemy unit. That friendly IRONJAWZ unit fights immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(IronjawzBattleTraits, 'battle_trait')
