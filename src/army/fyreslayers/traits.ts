import { TCommandTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Vostarg`,
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
      },
    ],
  },
  {
    name: `Greyfyrd`,
    effects: [
      {
        name: `Spoils of Victory`,
        desc: `2 additional artefacts of power for GREYFYRD HEROES in your army.`,
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
      },
    ],
  },
  {
    name: `Hermdar`,
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
      },
    ],
  },
  {
    name: `Lofnir`,
    effects: [
      {
        name: `Venerators of Vulcatrix`,
        desc: `Each MAGMADROTH in a LOFNIR army, instead of only 1, can be given a Magmadroth trait. In addition you can include 1 additional Behemoth as long as every Behemoth in your army is a MAGMADROTH.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Igneous Battle-throne`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer. On a 6+ ignore the wound or mortal wound.`,
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
      },
    ],
  },
  {
    name: `Fury of the Fyreslayers`,
    effects: [
      {
        name: `Fury of the Fyreslayers`,
        desc: `+1 to charges for friendly FYRESLAYERS units wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Honour of the Ancestors`,
    effects: [
      {
        name: `Honour of the Ancestors`,
        desc: `Do not take battleshock tests for friendly FYRESLAYERS units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Spirit of Grimnir`,
    effects: [
      {
        name: `Spirit of Grimnir`,
        desc: `If this general is on the battlefield, when you roll to activate an ur-gold rune, it has the enhanced effect on a 5+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood of the Berzerker`,
    effects: [
      {
        name: `Blood of the Berzerker`,
        desc: `Once per battle in the combat phase, after this general has fought in that phase for the first time, if they are within 3" of an enemy unit, they can immediately pile in and then attack with all melee weapons they are armed with for a 2nd time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Iron Will of the Guardian`,
    effects: [
      {
        name: `Destroyer of foes`,
        desc: `+1 Damage for this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fyremantle`,
    effects: [
      {
        name: `Fyremantle`,
        desc: `-1 to hit to enemy units within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wisdom and Authority`,
    effects: [
      {
        name: `Wisdom and Authority`,
        desc: `At the start of the first battle round you receive D3 additional command points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Oathslayer`,
    effects: [
      {
        name: `Oathslayer`,
        desc: `Add 1 to bravery of friendly DUARDIN units while wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ash-beard`,
    effects: [
      {
        name: `Ash-beard`,
        desc: `This general knows 2 prayers from the Zharrgrim Blessings table.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fyresteel Weaponsmith`,
    effects: [
      {
        name: `Fyresteel Weaponsmith`,
        desc: `Improve the rend characteristic of this general's weapons by 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Master Priest`,
    effects: [
      {
        name: `Master Priest`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield, you can activate one ur-gold rune that has already been activated, instead of one that has not been activated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cinder-crest Youngblood (Mount)`,
    effects: [
      {
        name: `Cinder-crest Youngblood`,
        desc: `When you use this model's Lashing Tail ability subtract 1 from the dice roll that determines if the target unit suffers D3 mortal wounds. If this model made a charge move in the same turn, subtract 2 instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flame-scale Youngblood (Mount)`,
    effects: [
      {
        name: `Flame-scale Youngblood`,
        desc: `After this model has made a charge move, pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 6 that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Fire-claw Adult (Mount)`,
    effects: [
      {
        name: `Fire-claw Adult`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lava-Tongue Adult (Mount)`,
    effects: [
      {
        name: `Lava-Tongue Adult`,
        desc: `When you use this model's Roaring Fyrestream ability, subtract 1 from the dice roll that determines if the target unit suffers mortal wounds. If this model is wholly within your territory or within 6" of an objective, subtract 2 instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Coal-heart Ancient (Mount)`,
    effects: [
      {
        name: `Coal-heart Ancient`,
        desc: `Worsen the rend of melee weapons that attack this target by 1 to a minimum of 0.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ash-horn Ancient (Mount)`,
    effects: [
      {
        name: `Ash-horn Ancient`,
        desc: `You can re-roll save rolls of 1 for attacks that target this model and friendly MAGMADROTHS within 6".`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
