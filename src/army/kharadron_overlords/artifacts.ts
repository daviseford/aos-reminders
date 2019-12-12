import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `The Last Word (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `The Last Word (GREAT ENDRINWORK)`,
        desc: `When an enemy unit finishes a charge within 1/2" of this vessel, you can immediately shoot at that unit with this weapon as if it were your shooting phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Incredible Self-healing Hull (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Incredible Self-healing Hull (GREAT ENDRINWORK)`,
        desc: `Roll a dice for this SKYVESSEL in each of your hero phases. On a roll of 4 or more it heals 1 wound. This is in addition to any other healing it receives.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Malefic Skymines (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Malefic Skymines (GREAT ENDRINWORK)`,
        desc: `If an enemy unit that can fly ends its charge move within 1" of this SKYVESSEL, it suffers D3 mortal wounds. This is in addition to any other ability that affects charging units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ebullient Buoyancy Aid (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Ebullient Buoyancy Aid (GREAT ENDRINWORK)`,
        desc: `This SKYVESSEL halves any penalty for being overburdened, rounding down. Re-roll this result if this SKYVESSEL is a Grundstok Gunhauler.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Prudency Chutes (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Prudency Chutes (GREAT ENDRINWORK)`,
        desc: `If this SKYVESSEL is destroyed, you can re-roll any rolls of 1 when determining whether its passengers survive when they bail out. Re-roll this result if this SKYVESSEL is a Grundstok Gunhauler.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Magnificent Omniscope (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Magnificent Omniscope (GREAT ENDRINWORK)`,
        desc: `This SKYVESSEL can move an extra D6" rather than D3" when it uses its Aetheric Navigation ability. Re-roll this result if this SKYVESSEL is a Grundstok Gunhauler.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
        desc: `A SKYVESSEL with these endrins can be set up in the aethersphere.`,
        when: [DURING_SETUP],
      },
      {
        name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
        desc: `At the beginning of any of your hero phases, this vessel can descend. When it does, set it up on the battlefield more than 9" from the enemy. Units that disembark from the vessel in the turn it descends must do so more than 9" from the enemy. Neither the vessel nor units that disembark from it can move in the movement phase in the turn it descends. If the vessel has not descended by the end of the battle, the vessel and any units embarked on it are considered slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Breath of Morgrim (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Breath of Morgrim (GREAT ENDRINWORK)`,
        desc: `Immediately after you move the Ironclad that has this great endrinwork in the movement phase (though not if it runs), pick an enemy unit within 6" and roll a dice for each model in that unit. If you roll at least one 6, that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Aethermatic Might (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Hammer of Aethermatic Might (AETHERMATIC WEAPON)`,
        desc: `Wound rolls of 6 or more made for this weapon cause double damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sledgeshock Hammer (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Sledgeshock Hammer (AETHERMATIC WEAPON)`,
        desc: `Add 1 to wound rolls made for this weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Bludgeon (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Aethershock Bludgeon (AETHERMATIC WEAPON)`,
        desc: `Improve the Rend characteristic of this weapon by 1 (if it has a Rend of '-' it becomes -1).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gattlesson's Endless Repeater (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Gattlesson's Endless Repeater (AETHERMATIC WEAPON)`,
        desc: `Add 2 to the Attacks characteristic of this weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Earbuster (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Aethershock Earbuster (AETHERMATIC WEAPON)`,
        desc: `If any models are slain with this weapon, their unit must immediately take a battleshock test. This is in addition to the test they must take in the battleshock phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Staff of Ocular Optimisation (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Staff of Ocular Optimisation (AETHERMATIC WEAPON)`,
        desc: `Add 1 to any hit rolls you make in the shooting phase for a HERO with a Staff of Ocular Optimisation.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aetherspeed Hammer (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Aetherspeed Hammer (AETHERMATIC WEAPON)`,
        desc: `Bearer piles-in and attacks first.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grudgehammer (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Grudgehammer (AETHERMATIC WEAPON)`,
        desc: `The bearer can re-roll all failed hit and wound rolls in the combat phase for attacks that target an enemy unit which was picked for the Settle The Grudges artycle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Masterwrought Armour (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Masterwrought Armour (SKY-PORT TREASURE)`,
        desc: `Re-roll save rolls of 1 for this HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Balebreath Mask (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Balebreath Mask (SKY-PORT TREASURE)`,
        desc: `At the beginning of each combat phase, roll a dice if there is an enemy unit within 3" of this HERO. On a roll of 4 or more that unit suffers a mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Autotinkerer (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Autotinkerer (SKY-PORT TREASURE)`,
        desc: `In your hero phase, this HERO can attempt to repair a single SKYVESSEL within 3" or the one it is embarked upon. On a roll of 4 or more, that SKYVESSEL heals 1 wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aethersight Loupe (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Aethersight Loupe (SKY-PORT TREASURE)`,
        desc: `This HERO can unbind one spell in each enemy hero phase as if they were a wizard. If they already have this ability, they roll an extra dice when they do so and add it to their total.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gimlet Lens (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Gimlet Lens (SKY-PORT TREASURE)`,
        desc: `Enemy units can never benefit from modifiers to their Save or save rolls (e.g. from being within cover) against attacks made by this HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aethercharged Rune (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Aethercharged Rune (SKY-PORT TREASURE)`,
        desc: `Once per battle, you can change the result of one hit, wound, damage or save roll for this HERO to the result of your choice.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
