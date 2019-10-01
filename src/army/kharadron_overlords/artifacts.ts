import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `The Last Word (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `The Last Word (GREAT ENDRINWORK)`,
        desc: `When enemy finishes charge within 1/2", fire with chosen weapon.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Incredible Self-healing Hull (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Incredible Self-healing Hull (GREAT ENDRINWORK)`,
        desc: `Heal 1 wound on 4+ each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Malefic Skymines (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Malefic Skymines (GREAT ENDRINWORK)`,
        desc: `If flying enemy ends charge within 1", they suffer D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ebullient Buoyancy Aid (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Ebullient Buoyancy Aid (GREAT ENDRINWORK)`,
        desc: `Halve overburdened penalties.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Prudency Chutes (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Prudency Chutes (GREAT ENDRINWORK)`,
        desc: `Re-roll 1s when survivors bail out from destroyed vessel.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Magnificent Omniscope (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Magnificent Omniscope (GREAT ENDRINWORK)`,
        desc: `Move an extra D6" (not D3") when using Aetheric Navigation.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
        desc: `SKYVESSEL can be set-up in the aethersphere.`,
        when: [DURING_SETUP],
      },
      {
        name: `Aetherspheric Endrins (GREAT ENDRINWORK)`,
        desc: `Can descend in your hero phase. Set-up vessel 9" from the enemy. Units that disembark this turn must do so 9" away from enemy. Neither vessel nor units disembarked may move this turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Breath of Morgrim (GREAT ENDRINWORK)`,
    effects: [
      {
        name: `Breath of Morgrim (GREAT ENDRINWORK)`,
        desc: `After moving (not running), pick an enemy within 6". Roll a D6 for each model, if you roll at least one 6, unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Aethermatic Might (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Hammer of Aethermatic Might (AETHERMATIC WEAPON)`,
        desc: `Wound rolls of 6 = double damage on chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sledgeshock Hammer (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Sledgeshock Hammer (AETHERMATIC WEAPON)`,
        desc: `+1 to wound rolls on chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Bludgeon (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Aethershock Bludgeon (AETHERMATIC WEAPON)`,
        desc: `-1 Rend to chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gattlesson's Endless Repeater (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Gattlesson's Endless Repeater (AETHERMATIC WEAPON)`,
        desc: `+2 attacks to chosen missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Earbuster (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Aethershock Earbuster (AETHERMATIC WEAPON)`,
        desc: `If models are slain with chose missile weapon, affected enemy must roll for battleshock.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Staff of Ocular Optimisation (AETHERMATIC WEAPON)`,
    effects: [
      {
        name: `Staff of Ocular Optimisation (AETHERMATIC WEAPON)`,
        desc: `+1 to hit rolls on chosen missile weapon.`,
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
        desc: `Re-roll all failed hit and wound combat rolls vs enemy that is a target of Settle the Grudges.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Masterwrought Armour (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Masterwrought Armour (SKY-PORT TREASURE)`,
        desc: `Re-roll saves of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Balebreath Mask (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Balebreath Mask (SKY-PORT TREASURE)`,
        desc: `Enemy units within 3" suffer 1 mortal wound on 4+ each combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Autotinkerer (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Autotinkerer (SKY-PORT TREASURE)`,
        desc: `Single SKYVESSEL within 3" or embarked on heals 1 wound on 4+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aethersight Loupe (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Aethersight Loupe (SKY-PORT TREASURE)`,
        desc: `Can unbind spell. If they can already attempt to unbind a spell, they can attempt to unbind one extra spell instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gimlet Lens (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Gimlet Lens (SKY-PORT TREASURE)`,
        desc: `Enemy cannot benefit from modifiers vs attacks from bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aethercharged Rune (SKY-PORT TREASURE)`,
    effects: [
      {
        name: `Aethercharged Rune (SKY-PORT TREASURE)`,
        desc: `Once per battle: Can change result of 1 hit, wound, damage or save roll.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
