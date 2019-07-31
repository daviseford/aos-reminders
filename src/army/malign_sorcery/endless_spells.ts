import { IEffects, IEntry } from 'types/data'
import { HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

const EndlessSpells: IEntry[] = [
  {
    name: `Balewind Vortex`,
    effects: [
      {
        name: `Summon Balewind Vortex`,
        desc: `Summon Balewind Vortex has a casting value of 6. Wizards with a Wounds characteristic of 9 or more, that are part of a unit of two or more models, or that are already on a Balewind Vortex, cannot attempt to cast this spell. If successfully cast, set up a Balewind Vortex model within 1" of the caster and more than 3" from any enemy models, and then place the caster on the upper platform.`,
        when: [HERO_PHASE],
      },
      {
        name: `Against the Aetheric Wind`,
        desc: `Add 1 to save rolls for a Wizard on a Balewind Vortex.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Arcane Invigoration`,
        desc: `A Wizard on a Balewind Vortex can attempt to cast an additional spell in each of their hero phases (including the turn in which the Summon Balewind Vortex spell was cast), and you can add 6" to the range of any spells that the Wizard casts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default EndlessSpells
