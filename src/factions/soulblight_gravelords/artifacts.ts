import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  // Legion of Blood
  'Ring of Dominion': {
    effects: [
      {
        name: `Ring of Dominion`,
        desc: `Each time the bearer is picked to fight in the combat phase, you can pick 1 enemy model within 3" of the bearer and roll a dice. On a 5+, pick 1 of that model's melee weapons.

        That model's unit suffers a number of mortal wounds equal to the Damage characteristic of the weapon you picked. You cannot pick a melee weapon that refers to a damage table or ability to determine its damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadeglass Decanter': {
    effects: [
      {
        name: `Shadeglass Decanter`,
        desc: `After armies have been set up but before the first battle round begins, you can pick 1 enemy HERO on the battlefield. In your hero phase, if the bearer and that HERO are on the battlefield, you can roll a dice. If the roll is equal to or greater than the number of the current battle round, that HERO suffers 1 mortal wound.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Orb of Enchantment': {
    effects: [
      {
        name: `Orb of Enchantment`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer and roll a dice. On a 3+, that HERO cannot be picked to fight in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Soulbound Garments': {
    effects: [
      {
        name: `Soulbound Garments`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Oubliette Arcana': {
    effects: [
      {
        name: `Oubliette Arcana`,
        desc: `Once per enemy hero phase, when an enemy WIZARD successfully casts a spell within 18" of the bearer and that spell is not unbound (even if a friendly WIZARD attempted to unbind the spell), before resolving the effects of that spell, you can roll a dice. On a 5+, that spell is unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amulet of Screams': {
    effects: [
      {
        name: `Amulet of Screams`,
        desc: `Once per battle, when an enemy WIZARD successfully casts a spell that is not unbound, you can say that the bearer will use their Amulet of Screams. If you do so, that WIZARD suffers mortal wounds after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Legion of Night
  'Vial of Pure Blood': {
    effects: [
      {
        name: `Vial of Pure Blood`,
        desc: `Once per battle, in your hero phase, you can say that the bearer will drink from their vial of pure blood. If you do so, add 1 to hit and wound rolls for attacks made with melee weapons by the bearer until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vial of Pure Blood`,
        desc: `If active, add 1 to hit and wound rolls for attacks made with melee weapons by the bearer until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shard of Night': {
    effects: [
      {
        name: `Shard of Night`,
        desc: `Ignore the Rend characteristic of missile weapons when making save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Gem of Exsanguination': {
    effects: [
      {
        name: `Gem of Exsanguination`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit within 6" of the bearer and roll a dice. On a 1, nothing happens, On a 2-5, that unit suffers D3 mortal wounds. On a 6, the unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Chiropteran Cloak': {
    effects: [
      {
        name: `Chiropteran Cloak`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets the bearer is 1, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Morbheg's Claw": {
    effects: [
      {
        name: `Morbheg's Claw`,
        desc: `In your hero phase, you can say that the bearer will carve sigils into the ground using Morbheg's claw. If you do so, add 2 to casting rolls for friendly LEGION OF NIGHT WIZARDS wholly within 12" of the bearer until your next hero phase. However, the bearer cannot make a normal move, make a charge move, shoot or fight until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Curseblade: {
    effects: [
      {
        name: `Curseblade`,
        desc: `After armies have been set up but before the first battle round begins, you can pick 1 enemy HERO on the battlefield. In your hero phase, if the bearer and that HERO are on the battlefield, roll a dice. On a 5+, that HERO suffers 1 mortal wound and you can heal 1 wound allocated to the bearer.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Curseblade`,
        desc: `In your hero phase, if the bearer and the previously-chosen HERO are on the battlefield, roll a dice. On a 5+, that HERO suffers 1 mortal wound and you can heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // VYRKOS
  'Ulfenkarnian Phylactery': {
    effects: [
      {
        name: `Ulfenkarnian Phylactery`,
        desc: `Friendly SOULBLIGHT GRAVELORDS units are affected by the Deathless Minions battle trait while they are wholly within 18" of the bearer instead of 12".`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Cloak of the Night Prowler': {
    effects: [
      {
        name: `Cloak of the Night Prowler`,
        desc: `The bearer can pile in an extra 3" when they make a pile-in move.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Sangsyron: {
    effects: [
      {
        name: `Sangsyron`,
        desc: `Pick 1 of the bearer's melee weapons. If the bearer made a charge move in the same turn, add D3 to the Attacks characteristic of that weapon until the end of that turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Vilnas' Fang": {
    effects: [
      {
        name: `Vilnas' Fang`,
        desc: `Once per battle, in your charge phase, you can say that the bearer will be imbued with Vilnas' stealth. If you do so, until the end of that phase, add 1 to charge rolls for the bearer for each other friendly VYRKOS DYNASTY VAMPIRE HERO on the battlefield.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Terminus Clock': {
    effects: [
      {
        name: `Terminus Clock`,
        desc: `Once per battle, at the start of the enemy hero phase, you can say that the bearer will stop the Terminus Clock. If you do so, until the end of that phase, subtract 1 from casting rolls for enemy WIZARDS.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Standard of the Ulfenwatch': {
    effects: [
      {
        name: `Standard of the Ulfenwatch`,
        desc: `Once per battle, at the start of the hero phase, you can say that the bearer will raise the standard of the Ulfenwatch. If you do so, until the end of that turn, each time your opponent spends a command point, roll a dice. On a 5+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  // Kastelai
  'Sword of the Red Seneschals': {
    effects: [
      {
        name: `Sword of the Red Seneschals`,
        desc: `Pick 1 of the bearer's melee weapons. In the combat phase, if any enemy models are slain by attacks made with that weapon, add 1 to wound rolls for attacks made by friendly SOULBLIGHT GRAVELORDS units wholly within 12" of the bearer until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Bloodsaint's Shield": {
    effects: [
      {
        name: `Bloodsaint's Shield`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Standard of the Crimson Keep': {
    effects: [
      {
        name: `Standard of the Crimson Keep`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Grave-sand Shard': {
    effects: [
      {
        name: `Grave-sand Shard`,
        desc: `Once per battle, at the start of the hero phase, you can say that the bearer will crush their grave-sand shard. If you do so, add 1 to rolls for the Deathless Minions battle trait for friendly SOULBLIGHT GRAVELORDS units wholly within 12" of the bearer until the end of that turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Fragment of the Keep': {
    effects: [
      {
        name: `Fragment of the Keep`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons by enemy units within 6" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Red Casket': {
    effects: [
      {
        name: `The Red Casket`,
        desc: `Once per battle, at the start of your charge phase, you can say that the bearer will draw upon the power of the Red Casket. If you do so, add 3 to charge rolls for the bearer in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },

  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [],
  //     },
  //   ],
  // },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')
