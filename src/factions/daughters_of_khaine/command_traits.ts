import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const CommandTraits = {
  'Bathed in Blood': {
    effects: [
      {
        name: `Bathed in Blood`,
        desc: `In the combat phase, each time an enemy model is slain by wounds caused by this general's attacks, you can heal 1 wound allocated to this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Zealous Orator': {
    effects: [
      {
        name: `Zealous Orator`,
        desc: `If this general issues the Rally command, you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sacrificial Overseer': {
    effects: [
      {
        name: `Sacrificial Overseer`,
        desc: `After this general has fought for the first time in the combat phase, if any enemy models were slain by wounds caused by this general's attacks in that phase, this general is said to be revelling in murder until the end of the phase. If this general is revelling in murder, they can fight for a second time in that phase. The strike-last effect applies to this general when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Master of Poisons': {
    effects: [
      {
        name: `Master of Poisons`,
        desc: `At the end of the combat phase, if any wounds caused by this general's attacks were allocated to any models on the battlefield in that phase, pick 1 of those models. That model suffers D6 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'True Believer': {
    effects: [
      {
        name: `True Believer`,
        desc: `Add 1 to the number of the current battle round when determining the abilities gained by this general from the Blood Rites battle trait (pg 66). This ability and other similar abilities are cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Arcane Mastery': {
    effects: [
      {
        name: `Arcane Mastery`,
        desc: `WIZARD only. This general knows all of the spells from the Lore of Shadows (pg 70) in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fuelled by Revenge': {
    effects: [
      {
        name: `Fuelled by Revenge`,
        desc: `MELUSAI IRONSCALE only. Once per battle, at the start of the combat phase, you can say that this general will wreak Khaine's vengeance. If you do so, until the end of that phase, add 1 to the Attacks characteristic of melee weapons used by friendly MELUSAI units wholly within 12" of this general.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')
