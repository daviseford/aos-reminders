import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_SETUP, HERO_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Ring of Dominion': {
    effects: [
      {
        name: `Ring of Dominion`,
        desc: `Each time the bearer is picked to fight in the combat phase, you can pick 1 enemy model within 3" of the bearer and roll a dice. On a 5+, pick 1 of that model's melee weapons.

        That model's unit suffers a number of mortal wounds equal to the Damage characteristic of the weapon you picked. You cannot pick a melee weapon that refers to a damage table or ability to determine its damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadeglass Decanter': {
    effects: [
      {
        name: `Shadeglass Decanter`,
        desc: `After armies have been set up but before the first battle round begins, you can pick 1 enemy HERO on the battlefield. In your hero phase, if the bearer and that HERO are on the battlefield, you can roll a dice. If the roll is equal to or greater than the number of the current battle round, that HERO suffers 1 mortal wound.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Orb of Enchantment': {
    effects: [
      {
        name: `Orb of Enchantment`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer and roll a dice. On a 3+, that HERO cannot be picked to fight in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Soulbound Garments': {
    effects: [
      {
        name: `Soulbound Garments`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Oubliette Arcana': {
    effects: [
      {
        name: `Oubliette Arcana`,
        desc: `Once per enemy hero phase, when an enemy WIZARD successfully casts a spell within 18" of the bearer and that spell is not unbound (even if a friendly WIZARD attempted to unbind the spell), before resolving the effects of that spell, you can roll a dice. On a 5+, that spell is unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amulet of Screams': {
    effects: [
      {
        name: `Amulet of Screams`,
        desc: `Once per battle, when an enemy WIZARD successfully casts a spell that is not unbound, you can say that the bearer will use their Amulet of Screams. If you do so, that WIZARD suffers mortal wounds after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [END_OF_SETUP],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
