import { TScenery } from 'types/army'
import { HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery: TScenery = [
  {
    name: `Skull Altar`,
    effects: [
      {
        name: `Skull Altar`,
        desc: `After territories have been chosen but before armies have been set up, you can set up the SKULL ALTAR for your army. The SKULL ALTAR must be set up wholly within your territory and more than 3" from any other terrain features and more than 1" from any objectives. If both players can set up any terrain features before armies are set up, they must roll off, and the winner chooses who sets up their terrain features first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Words of Hate`,
        desc: `You can re-roll prayer and judgement rolls for friendly KHORNE PRIESTS wholly within 8" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Witchbane`,
        desc: `Subtract 1 from casting rolls for WIZARDS while they are within 16" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Scenery
