import { TTraits } from 'types/army'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, DURING_GAME } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Squirmy Warpaint`,
    effects: [
      {
        name: `Squirmy Warpaint`,
        desc: `Your General ignores mortal wounds on a roll of 4+ instead of 6+ for Warpaint.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Prophet of da Waaagh!`,
    effects: [
      {
        name: `Prophet of da Waaagh!`,
        desc: `While your general is alive, you can re-roll the first failed battleshock test for a friendly Bonesplitterz unit in each battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Great Hunter`,
    effects: [
      {
        name: `Great Hunter`,
        desc: `If your general kills a Monster in the combat phase, they can immediately pile in and attack again.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Waaagh!-monger`,
    effects: [
      {
        name: `Waaagh!-monger`,
        desc: `All friendly Bonesplitterz units add 1 to their charge rolls if they are within 10" of your general when they charge.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Killa Instinkt`,
    effects: [
      {
        name: `Killa Instinkt`,
        desc: `Each time you roll a wound roll of 6+ for your general, that attack is resolved with a Rend of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Monster Killa`,
    effects: [
      {
        name: `Monster Killa`,
        desc: `Instead of rolling on the Monster Hunter table, your general can always choose a result.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default CommandTraits
