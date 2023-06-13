import { tagAs } from 'factions/metatagger'
import { DURING_GAME, HERO_PHASE, SAVES_PHASE, SHOOTING_PHASE, START_OF_ROUND } from 'types/phases'

const CommandTraits = {
  'Show of Superiority': {
    effects: [
      {
        name: `Show of Superiority`,
        desc: `While this general is on the battlefield, roll a dice before your opponent spends any command points to use a command ability. On a 5+, your opponent must spend 2 command points to issue the command instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Crafted from Beast-bone': {
    effects: [
      {
        name: `Crafted from Beast-bone`,
        desc: `After this general has fought for the first time, at the start of each battle round, add 1 to the Attacks characteristic of this general's weapons for the rest of the battle. This effect is cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Aura of Sterility': {
    effects: [
      {
        name: `Aura of Sterility`,
        desc: `Subtract 1 from hit rolls and wound rolls for attacks made with missile weapons that target friendly OSSIARCH BONEREAPERS units wholly within 12" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Diversionary Tactics': {
    effects: [
      {
        name: `Diversionary Tactics`,
        desc: `Subtract 3 from charge rolls for enemy units that attempt a charge within 12" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Dark Acolyte': {
    effects: [
      {
        name: `Dark Acolyte`,
        desc: `WIZARD only. In your hero phase, if the first spell this general attempts to cast in that phase is successfully cast, that spell cannot be unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mighty Archaeossian': {
    effects: [
      {
        name: `Mighty Archaeossian`,
        desc: `Ignore negative modifiers to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
