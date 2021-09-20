import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_TURN,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  // Storm-forged Weapons
  'Blade of Heroes': {
    effects: [
      {
        name: `Blade of Heroes`,
        desc: `Pick 1 of the bearer's melee weapons. You can reroll hit rolls for attacks made with that weapon that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hammer of Might': {
    effects: [
      {
        name: `Hammer of Might`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, double the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fang of Dracothion': {
    effects: [
      {
        name: `Fang of Dracothion`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds caused by attacks made with that weapon are allocated to an enemy model, that enemy model suffers 1 mortal wound at the end of each turn.`,
        when: [WOUND_ALLOCATION_PHASE, END_OF_TURN],
      },
    ],
  },

  // Heavens-wrought Armour
  'Drakescale Armour': {
    effects: [
      {
        name: `Drakescale Armour`,
        desc: `You can reroll save rolls for attacks made with weapons that have a Damage characteristic of 2 or more that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Mirrorshield: {
    effects: [
      {
        name: `Mirrorshield`,
        desc: `The bearer cannot be picked as the target of a shooting attack unless the attacking unit is within 9" of the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Amulet of Silvered Sigmarite': {
    effects: [
      {
        name: `Amulet of Silvered Sigmarite`,
        desc: `Your opponent cannot reroll hit rolls for attacks made with melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Artefacts of the Tempest
  'Quicksilver Draught': {
    effects: [
      {
        name: `Quicksilver Draught`,
        desc: `Once per battle, at the end of the charge phase, you can say that the bearer will drink their quicksilver draught. If you do so, the bearer fights at the start of the following combat phase, but the bearer cannot fight again in that phase unless an ability or spell allows them to fight more than once.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  Luckstone: {
    effects: [
      {
        name: `Luckstone`,
        desc: `Once per battle, before you make a hit or wound roll for an attack made by the bearer, a save roll for an attack that targets the bearer, you can say that the bearer will draw upon the power of the luckstone. If you do so, instead of making the roll, you must choose the result of the roll. The result chosen for a D6 roll must be a whole number from 1 to 6, and the result chosen for a 2D6 roll must be a whole number between 2 to 12. The result cannot be rerolled, but any modifiers are applied to it as normal.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Obsidian Amulet': {
    effects: [
      {
        name: `Obsidian Amulet`,
        desc: `Once per battle, at the start of the hero phase, you can say the bearer will raise their obsidian amulet. If you do so, ignore the effects of spells or the abilities of endless spells on the bearer until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
