import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, START_OF_ROUND, SHOOTING_PHASE } from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells.
const EndlessSpells: TEndlessSpells = [
  {
    name: `Celestian Vortex`,
    effects: [
      {
        name: `Summon Celestian Vortex`,
        desc: `Casting value of 6. Only STORMCAST ETERNAL WIZARDS can cast. If successfully cast, set up a Celestian Vortex model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `A Celestian Vortex can move up to 8" and can fly.`,
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
        desc: `Subtract 1 from hit rolls for missile attacks by units while they are within 6" of this model.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Dais Arcanum`,
    effects: [
      {
        name: `Summon Dais Arcanum`,
        desc: `Casting value of 6. Only STORMCAST ETERNAL WIZARDS with >6 wounds, are a single model, and are not already on a Dais Arcanum, can cast. If successfully cast, set up a Dais Arcanum model within 1" of the caster and more than 3" from any enemy models and then place the caster on top of it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dais Arcanum`,
        desc: `A model on a Dais Arcanum has a Move characteristic of 12" and can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Arcane Enhancement`,
        desc: `A model on a Dais Arcanum can attempt to unbind one extra spell. In addition, a model on a Dais Arcanum can automatically dispel that Dais Arcanum.`,
        when: [HERO_PHASE],
      },
      {
        name: `Winds of Azyr`,
        desc: `A model on a Dais Arcanum has +1 save.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Everblaze Comet`,
    effects: [
      {
        name: `Summon Everblaze Comet`,
        desc: `Casting value of 6. Only STORMCAST ETERNAL WIZARDS can cast. If successfully cast, set up an Everblaze Comet model wholly within 36" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Vengeance`,
        desc: `After this model is set up, roll a D6 for each unit within 10" of this model. On a 1-2, that unit suffers 1 mortal wound. On a 3-4, that unit suffers D3 mortal wounds. On a 5-6, that unit suffers 3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Disruption`,
        desc: `Subtract 1 from casting rolls for WIZARDS while they are within 5" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burning Vengeance`,
        desc: `At the start of each battle round, roll a D6 for each unit within 5" of this model. On a 1-3, that unit suffers 1 mortal wound. On a 4-6, that unit suffers D3 mortal wounds.`,
        when: [START_OF_ROUND],
      },
    ],
  },
]

export default EndlessSpells
