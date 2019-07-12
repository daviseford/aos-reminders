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
        desc: `At the start of your hero phase, the bearer heals 1 wound that has been allocated to it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Balefire Lantern (Artefacts of Nagash)`,
    effects: [
      {
        name: `Balefire Lantern (Artefacts of Nagash)`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for enemy WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Timeglass (Artefacts of Nagash)`,
    effects: [
      {
        name: `Grave-sand Timeglass (Artefacts of Nagash)`,
        desc: `Whilst the bearer is on the battlefield, once per battle, in your hero phase, you can pick an enemy HERO on the battlefield. The enemy hero suffers D3 mortal wounds. At the start of each of your subsequent hero phases, roll a dice. On a 4+ the enemy hero suffers 1 mortal wound.ent hero phases, on a 4+ they suffer a mortal wound`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ossific Diadem (Artefacts of Nagash)`,
    effects: [
      {
        name: `Ossific Diadem (Artefacts of Nagash)`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly DEATHRATTLE model within 12" of the bearer. On a 6+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Amethyst Shard (Artefacts of Nagash)`,
    effects: [
      {
        name: `Amethyst Shard (Artefacts of Nagash)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will merge the shard with one of their melee weapons. Pick one of the bearer's melee weapons. Until your next hero phase, add 1 to hit and wound rolls made for that weapon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Terrorgheist Mantle (Artefacts of Nagash)`,
    effects: [
      {
        name: `Terrorgheist Mantle (Artefacts of Nagash)`,
        desc: `In your shooting phase, you can declare that the bearer will unleash a death shriek. Pick an enemy unit within 10" of the bearer and roll 2 dice. If the total is higher than the enemy unit's Bravery characteristic, it suffers a number of mortal wounds equal to the difference.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spirit Cage (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Spirit Cage (Artefacts of Sacrament)`,
        desc: `Whenever an enemy HERO is slain within 6" of the bearer, add 1 to wound rolls for friendly DEATH units within 12" of the bearer until the end of the turn.`,
        when: [DURING_TURN],
      },
    ],
  },
  {
    name: `Shroud of Darkness (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Shroud of Darkness (Artefacts of Sacrament)`,
        desc: `Subtract 1 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is within 8" of the bearer. Subtract 2 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is more than 8" away from the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Asylumaticae (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Asylumaticae (Artefacts of Sacrament)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will open the Asylumaticae. If you do so, roll a dice. On a 1 the bearer suffers a mortal wound. On a 2+ each enemy unit within 12" of the bearer suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wristbands of Black Gold(Artefacts of Sacrament)`,
    effects: [
      {
        name: `Wristbands of Black Gold(Artefacts of Sacrament)`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer in the shooting phase. On a 4+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Azyrbane Standard (Artefacts of Sacrament)`,
    effects: [
      {
        name: `Azyrbane Standard (Artefacts of Sacrament)`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for ORDER WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Black Gem(Artefacts of Sacrament)`,
    effects: [
      {
        name: `Black Gem(Artefacts of Sacrament)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will shatter the Black Gem. Pick a point on the battlefield within 8" of the bearer. Roll a dice for each unit within 3" of this point. On a 6+, one model from that unit is slain. If the unit has any models with wounds allocated to it, then that model must be the model that is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ring of Dominion (Artefacts of Blood)`,
    effects: [
      {
        name: `Ring of Dominion (Artefacts of Blood)`,
        desc: `When the bearer is selected to fight in the combat phase, you can pick an enemy model within 3" of them and roll a dice. On a 5+ you can pick a melee weapon that the enemy model is armed with (though not one that has a value for one or more characteristics that is given as '*' or 'See below'). For this combat phase, the bearer of this ring may attack with that weapon in addition to their own.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadeglass Decanter (Artefacts of Blood)`,
    effects: [
      {
        name: `Shadeglass Decanter (Artefacts of Blood)`,
        desc: `After armies have been set up but before the first battle round, select an enemy HERO. In your hero phase, as long as that hero is on the battlefield, you can roll a dice. If the result is higher than the number of the current battle round, that hero suffers 1 mortal wound.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `Orb of Enchantment (Artefacts of Blood)`,
    effects: [
      {
        name: `Orb of Enchantment (Artefacts of Blood)`,
        desc: `Once per battle, at the start of the combat phase, you can pick an enemy HERO within 3" of the bearer. In that combat phase, that enemy hero may not pile in, attack or use abilities.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soulbound Garments (Artefacts of Blood)`,
    effects: [
      {
        name: `Soulbound Garments (Artefacts of Blood)`,
        desc: `Re-roll save rolls of 1 for the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Oubliette Arcana (Artefacts of Blood)`,
    effects: [
      {
        name: `Oubliette Arcana (Artefacts of Blood)`,
        desc: `When an enemy WIZARD successfully casts a spell within 30" of the bearer, instead of attempting to unbind it you can declare that the Oubliette Arcana will attempt to capture the magical energies. Roll a dice. On a 6+ the spell is negated and has no effect. In addition, that spell may not be cast again by that WIZARD for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Amulet of Screams (Artefacts of Blood)`,
    effects: [
      {
        name: `Amulet of Screams (Artefacts of Blood)`,
        desc: `Once per battle, when an enemy WIZARD successfully casts a spell, instead of attempting to unbind it you can declare that the bearer will use the Amulet of Screams. If you do so, roll a dice. On a 2+ the spell is negated and has no effect.`,
        when: [HERO_PHASE],
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
