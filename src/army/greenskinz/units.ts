import { TUnits } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Orruk Warboss on Wyvern`,
    effects: [
      {
        name: `Agonising Venom`,
        desc: `If an enemy model suffers a wound from a Wyvern's Barbed, Venemous tail, but is not slain, roll a D6 at the end of the turn. On a 4+, that model suffers a mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Choppa Boss`,
        desc: `Orruk Warbosses can carve their way through even more foes when they wield a pair of Boss Choppas. These Bosses make 8 attacks instead of 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boss Shield`,
        desc: `You can re-roll all failed save rolls for an Orruk Warboss on Wyvern with a Boss Shield.`,
        when: [DURING_GAME],
      },

      {
        name: `Waaagh!`,
        desc: `You can use this command ability in the combat phase. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly Orruk units while they are wholly within 18" of a friendly model with this command ability. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
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
        desc: `An Orruk Warboss with a Great Waaagh! Banner gains the Totem keyword. You can re-roll wound rolls of 1 for attacks made with melee weapons by friendly Orruk units while they are wholly within 16" of a friendly Orruk Warboss with a Great Waaagh! Banner.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boss Shield`,
        desc: `You can re-roll all failed save rolls for an Orruk Warboss with a Boss Shield.`,
        when: [DURING_GAME],
      },
      {
        name: `Waaagh!`,
        desc: `You can use this command ability in the combat phase. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly Orruk units while they are wholly within 18" of a friendly model with this command ability. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []
