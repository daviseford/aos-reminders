import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Oakenbrow (Glade)`,
    effects: [
      {
        name: `Our Roots Run Deep`,
        desc: `Subtract 2 from the number of wounds suffered by OAKENBROW SPIRITS OF DURTHU, OAKENBROW TREELORD ANCIENTS and OAKENBROW TREELORDS when determining which row on their damage table to use (to a minimum of 0).`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Yield To None`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly OAKENBROW HERO. Until the end of that phase, do not take battleshock tests for friendly OAKENBROW DRYADS units while they are wholly within 16" of that HERO.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
      {
        name: `Regal Old-growth`,
        desc: `Add 1 to the Wounds characteristic of this general.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Dawnflask`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Gnarlroot (Glade)`,
    effects: [
      {
        name: `Shield the Arcane`,
        desc: `Re-roll hit rolls of 1 for attacks made by friendly GNARLROOT units while they are wholly within 12" of any friendly GNARLROOT WIZARDS.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `The Earth Defends`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly GNARLROOT unit wholly within 12" of a friendly GNARLROOT HERO. Until the end of that phase, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6+ that wound or mortal wound is negated.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Nurtured by Magic`,
        desc: `Once in each of your hero phases, if this general successfully casts a spell that is not unbound, pick 1 friendly GNARLROOT unit wholly within 18" of this general. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Chalice of Nectar`,
        desc: `When making a casting or unbinding roll for the bearer, roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine that casting or unbinding roll.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Heartwood (Glade)`,
    effects: [
      {
        name: `Courage For Kurnoth`,
        desc: `Add 1 to the Bravery characteristic of friendly HEARTWOOD units while they are wholly within 12" of any friendly HEARTWOOD HEROES.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Lord of the Hunt`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 enemy unit within 12" of a friendly HEARTWOOD HERO. Until the end of that phase, you can re-roll hit and wound rolls of 1 for attacks made by friendly HEARTWOOD units that target that enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Legacy of Valour`,
        desc: `If this general is slain, you can pick 1 enemy unit within 1" of this general before they are removed from play and roll a D6. On a 2-5 that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Horn of the Consort`,
        desc: `You can re-roll hit rolls for attacks made by friendly HEARTWOOD KURNOTH HUNTERS wholly within 12" of the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Ironbark (Glade)`,
    effects: [
      {
        name: `Stubborn and Taciturn`,
        desc: `You can re-roll battleshock tests for friendly IRONBARK units while they are wholly within 12" of any friendly IRONBARK HEROES.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Stand Firm`,
        desc: `You can use this command ability in the combat phase, before the players pick any units to fight. If you do so, pick 1 enemy unit that made a charge move this turn and is within 1" of a friendly IRONBARK unit and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Mere Rainfall`,
        desc: `You can re-roll save rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Ironbark Talisman`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by the bearer.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Winterleaf (Glade)`,
    effects: [
      {
        name: `Winter's Bite`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly WINTERLEAF unit is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Branch Blizzard`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 enemy unit within 12" of a friendly WINTERLEAF HERO and visible to them. Roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `My Heart Is Ice`,
        desc: `Roll a D6 each time a wound inflicted by a melee weapon is allocated to this general and not negated. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Frozen Kernel`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 friendly WINTERLEAF unit wholly within 18" of the bearer. After that unit has fought in that phase for the first time, if it is within 3" of an enemy unit, it can make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Dreadwood (Glade)`,
    effects: [
      {
        name: `Malicious Tormentors`,
        desc: `You can re-roll hit rolls of 1 for attacks made by DREADWOOD SPITE-REVENANTS.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Sinister Ambush`,
        desc: `You can use this command ability once during each of your turns, at the end of your movement phase. If you do so, pick 1 friendly DREADWOOD unit wholly within 18" of a friendly DREADWOOD HERO. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Paragon of Terror`,
        desc: `Re-roll successful battleshock tests for enemy units while they are within 6" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Jewel of Withering`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Harvestboon (Glade)`,
    effects: [
      {
        name: `Vibrant Surge`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly HARVESTBOON units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Fertile Ground`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly HARVESTBOON unit wholly within 12" of a friendly HARVESTBOON HERO. Until the end of that phase, add 1 to the Attacks characteristic of that unit's melee weapons. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Seek New Fruit`,
        desc: `Each time this general attacks with its melee weapons, it can make a 6" move after all of its attacks have been resolved. If it does so, it must finish the move more than 3" from enemy units.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `The Silent Sickle`,
        desc: `Pick 1 of the bearer's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
