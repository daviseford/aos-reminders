import { TTraits } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Emissary of the Master`,
    effects: [
      {
        name: `Emissary of the Master`,
        desc: `You can re-roll failed charge rolls for friendly DEATH units that are within 6" of this general at the start of the charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Favoured`,
    effects: [
      {
        name: `Mark of the Favoured`,
        desc: `Each time this general is selected as the target of an attack in the combat phase, roll a D6. On a 6+ the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Acolyte`,
    effects: [
      {
        name: `Dark Acolyte`,
        desc: `This general is a WIZARD that knows the Arcane Bolt and Mystic Shield spells, as well as a single spell from one of the Lores of the Dead. If this general is already a WIZARD, they may generate an additional spell from one of the Lores of the Dead.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `Mastery of Death`,
    effects: [
      {
        name: `Mastery of Death`,
        desc: `At the start of your hero phase, all friendly DEATH units within 6" of this general may immediately make a move of up to 3" as if it were your movement phase. They may not run as part of this move.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Peerless Commander`,
    effects: [
      {
        name: `Peerless Commander`,
        desc: `This general may summon a unit from a gravesite whilst they are within 12" rather than 9".`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Bound to the Master`,
    effects: [
      {
        name: `Bound to the Master`,
        desc: `This general may use Arkhan the Black's First of the Mortarchs command ability.\n\n (Until the end of the hero phase all friendly DEATH WIZARDS within 18" of this general can increase the range of their spells by 6".)`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
]

export default CommandTraits
