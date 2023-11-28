import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'

const BattleTraits = {
  // Slaves to Darkness Allegiance
  'Eye of the Gods': {
    effects: [
      {
        name: `Eye of the Gods`,
        desc: `At the end of each phase, for each enemy HERO or MONSTER destroyed by a friendly SLAVES TO DARKNESS unit with the EYE OF THE GODS keyword, including those destroyed by an ability or spell, make 1 roll on the Eye of the Gods table for that unit and apply the effect of the result.
        In addition, if you gain control of an objective previously controlled by your opponent, make 1 roll on the Eye of the Gods table for each friendly SLAVES TO DARKNESS unit with the EYE OF THE GODS keyword that is contesting it.
        When rolling on the Eye of the Gods table, roll 2D6 for HEROES. For all other units, roll 1 dice and add 2 to the roll (giving a score between 3-8).
               2: Spawndom
               3: Snubbed bt the Gods
               4: Mutative Regrowth
               5: Flames of Chaos
               6: Unearthly Reflexes
               7: Unholy Resilience
               8: Slaughterer's Strength
               9: Arcane Awakening
               10: Aura of Chaos
               11-12: Dark Apotheosis`,
        when: [DURING_GAME, END_OF_HERO_PHASE, END_OF_COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Spawndom`,
        desc: `This HERO is slain. Before they are removed from the battlefield you can add 1 SLAVES TO DARKNESS CHAOS SPAWN to your army. If you do so, set it up within 1" of this HERO, then remove this HERO from play.`,
        when: [DURING_GAME],
      },
      {
        name: `Eye of the Gods: Snubbed by the Gods`,
        desc: `This reward has no effect.`,
        when: [DURING_GAME],
      },
      {
        name: `Eye of the Gods: Mutative Regrowth`,
        desc: `You can heal up to D3 wounds allocated to this unit. If this unit has no wounds allocated to it, treat this result as Snubbed by the Gods' instead.`,
        when: [DURING_GAME],
      },
      {
        name: `Eye of the Gods: Flames of Chaos`,
        desc: `The next time this unit is affected by a spell cast by an enemy unit, roll a dice. On a 2+, ignore the effects of that spell on this unit. A unit cannot be affected by this result more than once at the same time. Note: See the Eye of the Gods - During Game.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eye of the Gods: Unearthly Reflexes`,
        desc: `Until the end of the battle, add 1 to charge rolls made for this unit. Note: See the Eye of the Gods - During Game.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Eye of the Gods: Unholy Resilience`,
        desc: `Until the end of the battle, this unit has a ward of 6+. Note: See the Eye of the Gods - During Game.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Eye of the Gods: Slaughterer's Strength`,
        desc: `Until the end of the battle, improve the Rend characteristic of this unit's melee weapons by 1. Note: See the Eye of the Gods -`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Arcane Awakening`,
        desc: `Until the end of the battle, this unit becomes a WIZARD. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. If this unit is already a WIZARD, they can attempt to cast 1 additional spell instead. If this unit has the KHORNE keyword, treat this result as Slaughterer's Strength' instead. Note: See the Eye of the Gods - During Game.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eye of the Gods: Aura of Chaos`,
        desc: `Until the end of the battle, this unit has a ward of 5+. Note: See the Eye of the Gods - During Game.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Dark Apotheosis`,
        desc: `If you roll this result you can choose either the Daemonhood effect below or any other result on this table instead.
        
        Daemonhood: 
        You can add a Slaves to Darkness Daemon Prince to your army. If you do so, set it up within 1" of this Hero then remove this Hero from play (they do not count as being slain).
        The Daemon Prince has the same Mark of Chaos keyword that the had. It has any enhancements that the Hero had. If the Hero was your general, the Daemon Prince is now your general. 
        Any other results on the Eye of the Gods table that applied to the Hero now apply to the Daemon Prince.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
    ],
  },

  // ENSORCELLED BANNERS
  'Ensorcelled Banners: Icons of Chaos': {
    effects: [
      {
        name: `The Blasphemous Icon`,
        desc: `While this model is on the battlefield, subtract 1 from chanting rolls for prayers chanted by PRIESTS that do not have the CHAOS keyword.`,
        when: [HERO_PHASE],
      },
    ],
  },

  //Heroic Actions
  'Vows of Darkness': {
    effects: [
      {
        name: `Heroic Action: Pledge to Dark Gods`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS HERO with the EYE OF THE GODS keyword. Until the end of that turn, each time you roll on the Eye of the Gods table for that HERO, you can roll 3 dice instead of 2, and pick any 2 of the dice rolled as your score.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Draw on Power`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS WIZARD. Until the end of that turn, when making casting rolls with that WIZARD, roll 3 dice instead of 2. However, if the unmodified roll on 2 or more of the dice is 1, the spell miscasts, and the caster suffers D6 mortal wounds instead of D3.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  // SUB FACTIONS
  Ravagers: {
    effects: [
      {
        name: `Heroic Action: Rally the Tribes`,
        desc: `You can carry out the following heroic action with a RAVAGERS HERO instead of any other heroic action you can carry out with that HERO. Pick 1 CHAOS MARAUDERS, CHAOS MARAUDER HORSEMEN, CULTIST or DARKOATH unit in your army that has been destroyed. If you do so, a new replacement unit with half the number of models in the unit that was destroyed (rounding up) is added to your army. Set up that unit wholly within 12' of the HERO carrying out this heroic action and more than 9" from all enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Cabalists: {
    effects: [
      {
        name: `Blasphemous Rituals`,
        desc: `CABALIST HEROES become WIZARDS. If the HERO is already a WIZARD, they can attempt to cast 1 additional spell in each of your hero phases and know 1 additional spell from the Lore of the Damned spell lore.`,
        when: [DURING_GAME, HERO_PHASE],
        rule_sources: [
          rule_sources.ERRATA_JANUARY_2023,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
      {
        name: `Blasphemous Rituals`,
        desc: `If you carry out the Draw on Power heroic action (pg 72) with a Cabalist Hero, you can immediately carry out the same heroic action with each other Cabalist Hero that has the Eye of Gods keyword and that is within 3" of the first.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [
          rule_sources.ERRATA_JANUARY_2023,
          meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023,
        ],
      },
    ],
  },
  Despoilers: {
    effects: [
      {
        name: `The Favoured and the Cursed`,
        desc: `Each DESPOILER DAEMON PRINCE can be given a command trait in addition to your general, which can be used as if they were a general. Each command trait must be different.`,
        when: [DURING_GAME],
      },
      {
        name: `The Favoured and the Cursed`,
        desc: `Add 2 to the Wounds characteristic of friendly DESPOILERS MONSTER units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Host of the Everchosen': {
    effects: [
      {
        name: `Legions of Darkness`,
        desc: `Chaos Chosen, Chaos Knights or Chaos Warriors unit that receives the Rally command, you can return 1 slain model to that unit for each 5+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
      {
        name: `Legions of Darkness`,
        desc: `You can pick 1 additional Ensorcelled Banners enhancement for your army.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
    ],
  },
  'The Knights of the Empty Throne': {
    effects: [
      {
        name: `Unmatched Conquerors`,
        desc: `KNIGHTS OF THE EMPTY THRONE units that have a Mount can run and still charge in the same turn.`,
        when: [CHARGE_PHASE, MOVEMENT_PHASE],
      },
      {
        name: `Dread Lieutenant`,
        desc: `When you pick the general for your army, if Archaon is not included in the army, you can pick a model in a friendly VARANGUARD unit to be your general. If you do so, that unit gains the Leader battlefield role.
        Designer's Note: This general cannot be given a command trait as it is not a HERO.`,
        when: [DURING_GAME],
      },
      {
        name: `Dread Lieutenant`,
        desc: `If a VARANGUARD general issues the Rally command and a friendly VARANGUARD unit receives it, you can return 1 slain model to that unit for each 5+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Legions of the First Prince': {
    effects: [
      {
        name: `The Favour of the Four`,
        desc: `You can pick 1 LEGION OF THE FIRST PRINCE UNDIVIDED unit and then pick 1 of the following Marks of Chaos keywords; KHORNE, TZEENTCH, NURGLE or SLAANESH. That unit has that Mark of Chaos until the start of your next hero phase in addition to the UNDIVIDED Mark of Chaos.
        
        Designer's Note: If you pick a WIZARD unit to have the TEENTCH Mark of Chaos, it knows the Warp Reality' spell until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Infernal Servants`,
        desc: `Allied Bloodletters, Horrors of Teentch, Plaguebearers and Daemonettes units benefit from the Marks of Chaos battle trait (pg 70) as if they had the SLAVES TO DARKNESS keyword.`,
        when: [DURING_GAME],
      },
    ],
  },

  // BATTLE TACTICS
  'Battle Tactics': {
    effects: [
      {
        name: `In Thrall to Chaos`,
        desc: `Pick 1 objective marker on the battlefield that is within 12" of any enemy units. You complete this battle tactic if there are no enemy units within 12" of that objective marker at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Lust for Power`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS HERO that has the EYE OF THE GODS keyword. You complete this battle tactic if you roll on the Eye of the Gods table for that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The March of Ruin`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS unit that includes an Ensorcelled Banner and is not within enemy territory. You complete this battle tactic if at the end of this turn that unit is wholly within enemy territory and within 3" of any other friendly units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Iconoclasts`,
        desc: `Pick 1 enemy unit that is a PRIEST OF TOTEM. You complete this battle tactic if that unit is destroyed at the end of the turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Champions of Chaos`,
        desc: `You complete this battle tactic if at the end of your turn there are 3 or more friendly HEROES within 3" of enemy HEROES.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Run Them Down`,
        desc: `You complete this battle tactic if at the end of your turn, 3 or more friendly SLAVES TO DARKNESS units made a charge move in that turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
