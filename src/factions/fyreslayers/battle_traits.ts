import { tagAs } from 'factions/metatagger'
import { FYRESLAYERS } from 'meta/factions'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Fyreslayers allegiance
  [FYRESLAYERS]: {
    effects: [
      {
        name: `Blaze of Fury`,
        desc: `At the start of your hero phase, you can carry out this heroic action with a friendly FYRESLAYERS HERO instead of any other heroic action you can carry out with that HERO.
        
        Pick 1 friendly FYRESLAYERS HERO. Until the end of your turn, the enhanced effect of the ur-gold rune that is activated in this hero phase applies to that HERO regardless of the activation roll. You cannot carry out this heroic action with the same HERO more than once in the same battle. `,
        when: [START_OF_HERO_PHASE],
      },
      // {
      //   name: `Magmic Invocations`,
      //   desc: `Magmic Invocations use the rules for invocations (core rules, 20.3).`,
      //   when: [DURING_GAME],
      // },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Settle a Grudge`,
        desc: `Each time a friendly unit is destroyed by wounds caused by an attack, make a note of the enemy unit that made that attack (in a 'Book of Grudges', if you wish). When you pick this battle tactic, pick 1 of those enemy units that is still on the battlefield. You complete this tactic if that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Beastslayer`,
        desc: `Pick 1 enemy MONSTER and 1 friendly HERO. You complete this tactic if that MONSTER is slain by wounds caused by attacks made by that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Grimnir Knows No Mercy`,
        desc: `You complete this tactic at the end of this turn if there are any friendly VULKITE BERZERKERS units on the battlefield and all of them are within 3" of any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `An Honourable Death`,
        desc: `Pick 1 friendly HERO. You complete this tactic if that friendly HERO is slain during this turn and any enemy models were also slain by wounds caused by attacks made by that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Seize by Force`,
        desc: `You can pick this tactic only if you control fewer objectives than your opponent. You complete this tactic if you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `An Ignominious Death`,
        desc: `Pick 1 enemy HERO. You complete this tactic if that enemy HERO is slain by wounds caused by an attack made with a Fyresteel Throwing Axe during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],

    'Ur-Gold Runes': {
      effects: [
        {
          name: `Ur-Gold Runes`,
          desc: `At the start of your hero phase, you can activate of the following 6 types ofur-gold rune. To do so, state which rune will be activated and make an activation roll by rolling a dice. On a 1-5, the standard effect applies. On a 6, the enhanced effect also applies. The effects last until the start of your next hero phase.
          
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
  },

  // // Vostarg
  // 'Vostarg (Lodge)': {
  //   effects: [
  //     {
  //       name: `Fearsome Surge`,
  //       desc: `If you declare a friendly VOSTARG unit will run in R1 movement phase, do not roll, instead add 6" automatically.`,
  //       when: [TURN_ONE_MOVEMENT_PHASE],
  //     },
  //     {
  //       name: `Fearsome Surge`,
  //       desc: `+1 to charge rolls for friendly VOSTARG units.`,
  //       when: [CHARGE_PHASE],
  //     },
  //   ],
  // },
  // // Greyfyrd
  // 'Greyfyrd (Lodge)': {
  //   effects: [
  //     {
  //       name: `Spoils of Victory`,
  //       desc: `2 additional artifacts of power for GREYFYRD HEROES in your army.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // // Hermdar
  // 'Hermdar (Lodge)': {
  //   effects: [
  //     {
  //       name: `Seize by Force`,
  //       desc: `HERMDAR units wholly within enemy territory or wholly within 12" of an objective do not take battleshock tests.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // // Lofnir
  // 'Lofnir (Lodge)': {
  //   effects: [
  //     {
  //       name: `Venerators of Vulcatrix`,
  //       desc: `Each MAGMADROTH in a LOFNIR army, instead of only 1, can be given a Magmadroth trait. In addition, if you are using the Contest of Generals battlepack or a Pitched Battles battlepack, you can include 1 additional BEHEMOTH in your army, as long as every BEHEMOTH in your army is a MAGMADROTH.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
}

export default tagAs(BattleTraits, 'battle_trait')
