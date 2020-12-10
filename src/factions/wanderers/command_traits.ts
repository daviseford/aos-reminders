import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'
const CommandTraits = {
  'Stalker of the Hidden Paths': {
    effects: [
      {
        name: `Stalker of the Hidden Paths`,
        desc: `If a friendly WANDERER unit wholly within 12" of this general leaves the battlefield using the Realm Wanderers battle trait instead of making a normal move, it can be set up on the battlefield wholly within 6" of any edge of the battlefield, not just the one it left by, and more than 9" from any enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Myst Walker': {
    effects: [
      {
        name: `Myst Walker`,
        desc: `Enemy units can only attack this general if it is the closest enemy model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Masterful Hunter': {
    effects: [
      {
        name: `Masterful Hunter`,
        desc: `Add 1 to hit rolls for attacks made with missile weapons by this general. If this general does not have a missile weapon, they receive a Hunting Hawk instead, and can use the Hawk's Beak missile weapon from the Nomad Prince warscroll.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Eagle-eyed': {
    effects: [
      {
        name: `Eagle-eyed`,
        desc: `You can reroll hit rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Blades': {
    effects: [
      {
        name: `Lord of Blades`,
        desc: `You can reroll hit rolls of 1 for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Singer of Spells': {
    effects: [
      {
        name: `Singer of Spells`,
        desc: `Add 1 to casting, unbinding and dispelling rolls for this general. If this general is not a WIZARD, they gain the WIZARD keyword, and can attempt to unbind one spell in the enemy hero phase, and dispel one endless spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
