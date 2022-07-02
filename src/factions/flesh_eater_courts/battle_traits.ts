import { tagAs } from 'factions/metatagger'
import { FLESH_EATER_COURTS } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import { DURING_GAME, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const BattleTraits = {
  [FLESH_EATER_COURTS]: {
    effects: [
      {
        name: `Deathless Courtiers`,
        desc: `Friendly FLESH-EATER COURTS units have a ward of 6+.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_BATTLESCROLL_JUNE_2022],
      },
      {
        name: `Courts of Delusion`,
        desc: `The delusion applies to all friendly FLESH-EATER COURTS units for the duration of the battle, even if the general is slain (if you must select a new general during the battle, do not generate a new delusion for the army).`,
        when: [DURING_GAME],
      },
      {
        name: `Muster Abilities`,
        desc: `Several Flesh-eater Courts abilities allow you to return slain models to a unit. When you do so, set up the models one at a time within 1" of a model from the unit they are returning to (this can be a model you returned to the unit earlier in the same phase). The slain models you return to a unit can only be set up within 3" of an enemy unit if one or more models from the unit they are returning to are already within 3" of an enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')
