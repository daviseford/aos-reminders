import { TTraits } from 'types/army'
import { DURING_GAME, DURING_TURN, HERO_PHASE } from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Spellmaster`,
    effects: [
      {
        name: `Spellmaster`,
        desc: `Once in each of your hero phases, you can reroll 1 failed casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Loremaster - Scinari`,
    effects: [
      {
        name: `Loremaster - Scinari`,
        desc: `The general knows 1 extra spell from the Lore of Hysh.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warmaster`,
    effects: [
      {
        name: `Warmaster`,
        desc: `If your general is a part of your army and on the battlefield, roll a D6. On a 4+  you receive 1 extra command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Majestic`,
    effects: [
      {
        name: `Majestic`,
        desc: `Add 1 to the Bravery characteristic for friendly LUMINETH REALM-LORDS wholly within 12" of this general. Subtract 1 from the Bravery characteristic for enemy units within 18" of this general.`,
        when: [DURING_TURN],
      },
    ],
  },
  {
    name: `Enduring`,
    effects: [
      {
        name: `Enduring`,
        desc: `Add 3 to the general's wound characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Loremaster - Alarith`,
    effects: [
      {
        name: `Loremaster - Alarith`,
        desc: `If this general is a WIZARD, they know 1 extra spell from the Lore of the High Peaks.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits
