import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  Mindblade: {
    effects: [
      {
        name: `Mindblade`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, if any wounds or mortal wounds caused by attacks made with that weapon were allocated to an enemy HERO in that phase and that HERO was not slain, that HERO cannot carry out heroic actions for the rest of the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bones of the Abyss': {
    effects: [
      {
        name: `Bones of the Abyss`,
        desc: `SOULMASON only. Each time the bearer successfully casts a spell that is not unbound, add 1 to the Attacks characteristic of the bearer' Ossified Claws until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Marrowpact: {
    effects: [
      {
        name: `Marrowpact`,
        desc: `Each time the bearer fights, after all of their attacks have been resolved, you can heal up to a number of wounds allocated to the bearer equal to the number of wounds and mortal wounds caused by those attacks that were allocated to enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Helm of Tyranny': {
    effects: [
      {
        name: `Helm of Tyranny`,
        desc: `Enemy units cannot receive the Inspiring Presence command while they are within 3" of the bearer.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Helm of Tyranny`,
        desc: `If an enemy unit fails a battleshock test within 3" of the bearer, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  "Artisan's Key": {
    effects: [
      {
        name: `Artisan's Key`,
        desc: `BONESHAPER only. Before you use the bearer's Boneshaper ability, roll a dice. On a 3+, you can either pick 2 units within 6" of the bearer to be affected by the Boneshaper ability instead of 1, or you can pick 1 unit within 6" of the bearer to be affected by the Boneshaper ability twice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lode of Saturation': {
    effects: [
      {
        name: `Lode of Saturation`,
        desc: `Add 1 to ward rolls for the bearer.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Gothizzar Cartouche': {
    effects: [
      {
        name: `Gothizzar Cartouche`,
        desc: `OSSIFECTOR only. Add 1 to wound rolls for attacks made with melee weapons by friendly OSSIARCH BONEREAPERS units wholly within 9" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Luminscythe: {
    effects: [
      {
        name: `Luminscythe`,
        desc: `SOULREAPER only. Subtract 1 from hit rolls and wound rolls for attacks that target the bearer while they are within 3" of any enemy units.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')
