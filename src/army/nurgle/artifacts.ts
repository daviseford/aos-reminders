import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `The Splithorn Helm (Rotbringers)`,
    effects: [
      {
        name: `The Splithorn Helm (Rotbringers)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Muttergrub (Rotbringers)`,
    effects: [
      {
        name: `Muttergrub (Rotbringers)`,
        desc: `If the bearer is a wizard, they can attempt to cast one additional spell. If the bearer is not a wizard they can attempt to cast Foul Regenesis. Does not provide the ability to unbind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rustfang (Rotbringers)`,
    effects: [
      {
        name: `Rustfang (Rotbringers)`,
        desc: `Pick one enemy unit within 3" of the bearer. Subtract 1 from its save rolls for the rest of the battle. You cannot use this ability more than once on the same enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flesh Pealer (Rotbringers)`,
    effects: [
      {
        name: `Flesh Pealer (Rotbringers)`,
        desc: `Roll a D6 for each enemy unit that is within 6" of the bearer. On a 5+ the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Bileheart (Rotbringers)`,
    effects: [
      {
        name: `The Bileheart (Rotbringers)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Fecund Flask (Rotbringers)`,
    effects: [
      {
        name: `The Fecund Flask (Rotbringers)`,
        desc: `Once per battle roll a D6. On a 2+ any wounds suffered by the are healed. On a 1 the bearer is slain. If the bearer is slain by the flask, you can add 1 Beast of Nurgle within 1" of the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Noxious Nexus (Daemon)`,
    effects: [
      {
        name: `Noxious Nexus (Daemon)`,
        desc: `Roll a D6 for each enemy unit within 7" of the bearer. If the roll is equal to or less than the number of the current battle round, the unit being rolled for suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Nurgle's Nail (Daemon)`,
    effects: [
      {
        name: `Nurgle's Nail (Daemon)`,
        desc: `Pick one of the bearer's melee weapons to be Nurgle's Nail. Roll 2D6 for each enemy model that was allocated any wounds caused by Nurgle's Nail and not slain. If the result is exactly 7 the model being rolled for is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bountiful Swarm (Daemon)`,
    effects: [
      {
        name: `The Bountiful Swarm (Daemon)`,
        desc: `Pick an enemy model within 3" of the bearer and roll a D6. If the roll is greater then that model's Wounds characteristic, then it is slain. If a model with a wounds characteristic of 4+ is slain, you can set up a Beast of Nurgle within 1" of the slain model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Witherstave (Daemon)`,
    effects: [
      {
        name: `The Witherstave (Daemon)`,
        desc: `Re-roll hits of 6 for enemy units while they are within 12" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Tome of a Thousand Poxes (Daemon)`,
    effects: [
      {
        name: `Tome of a Thousand Poxes (Daemon)`,
        desc: `If the bearer is a wizard, add 1 to the casting rolls for any spells from the Lore of Nurgle that they attempt to cast. If the bearer is not a wizard they can attempt to cast the Sumptuous Pestilence spell. This does not provide the unit with an unbind.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Endless Gift (Daemon)`,
    effects: [
      {
        name: `The Endless Gift (Daemon)`,
        desc: `Roll a D6 for each wound that was allocated to this model in that turn and not negated. On a 4+ the wound is healed.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Virulent Blade (Mortal)`,
    effects: [
      {
        name: `The Virulent Blade (Mortal)`,
        desc: `Pick one of the bearer's melee weapons to be the Virulent Blade. Add 1 to the damage characteristic for attacks made by this weapon for wound rolls of 5+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Foetid Shroud (Mortal)`,
    effects: [
      {
        name: `The Foetid Shroud (Mortal)`,
        desc: `Re-roll hit rolls of 6+ or more for attacks that target the bearer in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sublucus' Stenchplate (Mortal)`,
    effects: [
      {
        name: `Sublucus' Stenchplate (Mortal)`,
        desc: `Enemy units that are within 3" of the bearer at the end of their movement phase suffer D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Eye of Nurgle (Mortal)`,
    effects: [
      {
        name: `The Eye of Nurgle (Mortal)`,
        desc: `Once per battle, you can roll 2D6 if there are any enemy models within 12" of the bearer. If the result is exactly 7, the the closest enemy model to the bearer is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Carrion Dirge (Mortal)`,
    effects: [
      {
        name: `The Carrion Dirge (Mortal)`,
        desc: `Subtract 2 from the Bravery characteristic of enemy unit while they are within 12" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Shield of Growths (Mortal)`,
    effects: [
      {
        name: `The Shield of Growths (Mortal)`,
        desc: `You can re-roll failed save rolls for the bearer if the roll is equal to or less than the number of wounds currently allocated to the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts
