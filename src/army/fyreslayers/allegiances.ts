import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Vostarg (Lodge)`,
    effects: [
      {
        name: `Fearsome Surge`,
        desc: `If you declare a friendly VOSTARG unit will run in R1 movement phase, do not roll, instead add 6" automatically.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Fearsome Surge`,
        desc: `+1 to charge rolls for friendly VOSTARG units.`,
        when: [CHARGE_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Vosaxe`,
        desc: `Pick a melee weapon at the start of the battle. Improve its rend by 1. In addition, unmodified hits of 6 gain an additional 1 damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Honour Our Ancestors`,
        desc: `Pick a friendly VOSTARG HERO unit. Until the end of the phase, add 1 to hit rolls made by that HERO and friendly VULKITE BERZERKERS and HEARTHGUARD BERZERKERS wholly within 12" of that HERO. Cannot use more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Fiery Endurance`,
        desc: `Friendly VOSTARG units wholly within 12" of this general at the start of your movement phase can run and still charge later that turn.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Greyfyrd (Lodge)`,
    effects: [
      {
        name: `Spoils of Victory`,
        desc: `2 additional artifacts of power for GREYFYRD HEROES in your army.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Helm of Obsidia`,
        desc: `Add 2 to the Wounds characteristic of the bearer.`,
        when: [DURING_GAME],
        artifact: true,
      },
      {
        name: `Expert Cohesion`,
        desc: `You can use this CA when a friendly GREYFYRD HERO is picked to fight. Other GREYFYRD HEROS mounted on a MAGMADROTH that are within 3" of this HERO can fight immediately afterwards before your enemy can pick a unit to fight. They cannot fight in that phase again unless an ability or spell lets them fight more than once.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Battle-scarred Veteran`,
        desc: `+1 attack for general's melee weapons while there are 5 or more enemy models within 3" of this general.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Hermdar (Lodge)`,
    effects: [
      {
        name: `Seize by Force`,
        desc: `HERMDAR units wholly within enemy territory or wholly within 12" of an objective do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Tyrant Slayer`,
        desc: `Pick one of the bearer's melee weapons. You can re-roll wound rolls for attacks made by that weapon that target an enemy HERO. In addition if the unmodified hit roll for an attack by this weapon against an enemy HERO is a 6 that attack inflicts 1 mortal wound as well as any normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Skull-breakers and Oath-takers`,
        desc: `Pick 1 friendly HERMDAR VULKITE BERZERKER unit or 1 friendly HERMDAR HEARHTGUARD BERZERKER unit wholly within 12" of a HERMDAR HERO. That unit fights at the start of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Warrior Indominate`,
        desc: `Subtract 1 from wound rolls that target this general and friendly HERMDAR units wholly within 12".`,
        when: [HERO_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Lofnir (Lodge)`,
    effects: [
      {
        name: `Venerators of Vulcatrix`,
        desc: `Each MAGMADROTH in a LOFNIR army, instead of only 1, can be given a Magmadroth trait. In addition you can include 1 additional Behemoth as long as every Behemoth in your army is a MAGMADROTH.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Igneous Battle-throne`,
        desc: `6+ to ignore wounds or mortal wounds allocated to the bearer.`,
        when: [DURING_GAME],
        artifact: true,
      },
      {
        name: `Torrent of Magma`,
        desc: `Pick an enemy unit within 12" of a friendly LOFNIR PRIEST. Until the end of that phase add 1 to hit and wound rolls from Magmapikes by friendly units that target that enemy unit. The same unit cannot be affected by this CA more than once per phase.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Explosive Charge`,
        desc: `+1 charge for friendly LOFNIR MAGMADROTHS within 12" of this general.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
    ],
  },
]

export default Allegiances
