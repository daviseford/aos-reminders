import { TAbilities } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Abilities: TAbilities = [
  {
    name: `Waaagh Ability Table`,
    desc: `During the game you will gain bonuses based on the number of Waaagh points you have. If you spend the points you may lose access to abilities you previously had.`,
    when: [DURING_GAME],
  },
  {
    name: `Zog 'Em - 4+ points`,
    desc: `At the end of any phase, if any wound or mortal wounds have been inflicted in that phase on an ORRUK unit that is more than 9" away from any enemy units, that unit may move D6".`,
    when: [DURING_GAME],
  },
  {
    name: `Zap 'Em - 6+ points`,
    desc: `You can use the Waaagh Magic battle trait - Any time you cast you can use the Waaagh energy, lose D3 points to get +1 casting or lose D6 points for +2.`,
    when: [HERO_PHASE],
  },
  {
    name: `Get 'Em - 8+ points`,
    desc: `Add 1 to charge rolls for any ORRUK units.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Laugh at 'Em - 12+ points`,
    desc: `Roll a D6 when you take a wound or mortal wound, on a 6+ it is ignored.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Smash 'Em - 16+ points`,
    desc: `Add 1 to hit rolls for melee attacks made by ORRUK units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Bash 'Em - 20+ points`,
    desc: `Add 1 to wound rolls for melee attacks made by ORRUK units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Da Big Waaagh!!! - 24+ points`,
    desc: `The general can use Da Big Waaagh ability at start of combat phase Add 1 to the attack characteristics to all ORRUK units in the Waaagh army. 
    After the combat phase roll a D6, on 1 you lose all your Waaagh points, on a 2-5 you halve your Waaagh points, on a 6 you keep everything.`,
    when: [START_OF_COMBAT_PHASE],
    command_ability: true,
  },
  {
    name: `'Ere We Go, 'Ere We Go, 'Ere We Go!`,
    desc: `Choose 1 friendly ORRUK HERO. you receive 1 Waaagh! point for every 10 ORRUK models that are within 12" of that ORRUK HERO, or within 18" of that ORRUK HERO if they are the general or a Warchanter. You cannot use this command ability more than once per hero phase.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Waaagh Points Table`,
    desc: `During the game you will generate Waaagh points at certain points in the game. Your total can never exceed 30 points.

      - D6 points if your general is alive at the start of your hero phase, 6 if your general is Gordrakk.
      - 2 points for each Warchanter at the start of your hero phase.
      - 1 point for each Wurgogg Prophet or Wardokk at the start of your hero phase.
      - 1 point in your charge phase for each ORRUK unit with 10 or more models that made a charge move.
      - 1 point at the start of your combat phase for each ORRUK HERO within 3" of an enemy unit.
      - 1 point at the start of your combat phase for each ORRUK unit with 10 or more models within 3" of an enemy unit.`,
    when: [DURING_GAME],
  },
  {
    name: `Waaagh Points`,
    desc: `+1 point at the start of your combat phase for each ORRUK HERO within 3" of an enemy unit.
    +1 point at the start of your combat phase for each ORRUK unit with 10 or more models within 3" of an enemy unit.`,
    when: [START_OF_COMBAT_PHASE],
  },
  {
    name: `Waaagh Points`,
    desc: `+1 point in your charge phase for each ORRUK unit with 10 or more models that made a charge move.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Waaagh Points`,
    desc: `+D6 points if your general is alive at the start of your hero phase, 6 if your general is Gordrakk.
    +2 points for each Warchanter at the start of your hero phase.
    +1 point for each Wurgogg Prophet or Wardokk at the start of your hero phase.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities
