import { DURING_GAME, COMBAT_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Deathless Courtiers`,
    desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly FLESH-EATER COURTS unit wholly within 12" of a friendly FLESH-EATER COURTS HERO. On a 6 that wound or mortal wound is negated.`,
    when: [DURING_GAME],
  },
  {
    name: `Command Ability: Feeding Frenzy`,
    desc: `You can use this command ability after a friendly FLESH-EATER COURTS unit has fought in the combat phase for the first time and is wholly within 12" of a friendly FLESH-EATER COURTS HERO, or wholly within 18" of a friendly FLESH-EATER COURTS HERO that is a general. If you do so, that unit can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time. You cannot pick the same unit to benefit from this ability more than once per phase.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Courts of Delusion`,
    desc: `The delusion applies to all friendly FLESH-EATER COURTS units for the duration of the battle, even if the general is slain (if you must select a new general during the battle, do not generate a new delusion for the army).`,
    when: [DURING_GAME],
  },
  {
    name: `Muster Abilities`,
    desc: `Several Flesh-eater Courts units have Muster abilities, such as Muster Royal Guard (pg 82), that allow you to return slain models to a unit. If you use a Muster ability, set up the returning models one at a time within 1" of a model from the unit they are returning to (this can be a model returned earlier that phase). The models can only be set up within 3" of an enemy unit if any models from their unit are already within 3" of that enemy unit.`,
    when: [DURING_GAME],
  },
]

export default Abilities
