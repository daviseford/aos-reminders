import { TAbilities } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Trampling Charge`,
    desc: `After an OGOR or RHINOX unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the unmodified charge roll for that charge move. Add 2 to each roll if the OGOR unit that made the charge move has 8 or more models or is a MONSTER. For each 6+, that enemy unit suffers 1 mortal wound.`,
    when: [CHARGE_PHASE],
  },
  {
    name: `Grasp of the Everwinter`,
    desc: `At the start of your hero phase, roll 1 dice for each enemy unit within 3" of any friendly BEASTCLAW RAIDERS units. If the roll is equal to or less than the number of the current battle round, that unit suffers D3 mortal wounds.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Might Makes Right`,
    desc: `When determining control of an objective, each OGOR counts as 2 models instead of 1, and each OGOR MONSTER counts as 10 models instead of 1.`,
    when: [DURING_GAME],
  },
  {
    name: `Ravenous Brutes`,
    desc: `If an OGOR unit is more than 3" from any enemy units, it is hungry. If an OGOR unit is within 3" of any enemy units, it is eating. Add 2" to the Move characteristic of a unit that is hungry. Add 2 to the Bravery characteristic of a unit that is eating.`,
    when: [DURING_GAME],
  },
  {
    name: `Ravenous Brutes`,
    desc: `If an OGOR unit is more than 3" from any enemy units, it is hungry. Add 2" to the Move characteristic of a unit that is hungry.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Ravenous Brutes`,
    desc: `If an OGOR unit is within 3" of any enemy units, it is eating. Add 2 to the Bravery characteristic of a unit that is eating.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Everwinter Prayers`,
    desc: `Each BEASTCLAW RAIDERS PRIEST in an Ogor Mawtribes army knows 1 Everwinter prayer from the Manifestations of the Eternal Snowstorm table in addition to any other prayers they know.
    
    In your hero phase, each friendly BEASTCLAW RAIDERS PRIEST that knows any Everwinter prayers can chant 1 Everwinter prayer. If they do so, make a prayer roll by rolling a dice. 

    Each Everwinter prayer has a chanting value. If the prayer roll is equal to or greater than the chanting value of the Everwinter prayer, the prayer is answered. 

    Each Everwinter prayer can only be attempted once per turn, regardless of how many BEASTCLAW RAIDERS PRIESTS know that Everwinter prayer.`,
    when: [HERO_PHASE],
  },
]

export default Abilities
