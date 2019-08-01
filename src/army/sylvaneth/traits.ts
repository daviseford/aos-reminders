import { TCommandTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Oakenbrow`,
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
      },
      {
        name: `Dawnflask`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer. On a 6+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Gnarlroot`,
    effects: [
      {
        name: `Shield the Arcane`,
        desc: `Re-roll hit rolls of 1 for attacks made by friendly GNARLROOT units while they are wholly within 12" of any friendly GNARLROOT WIZARDS.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `The Earth Defends`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly GNARLROOT unit wholly within 12" of a friendly GNARLROOT HERO. Until the end of that phase, roll a dice each time you allocate a wound or mortal wound to that unit. On a 6+ that wound or mortal wound is negated.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Nutured by Magic`,
        desc: `Once in each of your hero phases, if this general successfully casts a spell that is not unbound, pick 1 friendly GNARLROOT unit wholly within 18" of this general. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
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
    name: `Heartwood`,
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
        desc: `If this general is slain, you can pick 1 enemy unit within 1" of this general before they are removed from play and roll a dice. On a 2-5 that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
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
    name: `Ironbark`,
    effects: [
      {
        name: `Stubborn and Taciturn`,
        desc: `You can re-roll battleshock tests for friendly IRONBARK units while they are wholly within 12" of any friendly IRONBARK HEROES.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Stand Firm`,
        desc: `You can use this command ability in the combat phase, before the players pick any units to fight. If you do so, pick 1 enemy unit that made a charge move this turn and is within 1" of a friendly IRONBARK unit and roll a dice. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Mere Rainfall`,
        desc: `You can re-roll save rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
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
    name: `Winterleaf`,
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
        desc: `Roll a dice each time a wound inflicted by a melee weapon is allocated to this general and not negated. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
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
    name: `Dreadwood`,
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
    name: `Harvestboon`,
    effects: [
      {
        name: `Vibrant Surge`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly HARVESTBOON units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: ``,
        desc: ``,
        when: [],
        command_ability: true,
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
        artifact: true,
      },
    ],
  },
  {
    name: `Realm Walker`,
    effects: [
      {
        name: `Realm Walker`,
        desc: `If your general uses the Navigate Realmroots ability, add 2 to the dice result.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gnarled Warrior`,
    effects: [
      {
        name: `Gnarled Warrior`,
        desc: `When you make save rolls for your general, ignore the enemy's Rend unless it is -2 or better.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Gift of Ghyran`,
    effects: [
      {
        name: `Gift of Ghyran`,
        desc: `Your general heals 1 wound at the start of each of your hero phases, or D3 wounds if they are within 3" of a Sylvaneth Wyldwood.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of Spites`,
    effects: [
      {
        name: `Lord of Spites`,
        desc: `You can re-roll the first failed hit roll made for your general in each phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of Spites`,
        desc: `You can re-roll the first failed hit roll made for your general in each phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warsinger`,
    effects: [
      {
        name: `Warsinger`,
        desc: `You can add 1 to any charge rolls made for friendly SYLVANETH units that are within 10" of your general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Wisdom of the Ancients`,
    effects: [
      {
        name: `Wisdom of the Ancients`,
        desc: `All friendly SYLVANETH units within 10" of your general in the battleshock phase add 1 to their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ancient Nobility (Oakenbrow)`,
    effects: [
      {
        name: `Ancient Nobility (Oakenbrow)`,
        desc: `All friendly SYLVANETH units within 15" of your general in the battleshock phase add 1 to their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default CommandTraits
