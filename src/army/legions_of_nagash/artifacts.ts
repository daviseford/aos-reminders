import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  SHOOTING_PHASE,
  DURING_GAME,
  DURING_TURN,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Deathforged Chain (Artefacts of Nagash)`,
    effects: [
      {
        name: `Deathforged Chain (Artefacts of Nagash)`,
        desc: `The bearer heals 1 wound at start of hero phase`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Balefire Lantern (Artefacts of Nagash)`,
    effects: [
      {
        name: `Balefire Lantern (Artefacts of Nagash)`,
        desc: `-1 to wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for enemy WIZARDS within 6" of the bearer`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Timeglass (Artefacts of Nagash)`,
    effects: [
      {
        name: `Grave-sand Timeglass (Artefacts of Nagash)`,
        desc: `Once per battle, whilst the bearer is on the battlefield, pick an enemy HERO on the battlefield. They suffer d3 mortal wounds. At the start of each of your subsequent hero phases, on a 4+ they suffer a mortal wound`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ossific Diadem (Artefacts of Nagash)`,
    effects: [
      {
        name: `Ossific Diadem (Artefacts of Nagash)`,
        desc: `Roll a dice every time you allocate a wound or mortal wound to a friendly DEATHRATTLE unit within 12" of the bearer. On a 6+ it's negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Amethyst Shard (Artefacts of Nagash)`,
    effects: [
      {
        name: `Amethyst Shard (Artefacts of Nagash)`,
        desc: `Once per battle, pick one of the bearers melee weapons. Until your next hero phase, +1 to hit and wound for that weapon`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Terrorgheist Mantle (Artefacts of Nagash)`,
    effects: [
      {
        name: `Terrorgheist Mantle (Artefacts of Nagash)`,
        desc: `Pick an enemy unit within 10" of the bearer and roll 2 dice. If the total is higher than the enemy unit's bravery characteristic, it suffers a number of mortal wounds equal to the difference.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spirit Cage (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Spirit Cage (Artefacts of Sacrament)`,
        desc: `Whenever an enemy HERO is slain within 6" of the bearer, add 1 to wound rolls for friendly DEATH units until the end of the turn.`,
        when: [DURING_TURN],
      },
    ],
  },
  {
    name: `Shroud of Darkness (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Shroud of Darkness (Artefacts of Sacrament)`,
        desc: `Subtract 1 to hit rolls for attacks targeting the bearer in the shooting phase if attacker is within 8". If attacker is more than 8" away, subtract 2 instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Asylumaticae (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Asylumaticae (Artefacts of Sacrament)`,
        desc: `Once per battle, in your hero phase, roll a dice. On a 1 the bearer suffers a mortal wound. On a 2+ each enemy unit within 12" of the bearer suffers 1 mortal wound`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `(Artefacts of Sacrament)`,
    effects: [
      {
        name: `(Artefacts of Sacrament)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Sacrament)`,
    effects: [
      {
        name: `(Artefacts of Sacrament)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Sacrament)`,
    effects: [
      {
        name: `(Artefacts of Sacrament)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Blood)`,
    effects: [
      {
        name: `(Artefacts of Blood)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Night)`,
    effects: [
      {
        name: `(Artefacts of Night)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Artefacts of Grief)`,
    effects: [
      {
        name: `(Artefacts of Grief)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `(Soulblight Artefacts)`,
    effects: [
      {
        name: `(Soulblight Artefacts)`,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default Artifacts
