import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { BATTLESHOCK_PHASE, END_OF_MOVEMENT_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const Scenery = {
  'Charnel Throne': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Defensible,
      {
        name: `Ruler of All He Surveys`,
        desc: `If you use the Summon Men-at-arms or Summon Imperial Guard command ability and the model you pick to issue the command is within 1" of this terrain feature, you can do so without a command point being spent.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_JANUARY_2021,
          rule_sources.ERRATA_JULY_2021,
        ],
      },
      {
        name: `Ghoulish Landmark`,
        desc: `Add 1 to the Bravery characteristic of FLESH-EATER COURTS UNITS that are within 1" of any Charnel Thrones. Subtract 1 from the Bravery characteristic of other units that are within 1" of any Charnel Thrones.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_FLESH_EATER_COURTS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Scenery, 'scenery')
