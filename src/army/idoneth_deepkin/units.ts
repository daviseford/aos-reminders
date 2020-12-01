// Battalions
import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  DURING_TURN,
  END_OF_BATTLESHOCK_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const DeepmareHornEffect = {
  name: `Deepmare Horn`,
  desc: `Roll a D6 if this model ends a charge move within 1" of any enemy units. On a 2+, the nearest enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
}
const StormshoalEffect = {
  name: `Stormshoal`,
  desc: `Roll a dice for each wound or mortal wound allocated to this model. On a 5+ the wound is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
}

export const Units: TEntry[] = [
  {
    name: `Eidolon of Mathlann, Aspect of the Storm`,
    effects: [
      {
        name: `Crashing Upon the Foe`,
        desc: `You can heal up to D3 wounds allocated to this model after making a charge move.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Crashing Upon the Foe`,
        desc: `Add 1 to to the attacks characteristic of this model's Spear of Repressed Fury if it charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Crashing Upon the Foe`,
        desc: `This model can retreat and charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Drench with Hate`,
        desc: `Add 1 to wound rolls for friendly Idoneth Deepkin units wholly within 18" of any friendly model with this ability.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Pulled Into the Depths`,
        desc: `You can pick an enemy hero with a wounds characteristic of 8 or less within 3" of this model. Add 1 to hit rolls for this model's attacks made against the target in this phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      StormshoalEffect,
    ],
  },
  {
    name: `Eidolon of Mathlann, Aspect of the Sea`,
    effects: [
      {
        name: `Dormant Energies`,
        desc: `You can reroll casting, dispelling, and unbinding rolls for this model. If you do not use these rerolls, you can heal up to D3 wounds allocated to this model instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tranquility of the Abyss`,
        desc: `Add 3 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 18" of any friendly models with this ability.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      StormshoalEffect,
      {
        name: `Cloying Seas Mists`,
        desc: `Casting value of 6. Pick a unit within 12" of the caster and that is visible. If a friendly Deepkin unit selected, heal D3 wounds allocated to them. Any other unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Tsunami of Terror`,
        desc: `Casting value of 7. Pick D6 enemy units within 12" of the caster that are visible. Subtract 1 from hit rolls made for those units, and 1 from the Bravery characteristic of those units, until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Tsunami of Terror`,
        desc: `If active, subtract 1 from hit rolls made by debuffed units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Tsunami of Terror`,
        desc: `If active, subtract 1 from the Bravery characteristic of debuffed units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Volturnos, High King of the Deep`,
    effects: [
      {
        name: `The Astra Solus`,
        desc: `If a hit roll for the Astra Solus is 6+, that attack has a Rend characteristic of -5 instead of -1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Crest of the High Kings`,
        desc: `Add 1 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 18" of this model.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Cealith, the High King's Shield`,
        desc: `You can roll a D6 if this model is affected by a spell. If you do so, on a 3+ the spell has no effect on this model (other units will be affected by the spell normally).`,
        when: [HERO_PHASE],
      },
      {
        name: `First Among Akhelians`,
        desc: `Reroll hit rolls of 1 for friendly AKHELIAN units while they are wholly within 18" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      DeepmareHornEffect,
    ],
  },
  {
    name: `Akhelian King`,
    effects: [
      DeepmareHornEffect,
      {
        name: `Akhelian Paragon`,
        desc: `Reroll hit rolls of 1 for friendly AKHELIAN units while they are wholly within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Storm of Blows`,
        desc: `At the start of the combat phase, you can say that this model will draw their Falchion. If you do so, subtract 1 from save rolls for this model in that combat phase, but this model can attack with its Falchion in that combat phase. If you do not do so, this model cannot attack with its Falchion in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Storm of Blows`,
        desc: `If active, subtract 1 from save rolls for this model in that combat phase.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Wave Rider`,
        desc: `In the combat phase, this model's Bladed Polearm has a Damage characteristic of 3 if the model made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of the Tides`,
        desc: `You can use this command ability if this model is your general and the High Tide ability from the Tides of Death table applies for the battle round. If you do so, pick a friendly Idoneth Deepkin unit wholly within 12" of your general. Add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Isharann Tidecaster`,
    effects: [
      {
        name: `Spirit Guardians`,
        desc: `The first wound allocated to this model each turn is negated.`,
        when: [DURING_TURN],
      },
      {
        name: `The Wide Ethersea`,
        desc: `If this model is the general of your army, at the start of the first battle round you can declare that the Tides of Death table will be reversed. If you do so, the Ebb Tide ability is used in the first battle round, the High Tide ability is used in the second battle round, the Flood Tide ability is used in the third battle round, and the Low Tide ability is used in the fourth battle round. Then the four Tides of Death steps are repeated in reverse order, starting with Ebb Tide.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Riptide`,
        desc: `Casting value of 7. Pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit. In addition, at the start of your next hero phase the unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Isharann Soulscryer`,
    effects: [
      {
        name: `Finder of the Ways`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is set up travelling the ethersea. If you do so, when you would set up another friendly IDONETH DEEPKIN unit, instead of setting up the unit, you can say that it is joining this model in the ethersea. Up to 2 units can join this model in this way. At the end of any of your movement phases, you can set up this model wholly within 6" of the edge of the battlefield and more than 9" from any enemy models; then set up any units that joined this model wholly within 6" of the edge of the battlefield, wholly within 12" of this model, and more than 9" from any enemy models.`,
        when: [DURING_SETUP],
      },
      {
        name: `Seeker of Souls`,
        desc: `At the start of your charge phase, you can pick one enemy unit within 24" of this model that is visible to them. If you do so, you must add 3 to charge rolls for friendly IDONETH DEEPKIN units that are within 12" of that unit. However, the first model to be moved from each unit that receives this modifier must finish their charge move within 1/2" of that unit or their charge will fail.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Isharann Soulrender`,
    effects: [
      {
        name: `Lurelight`,
        desc: `At the end of your battleshock phase, pick a friendly NAMARTI unit wholly within 12" of this model and roll a D3. Return a number of slain models to the unit you picked up to the value of the roll. Add 1 to the D3 roll for each enemy model that was slain by damage caused by this model's Talnhook in the combat phase of the same turn.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Hangman's Knot`,
        desc: `At the start of the combat phase, pick an enemy HERO that is within 3" of this model and roll a D6. Subtract 2 from the dice roll if the enemy HERO is a MONSTER. On a 4+, you can reroll failed hit rolls for this model's Talnhook for attacks that target that enemy HERO in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Akhelian Allopexes`,
    effects: [
      {
        name: `Bloodthirsty Predators`,
        desc: `Add 1 to the attacks characteristic of this unit's Ferocious Bite if it is within 3" of enemy models that have had wounds allocated or models slain this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Entangled`,
        desc: `Units that have been hit by Retarius Net Launcher attacks this turn cannot pile-in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lotann, Warden of the Soul Ledgers`,
    effects: [
      {
        name: `Catalogue of Souls`,
        desc: `Add 1 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this model.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Catalogue of Souls`,
        desc: `Reroll hit rolls of 1 for friendly NAMARTI units while they are wholly within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Writhing Tentacles`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Akhelian Leviadon`,
    effects: [
      {
        name: `Crushing Charge`,
        desc: `After this model finishes a charge move, roll a dice for each enemy unit within 1". On a 2+, that unit suffers D3 mortal wounds. Enemy units with a wounds characteristic of 1 suffer D6 mortal wounds instead.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Jaws of Death`,
        desc: `Each time you make an unmodifed hit roll of 6 for this model's Leviadon's Crushing Jaws attack, that attack inflicts 3 mortal wounds (6 if target is a monster) and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Void Drum`,
        desc: `Add 1 to save rolls for friendly Idoneth Deepkin units with wounds characteristic of 8 or less wholly within 12" of any friendly Leviadons.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Void Drum`,
        desc: `Add 1 to Namarti hit rolls targeting enemy units wholly within 12" of any friendly Leviadons.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Akhelian Morrsarr Guard`,
    effects: [
      {
        name: `Biovoltaic Blast`,
        desc: `Once per battle, at the start of a combat phase, you can say that this unit will unleash the biovoltaic energy stored in its voltspears. If you do so, roll 1 dice for each model in this unit. For each 3+, pick an enemy unit within 3" of this unit. That unit suffers 1 mortal wound. For each 6+, the unit that is picked suffers D3 mortal wounds instead.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Wave Riders`,
        desc: `This unit's voltspears have a Rend characteristic of -2 and a Damage characteristic of 2 if this unit made a charge move earlier in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Akhelian Ishlaen Guard`,
    effects: [
      {
        name: `Biovoltaic Barrier`,
        desc: `Ignore the Rend characteristic of attacks against this unit when making save rolls for this unit. In addition, this unit has a Save characteristic of 3+ instead of 4+ if it made a charge move in the same turn.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Namarti Thralls`,
    effects: [
      {
        name: `Sweeping Blows`,
        desc: `Add 1 to the Attacks characteristic of a Lanmari Blade if all of the attacks made with the weapon target enemy models with a Wounds characteristic of 1. Add 1 to the Damage characteristic instead if all of the attacks made with the weapon target enemy models with a Wounds characteristic of 4 or more.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Namarti Reavers`,
    effects: [
      {
        name: `Swift Tide`,
        desc: `You can reroll run rolls for this unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Fluid Firing Style`,
        desc: `Before attacking with a Whisperbow, choose either the Aimed Fire or Storm Fire missile weapon characteristics for that shooting attack.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

export const Battalions: TEntry[] = [
  {
    name: `Royal Council`,
    effects: [
      {
        name: `Give Them No Respite`,
        desc: `You can use this command ability in your hero phase if the Akhelian King from this battalion is your general, and the Isharann Tidecaster and Isharann Soulscryer from this battalion are within 3" of the general. If you do so, pick up to three friendly IDONETH DEEPKIN units that are wholly within 12" of your general. Add 3" to the Move characteristic of the units you pick until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Akhelian Corps`,
    effects: [
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one run roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one charge roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Pulsing Rhythm of the Drums`,
        desc: `Once per phase, you can reroll one hit, wound, or save roll for one unit from this battalion that is wholly within 12" of the Akhelian Leviadon from this battalion when the reroll is made.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Namarti Corps`,
    effects: [
      {
        name: `Soul Bond`,
        desc: `If the Isharann Soulrender from this battalion uses their Lurelight ability on a NAMARTI unit from this battalion, the D3 roll to determine how many models are returned to the Namarti unit is treated as being a roll of 3 (there is no need to roll the dice).`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Phalanx`,
    effects: [
      {
        name: `Full Fury of the Storm`,
        desc: `If your army has the IDONETH DEEPKIN allegiance and includes this battalion, then once per battle at the start of a battle round, you can choose to use the High Tide ability from the Tides of Death table for that battle round instead of the ability that would normally be used.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Alliance of Wood and Sea`,
    effects: [
      {
        name: `Strength of the Ethersea`,
        desc: `SYLVANETH units from this battalion have the Tides of Death battle trait, and gain abilities from the Tides of Death table in the same manner as IDONETH DEEPKIN units.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Bloodsurf Hunt`,
    effects: [
      {
        name: `Deadly Guardians`,
        desc: `Add 1 to hit rolls made by battallion Allopex Barbed Hooks and Blades wholly within 12" of the battalion's Akhelian King.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Guardians`,
        desc: `Each time a wound or mortal would would be allocated to the battalion's Akhelian King within 3" of battalion Allopex units, roll a D6. On a 2+ you must allocate the wounds to one of those Allopex units instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
]
