import { TTraits } from 'types/army'
import { DURING_GAME, SHOOTING_PHASE, COMBAT_PHASE, HERO_PHASE, BATTLESHOCK_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Ruler of the Night (Death)`,
    effects: [
      {
        name: `Ruler of the Night (Death)`,
        desc: `Friendly DEATH units are affected by the Deathless Minions battle trait if they are within 12" of this general rather than only 6".`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Predator of the Shadows (Death)`,
    effects: [
      {
        name: `Predator of the Shadows (Death)`,
        desc: `Add 1 to hit and wound rolls for this general if they are in cover.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Death Incarnate (Death)`,
    effects: [
      {
        name: `Death Incarnate (Death)`,
        desc: `In your hero phase, pick an enemy unit within 3" of this general and roll 2D6. If the roll equals or exceeds the enemy unit's Bravery characteristic, inflict D3 mortal wounds on the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Master of the Black Arts (Death)`,
    effects: [
      {
        name: `Master of the Black Arts (Death)`,
        desc: `This general is a WIZARD who knows the Arcane Bolt and Mystic Shield spells. If this general is already a wizard, add 1 to all of their casting and unbinding rolls instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Red Fury (Death)`,
    effects: [
      {
        name: `Red Fury (Death)`,
        desc: `The first time this general is picked to fight in each combat phase, roll a dice at the end of that fight. On a 5+ they can immediately fight again.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Supernatural Horror (Death)`,
    effects: [
      {
        name: `Supernatural Horror (Death)`,
        desc: `In the battleshock phase, double the number of models that flee from enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits

// Create an empty list of traits for army list.
export const EmptyTraits: TTraits = []
