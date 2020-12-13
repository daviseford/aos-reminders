import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, DURING_GAME, HERO_PHASE } from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Amethyst Glow': {
    effects: [
      {
        name: `Amethyst Glow`,
        desc: `This general is a WIZARD. They can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. They know the arcane bolt and mystic shield spells.\n\nIf this general is already a WIZARD, they know one extra spell from the Lore of Sorrows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vassal of the Craven King': {
    effects: [
      {
        name: `Vassal of the Craven King`,
        desc: `If this general is on the battlefield, each time you spend a command point, roll a D6. On a 5+ you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Tragic Emanations': {
    effects: [
      {
        name: `Tragic Emanations`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
