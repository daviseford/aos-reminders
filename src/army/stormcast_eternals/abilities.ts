import {
  DURING_SETUP,
  DURING_GAME,
  START_OF_GAME,
  END_OF_MOVEMENT_PHASE,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  HERO_PHASE,
  BATTLESHOCK_PHASE,
} from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Scions of the Storm`,
    desc: `Setup 1 unit in the Celestial Realm for every unit you setup on the battlefield. At the end of your movement phase you can set up one or more reserve units on the battlefield more than 9" from the enemy. Any units not setup before the 4th Battleround are slain.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Shock and Awe`,
    desc: `Subtract 1 from hit rolls for attacks that target any unit setup this turn via SCIONS OF THE STORM.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `First to be Forged (Hammers of Sigmar)`,
    desc: `Add 1 to the Bravery characteristic of friendly HAMMERS OF SIGMAR units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Only the Faithful (Hallowed Knights)`,
    desc: `If a friendly HALLOWED KNIGHTS unit is affected by a spell or endless spell, roll a dice. On a 6+ ignore the effects of that spell on that unit.`,
    when: [HERO_PHASE],
  },
  {
    name: `Driven by Vengeance (Celestial Vindicators)`,
    desc: `You can re-roll hit rolls of 1 for attacks made by friendly CELESTIAL VINDICATORS units if they made a charge move in the same turn.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `No True Death (Anvils of the Heldenhammer)`,
    desc: `You can re-roll failed battleshock tests for friendly ANVILS OF THE HELDENHAMMER units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Storm of Annihilation (Knights Excelsior)`,
    desc: `If a friendly KNIGHTS EXCELSIOR unit makes an attack that destroys an enemy unit, you can re-roll hit rolls of 1 for attacks made by that KNIGHTS EXCELSIOR unit for the rest of the battle.`,
    when: [DURING_GAME],
  },
  {
    name: `Fearless Foresight (Celestial Warbringers)`,
    desc: `At the start of the first battle round, after determining who has the first turn but before the first turn begins, you can pick D3 friendly CELESTIAL WARBRINGERS units and set them up again (any restrictions in the set-up instructions for the battleplan being used still apply).`,
    when: [START_OF_GAME],
  },
  {
    name: `Grand Strategists (Tempest Lords)`,
    desc: `At the start of your hero phase roll a dice. On a 4+ you receive 1 extra command point.`,
    when: [HERO_PHASE],
  },
  {
    name: `Beast Stalkers (Astral Templars)`,
    desc: `Add 1 to hit rolls for attacks made by ASTRAL TEMPLARS units that target a MONSTER.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
]

export default Abilities
