import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_traits from './command_traits'
import units from './units'

const RegularBattalions = {
  'Skyborne Slayers': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Celestant', 'Liberators', 'Judicators', 'Decimators', 'Protectors'])],
    },
    effects: [
      {
        name: `Hurled by Sigmar's Hand`,
        desc: `Instead of setting up a unit from the Skyborne Slayers on the battlefield, you can place it to one side and say that it is set up in the Celestial Realm.`,
        when: [DURING_SETUP],
      },
      {
        name: `Hurled by Sigmar's Hand`,
        desc: `In any of your movement phases, you can transport all of the units from the Skyborne Slayers that you have placed to one side onto the battlefield. When you do so, pick a point anywhere on the battlefield, then set up all of the units within 12" of that point and more than 5" from any enemy models. This is their move for that movement phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Honour of the God-King`,
        desc: `Units from the Skyborne Slayers never need to take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Grand Convocation': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Exorcist', 'Knight-Incantor'])],
    },
    effects: [
      {
        name: `Powers Combined`,
        desc: `Add 1 to casting rolls for WIZARDS from this battalion when they are wholly within 9" of two or more other WIZARDS from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hailstorm Battery': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Ordinator', 'Castigators', 'Celestar Ballista'])],
    },
    effects: [
      {
        name: `Hailstorm Strike`,
        desc: `You can reroll failed hit rolls for attacks made by the CELESTAR BALLISTA from this battalion if the unit of CASTIGATORS from the same battalion inflicted one or more wounds on the target unit in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Cleansing Phalanx': {
    mandatory: {
      units: [keyPicker(units, ['Evocators', 'Sequitors'])],
    },
    effects: [
      {
        name: `Channelled Empowerment`,
        desc: `If a unit of EVOCATORS from this battalion successfully casts their Empower spell on a unit of SEQUITORS from the same battalion, and the spell is not unbound, you can reroll failed hit rolls for attacks made by the SEQUITORS unit in addition to the effects of the spell.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vanguard Angelos Conclave': {
    mandatory: {
      units: [keyPicker(units, ['Vanguard-Palladors', 'Vanguard-Hunters'])],
    },
    effects: [
      {
        name: `Aetheric Wake`,
        desc: `When units from this battalion use the Ride the Winds Aetheric ability, roll 9 dice instead of 6 dice when determining the distance moved.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Vanguard Justicar Conclave': {
    mandatory: {
      units: [keyPicker(units, ['Aetherwings'])],
    },
    effects: [
      {
        name: `Fight in Concert`,
        desc: `You can reroll hit rolls of 1 for attacks made with missile weapons by units of VANGUARD-RAPTORS from this battalion, if the target of that attack is an enemy unit within 18" of any AETHERWING units from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Lightning Echelon': {
    mandatory: {
      units: [keyPicker(units, ['Fulminators', 'Tempestors'])],
    },
    effects: [
      {
        name: `Line-breaker Assault`,
        desc: `Once per battle, you can make a line-breaker assault with each unit from this battalion that made a charge move that charge phase. Pick one enemy unit within 1" of each unit making a line-breaker assault. That enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },

  'Thunderwave Echelon': {
    mandatory: {
      units: [keyPicker(units, ['Concussors', 'Desolators'])],
    },
    effects: [
      {
        name: `Ride of the Annihilators`,
        desc: `Subtract 1 from the Bravery of enemy units while they are within 3" of one or more units from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Drakesworn Temple': {
    mandatory: {
      units: [keyPicker(units, ['Drakesworn Templar'])],
    },
    effects: [
      {
        name: `Nova Surge`,
        desc: `Once per battle, you can summon a celestial wave. If you do so, each unit within 3" of any models from this battalion is caught in the celestial wave. Each enemy unit caught in the celestial wave suffers D3 mortal wounds. Heal D3 wounds allocated to each friendly STORMCAST ETERNAL unit caught in the celestial wave.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lords of the Storm': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Relictor'])],
    },
    effects: [
      {
        name: `Storm-born Commanders`,
        desc: `If any HEROES from this battalion are on the battlefield, roll a D6. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Thunderhead Brotherhood': {
    mandatory: {
      units: [keyPicker(units, ['Liberators', 'Judicators'])],
    },
    effects: [
      {
        name: `Sigmarite Shieldwall`,
        desc: `You can reroll save rolls of 1 for attacks that target a unit of JUDICATORS from this battalion if that unit is wholly within 3" of a unit of LIBERATORS from the same battalion that has any models carrying a Sigmarite Shield.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Hammerstrike Force': {
    mandatory: {
      units: [keyPicker(units, ['Protectors'])],
    },
    effects: [
      {
        name: `Celestial Supercharge`,
        desc: `Pick one unit of PALADINS from this battalion that is wholly within 9" of the unit of PROSECUTORS from the same battalion. If you do so, add 1 to wound rolls for attacks made by the unit you pick until the end of the turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vanguard Wing': {
    mandatory: {
      units: [keyPicker(units, ['Protectors', 'Liberators', 'Judicators'])],
    },
    effects: [
      {
        name: `Bearers of the Storm`,
        desc: `If the unmodified hit roll for an attack made by a unit of LIBERATORS from this battalion that is wholly within 16" of a unit of PROSECUTORS from the same battalion is 6, add 1 to the Damage of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Devastation Brotherhood': {
    mandatory: {
      units: [keyPicker(units, ['Retributors', 'Protectors', 'Decimators', 'Protectors', 'Judicators'])],
    },
    effects: [
      {
        name: `Crushing Assault`,
        desc: `If an enemy unit suffers wounds from attacks made by all three units of PALADINS from this battalion in the same combat phase, that enemy unit suffers D6 mortal wounds at the end of that combat phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Soulstrike Brotherhood': {
    mandatory: {
      units: [keyPicker(units, ['Vanguard-Hunters', 'Castigators', 'Celestar Ballista'])],
    },
    effects: [
      {
        name: `Interception Force`,
        desc: `If any units of VANGUARD-HUNTERS from this battalion were on the battlefield at the start of a turn in which a reserve SACROSANCT unit from the same battalion is set up on the battlefield for the first time, add 1 to the Attacks of missile weapons used by that SACROSANCT unit in that turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Sempiternals Grand Convocation': {
    mandatory: {
      units: [keyPicker(units, ['Lynus Ghalmorian on Gryph Charger', 'Lord-Exorcist', 'Knight-Incantor'])],
    },
    effects: [
      {
        name: `Thwart the Arcane`,
        desc: `Add 2 to the unbinding rolls for WIZARDS from this battalion while they are wholly within 9" of two or more other WIZARDS from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sempiternals Hailstorm Battery': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Ordinator', 'Castigators', 'Celestar Ballista'])],
    },
    effects: [
      {
        name: `Deadly Hail`,
        desc: `You can reroll wound rolls of 1 for attacks made with missile weapons by units from this battalion if they are wholly within 12" of the LORD-ORDINATOR from this battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Sempiternals Cleansing Phalanx': {
    mandatory: {
      units: [keyPicker(units, ['Evocators', 'Sequitors'])],
    },
    effects: [
      {
        name: `Weapons Ablaze`,
        desc: `If a unit of EVOCATORS from this battalion successfully casts their Empower spell on a unit of SEQUITORS from the same battalion, and the spell is not unbound, improve the Rend characteristics of weapons used by that SEQUITORS unit by 1 until the start of your next hero phase, in addition to the effects of the spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Stormcast Eternals Blessed Host': {
    effects: [
      {
        name: `Star-blessed Sigmarite`,
        desc: `Blessed Host units have a Save characteristic of 3+ whilst they are within 12" of their Lord-Celestant.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Hammerhands Lords of the Storm': {
    effects: [
      {
        name: `Stand Firm, Brothers`,
        desc: `If a hero from this battalion is slain by a wound or mortal wound while wholly within 6" of any other heros from this battalion, roll a D6. On a 5+ the wound is negated and the model is not slain.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Hammerhands Thunderhead Brotherhood': {
    effects: [
      {
        name: `Storied Veterans`,
        desc: `You can reroll hits of 1 for this batallion's Liberator units targetting units that have had at least one wound inflicted by any of this battalion's Judicators.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hammerhands Hammerstrike Force': {
    effects: [
      {
        name: `Dauntless Spirit`,
        desc: `You can reroll wounds of 1 for this battalion's melee attacks targeting units with greater number of models than the attacking unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Steel Souls Lords of the Storm': {
    effects: [
      {
        name: `Saintly Assault`,
        desc: `Once per battle, you can reroll charge rolls from units in this battalion until the end of the phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Saintly Assault`,
        desc: `If active, add 1 to the melee attacks characteristic from this battalion's units until the end of the turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Steel Souls Thunderhead Brotherhood': {
    effects: [
      {
        name: `Strength Through Sacrifice`,
        desc: `If any models from a unit in this battalion were slain in this combat phase, add 1 to the bravery characteristic of that unit until the end of the turn.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Steel Souls Hammerstrike Force': {
    effects: [
      {
        name: `Beacons of Faith`,
        desc: `Subtract 1 from enemy wizard casting rolls while they are within 8" of this battalion's units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Ven Brecht's Black Watch": {
    mandatory: {
      units: [keyPicker(units, ['Lord-Veritant', 'Gryph-Hounds', 'Judicators', 'Castigators'])],
      command_traits: [keyPicker(command_traits, ['Fiendslayer'])],
    },
    effects: [
      {
        name: `Ever Vigilent`,
        desc: `You can remove the battalion units from the battlefield. You may then set up the Lord-Veritant more than 9" from enemy units followed by the remaining battalion units, again more than 9" from the enemy and wholly within 12" of the Lord-Veritant.`,
        when: [END_OF_SETUP],
      },
    ],
  },
}

const StormkeepBattalions = {
  'Wardens of the Stormkeep': {
    effects: [
      {
        name: `Watchful Commanders`,
        desc: `Roll 1 dice for each hero from this battalion, adding 3 to the roll if the hero is the general. On each 5+ you receive 1 command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  'Stormtower Garrison': {
    mandatory: {
      units: [keyPicker(units, ['Knight-Vexillor', 'Liberators'])],
    },
    effects: [
      {
        name: `Brothers in Arms`,
        desc: `Paladin and Justicar battalion units wholly within 12" of any battalion Liberators units can use the Shield of Civilisation trait.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Stormkeep Patrol': {
    mandatory: {
      units: [keyPicker(units, ['Lord-Veritant', 'Gryph-Hounds'])],
    },
    effects: [
      {
        name: `Ever Vigilent`,
        desc: `You can remove the battalion units from the battlefield. You may then set up the Lord-Veritant more than 9" from enemy units followed by the remaining battalion units, again more than 9" from the enemy and wholly within 12" of the Lord-Veritant.`,
        when: [END_OF_SETUP],
      },
    ],
  },
}

const SuperBattalions = {
  'Stormkeep Brotherhood': {
    mandatory: {
      battallions: [
        keyPicker(StormkeepBattalions, [
          'Wardens of the Stormkeep',
          'Stormtower Garrison',
          'Stormkeep Patrol',
        ]),
      ],
    },
    effects: [
      {
        name: `Defenders of the Faithful`,
        desc: `You can add 1 to wound rolls for this battalion's units while any of those unit's models are in your territory.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Sacrosanct Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Grand Convocation', 'Hailstorm Battery', 'Cleansing Phalanx']),
      ],
    },
    effects: [
      {
        name: `Celestial Fulcrum`,
        desc: `Pick a LORD-ARCANUM from this battalion. That model can attempt to cast 1 additional spell that hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sempiternals Sacrosanct Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, [
          'Sempiternals Grand Convocation',
          'Sempiternals Hailstorm Battery',
          'Sempiternals Cleansing Phalanx',
        ]),
      ],
    },
    effects: [
      {
        name: `Attuned to the Arcane`,
        desc: `At the start of your hero phase, you can pick 1 Lord-Arcanum from this battalion. If you do so, add 9" to the range of any spells successfully cast by that model in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Vanguard Auxiliary Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Vanguard Justicar Conclave', 'Vanguard Angelos Conclave']),
      ],
      units: [keyPicker(units, ['Lord-Aquilor'])],
    },
    effects: [
      {
        name: `Azyrite Hurricane`,
        desc: `Add 1 to the Attacks of missile weapons used by models from this battalion that are not HEROES.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Hammerhands Warrior Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Lords of the Storm', 'Thunderhead Brotherhood', 'Hammerstrike Force']),
      ],
    },
    effects: [
      {
        name: `Exemplars to All`,
        desc: `You can reroll saves of 1 for this battallion's units wholly within 8" of any of this battalion's heros.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Blood Feud`,
        desc: `You can reroll hits of 1 for attacks targeting Bloodbound units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Warrior Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Lords of the Storm', 'Thunderhead Brotherhood', 'Hammerstrike Force']),
      ],
    },
    effects: [
      {
        name: `Wrath of the Storm`,
        desc: `You can reroll failed wound rolls for attacks made by models from this battalion while there are 50 or more models from the same battalion on the battlefield.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Steel Souls Warrior Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Lords of the Storm', 'Thunderhead Brotherhood', 'Hammerstrike Force']),
      ],
    },
    effects: [
      {
        name: `Purifying Purge`,
        desc: `You can heal 1 wound allocated to each unit in this battalion.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Harbinger Chamber': {
    mandatory: {
      battallions: [keyPicker(RegularBattalions, ['Lords of the Storm', 'Vanguard Wing'])],
    },
    effects: [
      {
        name: `Celestial Nimbus`,
        desc: `Add 1 to hit rolls made by models from this batalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Exemplar Chamber': {
    mandatory: {
      battallions: [keyPicker(RegularBattalions, ['Lords of the Storm', 'Devastation Brotherhood'])],
    },
    effects: [
      {
        name: `Martial Bond`,
        desc: `If a unit from this battalion is destroyed in the combat phase, pick another unit from the same battalion. Add 1 to the Attacks of that unit's melee weapons for the rest of the battle. A unit cannot be picked to benefit from this ability more than once per battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Extremis Chamber': {
    mandatory: {
      battallions: [
        keyPicker(RegularBattalions, ['Lightning Echelon', 'Thunderwave Echelon', 'Drakesworn Temple']),
      ],
    },
    effects: [
      {
        name: `Borne by the High Star`,
        desc: `At the start of your first hero phase, you can transport all reserve units from this battalion that are in the Celestial Realm to the battlefield. If you do so, pick a point on the battlefield and set up the units wholly within 24" of that point and more than 9" from any enemy unit. Those units cannot move in the following movement phase. After setting up those units, roll a D6 for each enemy unit within 18" of the point you picked. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
}

const StormcastBattalions = { ...RegularBattalions, ...StormkeepBattalions, ...SuperBattalions }

// Always export using tagAs
export default tagAs(StormcastBattalions, 'battalion')
