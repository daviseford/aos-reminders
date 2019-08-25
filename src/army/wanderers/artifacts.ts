import { TArtifacts } from 'types/army'
import { HERO_PHASE, SHOOTING_PHASE, MOVEMENT_PHASE, COMBAT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Falcon of Holthaven`,
    effects: [
      {
        name: `Falcon of Holthaven`,
        desc: `Roll a dice each time an enemy unit ends a normal move within 12" of the bearer. On a 4+ that unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Starcaster Longbow`,
    effects: [
      {
        name: `Starcaster Longbow`,
        desc: `In your shooting phase, you can pick an enemy unit within 20" of the bearer and roll a dice. On a 2-5 that unit suffers 1 mortal wound; on a 6+ that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Splinterbirch Blade`,
    effects: [
      {
        name: `Splinterbirch Blade`,
        desc: `Improve the Rend characteristic of this weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wending Wand`,
    effects: [
      {
        name: `Wending Wand`,
        desc: `Once per battle, a unit returning to the battlefield after using the Realm Wanderers battle trait can be set up wholly within 18" of the bearer, wholly within 6" of any edge of the battlefield, not just the one it left by, and more than 9" from any enemy models. This counts as that unit's move for that movement phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Viridescent Shawl`,
    effects: [
      {
        name: `Viridescent Shawl`,
        desc: `Add 1 to casting rolls for friendly WANDERER WIZARDS within 9" of the bearer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Viridescent Shawl`,
        desc: `Subtract 1 from hit rolls for missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Forget-me-knot`,
    effects: [
      {
        name: `Forget-me-knot`,
        desc: `Once per battle, at the start of the combat phase, pick an enemy HERO within 3" of the bearer. That HERO cannot fight or use abilities in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts
