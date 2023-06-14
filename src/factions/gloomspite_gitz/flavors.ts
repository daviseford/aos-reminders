import { COMBAT_PHASE, DURING_SETUP, END_OF_TURN, HERO_PHASE } from 'types/phases'

const Flavors = {
  'Jaws of Mork': {
    effects: [
      {
        name: `Crushing Gobs`,
        desc: `Add 1 to the Attacks characteristic of Fang-filled Gobs, Massive Fang-filled Gobs and Huge Fang-filled Gobs used by friendly JAWS OF MORK SQUIG units if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  "Glogg's Megamob": {
    effects: [
      {
        name: `Monstrous Regeneration`,
        desc: `Each time a friendly GLOGG'S MEGAMOB TROGGOTH unit fights, after all of its attacks have been resolved, the effect of its Regeneration or Greater Regeneration ability is triggered.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Grimscuttle: {
    effects: [
      {
        name: `Through the Cracks they Creep`,
        desc: `During deployment, if any friendly GRIMSCUTTLE SKITTERSTRAND ARACHNAROKS have been set up in ambush as reserve units using the Ambush From Beyond ability, instead of setting up another friendly GRIMSCUTTLE SPIDERFANG unit, you can place that unit to one side and say that it will join a friendly GRIMSCUTTLE SKITTERSTRAND ARACHNAROK in ambush as a reserve unit. Up to 2 units can join each friendly GRIMSCUTTLE SKITTERSTRAND ARACHNAROK as a reserve unit. When a friendly GRIMSCUTTLE SKITTERSTRAND ARACHNAROK is set up on the battlefield for the first time, set up all units that joined it wholly within 12" of it and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
    ],
  },

  "Da King's Gitz": {
    effects: [
      {
        name: `Lairs of the Loonking's Ladz`,
        desc: `If you command a KING'S GITZ army, you can reroll the dice roll when using the Bad Moon Loonshrine's Moonclan Lairs ability.`,
        when: [END_OF_TURN],
      },
    ],
  },

  Badsnatchers: {
    effects: [
      {
        name: `Harbingers of the Everdank`,
        desc: `Each time a casting roll is made for a friendly BADSNATCHERS MOONCLAN WIZARD, if that WIZARD is wholly within 9" of any other friendly BADSNATCHERS MOONCLAN WIZARDS, you can reroll 1 of the dice in that casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default Flavors
