import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  DURING_GAME,
  DURING_SETUP,
  END_OF_ROUND,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_THREE_START_OF_ROUND,
  TURN_TWO_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { RealmscapesEnum } from 'types/realmscapes'

// Realmscapes and their various effects/spells etc.
const Realmscapes: TEntry[] = [
  {
    name: RealmscapesEnum.GHUR,
    effects: [
      {
        name: `Predators and Prey`,
        desc: `Once per battle round, you score 1 additional victory point if any enemy MONSTERS were slain in that battle round.`,
        when: [END_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Seismic Shift`,
        desc: `At the start of the third battle round, after the players roll off to determine who has the first turn, the player taking the second turn in that battle round can pick 1 objective marker on the battlefield and remove it from play.`,
        when: [TURN_THREE_START_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Feral Roar`,
        desc: `You can use this command ability at the start of the combat phase. The unit that receives that command must be a MONSTER. Until the end of that phase, when you look up a value on that unit's damage table, it is treated as if it has suffered 0 wounds.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
        command_ability: true,
      },
      {
        name: `Metamorphosis`,
        desc: `Casting value of 5 and range of 12". Pick 1 friendly HERO that is not a MONSTER and that is within range and visible to the caster. That HERO gains the MONSTER keyword until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
        spell: true,
      },

      // Battle Tactics
      {
        name: `Battle Tactics`,
        desc: `At the start of your hero phase, you must pick 1 battle tactic. You must reveal your choice to your opponent, and if your battle tactics instructs you to pick something, you must tell your opponent what you pick. You have until the end of that turn to complete the battle tactic. You cannot pick the same battle tactic more than once per battle.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Broken Ranks`,
        desc: `When you reveal this battle tactic, pick 1 Battleline unit from your opponent's starting army on the battlefield. You complete this battle tactic if that unit is destroyed during this turn. If that unit was destroyed by an attack made by a friendly MONSTER or an ability of a friendly MONSTER, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Conquer`,
        desc: `When you reveal this battle tactic, pick 1 objective marker on the battlefield that your opponent controls. You complete this battle tactic if you control that objective marker at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Slay the Warlord`,
        desc: `You complete this battle tactic if the model chosen to be your opponent's general is slain during this turn. If that model was destroyed by an attack made by a friendly MONSTER or an ability of a friendly MONSTER, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Ferocious Advance`,
        desc: `When you reveal this battle tactic, pick 3 different units from your starting army on the battlefield. You complete this battle tactic if all of the units your picked run in the following movement phase and finish that run within 3" of each other. If all 3 of those units are MONSTERS, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Bring It Down!`,
        desc: `When you reveal this battle tactic, pick 1 enemy MONSTER on the battlefield. You complete this battle tactic if that unit is destroyed during this turn. If that enemy MONSTER was destroyed by an attack made by a friendly MONSTER or an ability of a friendly MONSTER, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Aggressive Expansion`,
        desc: `When you reveal this battle tactic, pick 2 objective markers on the battlefield that are not wholly within your territory. You complete this battle tactic if you control both objective markers at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Monstrous Takeover`,
        desc: `When you reveal this battle tactic, pick 1 MONSTER from your starting army on the battlefield. You complete this battle tactic if that MONSTER is contesting an objective marker that you control at the end of this turn, and that objective marker is not contested by an enemy MONSTER.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Battle Tactic: Savage Spearhead`,
        desc: `You complete this battle tactic if there are 2 or more units from your starting army wholly within your opponent's territory at the end of this turn. If 2 or more of those units are MONSTERS, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
    ],
  },

  {
    name: RealmscapesEnum.GALLET,
    effects: [
      {
        name: `Galletian Champions`,
        desc: `HEROES with a Wounds characteristic of less than 10, that do not have a mount (with the exception of companions) and that are not Unique gain the GALLETIAN CHAMPION keyword.`,
        when: [DURING_SETUP],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2, meta_rule_sources.ERRATA_GHB_JANUARY_2023],
      },
      {
        name: `The Key to Victory`,
        desc: `Friendly GALLETIAN CHAMPIONS cannot be picked as the target of attacks made with missile weapons while they are within 1" of any friendly Battleline units.`,
        when: [SHOOTING_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Desperate Action`,
        desc: `If you are taking the second turn in the current battle round, at the start of your hero phase, you can pick 1 friendly GALLETIAN CHAMPION on the battlefield to carry out 2 different heroic actions in that phase instead of 1.`,
        when: [TURN_TWO_START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Strike at the Opening (Heroic Action)`,
        desc: `Pick 1 friendly GALLETIAN CHAMPION within 3" of an enemy unit. That HERO can fight if it has not already fought in that phase. However, that HERO cannot fight again in that phase and the strike-last effect applies to that HERO until the end of the turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Lead by Example (Heroic Action)`,
        desc: `Pick 1 friendly GALLETIAN CHAMPION that has a Sworn Bodyguard unit (pg 14) and that has just carried out the 'Strike at the Opening' heroic action. If that Sworn Bodyguard unit is wholly within 6" of that GALLETIAN CHAMPION and within 3" of an enemy unit, that Sworn Bodyguard unit can fight if it has not already fought in that phase. However, that unit cannot fight again in that phase and the strike-last effect applies to that unit until the end of the turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Grinding Teeth of Gallet`,
        desc: `Casting value of 6 and a range of 12". Pick 1 objective within range and visible to the caster. Then, roll a dice for each unit within 6" of that objective. On a 4+, that unit suffers D6 mortal wounds. All Wizards know this spell in addition to any others that they know.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
        spell: true,
      },
      {
        name: `No Retreat, No Surrender`,
        desc: `You can use this command ability at the start of the combat phase. The unit that receives the command must be a friendly unit that is not a HERO or MONSTER, that did not charge in the same turn, and that is within 3" of an enemy unit. That unit cannot make pile-in moves in that phase, but add 1 to the Attacks characteristic of melee weapons used by that unit until the end of that phase (excluding those of its mounts, if it has any). Each player can use this command ability in addition to any others that they can use.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
        command_ability: true,
      },
      {
        name: `The Prize of Gallet - Victory Points`,
        desc: `Each player scores victory points at the end of each of their turns as follows:

        - Score 1 victory point if you control at least one activated objective.
        - Score 1 victory point if you control two or more activated objectives.
        - Score 1 victory point if you control more activated objectives than your opponent.
        - Score 2 victory points if you completed the battle tactic you picked that turn.`,
        when: [END_OF_TURN],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },

      // Aspect of the Champion
      {
        name: `Tunnel Master (Aspect of the Champion)`,
        desc: `Once per battle, instead of picking this GALLETIAN CHAMPION to make a normal move, you can remove it from the battlefield and set it up again on the battlefield more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Fuelled by Ghurish Rage (Aspect of the Champion)`,
        desc: `Once per battle, before you allocate a wound or mortal wound to this GALLETIAN CHAMPION and that wound or mortal wound would cause it to be slain, you can roll a dice. On a 3+, that wound or mortal wound is negated, you can heal up to D3 wounds allocated to it and any wounds that currently remain to be allocated to it are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Stubborn as a Rhinox (Aspect of the Champion)`,
        desc: `This GALLETIAN CHAMPION counts as 10 models for the purposes of contesting objectives while there are no enemy GALLETIAN CHAMPIONS contesting the same objective.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Leadership of the Alpha (Aspect of the Champion)`,
        desc: `Once per battle, this GALLETIAN CHAMPION can issue one of the following commands up to 3 times in the same phase: Rally, All-out Attack, All-out Defence or Redeploy. If it does so, no command point is spent the second and third times this GALLETIAN CHAMPION issues that command in that phase.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },

      // Battle tactics
      {
        name: `Battle Tactics`,
        desc: `At the start of your hero phase, you must pick 1 battle tactic from the list below. You must reveal your choice to your opponent, and if your battle tactic instructs you to pick something, you must tell your opponent what you pick. You have until the end of that turn to complete the battle tactic. You cannot pick the same battle tactic more than once per battle.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: Gaining Momentum`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn and you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: An Eye for an Eye`,
        desc: `You complete this battle tactic if 1 or more friendly units were destroyed in the previous turn and 1 or more enemy units are destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: Desecrate their Lands`,
        desc: `Pick 1 terrain feature or faction terrain feature that is partially or wholly within enemy territory. You complete this battle tactic if you control that terrain feature at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: This One's Mine!`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn by an attack made by the model picked to be your general.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: A Matter of Honour`,
        desc: `Pick 1 enemy GALLETIAN CHAMPION or Sworn Bodyguard unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn by an attack made by a friendly GALLETIAN CHAMPION or Sworn Bodyguard unit.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: Lead the Assault`,
        desc: `You complete this battle tactic if at least 2 of the objectives you control are in enemy territory and are each contested by any friendly GALLETIAN CHAMPIONS.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: United Offence`,
        desc: `Pick 1 objective controlled by your opponent. You complete this battle tactic if you control that objective and 2 or more friendly GALLETIAN CHAMPIONS are contesting that objective at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
      {
        name: `Battle Tactic: Cunning Manoeuvre`,
        desc: `Pick 1 friendly GALLETIAN CHAMPION on the battlefield that is more than 3" from all enemy units. You complete this battle tactic if, at the end of the turn, that GALLETIAN CHAMPION is more than 3" from all enemy units and is contesting an objective you control that is wholly outside your territory.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022_2023_SEASON_2],
      },
    ],
  },
  {
    name: RealmscapesEnum.ANDTOR,
    effects: [
      {
        name: `Optimal Focus`,
        desc: `At the start of the hero phase, both players roll a dice. For each 4+, each player receives 1 primal magic dice. After a player attempts to cast or unbind a spell, or after a player attempts to dispel an endless spell, they can roll 1 of their primal magic dice. If they do so, add the result to the casting, unbinding or dispelling roll. That player can continue to roll additional primal magic dice until the caster suffers a primal miscast (see below) or there are no more primal magic dice to be rolled.
        Abilities that allow you to re-roll casting, unbinding or dispelling rolls must be used before primal magic dice are rolled. If you choose to use an ability to re-roll a casting, unbinding or dispelling roll, you cannot use primal magic dice to supplement that roll. At the end of each battle round, any primal magic dice that have not been used are lost.
        When a primal magic dice is rolled as part of a casting roll, on an unmodified casting roll that includes a double 1, the caster suffers a primal miscast instead of a miscast. The spell is not successfully cast, the caster suffers D3+3 mortal wounds and each other unit within 3 Inches of the caster suffers D3 mortal wounds. In addition, the caster cannot attempt to cast any more spells in that phase.
        When a primal magic dice is rolled as part of a casting roll, on an unmodified casting roll that includes a double 6, the spell is successfully cast and cannot be unbound. In addition, the caster cannot attempt to cast any more spells in that phase and both players receive 1 primal magic dice`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },
      {
        name: `Primal Magic`,
        desc: ``,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },
      
      // Command Traits
      {
        name: `Shaman of the Chilled Lands`,
        desc: `This general knows all of the spells from the Lore of Primal Frost.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },
      {
        name: `Eye of the Blizzard`,
        desc: `At the start of your hero phase, if this general is on the battlefield, roll a dice. On a 5+, you gain 1 primal magic dice.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },
      {
        name: `Chilled to the Bone`,
        desc: `Once per battle, if this general suffers a miscast or primal miscast, you can roll a dice. On a 3+, this general can ignore the effects of that miscast or primal miscast.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },
      {
        name: `Eater of Magic`,
        desc: `Each time this general successfully unbinds a spell, roll a dice. On a 5+, the caster no longer knows that spell and may not cast it again for the rest of the battle.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024]
      },

      // Battle tactics
      {
        name: `Battle Tactic: Intimidate the Invaders`,
        desc: `You complete this battle tactic at the end of your turn if there are more friendly units wholly outside your territory than there are friendly units within your territory.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Reprisal`,
        desc: `You complete this battle tactic if an enemy unit that destroyed a friendly general earlier in the battle is destroyed in this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Endless Expropriation`,
        desc: `Pick 1 enemy unit that is controlling or bonded to an endless spell or INCARNATE. You complete this battle tactic at the end of your turn if either of the following are true:
        That enemy unit has been destroyed.
        That INCARNATE is wild.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Magical Dominance`,
        desc: `You complete this battle tactic at the end of your turn if there are more friendly units wholly outside your territory than there are friendly units within your territory.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Magical Mayhem`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed by a spell or the abilities of an endless spell.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Bait and Trap`,
        desc: `You complete this battle tactic if 2 or more friendly units retreated this turn and 2 or more different friendly units made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Led into the Maelstrom`,
        desc: `You complete this battle tactic if 1 or more friendly HEROES and 1 or more friendly Battleline units each made a charge move this turn and at least 1 of those units is within 3" of an enemy unit at the end of the turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Battle Tactic: Surround and Destroy`,
        desc: `Pick 3 different friendly units on the battlefield. You complete this battle tactic at the end of your turn if each of those units is wholly within 6" of a different battlefield edge and 2 or more of those units are wholly outside your territory.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      // Nullstone Adornments
      {
        name: `Hand - Carved Nullstone Icon`,
        desc: `The bearer can attempt to unbind 1 spell or attempt to dispel 1 endless spell in the enemy hero phase in the same manner as a Wizard. Each time the bearer successfully unbinds a spell or dispels an endless spell using this ability, the bearer can attempt to unbind 1 additional spell in that phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Pouch of Nulldust`,
        desc: `Once per battle, at the start of the hero phase, you can say that the bearer will use their Pouch of Nulldust. If you do so, until the end of that phase, unmodified casting rolls that include a double 1, double 2 or double 3 are treated as miscasts or, if a primal magic dice was rolled as part of the casting roll, as primal miscasts. In addition, roll a dice for each endless spell on the battlefield. On a 5+, that endless spell is dispelled.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
      {
        name: `Polished Nullstone Pebble`,
        desc: `When this unit is picked as the target of a spell or the abilities of an endless spell, you can roll a dice. On a 4+, the caster must pick another unit within 3" of this unit and within range of that spell or endless spell's abilities to be the target. If, when picking another unit, there are no other units within 3" of this unit and within range, ignore the effect of that spell or the effects of that endless spell's abilities on this unit instead`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2023_2024],
      },
    ]
  }
]

export default Realmscapes
