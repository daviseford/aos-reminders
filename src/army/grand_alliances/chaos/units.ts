import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_HERO_PHASE,
} from 'types/phases'
import GenericEffects from 'army/generic/effects'

export const MonstersOfChaos: TUnits = [
  {
    name: `Be'Lakor, Chaos Daemon Prince`,
    effects: [
      {
        name: `Shadow Form`,
        desc: `This model ignores rend when making save rolls.`,
        when: [DURING_GAME],
      },
      {
        name: `The Dark Master`,
        desc: `Secretly note down an enemy unit for manipulation. When activated, for one battle round your opponent must roll a D6 each time the target attempts to cast a spell, move, charge, or attack. On a 4+, the action can be performed normally otherwise it cannot be completed.`,
        when: [END_OF_SETUP],
      },
      {
        name: `The Dark Master`,
        desc: `You may reveal your unit choice. The target is affected by this ability for this battle round. Can only be used once per game.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Lord of Torment`,
        desc: `If any models within 10" flee, this model heals D3 wounds.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Enfeeble Foe.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeeble Foe`,
        desc: `Casting value of 6. Pick one visible enemy unit within 18" of the caster. Until your next hero phase, subtract 1 from the wound rolls made by the target in the combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeeble Foe`,
        desc: `If active, subtract 1 from the wound rolls made by the target in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mutalith Vortex Beast`,
    effects: [
      {
        name: `Aura of Mutation`,
        desc: `In your hero phase, you can pick a unit within 15". Roll a D6 and consult the chart below:

        1: Hideous Disfigurements - Reduce the Bravery of each model in the target unit by 1 for the rest of the battle.

        2: Trollbrains - For the rest of the battle, the controlling player must roll a D6 at the start of each of their hero phases. On the roll of a 1, the target unit can't be selected to cast spells, move or attack until their next hero phase.

        3: Gift of Mutations - Reduce the Move of each model in the target unit by 1 for the rest of the battle.

        4: Tide of Transmogrification - The target unit sufers D3 mortal wounds.

        5: Maelstrom of Change - The target unit suffers D6 mortal wounds.

        6: Spawnchange - The target unit suffers D6 mortal wounds. For each model that is slain as a result, set up a Chaos Spawn within 3" of the target unit. All Chaos Spawn created as a result of Spawnchange are added to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutant Regeneration`,
        desc: `Heal D3 wounds in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slaughterbrute`,
    effects: [
      {
        name: `Runes of Binding`,
        desc: `When you set up a Slaughterbrute, you can pick a Slaves to Darkness Hero in your army to be its master (a model cannot be the master of more than one Slaughterbrute). As long as the Slaughterbrute's master is on the battlefield, the Slaughterbrute's melee weapons hit on rolls of 3+ rather than 4+.`,
        when: [DURING_SETUP, COMBAT_PHASE],
      },
      {
        name: `Beast Unbound`,
        desc: `If a Slaughterbrute does not have a master on the battlefield in the charge phase, roll a D6. If the result is 3 or less it lashes out at the nearest model, friend or foe, within 3". That model's unit immediately suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Soul Grinder`,
    effects: [
      {
        name: `Daemon Engine of the Dark Gods`,
        desc: `This unit can be marked with one of the following keywords for the duration of the battle: Khorne, Tzeentch, Nurgle, or Slaanesh.`,
        when: [DURING_SETUP],
      },
      {
        name: `Implacable Advance`,
        desc: `A Soul Grinder can shoot even if it ran in the movement phase.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Caught by the Claw`,
        desc: `Each time a Hellforged Claw attack hits a hero or monster both you and your opponent hide a selected dice face. Upon revealing the dice, if the values match, the target suffers 6 mortal wounds instead of normal weapon damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]
export const MonstrousArcanumChaos: TUnits = [
  {
    name: `Chaos Siege Gargant`,
    effects: [
      {
        name: `Scaling Spikes and Chains`,
        desc: `When this model makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Siege Armour`,
        desc: `You can re-roll save rolls for attacks made with ranged weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
      ...GenericEffects.Gargant,
    ],
  },
  {
    name: `Gigantic Chaos Spawn`,
    effects: [
      {
        name: `Curse of the Dark Gods`,
        desc: `You can choose one of the following keywords to give to this unit the first time it is set up: Khorne, Nurgle, Slaanesh or Tzeentch.`,
        when: [DURING_SETUP],
      },
      {
        name: `Plaything of the Dark Gods`,
        desc: `At the start of your hero phase, roll a D6. On a 1, this model suffers D3 mortal wounds. On a 2+, you can heal up to D3 wounds allocated to this model. If you roll a 2+ and no wounds are allocated to this model, add D3 to its Wounds characteristic for the rest of the battle instead of healing D3 wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by this model's Freakish Mutations, add 1 to hit and wound rolls for attacks made by this model until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Preyton`,
    effects: [
      {
        name: `Agonizing Venom`,
        desc: `If the unmodified wound roll for an attack made with this model's Venom-dripping Fangs is 6, that attack inflicts 1 mortal wound in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Corrosive Bile`,
        desc: `If the unmodified hit roll for an attack made with this model's Corrosive Bile is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Goring Charge`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Stalker of the Dark Wilds`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is stalking its prey as a reserve unit. In your first hero phase, you must set up this unit anywhere on the battlefield within 12" of the edge of the battlefield and more than 9" from any enemy unit.`,
        when: [DURING_SETUP, TURN_ONE_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skin Wolves`,
    effects: [
      {
        name: `Bounding Predators`,
        desc: `This unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Terrifying Bloodlust`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Units available to this Grand Alliance allegiance
export const Units: TUnits = [...MonstersOfChaos, ...MonstrousArcanumChaos]

// Available to ALL factions in this Grand Alliance
export const ChaosUnits = []
