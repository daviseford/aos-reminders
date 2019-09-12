import { filterUnits } from 'utils/filterUtils'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_ROUND,
} from 'types/phases'

// Export Chaos god aligned Everchosen units.
export const getEverchosenUnits = () => filterUnits(Units, [`Archaon`])

// Unit Names
export const Units: TUnits = [
  {
    name: `Archaon`,
    effects: [
      {
        name: `The Eye of Sheerian`,
        desc: `Roll a D6 and note the result. Until your next hero phase, whenever an enemy scores a hit on Archaon and the result equals the rolled number, the opponent must re-roll that dice.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Eye of Sheerian`,
        desc: `Enemy hits against Archaon that equal the rolled number must be re-rolled.`,
        when: [DURING_GAME],
      },
      {
        name: `The Slayer of Kings`,
        desc: `When Archaon directs all of his attacks with the Slayer of Kings at the same hero or monster and two or more wound rolls are 6+, the target is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Armour of Morkar`,
        desc: `If a save roll made for Archaon if an unmodified 6, the attacking model's unit suffers a mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `Chaos Runeshield`,
        desc: `Roll a D6 each time this Archaon suffers a mortal wound. On a 5+ it is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `The Crown of Domination`,
        desc: `When a battleshock test is made for a unit within 10" of Archaon, you can adjust the result of the dice roll up or down by 2.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Triple-headed Monstrosity: Filth-spewer`,
        desc: `If at least one model was slain by Dorghar's Three Heads, you can select this ability to deal D3 mortal wounds to an enemy unit within 7". (Can only select one head ability per combat activation).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Triple-headed Monstrosity: Skull-gorger`,
        desc: `If at least one model was slain by Dorghar's Three Heads, you can select this ability to heal D3 wounds allocated to this model. (Can only select one head ability per combat activation).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Triple-headed Monstrosity: Spell-eater`,
        desc: `If at least one model was slain by Dorghar's Three Heads, you can select this ability to learn any spells known by one of the slain models. (Can only select one head ability per combat activation).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Everchosen`,
        desc: `Roll a D6 if Archaon is affected by a spell cast by an enemy wizard. On a 4+ the spell has no effect on him (however it can still affect other units as normal).`,
        when: [DURING_GAME],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and any spells learned by Dorghar's Tzeentchian head during the battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warlord Without Equal`,
        desc: `If Archaon is your general and is on the battlefield, all other Chaos Heroes in your army can use 1 command ability that is on their warscroll and which can be used in the hero phase without a command point being spent.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Gaunt Summoner on Disc of Tzeentch`,
    effects: [
      {
        name: `Hovering Disc of Tzeentch`,
        desc: `Add 2 to this model's save rolls in this phase unless the attacker is a monster or can fly.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Book of Profane Secrets`,
        desc: `Once per battle, if this model is within 9" of a Realmgate it can use its Book of Profane Secrets. If it does so, you can summon 1, 10-man unit of Chaos daemons (your choice from which god) to the battlefield, and add it to your army. The summoned unit must be set up wholly within 9" of a this model and wholly within 9" of the Realmgate, and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Warptongue Blade`,
        desc: `If a Warptongue Blade inflicts damage on an enemy unit, roll two dice. If the roll is higher than the enemy unit's bravery characteristic, one model in the unit is slain. Otherwise the blade inflicts 1 wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wizard`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Fractal Mindstorm.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fractal Mindstorm`,
        desc: `Casting value equal to the bravery of target unit within 9" of caster. If successfully cast, roll a number of dice equal to the units bravery. It suffers 1 mortal wound for each 4+.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Varanguard`,
    effects: [
      {
        name: `Relentless Killers`,
        desc: `Once per battle, this unit can be chosen to pile in and attack for a second time during the same combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Impaling Charge`,
        desc: `A Fellspear has a to wound characteristic of 3+ and a rend of -2 if the wielder made a charge move in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Daemonforged Blades`,
        desc: `On hits of 6+ with Daemonforged Blades, roll a D6 instead of making a wound roll. On a 2+ the attack inflicts a mortal wound on the target. On a 1 this unit suffers a mortal wound instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpsteel Shields`,
        desc: `Roll a D6 if this unit is affect by a spell cast by an enemy wizard. If the result is 4+ the spell has no effect on the unit (although it will still effect other units as normal).`,
        when: [HERO_PHASE],
      },
      {
        name: `Favoured of the Everchosen`,
        desc: `If Archaon uses his command ability, all Varanguard can re-roll charge rolls in the subsequent charge phase.`,
        when: [HERO_PHASE, CHARGE_PHASE],
      },
      {
        name: `Favoured of the Everchosen`,
        desc: `Archaon is on the battlefield, you can add 1 to all hit rolls made for this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Archaon's Command`,
        desc: `If Archaon is on the battlefield, you can select a new Mark of Chaos for Varanguard units.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Overlords of Chaos`,
    effects: [
      {
        name: `Dark Vizier`,
        desc: `If Archaon is within 3" of the Gaunt Summoner in this battalion, you can roll a D6 (you can look at this roll but hide it from your opponent).`,
        when: [HERO_PHASE],
      },
      {
        name: `Dark Vizier`,
        desc: `If used in the previous round, reveal the hidden dice instead of deciding which player will take the first turn in the normal way. If the hidden result is a 1-3, your opponent goes first. Otherwise you go first.`,
        when: [START_OF_ROUND],
      },
      {
        name: `The Will of the Everchosen`,
        desc: `If Archaon is on the battlefield, pick a unit within 20" of him (or anywhere on the battlfield if the battalions Gaunt Summoner is on the battlefield). Until your next hero phase, the Varanguard can re-roll failed hit and wound rolls when attacking that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Will of the Everchosen`,
        desc: `If active, the Varanguard can re-roll failed hit and wound rolls when attacking the targeted unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodmarked Warband`,
    effects: [
      {
        name: `Brand of the Blood God`,
        desc: `If the number of models in a unit from this battalion is a multiple of 8 when first set up, you can re-roll wound rolls of 1 for that unit for the duration of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Blood Rage`,
        desc: `If any hero from this battalion slays an enemy model in the combat phase, then all other units from this battalion within 16" add 1 to attacks of any melee weapons used for the rest of the phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Raised to Greatness`,
        desc: `If a hero from this battalion is slain, pick another model in the warband that is not a hero. That model adds 1 to the attacks characteristic of all of its melee weapons and becomes a separate hero unit for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Plaguetouched Warband`,
    effects: [
      {
        name: `Grandfather's Favour`,
        desc: `If the number of models in a unit from this battalion is a multiple of 7 when first set up, in the combat phase if the wound roll for an attack that targets the valid battalion unit is a 6+, the attacker suffers 1 mortal wound after all its attacks have been made.`,
        when: [DURING_GAME],
      },
      {
        name: `Grandfather's Favour`,
        desc: `When the leader of a validly set up battalion unit is selected to attack, pick a unit within 1" and roll a D6. On a 4+ the target suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Life Abundant`,
        desc: `You opponent must subtract 1 from all hit rolls that target a unit in this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fatesworn Warband`,
    effects: [
      {
        name: `Scions of Change`,
        desc: `If the number of models in a unit from this battalion is a multiple of 9 when first set up, roll a D6 each time it suffers a wound or mortal wound. On a 6 the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Conduits of Arcane Power`,
        desc: `All weapons used by models in this battalion have a rend of -1 instead of '-'.`,
        when: [DURING_GAME],
      },
      {
        name: `Conduits of Arcane Power`,
        desc: `Heroes in this battalion can attempt to cast Arcane Bolt as if they were a wizard. If this model is already a wizard it can attempt to cast Arcane Bolt twice in each of its hero phases as an extra spell cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pleasurebound Warband`,
    effects: [
      {
        name: `Caress of the Dark Prince`,
        desc: `If the number of models in a unit from this battalion is a multiple of 6 when first set up, add 2 to its bravery characteristic for the duration of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Perverse Yearnings`,
        desc: `If a model from this battalion is slain in this phase, until the end of the phase add 3" to the distance models from this battalion can move on a pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Archaon's Grand Host`,
    effects: [
      {
        name: `Daemonic Pacts`,
        desc: `If Archaon is your general and on the battlefield, you can roll a D6. If you do so, on a 5+ you can summon one of the following units to the battlefield: 10 Plaguebearers; 10 Daemonettes; 10 Bloodletters; or 5 Pink Horrors. The summoned unit is added to your army, and must be set up wholly within 12" of Archaon and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Dark Command`,
        desc: `Once per game, units from this battalion wholly within 18" of Archaon and within 3" of an enemy unit can pile in and then attack with all of the melee weapons they are armed with. They can be selected to fight normally later in the same combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]
