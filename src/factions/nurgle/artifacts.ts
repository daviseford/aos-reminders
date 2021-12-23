import { keyPicker, tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import spells from './spells'

const Artifacts = {
  'The Splithorn Helm': {
    effects: [
      {
        name: `The Splithorn Helm`,
        desc: `The bearer has a Disgustingly Resilient ward of 4+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Muttergrub: {
    mandatory: {
      spells: [keyPicker(spells, ['Gift of Disease'])],
    },
    effects: [
      {
        name: `Muttergrub`,
        desc: `The bearer can attempt to cast the Gift of Disease spell (pg 66) in your hero phase in the same manner as a WIZARD. If the bearer is a WIZARD, they know the Gift of Disease spell in addition to the spell you can normally pick for them from the Lore of Malignance, and you can add 1 to the casting roll when they attempt to cast Gift of Disease.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Rustfang: {
    effects: [
      {
        name: `Rustfang`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer. Subtract 1 from save rolls for attacks that target that HERO for the rest of the battle.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Flesh Peeler': {
    effects: [
      {
        name: `Flesh Peeler`,
        desc: `In your hero phase, roll a dice for each enemy unit that is within 7" of the bearer. On a 4+, give that unit 1 disease point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Fecund Flask': {
    effects: [
      {
        name: `The Fecund Flask`,
        desc: `Once per battle, at the start of your hero phase, you can say the bearer will drink from the Fecund Flask. If you do so, roll a dice. On a 2+, heal all wounds allocated to the bearer. On a 1, the bearer is slain. If the bearer is slain, before they are removed from play, you can add 1 BEASTS OF NURGLE unit that has 1 model to your army and set it up within If of the bearer. The BEASTS OF NURGLE unit can only be set up within 3" of an enemy unit if the bearer was within 3" of that enemy unit when they were slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Noxious Nexus': {
    effects: [
      {
        name: `Noxious Nexus`,
        desc: `The bearer counts as 2 units instead of 1 for the purposes of the Diseased battle trait.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Nurgle's Nail": {
    effects: [
      {
        name: `Nurgle's Nail`,
        desc: `Pick one of the bearer's melee weapons. Attacks made with that weapon inflict 1 disease point on the target unit on an unmodified hit roll of 5 or 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Bountiful Swarm': {
    effects: [
      {
        name: `The Bountiful Swarm`,
        desc: `Once per battle, at the start of your hero phase, pick 1 enemy model within 3" of the bearer and then roll a dice. If the roll is greater than that model's Wounds characteristic, it is slain. If that model is slain and had a Wounds characteristic of 4 or more, before it is removed from play, you can add 1 BEASTS OF NURGLE unit that has 1 model to your army and set it up within 1" of the slain model. The BEASTS OF NURGLE unit can only be set up within 3" of an enemy unit if the model was within 3" of that enemy unit when it was slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Witherstave': {
    effects: [
      {
        name: `The Witherstave`,
        desc: `Add 1 to disease rolls for enemy units that are within 7" of the bearer.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Tome of a Thousand Poxes': {
    mandatory: {
      spells: [keyPicker(spells, ['Gift of Disease'])],
    },
    effects: [
      {
        name: `Tome of a Thousand Poxes`,
        desc: `The bearer can attempt to cast the Gift of Disease spell (pg 66) in your hero phase in the same manner as a WIZARD. If the bearer is a WIZARD, they know the Gift of Disease spell in addition to the spell you can normally pick for them from the Lore of Virulence, and you can add 1 to the casting roll when they attempt to cast Gift of Disease.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Endless Gift': {
    effects: [
      {
        name: `The Endless Gift`,
        desc: `The bearer is always treated as being within 14" of a Locus of Fecundity.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Foetid Shroud': {
    effects: [
      {
        name: `The Foetid Shroud`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO that is not a MONSTER and is within 3" of the bearer. Subtract 1 from hit rolls for attacks made by that HERO in that phase, and add 1 to hit rolls for attacks that target that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Eye of Nurgle': {
    effects: [
      {
        name: `The Eye of Nurgle`,
        desc: `Once per battle, at the start of your hero phase, if there are any enerny units within 14" of the bearer that have any disease points, you can roll 2D6. If the roll is 7, the closest enemy model to the bearer that is in a unit that has any disease points is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Shield of Growths': {
    effects: [
      {
        name: `The Shield of Growths`,
        desc: `You can reroll save rolls for attacks that target the bearer if the save roll is equal to or less than the number of wounds allocated to the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
