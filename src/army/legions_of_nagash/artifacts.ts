import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  DURING_TURN,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Deathforged Chain (Nagash)`,
    effects: [
      {
        name: `Deathforged Chain (Nagash)`,
        desc: `At the start of your hero phase, the bearer heals 1 wound that has been allocated to it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Balefire Lantern (Nagash)`,
    effects: [
      {
        name: `Balefire Lantern (Nagash)`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for enemy WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Timeglass (Nagash)`,
    effects: [
      {
        name: `Grave-sand Timeglass (Nagash)`,
        desc: `Whilst the bearer is on the battlefield, once per battle, in your hero phase, you can pick an enemy HERO on the battlefield. The enemy hero suffers D3 mortal wounds. At the start of each of your subsequent hero phases, roll a D6. On a 4+ the enemy hero suffers 1 mortal wound.ent hero phases, on a 4+ they suffer a mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ossific Diadem (Nagash)`,
    effects: [
      {
        name: `Ossific Diadem (Nagash)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly DEATHRATTLE model within 12" of the bearer. On a 6+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Amethyst Shard (Nagash)`,
    effects: [
      {
        name: `Amethyst Shard (Nagash)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will merge the shard with one of their melee weapons. Pick one of the bearer's melee weapons. Until your next hero phase, add 1 to hit and wound rolls made for that weapon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Terrorgheist Mantle (Nagash)`,
    effects: [
      {
        name: `Terrorgheist Mantle (Nagash)`,
        desc: `In your shooting phase, you can declare that the bearer will unleash a death shriek. Pick an enemy unit within 10" of the bearer and roll 2 dice. If the total is higher than the enemy unit's Bravery characteristic, it suffers a number of mortal wounds equal to the difference.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spirit Cage (Sacrament)`,
    effects: [
      {
        name: `Spirit Cage (Sacrament)`,
        desc: `Whenever an enemy HERO is slain within 6" of the bearer, add 1 to wound rolls for friendly DEATH units within 12" of the bearer until the end of the turn.`,
        when: [DURING_TURN],
      },
    ],
  },
  {
    name: `Shroud of Darkness (Sacrament)`,
    effects: [
      {
        name: `Shroud of Darkness (Sacrament)`,
        desc: `Subtract 1 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is within 8" of the bearer. Subtract 2 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is more than 8" away from the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Asylumaticae (Sacrament)`,
    effects: [
      {
        name: `Asylumaticae (Sacrament)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will open the Asylumaticae. If you do so, roll a D6. On a 1 the bearer suffers a mortal wound. On a 2+ each enemy unit within 12" of the bearer suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wristbands of Black Gold (Sacrament)`,
    effects: [
      {
        name: `Wristbands of Black Gold (Sacrament)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer in the shooting phase. On a 4+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Azyrbane Standard (Sacrament)`,
    effects: [
      {
        name: `Azyrbane Standard (Sacrament)`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for ORDER WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Black Gem (Sacrament)`,
    effects: [
      {
        name: `Black Gem (Sacrament)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will shatter the Black Gem. Pick a point on the battlefield within 8" of the bearer. Roll a D6 for each unit within 3" of this point. On a 6+, one model from that unit is slain. If the unit has any models with wounds allocated to it, then that model must be the model that is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ring of Dominion (Blood)`,
    effects: [
      {
        name: `Ring of Dominion (Blood)`,
        desc: `When the bearer is selected to fight in the combat phase, you can pick an enemy model within 3" of them and roll a D6. On a 5+ you can pick a melee weapon that the enemy model is armed with (though not one that has a value for one or more characteristics that is given as '*' or 'See below'). For this combat phase, the bearer of this ring may attack with that weapon in addition to their own. Abilities, modifiers or re-rolls that apply to attacks made with that weapon when it is used by the enemy model do not apply to the attacks made with it by the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadeglass Decanter (Blood)`,
    effects: [
      {
        name: `Shadeglass Decanter (Blood)`,
        desc: `After armies have been set up but before the first battle round, select an enemy HERO. In your hero phase, as long as that hero is on the battlefield, you can roll a D6. If the result is higher than the number of the current battle round, that hero suffers 1 mortal wound.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `Orb of Enchantment (Blood)`,
    effects: [
      {
        name: `Orb of Enchantment (Blood)`,
        desc: `Once per battle, at the start of the combat phase, you can pick an enemy HERO within 3" of the bearer. In that combat phase, that enemy hero may not pile in, attack or use abilities.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soulbound Garments (Blood)`,
    effects: [
      {
        name: `Soulbound Garments (Blood)`,
        desc: `Re-roll save rolls of 1 for the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Oubliette Arcana (Blood)`,
    effects: [
      {
        name: `Oubliette Arcana (Blood)`,
        desc: `When an enemy WIZARD successfully casts a spell within 30" of the bearer, instead of attempting to unbind it you can declare that the Oubliette Arcana will attempt to capture the magical energies. Roll a D6. On a 6+ the spell is negated and has no effect. In addition, that spell may not be cast again by that WIZARD for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Amulet of Screams (Blood)`,
    effects: [
      {
        name: `Amulet of Screams (Blood)`,
        desc: `Once per battle, when an enemy Wizard successfully casts a spell, you can declare that the bearer will use the Amulet of Screams. If you do so, you cannot attempt to unbind the spell. Instead, roll a D6. On a 2+, the spell is not successfully cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vial of Pure Blood (Night)`,
    effects: [
      {
        name: `Vial of Pure Blood (Night)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will drink from the Vial of Pure Blood. If you do so, you can add 1 to hit and wound rolls for the bearer until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shard of Night (Night)`,
    effects: [
      {
        name: `Shard of Night (Night)`,
        desc: `Subtract 1 from the hit rolls of attacks that target the bearer in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Gem of Exsanguination (Night)`,
    effects: [
      {
        name: `Gem of Exsanguination (Night)`,
        desc: `Once per battle, at the start of the combat phase, you can pick an enemy unit within 6" of the bearer and roll a D6. On a 1 nothing happens. On a 2-5 the unit suffers D3 mortal wounds. On a 6+ the unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chiropteric Cloak (Night)`,
    effects: [
      {
        name: `Chiropteric Cloak (Night)`,
        desc: `At the start of the combat phase, you can declare that the bearer will feed the Chiropteric Cloak. If you do so, the bearer suffers 1 mortal wound. During that combat phase, each time the hit roll of an attack that targets the bearer is 1 or less, the attacking unit suffers 1 mortal wound after all its attacks have been resolved.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Morbheg's Claw (Night)`,
    effects: [
      {
        name: `Morbheg's Claw (Night)`,
        desc: `In your hero phase, you can declare that the bearer will carve sigils in the ground with this claw. If you do so, they may not move, charge or attack this turn, but you can add 2 to casting rolls made for friendly LEGION OF NIGHT WIZARDS within 12" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Curseblade (Night)`,
    effects: [
      {
        name: `Curseblade (Night)`,
        desc: `After armies have been set up but before the first battle round begins, you can pick an enemy HERO. In your hero phase, as long as the enemy hero is on the battlefield, you can roll a D6. On a 4+ that enemy hero suffers 1 mortal wound and you may heal a wound that has been allocated to the bearer.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
    ],
  },
  {
    name: `The Stalking Blade (Soulblight)`,
    effects: [
      {
        name: `The Stalking Blade (Soulblight)`,
        desc: `Pick one of the bearer's melee weapons. Keep a tally of the number of wounds allocated as a result of attacks made with that weapon. As soon as the total reaches 6 or more, the bearer heals D3 wounds that have been allocated to them, and you can add 1 to the Damage characteristic of that weapon for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Scabbing Plate (Soulblight)`,
    effects: [
      {
        name: `The Scabbing Plate (Soulblight)`,
        desc: `At the end of any combat phase in which the bearer caused any wounds to be allocated to any enemy models, you can heal 1 wound that has been allocated to the bearer.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crimson Wing (Soulblight)`,
    effects: [
      {
        name: `Crimson Wing (Soulblight)`,
        desc: `In your shooting phase, you can pick an enemy unit within 30" of the bearer and roll a D6. On a roll of 3+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Sigil of the Sanguine Throne (Soulblight)`,
    effects: [
      {
        name: `Sigil of the Sanguine Throne (Soulblight)`,
        desc: `Once per charge phase, you can re-roll a failed charge roll made for a friendly VAMPIRE unit within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Saccharine Goblet (Soulblight)`,
    effects: [
      {
        name: `The Saccharine Goblet (Soulblight)`,
        desc: `At start of the combat phase, you can declare that the bearer will drink from the Saccharine Goblet. If you do so, you can add 1 to hit and wound rolls for the bearer until the end of the phase. However, if no wounds are allocated as a result of these attacks, then the bearer suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ruby Vial (Soulblight)`,
    effects: [
      {
        name: `Ruby Vial (Soulblight)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will open the Ruby Vial. If you do so, then until your next hero phase, subtract 1 from the Bravery characteristic of enemy units and subtract 1 from the result of any charge rolls made for them.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
