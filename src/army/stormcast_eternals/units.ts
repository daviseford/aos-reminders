import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  END_OF_CHARGE_PHASE,
  SHOOTING_PHASE,
  END_OF_COMBAT_PHASE,
  START_OF_COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  BATTLESHOCK_PHASE,
  DURING_GAME,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Celestant-Prime`,
    effects: [
      {
        name: `Cometstrike Sceptre`,
        desc: `In your shooting phase, you can pick a point on the battlefield within 24" of this model that is visible to them. Each unit within D6" of that point suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is set up in the Heavens as a reserve unit.`,
        when: [DURING_SETUP],
      },
      {
        name: `Strike from the Heavens`,
        desc: `At the end of your movement phase you must declare whether this model will remain in reserve or strike from the Heavens. If this model strikes from the Heavens, set this model up on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike from the Heavens`,
        desc: `For every round this model remains in reserve, add 2 to the Attacks characteristic of Ghal Maraz until the end of the battle.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Retribution from On High`,
        desc: `If this model was setup via Strike from the Heavens, until your next hero phase subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bearer of the Warhammer`,
        desc: `Add 1 to the Bravery characteristic of friendly ORDER units while they are wholly within 18" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Orrery of Celestial Fates`,
        desc: `Once per turn, you can change one of the following dice rolls to a roll of your choice. Apply any modifiers to the new roll: hit roll, wound roll, save roll, run roll, charge roll, roll that determines the range or number of mortal wounds for this model's Cometstrike Sceptre.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aventis Firestrike`,
    effects: [
      {
        name: `Comet Trail`,
        desc: `At the end of your movement phase, you can pick 1 enemy unit that has any models that this model passed across. You can add 1 to hit rolls for attacks made with missile weapons used by friendly STORMCAST ETERNAL units that target that unit in the same turn.`,
        when: [END_OF_MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Meteoric Strike`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 2+ that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Righteous Indignation`,
        desc: `Each time a wound inflicted by a melee weapon is allocated to this model, roll a dice. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fiery Orator`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly HAMMERS OF SIGMAR unit wholly within 12" of a friendly model with this command ability. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Astreia Solbright`,
    effects: [
      {
        name: `Cycle of the Storm`,
        desc: `Once per turn, when a friendly STORMCAST ETERNAL model is slain within 18" of this model, instead of removing the slain model, you can heal 1 wound allocated to it. This model cannot use this ability on itself.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit Flask`,
        desc: `Once per battle, at the start of the combat phase, you can say that this model will shatter 1, 2 or 3 spirit flasks. If you do so, each unit within 3" of this model suffers 1 mortal wound for each spirit flask that was shattered. Units within 3" with 10 or more models suffer D3 mortal wounds for each spirit flask that was shattered instead. Allocate the mortal wounds to this model last of all, after allocating them to any other units that are affected.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Supernatural Roar`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of one or more friendly DRACOLINES.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Thunderous Pounce`,
        desc: `You can re-roll charge rolls for this model. In addition, the Damage characteristic for this model's Monstrous Claws is D3 instead of 1 if this model made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Prime Electrids`,
        desc: `If this model successfully casts Arcane Bolt and it is not unbound, then the spell inflicts D3 mortal wounds instead of 1, or D6 mortal wounds instead of D3 if the casting roll was 10+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your shooting phase, pick a friendly unit of HAMMERS OF SIGMAR CASTIGATORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the accuracy and power of that unit's Thunderhead Greatbows in that shooting phase instead of choosing only one of those options.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in your hero phase, pick a friendly unit of HAMMERS OF SIGMAR EVOCATORS wholly within 12" of a friendly model with this command ability. That unit can automatically cast Empower in that hero phase (no casting roll is required, and the spell cannot be unbound).`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Soul Energy of the First Host`,
        desc: `If you use this command ability in the combat phase, pick a friendly unit of HAMMERS OF SIGMAR SEQUITORS wholly within 12" of a friendly model with this command ability. You can use Aetheric Channelling to increase the power of the unit's weapons and shields in that combat phase instead of choosing only one of those options.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grand Convocation`,
    effects: [
      {
        name: `Powers Combined`,
        desc: `Add 1 to casting rolls for WIZARDS from this battalion when they are wholly within 9" of two or more other WIZARDS from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hailstorm Battery`,
    effects: [
      {
        name: `Hailstorm Strike`,
        desc: `You can re-roll failed hit rolls for attacks made by the CELESTAR BALLISTA from this battalion if the unit of CASTIGATORS from the same battalion inflicted one or more wounds on the target unit in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cleansing Phalanx`,
    effects: [
      {
        name: `Channelled Empoowerment`,
        desc: `If a unit of EVOCATORS from this battalion successfully casts their Empower spell on a unit of SEQUITORS from the same battalion, and the spell is not unbound, you can re-roll failed hit rolls for attacks made by the SEQUITORS unit in addition to the effects of the spell.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sacrosanct Chamber`,
    effects: [
      {
        name: `Celestial Fulcrum`,
        desc: `At the start of your hero phase, pick a LORD-ARCANUM from this battalion. That model can attempt to cast 1 additional spell that hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Auxiliary Chamber`,
    effects: [
      {
        name: `Azyrite Hurricane`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by models from this battalion that are not HEROES.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Angelos Conclave`,
    effects: [
      {
        name: `Aetheric Wake`,
        desc: `When units from this battalion use the Ride the Winds Aetheric ability, roll 9 dice instead of 6 dice when determining the distance moved.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Justicar Chamber`,
    effects: [
      {
        name: `Fight in Concert`,
        desc: `You can re-roll hit rolls of 1 for attacks made with missile weapons by units of VANGUARD-RAPTORS from this battalion, if the target of that attack is an enemy unit within 18" of any AETHERWING units from the same battalion.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Lightning Echelon`,
    effects: [
      {
        name: `Line-breaker Assault`,
        desc: `Once per battle, at the end of your charge phase, you can make a line-breaker assault with each unit from this battalion that made a charge move that charge phase. Pick one enemy unit within 1" of each unit making a line-breaker assault. That enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Extremis Chamber`,
    effects: [
      {
        name: `Borne by the High Star`,
        desc: `At the start of your first hero phase, you can transport all reserve units from this battalion that are in the Celestial Realm to the battlefield. If you do so, pick a point on the battlefield and set up the units wholly within 24" of that point and more than 9" from any enemy unit. Those units cannot move in the following movement phase. After setting up those units,  roll a dice for each enemy unit within 18" of the point you picked. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderwave Echelon`,
    effects: [
      {
        name: `Ride of the Annihilators`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of one or more units from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Drakesworn Temple`,
    effects: [
      {
        name: `Nova surge`,
        desc: `Once per battle, in your hero phase, you can summon a celestial wave. If you do so, each unit within 3" of any models from this battalion is caught in the celestial wave. Each enemy unit caught in the celestial wave suffers D3 mortal wounds. Heal D3 wounds allocated to each friendly STORMCAST ETERNAL unit caught in the celestial wave.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warrior Chamber`,
    effects: [
      {
        name: `Wrath of the Storm`,
        desc: `You can re-roll failed wound rolls for attacks made by models from this battalion while there are 50 or more models from the same battalion on the battlefield.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Harbinger Chamber`,
    effects: [
      {
        name: `Celestial Nimbus`,
        desc: `Add 1 to hit rolls made by models from this batalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exemplar Chamber`,
    effects: [
      {
        name: `Martial Bond`,
        desc: `If a unit from this battalion is destroyed in the combat phase, pick another unit from the same battalion. Add 1 to the Attacks characteristic of that unit's melee weapons for the rest of the battle. A unit cannot be picked to benefit from this ability more than once per battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lords of the Storm`,
    effects: [
      {
        name: `Storm-born Commanders`,
        desc: `At the start of your hero phase, if any HEROES from this battalion are on the battlefield, roll a dice. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderhead Brotherhood`,
    effects: [
      {
        name: `Sigmarite Shieldwall`,
        desc: `You can re-roll save rolls of 1 for attacks that target a unit of JUDICATORS from this battalion if that unit is wholly within 3" of a unit of LIBERATORS from the same battalion that has any models carrying a Sigmarite Shield.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Hammerstrike Force`,
    effects: [
      {
        name: `Celestial Supercharge`,
        desc: `In your hero phase, you can pick one unit of PALADINS from this battalion that is wholly within 9" of the unit of PROSECUTORS from the same battalion. If you do so, add 1 to wound rolls for attacks made by the unit you pick until the end of the turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Vanguard Wing`,
    effects: [
      {
        name: `Bearers of the Storm`,
        desc: `If the unmodified hit roll for an attack made by a unit of LIBERATORS from this battalion that is wholly within 16" of a unit of PROSECUTORS from the same battalion is 6, add 1 to the Damage characteristic of that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Devastation Brotherhood`,
    effects: [
      {
        name: `Crushing Assault`,
        desc: `If an enemy unit suffers wounds from attacks made by all three units of PALADINS from this battalion in the same combat phase, that enemy unit suffers D6 mortal wounds at the end of that combat phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soulstrike Brotherhood`,
    effects: [
      {
        name: `Interception Force`,
        desc: `If any units of VANGUARD-HUNTERS from this battalion were on the battlefield at the start of a turn in which a reserve SACROSANCT unit from the same battalion is set up on the battlefield for the first time, add 1 to the Attacks characteristic of missile weapons used by that SACROSANCT unit in that turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]
