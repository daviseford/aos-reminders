import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, START_OF_ROUND, SHOOTING_PHASE } from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells.
export const EndlessSpells: TEndlessSpells = [
  {
    name: `Celestian Vortex`,
    effects: [
      {
        name: `Summon Celestian Vortex`,
        desc: `Summon Celestian Vortex has a casting value of 6. Only STORMCAST ETERNAL WIZARDS can attempt to cast this spell. If successfully cast, set up a Celestian Vortex model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Celestian Vortex is a predatory endless spell. A Celestian Vortex can move up to 8" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Swirling Doom`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Storm of Vengeance`,
        desc: `After moving this model, you can pick 1 enemy unit within 1" of this model and roll 12 dice. For each roll of 6+, that unit suffers 1 mortal wound. If the unit being rolled for is a CHAOS unit, it suffers 1 mortal wound for each roll of 5+ instead.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Tornado of Magic`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons by units while they are within 6" of this model.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Dais Arcanum`,
    effects: [
      {
        name: `Summon Dais Arcanum`,
        desc: `Summon Dais Arcanum has a casting value of 6. Only STORMCAST ETERNAL WIZARDS that do not have a Wounds characteristic of 6 or more, are not part of a unit with 2 or more models, and are not already on a Dais Arcanum, can attempt to cast this spell. If successfully cast, set up a Dais Arcanum model within 1" of the caster and more than 3" from any enemy models and then place the caster on top of it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dais Arcanum`,
        desc: `A model on a Dais Arcanum has a Move characteristic of 12" and can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Arcane Enhancement`,
        desc: `While a model is on a Dais Arcanum, it can attempt to unbind one extra spell in each enemy hero phase.In addition, if a model on a Dais Arcanum attempts to dispel that Dais Arcanum, the attempt is automatically successful (do not roll any dice).`,
        when: [HERO_PHASE],
      },
      {
        name: `Winds of Azyr`,
        desc: `While a model is on a Dais Arcanum, add 1 to save rolls for attacks that target that model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Everblaze Comet`,
    effects: [
      {
        name: `Summon Everblaze Comet`,
        desc: `Summon Everblaze Comet has a casting value of 6. Only STORMCAST ETERNAL WIZARDS can attempt to cast this spell. If successfully cast, set up an Everblaze Comet model wholly within 36" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Vengeance`,
        desc: `After this model is set up, roll a dice for each unit within 10" of this model. On a 1‑2, that unit suffers 1 mortal wound. On a 3‑4, that unit suffers D3 mortal wounds. On a 5‑6, that unit suffers 3 mortal wounds.In addition, at the start of each battle round, roll a dice for each unit within 5" of this model. On a 1‑3, that unit suffers 1 mortal wound. On a 4‑6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, START_OF_ROUND],
      },
      {
        name: `Arcane Disruption`,
        desc: `Subtract 1 from casting rolls for WIZARDS while they are within 5" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default EndlessSpells
