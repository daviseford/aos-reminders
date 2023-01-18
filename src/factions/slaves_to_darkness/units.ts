import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Prayers from './prayers'
import rule_sources from './rule_sources'
import Spells from './spells'

// Common effects used on multiple warscrolls.
const WarmasterEffect = {
  name: `Warmaster`,
  desc: `If this unit is included in your army, it is treated as a general even if it is not the model picked to be the army's general.`,
  when: [DURING_GAME],
  shared: true,
}
const strikeFirstOnChargeEffect = {
  name: `Blade of the First Prince / The Knights of Chaos`,
  desc: `The strike-first effect applies to this unit if it has made a charge move in the same turn.`,
  when: [START_OF_COMBAT_PHASE],
  shared: true,
}
const knightsOfChaosEffect = {
  name: `The Knights of Chaos`,
  desc: `If this unit has made a charge move in the same turn, after this unit has fought in the combat phase for the first time, you can pick 1 friendly CHAOS KNIGHT, CHAOS CHARIOT or GOREBEAST CHARIOT unit wholly within 12" of this unit and that has not yet fought in that phase. That unit can fight immediately.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const ChaosRuneshieldEffect = {
  name: `Chaos Runeshield / Rune-etched Plating`,
  desc: `Roll a D6 each time the equipped model suffers a mortal wound. On a 5+ it is negated.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}
