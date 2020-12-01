import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const RangeFindingOpticsEffect = {
  name: `Range-finding Optics`,
  desc: `You can reroll hit rolls of 1 for this model in the shooting phase if they did not move in their preceding movement phase and there are no enemy models within 3" of them.`,
  when: [SHOOTING_PHASE],
}

export const LegacyDwarfUnits: TEntry[] = [
  {
    name: `Far-Ranger`,
    effects: [
      {
        name: `Veteran Ranger`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to
        one side in hiding.`,
        when: [DURING_SETUP],
      },
      {
        name: `Veteran Ranger`,
        desc: `At the end of your movement phase you may set this unit up anywhere on the battlefield that is more than 9" from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Heirloom Tankard`,
        desc: `Once per battle, in your hero phase, you may choose for this model to drink from this tankard to refresh and restore themselves. If you do so, heal D3 wounds that have been allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  {
    name: `Gunmaster`,
    effects: [RangeFindingOpticsEffect],
  },

  {
    name: `Huntmarshal`,
    effects: [
      {
        name: `Monster Hunter`,
        desc: `Add 1 to hit rolls for this model's attacks that target a Monster.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Huntmarshal's Bow`,
        desc: `A Huntmarshal's Bow has a Damage characteristic of D6 instead of D3 for attacks that target a Monster.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  {
    name: `Engineer on Mechanical Steed`,
    effects: [
      RangeFindingOpticsEffect,
      {
        name: `Clockwork Charge`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ the unit being rolled for suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  {
    name: `Runelord on Anvil of Doom`,
    effects: [
      {
        name: `Anvil of Doom`,
        desc: `This model cannot make charge moves.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Anvil of Doom`,
        desc: `This model cannot run.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Master Runes of Spellbreaking`,
        desc: `This model can attempt to unbind two spells in each enemy hero phase as if it were a wizard. Add 2 to any unbinding rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Strike the Runes`,
        desc: `In your hero phase, you can declare that the Runelord will strike a rune of power. If you do so, pick one of the following runes and roll a dice.

        On a 1 the rune is struck incorrectly and nothing happens.
        On a roll of 2+ the rune is struck correctly and you may apply its effects.

        If this model is within 4" of a friendly Apprentice Runesmith, then the Runelord can attempt to strike two different runes in your hero phase rather than one.

        Rune of Hearth and Home: Reroll failed hit rolls for this unit until your next hero phase.
        Rune of Oath and Steel: Add 1 to save rolls for this unit until your next hero phase.
        Rune of Wrath and Ruin: Pick an enemy unit that is visible to the Runelord and is within 24" of him. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
