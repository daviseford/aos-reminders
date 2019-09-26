import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Sanguine Pearl`,
    effects: [
      {
        name: `Sanguine Pearl`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer that was caused by a melee weapon. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Potion of Hateful Frenzy`,
    effects: [
      {
        name: `Potion of Hateful Frenzy`,
        desc: `Once per battle, in your hero phase, the bearer can drink this potion. If they do so, add 1 to hit and wound rolls for the bearer until your next hero phase. However, at the start of your next hero phase the bearer suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ankusha Spu`,
    effects: [
      {
        name: `Ankusha Spu`,
        desc: `Add 3" to the bearer's Move characteristic. In addition, re-roll hit rolls of 1 for attacks made by the bearer's mount.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Armour of the Cythai`,
    effects: [
      {
        name: `Armour of the Cythai`,
        desc: `Subtract 1 from hit rolls for melee weapons that target the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bio-shock Shell`,
    effects: [
      {
        name: `Bio-shock Shell`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will use the Bio-shock Shell. If you do so, each enemy unit within 3" of the bearer suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Abyssal Blade`,
    effects: [
      {
        name: `Abyssal Blade`,
        desc: `Pick a weapon carried by the bearer to be the Abyssal Blade. Improve the Rend characteristic of that weapon by 1. In addition, add 1 to the Damage characteristic of that weapon if the target has the SLAANESH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rune of the Surging Tide`,
    effects: [
      {
        name: `Rune of the Surging Tide`,
        desc: `Once per battle, at the start of your hero phase, you can say that the bearer will use the Rune of the Surging Tide. If you do so, say whether the rune will be used to create a stream or a riptide. If a stream is created, add 1" to the Move characteristic of friendly IDONETH DEEPKINunits until your next hero phase. If a riptide is created, subtract 1" from the Move characteristic of enemy units until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Black Pearl`,
    effects: [
      {
        name: `Black Pearl`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lliandra's Last Lament`,
    effects: [
      {
        name: `Lliandra's Last Lament`,
        desc: `Once per battle, at the start of the battleshock phase, you can say that the bearer will release Lliandra's Last Lament. If you do so, friendly IDONETH DEEPKIN units wholly within 18" of the bearer do not have to take battleshock tests that phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Terrornight Venom`,
    effects: [
      {
        name: `Terrornight Venom`,
        desc: `Pick a weapon carried by the bearer to be coated with Terrornight Venom. Re-roll wound rolls of 1 for that weapon. In addition, subtract 1 from the Bravery characteristic of enemy units that suffer any wounds from this weapon for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cloud of Midnight`,
    effects: [
      {
        name: `Cloud of Midnight`,
        desc: `Once per battle, at the start of any phase, the bearer can release the Cloud of Midnight. If they do so, they cannot be chosen as the target for attacks, spells or abilities for the rest of the phase, but cannot themselves attack or use spells and abilities for the rest of the phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Cloud of Midnight`,
        desc: `Once per battle, at the start of any phase, the bearer can release the Cloud of Midnight. If they do so, they cannot be chosen as the target for attacks, spells or abilities for the rest of the phase, but cannot themselves attack or use spells and abilities for the rest of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Cloud of Midnight`,
        desc: `Once per battle, at the start of any phase, the bearer can release the Cloud of Midnight. If they do so, they cannot be chosen as the target for attacks, spells or abilities for the rest of the phase, but cannot themselves attack or use spells and abilities for the rest of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Whorlshell`,
    effects: [
      {
        name: `Whorlshell`,
        desc: `Once per battle, at the start of your hero phase, you can say that the bearer will use the Whorlshell. If you do so, pick an enemy HEROwithin 9" of the bearer that is visible to them and roll 2D6. If the roll is greater than the enemy hero's Bravery characteristic, subtract 1 from hit rolls for the enemy hero for the rest of the battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Steelshell Pearl`,
    effects: [
      {
        name: `Steelshell Pearl`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer that was caused by a missile weapon. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mind Flare`,
    effects: [
      {
        name: `Mind Flare`,
        desc: `Once per battle, at the start of a combat phase, pick an enemy unit within 3" of the bearer. Subtract 1 from hit rolls for that unit until the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dritchleech`,
    effects: [
      {
        name: `Dritchleech`,
        desc: `Subtract 1 from the casting rolls of WIZARDS while they are within 18" of the bearer. IDONETH DEEPKINWIZARDS are not affected by this artifact.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Auric Lantern`,
    effects: [
      {
        name: `Auric Lantern`,
        desc: `At the start of your shooting phase, pick an enemy unit within 18" of the bearer that is in cover. Until your next shooting phase, that enemy unit does not receive the benefit to its saving throw for being in cover.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Disharmony Stones`,
    effects: [
      {
        name: `Disharmony Stones`,
        desc: `Once per battle, at the start of your hero phase, pick up to two enemy HEROES that are within 12" of the bearer. The opposing player must then choose one of the following options:
        
        a) Roll a D6 for each HERO picked. On a 3+ that hero suffers 1 mortal wound.
        
        b) Roll a D6 for each HERO picked. On a 5+ that hero suffers D3 mortal wounds.
        
        c) Each HERO picked suffers D3 mortal wounds. Then roll a D6. On a 4+ the bearer suffers D3 mortal wounds`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Brain Barnacles`,
    effects: [
      {
        name: `Brain Barnacles`,
        desc: `Once per battle, at the start of your hero phase, pick an enemy HERO within 12" of the bearer and roll 2D6. If the roll is equal to or greater than the distance between the bearer and that hero, the enemy hero is infected. Subtract 1 from hit rolls and casting rolls for the infected hero for the rest of the battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcane Pearl`,
    effects: [
      {
        name: `Arcane Pearl`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Sands of Infinity`,
    effects: [
      {
        name: `Sands of Infinity`,
        desc: `You can use the Sands of Infinity once per battle, before making a casting roll for the bearer for a spell whose effects would normally last until your next hero phase. If you do so, and the spell is successfully cast and not unbound, then the effects of the spell last until your hero phase after your next hero phase instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Coral Ring`,
    effects: [
      {
        name: `Coral Ring`,
        desc: `Once per battle, you can re-roll a failed casting roll for the bearer. In addition, once per battle, you can re-roll a failed unbinding roll for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bauble of Buoyancy`,
    effects: [
      {
        name: `Bauble of Buoyancy`,
        desc: `The bearer can fly. In addition, double the result of run rolls for the bearer.`,
        when: [DURING_GAME],
      },
      {
        name: `Bauble of Buoyancy`,
        desc: `The bearer can fly. In addition, double the result of run rolls for the bearer.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Kraken Tooth`,
    effects: [
      {
        name: `Kraken Tooth`,
        desc: `Once per battle, in your shooting phase, pick an enemy unit within 12" of the bearer that is visible to them. Then, roll a D6 and look up the result below.
        
        1: The bearer suffers D3 mortal wounds.
        
        2-5: The enemy unit suffers D3 mortal wounds.
        
        6: Pick one model in the enemy unit. The model you pick is slain if it has a Wounds characteristic of less than 10, and suffers 2D6 mortal wounds if it has a Wounds characteristic of 10+`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Augury Shells`,
    effects: [
      {
        name: `Augury Shells`,
        desc: `Once per battle, at the start of your hero phase, roll 2D6. During that hero phase, you can use that roll as the result of a casting roll for the bearer, or as the result of an unbinding roll for an enemy WIZARDthat is attempting to unbind a spell cast by the bearer. You must say that you will use that roll before the actual casting or unbinding roll is made.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Artifacts
