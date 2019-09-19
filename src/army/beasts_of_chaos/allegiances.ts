import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_TWO_MOVEMENT_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Allherd (Greatfray)`,
    effects: [
      {
        name: `Bestial Might`,
        desc: `Subtract 1 from battleshock rolls made for ALLHERD units in the battleshock phase if they were picked to fight in the combat phase of the same turn.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Booming Roar`,
        desc: `You can use this command ability at the start of your hero phase if your general is on the battlefield. If you do so, you receive 1 Primordial Call point.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Dominator`,
        desc: `You can re-roll charge rolls made for friendly ALLHERD units wholly within 18" of this general if this general is within 3" of any enemy units.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
      {
        name: `Blade of the Desecrator`,
        desc: `Improve the Rend characteristic of this weapon by 1 for attacks this target a unit of 10 or more models. Improve the Rend characteristic of this weapon by 2 instead for attacks that target a unit of 20 or more models. Attacks made by this weapon cannot have a Rend characteristic greater than -3.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Gavespawn (Greatfray)`,
    effects: [
      {
        name: `Gift of Morghur`,
        desc: `If a friendly GAVESPAWN HERO is slain, roll a D6 before removing the model. On a 2+ one CHAOS SPAWN is added to your army. Set up the CHAOS SPAWN anywhere on the battlefield within 6" of the slain HERO. If the HERO had the KHORNE, NURGLE, SLAANESH or TZEENTCH keyword, the same keyword must be chosen for the CHAOS SPAWN . If they did not, you cannot use the Cursed of the Dark Gods ability to choose a keyword for that CHAOS SPAWN .`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Propagator of Devolution`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly GAVESPAWN unitwhollywithin12"ofafriendly GAVESPAWN CHAOS SPAWN . Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Unravelling Aura`,
        desc: `This general can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. If this general is already a WIZARD, they can attempt to unbind 1 additional spell in the enemy hero phase.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Mutating Gnarlblade`,
        desc: `Add 2 to the Damage characteristic of this weapon. However, each unmodified hit roll of 1 for attacks made with this weapon inflicts 1 mortal wound upon the bearer after all of the bearer's attacks have been made.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Darkwalkers (Greatfray)`,
    effects: [
      {
        name: `Shadowbeasts`,
        desc: `WARHERD and THUNDERSCORN units in a DARKWALKERS army are considered to have the BRAYHERD keyword for the purposes of the Brayherd Ambush battle trait.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Shadowbeasts`,
        desc: `Up to half (rounding up) of the reserve units that are set up in ambush can arrive in your second movement phase instead of your first movement phase.`,
        when: [TURN_TWO_MOVEMENT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Savage Encirclement`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly DARKWALKERS unit that is more than 9" from any enemy units and wholly within 18" of a friendly DARKWALKERS HERO. Remove that unit from the battlefield and place it to one side. At the end of your next movement phase, set that unit up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Nomadic Leader`,
        desc: `Add 1 to run rolls for friendly DARKWALKERS units while they are wholly within 12" of this general.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Desolate Shard`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use the Desolate Shard if they are within 3" of a terrain feature. If they do so, roll a D6 for each enemy unit within 1" of that terrain feature. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
