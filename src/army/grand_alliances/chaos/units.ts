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
  START_OF_MOVEMENT_PHASE,
  TURN_ONE_HERO_PHASE,
  WOUND_ALLOCATION,
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
export const Units: TUnits = [
  ...MonstersOfChaos,
  ...MonstrousArcanumChaos,
  {
    name: `Hellcannon`,
    effects: [
      {
        name: `Caged Fury`,
        desc: `If the Hellcannon is not within 3" of an enemy unit at the start of your movement phase, roll a dice and consult the War Machine Crew Table on the warscroll. If the dice roll is equal to or greater than the score shown, the crew have caged the Hellfire's fury this turn. Otherwise, the Hellcannon must move as far as it can towards the closest enemy unit that is visible to it.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Doomfire`,
        desc: `The Hellcannon can only make Doomfire attacks if its crew are within 1" of the war machine in the shooting phase. To make a Doomfire attack, pick an enemy unit within range, even if it is not visible to the Hellcannon, and roll to hit. Add 1 to the hit roll if the Hellcannon did not move in your preceding movement phase and add another 1 if the target unit has 20 or more models. A unit hit by Doomfire suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Daemon-forged Cover`,
        desc: `A Hellcannon's Crew can use their war machine as cover while they are within 1" of it.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Exalted Hero with Battle Standard`,
    effects: [
      {
        name: `Chaos Runeshield`,
        desc: `Roll a dice each time this model is allocated a mortal wound. On a 5+ that mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Eager for Glory`,
        desc: `Re-roll hit rolls of 1 for this model when targeting a HERO or a MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Battle Standard of the Dark Gods`,
        desc: `In your hero phase, you can declare that this model will plant the Battle Standard of the Dark Gods. If you do, then until your next hero phase you may not move the model, but you may immediately roll a dice for each enemy unit within 10". On a 4+ that unit suffers a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Forsaken`,
    effects: [
      {
        name: `Freakish Mutations`,
        desc: `Before this unit makes its attacks in the combat phase, roll a dice to see what mutation they have for the duration of that phase:
        
        1 - Writhing Tentacles: This unit's Freakish Mutations have a Range characteristic of 3" instead of 1".
        
        2 - Razor Talons: This unit's Freakish Mutations have a Rend characteristic of -1 instead of '-'.
        
        3 - Extra Arms: Add 1 to the result of the roll when determining the Attacks characteristic for this unit's Freakish Mutations.
        
        4 - Lashing Tongues: Add 1 to hit rolls for this unit's Freakish Mutations.
        
        5 - Venomous Fangs: Add 1 to wound rolls for this unit's Freakish Mutations.
        
        6 - Decapitating Claws: Add 1 to the Damage characteristic of this unit's Freakish Mutations.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Dragon`,
    effects: [
      {
        name: `Breath of Mutation`,
        desc: `In the shooting phase, this model can pick one enemy unit in range. That unit suffers D3 mortal wounds. Roll a dice for each model that is slain; on a 4+ the unit suffers a further mortal wound as warriors are driven insane or twisted beyond recognition by the Breath of Mutation.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Treasonous Curse`,
        desc: `Casting value of 7. Pick an enemy unit within 18". Each model in that unit makes a single attack with one of its melee weapons against its own unit. If a model has more than one melee weapon you may choose which one is used.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Chaos Ogors`,
    effects: [
      {
        name: `Fearsome Gluttony`,
        desc: `Roll a dice each time this unit slays a model; on a 6 you can heal 1 wound that has been allocated to a model in this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Troggoth King`,
    effects: [
      {
        name: `Mutant Regeneration`,
        desc: `At the start of your hero phase, you can heal D3 wounds that have been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ferocious Retinue`,
        desc: `Re-roll hit rolls of 1 for friendly Chaos Troggoth units and Chaos Ogor units within 8" of this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Lord of the Monstrous Host`,
        desc: `If the Troggoth King uses this ability, then until your next hero phase all friendly Chaos Troggoths and Chaos Ogors may use this model's Bravery characteristic instead of their own.`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Chaos Troggoths`,
    effects: [
      {
        name: `Regeneration`,
        desc: `At the start of your hero phase, roll a dice. On a 2+ you can heal D3 wounds that have been allocated to models in this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Mutating Trollflesh`,
        desc: `For each hit roll of 6+ with this unit's Scavenged Clubs and Axes, make an additional hit roll with the same weapon against the same unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chaos Familiars`,
    effects: [
      {
        name: `Arcane Meddling`,
        desc: `Subtract 1 from casting and unbinding rolls for enemy WIZARDS while they are within 6" of any units of Chaos Familiars.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Great Taurus`,
    effects: [
      {
        name: `Blazing Body`,
        desc: `In each hero phase, roll a dice for every unit (friend or foe) within 3" of any Great Taurus. On a 6+ that unit suffers a mortal wound. This ability has no effect on Great Taurus.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood Rage`,
        desc: `If this unit made a charge move this turn, re-roll failed wound rolls for its Horns and Teeth.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lammasu`,
    effects: [
      {
        name: `Sorcerous Miasma`,
        desc: `Subtract 1 from casting rolls for WIZARDS (friend or foe) while they are within 18" of any Lammasus. This ability does not affect CHAOS WIZARDS.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Available to ALL factions in this Grand Alliance
export const ChaosUnits = []
