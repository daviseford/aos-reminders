import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Heart Seeker`,
    effects: [
      {
        name: `Heart Seeker`,
        desc: `You can re-roll failed wound rolls with this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Collar of Khorne`,
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Drinker`,
    effects: [
      {
        name: `Blood Drinker`,
        desc: `At the end of any combat phase in which the bearer inflicts any unsaved wounds or mortal wounds with this weapon, they immediately heal one wound lost earlier in the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gorecleaver`,
    effects: [
      {
        name: `Gorecleaver`,
        desc: `Attacks from Gorecleaver inflict an additional -1 Rend (for example, a weapon with a Rend characteristic of-1 becomes -2 instead). In addition, any wound rolls of 6 made with this weapon inflict a number of mortal wounds equal to the weapon's Damage characteristic instead of being resolved normally.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Crimson Plate`,
    effects: [
      {
        name: `The Crimson Plate`,
        desc: `You can re-roll save rolls of 1 for the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blood Rune`,
    effects: [
      {
        name: `Blood Rune`,
        desc: `You generate one additional Blood Tithe point each time the bearer of a Blood Rune slays an enemy HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Banner of Khorne`,
    effects: [
      {
        name: `Banner of Khorne`,
        desc: `You can re-roll hit rolls of 1 in the combat phase for any KHORNE models from your army that are within 8" of the bearer. If an affected model already has the ability to do this, you can re-roll all failed hit rolls for that model instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Banner of Wrath`,
    effects: [
      {
        name: `Banner of Wrath`,
        desc: `In each of your hero phases, roll a dice for each enemy unit within 8" of the bearer. On a roll of 4 or more, the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Banner of Blood`,
    effects: [
      {
        name: `Banner of Blood`,
        desc: `You can re-roll failed charge rolls for any KHORNE units from your army that are within 8" of the bearer at the start of the charge phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Skull-helm of Khorne`,
    effects: [
      {
        name: `The Skull-helm of Khorne`,
        desc: `Your opponent must add 1 to the result of any battleshock tests they take for units that are within 8" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Blood-forged Armour`,
    effects: [
      {
        name: `The Blood-forged Armour`,
        desc: `When you make save rolls for the bearer, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Brazen Rune`,
    effects: [
      {
        name: `The Brazen Rune`,
        desc: `Roll a dice each time the bearer suffers any unsaved wounds or mortal wounds as the result of a spell; on a roll of 2 or more, the wound or mortal wound being rolled for is ignored. Once per game, you can choose to expend the rune's power to automatically unbind one enemy spell, after which the Brazen Rune will no longer have any effect.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Blade of Endless Bloodshed`,
    effects: [
      {
        name: `The Blade of Endless Bloodshed`,
        desc: `At the end of any combat phase in which the bearer slew one or more enemy models with this weapon, you generate one Blood Tithe point in addition to any others you generated during that phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Destroyer`,
    effects: [
      {
        name: `Mark of the Destroyer`,
        desc: `Double the Attacks characteristics of the bearer's Melee weapons (but not their mount's). However, should the bearer make any attacks in the combat phase but fail to slay any enemy models, the bearer is immediately slain; remove the model from play and replace it with a CHAOS SPAWN under your control. Set up this model as near as possible to the model you removed (even if this is within 3" of an enemy model). It cannot make attacks this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Talisman of Burning Blood`,
    effects: [
      {
        name: `Talisman of Burning Blood`,
        desc: `Add 1 to any run rolls you make for the bearer and any KHORNE units from your army that are within 8" of them at the start of the movement phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Talisman of Burning Blood`,
        desc: `Add 1 to any charge rolls you make for the bearer and any KHORNE units from your army that are within 8" of them at the start of the charge phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `A'rgath, the King of Blades`,
    effects: [
      {
        name: `A'rgath, the King of Blades`,
        desc: `This weapon always hits enemy HERO models on a roll of 2 or more.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deathdealer`,
    effects: [
      {
        name: `Deathdealer`,
        desc: `Add 1 to the Damage characteristic of this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Khartoth the Bloodhunger`,
    effects: [
      {
        name: `Khartoth the Bloodhunger`,
        desc: `Each time an enemy HERO or MONSTER suffers any unsaved wounds or mortal wounds from this weapon it is locked in time and cannot attack until all other units have made their attacks in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hellfire Blade`,
    effects: [
      {
        name: `Hellfire Blade`,
        desc: `Wound rolls of a 6 with this weapon cause a mortal wound in addition to their normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Harvester of Skulls`,
    effects: [
      {
        name: `Harvester of Skulls`,
        desc: `Add 1 to the Attacks characteristic of this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Behemoth's Bane`,
    effects: [
      {
        name: `Behemoth's Bane`,
        desc: `You can re-roll any failed wound rolls and choose to re-roll any Damage rolls when attacking enemy MONSTERS with this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Crimson Crown`,
    effects: [
      {
        name: `The Crimson Crown`,
        desc: `When making attacks with the bearer and any KHORNE DAEMON models from your army that are within 8" of them in the combat phase, you can make one additional attack with that model for each hit roll of 6 you make. Any bonus attacks made in this manner must use the same weapon that generated them, but cannot themselves generate additional attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of Scorn`,
    effects: [
      {
        name: `Armour of Scorn`,
        desc: `Each time the bearer suffers a wound or mortal wound, roll a dice; on a roll of 6, the wound or mortal wound is ignored. Add 1 to this roll if the wound or mortal wound was suffered as a result of a spell.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mark of the Bloodreaper`,
    effects: [
      {
        name: `Mark of the Bloodreaper`,
        desc: `Each time the bearer of a Mark of the Bloodreaper inflicts 8 or more unsaved wounds or mortal wounds in a single combat phase, you generate one Blood Tithe point in addition to any others you generated during that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Collar of Khorne`,
    effects: [
      {
        name: `Collar of Khorne`,
        desc: `The bearer can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Crimson Soulstone`,
    effects: [
      {
        name: `Crimson Soulstone`,
        desc: `The bearer immediately heals D3 wounds lost earlier in the battle each time they slay an enemy HERO in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Slayer`,
    effects: [
      {
        name: `Mark of the Slayer`,
        desc: `You can re-roll hit rolls of 1 in the combat phase for the bearer and all KHORNE units within 8" of them at the start of the combat phase. If the bearer charged earlier in the turn, you can also re-roll wound rolls of 1 in the combat phase for the bearer and all KHORNE units within 8" of them at the start of the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts
