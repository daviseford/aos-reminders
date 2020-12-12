import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_TURN,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandTraits = {
  Spellmaster: {
    effects: [
      {
        name: `Spellmaster`,
        desc: `Once in each of your hero phases, you can reroll 1 failed casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Loremaster - Scinari': {
    effects: [
      {
        name: `Loremaster - Scinari`,
        desc: `The general knows 1 extra spell from the Lore of Hysh.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Warmaster: {
    effects: [
      {
        name: `Warmaster`,
        desc: `If your general is a part of your army and on the battlefield, roll a D6. On a 4+  you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Majestic: {
    effects: [
      {
        name: `Majestic`,
        desc: `Add 1 to the Bravery characteristic for friendly LUMINETH REALM-LORDS wholly within 12" of this general. Subtract 1 from the Bravery characteristic for enemy units within 18" of this general.`,
        when: [DURING_TURN],
      },
    ],
  },
  Enduring: {
    effects: [
      {
        name: `Enduring`,
        desc: `Add 3 to the general's wound characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Loremaster - Alarith': {
    effects: [
      {
        name: `Loremaster - Alarith`,
        desc: `If this general is a WIZARD, they know 1 extra spell from the Lore of the High Peaks.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Almighty Blow': {
    effects: [
      {
        name: `Almighty Blow`,
        desc: `Instead of piling in and attacking, you can say you will unleash a single mighty blow. If you do so, pick one enemy unit with 1" of this general and roll 1 dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Goading Arrogance': {
    effects: [
      {
        name: `Goading Arrogance`,
        desc: `You can pick 1 enemy HERO within 6" of this general. That enemy HERO can only target this general in that phase. In addition, you can add 1 to hit rolls for attacks that target that enemy HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Strike in Unison': {
    effects: [
      {
        name: `Strike in Unison`,
        desc: `You can use this command ability in your shooting phase or in the combat phase. If you do so, pick 1 friendly ILIATHA VANARI unit with 2 or more models. You can reroll hit rolls of 1 for that unit until the end of that phase.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Fast Learner': {
    effects: [
      {
        name: `Fast Learner`,
        desc: `This general can attempt to unbind 1 extra spell in the enemy hero phase. In addition, the second time that this general attempts to unbind a spell in the same enemy hero phase, you can reroll the unbinding roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
