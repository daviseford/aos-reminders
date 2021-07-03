import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const CommandAbilities = {
  // Unit command abilities
  'Lord of the Tides': {
    effects: [
      {
        name: `Lord of the Tides`,
        desc: `You can use this command ability if this model is your general and the High Tide ability from the Tides of Death table applies for the battle round. If you do so, pick a friendly IDONETH DEEPKIN unit wholly within 12" of your general. Add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Royal Council
  'Give Them No Respite': {
    effects: [
      {
        name: `Give Them No Respite`,
        desc: `You can use this command ability in your hero phase if the Akhelian King from this battalion is your general, and the Isharann Tidecaster and Isharann Soulscryer from this battalion are within 3" of the general. If you do so, pick up to three friendly IDONETH DEEPKIN units that are wholly within 12" of your general. Add 3" to the Move characteristic of the units you pick until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Volturnos
  'Supreme Lord of Tides': {
    effects: [
      {
        name: `Supreme Lord of Tides`,
        desc: `You can use this command ability if a friendly VOLTURNOS is on the battlefield and the High Tide ability from the Tides of Death table applies for the battle round. If you do so, pick up to 3 different friendly IDONETH DEEPKIN units wholly within 18" of that friendly VOLTURNOS. Add 1 to the Attacks characteristic of melee weapons used by those units until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_IDONETH_DEEPKIN,
          rule_sources.ERRATA_IDONETH_DEEPKIN_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
