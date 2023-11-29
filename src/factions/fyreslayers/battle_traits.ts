import { tagAs } from 'factions/metatagger'
import { FYRESLAYERS } from 'meta/factions'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const BattleTraits = {
  [FYRESLAYERS]: {
    effects: [
      {
        name: `Heroic Action - Blaze of Fury`,
        desc: `At the start of your hero phase, you can carry out this heroic action with a friendly FYRESLAYERS HERO instead of any other heroic action you can carry out with that HERO. Pick 1 friendly FYRESLAYERS HERO. Until the end of your turn, the enhanced effect of the ur-gold rune that is activated in this hero phase applies to that HERO regardless of the activation roll. You cannot carry out this heroic action with the same HERO more than once in the same battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Lofnir Drothkeepers': {
    effects: [
      {
        name: `Daring Tamers`,
        desc: `The strike-last effect applies to enemy MONSTER units while they are within 3" of 2 or more friendly VULKYN FLAMESEEKERS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Honourbound Drothmasters`,
        desc: `Friendly VULKYN FLAMESEEKERS units have the Battleline battlefield role. In addition, for each VULKYN FLAMESEEKERS unit included in your army, you can include 1 Auric Runeson on Magmadroth as a Battleline unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Flame-filled Beasts`,
        desc: `You can pick up to 3 LOFNIR DROTHKEEPERS units in your army to have different mount traits instead of 1.`,
        when: [DURING_GAME],
      },
      {
        name: `Skilled Drothwranglers`,
        desc: `Once per turn, in your movement phase, you can pick 1 friendly VULKYN FLAMESEEKERS unit wholly within 6" of a friendly MAGMADROTH that has not yet moved in that phase and say that it will hitch a lift on that MAGMADROTH. If you do so, after you have moved that MAGMADROTH, instead of making a move with that unit, remove it from the battlefield and set it up again on the battlefield wholly within 6" of that MAGMADROTH and more than 3" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Protective Family`,
        desc: `While a friendly VULKYN FLAMESEEKERS Kyndledroth is within 1" of a friendly MAGMADROTH, that VULKYN FLAMESEEKERS unit has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },

  'Ur-Gold Runes': {
    effects: [
      {
        name: `Ur-Gold Runes`,
        desc: `At the start of your hero phase, you can activate of the following 6 types of ur-gold rune. To do so, state which rune will be activated and make an activation roll by rolling a dice. On a 1-5, the standard effect applies. On a 6, the enhanced effect also applies. The effects last until the start of your next hero phase.
          
        Each ur-gold rune can only be activated once per battle, and no more than 1 rune can be activated at the same time. Once you have used a rune, you can choose a new one to activate in your next hero phase, but you cannot activate the same one again.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Rune of Fury`,
        desc: `Standard effect: Add 1 to hit rolls for attacks made with melee weapons by friendly FYRESLAYERS units.

        Enhanced effect: Add 1 to the Attacks characteristic of melee weapons used by friendly FYRESLAYERS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Rune of Searing Heat`,
        desc: `Standard effect: If the unmodified wound roll for attack made by a friendly FYRESLAYERS unit is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.

        Enhanced effect: When this rune is activated, roll a dice for each enemy unit within of any friendly FYRESLAYERS units. On a 2+, that enemy unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rune of Awakened Steel`,
        desc: `Standard effect: Improve the Rend characteristic of melee weapons used by friendly FYRESLAYERS units by 1.

        Enhanced effect: Improve the Rend characteristic of melee weapons used by friendly FYRESLAYERS units by a further 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Rune of Fiery Determination`,
        desc: `Standard effect: Friendly FYRESLAYERS units have a ward of 6+.

        Enhanced effect: Friendly FYRESLAYERS HEROES have a ward of 5+.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Rune of Relentless Zeal`,
        desc: `Standard effect: Add 2" to the Move characteristic of friendly FYRESLAYERS units.

        Enhanced effect: Add 2 to charge rolls for friendly FYRESLAYERS units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Rune of Farsight`,
        desc: `Standard effect: Add 1 to hit rolls for attacks made with Fyresteel Throwing Axes by friendly FYRESLAYERS units.
          
        Enhanced effect: Add 1 to wound rolls for attacks made with Fyresteel Throwing Axes by friendly FYRESLAYERS units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
