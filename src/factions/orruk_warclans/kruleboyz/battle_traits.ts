import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

const KruleboyzBattleTraits = {
  'Venom-encrusted Weapons': {
    effects: [
      {
        name: `Venom-encrusted Weapons`,
        desc: `If the unmodified hit roll for an attack made by a KRULEBOYZ ORRUK model is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a wound or save roll). This ability has no effect on attacks made by a mount.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(KruleboyzBattleTraits, 'battle_trait')
