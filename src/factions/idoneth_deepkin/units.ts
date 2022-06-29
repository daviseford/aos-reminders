import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_START_OF_TURN,
  WARDS_PHASE,
} from 'types/phases'
import Spells from './spells'

const DeepmareHornEffect = {
  name: `Deepmare Horn`,
  desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const StormshoalEffect = {
  name: `Stormshoal`,
  desc: `This unit has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const GiftsOfTheDepthsEffect = {
  name: `Gifts of the Depths`,
  desc: `This unit has a ward of 5+.`,
  when: [WARDS_PHASE],
  shared: true,
}
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in an IDONETH DEEPKIN army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}
const IconBearerChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be an Icon Bearer. Add 1 to the Attacks characteristic of that model's melee weapons.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const AkhelianGuardStandardBearerAndMusicianEffects = [
  {
    name: `Standard Bearer`,
    desc: `1 in every 3 models in this unit can be a Standard Bearer. Add 1 to the Bravery characteristic of this unit if it includes any Standard Bearers.`,
    when: [BATTLESHOCK_PHASE],
    shared: true,
  },
  {
    name: `Musician`,
    desc: `1 in every 3 models in this unit can be a Musician. Add 1 to charge rolls for this unit if it includes any Musicians.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
]

const Units = {
  'Eidolon of Mathlann, Aspect of the Storm': {
    effects: [
      StormshoalEffect,
      {
        name: `Crashing Upon the Foe`,
        desc: `You can heal up to D3 wounds allocated to this model after it makes a charge move.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Crashing Upon the Foe`,
        desc: `Add 1 to to the Attacks and Damage characteristics of this unit's Spear of Repressed Fury if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crashing Upon the Foe`,
        desc: `This model can retreat and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Drench with Hate`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly IDONETH DEEPKIN units (excluding mounts) that are wholly within 12" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pulled Into the Depths`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO with a wounds characteristic of 8 or less that is within 3" of this unit. Add 1 to hit and wound rolls for attacks made by this unit that target that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Eidolon of Mathlann, Aspect of the Sea': {
    mandatory: {
      spells: [keyPicker(Spells, ['Cloying Seas Mists', 'Tsunami of Terror'])],
    },
    effects: [
      GenericEffects.WizardTwoSpellsEffect,
      StormshoalEffect,
      {
        name: `Dormant Energies`,
        desc: `You can reroll casting, dispelling and unbinding rolls for this unit. If this unit successfully casts any spells in your hero phase, you can heal up to D3 wounds allocated to this unit at the end of that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Tranquillity of the Abyss`,
        desc: `Add 3 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 18" of any friendly models with this ability.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Volturnos, High King of the Deep': {
    effects: [
      WarmasterEffect,
      {
        name: `Cealith, the High King's Shield`,
        desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 3+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `First Among Akhelians`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly Akhelian units (excluding mounts) wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      DeepmareHornEffect,
      {
        name: `Supreme Lord of Tides`,
        desc: `Once per battle, at the start of the combat phase, you can pick up to 3 different friendly IDONETH DEEPKIN units that are affected by the High Tide ability from the Tides of Death table and are wholly within 12" of this unit. Add 1 to the Attacks characteristic of melee weapons used by the units you picked until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Akhelian Thrallmaster': {
    effects: [
      {
        name: `Akhelian Fighting Stance`,
        desc: `At the start of the combat phase, you must pick 1 of the following fighting stances for this unit to use. Each effect lasts until the end of that phase.

        Way of the Depths: You can reroll hit rolls of 1 for attacks made with melee weapons by this unit and friendly Namarti units wholly within 12" of this unit.

        Way of the Riptide: If the unmodified hit roll for an attack made with a melee weapon by this unit or a friendly Namarti unit wholly within 12" of this unit is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.

        Way of the Vortex: Subtract 1 from wound rolls for attacks that target this unit and friendly Namarti units wholly within 12" of this unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Akhelian King': {
    effects: [
      DeepmareHornEffect,
      {
        name: `Akhelian Paragon`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly Akhelian units (excluding mounts) wholly within 9" of this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of Tides`,
        desc: `Once per battle, at the end of your charge phase, you can pick up to D3 different friendly IDONETH DEEPKIN units wholly within 12" of any friendly units with this ability. If you do so, until the end of that turn, the units you picked are affected by the High Tide ability from the Tides of Death table in addition to any other abilities from the Tides of Death table they are affected by.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Wave Rider`,
        desc: `This unit's Bladed Polearm has a Rend characteristic of -3 and a Damage characteristic of 3 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Isharann Tidecaster': {
    mandatory: {
      spells: [keyPicker(Spells, ['Riptide'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Master of the Ethersea`,
        desc: `If any units with this ability are part of your army, you can pick 2 different Isharann rituals to influence the ethersea during the battle instead of 1.`,
        when: [TURN_ONE_START_OF_TURN],
      },
      GiftsOfTheDepthsEffect,
    ],
  },
  'Isharann Soulscryer': {
    effects: [
      {
        name: `Finder of Ways`,
        desc: `During deployment, instead of setting up this unit on the battlefield, you can place it to one side and say that it is travelling the ethersea as a reserve unit. If you do so, when you would set up a different IDONETH DEEPKIN unit during deployment, you can say that it is joining this unit travelling the ethersea as a reserve unit. Up to 2 units can join this unit in this way. At the end of your movement phase, you can set up this unit wholly within 6" of the battlefield edge and more than 9" from all enemy units. If you do so, set up all of the units that joined this unit wholly within 9" of this unit and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Finder of Ways`,
        desc: `At the end of your movement phase, you can set up this unit wholly within 6" of the battlefield edge and more than 9" from all enemy units. If you do so, set up all of the units that joined this unit wholly within 9" of this unit and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      GiftsOfTheDepthsEffect,
    ],
  },
  'Isharann Soulrender': {
    effects: [
      {
        name: `Lurelight`,
        desc: `At the end of the battleshock phase, you can pick 1 friendly NAMARTI unit wholly within 18" of this unit and return up to D3 slain models to that unit. You can return up to 3 slain models to that unit instead if any enemy models were slain by attacks made with this unit's Talunhook in the same turn. The same unit cannot be affected by the Lurelight ability more than once per turn.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Hangman's Knot`,
        desc: `Once per battle, at the end of the combat phase, you can pick 1 enemy model that has a Wounds characteristic of 7 or less, does not have a mount and is within 3" of this unit, and roll 2D6. If the roll is greater than that enemy model's Wounds characteristic, it is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
      GiftsOfTheDepthsEffect,
    ],
  },
  'Akhelian Allopexes': {
    effects: [
      {
        name: `Champion`,
        desc: `If this unit has 2 or more models, 1 model in this unit can be an Alpha Allopex. Add 1 to hit rolls for attacks made with that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bloodthirsty Predators`,
        desc: `Add 1 to the Attacks characteristic of this unit's Ferocious Bites if it is within 6" of any enemy models that have any wounds or mortal wounds allocated to them or if it is within 6" of any enemy units that have had any models slain in that turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Entangled`,
        desc: `If an attack made with this unit's Retarius Net Launchers scores a hit, the target unit cannot make pile-in moves in that turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `A Merciless Shiver`,
        desc: `If this unit has 2 or more models, it is coherent if each model in the unit is within 3" horizontally of at least 1 other model in the unit instead of 1".`,
        when: [DURING_GAME],
      },
    ],
  },
  'Lotann, Warden of the Soul Ledgers': {
    effects: [
      {
        name: `Catalogue of Souls`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly IDONETH DEEPKIN units wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      GiftsOfTheDepthsEffect,
    ],
  },
  'Akhelian Leviadon': {
    effects: [
      {
        name: `Jaws of Death`,
        desc: `If the unmodifed hit roll for an attack made with this unit's Crushing Jaws is 6, that attack inflicts 3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).
        
        If the unmodifed hit roll for an attack made with this unit's Crushing Jaws is 6 and the target is a MONSTER, that attack inflicts 6 mortal wounds on the target instead of 3 and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Void Drum`,
        desc: `Add 1 to save rolls for attacks that target friendly IDONETH DEEPKIN units that have a Wounds characteristic of 8 or less that are wholly within 12" of any friendly Leviadons.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Void Drum`,
        desc: `Add 1 to hit rolls for attacks made by friendly Namarti units that target an enemy unit wholly within 12" of any friendly Leviadons.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Crushing Charge`,
        desc: `If you carry out a Stomp monstrous rampage with this unit and the enemy unit you picked has a Wounds characteristic of 1, that enemy unit suffers D6 mortal wounds on a 2+ instead of D3.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Akhelian Morrsarr Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lochian Prince. Add 1 to the Attacks characteristic of that model's Voltspear.`,
        when: [COMBAT_PHASE],
      },
      ...AkhelianGuardStandardBearerAndMusicianEffects,
      {
        name: `Biovoltaic Blast`,
        desc: `Once per battle, after this unit makes a charge move, you can say this unit will unleash its biovoltaic energy. If you do so, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the number of models in this unit. For each 4+, that enemy unit suffers 1 mortal wound. For each 6+, that enemy unit suffers D3 mortal wounds instead. Add 1 to the roll if the number of models in that enemy unit is greater than the number of models in this unit.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Wave Riders`,
        desc: `This unit's voltspears have a Rend characteristic of -2 and a Damage characteristic of 2 if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Akhelian Ishlaen Guard': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Lochian Prince. Add 1 to the Attacks characteristic of that model's Helsabre.`,
        when: [COMBAT_PHASE],
      },
      ...AkhelianGuardStandardBearerAndMusicianEffects,
      {
        name: `Biovoltaic Barrier`,
        desc: `Ignore modifiers (positive and negative) to save rolls for attacks that target this unit. In addition, this unit has a Save characteristic of 3+ instead of 4+ if it charged in the same turn.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Namarti Thralls': {
    effects: [
      IconBearerChampionEffect,
      {
        name: `Sweeping Blows`,
        desc: `Add 1 to the Attacks characteristic of a Lanmari Blades if targethas a Wounds characteristic of 1. Add 1 to the Damage characteristic instead if the target has a Wounds characteristic of 3 or more.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Namarti Reavers': {
    effects: [
      IconBearerChampionEffect,
      {
        name: `Ripples in the Ethersea`,
        desc: `Add 1 to hit rolls for attacks made with missile weapons by this unit if the target is within 9" of the attacking model.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Elathain Ill-fated': {
    effects: [
      {
        name: `Soulnet`,
        desc: `Once per battle, at the end of the combat phase, you can pick 1 enemy HERO that has a Wounds characteristic of 7 or less, does not have a mount and is within 3" of this model and roll 2D6. If the roll is greater than the that enemy model's Wounds characteristic, it is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Envenomed Bite`,
        desc: `If the unmodified hit roll for an attack made with this unit's Envenomed Bite is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lurelight`,
        desc: `At the end of the battleshock phase, you can pick 1 friendly NAMARTI unit wholly within 18" of this unit and return up to D3 slain models to that unit. You can return up to 3 slain models to that unit instead if any enemy models were slain by attacks made with this this unit's Talunsickle and Soulnet in the same turn. The same unit cannot be affected by the Lurelight ability more than once per turn.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      GiftsOfTheDepthsEffect,
    ],
  },
  "Elathain's Soulraid": {
    effects: [
      {
        name: `Fuirann's Shield`,
        desc: `Fuirann has a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
