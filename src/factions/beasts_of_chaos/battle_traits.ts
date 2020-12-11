import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  TURN_TWO_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  'Beasts Of Chaos': {
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
                1 Tzaangor Enlightened -           5 PP
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
}

export default tagAs(BattleTraits, 'battle_trait')
