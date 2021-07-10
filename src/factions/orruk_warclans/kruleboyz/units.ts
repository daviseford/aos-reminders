import { DestructionUnits } from 'factions/grand_alliances'
import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import spells from './spells'

const KruleboyzUnits = {
  'Man-skewer Boltboyz': {
    effects: [
      {
        name: `Pick 'Em Off`,
        desc: `When this unit attacks with a Man-skewer Crossbow, use the Aimed Shot missile weapon characteristics if it did not make a normal move in the same turn and is more than 3" from all enemy units. Otherwise, use the Hasty Shot missile weapon characteristics.`,
        when: [SHOOTING_PHASE],
      },
    ],
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
  'Killaboss on Great Gnashtoof': {
    effects: [
      {
        name: `All Part of Da Plan`,
        desc: `lf a friendly KRULEBOYZ unit fails a battleshock test within 3" of any friendly units with this ability, only 1 model from that unit will flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Savage Hound`,
        desc: `Add 1 to hit rolls for attacks made by this unit if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
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
        desc: `In your hero phase, if this unit is more than 3" from all enemy units, instead of attempting to cast any spells with this unit, you can say that they are brewing either a poison or an elixir. If you do so, pick 1 friendly KRULEBOYZ ORRUK unit wholly within 12" of this unit, more than 3" from all enemy units and that has at least 1 model within 3" of this unit to be given that poison or elixir. A unit that has been given a poison or elixir cannot be given another poison or elixir in the same hero phase.
        
        If that unit is given a poison, until your next hero phase, when you use the Venom-crusted Weapons allegiance ability for that unit, mortal wounds are caused on an unmodified roll of 5+ instead of 6. 
        
        If that unit is given an elixir, add 1 to save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Killaboss with Stab-grot': {
    effects: [
      {
        name: `Companion`,
        desc: `Killaboss is accompanied by a Stab-grot that attacks with its Prized Shiv. The Stab-grot must remain within 1" of the Killaboss. For rules purposes, the Killaboss and Stab-grot are treated as a single model.`,
        when: [DURING_GAME],
      },
      {
        name: `All Part of Da Plan`,
        desc: `lf a friendly KRULEBOYZ unit fails a battleshock test within 3" of any friendly units with this ability, only 1 model from that unit will flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `You Hold 'Em Off`,
        desc: `Each time a wound or mortal wound is allocated to this unit and not negated, you can choose to risk this unit's Stab-grot. If you do so. you must roll a dice. On a 1-5, the Stab-grot is killed and the wound is negated. On a 6 the Stab-grot is not killed and the wound is negated. If the Stab-grot is killed, the model representing it is removed from play before the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  ...keyPicker(DestructionUnits, ['Rogue Idol']),
}

export default tagAs(KruleboyzUnits, 'unit')
