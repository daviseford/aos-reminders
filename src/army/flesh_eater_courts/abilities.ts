import { DURING_GAME, COMBAT_PHASE, START_OF_SETUP, BATTLESHOCK_PHASE, HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Deathless Courtiers`,
    desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly FLESH-EATER COURTS unit wholly within 12" of a friendly FLESH-EATER COURTS HERO. On a 6 that wound or mortal wound is negated.`,
    when: [DURING_GAME],
  },
  {
    name: `Feeding Frenzy`,
    desc: `You can use this command ability after a friendly FLESH-EATER COURTS unit has fought in the combat phase for the first time and is wholly within 12" of a friendly FLESH-EATER COURTS HERO, or wholly within 18" of a friendly FLESH-EATER COURTS HERO that is a general. If you do so, that unit can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time. You cannot pick the same unit to benefit from this ability more than once per phase.`,
    when: [COMBAT_PHASE],
    command_ability: true,
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
  {
    name: `Charnel Throne`,
    desc: `After territories have been chosen but before armies are set up, you can set up the CHARNEL THRONE wholly within your territory, wholly within 12" of the edge of the battlefield, and more than 1" from any objectives or other terrain features.`,
    when: [START_OF_SETUP],
  },
  {
    name: `Charnel Throne: Ruler of All He Surveys`,
    desc: `An ABHORRANT ARCHREGENT that is within 1" of this terrain feature can use the Summon Imperial Guard command ability without a command point being spent. In addition, an ABHORRANT GHOUL KING that is within 1" of this terrain feature can use the Summon Men-at-arms command ability without a command point being spent.`,
    when: [HERO_PHASE],
  },
  {
    name: `Charnel Throne: Ghoulish Landmark`,
    desc: `FLESH-EATER COURTS units treat this terrain feature as having the Inspiring scenery rule. All other units treat this terrain feature as having the Sinister scenery rule.`,
    when: [BATTLESHOCK_PHASE],
  },
]

export default Abilities
