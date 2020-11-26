import { TAbilities } from 'types/army'
import { DURING_GAME } from 'types/phases'

const Abilities: TAbilities = [
  {
    name: `(Default)`,
    effects: [
      {
        name: `Aether-gold`,
        desc: `Each KHARADRON OVERLORDS HERO, SKYVESSEL and KHARADRON OVERLORDS unit with 10 or more models starts a battle with 1 share of aether-gold, Once per phase. you can say that 1 unit from your army that has any shares of aether-gold will spend 1 of them. If you do so, subtract 1 from that unit's Bravery characteristic for the rest of the battle, but you can pick a triumph it is eligible to use and immediately apply its effect to that unit. Ignore any restrictions on a triumph that say it can only be used once per battle if you pay to use it with a share of aether-gold.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Abilities
