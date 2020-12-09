import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'We Cannot Fail': {
    effects: [
      {
        name: `We Cannot Fail`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly HAMMERS OF SIGMAR unit wholly within 9" of this general. On a 6+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Martyr's Strength": {
    effects: [
      {
        name: `Martyr's Strength`,
        desc: `Roll a D6 if this general is slain in the combat phase. On a 2+ this general can make a pile-in move and then attack with all melee weapons, before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Single-minded Fury': {
    effects: [
      {
        name: `Single-minded Fury`,
        desc: `Each time you roll an unmodified hit roll of 6 for this general, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Deathly Aura': {
    effects: [
      {
        name: `Deathly Aura`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Divine Executioner': {
    effects: [
      {
        name: `Divine Executioner`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons if the target is a HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Portents and Omens': {
    effects: [
      {
        name: `Portents and Omens`,
        desc: `Once per turn, you can reroll 1 failed hit roll or 1 failed wound roll for an attack made by this general, or 1 save roll for an attack that targets this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Bonds of Noble Duty': {
    effects: [
      {
        name: `Bonds of Noble Duty`,
        desc: `Add 1 to wound rolls for attacks made with this general's melee weapons while this general is within 6" of any other friendly TEMPEST LORDS units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dauntless Hunters': {
    effects: [
      {
        name: `Dauntless Hunters`,
        desc: `After set-up is complete, but before the battle begins, friendly ASTRAL TEMPLARS units wholly within 12" of this general can move up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },

  'Shielded by Faith': {
    effects: [
      {
        name: `Shielded by Faith`,
        desc: `On a 5+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Consummate Commander': {
    effects: [
      {
        name: `Consummate Commander`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Cunning Strategist': {
    effects: [
      {
        name: `Cunning Strategist`,
        desc: `After set-up is complete, but before the battle begins, D3 friendly STORMCAST ETERNAL units can move up to 5".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Zealous Crusader': {
    effects: [
      {
        name: `Zealous Crusader`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Staunch Defender': {
    effects: [
      {
        name: `Staunch Defender`,
        desc: `Add 1 to save rolls for attacks that target friendly STORMCAST ETERNAL units wholly within 9" of this general if that STORMCAST ETERNAL unit has not made a charge move the same turn.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Champion of the Realms': {
    effects: [
      {
        name: `Champion of the Realms`,
        desc: `Pick one of this general's melee weapons. Add 1 to the Attacks of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Fiendslayer: {
    effects: [
      {
        name: `Fiendslayer`,
        desc: `You may target enemy Chaos or Death heros instead of enemy wizards with Sanction.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Fiendslayer`,
        desc: `Add 1 to hit rolls made by this general targeting Vampires.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
