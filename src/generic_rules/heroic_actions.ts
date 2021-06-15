import { TEntry } from 'types/data'
import { START_OF_HERO_PHASE } from 'types/phases'

const GenericHeroicActions: TEntry[] = [
  {
    name: 'Heroic Leadership',
    effects: [
      {
        name: `Heroic Leadership`,
        desc: `Pick 1 friendly HERO and roll a dice. Add 2 to the roll if your general has been slain. On a 4+, you receive 1 command point that can only be spent during that turn to allow that HERO to issue a command.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Heroic Willpower',
    effects: [
      {
        name: `Heroic Willpower`,
        desc: `Pick 1 friendly HERO that is not a Wizard. If it is the enemy hero phase, that HERO can attempt to unbind 1 spell in that phase as if they were a Wizard. If it is your hero phase, that HERO can attempt to dispel 1 endless spell in that phase as if they were a Wizard (you can still only attempt to unbind or dispel the same spell or endless spell once in the same phase).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Their Finest Hour',
    effects: [
      {
        name: `Their Finest Hour`,
        desc: `Pick 1 friendly HERO. Add 1 to wound rolls for attacks made by that HERO until the end of that turn, and add 1 to save rolls for attacks that target that HERO until the end of that turn. You cannot carry out this heroic action with the same HERO more than once in the same battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: 'Heroic Recovery',
    effects: [
      {
        name: `Heroic Recovery`,
        desc: `Pick 1 friendly HERO and make a heroic recovery roll by rolling 2D6. If the roll is less than that Hero's Bravery characteristic, you can heal up to D3 wounds allocated to that HERO. If the roll is equal to that Hero's Bravery characteristic, you can heal 1 wound allocated to that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default GenericHeroicActions
