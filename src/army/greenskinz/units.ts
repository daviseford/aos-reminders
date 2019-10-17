import { TUnits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Orruk Warboss`,
    effects: [
      {
        name: `War Boar`,
        desc: `Some Orruk Warbosses ride to battle on War Boars; these models have Move 9" instead of 5" and gain the War Boar's Tusks attack.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Choppa Boss`,
        desc: `Orruk Warbosses can carve their way through even more foes when they wield a pair of Boss Choppas. These Bosses make 8 attacks instead of 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Great Waaagh! Banner`,
        desc: `An Orruk Warboss with a Great Waaagh! Banner gains the Totem keyword. You can re-roll all wound rolls of 1 for Orruk units from your army that are within 16" of a Great Waaagh! Banner when they attack in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boss Shield`,
        desc: `You can re-roll all failed save rolls for an Orruk Warboss with a Boss Shield.`,
        when: [DURING_GAME],
      },
      {
        name: `Waaagh!`,
        desc: `If an Orruk Warboss uses this ability, then all Orruk units from your army that are within 12" when they attack in your next combat phase are frenzied. All models in these units make 1 extra attack with all of their melee weapons.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []
