import { IArtifacts } from "types/army";

import { GAME_DURING, GAME_START, HERO_PHASE, COMBAT_PHASE_START, MOVEMENT_PHASE_START } from "types/meta";

const Artifacts: IArtifacts = {
    'Zoetic Dial': {
      desc:
        'Roll a dice after set-up is complete, but before the battle begins. In the battle round corresponding to the number you roll, you can re-roll failed save rolls for the bearer. If you roll a 6, you can decide to use this ability at the start of any one battle round, rather than having to use it in the 6th battle round.',
      when: [GAME_DURING],
    },
    'Incandescent Rectrices': {
      desc:
        'Roll a dice the first time a wound is allocated to the bearer that would slay them. On a 1-2 the bearer is slain. On a 3+ heal D6 wounds allocated to the bearer instead.',
      when: [GAME_DURING],
    },
    'Blade of Realities': {
      desc: 'Pick one of the bearer’s melee weapons. Improve the Rend characteristic of that weapon by 1.',
      when: [GAME_START],
    },
    'Light of Dracothion': {
      desc: 'Once per battle, you can automatically unbind one spell cast by an enemy WIZARD within 15" of the bearer.',
      when: [HERO_PHASE],
    },
    'Coronal Shield': {
      desc:
        'At the start of each combat phase, roll a dice for each enemy unit within 3" of the bearer. On a 4+ subtract 1 from hit rolls for that unit in that combat phase.',
      when: [COMBAT_PHASE_START],
    },
    'Prism of Amyntok': {
      desc:
        'Once per the battle, at the start of your movement phase, pick an enemy unit within 12" of the bearer and roll a dice. On a 1 that unit suffers 1 mortal wound. On a 2-5 that unit suffers D3 mortal wounds. On a 6 that unit suffers D6 mortal wounds.',
      when: [MOVEMENT_PHASE_START],
    },
  }

  export default Artifacts