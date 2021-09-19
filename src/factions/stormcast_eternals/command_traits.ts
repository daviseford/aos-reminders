import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  // Aspects of Azyr
  'Shock and Awe': {
    effects: [
      {
        name: `Shock and Awe`,
        desc: `If your army is a Scions of the Storm army and this general is on the battlefield at the end of your movement phase, subtract 1 from hit rolls for attacks that target friendly SCIONS OF THE STORM units that were set up in that phase until the end of that turn.`,
        when: [END_OF_MOVEMENT_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Staunch Defender': {
    effects: [
      {
        name: `Staunch Defender`,
        desc: `You can reroll the dice that determines the number of mortal wounds caused to an enemy unit by a friendly STORMKEEP REDEEMER unit using the Shield of Civilisation battle trait (pg 107) if that friendly unit is wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Envoy of the Heavens': {
    effects: [
      {
        name: `Envoy of the Heavens`,
        desc: `If a friendly STORMCAST ETERNALS model is slain wholly within 12" of this general, you can add 1 to save rolls for attacks that target the slain model's unit until the end of that phase. The same unit cannot benefit from this ability more than once per turn.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Master of the Celestial Menagerie': {
    effects: [
      {
        name: `Master of the Celestial Menagerie`,
        desc: `If this general is a MONSTER and is on the battlefield, subtract 1 from wound rolls for attacks made with melee weapons that target friendly STORMCAST ETERNALS MONSTERS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Removed in 2021
  // 'We Cannot Fail': {
  //   effects: [
  //     {
  //       name: `We Cannot Fail`,
  //       desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly HAMMERS OF SIGMAR unit wholly within 9" of this general. On a 6+, that wound or mortal wound is negated.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  // "Martyr's Strength": {
  //   effects: [
  //     {
  //       name: `Martyr's Strength`,
  //       desc: `Roll a D6 if this general is slain in the combat phase. On a 2+ this general can make a pile-in move and then attack with all melee weapons, before it is removed from play.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Single-minded Fury': {
  //   effects: [
  //     {
  //       name: `Single-minded Fury`,
  //       desc: `Each time you roll an unmodified hit roll of 6 for this general, add 1 to the Damage characteristic of that attack.`,
  //       when: [COMBAT_PHASE, SHOOTING_PHASE],
  //     },
  //   ],
  // },
  // 'Deathly Aura': {
  //   effects: [
  //     {
  //       name: `Deathly Aura`,
  //       desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of this general.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // 'Divine Executioner': {
  //   effects: [
  //     {
  //       name: `Divine Executioner`,
  //       desc: `Add 1 to the Damage characteristic of this general's melee weapons if the target is a HERO.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Portents and Omens': {
  //   effects: [
  //     {
  //       name: `Portents and Omens`,
  //       desc: `Once per turn, you can reroll 1 failed hit roll or 1 failed wound roll for an attack made by this general, or 1 save roll for an attack that targets this general.`,
  //       when: [COMBAT_PHASE, SHOOTING_PHASE],
  //     },
  //   ],
  // },
  // 'Bonds of Noble Duty': {
  //   effects: [
  //     {
  //       name: `Bonds of Noble Duty`,
  //       desc: `Add 1 to wound rolls for attacks made with this general's melee weapons while this general is within 6" of any other friendly TEMPEST LORDS units.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Dauntless Hunters': {
  //   effects: [
  //     {
  //       name: `Dauntless Hunters`,
  //       desc: `After set-up is complete, but before the battle begins, friendly ASTRAL TEMPLARS units wholly within 12" of this general can move up to 6".`,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
  // 'Shielded by Faith': {
  //   effects: [
  //     {
  //       name: `Shielded by Faith`,
  //       desc: `On a 5+, an allocated wound or mortal wound is negated.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Consummate Commander': {
  //   effects: [
  //     {
  //       name: `Consummate Commander`,
  //       desc: `If this general is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive 1 extra command point.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Cunning Strategist': {
  //   effects: [
  //     {
  //       name: `Cunning Strategist`,
  //       desc: `After set-up is complete, but before the battle begins, D3 friendly STORMCAST ETERNAL units can move up to 5".`,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
  // 'Zealous Crusader': {
  //   effects: [
  //     {
  //       name: `Zealous Crusader`,
  //       desc: `You can reroll charge rolls for this general.`,
  //       when: [CHARGE_PHASE],
  //     },
  //   ],
  // },
  // 'Champion of the Realms': {
  //   effects: [
  //     {
  //       name: `Champion of the Realms`,
  //       desc: `Pick one of this general's melee weapons. Add 1 to the Attacks of that weapon.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // Fiendslayer: {
  //   effects: [
  //     {
  //       name: `Fiendslayer`,
  //       desc: `You may target enemy Chaos or Death heros instead of enemy wizards with Sanction.`,
  //       when: [HERO_PHASE],
  //       command_trait: true,
  //     },
  //     {
  //       name: `Fiendslayer`,
  //       desc: `Add 1 to hit rolls made by this general targeting Vampires.`,
  //       when: [COMBAT_PHASE],
  //       command_trait: true,
  //     },
  //   ],
  // },
}

export default tagAs(CommandTraits, 'command_trait')
