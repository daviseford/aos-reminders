import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilities, flavors, and subfactions later.
const CommandAbilities = {
  // Nighthaunt faction CA
  Discorporate: {
    effects: [
      {
        name: `Discorporate`,
        desc: `You can use this command ability when a friendly NIGHTHAUNT unit is picked as the target of an attack in the shooting or combat phase. That unit must receive the command. That unit has a ward of 5+ instead of 6+ until the end of that phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },

  // Unit CA's
  'Passage Through the Underworlds': {
    effects: [
      {
        name: `Passage Through the Underworlds`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick 1 friendly Nighthaunt unit on the battlefield that is visible to this unit. That unit must receive the command. First, remove this unit from the battlefield and set it up again on the battlefield more than 9" from all enemy units. Then, remove that friendly Nighthaunt unit from the battlefield and set it up again wholly within 12" of this unit and more than 9" from all enemy units. This counts as their move for that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Death Magic Incarnate': {
    effects: [
      {
        name: `Death Magic Incarnate`,
        desc: `You can use this command ability if this unit is on the battlefield at the start of the combat phase. The unit that receives this command must be a different friendly DEATH unit. Add 1 to ward rolls for that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
