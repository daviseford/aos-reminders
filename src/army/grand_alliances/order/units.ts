import { TBattalions, TUnits } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { LegacyBretonnianUnits } from './subfactions/bretonnia'
import { LegacyDuardinUnits } from './subfactions/duardin'
import { LegacyDwarfUnits } from './subfactions/dwarfs'
import { LegacyEldritchUnits } from './subfactions/eldritch'
import { LegacyEmpireUnits } from './subfactions/empire'
import { LegacyHighElvesUnits } from './subfactions/high_elves'
import { LegacyOrderUnits } from './subfactions/misc_order'
import { MonstrousArcanumOrder } from './subfactions/monstrous_arcanum'
import { LegacySwifthawkAgentUnits } from './subfactions/swifthawk_agents'
import { LegacyWoodElvesUnits } from './subfactions/wood_elves'

// Available to ALL factions in this Grand Alliance
export const OrderUnits: TUnits = [
  {
    name: `Gotrek Gurnisson`,
    effects: [
      {
        name: `Avatar of Grimnir`,
        desc: `If any damage is inflicted by an attack, spell, or ability that targets Gotrek or affects Gotrek is greater than 1, change it to 1. If a spell or ability would slay Gotrek, instead deal 1 mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `Avatar of Grimnir`,
        desc: `If this model is included in your army, it cannot be set up in reserve and you cannot use spells or abilities on this model that would allow you to set it up again after the battle has begun.`,
        when: [START_OF_GAME],
      },
      {
        name: `Krag Blackhammer's Master Rune`,
        desc: `You can reroll hit and wound rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack inflicts D6 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unstoppable Battle Fury`,
        desc: `If this model is within 3" of an enemy unit, this model can fight a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Shoulder Plate of Edassa`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 3+, that wound or mortal wound is ignored.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
]

// Units available to this Grand Alliance allegiance
export const Units: TUnits = [
  ...LegacyBretonnianUnits,
  ...LegacyDuardinUnits,
  ...LegacyDwarfUnits,
  ...LegacyEldritchUnits,
  ...LegacyEmpireUnits,
  ...LegacyHighElvesUnits,
  ...LegacyOrderUnits,
  ...LegacySwifthawkAgentUnits,
  ...LegacyWoodElvesUnits,
  ...MonstrousArcanumOrder,
  ...OrderUnits,
]

export const Battalions: TBattalions = [
  {
    name: `Dragonlord Host`,
    effects: [
      {
        name: `Martial Pride`,
        desc: `Once per battle, in any of your hero phases, the Dragonlord Hosts's Dragonlord, and each other unit from his battalion that is within 8" of him, can make a move as if it were the movement phase (models cannot run as part of this move). If, after a unit moves, there are any enemy units within 12" of it, roll a D6; on a 4+ that unit can then attempt to charge as if it were the charge phase. On a 4+ the Dragonlord can instead choose to attack with its Dragonfire as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
