import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  // Ravagers Allegiance
  {
    name: `Ravagers`,
    effects: [
      {
        name: `Glory for the Taking`,
        desc: `If your general is not a Daemon Prince you can pick a different command trait for each of up to 5 different friendly Ravagers heroes in addition to your general. None of these heroes can have more than 1 command trait.`,
        when: [DURING_SETUP],
      },
      {
        name: `Glory for the Taking`,
        desc: `You can pick 1 friendly Ravagers hero (excluding Daemon Princes) on the battlefield to become the army general until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Rally the Tribes`,
        desc: `Pick the model that is currently your general (the same model cannot be picked more than once per battle). Summon 1 unit of 10 Chaos Marauders, 1 unit of 5 Chaos Marauder Horsemen, or 1 Cultists unit of up to 10 models to the battlefield. The summoned unit must be wholly within 6" of the edge of the battlefield and more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  // Cabalists Allegiance
  {
    name: `Cabalists`,
    effects: [
      {
        name: `Binding Rituals`,
        desc: `You may select 1 friendly Cabalists wizard to perform 1 binding ritual. For either ritual selection, pick 1 friendly Cabalists unit within 3" this wizard and roll a D6. On a 3+, D3 models from the target unit are slain.
               Ritual of Sorcerous Might: For each slain model, add 1 to the casting rolls made for friendly Cabalists wizards until the end of this phase.
               Ritual of Corruption: Pick 1 predatory endless spell within 12" of the ritual wizard. You may move that endless spell 3" per each slain model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Crippling Ruin`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" and visible. That unit suffers D3 mortal wounds. In addition, reduce the move characteristic of that unit by the number of mortal wounds inflicted by this spell until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Crippling Ruin`,
        desc: `Affected units reduce their move characteristic by the number of mortal wounds inflicted by this spell until your next hero phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Despoilers Allegiance
  {
    name: `Despoilers`,
    effects: [
      {
        name: `Sacrilegious Might`,
        desc: `Friendly units with the same Mark of Chaos as your general are affected by your general's Aura of Chaos ability while they are wholly within 18" of your general.`,
        when: [DURING_GAME],
      },
      {
        name: `Sacrilegious Might`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Despoilers Daemon Prince. On a 5+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Blessed by the Unholy`,
        desc: `You can roll a D6 for each friendly Despoilers Daemon Prince and friendly Despoilers monster on the battlefield. On a 4+ you can heal up to D3 wounds allocated to that model. Mutalith Vortex Beasts can only heal 1 wound instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Twisted Dominion`,
        desc: `If a friendly Despoilers Daemon Prince finishes a move within 6" of a terrain feature, you can give that terrain feature the Pitch-black and Nightmare Chasm scenery rules until you next hero phase. Despoilers Daemon Princes and Despoilers monsters are unaffected by these scenery rules.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Pitch Black`,
        desc: `Models are not visible to each other if an imaginary straight line 1mm wide drawn between the closest points of the two models crosses over more than 1" of this terrain feature.`,
        when: [DURING_GAME],
      },
      {
        name: `Nightmare Chasm`,
        desc: `Roll a D6 for this terrain feature. On a 6, each unit within 1" of the terrain suffers D3 mortal wounds (roll damage separately for each unit).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Host of the Everchosen Allegiance
  {
    name: `Host of the Everchosen`,
    effects: [
      {
        name: `Exalted Grand Marshall of the Apocalypse`,
        desc: `If Archaon is your general and on the battlefield, friendly Host of the Everchosen units are affected by his Aura of Chaos ability if they are wholly within 18" of him.`,
        when: [DURING_GAME],
      },
      {
        name: `Fearless in His Presence`,
        desc: `If Archaon is your general and on the battlefield, do not take battleshock tests for friendly Host of the Everchosen units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Will of the Everchosen`,
        desc: `If Archaon is your general and on the battlefield, you can pick 1 enemy unit on the battlefield. You can reroll hit and wound rolls of 1 for melee attacks against the target by friendly Host of the Everchosen units until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Will of the Everchosen`,
        desc: `You can reroll hit and wound rolls of 1 for melee attacks against the target by friendly Host of the Everchosen units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dark Prophecy`,
        desc: `If Archaon is your general and on the battlefield, roll a D6 and keep the result hidden beneath an opaque container. At the start of the next battle round, before players determine who has the first turn, you must reveal the result. On a 1-3 your opponent must take the first turn. On a 4-6 you must take the first turn.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Dark Prophecy`,
        desc: `If active, before players determine who has the first turn, you can reveal the Dark Prophecy result. On a 1-3 your opponent must take the first turn. On a 4-6 you must take the first turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `The Eight Circles of the Varanguard`,
        desc: `During army construction, you must choose one of Varanguard Circle keywords from the table. All Varanguard units in your army gain that keyword and the associated effects.`,
        when: [DURING_SETUP],
      },
      {
        name: `The First Circle`,
        desc: `After determining who has the first turn, you can remove any friendly First Circle units from the battlefield and set them up again (following any battleplan set up restrictions).`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Second Circle`,
        desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 6" of any friendly Second Circle units.`,
        when: [DURING_GAME],
      },
      {
        name: `The Second Circle`,
        desc: `If an enemy unit fails a battleshock test within 6" of any friendly Second Circle units, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `The Third Circle`,
        desc: `Subtract 1 from hit rolls by missle weapons targetting Third Circle units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `The Fourth Circle`,
        desc: `You can pick 1 terrain feature within 3" of any friendly Fourth Circle units. Each enemy unit within 3" of that terrain feature suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
      {
        name: `The Fifth Circle`,
        desc: `You can reroll hit and wound rolls for attacks made by Fifth Circle units against heros or monsters.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Sixth Circle`,
        desc: `Add 1 to the damage inflicted by attacks made with Sixth Circle melee weapons from units that charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `The Seventh Circle`,
        desc: `If any attacks made by a friendly Seventh Circle unit in this phase destroyed any enemy units, heal up to D3 wounds allocated to that Seventh Circle unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `The Eighth Circle`,
        desc: `Eighth Circle units can fly.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // The Knights of the Empty Throne Allegiance
  {
    name: `The Knights of the Empty Throne`,
    effects: [
      {
        name: `Fists of the Everchosen`,
        desc: `Varanguard units gain the HERO keyword. The 'Look Out, Sir!' rule does not apply to them.`,
        when: [DURING_GAME],
      },
      {
        name: `Unmatched Conquerors`,
        desc: `Pick 1 enemy unit controlling an objective within 12" of a friendly Knights of the Empty Throne HERO. Roll a number of dice equal to the number of models in the target. For each 3+, until the end of the battle round, the number of models in that unit counted towards the objective control is reduced by 1. A unit cannot be affected by this more than once per turn.`,
        when: [END_OF_CHARGE_PHASE],
        command_ability: true,
      },
      {
        name: `Unmatched Conquerors`,
        desc: `If active, reduce the debuffed unit's total model count by the rolled value when determining control.`,
        when: [END_OF_TURN],
      },
      {
        name: `Failure is Not an Option`,
        desc: `You may use this ability when a friendly Knights of the Empty Throne Varanguard unit is destroyed. Roll a D6 and on a 5+ a new Varanguard unit of 3 models is added to your army. Set this unit up wholly within 6" of the battlefield edge and more than 9" from any enemy units. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
        command_ability: true,
      },
    ],
  },
]

export default Allegiances
