import { BATTLESHOCK_PHASE, COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Celestial Apotheosis`,
    effects: [
      {
        name: `Celestial Apotheosis`,
        desc: `Casting value of 5. If successfully cast, pick 1 friendly unit wholly within 18" of the caster and visible to them. Heal 1 wound allocated to that unit. In addition, until your next hero phase, subtract 1 from the Bravery characteristic of enemy units while they are within 3" of that unit.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Claws of Glory`,
    effects: [
      {
        name: `Claws of Glory`,
        desc: `Casting value of 6. If successfully cast, pick 1 friendly unit wholly within 18" of the caster and visible to them. You can re-roll hit rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Walk Between Realms`,
    effects: [
      {
        name: `Walk Between Realms`,
        desc: `Casting value of 6. If successfully cast, pick 1 friendly unit wholly within 18" of the caster and visible to them. That unit can fly until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Meteoric Convocation`,
    effects: [
      {
        name: `Meteoric Convocation`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 24" of the caster and visible to them. Roll 8 dice for that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mystical Unforging`,
    effects: [
      {
        name: `Mystical Unforging`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy HERO with an artifact of power within 12" of the caster and visible to them. That HERO suffers D3 mortal wounds, and you must roll a D6. On a 5+, that HERO'S artifact of power can no longer be used (if a weapon was picked when it was selected, the weapon reverts to normal).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stellar Tempest`,
    effects: [
      {
        name: `Stellar Tempest`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy unit within 24" of the caster and visible to them. Roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Light of the Heavens`,
    effects: [
      {
        name: `Light of the Heavens`,
        desc: `Casting value of 6. If successfully cast, then until your next hero phase any battleshock tests for CELESTIAL DAEMON or CHAOS DAEMON units are made by rolling two dice rather than one. For CELESTIAL units, discard the highest of the two dice; for CHAOS units, discard the lowest.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Comet's Call`,
    effects: [
      {
        name: `Comet's Call`,
        desc: `Casting value of 7. If successfully cast, pick up to D3 enemy units, or D6 if the result of the casting roll was 10 or more. Each of these units is struck by a comet and suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Celestial Deliverance`,
    effects: [
      {
        name: `Celestial Deliverance`,
        desc: `The caster can attempt to cast this spell up to three times in the same hero phase. Casting value of 8 the first time it is attempted in a hero phase, a casting value of 9 the second time it is attempted in a hero phase, and a casting value of 10 the third time it is attempted in a hero phase. Each time the spell is successfully cast, pick up to 3 different enemy units within 10" of the caster and visible to them, and roll a D6 for each unit you pick. On a 2+, that unit suffers D3 mortal wounds. If that unit is a Chaos Daemon unit, on a 2+ it suffers 3 mortal wounds instead of D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Curse of Fates`,
    effects: [
      {
        name: `Curse of Fates`,
        desc: `Casting value of 4. If successfully cast, pick a unit within 20". Once per phase until your next hero phase, you can increase or decrease the result of a single dice roll for that unit by one.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Summon Starlight`,
    effects: [
      {
        name: `Summon Starlight`,
        desc: `Casting value of 6. If it is successfully cast, pick a unit within 20" to be bathed in starlight. If the unit is SERAPHON, subtract 1 from the hit rolls of any attacks that target it until your next hero phase. Otherwise, subtract 1 from the hit rolls of any attacks that it makes until your next hero phase. If a unit of CHAOS DAEMONS is bathed in starlight, it also suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells
