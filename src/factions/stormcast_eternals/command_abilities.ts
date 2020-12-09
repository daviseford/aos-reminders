import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
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
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')
