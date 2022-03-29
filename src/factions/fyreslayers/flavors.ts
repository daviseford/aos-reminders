import { BATTLESHOCK_PHASE, COMBAT_PHASE, START_OF_SETUP, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Flavors = {
  Vostarg: {
    effects: [
      {
        name: `Fearsome Surge`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly VOSTARG VULKITE BERZERKERS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Greyfyrd: {
    effects: [
      {
        name: `Spoils of Victory`,
        desc: `Add 1 to the Wounds characteristic of friendly GREYFYRD HEROES that do not have a mount.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Spoils of Victory`,
        desc: `You can pick 2 additional artefacts of power (pg 59) and give them to 2 GREYFYRD HEROES in your army that do not have a mount.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  Hermdar: {
    effects: [
      {
        name: `Seize by Force`,
        desc: `If a friendly HERMDAR unit wholly within enemy territory or wholly within 12" of an objective fails a battleshock test, halve the number of models that flee (rounding up).`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Lofnir: {
    effects: [
      {
        name: `Venerators of Vulcatrix`,
        desc: `Add 2 to the Wounds characteristic of friendly LOFNIR MAGMADROTH units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Venerators of Vulcatrix`,
        desc: `Up to 3 LOFNIR MAGMADROTH units in your army can be given a different mount trait (pg 60) instead of only 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
