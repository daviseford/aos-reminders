import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Into the Jaws of Death': {
    effects: [
      {
        name: `Into the Jaws of Death`,
        desc: `At the end of the charge phase, you can carry out this monstrous rampage with a friendly LEGION OF NIGHT ZOMBIE DRAGON or LEGION OF NIGHT TERRORGHEIST instead of any other monstrous rampage you can carry out with that unit. Pick 1 enemy unit within 6" of this unit that made a charge move in this phase and roll 2D6. Add 3 to the roll if that enemy unit is within 1/2" of this unit. If the roll is greater than the unmodified charge roll for that charge move, this unit can attack with its Pestilential Breath or Death Shriek in this phase and must target that enemy unit.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Battle-crazed': {
    effects: [
      {
        name: `Battle-crazed`,
        desc: `At the end of the charge phase, you can carry out this monstrous rampage with a friendly KASTELAI MONSTER instead of any other monstrous rampage you can carry out with that MONSTER. Add 1 to wound rolls for attacks made with melee weapons by this unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Maddening Hunger': {
    effects: [
      {
        name: `Maddening Hunger`,
        desc: `At the end of the charge phase, you can carry out this monstrous rampage with a friendly AVENGORII MONSTER instead of any other monstrous rampage you can carry out with that MONSTER. Pick up to D3 different enemy models within 1" of this unit and roll a dice (roll separately for each model). If the roll is greater than that model's Wounds characteristic, it is slain.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Unstoppable Nightmare': {
    effects: [
      {
        name: `Unstoppable Nightmare`,
        desc: `At the end of the charge phase, you can carry out this monstrous rampage with a friendly AVENGORII MONSTER instead of any other monstrous rampage you can carry out with that MONSTER. Until the end of the following combat phase, the first time a different friendly AVENGORII unit within 6" of this unit is destroyed, this unit can fight immediately after the last slain model in the destroyed unit is removed from play.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')
