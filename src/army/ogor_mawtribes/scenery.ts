import { TEntry } from 'types/data'
import { DURING_GAME, HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery: TEntry[] = [
  {
    name: `Great Mawpot`,
    effects: [
      {
        name: `Setup`,
        desc: `After territories have been chosen but before armies are set up, you can set up the GREAT MAWPOT anywhere on the battlefield more than 1" from any other terrain features, more than 12" from enemy territory and more than 6" from any objectives.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Vessel of the Gulping God`,
        desc: `Add 1 to casting or unbinding rolls for OGOR WIZARDS while they are within 1" of a GREAT MAWPOT from your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Battlebroth`,
        desc: `A GREAT MAWPOT is said to be either full or empty. At the start of the battle, it is full. In your hero phase, 1 friendly OGOR HERO within 6" of a full GREAT MAWPOT from your army can spend all of that GREAT MAWPOT's magic. If they do so, you can heal D3 wounds allocated to each friendly OGOR unit wholly within 36" of that GREAT MAWPOT (roll separately for each unit). Once the GREAT MAWPOT's magic has been spent, it is empty.`,
        when: [HERO_PHASE],
      },
      {
        name: `Throw 'Em In`,
        desc: `If an enemy model is slain within 6" of an empty GREAT MAWPOT from your army, it becomes full.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Scenery
