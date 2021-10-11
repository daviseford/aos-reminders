import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE, HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const MountTraits = {
  Beastmaster: {
    effects: [
      {
        name: `Beastmaster`,
        desc: `COALESCED only. Once per battle, in your hero phase, you can declare that this mount will either be swift or savage. If you choose for it to be swift, until your next hero phase, it can run and still shoot and/or charge in the same turn. If you choose savage, until your next hero phase, add 1 to the Attacks characteristic of melee weapons used by this mount.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_OCTOBER_2021],
      },
    ],
  },
  'Celestial Destruction': {
    effects: [
      {
        name: `Celestial Destruction`,
        desc: `STARBORNE only. You can carry out this monstrous rampage with this unit instead of any other monstrous rampage you can carry out with this unit. If you do so, roll a dice for each enemy unit within 6" of this unit. Add 1 to the roll if the enemy unit has the CHAOS keyword. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_OCTOBER_2021],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')
