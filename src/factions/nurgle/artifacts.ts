import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  // Rotbringers Artifacts
  'The Splithorn Helm': {
    effects: [
      {
        name: `The Splithorn Helm`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Muttergrub: {
    effects: [
      {
        name: `Muttergrub`,
        desc: `If the bearer is a wizard, they can attempt to cast one additional spell. If the bearer is not a wizard they can attempt to cast Foul Regenesis. Does not provide the ability to unbind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Rustfang: {
    effects: [
      {
        name: `Rustfang`,
        desc: `Pick one enemy unit within 3" of the bearer. Subtract 1 from its save rolls for the rest of the battle. You cannot use this ability more than once on the same enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Flesh Pealer': {
    effects: [
      {
        name: `Flesh Pealer`,
        desc: `Roll a D6 for each enemy unit that is within 6" of the bearer. On a 5+ the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Bileheart': {
    effects: [
      {
        name: `The Bileheart`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Fecund Flask': {
    effects: [
      {
        name: `The Fecund Flask`,
        desc: `Once per battle roll a D6. On a 2+ any wounds suffered are healed. On a 1 the bearer is slain. If the bearer is slain by the flask, you can add 1 Beast of Nurgle within 1" of the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Daemon Artifacts
  'Noxious Nexus': {
    effects: [
      {
        name: `Noxious Nexus`,
        desc: `Roll a D6 for each enemy unit within 7" of the bearer. If the roll is equal to or less than the number of the current battle round, the unit being rolled for suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Nurgle's Nail": {
    effects: [
      {
        name: `Nurgle's Nail`,
        desc: `Pick one of the bearer's melee weapons to be Nurgle's Nail. Roll 2D6 for each enemy model that was allocated any wounds caused by Nurgle's Nail and not slain. If the result is exactly 7 the model being rolled for is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Bountiful Swarm': {
    effects: [
      {
        name: `The Bountiful Swarm`,
        desc: `Pick an enemy model within 3" of the bearer and roll a D6. If the roll is greater then that model's Wounds characteristic, then it is slain. If a model with a wounds characteristic of 4+ is slain, you can set up a Beast of Nurgle within 1" of the slain model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Witherstave': {
    effects: [
      {
        name: `The Witherstave`,
        desc: `Reroll hits of 6 for enemy units while they are within 12" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Tome of a Thousand Poxes': {
    effects: [
      {
        name: `Tome of a Thousand Poxes`,
        desc: `If the bearer is a wizard, add 1 to the casting rolls for any spells from the Lore of Nurgle that they attempt to cast. If the bearer is not a wizard they can attempt to cast the Sumptuous Pestilence spell. This does not provide the unit with an unbind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Endless Gift': {
    effects: [
      {
        name: `The Endless Gift`,
        desc: `Roll a D6 for each wound that was allocated to this model in that turn and not negated. On a 4+ the wound is healed.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  // Mortal Artifacts
  'The Virulent Blade': {
    effects: [
      {
        name: `The Virulent Blade`,
        desc: `Pick one of the bearer's melee weapons to be the Virulent Blade. Add 1 to the damage characteristic for attacks made by this weapon for wound rolls of 5+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Foetid Shroud': {
    effects: [
      {
        name: `The Foetid Shroud`,
        desc: `Reroll hit rolls of 6+ or more for attacks that target the bearer in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Sublucus' Stenchplate": {
    effects: [
      {
        name: `Sublucus' Stenchplate`,
        desc: `Enemy units that are within 3" of the bearer at the end of their movement phase suffer D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'The Eye of Nurgle': {
    effects: [
      {
        name: `The Eye of Nurgle`,
        desc: `Once per battle, you can roll 2D6 if there are any enemy models within 12" of the bearer. If the result is exactly 7, the closest enemy model to the bearer is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Carrion Dirge': {
    effects: [
      {
        name: `The Carrion Dirge`,
        desc: `Subtract 2 from the Bravery characteristic of enemy unit while they are within 12" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Shield of Growths': {
    effects: [
      {
        name: `The Shield of Growths`,
        desc: `You can reroll failed save rolls for the bearer if the roll is equal to or less than the number of wounds currently allocated to the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Munificent Wanderers Artifacts
  Mucktalon: {
    effects: [
      {
        name: `Mucktalon`,
        desc: `Add 1 to hit rolls for attacks made with this weapon if the target is a hero.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Droning Guard Artifacts
  'Cloak of Flies': {
    effects: [
      {
        name: `Cloak of Flies`,
        desc: `Subtract 1 from melee hit rolls made against the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Blessed Sons Artifacts
  'Blotshell Bileplate': {
    effects: [
      {
        name: `Blotshell Bileplate`,
        desc: `You can reroll save rolls for attacks targeting the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Drowned Men Artifacts
  'Rot-kraken Hide': {
    effects: [
      {
        name: `Rot-kraken Hide`,
        desc: `Add 1 to the bearer's wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Tamurkhan's Horde Artifacts
  'Daemon Flask': {
    effects: [
      {
        name: `Daemon Flask`,
        desc: `Once per battle, the bearer can use this artifact. If they do so, roll a D6 for each enemy unit within 12" of the bearer. You can reroll the dice for a unit that is a War Machine or is within 3" of a terrain feature. On a 4+ that unit suffers 1 mortal wound. On a 6, that unit suffers D3 mortal wounds instead of 1.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')
