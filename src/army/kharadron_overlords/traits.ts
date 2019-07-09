import { TCommandTraits } from 'types/army'
import { HERO_PHASE, DURING_GAME, END_OF_SETUP, COMBAT_PHASE, START_OF_GAME } from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Doughty Champion`,
    effects: [
      {
        name: `Doughty Champion`,
        desc: `Ignore mortal wounds on 5+.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fleetmaster`,
    effects: [
      {
        name: `Fleetmaster`,
        desc: `Can remove SKYVESSEL and set-up again.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Grudgebearer`,
    effects: [
      {
        name: `Grudgebearer`,
        desc: `+1 Attack to chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Stickler for the Code`,
    effects: [
      {
        name: `Stickler for the Code`,
        desc: `Generate additional unique footnote. Lost if general is slain.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Prospector`,
    effects: [
      {
        name: `Prospector`,
        desc: `Choose terrain. While general is alive, units pass battleshock if on or within terrain.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Rising Star`,
    effects: [
      {
        name: `Rising Star`,
        desc: `Units within 7" can use General's Bravery.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits
