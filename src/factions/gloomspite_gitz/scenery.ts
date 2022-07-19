import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import meta_rule_sources from 'meta/rule_sources'
import { BATTLESHOCK_PHASE, DURING_GAME, END_OF_TURN } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Bad Moon Loonshrine': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      {
        name: `Defensible`,
        desc: `This terrain feature is a defensible terrain feature that can be garrisoned by up to 30 models.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_JULY_2021],
      },
      {
        name: `Loonatic Courage`,
        desc: `Do not take battleshock tests for GLOOMSPITE GITZ units wholly within 12" of this terrain feature.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_GLOOMSPITE_GITZ,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_JULY_2021,
        ],
      },
      {
        name: `Moonclan Lairs`,
        desc: `At the end of each of your turns, you can pick 1 friendly STABBAS or SHOOTAS unit that has been destroyed. If your general has the Spiderfang keyword, you must pick 1 friendly SPIDER RIDERS unit that has been destroyed instead. If your general has the SQUIG keyword, you must pick 1 friendly SQUIG HERD, SQUIG HOPPERS or BOINGROT BOUNDERZ unit that has been destroyed instead. If your general has the TROGGOTH keyword, you must pick 1 friendly TROGGOTH unit with a Wounds characteristic of 5 or less that has been destroyed instead. After you pick a unit that has been destroyed, roll a dice. On a 4+, a new replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. Set up that unit wholly within 12" of a Bad Moon Loonshrine in your army and more than 3" from all enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [END_OF_TURN],
        rule_sources: [
          rule_sources.BATTLETOME_GLOOMSPITE_GITZ,
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_JULY_2021,
        ],
      },
      {
        name: `Effigy of Da Bad Moon`,
        desc: `GLOOMSPITE GITZ units are affected by the light of the Bad Moon while they are wholly within 12" of this terrain feature.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_JULY_2022],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')
