import { GenericEffects } from 'generic_rules'
import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Summoning_Casting6_Range6_Effect = {
  name: `Summoning`,
  desc: `Casting value of 6 and range of 6". Set up the endless spell wholly within range of the caster.`,
  when: [HERO_PHASE],
  rule_sources: [meta_rule_sources.GHB_2021],
  shared: true,
}

export const ChronomanticCogsEffects = [
  Summoning_Casting6_Range6_Effect,
  {
    name: `Mechanisms of Time`,
    desc: `When you set up this endless spell, you must decide if it is increasing or decreasing the flow of time.

    If it is increasing the flow of time, players can reroll charge rolls for friendly units that are wholly within 12" of this endless spell.

    If it is decreasing the flow of time, players can reroll casting rolls for friendly WIZARDS that are wholly within 12" of this endless spell.

    If a player has any friendly WIZARDS within 6" of this endless spell at the start of their hero phase, they can change whether this endless spell is increasing or decreasing the flow of time.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const EmeraldLifeswarmEffects = [
  Summoning_Casting6_Range6_Effect,
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Bounteous Healing`,
    desc: `After this endless spell has moved, the commanding player can pick 1 unit within 3" of it. They can heal up to D3 wounds allocated to that unit or, if no wounds are allocated to it, they can return a number of slain models to that unit that have a combined Wounds characteristic of D3 or less.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const SoulsnareShacklesEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 7 and a range of 8". Set up the parts of the endless spell wholly within 3" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Bound for the Great Oubliette`,
    desc: `Units within 6" of this endless spell cannot run or attempt a charge.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Bound for the Great Oubliette`,
    desc: `At the start of the movement phase, roll a dice for each unit within 6" of this endless spell. On a 6, that unit suffers D3 mortal wounds.`,
    when: [START_OF_MOVEMENT_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const SuffocatingGravetideEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 8". If successfully cast, set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Pulled to the Grave`,
    desc: `After this endless spell has moved, for each unit that has any models it passed across, roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const GeminidsOfUhlGyshEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 8". If successfully cast, set up the parts of the endless spell within 6" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly. The parts of this endless spell must remain within 6" of each other.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Tendrils of Shadow and Light`,
    desc: `After this endless spell has moved, roll a dice for each unit that has any models that it passed across, and each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers 1 mortal wound. In addition, if a mortal wound caused by this ability is allocated to a unit and not negated, that unit cannot issue or receive commands until the start of the next combat phase.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const BurningHeadEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and range of 8". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Flaming Skull`,
    desc: `After this endless spell has moved, if any units are within 3" of it, roll a dice for each unit within 3" of this endless spell. On a 2+, that unit suffers D3 mortal wounds. After this endless spell causes any mortal wounds with this ability, it is removed from play.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const QuicksilverSwordsEffects = [
  Summoning_Casting6_Range6_Effect,
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Dancing Blades`,
    desc: `After this endless spell has moved, you can pick 1 unit that has any models it passed across and roll 12 dice. For each 5+, that unit suffers 1 mortal wound. In addition, mortal wounds caused by this ability cannot be negated.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Dancing Blades`,
    desc: `Mortal wounds caused by this ability cannot be negated.`,
    when: [WOUND_ALLOCATION_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const PurpleSunEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 8 and range of 8". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `End Given Form`,
    desc: `Subtract 1 from save rolls for attacks that target units within 6" of this endless spell.`,
    when: [SAVES_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `End Given Form`,
    desc: `Roll a dice for each unit within 3" of this endless spell after this endless spell has moved. On a 1, 1 model from that unit is slain.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const PrismaticPalisadeEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and range of 8". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Blinding Light`,
    desc: `Units within 6" of this endless spell cannot make shooting attacks. Add 3" to the range of this ability at the start of each battle round after the turn it was summoned.`,
    when: [SHOOTING_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const MalevolentMaelstromEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and range of 8". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Morbid Detonation`,
    desc: `After this endless spell is summoned, place a D6 beside it with the '1' facing up. Each time a spell is successfully cast by a unit within 12" of this endless spell and not unbound, after the effects of the spell have been resolved, increase the value of the dice beside this endless spell by 1 (to a maximum of 6). In addition, each time a model is slain within 12" of this endless spell, increase the value of the dice beside this endless spell by 1 (to a maximum of 6).
    
    At the end of the combat phase, if this endless spell is on the battlefield, roll a dice and add the value of the dice beside this endless spell to the roll. On a 10+, each unit within 12" of this endless spell suffers D3 mortal wounds. Then, this endless spell is removed from play.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const RavenaksGnashingJawsEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and range of 8". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Predatory`,
    desc: `This endless spell is a predatory endless spell. It can be moved up to 3D6" and can fly. You can reroll the dice that determines how far this endless spell can move if it was summoned in the same turn.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Ravening Hunger`,
    desc: `After this endless spell has moved, pick 1 unit that has any models it passed across or that is within 1" of it at the end of its move and roll a dice. On a 2+, if the roll for this endless spell's move was greater than that unit's Move characteristic, that unit suffers a number of mortal wounds equal to the difference between that unit's Move characteristic (rounded up if necessary) and the roll for this endless spell's move.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.ERRATA_GHB_JANUARY_2023],
  },
]

export const AethervoidPendulumEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 8". If successfully cast, set up the endless spell wholly within range of the caster. When this endless spell is set up, pivot the model so that the tip of the pendulum blade is pointing in the direction you wish the endless spell to move.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Predatory`,
    desc: `This endless spell is a predatory endless spell. It can be moved up to 8" and can fly. When you move this endless spell, it must move in a straight line in the direction the tip of the pendulum blade is pointing.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Scything Blade`,
    desc: `After this endless spell has moved, roll a dice for each unit that has any models that it passed across, and each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const UmbralSpellportalEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and range of 18". Set up the parts of the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Arcane Passage`,
    desc: `Once per turn, if a WIZARD successfully casts a spell within 1" of this endless spell, the range, visibility and effect of that spell can be measured from 1 part of this endless spell instead of the caster. Spells that summon endless spells do not benefit from this effect.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Arcane Passage`,
    desc: `Once per turn, if a predatory endless spell starts a move within 6" of this endless spell, instead of making a move with it, the commanding player can remove that predatory endless spell from the battlefield and set it up again anywhere within 6" of the other part of this endless spell. An endless spell set up in this manner does not count as having moved.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const LauchonTheSoulseekerEffects = [
  Summoning_Casting6_Range6_Effect,
  {
    name: `Predatory`,
    desc: `Can move up to 18" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Soul Price`,
    desc: `Before the commanding player moves this endless spell, they can pick 1 friendly WIZARD wholly within 3" of this endless spell. Remove that WIZARD from the battlefield. After this endless spell has moved, set that WIZARD up again wholly within 3" of this endless spell and more than 9" from all enemy units. After that WIZARD has been set up, it suffers 1 mortal wound. That WIZARD can make a normal move or run in the following movement phase.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const SoulscreamBridgeEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and range of 24". If successfully cast, set up the parts of the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Deathly Passage`,
    desc: `At the start of the movement phase, the player whose turn is taking place can remove 1 friendly unit that is wholly within 6" of a part of this endless spell from the battlefield and set it up again wholly within 6" of the other part of this endless spell and more than 9" from all enemy units.

    A unit cannot be removed and set up again in this way more than once per phase. A unit removed and set up again in this way cannot make a normal move or run in the same phase.`,
    when: [START_OF_MOVEMENT_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const HorrorghastEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 12". If successfully cast, set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  GenericEffects.Predatory.Eight_Inches,
  {
    name: `Prey on Fear`,
    desc: `Units within 12" of this endless spell cannot receive commands in the battleshock phase. In addition, if a unit fails a battleshock test within 12" of this endless spell, add D3 to the number of models that flee.`,
    when: [BATTLESHOCK_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]
export const ShardsOfValagharrEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and range of 18". Set up the parts of the endless spell wholly within 12" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Predatory`,
    desc: `This endless spell is a predatory endless spell. When you pick this endless spell to move, remove 1 of its parts from the battlefield and set it up again wholly within 12" of its other part.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Ensnaring Soul-drain`,
    desc: `After this endless spell has moved, draw a straight line between the closest points of each part of this endless spell. Each unit passed across by this line is ensnared until the end of that turn. Halve the Move characteristic of a unit that is ensnared.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
  {
    name: `Ensnaring Soul-drain`,
    desc: `A unit that is ensnared cannot fly or be removed from the battlefield with an effect that would allow it to be set up again in the same turn.`,
    when: [DURING_GAME],
    rule_sources: [meta_rule_sources.GHB_2022, meta_rule_sources.GHB_2022_2023_SEASON_2],
  },
]

const EndlessSpells: TEntry[] = [
  // Removed in AoS 3.0
  // {
  //   name: `Balewind Vortex`,
  //   effects: [
  //     ...BalewindVortexEffects,
  //     {
  //       name: `Summon Balewind Vortex`,
  //       desc: `Casting value of 6. WIZARDS with a Wounds characteristic of 9 or more, that are part of a unit of two or more models, are already on a Balewind Vortex, or happen to be Morathi-Khaine, cannot attempt to cast this spell. Set up a Balewind Vortex model within 1" of the caster and more than 3" from any enemy models, and then place the caster on the upper platform.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  {
    name: `Emerald Lifeswarm`,
    effects: [...EmeraldLifeswarmEffects],
  },
  {
    name: `Geminids of Uhl-Gysh`,
    effects: [...GeminidsOfUhlGyshEffects],
  },
  {
    name: `Malevolent Maelstrom`,
    effects: [...MalevolentMaelstromEffects],
  },
  {
    name: `Prismatic Palisade`,
    effects: [...PrismaticPalisadeEffects],
  },
  {
    name: `Purple Sun of Shyish`,
    effects: [...PurpleSunEffects],
  },
  {
    name: `Quicksilver Swords`,
    effects: [...QuicksilverSwordsEffects],
  },
  {
    name: `Ravenak's Gnashing Jaws`,
    effects: [...RavenaksGnashingJawsEffects],
  },
  {
    name: `Soulsnare Shackles`,
    effects: [...SoulsnareShacklesEffects],
  },
  {
    name: `Suffocating Gravetide`,
    effects: [...SuffocatingGravetideEffects],
  },
  {
    name: `The Burning Head`,
    effects: [...BurningHeadEffects],
  },
  {
    name: `Umbral Spellportal`,
    effects: [...UmbralSpellportalEffects],
  },
  {
    name: `Aethervoid Pendulum`,
    effects: [...AethervoidPendulumEffects],
  },
  {
    name: `Chronomantic Cogs`,
    effects: [...ChronomanticCogsEffects],
  },
  {
    name: `Soulscream Bridge`,
    effects: [...SoulscreamBridgeEffects],
  },
  {
    name: `Shards of Valagharr`,
    effects: [...ShardsOfValagharrEffects],
  },
  {
    name: `Lauchon the Soulseeker`,
    effects: [...LauchonTheSoulseekerEffects],
  },
  {
    name: `Horrorghast`,
    effects: [...HorrorghastEffects],
  },
]

export default EndlessSpells
