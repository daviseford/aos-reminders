import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Eternal Conflagration`,
    effects: [
      {
        name: `Twisters of Materiality`,
        desc: `Improve the Rend characteristic of friendly Eternal Conflagration units' Warpflame, Billowing Warpflame, and Magical Flames missle weapons by 1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Infernos of Mutation`,
        desc: `You can use this command ability in the shooting phase. If you do so, pick 1 friendly Eternal Conflagration Daemon unit wholly within 12" of a friendly Daemon Hero. If the unmodified hit roll for any attack made by that unit's Warpflame, Billowing Warpflame, or Magical Flames missile weapons is 6, subtract 2 from the Bravery characteristic of the target unit until the end of the battle round. A unit cannot benefit from this command ability more than once per turn.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Coruscating Flames`,
        desc: `Subtract 1 from hit rolls for attacks made with missle weapons that target friendly Eternal Conflagration Daemon units wholly within 12" of this general.`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Shroud of Warpflame`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound inflicted by a melee weapon to the bearer. On a 3+, the attacking unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Hosts Duplicitous`,
    effects: [
      {
        name: `Ranks of Mischievous Mirages`,
        desc: `Enemy units within 3" of a Hosts Duplicitous unit cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Impossible to Anticipate`,
        desc: `You can use this command ability once per battle, immediately after a friendly Hosts Duplicitous Horrors of Tzeentch unit is destroyed. If you do so, roll a D6. On a 5+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 12" of a friendly Hosts Duplicitious Hero and more than 9" from any enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
        command_ability: true,
      },
      {
        name: `Will of the Phantom Lord`,
        desc: `You can reroll casting and unbinding rolls for friendly Hosts Duplicitous Daemon Wizards while they are wholly within 9" of this general.`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Brand of the Split Daemon`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Hosts Arcanum`,
    effects: [
      {
        name: `Thieves of All Things Arcane`,
        desc: `Once per turn, in the first, third, and fifth battle rounds, when a friendly Host Arcanum Wizard attempts to unbind a spell, the spell is automatically unbound.(do not roll 2D6).`,
        when: [HERO_PHASE],
      },
      {
        name: `Entourage of Sky-Sharks`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Hosts Arcanum Screamers unit wholly within 12" of a friendly Hero. Until your next hero phase, add 1 to save rolls for attacks that target that unit. In addition, until your next hero phase improve the Rend characteristic of that unit's Lamprey Bite by 1. A unit cannot benefit from the effects of this ability more than once per turn.`,
        when: [HERO_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Spell Hunters`,
        desc: `After armies have been set up but before the first battle round begins, D3 friendly Hosts Arcanum units that can fly can move 6".`,
        when: [START_OF_GAME],
        command_trait: true,
      },
      {
        name: `The Fanged Circlet`,
        desc: `Once per battle, at the start of your hero phase, you can add 1 unit of 6 Screamers to your army. Set up the unit wholly within 9" of the bearer and more than 9" away from any enemy units.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Cult of the Transient Form`,
    effects: [
      {
        name: `The Change-gift`,
        desc: `Roll a D6 each time a friendly Kairic Acolyte model is slain in the combat phase. On a 2-5, before removing that model from play, that model can fight. On a 6, before removing that model from play, you can add 1 Tzaangor model to an existing Tzaangor unit in your army. If you do so, set up that Tzaangor model within 1" of a friendly Tzaangor unit that is within 9" of the slain model. The modle can only be set up within 3" of an enemy unit if the friendly Tzaangor unit was within 3" of that enemy unit before any models were added.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fate of Transmutation`,
        desc: `You can use this command ability in your hero phase. Pick 1 Kairic Acolyte unit wholly within 12" of a friendly Hero. Until your next hero phase, each time a Kairic Acolyte model from that unit is slain, add 1 to the dice roll made for that unit's Change-gift ability.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Defiant in their Pursuit`,
        desc: `Add 2 to the bravery characteristic of friendly Cult of the Transient Form units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Chaotica Amulet`,
        desc: `Add 1 to the bearer's Wounds characteristic.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Pyrofane Cult`,
    effects: [
      {
        name: `Arrows of Tzeentch`,
        desc: `Add 1 to hit rolls for attacks made with Sorcerous Bolts by friendly Kairic Acolytes units. In addition, at the end of your shooting phase, roll a D6 for each enemy unit that suffered any wounds inflicted by attacks made with Sorcerous Bolts in that phase. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Immolate`,
        desc: `You can use this command ability in your shooting phase. Pick 1 friendly Kairic Acolyte unit wholly within 12" of a friendly Pryofane Cult Hero. You can reroll wound rolls for attacks made by that unit until the end of that phase.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Shrouded in Unnatural Flame`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Chainfire Amulet`,
        desc: `IF the unmodified hit roll for an attack made with a missile weapon made by the bearer is a 6, that attack inflicts D3 mortal wounds on the target and the attack sequence ends.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Guild of Summoners`,
    effects: [
      {
        name: `Scions of the Exiled`,
        desc: `If your army has the Guild of SUmmoners keyword, your Fate Points can only be used to summon Lord of Change untis. Instead of a Fate Point cost of 30, a Lord of Change costs 9 Fate Points to summon the first time, 18 Fate Points for the second time, and 30 Fate Points each time thereafter for the rest of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Will of the Arcane Lords`,
        desc: `You can use this command ability in your hero phase. If you do so, pick a friendly Guild of Summoners Wizard wholly within 9" of a friendly Guild of Summoners Hero or wholly within 18" of a friendly Hero that is a general. Add 1 to casting rolls for that Wizard until the end of that phase. A unit cannot benefit from this command ability more than once per turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Prophet of the Ostensible`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Brimstone Familiar`,
        desc: `Do not take battleshock tests for friendly Guild of Summoners units while they are wholly within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Unbound Flux`,
    effects: [
      {
        name: `Maddening Cascade`,
        desc: `Each time an Unbound Flux Daemon wizard casts a spell inflicting mortal wounds, roll a D6 for each unit that suffered any mortal wounds from the spell. On a 4+ that unit suffers 1 additional mortal wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fuelled by Mayhem`,
        desc: `Pick 1 friendly Unbound Flux daemon wizard wholly within 9" of a friendly Unbound Flux daemon hero or wholly within 18" of a friendly Unbound Flux daemon general. Add 1 to the casting rolls for that wizard until the end of the phase. A unit cannot benefit from this ability more than once per turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Aegis of Insanity`,
        desc: `Do not take battleshock tests for friendly Unbound Flux daemon units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `The Enlightener`,
        desc: `If the unmodified hit roll for an attack made with this weapon is 6, that attack deals D3 mortal wounds and the attack sequence ends.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Cult of a Thousand Eyes`,
    effects: [
      {
        name: `Marked for Death`,
        desc: `After armies have been setup before the first battle round, pick up to D3 different enemy units. For the rest of the battle, you can reroll hit rolls for melee attacks by friendly Cult of a Thousand Eyes mortal units targeting the selected units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Marked for Death`,
        desc: `You can reroll hit rolls for melee attacks against the pre-selected targets.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eyes Everywhere`,
        desc: `Pick 1 friendly Cult of a Thousand Eyes mortal unit wholly within 12" of a Cult of a Thousand Eyes mortal hero. Until the start of your next hero phase, enemy units do not receive the benefit of cover against the buffed unit.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Tzeentch is Pleased`,
        desc: `Each time you spend a command point, if this general is on the battlefield, you can roll a D6. On a 5+ you can heal D3 wounds allocated to this general.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Crown of Whispers`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
]

export default Allegiances
