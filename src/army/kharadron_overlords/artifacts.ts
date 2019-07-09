import { TArtifacts } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE, CHARGE_PHASE, DURING_GAME } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Aetherspheric Endrins`,
    effects: [
      {
        name: `Aetherspheric Endrins`,
        desc: `SKYVESSEL can be set-up in the aethersphere, can descend in your hero phase. Set-up vessel 9" from the enemy. Units that disembark this turn must do so 9" away from enemy. Neither vessel nor units disembarked may move this turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aetherspeed Hammer`,
    effects: [
      {
        name: `Aetherspeed Hammer`,
        desc: `Bearer piles-in and attacks first.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Breath of Morgrim`,
    effects: [
      {
        name: `Breath of Morgrim`,
        desc: `After moving (not running), pick an enemy within 6". Roll a dice for each model, if you roll at least one 6, unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Grudgehammer`,
    effects: [
      {
        name: `Grudgehammer`,
        desc: `Re-roll all failed hit and wound combat rolls vs enemy that is a target of Settle the Grudges.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Last Word`,
    effects: [
      {
        name: `The Last Word`,
        desc: `When enemy finishes charge within 1/2", fire with chosen weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Incredible Self-healing Hull`,
    effects: [
      {
        name: `Incredible Self-healing Hull`,
        desc: `Heal 1 wound on 4+ each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Malefic Skymines`,
    effects: [
      {
        name: `Malefic Skymines`,
        desc: `If flying enemy ends charge within 1", they suffer D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ebullient Buoyancy Aid`,
    effects: [
      {
        name: `Ebullient Buoyancy Aid`,
        desc: `Halve overburdened penalties.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Prudency Chutes`,
    effects: [
      {
        name: `Prudency Chutes`,
        desc: `Re-roll 1s when survivors bail out from destroyed vessel.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Magnificent Omniscope`,
    effects: [
      {
        name: `Magnificent Omniscope`,
        desc: `Move an extra D6" (not D3") when using Aetheric Navigation.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Aethermatic Might`,
    effects: [
      {
        name: `Hammer of Aethermatic Might`,
        desc: `Wound rolls of 6 = double damage on chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sledgeshock Hammer`,
    effects: [
      {
        name: `Sledgeshock Hammer`,
        desc: `+1 to wound rolls on chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Bludgeon`,
    effects: [
      {
        name: `Aethershock Bludgeon`,
        desc: `-1 Rend to chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gattlesson's Endless Repeater`,
    effects: [
      {
        name: `Gattlesson's Endless Repeater`,
        desc: `+2 attacks to chosen missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aethershock Earbuster`,
    effects: [
      {
        name: `Aethershock Earbuster`,
        desc: `If models are slain with chose missile weapon, affected enemy must roll for battleshock.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Staff of Ocular Optimisation`,
    effects: [
      {
        name: `Staff of Ocular Optimisation`,
        desc: `+1 to hit rolls on chosen missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Masterwrought Armour`,
    effects: [
      {
        name: `Masterwrought Armour`,
        desc: `Re-roll saves of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Balebreath Mask`,
    effects: [
      {
        name: `Balebreath Mask`,
        desc: `Enemy units within 3" suffer 1 mortal wound on 4+ each combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Autotinkerer`,
    effects: [
      {
        name: `Autotinkerer`,
        desc: `Single SKYVESSEL within 3" or embarked on heals 1 wound on 4+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aethersight Loupe`,
    effects: [
      {
        name: `Aethersight Loupe`,
        desc: `Can unbind spell. If they can already +1 dice to unbind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gimlet Lens`,
    effects: [
      {
        name: `Gimlet Lens`,
        desc: `Enemy cannot benefit from modifiers vs attacks from bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aethercharged Rune`,
    effects: [
      {
        name: `Aethercharged Rune`,
        desc: `Once per battle: Can change result of 1 hit, wound, damage or save roll.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
