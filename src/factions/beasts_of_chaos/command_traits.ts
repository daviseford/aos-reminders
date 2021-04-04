import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
  TURN_TWO_MOVEMENT_PHASE,
} from 'types/phases'
const CommandTraits = {
  // Brayherd Traits
  'Bestial Cunning (Brayherd)': {
    effects: [
      {
        name: `Bestial Cunning (Brayherd)`,
        desc: `Up to half (rounding down) of the friendly reserve units set up in ambush (see Brayherd Ambush, page 61) can arrive in your second movement phase instead of your first.`,
        when: [TURN_TWO_MOVEMENT_PHASE],
      },
    ],
  },
  'Indomitable Beast (Brayherd)': {
    effects: [
      {
        name: `Indomitable Beast (Brayherd)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Apex Predator (Brayherd)': {
    effects: [
      {
        name: `Apex Predator (Brayherd)`,
        desc: `Reroll wound rolls of 1 for attacks made by this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Malevolent Despoiler (Brayherd)': {
    effects: [
      {
        name: `Malevolent Despoiler (Brayherd)`,
        desc: `Enemy units cannot receive the benefit of cover while they are within 12" of this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Oracle of the Dark Tongue (Brayherd)': {
    effects: [
      {
        name: `Oracle of the Dark Tongue (Brayherd)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Shadowpelt (Brayherd)': {
    effects: [
      {
        name: `Shadowpelt (Brayherd)`,
        desc: `Subtract 1 from hit rolls for attacks that target this general made by models more than 3" away from the general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Warherd Traits
  'Eater of Heroes (Warherd)': {
    effects: [
      {
        name: `Eater of Heroes (Warherd)`,
        desc: `You can reroll failed hit rolls for attacks made by this general that target an enemy HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Rampant Juggernaut (Warherd)': {
    effects: [
      {
        name: `Rampant Juggernaut (Warherd)`,
        desc: `You can reroll charge rolls made for friendly WARHERD units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Gorger (Warherd)': {
    effects: [
      {
        name: `Gorger (Warherd)`,
        desc: `Do not roll a D3 to determine the number of wounds healed by the Bloodgorge battle trait (pg 61) for friendly WARHERD units that are wholly within 12" of this general. Instead, the battle trait heals 3 wounds allocated to that unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Gouge-tusks (Warherd)': {
    effects: [
      {
        name: `Gouge-tusks (Warherd)`,
        desc: `At the end of the combat phase, pick an enemy unit within 3" of this general and roll a D6. On a 1, nothing happens. On a 2-5, that unit suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Roaring Brute (Warherd)': {
    effects: [
      {
        name: `Roaring Brute (Warherd)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Rugged Hide (Warherd)': {
    effects: [
      {
        name: `Rugged Hide (Warherd)`,
        desc: `Worsen the Rend characteristic of attacks that target this general by 1 (to a minimum of '-').`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Thunderscorn Traits
  'Tempestuous Tyrant (Thunderscorn)': {
    effects: [
      {
        name: `Tempestuous Tyrant (Thunderscorn)`,
        desc: `You can reroll failed wound rolls for attacks made by this general that target a MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Magnetic Monstrosity (Thunderscorn)': {
    effects: [
      {
        name: `Magnetic Monstrosity (Thunderscorn)`,
        desc: `Enemy units cannot retreat while they are within 3" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Father of the Storm (Thunderscorn)': {
    effects: [
      {
        name: `Father of the Storm (Thunderscorn)`,
        desc: `When you use the Creatures of the Storm battle trait, you can reroll the dice that determines how far units can move if this general is on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lightning-fast Monstrosity (Thunderscorn)': {
    effects: [
      {
        name: `Lightning-fast Monstrosity (Thunderscorn)`,
        desc: `This general fights at the start of the combat phase if it made a charge move in the same turn, before the players start picking any other units to fight in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Adamantine Scales (Thunderscorn)': {
    effects: [
      {
        name: `Adamantine Scales (Thunderscorn)`,
        desc: `Add 1 to the Save characteristic of this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Ancient Beyond Knowing (Thunderscorn)': {
    effects: [
      {
        name: `Ancient Beyond Knowing (Thunderscorn)`,
        desc: `At the start of the first battle round, you receive D3 additional command points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  // Allherd Greatfray
  Dominator: {
    effects: [
      {
        name: `Dominator`,
        desc: `You can reroll charge rolls made for friendly ALLHERD units wholly within 18" of this general if this general is within 3" of any enemy units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Gavespawn Greatfray
  'Unravelling Aura': {
    effects: [
      {
        name: `Unravelling Aura`,
        desc: `This general can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. If this general is already a WIZARD, they can attempt to unbind 1 additional spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Darkwalkers Greatfray
  'Nomadic Leader': {
    effects: [
      {
        name: `Nomadic Leader`,
        desc: `Add 1 to run rolls for friendly DARKWALKERS units while they are wholly within 12" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
