import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Allegiances: TEntry[] = [
  {
    name: `Jaws of Mork`,
    effects: [
      {
        name: `Running Riot`,
        desc: `You can reroll the roll that determines the Move characteristic of friendly SQUIG units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `"Get Some Loonshine Down 'Em!"`,
        desc: `You can use this command ability at the start of any phase. If you do so, pick 1 friendly JAWS OF MORK MANGLER SQUIGS model. Until the end of that phase, use the top row on that model's damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Envoy of the Overbounder`,
        desc: `You can reroll failed battleshock tests for friendly JAWS OF MORK units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Syari Screamersquig`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer. If you do so, until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by the bearer that target that HERO.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Glogg's Megamob`,
    effects: [
      {
        name: `Monstrous Regeneration`,
        desc: `Add 1 to the dice that determines if a friendly GLOGG'S MEGAMOB TROGGOTH unit heals any wounds when it uses its Regeneration ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Oblivious to Sorcery`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly GLOGG'S MEGAMOB FELLWATER TROGGOTH OR GLOGG'S MEGAMOB TOCKGUT TROGGOTH unit wholly within 12" of a friendly GLOGG'S MEGAMOB DANKHOLD HERO. Until your next hero phase, each time that unit is affected by a spell or endless spell, you can roll a dice. If you do so, on a 4+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Shepard of Idiotic Destruction`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a dice. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Aetherquartz-studded Hide`,
        desc: `Roll a dice each time you allocate a mortal wound to the bearer. On a 5+, that mortal wound is ignored.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
