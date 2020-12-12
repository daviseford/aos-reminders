import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { GreatEndrinworks } from './common'

const Artifacts = {
  'Masterwrought Armour': {
    effects: [
      {
        name: `Masterwrought Armour`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Hammer of Aetheric Might': {
    effects: [
      {
        name: `Hammer of Aetheric Might`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 1 mortal wound on the target in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Gattleson's Endless Repeater": {
    effects: [
      {
        name: `Gattleson's Endless Repeater`,
        desc: `Add 2 to the Attacks characteristic of the bearer's Volley Pistol.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Rune of Mark': {
    effects: [
      {
        name: `Rune of Mark`,
        desc: `After armies are set up, pick 1 enemy HERO. If that HERO is slain, before the model is removed from play you can give 1 share of aether-gold each to the 3 closest friendly KHARADRON OVERLORDS units to that HERO.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Flask of Vintage Amberwhisky': {
    effects: [
      {
        name: `Flask of Vintage Amberwhisky`,
        desc: `Once per battle, in your hero phase, you can either heal up to D6 wounds allocated to the bearer or heal up to 2 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Proclamator Mask-hailer': {
    effects: [
      {
        name: `Proclamator Mask-hailer`,
        desc: `Once per battle round, this general can use a command ability on their warscroll without a command point being spent.`,
        when: [DURING_ROUND],
      },
    ],
  },
  'Cyclonic Aethometer': {
    effects: [
      {
        name: `Cyclonic Aethometer`,
        desc: `When you use the bearer's Aetherstorm ability, add 1 to the dice roll that determines its effect.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Svaregg-Stein 'Illuminator' Flarepistol": {
    effects: [
      {
        name: `Svaregg-Stein 'Illuminator' Flarepistol`,
        desc: `The first time in a battle that the bearer's Ranging Pistol scores a hit on an enemy unit, you can reroll hit rolls for attacks made by other friendly KHARADRON OVERLORDS units that target that enemy unit in the same phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Voidstone Orb': {
    effects: [
      {
        name: `Voidstone Orb`,
        desc: `Once per battle, when you use the bearer's Aethersight ability, you can say that the bearer will use their Voidstone Orb. If you do so, the dispelling or unbinding roll for that use of the ability is automatically successful (do not roll the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  Cogmonculus: {
    effects: [
      {
        name: `Cogmonculus`,
        desc: `Once per phase, you can reroll 1 hit or wound roll for an attack made by the bearer, or reroll 1 save roll for an attack that targets the bearer. You cannot use this ability to reroll more than 1 dice per phase.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Aetherquartz Monolens': {
    effects: [
      {
        name: `Aetherquartz Monolens`,
        desc: `The bearer's Gaze of Grungni has a Range of 18" instead of 9".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Seismic Shock-gauntlets': {
    effects: [
      {
        name: `Seismic Shock-gauntlets`,
        desc: `After the bearer makes a charge move, you can pick 1 enemy unit within 1" of the bearer and roll a D6, On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Aether-injection Boosters': {
    effects: [
      {
        name: `Aether-injection Boosters`,
        desc: `When the bearer retreats, they can use the Disengage and Fly High abilities from the Grundstok Gunhauler warscroll.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Phosphorite Bomblets': {
    effects: [
      {
        name: `Phosphorite Bomblets`,
        desc: `Once per battle, in your shooting phase. you can pick 1 unit within 6" of this model and roll a D6. On a 2+ that unit suffers 1 mortal wound you can roll again. Keep on rolling until the target is destroyed or you roll a 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Miniaturised Aethermatic Repulsion Field': {
    effects: [
      {
        name: `Miniaturised Aethermatic Repulsion Field`,
        desc: `Each time the bearer is affected by a spell or endless spell, you can roll a D6. If you do so, on a 3+, ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
  'Emergency Ventplates': {
    effects: [
      {
        name: `Emergency Ventplates`,
        desc: `Once per battle, at the start of the enemy shooting phase, you can say that the bearer will use their Emergency Ventplates. If you do so, subtract 1 from hit rolls for attacks that target the bearer or any friendly unit wholly within 6" of the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Caustic Anatomiser': {
    effects: [
      {
        name: `Caustic Anatomiser`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will use their Caustic Anatomiser. If you do so, roll a D6 for each enemy model within 6" of this model. For each 5+, that model's unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Spell in a Bottle': {
    effects: [
      {
        name: `Spell in a Bottle`,
        desc: `Pick 1 endless spell. Any endless spell can be chosen (all restrictions are ignored) but you must pay any points required for the model. Once per battles the bearer can automatically cast that endless spell (do not roll 2D6) and it cannot be unbound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Staff of Ocular Optimisation': {
    effects: [
      {
        name: `Staff of Ocular Optimisation`,
        desc: `Pick 1 of the bearer's missile weapons. Add 1 to hit rolls for attacks made by that weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Aethersped Hammer': {
    effects: [
      {
        name: `Aethersped Hammer`,
        desc: `Pick 1 of the bearer's melee weapons. Add 2 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Breath of Morgrim': {
    effects: [
      {
        name: `Breath of Morgrim`,
        desc: `In your shooting phase, you can pick 1 enemy unit and roll 1 dice for each model from that unit within 6" of the bearer. For each 6, that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Galeforce Stave': {
    effects: [
      {
        name: `Galeforce Stave`,
        desc: `At the start of the enemy charge phase, you can pick 1 enemy unit within 12" of the bearer. Halve charge rolls for that unit in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  Grudgehammer: {
    effects: [
      {
        name: `Grudgehammer`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to hit rolls for attacks made by that weapon. In addition, if the unmodified wound roll for an attack made by that weapon that targets an enemy unit which was picked for the Chronicle of Grudges artycle is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Aethercharged Rune': {
    effects: [
      {
        name: `Aethercharged Rune`,
        desc: `Once per battle you can change either 1 hit roll for an attack made by the bearer or 1 save roll for an attack that targets the bearer to the toll of your choice.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs({ ...GreatEndrinworks, ...Artifacts }, 'artifact')
