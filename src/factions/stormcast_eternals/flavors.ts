import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Flavors = {
  'Hammers of Sigmar': {
    effects: [
      {
        name: `We Cannot Fail`,
        desc: `Friendly HAMMERS OF SIGMAR units wholly within 12" of an objective have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Hallowed Knights': {
    effects: [
      {
        name: `Only the Faithful`,
        desc: `If a friendly HALLOWED KNIGHTS REDEEMER model is slain within 3" of any enemy units, roll a dice. On a 4+, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Celestial Vindicators': {
    effects: [
      {
        name: `Driven by Vengeance`,
        desc: `At the start of the combat phase, you can pick 1 friendly CELESTIAL VINDICATORS unit that made a charge move that turn. Until your next hero phase, if the unmodified hit roll for an attack made with a melee weapon by that unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Anvils of the Heldenhammer': {
    effects: [
      {
        name: `Deathly Aura`,
        desc: `At the end of the charge phase, you can roll 2D6 for each enemy unit within 1" of any friendly ANVILS OF THE HELDENHAMMER units. If the roll is greater than that enemy unit's Bravery characteristic, the first 2 wounds caused by attacks made by that enemy unit in the following combat phase are negated.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Knights Excelsior': {
    effects: [
      {
        name: `Annihilation`,
        desc: `Once per turn, at the start of the combat phase, you can pick 1 friendly KNIGHTS EXCELSIOR PALADIN unit on the battlefield. Until the end of that phase, when you pick that unit to fight, pick 1 enemy unit within 1" of that unit. If the number of models in that enemy unit is greater than the number of models in that PALADIN unit, add 1 to hit and wound rolls for attacks made by that PALADIN unit that target that enemy unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Celestial Warbringers': {
    effects: [
      {
        name: `Fearless Foresight`,
        desc: `Once per phase, you can reroll 1 hit roll or 1 wound roll for an attack made bv a friendly CELESTIAL WARBRINGERS unit or 1 save roll for an attack that targets a friendly CELESTIAL WARBRINGERS unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Tempest Lords': {
    effects: [
      {
        name: `The Host on High`,
        desc: `When you attempt a charge with a friendly TEMPEST LORDS unit that can fly, you can reroll 1 of the dice for that charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Astral Templars': {
    effects: [
      {
        name: `Beast Stalkers`,
        desc: `Friendly ASTRAL TEMPLARS units cannot be picked when your opponent carries out a monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
