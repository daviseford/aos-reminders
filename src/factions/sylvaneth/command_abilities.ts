import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const CommandAbilities = {
  "Ghyran's Wrath": {
    effects: [
      {
        name: `Ghyran's Wrath`,
        desc: `If activated, you can reroll wound rolls of 1 for attacks made by friendly Sylvaneth units wholly within 14" of this model until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
  'Heed the Spirit-song': {
    effects: [
      {
        name: `Heed the Spirit-song`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to save rolls for attacks that target friendly SYLVANETH units wholly within 12" of that model.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SYLVANETH, rule_sources.ERRATA_SYLVANETH_JULY_2021],
      },
    ],
  },
  'Call to Battle': {
    effects: [
      {
        name: `Call to Battle`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly SYLVANETH unit wholly within 9" of a friendly model with this command ability, or wholly within 12" of a friendly model with this command ability that is your general. Add 1 to the Attacks characteristic of that unit's melee weapons in that combat phase. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Yield To None': {
    effects: [
      {
        name: `Yield To None`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly OAKENBROW HERO. Until the end of that phase, do not take battleshock tests for friendly OAKENBROW DRYADS units while they are wholly within 16" of that HERO.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Earth Defends': {
    effects: [
      {
        name: `The Earth Defends`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly GNARLROOT unit wholly within 12" of a friendly GNARLROOT HERO. Until the end of that phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6+ that wound or mortal wound is negated.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `The Earth Defends`,
        desc: `If active, until the end of that phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Lord of the Hunt': {
    effects: [
      {
        name: `Lord of the Hunt`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 enemy unit within 12" of a friendly HEARTWOOD HERO. Until the end of that phase, you can reroll hit and wound rolls of 1 for attacks made by friendly HEARTWOOD units that target that enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Stand Firm': {
    effects: [
      {
        name: `Stand Firm`,
        desc: `You can use this command ability in the combat phase, before the players pick any units to fight. If you do so, pick 1 enemy unit that made a charge move this turn and is within 1" of a friendly IRONBARK unit and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Branch Blizzard': {
    effects: [
      {
        name: `Branch Blizzard`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 enemy unit within 12" of a friendly WINTERLEAF HERO and visible to them. Roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Sinister Ambush': {
    effects: [
      {
        name: `Sinister Ambush`,
        desc: `You can use this command ability once during each of your turns, at the end of your movement phase. If you do so, pick 1 friendly DREADWOOD unit wholly within 18" of a friendly DREADWOOD HERO. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Fertile Ground': {
    effects: [
      {
        name: `Fertile Ground`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly HARVESTBOON unit wholly within 12" of a friendly HARVESTBOON HERO. Until the end of that phase, add 1 to the Attacks characteristic of that unit's melee weapons. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
