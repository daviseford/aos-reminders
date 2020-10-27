import { TAllegiances } from 'types/army'
import { DURING_GAME } from 'types/phases'
import CommonSonsOfBehematData from './common'

const { Breaker, Taker, Stomper } = CommonSonsOfBehematData.TRIBES

const Allegiances: TAllegiances = [
  {
    name: `${Taker} Tribe`,
    effects: [
      {
        name: `Get Rid Of 'Em!`,
        desc: `When using the Mightier Makes Rightier rule to determining control of an objective, each friendly MANCRUSHER GARGANT model counts as 15 models instead of 10, and each friendly MEGA-GARGANT counts as 30 models instead of 20.`,
        when: [DURING_GAME],
      },
      {
        name: `More Stuff For Me Collection`,
        desc: `Each time an enemy model with an artefact of power is slain, you can roll for a triumph on the Triumph table. You can use that triumph during the current battle, even if you have already used it. If you do not use it during the current battle, it is lost (you cannot use it in your next battle).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `${Stomper} Tribe`,
    effects: [{ name: ``, desc: ``, when: [] }],
  },
  {
    name: `${Breaker} Tribe`,
    effects: [{ name: ``, desc: ``, when: [] }],
  },
]

export default Allegiances
