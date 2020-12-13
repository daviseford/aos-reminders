import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, START_OF_COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Master of Death': {
    effects: [
      {
        name: `Master of Death`,
        desc: `Reroll results of 1 (i.e. rolls of 1-2 on a D3) for friendly units affected by a Deathly Invocation ability that are within 12" of this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Chosen Champion': {
    effects: [
      {
        name: `Chosen Champion`,
        desc: `Add 1 to the Damage characteristic of melee weapons used by this general for attacks made against enemy HEROES.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bane of the Living': {
    effects: [
      {
        name: `Bane of the Living`,
        desc: `Reroll wound rolls of 1 for this general for attacks made against enemy units that do not have the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Aura of Ages': {
    effects: [
      {
        name: `Aura of Ages`,
        desc: `At the start of the combat phase, roll a D6 for each enemy unit within 3" of this general. On a 4+ subtract 1 from hit rolls made for that unit until the end of the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Ancient Strategist': {
    effects: [
      {
        name: `Ancient Strategist`,
        desc: `Reroll failed charge rolls for friendly DEATHRATTLE and MORGHAST units that are within 9" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Lord of Nagashizzar': {
    effects: [
      {
        name: `Lord of Nagashizzar`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly DEATHRATTLE units that are within 6" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
