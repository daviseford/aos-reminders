import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Fury of the Fyreslayers': {
    effects: [
      {
        name: `Fury of the Fyreslayers`,
        desc: `Add 1 to charge rolls for friendly FYRESLAYERS units wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Leader of the Duardrazhal': {
    effects: [
      {
        name: `Leader of the Duardrazhal`,
        desc: `If this general is on the battlefield, DUARDIN allied units are treated as if they have the FYRESLAYERS keyword for the purposes of the Ur-gold Runes battle trait (pg 57).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Spirit of Grimnir': {
    effects: [
      {
        name: `Spirit of Grimnir`,
        desc: `If this general is on the battlefield, when you make an activation roll for the purposes of the Ur-gold Runes battle trait (pg 57), the enhanced effect applies on a 5+ instead of a 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blood of the Berzerker': {
    effects: [
      {
        name: `Blood of the Berzerker`,
        desc: `Once per battle, in the combat phase, after this general has fought for the first time in that phase, you can say that they will go berserk. If you do so, this general can fight for a second time in that phase. The strike-last effect applies to this general when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ash-beard': {
    effects: [
      {
        name: `Ash-beard`,
        desc: `This general knows 2 prayers from the Zharrgrim Blessings prayer scripture (pg 60) instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Master Priest': {
    effects: [
      {
        name: `Master Priest`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield, you can activate 1 ur-gold rune that has already been activated using the Ur-gold Runes battle trait (pg 57) instead of 1 that has not yet been activated.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Avatar of Vulcatrix': {
    effects: [
      {
        name: `Avatar of Vulcatrix`,
        desc: `If this general is slain and there is not a Molten Infernoth invocation under your command on the battlefield, before removing this general from play, you can set up 1 Molten Infernoth within 6" of this general. If you do not have a Molten Infernoth in your army, this new Molten Infernoth is added to your army. After the invocation has been set up, remove this general from play and then apply the effects of the Molten Infernoth's Burning Tide ability.

        If this general is slain and there is a Molten Infernoth invocation under your command on the battlefield, remove this general from play and then apply the effects of the Molten Infernoth's Burning Tide ability as if the invocation has just been set up.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Raised Around Beasts': {
    effects: [
      {
        name: `Raised Around Beasts`,
        desc: `Improve the Rend characteristic of melee weapons used by friendly LOFNIR DROTHKEEPERS units that do not have the MAGMADROTH keyword and are wholly within 9" of this general by 2 if the target is a MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
