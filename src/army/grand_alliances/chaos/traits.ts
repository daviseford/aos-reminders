import { TTraits } from 'types/army'
import { COMBAT_PHASE, START_OF_HERO_PHASE, HERO_PHASE, BATTLESHOCK_PHASE } from 'types/phases'
import { CHAOS } from 'meta/alliances'

const CommandTraits: TTraits = [
  {
    name: `Dark Avenger (${CHAOS})`,
    effects: [
      {
        name: `Dark Avenger (${CHAOS})`,
        desc: `Add 1 to hit rolls for this general's melee weapons if the target unit has the ORDER keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spiteful Duellist (${CHAOS})`,
    effects: [
      {
        name: `Spiteful Duellist (${CHAOS})`,
        desc: `Each time this general is picked to fight, you can re-roll one wound roll for one of their attacks in that fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cunning Deceiver (${CHAOS})`,
    effects: [
      {
        name: `Cunning Deceiver (${CHAOS})`,
        desc: `Roll a D6 at the start of each of your hero phases as long as this general has not been slain. On a 5+ you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of War (${CHAOS})`,
    effects: [
      {
        name: `Lord of War (${CHAOS})`,
        desc: `In your hero phase, pick a friendly CHAOS unit within 3" of this general and roll a D6. On a 4+ you can add 1 to hit rolls for the unit you picked until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Terrifying Presence (${CHAOS})`,
    effects: [
      {
        name: `Terrifying Presence (${CHAOS})`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Malicious Conqueror (${CHAOS})`,
    effects: [
      {
        name: `Malicious Conqueror (${CHAOS})`,
        desc: `Add 1 to Unbridled Malice dice rolls for units while they are within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
