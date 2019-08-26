import {
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'
import { TAbilities } from 'types/army'

const Abilities: TAbilities = [
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
]

export default Abilities
