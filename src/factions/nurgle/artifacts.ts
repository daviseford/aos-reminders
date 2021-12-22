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
  // 'The Bileheart': {
  //   effects: [
  //     {
  //       name: `The Bileheart`,
  //       desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  'The Fecund Flask': {
    effects: [
      {
        name: `The Fecund Flask`,
        desc: `Once per battle, at the start of your hero phase, you can say the bearer will drink from the Fecund Flask. If you do so, roll a dice. On a 2+, heal all wounds allocated to the bearer. On a 1, the bearer is slain. If the bearer is slain, before they are removed from play, you can add 1 BEASTS OF NURGLE unit that has 1 model to your army and set it up within If of the bearer. The BEASTS OF NURGLE unit can only be set up within 3" of an enemy unit if the bearer was within 3" of that enemy unit when they were slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Daemon Artifacts
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
  // 'The Virulent Blade': {
  //   effects: [
  //     {
  //       name: `The Virulent Blade`,
  //       desc: `Pick one of the bearer's melee weapons to be the Virulent Blade. Add 1 to the damage characteristic for attacks made by this weapon for wound rolls of 5+.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'The Foetid Shroud': {
    effects: [
      {
        name: `The Foetid Shroud`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO that is not a MONSTER and is within 3" of the bearer. Subtract 1 from hit rolls for attacks made by that HERO in that phase, and add 1 to hit rolls for attacks that target that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // "Sublucus' Stenchplate": {
  //   effects: [
  //     {
  //       name: `Sublucus' Stenchplate`,
  //       desc: `Enemy units that are within 3" of the bearer at the end of their movement phase suffer D3 mortal wounds.`,
  //       when: [MOVEMENT_PHASE],
  //     },
  //   ],
  // },
  'The Eye of Nurgle': {
    effects: [
      {
        name: `The Eye of Nurgle`,
        desc: `Once per battle, at the start of your hero phase, if there are any enerny units within 14" of the bearer that have any disease points, you can roll 2D6. If the roll is 7, the closest enemy model to the bearer that is in a unit that has any disease points is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // 'The Carrion Dirge': {
  //   effects: [
  //     {
  //       name: `The Carrion Dirge`,
  //       desc: `Subtract 2 from the Bravery characteristic of enemy unit while they are within 12" of the bearer.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  'The Shield of Growths': {
    effects: [
      {
        name: `The Shield of Growths`,
        desc: `You can re-roll save rolls for attacks that target the bearer if the save roll is equal to or less than the number of wounds allocated to the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Mucktalon: {
  //   effects: [
  //     {
  //       name: `Mucktalon`,
  //       desc: `Add 1 to hit rolls for attacks made with this weapon if the target is a hero.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Cloak of Flies': {
  //   effects: [
  //     {
  //       name: `Cloak of Flies`,
  //       desc: `Subtract 1 from melee hit rolls made against the bearer.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Blotshell Bileplate': {
  //   effects: [
  //     {
  //       name: `Blotshell Bileplate`,
  //       desc: `You can reroll save rolls for attacks targeting the bearer.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // 'Rot-kraken Hide': {
  //   effects: [
  //     {
  //       name: `Rot-kraken Hide`,
  //       desc: `Add 1 to the bearer's wounds characteristic.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  // 'Daemon Flask': {
  //   effects: [
  //     {
  //       name: `Daemon Flask`,
  //       desc: `Once per battle, the bearer can use this artifact. If they do so, roll a D6 for each enemy unit within 12" of the bearer. You can reroll the dice for a unit that is a War Machine or is within 3" of a terrain feature. On a 4+ that unit suffers 1 mortal wound. On a 6, that unit suffers D3 mortal wounds instead of 1.`,
  //       when: [START_OF_HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Artifacts, 'artifact')
