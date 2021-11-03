import { tagAs } from 'factions/metatagger'
import { SKAVEN } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [SKAVEN]: {
    effects: [
      {
        name: `Lead From The Back`,
        desc: `The Look Out, Sir! rule applies to an attack made with a melee weapon as well as an attack made with a missile weapon if the target of the attack is a SKAVENTIDE HERO that is not a MONSTER.`,
        when: [DURING_GAME],
      },
      {
        name: `Scurry Away`,
        desc: `In the combat phase, when you pick a friendly SKAVENTIDE HERO to fight with, you can say it is going to scurry away instead of making a pile-in move and then attacking. If you do so, that HERO must make a normal move, and must retreat.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Overwhelming Mass`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by SKAVENTIDE units while they have 20 or more models. In addition, add 1 to wound rolls for attacks made with melee weapons by SKAVENTIDE units while they have 30 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Strength in Numbers`,
        desc: `When a SKAVENTIDE unit takes a battleshock test, subtract 1 from the battleshock roll for every 10 models that are in the unit.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SKAVEN, rule_sources.ERRATA_SKAVEN_JULY_2021],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `When you select a WEAPON TEAM unit other than a WARP GRINDER to be part of your army, you can pick 1 friendly unit of CLANRATS or STORMVERMIN that has 10 or more models and is already part of your army to be the unit in which that WEAPON TEAM unit is hiding. Record this information on a piece of paper. Do not set up the WEAPON TEAM unit until it is revealed as described next. You can hide up to 1 WEAPON TEAM unit in a CLANRATS or STORMVERMIN unit for every 10 models in that CLANRATS or STORMVERMIN unit.`,
        when: [START_OF_SETUP],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `At the start of your shooting phase, you can reveal 1 or more hidden WEAPON TEAM units. If you do so, set up each hidden WEAPON TEAM unit wholly within 3" of the unit it was hiding in and more than 3" from any enemy units. WEAPON TEAM units can shoot in the turn in which they are revealed as long as the unit they were hiding in did not run in the same turn (it could have retreated).`,
        when: [START_OF_SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `At the end of your charge phase, you can reveal 1 or more hidden WEAPON TEAM units that were hiding in a unit that made a charge move in that phase. If you do so, set up each hidden WEAPON TEAM unit wholly within 3" of the unit it was hiding in (it can be set up within 3" of any enemy units and can fight in the following combat phase).`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Hidden Weapon Teams`,
        desc: `Hidden WEAPON TEAM units are destroyed if the unit they are hiding in is destroyed before they are revealed.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
