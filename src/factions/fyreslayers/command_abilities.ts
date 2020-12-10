import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Steadfast Advance': {
    effects: [
      {
        name: `Steadfast Advance`,
        desc: `Pick a friendly model with this command ability. Until the start of your next hero phase, do not take battleshock tests for friendly FYRESLAYERS units while they are wholly within 18" of that model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Runefather's Favour": {
    effects: [
      {
        name: `Runefather's Favour`,
        desc: `Pick 1 friendly VOSTARG HERO within 12" of this model other than this model and roll a D6. On a 4+ that HERO can immediately pile-in and attack with al of the melee weapons it is armed with. You cannot pick the same HERO to benefit from this ability more than once per hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Molten Battering Ram': {
    effects: [
      {
        name: `Molten Battering Ram`,
        desc: `Pick 1 friendly MAGMADROTH that is within 12" of a friendly model with this command ability. After that unit makes a charge move in that charge phase, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 2+ that enemy unit suffers D6 mortal wounds. The same unit cannot be picked to be affected by this command ability more than once per phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Honour Our Oaths': {
    effects: [
      {
        name: `Honour Our Oaths`,
        desc: `Pick a friendly model with this command ability. Until the end of that phase, add 1 to hit rolls for attacks made by friendly VOSTARG units while they are wholly within 12" of that model. The same unit cannot be picked to be affected by this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lodge Leader': {
    effects: [
      {
        name: `Lodge Leader`,
        desc: `Pick a friendly model with this command ability. Add 1 charge rolls for friendly FYRESLAYERS units wholly within 12" of that model until the end of that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Dauntless Assault': {
    effects: [
      {
        name: `Dauntless Assault`,
        desc: `Pick a friendly model with this command ability. Add 1 to wound rolls for attacks made by friendly FYRESLAYERS units wholly within 12" of that model until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Vostarg (Lodge)
  'Honour Our Ancestors': {
    effects: [
      {
        name: `Honour Our Ancestors`,
        desc: `Pick a friendly VOSTARG HERO unit. Until the end of the phase, add 1 to hit rolls made by that HERO and friendly VULKITE BERZERKERS and HEARTHGUARD BERZERKERS wholly within 12" of that HERO. Cannot use more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Greyfyrd (Lodge)
  'Expert Cohesion': {
    effects: [
      {
        name: `Expert Cohesion`,
        desc: `You can use this CA when a friendly GREYFYRD HERO is picked to fight. Other GREYFYRD HEROS mounted on a MAGMADROTH that are within 3" of this HERO can fight immediately afterwards before your enemy can pick a unit to fight. They cannot fight in that phase again unless an ability or spell lets them fight more than once.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Hermdar (Lodge)
  'Skull-breakers and Oath-takers': {
    effects: [
      {
        name: `Skull-breakers and Oath-takers`,
        desc: `Pick 1 friendly HERMDAR VULKITE BERZERKER unit or 1 friendly HERMDAR HEARHTGUARD BERZERKER unit wholly within 12" of a HERMDAR HERO. That unit fights at the start of that combat phase. It cannot fight again in that phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Lofnir (Lodge)
  'Torrent of Magma': {
    effects: [
      {
        name: `Torrent of Magma`,
        desc: `Pick an enemy unit within 12" of a friendly LOFNIR PRIEST. Until the end of that phase add 1 to hit and wound rolls from Magmapikes by friendly units that target that enemy unit. The same unit cannot be affected by this CA more than once per phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
