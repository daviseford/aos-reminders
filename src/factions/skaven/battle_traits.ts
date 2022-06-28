import { tagAs } from 'factions/metatagger'
import { SKAVEN } from 'meta/factions'
import { COMBAT_PHASE } from 'types/phases'

const BattleTraits = {
  [SKAVEN]: {
    effects: [
      {
        name: `Lead From The Back`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons if the target is a friendly SKAVEN HERO that is not a MONSTER and is within 3" of any friendly SKAVEN units that have 3 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scurry Away`,
        desc: `In the combat phase, when you pick a friendly SKAVEN HERO that does not have a mount to fight, you can say that it will scurry away instead. If you do so, that HERO can retreat.`,
        when: [COMBAT_PHASE],
      },
      // {
      //   name: `Overwhelming Mass`,
      //   desc: `Add 1 to hit rolls for attacks made with melee weapons by SKAVENTIDE units while they have 20 or more models. In addition, add 1 to wound rolls for attacks made with melee weapons by SKAVENTIDE units while they have 30 or more models.`,
      //   when: [COMBAT_PHASE],
      // },
      {
        name: `Strength in Numbers`,
        desc: `Add 1" to the range of melee weapons used by friendly SKAVEN units for every 10 models in the attacking unit (to a maximum of 3").`,
        when: [COMBAT_PHASE],
      },
      // {
      //   name: `Hidden Weapon Teams`,
      //   desc: `When you select a WEAPON TEAM unit other than a WARP GRINDER to be part of your army, you can pick 1 friendly unit of CLANRATS or STORMVERMIN that has 10 or more models and is already part of your army to be the unit in which that WEAPON TEAM unit is hiding. Record this information on a piece of paper. Do not set up the WEAPON TEAM unit until it is revealed as described next. You can hide up to 1 WEAPON TEAM unit in a CLANRATS or STORMVERMIN unit for every 10 models in that CLANRATS or STORMVERMIN unit.`,
      //   when: [START_OF_SETUP],
      //   rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      // },
      // {
      //   name: `Hidden Weapon Teams`,
      //   desc: `At the start of your shooting phase, you can reveal 1 or more hidden WEAPON TEAM units. If you do so, set up each hidden WEAPON TEAM unit wholly within 3" of the unit it was hiding in and more than 3" from any enemy units. WEAPON TEAM units can shoot in the turn in which they are revealed as long as the unit they were hiding in did not run in the same turn (it could have retreated).`,
      //   when: [START_OF_SHOOTING_PHASE],
      //   rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      // },
      // {
      //   name: `Hidden Weapon Teams`,
      //   desc: `At the end of your charge phase, you can reveal 1 or more hidden WEAPON TEAM units that were hiding in a unit that made a charge move in that phase. If you do so, set up each hidden WEAPON TEAM unit wholly within 3" of the unit it was hiding in (it can be set up within 3" of any enemy units and can fight in the following combat phase).`,
      //   when: [END_OF_CHARGE_PHASE],
      //   rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      // },
      // {
      //   name: `Hidden Weapon Teams`,
      //   desc: `Hidden WEAPON TEAM units are destroyed if the unit they are hiding in is destroyed before they are revealed.`,
      //   when: [WOUND_ALLOCATION_PHASE],
      //   rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      // },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
