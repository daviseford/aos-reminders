import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
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
        desc: `If the damage inflicted by an attack, spell or ability that targets or affects this model is greater than 1, change it to 1. In addition, if a spell or ability would slay this model, this model suffers 1 mortal wound instead.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
      {
        name: `Avatar of Grimnir`,
        desc: `If this model is included in your army, it cannot be set up in reserve (it must be set up on the battlefield), and you cannot use spells or abilities on this model that would allow you to set it up again after the battle has begun.`,
        when: [START_OF_GAME],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
      {
        name: `Krag Blackhammer's Master Rune`,
        desc: `You can reroll hit rolls and wound rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack inflicts D6 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
      {
        name: `Unstoppable Battle Fury`,
        desc: `At the end of the combat phase, if this model is within 3" of an enemy unit, this model can fight again.`,
        when: [END_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
      {
        name: `Shoulder Plate of Edassa`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 3+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.CROSS_FACTION_HEROES_JULY_2022],
      },
    ],
  },
  "Fjori's Flamebearers": {
    effects: [
      {
        name: `Toe to Toe`,
        desc: `Enemy MONSTERS within 3" of any units in this regiment of renown cannot contest objectives.`,
        when: [DURING_GAME],
      },
      {
        name: `Defiance of Grimnir`,
        desc: `Units in this regiment of renown cannot be picked when your opponent carries out a monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
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
