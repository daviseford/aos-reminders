import {
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_TURN,
  HERO_PHASE,
} from 'types/phases'

const Flavors = {
  Allherd: {
    effects: [
      {
        name: `Bestial Might`,
        desc: `At the end of the battleshock phase, you can return D3+3 slain models to each friendly ALLHERD GOR HERD, ALLHERD UNGORS and ALLHERD UNGOR RAIDERS unit on the battlefield.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  Gavespawn: {
    effects: [
      {
        name: `Gibbering Congregations`,
        desc: `You can include Gibbering Congregations in your army.`,
        when: [DURING_GAME],
      },
    ],
  },
  Darkwalkers: {
    effects: [
      {
        name: `Shadowbeasts`,
        desc: `At the end of your movement phase, you can pick 1 friendly DARKWALKERS GOR HERD, DARKWALKERS UNGORS or DARKWALKERS UNGOR RAIDERS unit that is wholly within 9" of the battlefield edge and say that it will slink into the shadows. If you do so, remove that unit from the battlefield and set it up again wholly within 9" of the battlefield edge and more than 9' from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  Quakefray: {
    effects: [
      {
        name: `Living Idols of Ruin`,
        desc: `Friendly QUAKEFRAY CYGOR units gain the PRIEST keyword.`,
        when: [DURING_GAME],
      },
      {
        name: `Living Idols of Ruin`,
        desc: `Earthshatter is a prayer, answer value of 3. Pick 1 objective within 12" and visible to the chanter. Each unit within 6" of that objective suffers D3 mortal wounds, and, until your next hero phase, when determining the number of models in units that are contesting that objective, that number must be halved (rounding down). This prayer has no effect on BEASTS OF CHAOS units.`,
        when: [HERO_PHASE],
        prayer: true,
      },
      {
        name: `Living Idols of Ruin`,
        desc: `Effected enemy units count as half when contesting the picked objective (rounding down). This prayer has no effect on BEASTS OF CHAOS units.`,
        when: [END_OF_TURN],
      },
    ],
  },
}

export default Flavors
