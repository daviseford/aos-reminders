import { keyPicker, tagAs } from 'factions/metatagger'
import orruk_rule_sources from 'factions/orruk_warclans/rule_sources'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_ANY_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  TURN_TWO_END_OF_MOVEMENT_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import DestructionCommandAbilities from './command_abilities'
import { TItemDescriptions } from 'factions/factionTypes'

const ShroudingMistEffects = [
  {
    name: `Shrouding Mists`,
    desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this model.`,
    when: [SHOOTING_PHASE],
    shared: true,
  },
  {
    name: `Shrouding Mists`,
    desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 5+ that mortal wound is negated.`,
    when: [WOUND_ALLOCATION_PHASE],
    shared: true,
  },
]
const UnnaturalFleshEffect = {
  name: `Unnatural Flesh`,
  desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
  when: [HERO_PHASE],
  shared: true,
}
const BaleglyphMaulsEffect = {
  name: `Baleglyph Mauls`,
  desc: `If the unmodified wound roll for an attack made with a Baleglyph Maul is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const DestructionUnits = {
  Basilisk: {
    effects: [
      {
        name: `Corrosive Miasma`,
        desc: `At the start of the combat phase, roll 1 dice for each enemy unit within 3" of this model. On a 2+, that unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Malignant Gaze`,
        desc: `In your hero phase, you can pick 1 enemy unit within 12" of this model that is visible to it, and roll a D6. On a 1, nothing happens. On a 2-3, that unit suffers D3 mortal wounds. On a 4+, that unit suffers D3+1 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dread Maw': {
    effects: [
      {
        name: `Devourer From Below`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is tunnelling through the earth in reserve. If you do so, at the end of your second movement phase, you must set up this model on the battlefield more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_TWO_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Impenetrable Hide`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 4+ that mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Yawning Maw`,
        desc: `You can reroll wound rolls of 1 for attacks made with this model's Cavernous Maw if the target unit has a Wounds characteristic of 2 or less.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tunnel Worm`,
        desc: `When this model makes a move, it can pass across terrain features and other models in the same manner as a model that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Fimirach Noble': {
    mandatory: {
      command_abilities: [keyPicker(DestructionCommandAbilities, ['Born to Lead'])],
    },
    effects: [...ShroudingMistEffects, UnnaturalFleshEffect, BaleglyphMaulsEffect],
  },
  'Fimir Warriors': {
    effects: [...ShroudingMistEffects, UnnaturalFleshEffect, BaleglyphMaulsEffect],
  },
  'Incarnate Elemental Of Beasts': {
    effects: [
      {
        name: `Savage Frenzy`,
        desc: `If this model is slain, before removing the model from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with. This model is then removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Incarnate of Ghur`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if the battle is taking place in Ghur, the Realm of Beasts. In addition, you can reroll wound rolls of 1 for attacks made by this model if the battle is taking place in Ghur, the Realm of Beasts.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Lure of Spirit Blood`,
        desc: `You can reroll charge rolls for this model while it is within 12" of any enemy models that have any wounds allocated to them.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Howl of the Great Beast`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 8" of this model.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Incarnate Elemental Of Fire': {
    effects: [
      {
        name: `Ashes to Ashes`,
        desc: `If the unmodified hit roll for an attack made by this model is 6, double the Damage characteristic for that attack.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Gift of Elemental Fire`,
        desc: `At the end of the combat phase, roll a D6 for each enemy unit within 3" of this model. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Incarnate of Aqshy`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if the battle is taking place in Aqshy, the Realm of Fire. In addition, you can reroll wound rolls of 1 for attacks made by this model if the battle is taking place in Aqshy, the Realm of Fire.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Magma Dragon': {
    effects: [
      {
        name: `Brimstone Dragonfire`,
        desc: `Do not use the attack sequence for an attack made with this model's Brimstone Dragonfire. Instead, roll a D6. On a 2+, the target unit suffers D6 mortal wounds. If the target unit has 10 or more models, it suffers 2D6 mortal wounds instead of D6.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Burning Blood`,
        desc: `Roll a D6 each time a wound or mortal wound that was inflicted by a melee weapon is allocated to this model. On a 4+, the attacking unit suffers 1 mortal wound. On a 6, the attacking unit suffers D3 mortal wounds instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Merwyrm: {
    effects: [
      {
        name: `Abyssal Predator`,
        desc: `If the unmodified wound roll for an attack made with this model's Hideous Jaws is 6, that attack has a Damage characteristic of D6 instead of D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stench of the Deep`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unnatural Metabolism`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Rogue Idol': {
    effects: [
      {
        name: `Avalanche!`,
        desc: `If this model is slain, before removing the model from play, roll a D6 for each unit within 3" of this model. On a 4+, that unit suffers D3 mortal wounds. This model is then removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Da Big' Un`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Livin' Idol`,
        desc: `Add 1 to casting rolls for friendly Orruk WIZARDS and friendly Grot WIZARDS while they are within 6" of any friendly models with this ability. In addition, add 1 to the Bravery characteristic of friendly Orruk and friendly Grot units while they are wholly within 18" of any friendly models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rubble and Ruin`,
        desc: `At the end of the combat phase, roll a D6 for each enemy unit within 3" of this model. On a 4+, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Spirit of the Waaagh!`,
        desc: `You can reroll hit rolls of 1 for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Kragnos: {
    effects: [
      {
        name: `Bellow of Rage`,
        desc: `At the end of any phase, if any wounds were allocated to this unit in that phase, roll a dice for each other unit and each defensible terrain feature within 6" of this unit. If the roll is equal to or greater than the Bellow of Rage value shown on this unit's damage table, that unit suffers D3 mortal wounds or that defensible terrain feature is demolished.`,
        when: [END_OF_ANY_PHASE],
        rule_sources: [orruk_rule_sources.BATTLETOME_ORRUK_WARCLANS],
      },
      {
        name: `The End of Empires`,
        desc: `If a friendly DESTRUCTION unit is wholly within 12" of this unit, you can attempt a charge with that unit if it is within 18" of an enemy unit instead of 12". In addition, when making a charge roll for a friendly DESTRUCTION unit wholly within 12" of this unit, roll 3D6 instead of 2D6.`,
        when: [CHARGE_PHASE],
        rule_sources: [orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `Avatar of Destruction`,
        desc: `If the effect of a spell or ability would slay this model without any wounds or mortal wounds being caused by the spell or ability, this model suffers D6 mortal wounds instead of being slain.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `Mightiest Makes Rightiest`,
        desc: `For the purposes of contesting objectives, this unit counts as a number of models equal to the Mightiest Makes Rightiest value on its damage table.`,
        when: [DURING_GAME],
        rule_sources: [orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `Rampaging Destruction`,
        desc: `After this unit makes a charge move, you can either roll a dice for each enemy unit within 1" of this unit or you can pick 1 enemy MONSTER within 1" of this unit and roll 2D6.

        If you roll a dice for each enemy unit within 1" of this unit, on a 2+, that enemy unit suffers D6 mortal wounds.

        If you pick 1 enemy MONSTER within 1" of this unit and roll 2D6, on a 7, nothing happens. On any other roll, that enemy MONSTER suffers a number of mortal wounds equal to the score of the dice used for the 2D6 roll multiplied together. For example, a 2D6 roll of 2 and 6 would inflict 12 mortal wounds (2  6 = 12).`,
        when: [CHARGE_PHASE],
        rule_sources: [orruk_rule_sources.BATTLETOME_ORRUK_WARCLANS, orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `The Shield Inviolate`,
        desc: `This unit has a ward of 6+.`,
        when: [WARDS_PHASE],
        rule_sources: [orruk_rule_sources.BATTLETOME_ORRUK_WARCLANS, orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `The Shield Inviolate`,
        desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll 3D6. If the roll is greater than the casting value of that spell or the spell used to summon that endless spell, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
        when: [HERO_PHASE],
        rule_sources: [orruk_rule_sources.BATTLETOME_ORRUK_WARCLANS, orruk_rule_sources.ERRATA_DECEMBER_2021],
      },
      {
        name: `Warmaster`,
        desc: `This unit can be included in an Orruk Warclans, Gloomspite Gitz, Ogor Mawtribes or Sons of Behemat army. If it is, it is treated as a general even if it is not the model picked to be the army's general. In addition, you can still use the army's allegiance abilities even though this unit is not from the army's faction; however, this unit does not benefit from them.`,
        when: [DURING_GAME],
        rule_sources: [
          meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS,
          meta_rule_sources.ERRATA_BROKEN_REALMS_KRAGNOS_JULY_2021,
          orruk_rule_sources.ERRATA_DECEMBER_2021,
        ],
      },
    ],
  },
  "Braggit's Bottle-Snatchaz": {
    effects: [
      {
        name: `Major Irritant`,
        desc: `If a unit in this regiment of renown receives the Redeploy command, any other friendly units in this regiment of renown within 6" of that unit can immediately make a D6" move but they must finish that move more than 3" from all enemy units and cannot shoot later in the turn.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_1],
      },
      {
        name: `Secret Tunnels`,
        desc: `Instead of setting up the units in this regiment of renown on the battlefield, you can place them to one side and say that they are navigating secret tunnels. If you do so, at the start of your first hero phase, you can set up all of these units wholly within 6" of the edge of the battlefield and more than 9" from all enemy units. The units you set up cannot move in the following movement phase.`,
        when: [DURING_SETUP],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_1],
      },
      {
        name: `Secret Tunnels`,
        desc: `If you set this unit up in secret tunnels, at the start of your first hero phase, you can set up all of these units wholly within 6" of the edge of the battlefield and more than 9" from all enemy units. The units you set up cannot move in the following movement phase.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_1],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(DestructionUnits, 'unit')
