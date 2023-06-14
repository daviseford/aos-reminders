import { TItemDescriptions } from 'factions/factionTypes'
import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const Flavors: TItemDescriptions = {
  "Dracothion's Tail": {
    effects: [
      {
        name: `Appear on Command`,
        desc: `During deployment, instead of setting up a DRACOTHION'S TAIL unit on the battlefield, you can place it to one side and say that it is set up on the temple-ship as a reserve unit. You can set up 1 unit on the temple-ship for each DRACOTHION'S TAIL unit you have set up on the battlefield. At the end of your movement phase, you can set up 1 or more of the reserve units on the temple-ship on the battlefield, wholly within 12" of a friendly cosmic node and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Appear on Command`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units on the temple-ship on the battlefield, wholly within 12" of a friendly cosmic node and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Fangs of Sotek': {
    effects: [
      {
        name: `The Serpent Strikes`,
        desc: `The commanding player of a Fangs of Sotek army can use the Redeploy command ability up to 3 times in each of their opponent's movement phases. In addition, the first 2 times the Redeploy command is issued to any friendly FANGS OF SOTEK SKINK units in a phase, no command points are spent.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  "Koatl's Claw": {
    effects: [
      {
        name: `Savagery Incarnate`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly KOATL'S CLAW SAURUS and KOATL'S CLAW KROXIGOR units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Thunder Lizard': {
    effects: [
      {
        name: `Mighty Beasts of War`,
        desc: `At the end of the charge phase, you can carry out 2 monstrous rampages with each friendly THUNDER LIZARD MONSTER instead of 1.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default Flavors
