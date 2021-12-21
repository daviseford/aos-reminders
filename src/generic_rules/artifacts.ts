import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { COMBAT_PHASE, HERO_PHASE, SAVES_PHASE, START_OF_HERO_PHASE } from 'types/phases'

// General artifacts from Core Rules 2021
const GenericArtifacts: TEntry[] = [
  {
    name: `Amulet of Destiny`,
    effects: [
      {
        name: `Amulet of Destiny`,
        desc: `The bearer has a ward of 6+.`,
        when: [SAVES_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021, meta_rule_sources.ERRATA_CORE_RULES_DECEMBER_2021],
      },
    ],
  },
  {
    name: `Vial of Manticore Venom`,
    effects: [
      {
        name: `Vial of Manticore Venom`,
        desc: `Pick 1 of the bearer's melee weapons. Add 1 to wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Arcane Tome`,
    effects: [
      {
        name: `Arcane Tome`,
        desc: `The bearer becomes a WIZARD that knows the Arcane Bolt and Mystic Shield spells. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. If the bearer is already a Wizard, they can attempt to cast 1 additional spell instead.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
  {
    name: `Seed of Rebirth`,
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `You can reroll heroic recovery rolls for the bearer.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.CORE_RULES_2021],
      },
    ],
  },
]
export default GenericArtifacts
