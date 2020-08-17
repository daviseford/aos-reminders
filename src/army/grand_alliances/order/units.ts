import { TUnits } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION,
} from 'types/phases'
import { LegacyBretonnianUnits } from './subfactions/bretonnia'
import { LegacyDwarfUnits } from './subfactions/dwarfs'
import { LegacyEldritchUnits } from './subfactions/eldritch'
import { LegacyOrderUnits } from './subfactions/misc_legacy_order'
import { MonstrousArcanumOrder } from './subfactions/monstrous_arcanum'
import { LegacySwifthawkAgentUnits } from './subfactions/swifthawk_agents'

export const APPRENTICE_RUNESMITH = {
  name: `Apprentice Runesmith`,
  effects: [
    {
      name: `Overworked`,
      desc: `Whilst within 5" of a Runelord on Anvil of Doom, this model's Forging Tongs have an Attacks characteristic of 3.`,
      when: [COMBAT_PHASE],
    },
    {
      name: `Enthusiastic Young Assistant`,
      desc: `This model can attempt to unbind one spell in each enemy hero phase as if he were a wizard.`,
      when: [HERO_PHASE],
    },
  ],
}

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
        when: [WOUND_ALLOCATION],
      },
    ],
  },
]

// Units available to this Grand Alliance allegiance
export const Units: TUnits = [
  ...OrderUnits,
  ...MonstrousArcanumOrder,
  ...LegacyBretonnianUnits,
  ...LegacyDwarfUnits,
  ...LegacyEldritchUnits,
  ...LegacyOrderUnits,
  ...LegacySwifthawkAgentUnits,
]
