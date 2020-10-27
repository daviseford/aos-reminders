import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

export const GreatEndrinworks: TArtifacts = [
  {
    name: `The Last Word (Great Endrinwork)`,
    effects: [
      {
        name: `The Last Word (Great Endrinwork)`,
        desc: `At the end of the enemy charge phase you can pick 1 enemy unit that finished a charge move in that phase within 3" of this model. This model can shoot at that unit with its Great Sky Cannon, Great Skyhook or Great Volley Cannon.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)`,
    effects: [
      {
        name: `Hegsson Solutions 'Old Reliable' Hullplates (Great Endrinwork)`,
        desc: `Add 2 to this model's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ebullient Buoyancy Aid (Great Endrinwork)`,
    effects: [
      {
        name: `Ebullient Buoyancy Aid (Great Endrinwork)`,
        desc: `This model can fly high and/or disengage even while it has a garrison of 16 or more models.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Prudency Chutes (Great Endrinwork)`,
    effects: [
      {
        name: `Prudency Chutes (Great Endrinwork)`,
        desc: `If this model is destroyed, you do not have to roll to see if models in its garrison are slain (they all survive).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Magnificent Omniscope (Great Endrinwork)`,
    effects: [
      {
        name: `Magnificent Omniscope (Great Endrinwork)`,
        desc: `Add 2" to this model's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)`,
    effects: [
      {
        name: `Zonbarcorp 'Dealbreaker' Battle Ram (Great Endrinwork)`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model, and roll a number of dice equal to the charge roll for that charge move. For each 4+. that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Malefic Skymines (Great Endrinwork)`,
    effects: [
      {
        name: `Malefic Skymines (Great Endrinwork)`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit that can fly and is within 6" of this model and roll a D6. On a 2-3, that enemy unit suffers D3 mortal wounds. On a 4+ that enemy unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)`,
    effects: [
      {
        name: `Iggrind-Kaz Surge-injection Endrin Mk. IV (Great Endrinwork)`,
        desc: `When this model makes a normal move, you can add D3" to that move. If you wish, you can add 2D3" to that move instead of D3", but if you do so and you roll a double, then this model suffers 1 mortal wound after the move is made.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)`,
    effects: [
      {
        name: `Zonbarcorp 'Debtsettler' Spar Torpedo (Great Endrinwork)`,
        desc: `Once per battle, after this model makes its first charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Coalbeard's Collapsible Compartments (Great Endrinwork)`,
    effects: [
      {
        name: `Coalbeard's Collapsible Compartments (Great Endrinwork)`,
        desc: `This model can use the Flying Transport ability from the Arkanaut Ironclad warscroll. If it does so, the maximum number of models that can garrison it is 5 instead of 25, and it can always fly high and/or disengage no matter how many models are in its garrison.`,
        when: [DURING_GAME],
      },
    ],
  },
]

const Artifacts: TArtifacts = [
  {
    name: `Masterwrought Armour`,
    effects: [
      {
        name: `Masterwrought Armour`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Hammer of Aetheric Might`,
    effects: [
      {
        name: `Hammer of Aetheric Might`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 1 mortal wound on the target in addition to its normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gattleson's Endless Repeater`,
    effects: [
      {
        name: `Gattleson's Endless Repeater`,
        desc: `Add 2 to the Attacks characteristic of the bearer's Volley Pistol.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Rune of Mark`,
    effects: [
      {
        name: `Rune of Mark`,
        desc: `After armies are set up, pick 1 enemy HERO. If that HERO is slain, before the model is removed from play you can give 1 share of aether-gold each to the 3 closest friendly KHARADRON OVERLORDS units to that HERO.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Flask of Vintage Amberwhisky`,
    effects: [
      {
        name: `Flask of Vintage Amberwhisky`,
        desc: `Once per battle, in your hero phase, you can either heal up to D6 wounds allocated to the bearer or heal up to 2 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Proclamator Mask-hailer`,
    effects: [
      {
        name: `Proclamator Mask-hailer`,
        desc: `Once per battle round, this general can use a command ability on their warscroll without a command point being spent.`,
        when: [DURING_ROUND],
      },
    ],
  },
  {
    name: `Cyclonic Aethometer`,
    effects: [
      {
        name: `Cyclonic Aethometer`,
        desc: `When you use the bearer's Aetherstorm ability, add 1 to the dice roll that determines its effect.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Svaregg-Stein 'Illuminator' Flarepistol`,
    effects: [
      {
        name: `Svaregg-Stein 'Illuminator' Flarepistol`,
        desc: `The first time in a battle that the bearer's Ranging Pistol scores a hit on an enemy unit, you can reroll hit rolls for attacks made by other friendly KHARADRON OVERLORDS units that target that enemy unit in the same phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Voidstone Orb`,
    effects: [
      {
        name: `Voidstone Orb`,
        desc: `Once per battle, when you use the bearer's Aethersight ability, you can say that the bearer will use their Voidstone Orb. If you do so, the dispelling or unbinding roll for that use of the ability is automatically successful (do not roll the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cogmonculus`,
    effects: [
      {
        name: `Cogmonculus`,
        desc: `Once per phase, you can reroll 1 hit or wound roll for an attack made by the bearer, or reroll 1 save roll for an attack that targets the bearer. You cannot use this ability to reroll more than 1 dice per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aetherquartz Monolens`,
    effects: [
      {
        name: `Aetherquartz Monolens`,
        desc: `The bearer's Gaze of Grungni has a Range of 18" instead of 9".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Seismic Shock-gauntlets`,
    effects: [
      {
        name: `Seismic Shock-gauntlets`,
        desc: `After the bearer makes a charge move, you can pick 1 enemy unit within l" of the bearer and roll a D6, On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Aether-injection Boosters`,
    effects: [
      {
        name: `Aether-injection Boosters`,
        desc: `When the bearer retreats, they can use the Disengage and Fly High abilities from the Grundstok Gunhauler warscroll.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Phosphorite Bomblets`,
    effects: [
      {
        name: `Phosphorite Bomblets`,
        desc: `Once per battle, in your shooting phase. you can pick 1 unit within 6" of this model and roll a D6. On a 2+ that unit suffers 1 mortal wound you can roll again. Keep on rolling until the target is destroyed or you roll a 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Miniaturised Aethermatic Repulsion Field`,
    effects: [
      {
        name: `Miniaturised Aethermatic Repulsion Field`,
        desc: `Each time the bearer is affected by a spell or endless spell, you can roll a D6. If you do so, on a 3+, ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE, START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Emergency Ventplates`,
    effects: [
      {
        name: `Emergency Ventplates`,
        desc: `Once per battle, at the start of the enemy shooting phase, you can say that the bearer will use their Emergency Ventplates. If you do so, subtract 1 from hit rolls for attacks that target the bearer or any friendly unit wholly within 6" of the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Caustic Anatomiser`,
    effects: [
      {
        name: `Caustic Anatomiser`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will use their Caustic Anatomiser. If you do so, roll a D6 for each enemy model within 6" of this model. For each 5+, that model's unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spell in a Bottle`,
    effects: [
      {
        name: `Spell in a Bottle`,
        desc: `Pick 1 endless spell. Any endless spell can be chosen (all restrictions are ignored) but you must pay any points required for the model. Once per battles the bearer can automatically cast that endless spell (do not roll 2D6) and it cannot be unbound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  ...GreatEndrinworks,
]

export default Artifacts
