import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  // Shared Command Traits
  'Death Dealer': {
    effects: [
      {
        name: `Death Dealer`,
        desc: `Once per battle, in the combat phase, after this general has fought for the first time in that phase, you can say that they will deal death. If you do so, this general can fight for a second time in that phase. The strike-last effect applies to this general when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Favoured of the Pantheon': {
    effects: [
      {
        name: `Favoured of the Pantheon`,
        desc: `EYE OF THE GODS HERO only. After deployment, you can roll once on the Eve of the Gods table for this general (pg 71).`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Arch-sorcerer': {
    effects: [
      {
        name: `Arch-sorcerer`,
        desc: `WIZARD only. This general knows all of the spells from the Lore of the Damned in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Idolater Lord': {
    effects: [
      {
        name: `Idolater Lord`,
        desc: `This general becomes a PRIEST. In addition, you can choose to replace the UNDIVIDED keyword on every UNDIVIDED CULTIST unit in your army with one of the following keywords: KHORNE, TEENTCH, NURGLE or SLAANESH. All CULTIST units must be given the same keyword and it must be one this general has too.`,
        when: [DURING_GAME],
      },
    ],
  },

  //SLAVES TO DARKNESS DAEMON PRINCES only
  'Not to be Denied': {
    effects: [
      {
        name: `Not to be Denied`,
        desc: `In each hero phase, once you have carried out a heroic action, if you did not carry out the heroic action with this general you carry out an additional heroic action with this general. The heroic action carried out with this general cannot be the same as the other heroic action you carried out in this phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bolstered by Chaos': {
    effects: [
      {
        name: `Bolstered by Chaos`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bolstered by Chaos`,
        desc: `This general becomes a MONSTER.`,
        when: [DURING_GAME, END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Radiance of Dark Glory': {
    effects: [
      {
        name: `Radiance of Dark Glory`,
        desc: `At the start of your hero phase, roll a dice for each friendly model within 9" of this general that has any  wounds allocated to them. On a 3+, you can heal 1 wound from the model being rolled for. If the model being rolled for is a MONSTER, on a 3+ you can heal up to 3 wounds instead.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Diabolic Majesty': {
    effects: [
      {
        name: `Diabolic Majesty`,
        desc: `UNDIVIDED only. Once per battle, when you carry out a heroic action with this general you can carry out any one of the heroic actions on its warscroll even if it does not have the required keywords.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')
