import { tagAs } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH } from 'meta/alliances'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const CommandAbilities = {
  'By My Will': {
    effects: [
      {
        name: `By My Will`,
        desc: `You can use this once per turn. Pick 1 friendly Slaves to Darkness unit on the battlefield. If a model from that unit is slain by a melee weapon, it may fight before it is removed from play. The same unit cannot benefit from this more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `By My Will`,
        desc: `If affected by this ability, slain models from the buffed unit may fight before being removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'All-seeing Dominion': {
    effects: [
      {
        name: `All-seeing Dominion`,
        desc: `You can use this ability when your opponent spends a command point. Roll a D6 before resolving any of the effects of the opponents command ability. On a 1, this ability has no effect. On a 2+ this model can use By My Will without spending a command point. This can be used at any time the opponent spends a command point regardless of phase or if By My Will has already been used.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bloodslick Ground': {
    effects: [
      {
        name: `Bloodslick Ground: ${MARK_KHORNE}`,
        desc: `Until your next hero phase, run and charge rolls made for enemy units within 18" of this model are halved. You cannot use this command ability more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodslick Ground: ${MARK_KHORNE}`,
        desc: `If active run and charge rolls made for enemy units within 18" of this model are halved.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Arcane Influence': {
    effects: [
      {
        name: `Arcane Influence: ${MARK_TZEENTCH}`,
        desc: `Pick 1 friendly Slaves to Darkness wizard wholly within 12" of this model and add 1 to its casting rolls until the end of the phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bloated Blessings': {
    effects: [
      {
        name: `Bloated Blessings: ${MARK_NURGLE}`,
        desc: `Pick 1 friendly Slaves to Darkness Nurgle unit wholly within 12" of this model. Until your next hero phase, if any unmodified hit rolls of 6 occur against the buffed unit, inflict D3 mortal wounds to the attacker after all its attacks have resolved. The same unit cannot benefit from this ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bloated Blessings: ${MARK_NURGLE}`,
        desc: `If active unmodified hit rolls of 6 against the buffed unit inflict D3 mortal wounds to the attacker after all its attacks have resolved.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Revel in Agony': {
    effects: [
      {
        name: `Revel in Agony: ${MARK_SLAANESH}`,
        desc: `Until your next hero phase, if any models from a friendly Slaves to Darkness Slaanesh unit wholly within 12" of this model are slain by an enemy melee weapon, add 1 to hits rolls for attacks made by that friendly unit. You cannot use this command ability more than once per turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Iron-willed Overlord': {
    effects: [
      {
        name: `Iron-willed Overlord`,
        desc: `Select a friendly Chaos Warriors unit within 18". Until your next hero phase you can reroll charge rolls and battleshock tests for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Knights of Chaos': {
    effects: [
      {
        name: `The Knights of Chaos`,
        desc: `Select a friendly unit of Chaos Knights, Chaos Chariots, or Gorebeast Chariots within 18". Until your next hero phase you can reroll charge rolls and add 1 to any hit rolls for that unit in the combat phase. The same unit cannot benefit from this more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Knights of Chaos`,
        desc: `If active, you can reroll charge rolls for the buffed unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `The Knights of Chaos`,
        desc: `If active, you can add 1 to the hit rolls for the buffed unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Spurred by the Gods': {
    effects: [
      {
        name: `Spurred by the Gods`,
        desc: `Pick 1 friendly mortal Slaves to Darkness unit wholly within 12". That unit may be selected to fight for a second time in this phase if it is within 3" of any enemy units. The same unit cannot benefit from this more than once per turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Will of the Gods': {
    effects: [
      {
        name: `Will of the Gods`,
        desc: `Add 3 to charge rolls for friendly Chaos Marauders and Cultists units wholly within 12" of this model when the charge roll is made. A unit cannot benefit from this more than once per phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Last Gasp of Glory': {
    effects: [
      {
        name: `Last Gasp of Glory`,
        desc: `Friendly Chaos Marauders and Cultists models that are slain within 12" of this model that have not yet fought in this phase can fight before being removed from play. The same unit cannot benefit from this ability more than once per turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Pit Marshal': {
    effects: [
      {
        name: `Pit Marshal`,
        desc: `Pick 1 friendly Cultists unit wholly within 12" of a friendly model with this command ability. Do not take battleshock tests for that unit until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pit Marshal`,
        desc: `If active, do not take battleshock tests for the buffed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Ravagers
  'Rally the Tribes': {
    effects: [
      {
        name: `Rally the Tribes`,
        desc: `Pick the model that is currently your general (the same model cannot be picked more than once per battle). Summon 1 unit of 10 Chaos Marauders, 1 unit of 5 Chaos Marauder Horsemen, or 1 Cultists unit of up to 10 models to the battlefield. The summoned unit must be wholly within 6" of the edge of the battlefield and more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  // Host of the Everchosen
  'Dark Prophecy': {
    effects: [
      {
        name: `Dark Prophecy`,
        desc: `If Archaon is your general and on the battlefield, roll a D6 and keep the result hidden beneath an opaque container. At the start of the next battle round, before players determine who has the first turn, you must reveal the result. On a 1-3 your opponent must take the first turn. On a 4-6 you must take the first turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Dark Prophecy`,
        desc: `If active, before players determine who has the first turn, you can reveal the Dark Prophecy result. On a 1-3 your opponent must take the first turn. On a 4-6 you must take the first turn.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  // Knights of the Empty Throne
  'Unmatched Conquerors': {
    effects: [
      {
        name: `Unmatched Conquerors`,
        desc: `Pick 1 enemy unit controlling an objective within 12" of a friendly Knights of the Empty Throne HERO. Roll a number of dice equal to the number of models in the target. For each 3+, until the end of the battle round, the number of models in that unit counted towards the objective control is reduced by 1. A unit cannot be affected by this more than once per turn.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Unmatched Conquerors`,
        desc: `If active, reduce the debuffed unit's total model count by the rolled value when determining control.`,
        when: [END_OF_TURN],
      },
    ],
  },
  'Failure is Not an Option': {
    effects: [
      {
        name: `Failure is Not an Option`,
        desc: `You may use this ability when a friendly Knights of the Empty Throne Varanguard unit is destroyed. Roll a D6 and on a 5+ a new Varanguard unit of 3 models is added to your army. Set this unit up wholly within 6" of the battlefield edge and more than 9" from any enemy units. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Idolators
  Desecrate: {
    effects: [
      {
        name: `Desecrate`,
        desc: `Pick 1 friendly Idolators unit wholly within 12" of a friendly Idolator Lord and within 3" of a terrain feature. Roll a D6. If the roll is greater than the number of enemy models within 3" of ther terrain, the terrain becomes Descrated (deactivating the terrain feature's rules).`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')
