import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, DURING_GAME, END_OF_MOVEMENT_PHASE, START_OF_SETUP } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Charnel Throne': {
    effects: [
      {
        name: `Set Up`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by 1 HERO with a Wounds characteristic of 8 or less.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Ruler of All He Surveys`,
        desc: `If you use the Summon Men-at-arms or Summon Imperial Guard command ability and the model you pick to issue the command is within 1" of this terrain feature, you can do so without a command point being spent.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JANUARY_2021,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
      {
        name: `Ghoulish Landmark`,
        desc: `Add 1 to the Bravery characteristic of FLESH-EATER COURTS UNITS that are within 1" of any Charnel Thrones. Subtract 1 from the Bravery characteristic of other units that are within 1" of any Charnel Thrones.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_FLESH_EATER_COURTS,
          rule_sources.ERRATA_FLESH_EATER_COURTS_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
