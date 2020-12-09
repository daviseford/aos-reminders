import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Soul of the Stormhost': {
    effects: [
      {
        name: `Soul of the Stormhost`,
        desc: `You can use this command ability when a friendly HAMMERS OF SIGMAR REDEEMER unit is destroyed. If you do so roll a D6. On a 5+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit anywhere on the battlefield, more than 9" from any enemy models. Cannot use more than once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Holy Crusaders': {
    effects: [
      {
        name: `Holy Crusaders`,
        desc: `You can use this command ability at the start of your hero phase. Pick a friendly HALLOWED KNIGHTS unit wholly within 9" of a friendly HALLOWED KNIGHTS HERO, or wholly within 18" of a friendly HALLOWED KNIGHTS HERO that is a general. Add 1 to run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, that unit can run and still charge later in the same turn.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Righteous Hatred': {
    effects: [
      {
        name: `Righteous Hatred`,
        desc: `Pick a friendly CELESTIAL VINDICATORS unit wholly within 9" of a friendly of a friendly CELESTIAL VINDICATORS HERO, or wholly within 18" of a friendly CELESTIAL VINDICATORS HERO that is a general. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase. Same unit cannot benefit more than once per hero phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Heroes of Another Age': {
    effects: [
      {
        name: `Heroes of Another Age`,
        desc: `Pick a friendly ANVILS OF THE HELDENHAMMER unit wholly within 9" of a friendly of a friendly ANVILS OF THE HELDENHAMMER HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. That unit can attack with all the missile weapons it is armed with, or make a pile-in move and attack with all of the melee weapons it is armed with. Same unit cannot benefit more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'No Mercy': {
    effects: [
      {
        name: `No Mercy`,
        desc: `Pick a friendly KNIGHTS EXCELSIOR unit wholly within 9" of a friendly KNIGHTS EXCELSIOR HERO, or wholly within 18" of a friendly ANVILS OF THE HELDENHAMMER HERO that is a general. You can reroll wound rolls of 1 for attacks made by that unit until the end of the turn.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Astral Conjunction': {
    effects: [
      {
        name: `Astral Conjunction`,
        desc: `Pick a friendly CELESTIAL WARBRINGER WIZARD wholly within 9" of a friendly CELESTIAL WARBRINGER HERO, or wholly within 18" of a friendly CELESTIAL WARBRINGER HERO that is a general. Add 1 to casting rolls for that unit until the end of that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rousing Oratory': {
    effects: [
      {
        name: `Rousing Oratory`,
        desc: `Pick a friendly TEMPEST LORDS unit wholly within 9" of a friendly TEMPEST LORDS HERO, or wholly within 18" of a friendly TEMPEST LORDS HERO that is a general. You can reroll wound rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Cut off the Head': {
    effects: [
      {
        name: `Cut off the Head`,
        desc: `Pick a friendly ASTRAL TEMPLARS unit wholly within 9" of a friendly ASTRAL TEMPLARS HERO, or wholly within 18" of a friendly ASTRAL TEMPLARS HERO that is a general. Until the end of that phase, add 1 to wound rolls for attacks made by that unit that target a HERO.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Fiery Orator': {
    effects: [
      {
        name: `Fiery Orator`,
        desc: `Pick a friendly HAMMERS OF SIGMAR unit wholly within 12" of a friendly model with this command ability. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Soul Energy of the First Host': {
    effects: [
      {
        name: `Soul Energy of the First Host`,
        desc: `Pick a friendly unit of HAMMERS OF SIGMAR EVOCATORS wholly within 12" of a friendly model with this command ability. That unit can automatically cast Empower in that hero phase (no casting roll is required, and the spell cannot be unbound).`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `Pick a friendly unit of HAMMERS OF SIGMAR CASTIGATORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the accuracy and power of that unit's Thunderhead Greatbows in that shooting phase instead of choosing only one of those options.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `Pick a friendly unit of HAMMERS OF SIGMAR SEQUITORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the power of the unit's weapons and shields in that combat phase instead of choosing only one of those options.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vengeful Determination': {
    effects: [
      {
        name: `Vengeful Determination`,
        desc: `Until the end of the phase, add 1 to the Attacks of melee weapons used by friendly HAMMERS OF SIGMAR units while they are wholly within 12" of a friendly model with this command ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Once More, For Sigmar, Charge!': {
    effects: [
      {
        name: `Once More, For Sigmar, Charge!`,
        desc: `Until the end of the phase add 3 to charge rolls for friendly HAMMERS OF SIGMAR units that are wholly within 12" of this model when the charge roll is made.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Aetheric Manipulation': {
    effects: [
      {
        name: `Aetheric Manipulation`,
        desc: `You can use this command ability before an endless spell is moved. If you do so, pick a predatory Endless Spell model within 12" of a friendly model with this command ability. Add D6" to the distance that endless spell can move until the end of the battle round.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Swift of Wing': {
    effects: [
      {
        name: `Swift of Wing`,
        desc: `Pick a friendly model with this command ability. Add 2 to run rolls for friendly SACROSANCT units that were wholly within 18" of that model at the start of that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Pack Alpha': {
    effects: [
      {
        name: `Pack Alpha`,
        desc: `Add 1 to the Attacks of the Monstrous Claws of friendly EVOCATORS with DRACOLINE mounts while they are wholly within 18" of that model until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of the Azyrite Hurricane': {
    effects: [
      {
        name: `Lord of the Azyrite Hurricane`,
        desc: `Pick a friendly model with this command ability. Remove that model, and/or one friendly unit of VANGUARD-HUNTERS, VANGUARD-PALLADORS, VANGUARD-RAPTORS or AETHERWINGS wholly within 24" of that model, from the battlefield and set them up wholly within 6" of any edge of the battlefield, more than 7" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Lord of the Host': {
    effects: [
      {
        name: `Lord of the Host`,
        desc: `Until the end of the phase, you do not have to take battleshock tests for friendly STORMCAST ETERNAL units that are wholly within 24" of that model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Lord of the Celestial Host': {
    effects: [
      {
        name: `Lord of the Celestial Host`,
        desc: `Reroll failed wound rolls for attacks made by friendly STARDRAKE and DRACOTH mounts until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Furious Retribution': {
    effects: [
      {
        name: `Furious Retribution`,
        desc: `Pick a friendly model with this command ability that is within 3" of an enemy unit. Add 1 to hit rolls for friendly STORMCAST ETERNAL units wholly within 12" of that model when they attack in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Sombre Exemplar': {
    effects: [
      {
        name: `Sombre Exemplar`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, until the end of that phase add 1 to hit rolls for attacks made by friendly ANVILS OF THE HELDENHAMMER units while they are wholly within 12" of this model.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
