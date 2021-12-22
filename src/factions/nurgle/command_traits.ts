import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
const CommandTraits = {
  "Grandfather's Blessing": {
    effects: [
      {
        name: `Grandfather's Blessing`,
        desc: `Once per battle, at the start of the battle round after the Cycle of Corruption has advanced, if this general has not been slain, you can move the Cycle of Corruption 1 stage forwards. If more than 1 player could move the current stage of the Cycle of Corruption using this command trait, then none of them can.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Living Plague': {
    effects: [
      {
        name: `Living Plague`,
        desc: `At the start of your hero phase, roll a dice for each enemy unit within 7" of this general. On a 2+, give that unit 1 disease point and you receive 1 contagion point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bloated with Corruption': {
    effects: [
      {
        name: `Bloated with Corruption`,
        desc: `If an unmodified Disgustingly Resilient ward roll for this general is 6, you can pick 1 enemy unit within 3" of this general and give it 1 disease point.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Infernal Conduit': {
    effects: [
      {
        name: `Infernal Conduit`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a dice. On a l, nothing happens. On a 2-5, you receive 1 contagion point. On a 6, you receive D3 contagion points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Avalanche of Rotten Flesh': {
    effects: [
      {
        name: `Avalanche of Rotten Flesh`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" ofthem and roll a number of dice equal to the charge roll for that charge move. For each 6, that enemy unit suffers 1 mortal wound and give that enemy unit1 disease point.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Overpowering Stench': {
    effects: [
      {
        name: `Overpowering Stench`,
        desc: `Enemy units within 7" of this general cannot issue commands, and enemy units wholly within 7" of this general cannot receive commands.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Gift of Febrile Frenzy': {
    effects: [
      {
        name: `Gift of Febrile Frenzy`,
        desc: `Once per battle, at the start of the combat phase, you can say that this general will release a sickening fever. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly MAGGOTKIN OF NURGLE units while they are wholly within 7" of this general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Nurgling Infestation': {
    effects: [
      {
        name: `Nurgling Infestation`,
        desc: `Subtract 1 from hit rolls for attacks that target this general. In addition, add 1 to hit rolls for attacks made by friendly NURGLING SWARMS that are wholly within 7" of this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Pestilent Breath': {
    effects: [
      {
        name: `Pestilent Breath`,
        desc: `At the start of your shooting phase, pick 1 enemy unit within 7" of your general. Roll 1 dice for each model in that unit that is within 7" of this general. For each 5+, that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  // // Mortal Traits
  // 'Hideous Visage': {
  //   effects: [
  //     {
  //       name: `Hideous Visage`,
  //       desc: `Subtract 2 from the Bravery characterisic of enemy units while they are within 3" of your general.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Virulent Contagion': {
  //   effects: [
  //     {
  //       name: `Virulent Contagion`,
  //       desc: `Improve the Rend characterisic by 1 for attacks made by your general in the combat phase.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Munificent Wanderers Command Traits
  // 'One Last Gift': {
  //   effects: [
  //     {
  //       name: `One Last Gift`,
  //       desc: `If the unmodified hit roll for an attack made with a melee weapon by an enemy unit that targets a friendly MUNIFICENT WANDERERS DAEMON unit that is wholly within 12" of this general is 1, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
  //       when: [COMBAT_PHASE],
  //       rule_sources: [meta_rule_sources.ERRATA_WRATH_OF_THE_EVERCHOSEN_AUGUST_2021],
  //     },
  //   ],
  // },
  // // Droning Guard Command Traits
  // 'Rotwing Commander': {
  //   effects: [
  //     {
  //       name: `Rotwing Commander`,
  //       desc: `After armies have been setup before the first battle round, friendly Droning Guard Plague Drones units can move up to 4".`,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
  // // Blessed Sons Command Traits
  // 'Foul Conqueror': {
  //   effects: [
  //     {
  //       name: `Foul Conqueror`,
  //       desc: `Once per turn you can use the At the Double command ability on a friendly Blessed Sons Rotbringer unit within 12" of this general without spending any command points.`,
  //       when: [MOVEMENT_PHASE],
  //     },
  //   ],
  // },
  // // Drowned Men Command Traits
  // 'Bloated Raider': {
  //   effects: [
  //     {
  //       name: `Bloated Raider`,
  //       desc: `You can reroll charge rolls for friendly Drowned Men Pusgoyle Blightlords units wholly within 14" of this general.`,
  //       when: [CHARGE_PHASE],
  //     },
  //   ],
  // },
  // Tamurkhan's Horde Command Traits
  'Unrelenting Conqueror': {
    effects: [
      {
        name: `Unrelenting Conqueror`,
        desc: `Add 1 to run rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Invidian Plaguehost
  // 'Rude Limericks': {
  //   effects: [
  //     {
  //       name: `Rude Limericks`,
  //       desc: `Add 1 to the Bravery characteristic of battalion Nurgle Daemon units wholly within 14" of the battaltion Sloppity Bilepiper. This is additive with Disease of Mirth.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
}

export default tagAs(CommandTraits, 'command_trait')
