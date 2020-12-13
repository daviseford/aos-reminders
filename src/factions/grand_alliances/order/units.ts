import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { LegacyBretonnianUnits } from './unit_groups/bretonnia'
import { LegacyDuardinUnits } from './unit_groups/duardin'
import { LegacyDwarfUnits } from './unit_groups/dwarfs'
import { LegacyEldritchUnits } from './unit_groups/eldritch'
import { LegacyEmpireUnits } from './unit_groups/empire'
import { LegacyHighElvesUnits } from './unit_groups/high_elves'
import { LegacyOrderUnits } from './unit_groups/misc_order'
import { MonstrousArcanumOrder } from './unit_groups/monstrous_arcanum'
import { LegacySwifthawkAgentUnits } from './unit_groups/swifthawk_agents'
import { LegacyWoodElvesUnits } from './unit_groups/wood_elves'

const OrderUnits = {
  'Gotrek Gurnisson': {
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
}

export default tagAs(OrderUnits, 'unit')
