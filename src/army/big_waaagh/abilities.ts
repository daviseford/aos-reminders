import { DURING_GAME, HERO_PHASE, CHARGE_PHASE, COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

const Abilities: TAbilities = [
  {
    name: `Waagh Ability table`,
    desc: `During the game you will gain bonuses based on the number of Waagh points you have. If you spend the points you may lose access to abilities you previously had.`,
    when: [DURING_GAME],
  },
  {
    name: `Zap 'Em - 6+ points`,
    desc: `You can use the Waagh Magic battle trait - Any time you cast you can use the Waagh energy, lose D3 points to get +1 casting or lose D6 points for +2.`,
    when: [HERO_PHASE],
  },
  {
    name: `Get 'Em - 8+ points`,
    desc: `Add 1 to charge rolls for any orruk units.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Laugh at 'Em - 12+ points`,
    desc: `Roll a dice when you take damage, on a 6+ it's ignored.`,
    when: [DURING_GAME],
  },
  {
    name: `Smash 'Em - 16+ points`,
    desc: `Add 1 to hit rolls for melee attacks made by orruk units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Bash 'Em - 20+ points`,
    desc: `Add 1 to wound rolls for melee attacks made by orruk units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Waaagh!!!`,
    desc: `General can use Da Big Waagh ability at start of combat phase - Add 1 to the attack characteristics to all Orruk units in the waagh army. - After the combat phase roll a dice, on 1 you lose all your waagh points, on a 2-5 you halve your waagh points, on a 6 you keep everything.`,
    when: [START_OF_COMBAT_PHASE],
  },
  {
    name: `Waagh Points Table`,
    desc: `During the game you will generate Waagh points at certain points in the game. Your total can never exceed 30 points.

      D6 points if you general is alive at the start of your hero phase, 6 if your general is Gordrakk.
      2 points for each warchanter at the start of your hero phase.
      1 point for each wurgrogg prophet or wardokk at the start of your hero phase.
      1 point in your charge phase for each orruk unit with 10 or more models that made a charge move.
      1 point in the combat phase for each orruk hero within 3" of an enemy unit.
      1 point in the combat phase for each orruk unit with 10 or more models within 3" of an enemy unit.`,
    when: [DURING_GAME],
  },
]

export default Abilities
