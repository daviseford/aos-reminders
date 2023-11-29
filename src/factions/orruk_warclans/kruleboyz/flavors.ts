import { COMBAT_PHASE, DURING_GAME, SHOOTING_PHASE, TURN_ONE_SHOOTING_PHASE } from 'types/phases'
import rule_sources from '../rule_sources'
import meta_rule_sources from 'meta/rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const KruleboyzFlavors = {
  "Grinnin' Blades": {
    effects: [
      {
        name: `Out of the Mists`,
        desc: `Friendly GRINNIN' BLADES units are not visible to enemy models that are more than 12" away from them.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_ORRUK_WARCLANS,
          rule_sources.ERRATA_JULY_2022,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
  'Big Yellers': {
    effects: [
      {
        name: `Only Da Best`,
        desc: `Add 3" to the Range characteristic of missile weapons used by friendly BIG YELLERS ORRUK units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Only Da Best`,
        desc: `In the first battle round, each time a friendly BIG YELLERS ORRUK unit shoots, you can reroll 1 of the hit rolls for 1 of the attacks made by that unit.`,
        when: [TURN_ONE_SHOOTING_PHASE],
      },
    ],
  },
  Skulbugz: {
    effects: [
      {
        name: `Crawly Swarm`,
        desc: `When an enemy unit is picked to fight, roll a dice if it is within 3" of any friendly SKULBUGZ units. Add 2 to the roll if that enemy unit is within 3" of any friendly SKULBUGZ MONSTERS. On a roll of 6+, subtract 1 from hit rolls for attacks made by that enemy unit in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default KruleboyzFlavors
