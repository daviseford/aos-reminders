import { TItemDescriptions } from 'factions/factionTypes'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, START_OF_HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Flavors = {
  'Barak-Zilfin, The Windswept City (Skyport)': {
    effects: [
      {
        name: `Magnificent Skyvessels`,
        desc: `You cna pick 1 additional Great Endrinwork for your army.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Barak-Zon, City of the Sun (Skyport)': {
    effects: [
      {
        name: `Deeds, Not Words`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly SKYFARERS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Barak-Urbaz, The Market City (Skyport)': {
    effects: [
      {
        name: `The Subtleties of the Code`,
        desc: `You can pick 1 additional artycle for your army. You cannot pick an artycle your army already has.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Barak-Mhornar, City of Shadow (Skyport)': {
    effects: [
      {
        name: `Sinister Raiders`,
        desc: `Roll a dice each time an enemy model issues a command within 12" of a friendly BARAK-MHORNAR unit. On a 5+, that command is not received (the command ability still count sas having been used) and the command point that was spent to issue that command is lost.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Barak-Thryng, City of the Ancestors (Skyport)': {
    effects: [
      {
        name: `Honour the Gods, Just in Case`,
        desc: `Allied DUARDIN PRIESTS know the prayer "Rune of Ancestral Guidance" in addition to any others they know.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Rune of Ancestral Guidance`,
        desc: `Answer value of 3 and a range of 16". If answered, pick 1 friendly ARKANAUT COMPANY or GRUNDSTOK THUNDERERS unit wholly within range. Until the start of your next hero phase, unmodified hit rolls of 6 for attacks made with missile weapons by that unit cause a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Barak-Nar, City of the First Sunrise (Skyport)': {
    effects: [
      {
        name: `Scholars and Commanders`,
        desc: `At the start of your hero phase, roll a dice for each friendly BARAK-NAR HERO on the battlefield (including any that are embarked). For each 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default Flavors
