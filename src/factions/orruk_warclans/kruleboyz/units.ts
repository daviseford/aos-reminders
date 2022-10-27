import { DestructionUnits } from 'factions/grand_alliances'
import { keyPicker, tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import spells from './spells'

const AllPartOfDaPlanEffect = {
  name: `All Part of Da Plan`,
  desc: `lf a friendly KRULEBOYZ unit fails a battleshock test within 3" of any friendly units with this ability, only 1 model from that unit will flee.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}

const PickEmOffEffect = {
  name: `Pick 'Em Off`,
  desc: `When this unit attacks with its ranged weapon, use the Aimed Shot missile weapon characteristics if it did not make a normal move in the same turn and is more than 3" from all enemy units. Otherwise, use the Hasty Shot missile weapon characteristics.`,
  when: [SHOOTING_PHASE],
  shared: true,
}

const KruleboyzUnits = {
  'Man-skewer Boltboyz': {
    effects: [PickEmOffEffect],
  },
  'Hobgrot Slittaz': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Hobgrot Boss. Add 1 to the Attacks characteristic of that model's Slitta-knives.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Scrap Totem Bearer. You can reroll battleshock tests for a unit that includes any Scrap Totem Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Noise-maker. This unit can run and still shoot later in the turn if it includes any Noise-makers.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Stab 'Em Good!`,
        desc: `If the unmodified hit roll for an attack made with Slitta-knives is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Gutrippaz: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Gutrippa Boss. Add 1 to the Attacks characteristic of that model's Wicked Stikka.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scare Taktikz`,
        desc: `At the start of the charge phase, if this unit is more than 3" from all enemy units, you can pick 1 enemy unit within 12" of this unit that is not a HERO or MONSTER and roll 2D6. Add 1 to the roll for every 5 models in this unit. If the roll is equal to or greater than the Bravery characteristic of that enenny unit, subtract 1 from hit rolls for attacks made by that enemy unit that target this unit until the end of that turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Scare Taktikz`,
        desc: `If active, subtract 1 from hit rolls for attacks made by that enemy unit that target this unit until the end of that turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Murknob with Belcha-banna': {
    effects: [
      {
        name: `Power of Kragnos`,
        desc: `When a friendly KRULEBOYZ ORRUK unit wholly within 12" of this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 5+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE, END_OF_HERO_PHASE],
      },
      {
        name: `Breath of the Mire-drakes`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of this unit. On a 1, nothing happens. On a 2-5, that enemy unit suffers 1 mortal wound. On a 6, that enemy unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Swampcalla Shaman and Pot-grot': {
    mandatory: {
      spells: [keyPicker(spells, ['Summon Boggy Mist'])],
    },
    effects: [
      {
        name: `Companion`,
        desc: `This Swampcalla Shaman is accompanied by a Pot-grot that attacks with its Back-up Stabba. The Pot-grot must remain within 1" of the Swampcalla Shaman. For rules purposes, the Swampcalla Shaman and Pot-grot are treated as a single model.`,
        when: [DURING_GAME],
      },
      {
        name: `Poisons and Elixers`,
        desc: `In your hero phase, if this unit is more than 3" from all enemy units you can say that they are brewing either a poison or an elixir. If you do so, pick 1 friendly KRULEBOYZ ORRUK unit wholly within 12" of this unit, more than 3" from all enemy units and that has at least 1 model within 3" of this unit to be given that poison or elixir. A unit that has been given a poison or elixir cannot be given another poison or elixir in the same hero phase.
        
        If that unit is given a poison, until your next hero phase, when you use the Venom-crusted Weapons allegiance ability for that unit, mortal wounds are caused on an unmodified roll of 5+ instead of 6. 
        
        If that unit is given an elixir, add 1 to save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.ERRATA_BATTLESCROLL_OCTOBER_2022],
      },
    ],
  },
  'Killaboss on Great Gnashtoof': {
    effects: [
      AllPartOfDaPlanEffect,
      {
        name: `Savage Hound`,
        desc: `Add 1 to hit rolls for attacks made by this unit if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Killaboss on Corpse-rippa Vulcha': {
    effects: [
      AllPartOfDaPlanEffect,
      {
        name: `Commanding View`,
        desc: `You can use the same command ability more than once in the same phase if you pick this unit to issue the command (this unit still cannot issue more than 1 command in the same phase and a unit still cannot receive more than 1 command in the same phase).`,
        when: [DURING_GAME],
      },
    ],
  },
  'Killaboss with Stab-grot': {
    effects: [
      AllPartOfDaPlanEffect,
      {
        name: `Companion`,
        desc: `Killaboss is accompanied by a Stab-grot that attacks with its Prized Shiv. The Stab-grot must remain within 1" of the Killaboss. For rules purposes, the Killaboss and Stab-grot are treated as a single model.`,
        when: [DURING_GAME],
      },
      {
        name: `You Hold 'Em Off`,
        desc: `Each time a wound or mortal wound is allocated to this unit and not negated, you can choose to risk this unit's Stab-grot. If you do so. you must roll a dice. On a 1-5, the Stab-grot is killed and the wound is negated. On a 6 the Stab-grot is not killed and the wound is negated. If the Stab-grot is killed, the model representing it is removed from play before the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Beast-skewer Killbow': {
    effects: [
      PickEmOffEffect,
      {
        name: `Skewered`,
        desc: `To determine the Damage characteristic for an attack made with Beast-skewer Bolts, roll a number of dice equal to the Wounds characteristic of the target unit. The Damage characteristic is equal to 2, plus 1 for each roll of 5+, up to a maximum Damage characteristic of 12.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Breaka-boss on Mirebrute Troggoth': {
    effects: [
      {
        name: `Breaka-harness`,
        desc: `At the start of the combat phase, you can say that the Breaka-boss is yanking on his Mirebrute Troggoth's harness. If you do so, this unit suffers D3 mortal wounds but for each mortal wound it suffers, you can add 2 to the Attacks characteristic of its Iron-bound Clubs until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Regeneration`,
        desc: `In your hero phase. you can roll a dice for this unit. If you do so, on a 4+, heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Gobsprakk: {
    mandatory: {
      spells: [
        keyPicker(spells, [
          'Choking Mist',
          'Da Black Pit',
          'Nasty Hex',
          'Sneaky Miasma',
          'Summon Boggy Mist',
        ]),
      ],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 2 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase. If this unit is part of an Orruk Warclans army, it knows all of the spells from the Lore of the Swamp in addition to the other spells it knows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Glyphic Banners`,
        desc: `This model has a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Mork Sez No!`,
        desc: `Each time this unit unbinds a spell, the caster suffers D3 mortal wounds. If the spell was unbound with an unbinding roll of 10+, the caster suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mouth of Mork`,
        desc: `If this unit issues the Redeploy command to a Kruleboyz unit, you can reroll the dice that determines the distance the unit that receives the command can move.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Mouth of Mork`,
        desc: `If this unit issues the Unleash Hell command to a Kruleboyz unit, you do not have to subtract 1 from the hit rolls for the attacks made by the unit that receives the command.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Screamin' Mandrakk`,
        desc: `Once per battle, when this unit attempts to unbind a spell, you can say that it is using its Screamin' Mandrakk. If you do so, the unbinding roll for that attempt is made with 3D6 instead of 2D6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Snatchaboss on Sludgeraker Beast': {
    effects: [
      {
        name: `Sludgeraker Venom`,
        desc: `Add 1 to the number of mortal wounds caused by the Venom-encrusted Weapons battle trait if the unmodified hit roll was 6 and the attacking unit is wholly within 12" of any friendly units with this ability.
        
        Designer's Note: If a unit is affected by this ability and has been given a poison from the Swampcalla Shaman's Poisons and Elixirs ability, this ability does not affect unmodified hit rolls of 5 and only affects unmodified hit rolls of 6.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Snatch and Grab`,
        desc: `Once per battle, at the end of the combat phase, you can pick 1 enemy model that has a Wounds characteristic of 7 or less, does not have a mount and is within 3" of this unit, and roll 2D6. If the roll is greater than that enemy model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Swampboss Skumdrekk': {
    effects: [
      {
        name: `Bet-master`,
        desc: `If this unit is part of your army, after deployment but before the first battle round begins, you can pick 1 friendly Hobgrot unit to be the Kountin' Krew and 1 friendly unit to be the bet. You cannot pick this unit or the Kountin' Krew to be the bet.

        If the bet is the first friendly unit to be destroyed during the battle, you can pick 1 extra triumph enhancement for your army that can be used during the battle and even if the points total of your army is not less than that of your opponent's army. The unit that is chosen to benefit from the triumph must be either this unit or the Kountin' Krew.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Sludgeraker Venom`,
        desc: `Add 1 to the number of mortal wounds caused by the Venom-encrusted Weapons battle trait if the unmodified hit roll was 6 and the attacking unit is wholly within 12" of any friendly units with this ability.

        Designer's Note: If a unit is affected by this ability and has been given a poison from the Swampcalla Shaman's Poisons and Elixirs ability, this ability does not affect unmodified hit rolls of 5 and only affects unmodified hit rolls of 6.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Expert Snatch and Grab`,
        desc: `Once per battle, at the end of the combat phase, you can pick enemy model that has a Wounds characteristic of 7 or less, does not have a mount and is within 3" of this unit, and roll 2D6. If the roll is equal to or greater than that enemy model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Marshcrawla Sloggoth': {
    effects: [
      {
        name: `Grot Snatcha-krew`,
        desc: `At the end of the combat phase, you can pick 1 enemy model within 2" of this unit and roll a dice. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Krew Drummer`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly units that are wholly within 18" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Regeneration`,
        desc: `In your hero phase, you can roll a dice for this unit. If you do so, on a 4+, heal up to D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mannok Da Kunnin'": {
    effects: [
      {
        name: `Kunnin' Tricks`,
        desc: `If this unit is part of a Kruleboyz army, after you have picked a Dirty Trick to employ during the battle, roll a dice. Add 1 to the roll if this unit is your general. On a 5+, you can pick a second Dirty Trick to employ during the battle. The second Dirty Trick must be different to the first one you picked.`,
        when: [DURING_GAME],
      },
      {
        name: `Spasming Wreck`,
        desc: `When you use the Venom-encrusted Weapons battle trait for this unit, mortal wounds are caused on an unmodified hit roll of 5+ instead of 6.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `You Lot Hold 'Em Off`,
        desc: `Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to this unit, if this unit is within 3" of a friendly DA KUNNIN' KREW unit, you can roll a dice.

        On a 1, that wound or mortal wound is allocated to this unit as normal. On a 2-5, that wound or mortal wound is allocated to that friendly DA KUNNIN' KREW unit instead of this unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Da Kunnin' Krew": {
    effects: [
      {
        name: `Champion`,
        desc: `Torka Tuffskul is the unit champion. Add 1 to that model's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Snatcha-krew`,
        desc: `At the end of the combat phase, you can pick 1 enemy model within 2" of this unit and roll a dice. Add 1 to the roll if this unit includes Torka Tuffskul, and add 1 to the roll if this unit includes Shank. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Paymaster`,
        desc: `Do not take battleshock tests for this unit if it includes Krookgrin.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  ...keyPicker(DestructionUnits, ['Rogue Idol']),
}

export default tagAs(KruleboyzUnits, 'unit')
