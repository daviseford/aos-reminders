import GenericEffects from 'army/generic/effects'
import { HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

export const LegacyEmpireUnits = {
  'Battlemage on Pegasus': {
    effects: [
      {
        name: `Amulet of Negation`,
        desc: `Add 1 to unbinding rolls for this model for each enemy Wizard within 18" of them.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wizard`,
        desc: `A Battlemage on Pegasus is a Wizard. They can attempt to cast two different spells in each of your hero phases, and attempt to unbind two spells in each enemy hero phase. They know the Arcane Bolt, Mystic Shield and Searing Doom spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Searing Doom`,
        desc: `Casting value of 6. Pick an enemy unit that is visible to the caster and within 18" of them and roll 6 dice.

        That unit suffers 1 mortal wound for each dice rolled that is equal to or higher than that unit's Save characteristic (for example, a unit with a save of 4+ would suffer a mortal wound for each dice result that was a 4 or more).

        Units with a save of '-' cannot be affected by this spell.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  'Field Mortar': {
    effects: [
      ...GenericEffects.CrewedWarMachine('Crewed Artillery'),
      {
        name: `Artillery Barrage`,
        desc: `A Field Mortar can fire Mortar Shells at units that are not visible to it.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `High Explosive`,
        desc: `If a Mortar Shell hits a unit that has 10 or more models, increase its Damage characteristic to D6. If it hits a unit that has 20 or more models, increase its Damage characteristic to 2D6 instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}
