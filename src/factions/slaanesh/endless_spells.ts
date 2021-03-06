import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, MOVEMENT_PHASE, START_OF_ROUND } from 'types/phases'

// Endless spells.
const EndlessSpells = {
  'Wheels of Excruciation (Slaanesh)': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 12" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Chaos Slaanesh wizards can attempt to cast this spell. Set up 1 of these models wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Death`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Exquisite Agony`,
        desc: `After this model has moved, roll 6 dice for each unit that has any models that this model passed across. That unit suffers 1 mortal wound for each roll that is less than that unit's unmodified save characteristic.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Mesmerising Mirror (Slaanesh)': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 6" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Chaos Slaanesh wizards can attempt to cast this spell. Set up 1 of these models wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Irresistible Lure`,
        desc: `If a unit starts a move within 12" of this model, it suffers D3 mortal wounds unless it finishes the move closer to this model than it was before the move was made. This ability has no effect on Chaos Slaanesh units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Gaze Not into its Depths`,
        desc: `After this model is set up, and after this model has moved, roll 6 dice for each hero within 6" of this model (roll separately for each hero). For each 6, that hero suffers a number of mortal wounds equal to the number of 6s that were rolled for that hero. This ability has no effect on Chaos Slaanesh heroes.

        For example, if you rolled one 6 for a hero, that hero would suffer 1 x 1 = 1 mortal wound. If you rolled two 6s, that hero would suffer 2 x 2 = 4 mortal wounds, if you rolled three 6s, that hero would suffer 3 x 3 = 9 mortal wounds, and so on.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Dreadful Visage (Slaanesh)': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 8" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7. Only Chaos Slaanesh wizards can attempt to cast this spell. Set up 1 of these models wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swooping Horror`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flensing Tongues`,
        desc: `After this model has moved, roll 6 dice for the closest other unit within 6". If more than 1 other unit is equally close, the player that moved this model can choose which unit to roll the 6 dice for. That unit suffers 1 mortal wound for each roll of 4+.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Terrifying Entity`,
        desc: `Subtract 1 from the bravery characteristic of units while they are within 12" of this model. Add 1 to the bravery characteristic of Chaos Slaanesh units while they are within 12" of this model instead of subtracting 1.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
