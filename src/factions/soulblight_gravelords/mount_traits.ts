import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const MountTraits = {
  // // Avengorii Dynasty (Cursed Mutations)
  // 'Maddening Hunger (Cursed Mutation)': {
  //   effects: [
  //     {
  //       name: `Maddening Hunger (Cursed Mutation)`,
  //       desc: `Once per turn, at the start of the combat phase, you can pick 1 enemy model with a Wounds characteristic of 1 that is within 3" of this model. If you do so, that enemy model is slain and you can heal 1 wound allocated to this model.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Urges of Atrocity (Cursed Mutation)': {
  //   effects: [
  //     {
  //       name: `Urges of Atrocity (Cursed Mutation)`,
  //       desc: `Once per battle, this model can run and still charge later in the same turn.`,
  //       when: [MOVEMENT_PHASE, CHARGE_PHASE],
  //     },
  //   ],
  // },
  // 'Nullblood Construct (Cursed Mutation)': {
  //   effects: [
  //     {
  //       name: `Nullblood Construct (Cursed Mutation)`,
  //       desc: `Reroll successful casting rolls for enemy WIZARDS within 9" of this model.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },

  // 'Locus of Death': {
  //   effects: [
  //     {
  //       name: `Locus of Death`,
  //       desc: `When you use the Deathly Invocation ability, if you pick this unit as the HERO that determines the number of units affected by the ability, then you can add 1 to the number of units that are affected.`,
  //       when: [START_OF_HERO_PHASE],
  //       rule_sources: [rule_sources.WHITE_DWARF_DECEMBER_2021],
  //     },
  //   ],
  // },
  // 'Foetid Miasma': {
  //   effects: [
  //     {
  //       name: `Foetid Miasma`,
  //       desc: `When this unit attacks with its Pestilential Breath, you can reroll the dice that determines the Damage characteristic for that attack.`,
  //       when: [SHOOTING_PHASE],
  //       rule_sources: [rule_sources.WHITE_DWARF_DECEMBER_2021],
  //     },
  //   ],
  // },
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
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')
