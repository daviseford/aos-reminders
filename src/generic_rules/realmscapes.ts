import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_THREE_START_OF_ROUND,
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
        name: `Masters of the Splintered Land`,
        desc: `Friendly Battleline units that have a Wounds characteristic of 4 or less and do not have mounts gain the GALLETIAN VETERANS keyword.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Proving Grounds`,
        desc: `At the start of each battle round, after the players have determined who will take the first turn, the player who will take the second turn can pick 1 objective on the battlefield to be the proving ground until the end of that battle round. The same objective cannot be picked as the proving ground more than once per battle, and only 1 objective can be marked as the proving ground at any one time. Only models in units with the GALLETIAN VETERANS keyword can contest an objective marked as the proving ground.`,
        when: [START_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `The Bonds of Battle`,
        desc: `When a model in a GALLETIAN VETERANS unit makes an attack with a melee weapon, you can target an enemy unit within 1/2" of another model from that GALLETIAN VETERANS unit instead of using the weapon's Range characteristic for that attack. If you do so, the attacking model must be within 1/2" of another model from its own unit that is within 1/2" of the target.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Gaze of Ghur`,
        desc: `Gaze of Ghur is a spell that has a casting value of 7 and a range of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. Until your next hero phase, when determining the number of models in that enemy unit that are contesting an objective, your opponent must halve that number, rounding down.
        
        Designer's Note: Effects that modify the number of models a model counts as when contesting an objective are applied after effects that fix the number of models a model counts as when contesting an objective at a set value. For example, if a Mega-Gargant counts as 20 models because of the 'Mightier Makes Rightier' battle trait, 'Gaze of Ghur' would make that unit count as 10 models instead. `,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.ERRATA_GHB_OCTOBER_2022],
        spell: true, // TODO: This doesn't appear in dropdowns
      },
      {
        name: `Overwhelming Assault`,
        desc: `You can use this command ability at the end of your charge phase. The unit that receives the command must be a GALLETIAN VETERANS that has 10 or more models. Pick 1 enemy unit within 1" of that unit that has a Wounds characteristic of 4 or less and roll a dice. If the roll is greater than the number of models in that enemy unit, the strike-last effect applies to that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
        command_ability: true,
      },

      // Battle tactics
      {
        name: `Battle Tactics`,
        desc: `At the start of your hero phase, you must pick 1 battle tactic. You must reveal your choice to your opponent, and if your battle tactics instructs you to pick something, you must tell your opponent what you pick. You have until the end of that turn to complete the battle tactic. You cannot pick the same battle tactic more than once per battle.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Gaining Momentum`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn and you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: An Eye for an Eye`,
        desc: `You complete this battle tactic if 1 or more friendly units were destroyed in the previous turn and 1 or more enemy units are destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Desecrate their Lands`,
        desc: `Pick 1 terrain feature or faction terrain feature that is partially or wholly within your opponent's territory. You complete this battle tactic if you control that terrain feature at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: This One's Mine!`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn by an attack made by the model picked to be your general.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Head-to-Head`,
        desc: `Pick 1 enemy GALLETIAN VETERANS unit on the battlefield. You complete this battle tactic if that unit is destroyed during this turn by an attack made by a friendly GALLETIAN VETERANS unit or an ability of a friendly GALLETIAN VETERANS unit.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Outmuscle`,
        desc: `Pick 1 enemy GALLETIAN VETERANS unit that has any models contesting an objective marked as the proving ground (pg 12). You complete this battle tactic if no models from that enemy unit are contesting the proving ground at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Against the Odds`,
        desc: `Pick 1 unit from your starting army on the battlefield. You complete this battle tactic if, at the end of this turn, any models from that unit are contesting an objective you control and that objective is not being contested by any enemy GALLETIAN VETERANS models.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Battle Tactic: Barge Through Enemy Lines`,
        desc: `You complete this battle tactic if there are 2 or more units from your starting army wholly within your opponent's territory at the end of this turn. If 2 or more of those units are GALLETIAN VETERANS units, score 1 additional victory point.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
    ],
  },
]

export default Realmscapes
