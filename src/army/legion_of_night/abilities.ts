import { COMBAT_PHASE, DURING_SETUP, END_OF_MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'
import LegionsOfNagash from 'army/legions_of_nagash'

// Importing from LoN
const getLegionsOfNagashAbilities = () => LegionsOfNagash.Abilities

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  ...getLegionsOfNagashAbilities(),
  {
    name: `The Bait`,
    desc: `Add 1 to save rolls for friendly LEGION OF NIGHT DEATHRATTLE units that are wholly within your territory.`,
    when: [COMBAT_PHASE, SHOOTING_PHASE],
  },
  {
    name: `Ageless Cunning`,
    desc: `Instead of setting up a LEGION OF NIGHT unit on the battlefield, you can place it to one side and say that it is set up in ambush. You can do this with up to 3 units.`,
    when: [DURING_SETUP],
  },
  {
    name: `Ageless Cunning`,
    desc: `At the end of any of your movement phases, you can set up any of the units in ambush wholly within 6" of any battlefield edge and more than 9" away from any enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Legion of Night`,
    desc: `This is Mannfred's legion, if he is included in this army he MUST be the army general and if you include any Mortarch units he has to be one of them.`,
    when: [DURING_SETUP],
  },
]

export default Abilities
