import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_FIVE_HERO_PHASE,
  TURN_ONE_HERO_PHASE,
  TURN_ONE_START_OF_ROUND,
  TURN_THREE_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Tzeentch Allegiance
  'Allegiance Abilities': {
    effects: [
      {
        name: `Arcane Armies`,
        desc: `In the first battle round, after the players have received their starting command points, but before the start of the first turn, you can pick 1 friendly Disciples of Tzeentch Wizard on the battlefield. That Wizard can automatically cast that they know that summons a Burning Sigil of Tzeentch, Tome of Eyes or Daemonic Simulacrum endless spell (do not make a casting roll). That spell cannot be unbound, and cannot be dispelled in the first battle round. Set up the endless spell as described in the effect for that spell.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Masters of Destiny`,
        desc: `At the end of deployment, roll 9 dice and keep them to one side. These are your Destiny Dice. Destiny Dice can be used during the battle to change dice rolls.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Masters of Destiny`,
        desc: `Instead of making 1 of the rolls from the list below for a friendly Disciples of Tzeentch unit, you can spend 1 or more of your Destiny Dice. The roll you would have is replaced with the roll on the Destiny Dice you spend. If you want to replace an xD6 (core rules, 1.5.2), you must spend a number of Destiny Dice equal to the 'x'. Any rolls that have been replaced count as unmodified rolls and cannot be rerolled, changed or modified unless noted below. Destiny Dice can be spent in place of the following dice rolls:
        
        - Casting rolls
        - Unbinding rolls
        - Dispelling rolls
        - Run rolls
        - Charge rolls
        - Hit rolls
        - Wound rolls
        - Save rolls (You must still modify the roll by the Rend characteristic of the attacking weapon)
        - Any roll that determines the Damage characteristic of a missile or melee weapon
        - Battleshock rolls (You must still modify the roll by the number of models slain from the unit)
        
        Designer's Note: It is recommended the you represent your Destiny Dice with dice that are a different colour and/or size to those used for other rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `Locus of Change`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target friendly Disciples of Tzeentch Daemon units that are wholly within 12" of a friendly Disciples of Tzeentch Daemon Hero.`,
        when: [COMBAT_PHASE],
      },
      //Omitted Change Covens (you can pick 1 of the following subfactions)... not necessary
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `You can summon units of Disciples of Tzeentch Daemons units to the battlefield if you have enough Fate Points. Each time a casting roll is successful and the spell is not unbound, you receive 1 Fate Point. Designer's Note: You receive a Fate Point when a friendly or an enemy Wizard successfully casts a spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `If you have any Fate Points at the end of your movement phase, you can summon 1 unit from the list below to the battlefield and add it to your army. Each unit you summon costs the number of Fate Points shown on the list, and you can only summon it if you have enough Fate Points to do so. Units must be set up more than 9" from any enemy units and wholly within 9" of a friendly Disciples of Tzeentch Hero.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `Summoning Costs:
               1 Lord of Change -                     30 FP
               1 Fateskimmer on Burning Chariot -     24 FP
               10 Pink Horrors of Tzeentch -          20 FP
               1 Burning Chariot of Tzeentch -        18 FP
               3 Flamers of Tzeentch-                 18 FP
               1 Changecaster, Herald of Tzeentch -   12 FP
               1 Exalted Flamer of Tzeentch -         12 FP
               1 Fluxmaster, Herald of Tzeentch -     12 FP
               10 Blue Horrors of Tzeentch -          10 FP
               10 Brimstone Horrors of Tzeentch -     10 FP
               3 Screamers of Tzeentch -              10 FP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Transformed to Spawn`,
        desc: `If a model is transformed into a Spawn, you can add 1 Tzeentch Chaos Spawn unit that has 1 model to your army. Set up the Tzeentch Chaos Spawn unit within 1" of the model that has been transformed, adn then remove the transform model from play.
        
        Designer's Note: A transformed model does not count as a slain model for the purposes of the Battleshock rules, and cannot be returned if you are allowed to bring back slain models (the model has not been slain). In addition, if your general is transformed to spawn, that Chaos Spawn becomes the general and cannot issue commands.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Call for Change`,
        desc: `You complete this battle tactic if you summon a Lord of Change to the battlefield this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Mass Conjuration`,
        desc: `Pick 1 friendly Disciples of Tzeentch Wizard. You complete this battle tactic if that Wizard successfully casts 3 or more spells in that turn and none of those spells are unbound.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ninefold Dismantelment`,
        desc: `Pick 1 enemy unit that has 9 or more models, or pick 1 enemy Hero or Monster with a Wounds characteristic of 9 ore more. You complete this battle tactic if that unit is destroyed by the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Reckless Abandon`,
        desc: `Pick 1 friendly Mortal Disciples of Tzeentch unit that is more than 18" from all enemy units. You complete this battle tactic if that unit completes a charge move in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Tides of Anarchy`,
        desc: `You complete this battle tactic if you gain control of an objective that was controlled by your opponent at the start of your hero phase, and you have 9 ore more friendly models within 6" of that objective when you gain control of it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Eternal Conflagration Flavor
  'Twisters of Materiality': {
    effects: [
      {
        name: `Twisters of Materiality`,
        desc: `Improve the Rend characteristic of friendly Eternal Conflagration units' Warpflame, Billowing Warpflame, and Magical Flames missile weapons by 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Hosts  Duplicitous Flavor
  'Ranks of Mischievous Mirages': {
    effects: [
      {
        name: `Ranks of Mischievous Mirages`,
        desc: `Enemy units within 3"of a friendly Hosts Duplicitous unit
        models cannot retreat. In addition, once per battle, when a Hosts
        Horrors of Tzeentch unit from your starting army is destroyed
        a dice. On a 4+, add a Hosts Duplicitous Horrors of Tzeentch
        models to your army. Set up the new unit wholly within 12" of a friendly Hosts Duplicitious Hero and more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE, DURING_GAME],
      },
    ],
  },
  // Hosts Arcanum Flavor
  'Thieves of All Things Arcane': {
    effects: [
      {
        name: `Thieves of All Things Arcane`,
        desc: `Once per turn, in the first, third, and fifth battle rounds, when a friendly Host Arcanum Wizard attempts to unbind a spell, you can choose for the spell to be automatically unbound (do not roll 2D6).`,
        when: [TURN_ONE_HERO_PHASE, TURN_THREE_HERO_PHASE, TURN_FIVE_HERO_PHASE],
      },
    ],
  },
  // Cult of Transient Form Flavor
  'The Change-gift': {
    effects: [
      {
        name: `The Change-gift`,
        desc: `Roll a dice each time a friendly Cult of the Transient Form Kairic Acolyte model is slain in the combat phase. On a 2-5, before removing that model from play, that model can fight. On a 6, before removing that model from play, you can add 1 Tzaangor model to a friendly Tzaangor Host unit within 9" of the slain model. The new model can only be set up within 3" of an enemy unit if the unit to which it is added is within 3" of that enemy unit.'`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Pyrofane Cult Flavor
  'Arrows of Tzeentch': {
    effects: [
      {
        name: `Arrows of Tzeentch`,
        desc: `Add 1 to hit rolls for attacks made with Sorcerous Bolts by friendly Pyrofane Cult Kairic Acolytes units. In addition, at the end of your shooting phase, roll a dice for each enemy unit that suffered any wounds caused by attacks made with Sorcerous Bolts by friendly Pyrofane Cult units in that phase. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Arrows of Tzeentch`,
        desc: `In addition, at the end of your shooting phase, roll a dice for each enemy unit that suffered any wounds caused by attacks made with Sorcerous Bolts by friendly Pyrofane Cult units in that phase. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_SHOOTING_PHASE],
      },
    ],
  },
  // Guild of Summoners Flavor
  'Scions of the Exiled': {
    effects: [
      {
        name: `Scions of the Exiled`,
        desc: `If your army has the Guild of Summoners keyword, your Fate Points can only be used to summon Lord of Change units. Instead of a Fate Point cost of 30, a Guild of Summoners Lord of Change costs 9 Fate Points to summon the first time, and 18 Fate Points each time thereafter for the rest of the battle. In addition, Lord of Change units summoned in this way must be set up wholly within 9" of a Guild of Summoners Arcanite Hero and more than 9" from all enemy units.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
