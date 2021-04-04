import { tagAs } from 'factions/metatagger'
import { END_OF_ROUND, HERO_PHASE, SAVES_PHASE, START_OF_ROUND, WOUND_ALLOCATION_PHASE } from 'types/phases'

// Endless spells.
const EndlessSpells = {
  'Bladewind (Daughters)': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 12" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Daughters of Khaine wizards can attempt to cast this spell. Set up 1 of these models wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eviscerating Vortex`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unnatural Edge`,
        desc: `After this model has moved, each unit passed across and other units within 1" at the end of the move suffer D3 mortal wounds.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Unnatural Edge`,
        desc: `Do not apply cover modifiers for save rolls of units within 12" of this model.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Bloodwrack Viper (Daughters)': {
    effects: [
      {
        name: `Predatory`,
        desc: `Can move up to 9" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7. Only Daughters of Khaine wizards can attempt to cast this spell. Set up 1 of these models wholly within 9" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodslick Coils`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fanged Strike`,
        desc: `The player who moved this spell must pick 1 unit within 1" and roll 3 D6. For each roll greater than or equal to the target's wounds characteristic, 1 model is slain.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Heart of Fury (Daughters)': {
    effects: [
      {
        name: `Summon`,
        desc: `Chant value of 3. Daughters of Khaine priests can attempt to this prayer once per turn if that armies' Heart of Fury is not already on the battlefield. Set up 1 of these models wholly within 12" of the chanter.`,
        when: [HERO_PHASE],
      },
      {
        name: `Locus of the Murder God`,
        desc: `Subtract 1 from damage inflicted against Daughters of Khaine units wholly within 12" of this model (to a minimum of 1).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Pledge to Khaine`,
        desc: `If this model is on the battlefield the player who set it up must roll a D6, adding 1 to the roll if any Avatars of Khaine are within 6". On a 1-3 this model is removed from the battlefield.`,
        when: [END_OF_ROUND],
      },
    ],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