const DarkBlessingsEffect = {
  name: `Dark Blessings / The Rewards of Chaos`,
  desc: `After deployment, you can roll once on the Eye of the Gods table for this unit.`,
  when: [START_OF_GAME],
  shared: true,
}
const OracularVisionsEffects = [
  {
    name: `Oracular Visions`,
    desc: `In your hero phase, you can pick 1 friendly MORTAL SLAVES TO DARKNESS unit wholly within 12" of this unit. That unit has gets a 6+ ward until the start of your next hero phase.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
    shared: true,
  },
  {
    name: `Oracular Visions`,
    desc: `If active, 6+ ward unit until your next hero phase.`,
    when: [WOUND_ALLOCATION_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
    shared: true,
  },
]
const DaemonforgedWeaponEffect = {
  name: `Daemonbound / Soul Splitter`,
  desc: `If the unmodified hit roll for an attack made with the appropriate weapon is 6, that attack inflicts 1 mortal wound in addition to any normal damage.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const chaosLanceEffect = {
  name: `Chaos Lance`,
  desc: `Add 1 to the Damage characteristic and improve the Rend characteristic of this unit's Chaos Lance by 1 if it made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BerserkRageEffect = {
  name: `Berserk Rage`,
  desc: `Add 1 to wound rolls for melee attacks made by this model if any wounds or mortal wounds were allocated to this model earlier in the same phase.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const TerritorialPredatorEffect = {
  name: `Territorial Predator`,
  desc: `Add 1 to the Damage of attacks made with this unit's Honed Fangs and Claws that target an enemy MONSTER.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const TribalWarleaderEffect = {
  name: `Tribal Warleader`,
  desc: `After this unit has fought in the combat phase for the first time, you can pick 1 friendly DARKOATH unit that has not yet fought in that combat phase, is within 3" of an enemy unit and is wholly within 12" of this unit, that unit can fight immediately.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const ChaosChariotEffects = [
  {
    name: `Don't Spare the Lash`,
    desc: `Once per battle, this unit can run and still charge later in the same turn.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    shared: true,
  },
  {
    name: `Swift Death`,
    desc: `After finishing a charge move with this unit, pick 1 enemy unit within 1". Roll a number of dice equal to the charge roll. For each 5+ that enemy suffers 1 mortal wound.`,
    when: [CHARGE_PHASE],
    shared: true,
  },
]
const SilveredPortalEffect = {
  name: `Silvered Portal`,
  desc: `After you have deployed this unit, when you would set up another friendly TZEENTCH unit that is not a MONSTER, you can say that it is in this Gaunt Summoner's Silver Tower as a reserve unit. Up to 2 units can be set up in reserve in this way. At the end of any of your movement phases, you can set up 1 or more of these units on the battlefield wholly within 9" of this unit and more than 9" from all enemy units. At the start of the fourth battle round, reserve units that are still in a Silver Tower are destroyed.`,
  when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
  shared: true,
}
// Common unit composition effects.
const UnitLeaderEffect = {
  name: `Unit Leader`,
  desc: `Add 1 to the attacks characteristic of the unit leader's melee weapons (excluding its mount if it has one).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const MusiciansEffect = {
  name: `Musicians`,
  desc: `If the unit includes any musicians, add 1 charge rolls.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const StandardBearersEffect = {
  name: `Standard Bearers`,
  desc: `Add 1 to the bravery of a friendly unit containing any standard bearers.`,
  when: [DURING_GAME],
  shared: true,
}
const IconBearersEffect = {
  name: `Icon Bearers`,
  desc: `Subtract 1 from the bravery characteristic of enemy units while they are within 6" of any friendly icon bearers.`,
  when: [DURING_GAME],
  shared: true,
}

// Marauder specific effects.
const DarkwoodShieldEffect = {
  name: `Darkwood Shield`,
  desc: `This unit has a Save characteristic of 5+ instead of 6+.`,
  when: [SAVES_PHASE],
  shared: true,
}

// Chariot specific effects.
const ExaltedCharioteerEffect = {
  name: `Exalted Charioteer`,
  desc: `If this unit has 2 or more models, 1 model in this unit can be an Exalted Charioteer. Add 1 to attacks made with that model's melee weapons (excluding those of its mount)`,
  when: [COMBAT_PHASE],
  rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
  shared: true,
}

// Chaos Mark Effects.
const ChaosMarkAll = {
  name: `Mark of Chaos (${MARK_KHORNE}, ${MARK_NURGLE}, ${MARK_SLAANESH}, ${MARK_TZEENTCH}, ${MARK_UNDIVIDED})`,
  desc: `This unit either has or must take any Mark of Chaos during list construction.`,
  when: [DURING_SETUP],
  shared: true,
}

const ChaosMarkSorcerer = {
  name: `Mark of Chaos (${MARK_NURGLE}, ${MARK_SLAANESH}, ${MARK_TZEENTCH}, ${MARK_UNDIVIDED})`,
  desc: `This unit must take any one of the following Mark of Chaos during list construction: Nurgle, Slaanesh, Tzeentch, or Undivided.`,
  when: [DURING_SETUP],
  shared: true,
}

const ChaosMarkKhorne = {
  name: `Mark of Chaos (${MARK_KHORNE})`,
  desc: `This unit must take the Khorne Mark of Chaos during list construction.`,
  when: [DURING_SETUP],
  shared: true,
}

const ChaosMarkTzeentch = {
  name: `Mark of Chaos (${MARK_TZEENTCH})`,
  desc: `This unit must take the Tzeentch Mark of Chaos during list construction.`,
  when: [DURING_SETUP],
  shared: true,
}

const Units = {
  'Archaon the Everchosen': {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['By My Will'])],
    },
    effects: [
      ChaosMarkAll,
      WarmasterEffect,
      GenericEffects.WizardTwoSpellsEffect,
      {
        name: `The Armour of Morkar`,
        desc: `This unit has a ward of 5+ against. In addition, for each unmodified ward roll of 6, you can pick 1 enemy unit within 3" to suffer 1 mortal wound that cannot be negated.`,
        when: [WARDS_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `The Crown of Domination`,
        desc: `Enemy units cannot receive the Rally or Inspiring Presence commands while they are within 12"`,
        when: [BATTLESHOCK_PHASE, START_OF_HERO_PHASE],
      },
      {
        name: `The Eye of Sheerian`,
        desc: `Once per battle, at the start of your hero phase, you can say that Archaon will consult the Eye of Sheerian. 
        Roll a dice, on a 1-3 your opponent must take the first turn in the next battle round, on a 4+ you must take the first turn.
        This ability cannot be used while there is an enemy Archaon on the battlefield.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `The Everchosen`,
        desc: `Each time this unit is affected by a spell or endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or that endless spell on this unit.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `The Favoured Warlord`,
        desc: `After players have received their starting command points, you can pick 1 of the following Mark of Chaos Keywords: KHORNE, TZEENTCH, NURGLE, or SLAANESH.
        This unit has that Mark of Chaos in addition to the UNDIVIDED Mark of Chaos.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Slayer of Kings`,
        desc: `Each time this unit fights, if the unmodified wound roll for 2 or more attacks that target the same enemy HERO with the Slayer of Kings is 6, that HERO is slain.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Filth-spewer`,
        desc: `You can carry out this monstrous rampage with this unit instead of any other monstrous rampage. Pick 1 enemy unit within 6" of this model and roll a number of dice equal to the number of models in that unit (max of 7). For each 3+, that unit suffers 1 mortal wound.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Skull-gorger`,
        desc: `You can carry out this monstrous rampage with this unit instead of any other monstrous rampage. Pick 1 enemy unit within 3" of this model and roll a dice. If the roll is greater than that model's Wounds characteristic, it is slain. You can heal a number of wounds equal to that unit's Wound characteristic.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
      {
        name: `Spell-eater`,
        desc: `You can carry out this monstrous rampage with this unit instead of any other monstrous rampage. Pick 1 endless spell within 12" of this model and roll a dice. On a 2+ that endless spell is dispelled and if the caster is on the battlefield they suffer D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Daemon Prince': {
    effects: [
      ChaosMarkAll,
      {
        name: `Wings`,
        desc: `If this unit has wings it can fly and has a Move speed of 12"`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `The Mounted Skulls of Fallen Foes`,
        desc: `If this unit has a trophy rack, do not take battleshock tests for friendly unts wholly within 9". In addition, each time an enemy HERO or MONSTER is destroyed by this unit in the same turn, increase the range of this ability by 3".`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Aura of Chaos`,
        desc: `This unit has a 6+ ward.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Hellforged Sword`,
        desc: `If the unmodified hit roll for an attack made with a Hellforged Sword is 6, that attack inflicts D3 mortal wounds and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Immortal Champion`,
        desc: `This unit can carry out a heroic action based on it's Mark of Chaos.
        
        Undivided: Until the end of the turn, the strike-first effect applies to this unit.
        Khorne: Until the end of the turn, each time an enemy model is slain by wounds allocated from attacks made by this unit, heal 1 wound allocated to this unit.
        Tzeentch: If it is the enemy hero phase, 2+ spell ignore for this unit. If it is your hero phase, this unit can attempt to cast 1 spell from the Lore of the Damned in the same manner as a WIZARD. If this unit is already a WiZARD, this spell is in addition to any others it can attempt to cast.
        Nurgle: Until the end of the turn, ward rolls cannot be made for enemy units while they are within 3" of this unit.
        Slaanesh: If this unit makes a charge move this turn, add 1 to the Attacks characteristic of this unit's melee weapons until the end of the turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Fiendish Speed`,
        desc: `If in effect, the strike-first effect applies to this unit. Note: See Immortal Champion - Start of Hero Phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Heroic Action: Pledge of Skulls`,
        desc: `Each time an enemy model is slain by wounds allocated from attacks made by this unit, heal 1 wound allocated to this unit. Note: See Immortal Champion - Start of Hero Phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Heroic Action: Eldritch Architect`,
        desc: `If it is the enemy hero phase, 2+ spell ignore for this unit. If it is your hero phase, this unit can attempt to cast 1 spell from the Lore of the Damned in the same manner as a WIZARD. If this unit is already a WiZARD, this spell is in addition to any others it can attempt to cast. Note: See Immortal Champion - Start of Hero Phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Heroic Action: Eroding Miasma`,
        desc: `Until the end of the turn, ward rolls cannot be made for enemy units while they are within 3" of this unit. Note: See Immortal Champion - Start of Hero Phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Heroic Action: Ecstatic Carnage`,
        desc: `If this unit makes a charge move this turn, add 1 to the Attacks characteristic of this unit's melee weapons until the end of the turn. Note: See Immortal Champion - Start of Hero Phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Varanguard: {
    effects: [
      GenericEffects.Elite,
      ChaosMarkAll,
      DaemonforgedWeaponEffect,
      {
        name: `Impaling Charge`,
        desc: `Add 1 to wound rolls and improve rend by 1 for this unit's Fellspears if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Relentless Killers`,
        desc: `Once per battle, in the combat phase this unit can be chosen to pile in and attack for a second time during the same combat phase if it is within 3" of any enemy units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Warpsteel Shields`,
        desc: `4+ ward against mortal wounds.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  "Be'Lakor": {
    mandatory: {
      spells: [keyPicker(Spells, ['Enfeeble Foe'])],
    },
    effects: [
      {
        name: `Shadow Form`,
        desc: `Ignore positive and negative modifiers when making save rolls for this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `The Dark Master`,
        desc: `Once per battle, pick 1 enemy unit on the battlefield. Starting now and until your next hero phase, roll a D6 at the start of each phase. On a 3+ the target cannot move, shoot, fight, use command abilities, chant prayers, or cast/dispell/unbind spells in that phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Dark Master`,
        desc: `If active, roll a D6 to trigger the Dark Master effects.`,
        when: [
          START_OF_MOVEMENT_PHASE,
          START_OF_SHOOTING_PHASE,
          START_OF_CHARGE_PHASE,
          START_OF_COMBAT_PHASE,
          START_OF_BATTLESHOCK_PHASE,
        ],
      },
      {
        name: `Lord of Torment`,
        desc: `If an enemy unit within 12" fails a battleshock test, this model heals D3 wounds currently allocated to it.`,
        when: [BATTLESHOCK_PHASE],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  Eternus: {
    effects: [
      strikeFirstOnChargeEffect,
      {
        name: `Network of Spies`,
        desc: `If this unit is within 1" of friendly Chaos Legionnaires or Furies, you gain 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Veins of Black Lightning`,
        desc: `At the end of your movement phase, if this unit has been slain, roll 2D6 and add 1 to the roll if BE'LAKOR is in your army and on the battlefield. On an 8+, you can set up this unit anywhere on the battlefield more than 9" from enemies.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Gaunt Summoner on Disc of Tzeentch': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Flames'])],
    },
    effects: [
      ChaosMarkTzeentch,
      SilveredPortalEffect,
      {
        name: `Book of Profane Secrets`,
        desc: `Add 1 to casting, dispelling, and unbinding rolls. This unit knows all of the spells in the lore of the Damned.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lords of the Silver Towers`,
        desc: `Once per battle, at the end of a phase, you can pick 1 enemy unit Hero that is within 9" of this unit and that made an attack that targeted this unit in that phase, or caused any mortal wounds to this unit with an ability or spell in that phase (even if the wounds or mortal wounds were negated). If you do so, roll 2D6, If the roll is greater than the Wounds characteristic of that Hero, that Hero is removed from play.
        
        Designer's Note: The Hero cannot be returned if you are allowed to bring back slain models (the model has not been slain).`,
        when: [DURING_GAME],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Gaunt Summoner': {
    mandatory: {
      spells: [keyPicker(Spells, ['Infernal Flames'])],
    },
    effects: [
      ChaosMarkTzeentch,
      SilveredPortalEffect,
      {
        name: `Book of Profane Secrets`,
        desc: `Add 1 to casting, dispelling, and unbinding rolls. This unit knows all of the spells in the lore of the Damned.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lords of the Silver Towers`,
        desc: `Once per battle, at the end of a phase, you can pick 1 enemy unit Hero that is within 9" of this unit and that made an attack that targeted this unit in that phase, or caused any mortal wounds to this unit with an ability or spell in that phase (even if the wounds or mortal wounds were negated). If you do so, roll 2D6, If the roll is greater than the Wounds characteristic of that Hero, that Hero is removed from play.
        
        Designer's Note: The Hero cannot be returned if you are allowed to bring back slain models (the model has not been slain).`,
        when: [DURING_GAME],
      },
      GenericEffects.WizardTwoSpellsEffect,
    ],
  },
  'Chaos Lord on Daemonic Mount': {
    effects: [
      ChaosMarkAll,
      ChaosRuneshieldEffect,
      strikeFirstOnChargeEffect,
      knightsOfChaosEffect,
      chaosLanceEffect,
    ],
  },
  'Chaos Lord on Manticore': {
    effects: [
      ChaosMarkAll,
      DaemonforgedWeaponEffect,
      TerritorialPredatorEffect,
      chaosLanceEffect,
      {
        name: `Shield`,
        desc: `If this unit has a Chaos Runeshield it has a save of 3+ instead of 4+`,
        when: [SAVES_PHASE],
      },
      {
        name: `Shield`,
        desc: `If this unit has a Chaos Runeshield it has a 5+ ward.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Daggerfist`,
        desc: `If this model is equipped with a Daggerfist, when this model makes an unmodified save of 6 against a melee attack the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
        when: [DURING_GAME],
      },
      {
        name: `Iron-willed Overlord`,
        desc: `If this unit issues the Redeploy command to a Slaves to Darkness unit, you can reroll the dice that determines the distance.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Chaos Sorcerer Lord on Manticore': {
    mandatory: {
      spells: [keyPicker(Spells, ['Winds of Chaos'])],
    },
    effects: [
      ChaosMarkSorcerer,
      ...OracularVisionsEffects,
      TerritorialPredatorEffect,
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Chaos Lord on Karkadrak': {
    effects: [
      ChaosMarkAll,
      knightsOfChaosEffect,
      strikeFirstOnChargeEffect,
      ChaosRuneshieldEffect,
      DaemonforgedWeaponEffect,
      {
        name: `Brutish Rampage`,
        desc: `Roll a D6 for each enemy unit within 1" of the model after it finishes a charge move. On a 2+ the target suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Chaos Lord': {
    effects: [
      ChaosMarkAll,
      DaemonforgedWeaponEffect,
      {
        name: `RETINUE`,
        desc: `Before determining who has the first turn, you can pick 1 friendly CHAOS WARRIORS or CHAOS CHOSEN unit on the battlefield that is not another unit's retinue to be this unit's retinue.`,
        when: [TURN_ONE_START_OF_ROUND],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
      {
        name: `Warlord's Retinue`,
        desc: `Before you allocate a wound or mortal wound to this unit, or instead of making a ward roll for this unit, if this unit is within 3" of its retinue, you can roll a dice. On a 3+, that wound or mortal wound is allocated to this unit's retinue instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Glory in Battle`,
        desc: `After this unit has fought in the combat phase for the first time, if its retinue has not yet fought in that combat phase, is within 3" of an enemy unit and is wholly within 12" of this unit, this unit's retinue can fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Chaos Sorcerer Lord': {
    mandatory: {
      spells: [keyPicker(Spells, ['Daemonic Power'])],
    },
    effects: [ChaosMarkSorcerer, ...OracularVisionsEffects, GenericEffects.WizardOneSpellEffect],
  },
  'Exalted Hero of Chaos': {
    effects: [
      ChaosMarkAll,
      ChaosRuneshieldEffect,
      DarkBlessingsEffect,
      {
        name: `Shield`,
        desc: `If this unit has a Chaos Runeshield it has a save of 3+ instead of 4+`,
        when: [SAVES_PHASE],
      },
      {
        name: `Glory-seeker`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while it is within 3" of any enemy HEROES Or enemy MONSTERS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ogroid Myrmidon': {
    effects: [
      BerserkRageEffect,
      {
        name: `Arcane Fury`,
        desc: `If the unmodified hit roll for a melee attack by this model is a 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ogroid Theridons': {
    effects: [
      UnitLeaderEffect,
      StandardBearersEffect,
      BerserkRageEffect,
      MusiciansEffect,
      {
        name: `Arcane Fury`,
        desc: `If the unmodified hit roll for a melee attack by this model is a 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unleashed Savagery`,
        desc: `Once per battle, when this unit is picked to fight, add 1 to the Attacks characteristic of this unit's melee weapons until the end of that phase. However, this unit cannot receive the Inspiring Presence command in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unleashed Savagery`,
        desc: `If this unit unleashed savagery this turn it receive the Inspiring Presence command.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Shield`,
        desc: `If this unit has a shield, it has a save of 4+ instead of 5+`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Chaos Warshrine': {
    mandatory: {
      prayers: [keyPicker(Prayers, ['Favour of the Ruinous Powers'])],
    },
    effects: [
      ChaosMarkAll,
      {
        name: `Protection of the Dark Gods`,
        desc: `Friendly MORTAL SLAVES TO DARKNESS units that are wholly within range of this unit's Protection of the Dark Gods ability, have a ward of 6+`,
        when: [WARDS_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Chaos Chariots': {
    effects: [ChaosMarkAll, ExaltedCharioteerEffect, ...ChaosChariotEffects],
  },
  'Gorebeast Chariots': {
    effects: [
      ChaosMarkAll,
      ExaltedCharioteerEffect,
      {
        name: `Unstoppable Momentum`,
        desc: `At the end of your combat phase, if this unit made a charge move this turn, it can make a normal move and can do so even if it is within 3" of any enemy units. It can pass across other models with a Wounds characteristic of 4 or less in the same manner as a model that can fly. Pick 1 enemy unit it passed across and roll a dice for each model in this unit. For each 3+, that enemy unit suffers D6 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Theddra Skull-Scryer': {
    mandatory: {
      spells: [keyPicker(Spells, ['Enfeeblement'])],
    },
    effects: [
      {
        name: `Oath of Arcane Apotheosis`,
        desc: `If the unmodified casting roll made for this unit is 10+, this unit fulfils its oath. This unit can then attempt to cast 2 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      GenericEffects.WizardOneSpellEffect,
    ],
  },
  'Godsworn Hunt': {
    effects: [
      {
        name: `Oath of Conquest`,
        desc: `If you gain control of an objective previously controlled by your opponent while this unit is contesting it, this unit fulfils its oath. This unit has a 5+ ward for the rest of the battle.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Avowed Kinsmen`,
        desc: `Before you allocate a wound or mortal wound to a friendly THEDDRA SOUL- SCRYER, or instead of making a ward roll, if this unit is within 3" of that friendly THEDDRA SOUL-SCRYER, vou can roll a dice. On a 3+, that wound or mortal wound is allocated to this unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Darkoath Warqueen': {
    effects: [
      TribalWarleaderEffect,
      {
        name: `Infernal Runeshield`,
        desc: `This unit has a 5+ ward. For each unmodified ward of 6+ you can pick 1 enemy unit within 3" to suffer 1 mortal wound that cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Oath of Supremacy`,
        desc: `At the end of the movement phase, if this unit is wholly within enemy territory it fulfils its oath. If it has then this unit can issue the Inspiring Presence command, to 2 friendly DARKOATH or CULTIST units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Oath of Supremacy`,
        desc: `If this unit has fulfiled its oath, it can issue the Inspiring Presence command, to 2 friendly DARKOATH or CULTIST units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Darkoath Chieftain': {
    effects: [
      TribalWarleaderEffect,
      {
        name: `Deathblow`,
        desc: `Unmodified hit rolls of 6 inflict 1 mortal wound in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Oath of Murder`,
        desc: `The first time an enemy HERO or MONSTER is slain from wounds allocated from an attack made by this unit, this unit fulfils its oath. Once tis unit fulfils its oath, until the end of the battle, the strike-first effect applies to this unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Oath of Murder`,
        desc: `The strike-first effect applies to this unit if it has fulfiled it's oath.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Chaos Chosen': {
    effects: [
      ChaosMarkAll,
      UnitLeaderEffect,
      IconBearersEffect,
      MusiciansEffect,
      DaemonforgedWeaponEffect,
      DarkBlessingsEffect,
      {
        name: `Heralds of Ruination`,
        desc: `Once per battle, in the combat phase, after this unit has fought for the first time in that phase, you can say that they will unleash ruin. If you do so, this unit can fight for a second time in that phase. The strike-last effect applies to this unit when they fight for that second time.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heralds of Ruination`,
        desc: `If active, once per game this unit can fight for a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Chaos Spawn': {
    effects: [
      ChaosMarkAll,
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks add 1 to hit and wound rolls for attacks made by that model until the end of the phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Drawn to Power`,
        desc: `While this unit is within 9" of a friendly DAEMON PRINCE and they share 1 of the following keywords: KHORNE, TZEENTCH, NURGLE, SLAANESH or UNDIVIDED you can reroll 1 of the dice when determining this unit's Move characteristic, and each time a model in this unit fights you can reroll 1 of the dice when determining the number of attacks made by its Freakish Mutations.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Chaos Warriors': {
    effects: [
      ChaosMarkAll,
      UnitLeaderEffect,
      StandardBearersEffect,
      MusiciansEffect,
      ChaosRuneshieldEffect,
      {
        name: `Bringers of Desolation`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while it is wholly within enemy territory or wholly within 12' of an objective that you do not control.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  'Chaos Knights': {
    effects: [
      ChaosMarkAll,
      UnitLeaderEffect,
      StandardBearersEffect,
      ChaosRuneshieldEffect,
      {
        name: `Musician`,
        desc: `If the unit includes any musicians, you can change one of the charge roll dice to a 4.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Riders of Doom`,
        desc: `Models armed with a Cursed Lance can target enemy units that are within 1/2' of another model from this unit that is itself within 1/2" of the attacking model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Impaling Charge`,
        desc: `Add 1 to the damage characteristic and improve the rend characteristic by 1 of this unit's Cursed Lances if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Chaos Marauder Horsemen': {
    effects: [
      ChaosMarkAll,
      UnitLeaderEffect,
      StandardBearersEffect,
      MusiciansEffect,
      DarkwoodShieldEffect,
      {
        name: `Feigned Flight`,
        desc: `This unit can shoot and/or charge even if it retreated in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE],
      },
      {
        name: `Swift Raiders`,
        desc: `Subtract 1 from wound rolls for attacks made with missile weapons that target this unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Chaos Marauders': {
    effects: [
      ChaosMarkAll,
      UnitLeaderEffect,
      StandardBearersEffect,
      MusiciansEffect,
      DarkwoodShieldEffect,
      {
        name: `Boundless Ferocity`,
        desc: `Add 1 to hit rolls for attacks made by this unit if it made a charge in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Mutalith Vortex Beast': {
    effects: [
      ChaosMarkTzeentch,
      {
        name: `Mutant Regeneration`,
        desc: `You can heal D3 wounds in each of your hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aura of Mutation`,
        desc: `In your hero phase, you can pick a unit within 18". Roll a D6 and consult the chart below, if this unit is within 9" of a friendly TZEENTCH WIZARD you can roll 2 dice and choose one:

        1: Hideous Disfigurements: Subtract 1 from the bravery characteristic of the unit for the rest of the battle.

        2: Troggbrains: Subtract 1 from the run rolls made for the unit for the rest of the battle.

        3: Gift of Mutations: Subtract 1" from the move characteristic of the unit for the rest of the battle.

        4: Tide of Transmogrification: The unit sufers D3 mortal wounds.

        5: Maelstrom of Change: The unit suffers D6 mortal wounds.

        6: Spawnchange: The unit suffers D6 mortal wounds. If any models were slain as a result, you can set up 1 Slaves to Darkness Tzeentch Chaos Spawn within 3" of the target unit. If you do not add a Chaos spawn to your army, you can heal D3 wounds allocated to this model instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Grinder': {
    effects: [
      ChaosMarkAll,
      {
        name: `Hellforged Claw`,
        desc: `If the unmodified hit roll for an attack made with a Hellforged Claw is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Implacable Advance`,
        desc: `This model can run and still shoot later in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Slaughterbrute: {
    effects: [
      ChaosMarkKhorne,
      {
        name: `Sigils of Enslavement`,
        desc: `When you select this unit to be a part of your army, you can pick 1 friendly Slaves to Darkness Hero or 1 Khorne Mortal Hero in your army to be its master. 
        This unit can receive the Leave None Alive, Let Loose the Chains, or Unbridled Ferocity command abilities from it's master.`,
        when: [DURING_SETUP],
      },
      {
        name: `Sigils of Enslavement - Leave None Alive`,
        desc: `A slaughterbrute master can issue this command, in this phase this unit uses the 0 wounds suffered row of its damage table.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Sigils of Enslavement - Let Loose the Chains`,
        desc: `A slaughterbrute master can issue this command, until the end of this phase this unit can roll 3D6 and charge from 18".`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Sigils of Enslavement - Unbridled Ferocity`,
        desc: `If this unit is within 3" of any enemy units and more than 12" from its master. Pick 1 enemy unit within 3", on a 2+ that enemy unit suffers D3 mortal wounds and this unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Centaurion Marshal': {
    effects: [
      {
        name: `Skewer, Drag and Bludgeon`,
        desc: `Each time this unit fights, make the attacks with its Mauling Spear first. Until the end of the phase, add 1 to the Attacks characteristic of its Skull Bludgeon and Varanspire Gladius for each successful hit scored by attacks made with its Mauling Spear.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gladiator's Net`,
        desc: `At the start of each combat phase, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 6+, the strike-last effect applies to that enemy unit until the end of the phase. This ability has no effect on enemy units that are Monsters or have more than 5 models.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Marshal of the Legions`,
        desc: `If this unit issues the Rally command and an Undivided Mortal unit receives it, you can return 1 slain model to the unit that receives the command for each 5+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Chaos Legionnaires': {
    effects: [
      {
        name: `Decuriarch`,
        desc: `1 in every 8 models in this unit must be a Decuriarch. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Decuriarchs can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Mutandor`,
        desc: `1 in every 8 models in this unit must be a Mutandor. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hornhelms`,
        desc: `3 in every 8 models in this unit must be a Hornhelm. Add 1 to the Damage characteristic of those models' melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sow Confusion`,
        desc: `Once per turn, at the start of any phase, you can say this unit will sow confusion. If you do so, pick an enemy unit within 6" of this unit and roll a dice. On a 4+, that unit cannot issue or receive commands in that phase. You cannot pick the same unit as the target for this ability more than once in the same phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Devoted of the Dark Creed`,
        desc: `Add 1 to wound rolls for attacks made by this unit while it is wholly within 12" of a friendly Be'lakor.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Horns of Hashut': {
    effects: [
      {
        name: `Ruinator Alpha`,
        desc: `1 in every 10 models in this unit must be a Ruinator Alpha. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Ruinator Alphas can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Ruinator`,
        desc: `1 in every 10 models in this unit must be a Ruinator. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Demolisher with Flamehurler`,
        desc: `1 in every 10 models in this unit must be a Demolisher with Flamehurler. A Demolisher with Flamehurler is armed with a Flamehurler and Forge Weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Torrent of Flames`,
        desc: `The Attacks characteristic of a Flamehurler is equal to the number of models in the target unit (to a maximum Attacks characteristic of 8).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Stampede of Iron`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Tarantulos Brood': {
    effects: [
      {
        name: `Broodmaster`,
        desc: `1 in every 13 models in this unit must be a Broodmaster. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Broodmasters can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Spider Swarms`,
        desc: `3 in every 13 models in this unit must be Spider Swarms. Spider Swarms are armed with Venomous Bites instead of Brood Weapons and Envenomed Projectiles.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skittering Ascent`,
        desc: `When this unit makes a move, it can pass across terrain features in the same manner as a model that can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Creeping Summons`,
        desc: `You can return D3 slain Spider Swarms to this unit for each Broodmaster in this unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Splintered Fang': {
    effects: [
      {
        name: `Trueblood`,
        desc: `1 in every 10 models in this unit must be a Trueblood. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Truebloods can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Serpent Caller`,
        desc: `1 in every 10 models in this unit must be a Serpent Caller. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Serpents`,
        desc: `1 in every 10 models in this unit must be a Serpents model. Serpents models have a Wounds characteristic of 2.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `One Cut, One Kill`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6, the attack inflicts 1 mortal wound and the attack seqeunce ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Snake Charmer`,
        desc: `You can return 1 slain Serpents model to this unit in your hero phase for each Serpent Caller in the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Corvus Cabal': {
    effects: [
      {
        name: `Shadow Piercer`,
        desc: `1 in every 9 models in this unit must be a Shadow Piercer. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Shadow Piercers can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Shrike Talon`,
        desc: `1 in every 9 models in this unit must be a Shrike Talon. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Death From Above`,
        desc: `This unit is not visible to enemy units while it is in cover. In addition, if this unit attempts a charge while it is wholly on a terrain feature, it can fly when making a charge move in that phase.`,
        when: [DURING_GAME, CHARGE_PHASE],
      },
      {
        name: `Denizens of Ulgu`,
        desc: `Instead of setting up this unit on the battlefield, you can place this unit to one side as a reserve unit. At the end of your movement phase, you can set up this unit anywhere on the battlefield more than 9' from all enemy units. Any reserve units not set up on the battlefield before the start of the fourth battle round are destroyed.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'The Unmade': {
    effects: [
      {
        name: `Blissful One`,
        desc: `1 in every 9 models in this unit must be a Blissful One. A Blissful One is armed with Nightmare Sickles instead of Maiming Weapons. In addition, Blissful Ones can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Joyous One`,
        desc: `1 in every 9 models in this unit must be a Joyous One. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frozen in Fear`,
        desc: `Enemy units cannot receive the Rally command while they are within 12" of this unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Frozen in Fear`,
        desc: `Enemy units cannot receive the Redeploy command while they are within 12" of this unit.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Cypher Lords': {
    effects: [
      {
        name: `Thrallmaster.`,
        desc: `1 in every 8 models in this unit must be a Thrallmaster. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Thrallmasters can issue commands to their own unit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
      {
        name: `Luminate`,
        desc: `1 in every 8 models in this unit must be a Luminate. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shattered Gloom Globe`,
        desc: `While this unit includes any Thrallmasters, you can pick 1 enemy unit within 3" of this unit and roll a D6. On a 4+, subtract 1 from hit rolls for that unit until your next hero phase. The same unit cannot be affected by this ability more than once per turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Acrobatic Leaps`,
        desc: `When this unit makes a move, it can pass across other models in the same manner as a unit that can fly. In addition, after this unit moves, excluding pile-in moves, you can pick 1 enemy unit it passed across and roll a dice for each model in this unit. For each 6+, that enemy unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Scions of the Flame': {
    effects: [
      {
        name: `Blazing Lord`,
        desc: `1 in every 8 models in this unit must be a Blazing Lord. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Blazing Lords can issue commands to their own unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
      {
        name: `IMMOLATOR`,
        desc: `1 in every 8 models in this unit must be an Immolator. At the end of the combat phase, pick 1 enemy unit within 1" of this unit a roll a dice for each Immolator in this unit. For each 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Inferno Priest`,
        desc: `1 in every 8 models in this unit must be an Inferno Priest. An Inferno Priest is armed with Scion Weapons and Engulfing Flames instead of Scion Weapons and Flameburst Pots.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `All Shall Burn`,
        desc: `If an attack made with Flameburst Pots targets an enemy unit that has 10 or more models and scores a hit, that attack scores 3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Spire Tyrants': {
    effects: [
      {
        name: `Pit Champion`,
        desc: `1 in every 9 models in this unit must be a Pit Champion. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Pit Champions can issue commands to their own unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
      {
        name: `Bestigor Destroyer`,
        desc: `1 in every 9 models in this unit must be a Bestigor Destroyer. Add 1 to the Damage characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Headclaimer`,
        desc: `1 in every 9 models in this unit must be a Headclaimer. Add 1 to the Damage characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fight for Glory`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while they are wholly within 9' of any friendly MORTAL HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Veterans of the Warpits`,
        desc: `Do not take battleshock tests for this unit while it is within 3" of any enemy units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Iron Golems': {
    effects: [
      {
        name: `Dominar`,
        desc: `1 in every 8 models in this unit must be a Dominar. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Dominars can issue commands to their own unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 8 models in this unit must be a Signifer. Add 1 to the Bravery characteristic of a unit that includes a Signifer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ogor Breacher`,
        desc: `1 in every 8 models in this unit must be an Ogor Breacher. Add 1 to the Damage characteristic of that model's melee weapons. In addition, Ogor Breachers have a Wounds characteristic of 3.`,
        when: [COMBAT_PHASE, WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Iron Resilience`,
        desc: `Add 1 to save rolls for attacks that target this unit if this unit has not made a normal move, run, retrested, or made a charge move in the same turn.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS, rule_sources.ERRATA_JANUARY_2023],
      },
    ],
  },
  'Untamed Beasts': {
    effects: [
      {
        name: `Heart-eater`,
        desc: `1 in every 9 models in this unit must be a Heart-eater. Add 1 to the Attacks characteristic of that model's melee weapons. In addition, Heart-eaters can issue commands to their own unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
      {
        name: `First Fang`,
        desc: `1 in every 9 models in this unit must be a First Fang. A First Fang is armed with a Jagged Harpoon and Hunting Weapons.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rocktusk Prowler`,
        desc: `1 in every 9 models in this unit must be a Rocktusk Prowler. Rocktusk Prowlers have a Wounds characteristic of 2.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Rocktusk Prowler`,
        desc: `1 in every 9 models in this unit must be a Rocktusk Prowler. Add 1 to the Damage characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unleash the Beast`,
        desc: `This unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Unleash the Beast`,
        desc: `After armies are set up but before the first battle round begins, this unit can move up to 6" (it cannot run).`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Darkoath Savagers': {
    effects: [
      {
        name: `Slaughterborn`,
        desc: `1 in every 10 models in this unit must be a Slaughterborn. Add 1 to the Attacks and Damage characteristics of that model's melee weapons. In addition, a Slaughterborn can issue commands to their own unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
      {
        name: `Proven`,
        desc: `2 in every 10 models in this unit must be a Proven. Add 1 to the Damage characteristic of those models' melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `God-speaker`,
        desc: `1 in every 10 models in this unit must be a God-speaker. Roll 1 dice for each God-speaker in this unit. For each 6, you receive 1 command point that can only be spent during that turn to allow a Slaughterborn from this unit to issue a command.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deathblow`,
        desc: `Unmodified hit rolls of 6 deal 1 mortal wound in addtiona to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Oath of Conquest`,
        desc: `If you gain control of an objective previously controlled by your opponent while this unit is contesting it, this unit fulfils its oath. Once this unit fulfils its oath, until the end of the battle, this unit has a 5+ ward.`,
        when: [END_OF_TURN],
      },
      {
        name: `Oath of Conquest`,
        desc: `If this unit fulfils its oath, it has a 5+ ward.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Furies: {
    effects: [
      {
        name: `Sneaky Little Devils`,
        desc: `When selected for activation instead of fighting you may retreat.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAVES_TO_DARKNESS],
      },
    ],
  },
  Raptoryx: {
    effects: [
      {
        name: `Crazed Flock`,
        desc: `Add 1 to the attacks characteristic of this unit's melee weapons if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dark Symbiosis`,
        desc: `Do not make battleshock tests for this unit while it is within 3" of a friendly MONSTER.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Mindstealer Sphiranx': {
    effects: [
      {
        name: `Dominate Mind`,
        desc: `Pick 1 enemy unit within 9" of this unit that is visible to it and roll 2D6. If the roll equals or exceeds the Bravery characteristic of that enemy unit, the strike-last effect applies to it until the end of that phase. You cannot pick the same unit as the target for this ability more than once in the same phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Fomoroid Crusher': {
    effects: [
      {
        name: `Hewn Rocks and Rubble`,
        desc: `Add 1 to the Damage characteristic of this unit's weapons while it is within 1" of any terrain features.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Cursed Destroyers`,
        desc: `In your hero phase, pick 1 terrain feature within 6" of this model and roll a D6 for each other unit within 6" of that terrain feature. On a 3+, that unit suffers D3 mortal wounds.
        In addition, if the terrain featured picked is a faction terrain feature or defensible terrain feature and the roll was a 3 or more, the terrain feature is demolished if it was defensible (see 17.2.3), and the scenery rules on its warscroll cannot be used for the rest of the battle if it was a faction terrain feature.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Zarshia Bittersoul': {
    mandatory: {
      spells: [keyPicker(Spells, ['Mask of Darkness'])],
    },
    effects: [...OracularVisionsEffects, GenericEffects.WizardOneSpellEffect],
  },
  "Khagra's Ravagers": {
    effects: [
      ChaosRuneshieldEffect,
      {
        name: `Fierce Conquerors`,
        desc: `Models in this unit count as 2 models for the purposes of contesting objectives.`,
        when: [END_OF_TURN],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
