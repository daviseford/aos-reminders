import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts = {
  // Fated Artefacts - Arcanites Only
  Changeblade: {
    effects: [
      {
        name: `Changeblade`,
        desc: `Pick 1 of the bearer's melee weapons. Each time an enemy Hero is slain by attacks made with that weapon, you can say it is transformed into a Spawn instead of being slain (pg 65).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Timeslip Pendant': {
    effects: [
      {
        name: `Timeslip Pendant`,
        desc: `Once per battle, in the combat phase, after the bearer has fought for the first time in that phase, you can say that you are using the Timeslip Pendant. If you do so, they do not count as having fought in that phase but the strike-last effect applies to them until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Daemonheart: {
    effects: [
      {
        name: `Daemonheart`,
        desc: `Once per battle, at the start of the combat phase, pick 1 enemy unit within 1" of the bearer. That unit suffers a number of mortal wounds equal to the number of the current battle round.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "Ambition's End": {
    effects: [
      {
        name: `Ambition's End`,
        desc: `Once per battle, at the start of your hero phase, you can pick 1 enemy wizard within 1" of the bearer. That wizard suffers a number of mortal wounds equal to the number of the current battle round. In addition, that wizard cannot attempt to unbind any spells until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Secret-eater': {
    effects: [
      {
        name: `Secret-eater`,
        desc: `Pick 1 of the bearer's weapons. If the unmodified hit roll for any attack made with that weapon is 6 and you have fewer than 9 Destiny Dice, you can roll a dice and add it to your Destiny Dice.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Spiteful Shield': {
    effects: [
      {
        name: `Spiteful Shield`,
        desc: `If the unmodified save roll for an attack made with a melee weapon that targets the bearer is 6, the attacking unit suffers 2 mortal wounds afer all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Daemonic Treasures - Daemons Only
  'Warpfire Blade': {
    effects: [
      {
        name: `Warpfire Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 2 mortal wounds on the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blade of Fate': {
    effects: [
      {
        name: `Blade of Fate`,
        desc: `Pick 1 of the bearer's melee weapons. Once per battle, if the unmodified hit roll for an attack made with that weapon is 6, you can replace one of your Destiny Dice with that roll.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Pyrofyre Stave': {
    effects: [
      {
        name: `Pyrofyre Stave`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds inflicted by that weapon are allocated to an enemy Wizard and that model is not slain, that Wizard cannot unbind spells for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Beacon of Mutability': {
    effects: [
      {
        name: `Beacon of Mutability`,
        desc: `Add 1 to wound rolls for attacks made by friendly Disciples of Tzeentch Daemon units that are wholly within 9" of the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Nine-Eyed Tome': {
    effects: [
      {
        name: `Nine-Eyed Tome`,
        desc: `You can reroll casting, dispelling and unbinding rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Eternal Shroud': {
    effects: [
      {
        name: `The Eternal Shroud`,
        desc: `If the bearer is on the battlefield, roll a dice each time you spend a Destiny Dice. On a 5+, you can roll a dice and add it to your Destiny Dice.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')
