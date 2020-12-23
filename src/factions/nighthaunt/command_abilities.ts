import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_COMBAT_PHASE, START_OF_MOVEMENT_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Spectral Summons': {
    effects: [
      {
        name: `Spectral Summons`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick a friendly NIGHTHAUNT unit that is on the battlefield. Remove that unit from the battlefield, and then set it up wholly within 12" of your general and more than 9" from any enemy models. This counts as their move for that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'No Rest For the Wicked': {
    effects: [
      {
        name: `No Rest For the Wicked`,
        desc: `You can use this command ability in your hero phase if this model is your general and is on the battlefield. If you do so, you can return 1 slain model to each friendly SUMMONABLE NIGHTHAUNT unit that is within 12" of a friendly model with this command ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Overseer': {
    effects: [
      {
        name: `Spectral Overseer`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Add 1 to hit rolls for friendly NIGHTHAUNT units while they are wholly within 12" of that model in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lord of Gheists': {
    effects: [
      {
        name: `Lord of Gheists`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly NIGHTHAUNT unit that is wholly within 18" of a friendly model with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons in that combat phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
