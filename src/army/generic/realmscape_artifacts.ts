import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'
import { GHYRAN, GHUR, CHAMON, AQSHY, SHYISH, ULGU, HYSH } from 'types/realmscapes'

const RealmArtifacts: TArtifacts = [
  {
    name: `Everspring Diadem (${GHYRAN})`,
    effects: [
      {
        name: `Everspring Diadem (${GHYRAN})`,
        desc: `In your hero phase, you can heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Predator's Torc (${GHUR})`,
    effects: [
      {
        name: `Predator's Torc (${GHUR})`,
        desc: `You can re-roll charge rolls for the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Plate of Perfect Protection (${CHAMON})`,
    effects: [
      {
        name: `Plate of Perfect Protection (${CHAMON})`,
        desc: `If a weapon used for an attack that targets the bearer has a Rend characteristic of -1, change the Rend characteristic for that attack to '-'`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Incandescent Rageblade (${AQSHY})`,
    effects: [
      {
        name: `Incandescent Rageblade (${AQSHY})`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made by that weapon is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Endings (${SHYISH})`,
    effects: [
      {
        name: `Blade of Endings (${SHYISH})`,
        desc: `If the hit roll for that weapon is 6+ add 2 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Banshee Blade (${SHYISH})`,
    effects: [
      {
        name: `Banshee Blade (${SHYISH})`,
        desc: `Each time you roll a hit roll of 6+ for this weapon, roll 2D6. If the roll is equal to or more than the target's Bravery characteristic, that attack inflicts D3 mortal wounds in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lifebane (${SHYISH})`,
    effects: [
      {
        name: `Lifebane (${SHYISH})`,
        desc: `Add 1 to wound rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sliver of Decreptitude (${SHYISH})`,
    effects: [
      {
        name: `Sliver of Decreptitude (${SHYISH})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds by that weapon are inflicted on an enemy HERO or MONSTER, subtract 2" from that HERO or MONSTER's Move characteristic for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wraithbow (${SHYISH})`,
    effects: [
      {
        name: `Wraithbow (${SHYISH})`,
        desc: `In your shooting phase, pick an enemy unit within 18" of the bearer and roll six dice. For each 6+ that enemy unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Splintertooth (${SHYISH})`,
    effects: [
      {
        name: `Splintertooth (${SHYISH})`,
        desc: `In your shooting phase, pick an enemy unit within 8" of the bearer and roll three dice. If two dice have the same roll, that enemy unit suffers D3 mortal wounds. If all three dice have the same roll, that enemy unit suffers D6 mortal wounds instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cronehair Fetish (${SHYISH})`,
    effects: [
      {
        name: `Cronehair Fetish (${SHYISH})`,
        desc: `You can add or subtract 1 from the result of any roll on the Shyish Realmscape Features table.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Ethereal Amulet (${SHYISH})`,
    effects: [
      {
        name: `Ethereal Amulet (${SHYISH})`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for this model.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Sepulchral Plate (${SHYISH})`,
    effects: [
      {
        name: `Sepulchral Plate (${SHYISH})`,
        desc: `Roll a D6 each time you allocate a wound to the bearer. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Amethyst Blindmask (${SHYISH})`,
    effects: [
      {
        name: `Amethyst Blindmask (${SHYISH})`,
        desc: `If the bearer is slain, before removing the model, roll a D6 for each enemy unit within 6" of the bearer. On a 3+ that unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `The Ragged Cloak (${SHYISH})`,
    effects: [
      {
        name: `The Ragged Cloak (${SHYISH})`,
        desc: `Once per battle, at the start of your opponent's shooting phase, you can declare that bearer will shroud themselves with the Ragged Cloak. If you do so, the bearer may not be chosen as the target of an attack until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Goblet of Draining (${SHYISH})`,
    effects: [
      {
        name: `Goblet of Draining (${SHYISH})`,
        desc: `If 1 or more wounds are inflicted on an enemy HERO by the bearer, roll a D6. On a 5+ that HERO suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Miasmatic Blade (${ULGU})`,
    effects: [
      {
        name: `Miasmatic Blade (${ULGU})`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of the Thirteen Dominions (${ULGU})`,
    effects: [
      {
        name: `Blade of the Thirteen Dominions (${ULGU})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy unit by that weapon, subtract 1 from hit rolls for attacks made by that unit until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Folded Shadows (${ULGU})`,
    effects: [
      {
        name: `Blade of Folded Shadows (${ULGU})`,
        desc: `Add 1 to hit rolls for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Secrets (${ULGU})`,
    effects: [
      {
        name: `Blade of Secrets (${ULGU})`,
        desc: `Allocate wounds inflicted by that weapon before allocating wounds inflicted by any other attacks made by the bearer. If 1 or more wounds are inflicted on an enemy WIZARD by that weapon, pick one spell that WIZARD knows. That WIZARD may not attempt to cast that spell again during that battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dimensional Blade (${ULGU})`,
    effects: [
      {
        name: `Dimensional Blade (${ULGU})`,
        desc: `Change the Rend characteristic of this weapon to -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sword of Judgement (${ULGU})`,
    effects: [
      {
        name: `Sword of Judgement (${ULGU})`,
        desc: `If the hit roll for an attack with that weapon against a HERO or MONSTER is 6+, that attack inflicts D6 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spellmirror (${ULGU})`,
    effects: [
      {
        name: `Spellmirror (${ULGU})`,
        desc: `If a friendly unit within 6" of the bearer is affected by a spell, you can roll a D6. On a 5+ that unit is not affected by the spell. On a 1 the Spellmirror may not be used for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Trickster's Helm (${ULGU})`,
    effects: [
      {
        name: `Trickster's Helm (${ULGU})`,
        desc: `Re-roll successful casting rolls for enemy WIZARDS while they are within 8" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wristbands of Illusion (${ULGU})`,
    effects: [
      {
        name: `Wristbands of Illusion (${ULGU})`,
        desc: `Roll a D6 each time you allocate a wound to the bearer. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Doppelganger Cloak (${ULGU})`,
    effects: [
      {
        name: `Doppelganger Cloak (${ULGU})`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will put on the cloak. If you do so, the bearer cannot be chosen as the target of attacks made with melee weapons unless the bearer has made any attacks earlier in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Betrayer's Crown (${ULGU})`,
    effects: [
      {
        name: `Betrayer's Crown (${ULGU})`,
        desc: `Once per battle, at the start of the combat phase, pick an enemy unit within 3" of the bearer that has two or more models. Roll a D6 for each model in that enemy unit. For each 5+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Talisman of the Watcher (${ULGU})`,
    effects: [
      {
        name: `Talisman of the Watcher (${ULGU})`,
        desc: `If the bearer is not within 3" of an enemy unit at the start of the combat phase, pick a friendly unit within 9" of the bearer. You can re-roll save rolls of 1 for that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Syari Trueblade (${HYSH})`,
    effects: [
      {
        name: `Syari Trueblade (${HYSH})`,
        desc: `You can re-roll hit rolls of 1 for attacks made with a melee weapon by the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default RealmArtifacts
