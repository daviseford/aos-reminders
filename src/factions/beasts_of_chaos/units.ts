import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ANY_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const PropagatorOfDevolutionEffect = {
  name: `Propagator of Devolution`,
  desc: `This unit can run and still charge later in the turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const InfuseWithBestialVigorEffect = {
  name: `Infuse with Bestial Vigour`,
  desc: `Add 6" to the range of heroic actions from the Rituals of Ruin battle trait that you carry out with this unit. This ability can be used while this unit is set up in ambush as a reserve unit.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}
const BrayhornEffect = {
  name: `Brayhorn`,
  desc: `A unit that includes any Brayhorns can add 1 to run and charge rolls.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
  shared: true,
}
const BrayStandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `1 in every 10 models in this unit can be a Banner Bearer. If this unit receives the Rally command while it includes any Banner Bearers, when you roll a dice for a slain model from this unit, you can return 1 slain model to this unit on a 5+ instead of only a 6.`,
  when: [START_OF_HERO_PHASE],
  shared: true,
}
const ChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be a Champion. Add 1 to the attacks characteristic of melee weapons for the champion.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const DespoilersEffect = {
  name: `Despoilers`,
  desc: `Add 1 to wound rolls for attacks made with melee weapons by this unit while it is within 3" of any enemy units that received the All-out Defence command in the same phase.`,
  when: [COMBAT_PHASE],
  rule_sources: [
    rule_sources.BATTLETOME_BEASTS_OF_CHAOS,
    meta_rule_sources.BATTLESCROLL_DEPLETED_RESERVES_APRIL_2023,
  ],
  shared: true,
}
const BloodgreedEffect = {
  name: `Bloodgreed`,
  desc: `Each unmodified hit roll for an attack made with a melee weapon by this unit is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a wound roll or save roll).`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BeneathTheTempestEffect = {
  name: `Beneath the Tempest`,
  desc: `At the end of the combat phase, roll a dice for this unit. On a 2+, you can heal up to D3 wounds allocated to this unit. In addition, at the end of the combat phase, roll a dice for each enemy unit within 3" of any friendly units with this ability. On a 2+, that unit suffers D3 mortal wounds.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}
const TzaangorChampionEffect = {
  name: `Champion`,
  desc: `1 model in this unit can be an Aviarch. Add 1 to the Attacks characteristic of that model's Tzeentchian Spear.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const BabblingStreamOfSecretsEffect = {
  name: `Babbling Stream of Secrets`,
  desc: `In the combat phase, enemy units within 3" of any friendly units with this ability cannot receive commands.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const GuidedByThePastEffect = {
  name: `Guided by the Past`,
  desc: `You can add 1 to wound rolls for attacks made with melee weapons by friendly units with this ability if you are taking the second turn in the current battleround. This ability does not affect attacks made by a mount.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const Units = {
  Beastlord: {
    effects: [
      {
        name: `Dual Axes`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this unit is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Call of Battle`,
        desc: `In the combat phase, when you pick this unit to fight for the first time in that phase, you can pick 1 other friendly BRAYHERD unit that is not a HERO, that is wholly within 12" of this unit and that has not yet fought in that phase. This unit and that other BRAYHERD unit can fight one after the other in the order of your choice.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hatred of Heroes`,
        desc: `If this unit is within 3" of any enemy HEROES, add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly BEASTS OF CHAOS units while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Great Bray-Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Devolve'])],
    },
    effects: [GenericEffects.WizardOneSpellEffect, InfuseWithBestialVigorEffect],
  },
  Gors: {
    effects: [
      BrayhornEffect,
      BrayStandardBearerEffect,
      ChampionEffect,
      {
        name: `Gor Stampede`,
        desc: `At the end of your charge phase, if this unit made a charge move in the same turn, you can pick 1 enemy unit within 1" of this unit that has fewer models than this unit and roll a dice. On a 3+, the strike-last effect applies to that enemy unit in the following combat phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Shield`,
        desc: `If this unit is armed with Hacking Blades and Beastshields, it has a Save characteristic of 4+ instead of 5+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Ungors: {
    effects: [
      BrayhornEffect,
      BrayStandardBearerEffect,
      ChampionEffect,
      {
        name: `Fleet of Hoof`,
        desc: `In the combat phase, when you pick this unit to fight, you can say that it will evade the enemy. If you do so, this unit retreats instead of fighting.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bestigors: {
    effects: [
      BrayhornEffect,
      BrayStandardBearerEffect,
      ChampionEffect,
      DespoilersEffect,
      {
        name: `Bestial Charge`,
        desc: `Subtract 1 from wound rolls for attacks that target this unit if the attack was made with a missile weapon by an enemy unit that received the Unleash Hell command in the same phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Ungor Raiders': {
    effects: [
      BrayStandardBearerEffect,
      {
        name: `Vile Invaders`,
        desc: `After armies are set up, but before the first battle round begins, this unit can move up to 6".`,
        when: [END_OF_SETUP],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Brayhorn Blower. This unit can run and still shoot later in the turn if it includes any Brayhorn Blowers.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Hidden Volley`,
        desc: `Once per battle, at the start of your movement phase, if this unit is in reserve, you can pick a point on the battlefield edge and say that this unit will unleash a hidden volley. If you do so, this unit can shoot in that phase, but it must target the closest enemy unit to that point. If more than 1 enemy unit is tied to be the closest, you can pick which unit is the target.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Tuskgor Chariots': {
    effects: [
      {
        name: `Tuskgor Charge`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a number of dice equal to the unmodified charge roll for that charge move. Add 1 to each roll if that enemy unit has a Wounds characteristic of 1 or 2. For each 5+, that unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `CHAMPION`,
        desc: `If this unit has 2 or more models, 1 model in this unit can be a Charioteer Alpha. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Centigors: {
    effects: [
      BrayhornEffect,
      ChampionEffect,
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Banner Bearer. This unit can retreat and still charge later in the turn if it includes any Banner Bearers.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Unruly Hooligans`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while it is wholly within 9" of any objectives that you do not control.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Drunken Revelry`,
        desc: `The first 2 wounds or mortal wounds caused to this unit in the combat phase are negated. In addition, if a model in this unit would flee as a result of a failed battleshock test, you can roll a dice. On a 2+, that model does not flee.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Drunken Revelry`,
        desc: `If a model in this unit would flee as a result of a failed battleshock test, you can roll a dice. On a 2+, that model does not flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Razorgors: {
    effects: [
      {
        name: `Baited Charge`,
        desc: `If this unit is within 3" of any friendly UNGORS units at the end of your charge phase, and this unit made a charge move in the same turn, double the Attacks characteristic of this unit's melee weapons until the end of that turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Feed on Mangled Remains`,
        desc: `At the end of each phase, you can heal 1 wound allocated to this unit if it is within 6" of any enemy units that have had any models slain in that phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Slaangor Fiendbloods': {
    effects: [
      ChampionEffect,
      {
        name: `Slaughter at Any Cost`,
        desc: `At the end of any phase, if any wounds or mortal wounds were allocated to this unit in that phase, and this unit is more than 9" from all enemy units, this unit can move up to D6".`,
        when: [END_OF_ANY_PHASE],
      },
      {
        name: `Obsessive Violence`,
        desc: `Once per battle, in the combat phase, after this unit has fought for the first time in that phase, you can say that it will continue its obsessive onslaught. If you do so, this unit can fight for a second time in that phase. The strike- last effect applies to this unit when it fights for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Doombull: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Slaughterer's Call"])],
    },
    effects: [
      BloodgreedEffect,
      {
        name: `Alpha Charge`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that unit suffers D3 mortal wounds at the end of that phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Bullgors: {
    effects: [
      ChampionEffect,
      BloodgreedEffect,
      {
        name: `Warherd Charge`,
        desc: `After this unit makes a charge move, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 2+, that unit suffers 1 mortal wound at the end of that phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Warherd Drummer`,
        desc: `Add 1 to charge rolls for a unit that includes any Warherd Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Warherd Banner Bearer`,
        desc: `1 in every 3 models in this unit can be a Warherd Banner Bearer. if it includes any Warherd Banner Bearers, you can reroll the dice that determines whether an enemy unit suffers 1 mortal wound from the Warherd Charge.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Dual Axes`,
        desc: `You can reroll hit rolls of 1 for attacks made with a pair of Bullgor Axes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bullshields`,
        desc: `If this unit is armed with Cleaving Axes and Bullshields, it has a Save characteristic of 4+ instead of 5+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Ghorgon: {
    effects: [
      {
        name: `Feast on Flesh`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Improve the Rend characteristic of this unit's melee weapons by 1 until the end of the following combat phase. In addition, until the end of the following combat phase, if any enemy models are slain by attacks made by this unit, you can heal up to 3 wounds allocated to this unit after all of its attacks have been resolved.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Feast on Flesh`,
        desc: `If active, Improve the Rend characteristic of this unit's melee weapons by 1 until the end of the following combat phase. In addition, until the end of the following combat phase, if any enemy models are slain by attacks made by this unit, you can heal up to 3 wounds allocated to this unit after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swallow Whole`,
        desc: `After this unit makes a pile-in move, you can pick a number of enemy models within 3" of this unit equal to or less than the Swallow Whole value shown on this unit's damage table, and roll a dice for each. If the roll is greater than that model's Wounds characteristic, it is slain. If an enemy model is slain by this ability, you can heal a number of wounds allocated to this unit equal to the Wounds characteristic of that slain model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Cygor: {
    effects: [
      {
        name: `Soul-eater`,
        desc: `This unit can attempt to unbind 2 spells in the enemy hero phase in the same manner as a WIZARD. 
        In addition, each time an enemy WIZARD within 30" of any friendly units with this ability successfully casts a spell and that spell is not unbound, the caster suffers 1 mortal wound after the effect of that spell has been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Consume Endless Spell`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 endless spell within 6" of this unit and roll 2D6. If the roll is greater than the casting value of the endless spell, that endiess spell is dispelled and you can heal a number of wounds allocated to this unit equal to the 2D6 roll.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Dragon Ogor Shaggoth': {
    mandatory: {
      spells: [keyPicker(Spells, ['Summon Lightning'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      BeneathTheTempestEffect,
      {
        name: `Scion of the Primordial Storm`,
        desc: `Each time this unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on this unit.`,
        when: [HERO_PHASE, END_OF_HERO_PHASE],
      },
    ],
  },
  'Dragon Ogors': {
    effects: [
      GenericEffects.Elite,
      BeneathTheTempestEffect,
      {
        name: `Storm Rage`,
        desc: `If this unit made a charge move in the same turn, if the unmodified hit roll for an attack made by this unit is 6, that attack wounds the target automatically (do not make a wound roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Chaos Warhounds': {
    effects: [
      {
        name: `Outrunners of Chaos`,
        desc: `When you make a charge roll for this unit, you can change 1 of the dice in that roll to a 4.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Chaos Spawn': {
    effects: [
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks, add 1 to hit rolls and wound rolls for attacks made by this unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
      PropagatorOfDevolutionEffect,
    ],
  },
  Jabberslythe: {
    effects: [
      {
        name: `Aura of Madness`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Pick 1 enemy HERO within 3" of this unit and roll a dice. On a 2-5, worsen the Save characteristic of that HERO by 1 (to a minimum of 6+) until the end of the following combat phase. On a 6, worsen the Save characteristic of that HERO by 2 (to a minimum of 6t) until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Aura of Madness`,
        desc: `If active, subtract 1 or 2 for saves for the picked enemy hero.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Spurting Bile Blood`,
        desc: `Roll a dice each time a melee wound is allocated to this unit. On a 4+ the attacker suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Cockatrice: {
    effects: [
      {
        name: `Petrifying Gaze`,
        desc: `At the start of the combat phase, you can pick 1 enemy unit within 6" of this unit and roll a dice. On a 4+, that unit suffers D3 mortal wounds.
        In addition, if any mortal wounds caused by this ability are allocated to a unit, until the end of that phase, only unmodified hit rolls of 6 for attacks made with melee weapons by that unit score a hit. The same unit cannot be affected by this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Petrifying Gaze`,
        desc: `If active, only unmodified hit rolls of 6 for attacks made with melee weapons by that unit score a hit for the enemy unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Maddened Ferocity`,
        desc: `Double the Attacks characteristic of this unit's melee weapons if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Chimera: {
    effects: [
      {
        name: `Thricefold Savagery`,
        desc: `You can carry out this monstrous rampage instead of any others with this unit. Until the end of the following combat phase, add 1 to the Attacks characteristic of this unit's melee weapons, but all of the attacks made with this unit's melee weapons must target the same enemy unit.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Thricefold Savagery`,
        desc: `If active, Add 1 to the Attacks characteristic of this unit's melee weapons, but all of the attacks made with this unit's melee weapons must target the same enemy unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fiery Breath`,
        desc: `Do not use the attack sequence for an attack made with Fiery Breath. Instead the target suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Tzaangor Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Boon of Mutation'])],
    },
    effects: [
      GenericEffects.WizardOneSpellEffect,
      {
        name: `Sorcerous Elixir`,
        desc: `Once per battle, in your hero phase, this unit can attempt to cast 1 extra spell. If it does so, you can add 3 to the casting roll for that spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzaangor Skyfires': {
    effects: [
      ChampionEffect,
      {
        name: `Guided by the Future`,
        desc: `Ignore negative modifiers to hit or wound rolls for attacks made with missile weapons by this unit, and ignore positive modifiers to save rolls for attacks made with missile weapons by this unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Judgement from Afar`,
        desc: `If the unmodified hit roll for an attack made with an Arrow of Fate is 6, the target suffers D3 mortal wounds and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Tzaangor Enlightened': {
    effects: [TzaangorChampionEffect, BabblingStreamOfSecretsEffect, GuidedByThePastEffect],
  },
  'Tzaangor Enlightened on Discs of Tzeentch': {
    effects: [TzaangorChampionEffect, BabblingStreamOfSecretsEffect, GuidedByThePastEffect],
  },
  Tzaangors: {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Twistbray. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be an Icon Bearer. While this unit includes any Icon Bearers, it can use the Ornate Totems ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 10 models in this unit can be a Brayhorn Blower. While this unit includes any Brayhorn Blowers, it can run and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Tzaangor Mutant`,
        desc: `1 in every 5 models in this unit can be a Tzaangor Mutant armed with a pair of Savage Blades and Vicious Beak. Add 1 to the Attacks characteristic of that model's pair of Savage Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savagery Unleashed`,
        desc: `Add 1 to the Attacks characteristic of this unit's Vicious Beaks if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ornate Totem`,
        desc: `While this unit includes any Icon Bearers, at the start of your hero phase, you can pick 1 enemy unit within 18" of this unit and roll a dice for each Wizard that is within 9" of this unit. For each 4+, the unit you picked suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Morghurite Chaos Spawn': {
    effects: [
      {
        name: `Aura of Insanity`,
        desc: `Subtract 1 from the Attacks characteristic of weapons used by enemy units while they are within 1" of this unit (to a minimum of 1).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      PropagatorOfDevolutionEffect,
    ],
  },
  'Chaos Gargant': {
    effects: [
      ...GenericEffects.Gargant,
      {
        name: `Stuff 'Em In Me Bag`,
        desc: `After this unit makes a pile-in move, pick 1 enemy model within 3" of it and roll a dice. If the roll is at least double that model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aura of Foulness`,
        desc: `Subtract 1 from save rolls for enemy units within 3" of any friendly units with this ability.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Whipped into a Frenzy`,
        desc: `If this unit is within 6" of any friendly BEASTS OF CHAOS HEROES, add 1 to the Attacks characteristic of this unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Grashrak Fellhoof': {
    mandatory: {
      spells: [keyPicker(Spells, ['Savage Bolt'])],
    },
    effects: [InfuseWithBestialVigorEffect, GenericEffects.WizardOneSpellEffect],
  },
  "Grashrak's Despoilers": {
    effects: [
      {
        name: `Violent Despoilers`,
        desc: `Add 1 to hit rolls for attacks made by the Despoilers' unit while it is wholly outside your territory.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Grashrak's Savage Herd`,
        desc: `Before you allocate a wound or mortal wound to a friendly GRASHRAK FELLHOOF within 3" of this unit, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly GRASHRAK FELLHOOF within 3" of this unit, roll a dice. On a 4+, that wound or mortal wound must be allocated to this unit instead of GRASHRAK FELLHOOF.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')
