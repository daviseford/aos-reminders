import { TBattalions, TUnits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
} from 'types/phases'

export const getTamurkhansUnits = () => Units
export const getTamurkhansBattalions = () => Battalions

// Unit Names
export const Units: TUnits = [
  {
    name: `Tamurkhan the Maggot Lord`,
    effects: [
      {
        name: `Feast of the Maggot Lord`,
        desc: `If this model is slain, before this model is removed from play, you can pick 1 enemy Hero within 3" of this model. That Hero suffers D3 mortal wounds. If that Hero is slain by these mortal wounds, this model is not slain, D6 wounds allocated to this model are healed, and any that remain to be allocated to it are negated. If that Hero is not slain by these mortal wounds, this model is removed from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Killer of Kings`,
        desc: `You can re-roll hit rolls for attacks made with this model's Black Cleaver that target a Hero.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Nurgle's Favoured Son`,
        desc: `You can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Roar of Command`,
        desc: `If this model is your general and is on the battlefield, you can re-roll charge rolls for friendly Tamurkhan's Horde units while they are wholly within 28" of this model in that charge phase.`,
        when: [START_OF_CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Kazyk the Befouled`,
    effects: [
      {
        name: `Corrupted Flesh`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 4+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Noxious Blades`,
        desc: `If the unmodified hit roll for an attack with this model's Noxious Blades is 6, that attack has a Damage characteristic of 3 instead of D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Breath of the Plague Pit`,
        desc: `Do not take battleshock tests for friendly Nurgle units while they are wholly within 14" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Daemon Plague Toads of Nurgle`,
    effects: [
      {
        name: `Bloated Flesh`,
        desc: `Roll a D6 each time you allocate a mortal wound to a model in this unit. On a 4+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Rot-eaters`,
        desc: `If the unmodified hit roll for an attack made with this unit's Yawning Maw is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daemon Pox Riders of Nurgle`,
    effects: [
      {
        name: `Bloated Flesh`,
        desc: `Roll a D6 each time you allocate a mortal wound to a model in this unit. On a 4+, that mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Cloud of Flies`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Locus of Fecundity`,
        desc: `You can re-roll save rolls of 1 for attacks that target this unit while this unit is wholly within 14" of a friendly Nurgle Hero.`,
        when: [DURING_GAME],
      },
      {
        name: `Rot-eaters`,
        desc: `If the unmodified hit roll for an attack made with this unit's Yawning Maw is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Plague Ogors`,
    effects: [
      {
        name: `Damned Flesh`,
        desc: `If a model from this unit is slain after a wound or mortal wound is allocated to it, roll a D6 before the slain model is removed from play. On a 5+, that wound or mortal wound is negated and the model is not slain.`,
        when: [DURING_GAME],
      },
      {
        name: `Insatiably Famished`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this unit if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Plague Contagion`,
        desc: `You can roll 1 dice for each enemy unit within 3" of this unit. On a 5+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bile Troggoths`,
    effects: [
      {
        name: `Infected Vomit`,
        desc: `If the unmodified hit roll for an attack made with this unit's Infected Vomit is 6, that attacks inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Fecund Regeneration`,
        desc: `You can heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Sons of the Maggot Lord`,
    effects: [
      {
        name: `The Tide of Conquest`,
        desc: `Add 1 to the charge roll for units from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Leaping Pox`,
    effects: [
      {
        name: `Infectious!`,
        desc: `Roll a D6 for each enemy unit within 1" of any units with this ability. On a 4+, that unit suffers 1 mortal wound. This ability has no effect on Nurgle units.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
