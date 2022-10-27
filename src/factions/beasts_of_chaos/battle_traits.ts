import { tagAs } from 'factions/metatagger'
import { BEASTS_OF_CHAOS } from 'meta/factions'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  TURN_TWO_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [BEASTS_OF_CHAOS]: {
    effects: [
      {
        name: `Brayherd Ambush`,
        desc: `Instead of setting up a BRAYHERD unit on the battlefield, you can place it to one side and say that it is set up in ambush as a reserve unit. You can set up one reserve unit in ambush for each BEASTS OF CHAOS unit you have set up on the battlefield.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Brayherd Ambush`,
        desc: `At the end of your first movement phase, you must set up all friendly reserve units that are in ambush on the battlefield, wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any reserve units that cannot be set up are slain.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Creatures of the Storm`,
        desc: `At the start of your hero phase, roll a D6. Each friendly THUNDERSCORN unit more than 3" from any enemy units can move a distance in inches equal to the roll, but cannot move within 3" of any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bloodgorge`,
        desc: `At the end of the combat phase, if any attacks made by a WARHERD unit in that combat phase destroyed any enemy units, heal D3 wounds allocated to that WARHERD unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Primordial Call`,
        desc: `You can summon units of BEASTS OF CHAOS to the battlefield if you collect enough Primordial Call points. At the start of your hero phase, you receive 1 Primordial Call point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Primordial Call`,
        desc: `In your hero phase you can choose one friendly BEASTS OF CHAOS HERO within 3" of the HERDSTONE you set up at the start of the battle and say that they will enact a savage blood ritual. If you do so, pick a friendly BEASTS OF CHAOS unit within 3" of the HERDSTONE. That unit suffers D3 mortal wounds. For each mortal wound inflicted on that unit, you receive 1 Primordial Call point.`,
        when: [HERO_PHASE],
      },
      {
        name: `Primordial Call`,
        desc: `If you have 3 or more Primordial Call points at the end of your movement phase, you can summon one or more units from the following list onto the battlefield, and add them to your army. Each unit you summon costs a number of Primordial Call points, as shown on the list, and you can only summon a unit if you have enough Primordial Call points remaining to pay its cost. Summoned units must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of Primordial Call points you have available immediately after it has been set up.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Primordial Call`,
        desc: `Summoning Costs:
                1 Chimera -                       10 PP
                1 Ghorgon -                       10 PP
                3 Tzaangor Skyfires -             10 PP
                1 Chaos Gargant -                  9 PP
                1 Cygor -                          9 PP
               10 Tzaangors -                      9 PP
                3 Bullgors -                       8 PP
                1 Jabberslythe -                   8 PP
                3 Dragon Ogors -                   7 PP
                3 Tzaangor Enlightened w/ Discs -  7 PP
               10 Bestigors -                      6 PP
                1 Cockatrice -                     5 PP
                3 Tzaangor Enlightened -           5 PP
                5 Centigors -                      4 PP
               10 Chaos Warhounds -                4 PP
               10 Gors -                           4 PP
               10 Ungor Raiders -                  4 PP
                1 Chaos Spawn -                    3 PP
                1 Tuskgor Chariot -                3 PP
                1 Razorgor -                       3 PP
               10 Ungors -                         3 PP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Gor Battle Fury`,
        desc: `You can reroll charge rolls for friendly Gor units if they were in reserve and have been set up this turn.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Warherd Charge`,
        desc: `After a friendly Warherd unit finishes a charge, select 1 enemy unit within 1". Roll a D6, adding 2 if the Warherd unit is a hero or has 3+ models. On a 4+ the target suffers D3 mortal wounds at the end of the phase.`,
        when: [CHARGE_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
      {
        name: `Raging Storm`,
        desc: `Roll a D6 for each friendly Thunderscorn unit on the battlefield, adding 2 if the Thunderscorn unit is a hero or unit of 3+ models. On a 4+, you can heal 1 wound allocated to that unit.
               Roll a D6 for each enemy unit within 1" of any friendly Thunderscorn units, adding 2 if the Thunderscorn unit is a hero or unit of 3+ models. On a 4+, the enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
  // Allherd Greatfray
  'Bestial Might': {
    effects: [
      {
        name: `Bestial Might`,
        desc: `Subtract 1 from battleshock rolls made for ALLHERD units in the battleshock phase if they were picked to fight in the combat phase of the same turn.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Gavespawn Greatfray
  'Gift of Morghur': {
    effects: [
      {
        name: `Gift of Morghur`,
        desc: `If a friendly GAVESPAWN HERO is slain, roll a D6 before removing the model. On a 2+ one CHAOS SPAWN is added to your army. Set up the CHAOS SPAWN anywhere on the battlefield within 6" of the slain HERO. If the HERO had the KHORNE, NURGLE, SLAANESH or TZEENTCH keyword, the same keyword must be chosen for the CHAOS SPAWN . If they did not, you cannot use the Cursed of the Dark Gods ability to choose a keyword for that CHAOS SPAWN .`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Darkwalkers Greatfray
  Shadowbeasts: {
    effects: [
      {
        name: `Shadowbeasts`,
        desc: `WARHERD and THUNDERSCORN units in a DARKWALKERS army are considered to have the BRAYHERD keyword for the purposes of the Brayherd Ambush battle trait.`,
        when: [DURING_GAME],
      },
      {
        name: `Shadowbeasts`,
        desc: `Up to half (rounding up) of the reserve units that are set up in ambush can arrive in your second movement phase instead of your first movement phase.`,
        when: [TURN_TWO_MOVEMENT_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `In the Shadow of the Herdstone`,
        desc: `Pick 1 enemy unit within 9" of your Herdstone. You complete this battle tactic if that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
      {
        name: `Fury of the Wild`,
        desc: `You can pick this tactic only in your first turn. You complete this battle tactic if the model picked to be your general and two or more other friendly BEASTS OF CHAOS units are within 3" of an enemy unit at the end of this turn.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
      {
        name: `Wrath of the Warped Wilds`,
        desc: `Pick 1 objective controlled by your opponent. You complete this battle tactic at the end of the turn if you control that objective and it is contested by any models in your army that were summoned with the Primordial Call battle trait.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
    ],
  },

  'Monstrous Rampages': {
    effects: [
      {
        name: `Primal Roar`,
        desc: `Roll a D6. On a 3+, you receive 1 primordial call point.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [
          rule_sources.WHITE_DWARF_FEBRUARY_2022,
          meta_rule_sources.ERRATA_BATTLESCROLL_OCTOBER_2022,
        ],
      },
      {
        name: `Feast on Flesh`,
        desc: `Only a GHORGON can be picked to carry out this monstrous rampage, and the same unit can only carry out this monstrous rampage once per battle. Improve the Rend characterisc of this model's melee weapons by 1 until the end of the following combat phase. In addition, until the end of the following combat phase, each time an enemy model is slain by an attack made by this model, this model heals a number of wounds equal to the Wounds characterisc of that slain model.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
      {
        name: `Devour Spell`,
        desc: `Only a CYGOR can be picked to carry out this monstrous rampage. Pick 1 endless spell within 6" of this model and roll 2D6. If the roll exceeds the casting value of the spell that summoned that endless spell, that endless spell IS dispelled and this model heals a number of wounds equal to the 2D6 roll.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
      {
        name: `Entropic Miasma`,
        desc: `Only a JABBERSLYTHE can be picked to carry out this monstrous rampage. Pick 1 enemy HERO within 3" of this model and roll a dice. On a 1, nothing happens. On a 2-5, worsen the Save characteristic of that HERO by 1 (to a minimum of 6+) until the end of the following combat phase. On a 6, worsen the Save characteristic of that HERO by 2 (to a minimum of 6+) until the end of he following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
      {
        name: `Thricefold Savagery`,
        desc: `Only a CHIMERA can be picked to carry out this monstrous rampage. Until the end of the following combat phase, add 1 to the Attacks characteristic of this model's melee weapons, but all attacks made with this model's melee weapons must target the same enemy unit.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_FEBRUARY_2022],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
