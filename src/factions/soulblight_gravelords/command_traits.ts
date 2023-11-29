import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Tailored Downfall': {
    effects: [
      {
        name: `Tailored Downfall`,
        desc: `After deployment but before the first battle round begins, you can pick 1 enemy HERO on the battlefield. The strike-last effect applies to that unit while it is within 3" of this general.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Game Hunter': {
    effects: [
      {
        name: `Game Hunter`,
        desc: `After deployment but before the first battle round begins, you can pick 1 enemy MONSTER that is not a HERO. The Attacks characteristic of that unit's melee weapons is 1 while that unit is within 3" of this general.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Doomed Minions': {
    effects: [
      {
        name: `Doomed Minions`,
        desc: `After deployment but before the first battle round begins, you can pick up to D3 enemy units that are not HEROES or MONSTERS. Attacks made with melee weapons that target that unit score a hit on an unmodified hit roll of 2+ while that unit is within 3" of this general.`,
        when: [END_OF_SETUP],
      },
    ],
  },

  'Above Suspicion': {
    effects: [
      {
        name: `Above Suspicion`,
        desc: `During deployment, instead of setting up this general on the battlefield, you can place them to one side and say that they are set up in ambush as a reserve unit. If you do so, at the end of your movement phase, you can set up this general on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Above Suspicion`,
        desc: `If you set this general up in ambush, at the end of your movement phase, you can set up this general on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Unbending Will': {
    effects: [
      {
        name: `Unbending Will`,
        desc: `Models in friendly LEGION OF NIGHT SUMMONABLE units count as 2 models instead of 1 for the purposes of contesting objectives while they are wholly within 12" of this general.`,
        when: [END_OF_ROUND],
      },
    ],
  },
  'The Bait': {
    effects: [
      {
        name: `The Bait`,
        desc: `While this general is on the battlefield, add 1 to save rolls and ward rolls for attacks that target friendly LEGION OF NIGHT SUMMONABLE units in the first battle round.`,
        when: [WARDS_PHASE, SAVES_PHASE],
      },
    ],
  },

  'Driven by Deathstench': {
    effects: [
      {
        name: `Driven by Deathstench`,
        desc: `You can reroll charge rolls for friendly VYRKOS units wholly within 9" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Hunter's Snare": {
    effects: [
      {
        name: `Hunter's Snare`,
        desc: `For the purposes of contesting objectives, this general counts as a number of models equal to their Wounds characteristic.`,
        when: [END_OF_ROUND],
      },
    ],
  },
  'Spoor Trackers': {
    effects: [
      {
        name: `Spoor Trackers`,
        desc: `At the start of your hero phase, friendly VYRKOS DEADWALKERS units wholly within 9" of this general can make a normal move of up to 3".`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Swift and Deadly': {
    effects: [
      {
        name: `Swift and Deadly`,
        desc: `You can reroll charge rolls for friendly KASTELAI units while they are wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Undead Bladelord': {
    effects: [
      {
        name: `Undead Bladelord`,
        desc: `Once per turn, if this general is on the battlefield when a friendly KASTELAI VAMPIRE unit gains an ability with the Might of the Crimson Keep battle trait that this general has not already gained, this general gains the same ability.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Shifting Keep': {
    effects: [
      {
        name: `The Shifting Keep`,
        desc: `During deployment, if this general is on the battlefield, instead of setting up a KASTELAI BLOOD KNIGHTS unit on the battlefield, you can place it to one side and say that it is set up in the Crimson Keep as a reserve unit. You can set up 1 unit in the Crimson Keep for each unit you have set up on the battlefield. At the end of your movement phase, you can set up 1 or more of the reserve units in the Crimson Keep on the battlefield, wholly within 6" of the battlefield edge and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Shifting Keep`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units in the Crimson Keep on the battlefield, wholly within 6" of the battlefield edge and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Monstrous Might': {
    effects: [
      {
        name: `Monstrous Might`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target friendly AVENGORII MONSTERS wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Torment-driven Throes': {
    effects: [
      {
        name: `Torment-driven Throes`,
        desc: `At the start of the combat phase, you can roll a dice for each enemy unit within 3" of this general. On a 5+, that unit suffers 1 mortal wound and the strike-last effect applies to that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Unhinged Rampager': {
    effects: [
      {
        name: `Unhinged Rampager`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Unhinged Rampager`,
        desc: `At the end of the shooting phase, if any wounds or mortal wounds were allocated to this general in that phase, and this general is more than 9" from all enemy units, this general can move up to D6".`,
        when: [END_OF_SHOOTING_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
