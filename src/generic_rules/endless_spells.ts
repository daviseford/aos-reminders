import rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

export const ChronomanticCogsEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Mechanisms of Time`,
    desc: `When this endless spell is set up, the commanding player must decide if it is increasing or decreasing the flow of time.
    
    If it is increasing the flow of time, add 1 to charge rolls for units wholly within 18" of this endless spell.
    If it is decreasing the flow of time, WIZARDS can attempt to cast 1 extra spell in their command player's hero phase while they are within 6" of this endless spell.
    
    At the start of the hero phase, if there is a friendly WIZARD within 6" of this endless spell, the player whose turn is taking place can change whether this endless spell is increasing or decreasing the flow of time.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Mechanisms of Time`,
    desc: `If this endless spell is increasing the flow of time, add 1 to charge rolls for units wholly within 18" of this endless spell. `,
    when: [CHARGE_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Mechanisms of Time`,
    desc: `If this endless spell is decreasing the flow of time, WIZARDS can attempt to cast 1 extra spell in their command player's hero phase while they are within 6" of this endless spell.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Mechanisms of Time`,
    desc: `At the start of the hero phase, if there is a friendly WIZARD within 6" of this endless spell, the player whose turn is taking place can change whether this endless spell is increasing or decreasing the flow of time.`,
    when: [START_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const EmeraldLifeswarmEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Bounteous Healing`,
    desc: `After this endless spell is set up and after it has moved, the commanding player can pick 1 unit within 1" of it. 
    
    They can heal up to D3 wounds allocated to that unit or, if no wounds are allocated to it, they can return a number of slain models to that unit that have a combined Wounds characteristic of D3 or less.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const SoulsnareShacklesEffects = [
  {
    name: `Parts`,
    desc: `This endless spell has 3 parts.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Summoning`,
    desc: `Casting value of 7 and a range of 12". Set up the parts of the endless spell wholly 3" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Bound for the Great Oubliette`,
    desc: `Units within 6" of this endless spell cannot run or attempt a charge.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Bound for the Great Oubliette`,
    desc: `At the start of the movement phase, roll a D6 for each unit within 6" of this endless spell. On a 6, that unit suffers D3 mortal wounds.`,
    when: [START_OF_MOVEMENT_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const SuffocatingGravetideEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Pulled to the Grave`,
    desc: `After this endless spell has moved, for each unit that has any models it passed across, roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const GeminidsOfUhlGyshEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 9". Set up the parts of the endless spell within 6" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly. The parts of this endless spell must remain within 6" of each other`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Tendrils of Shadow and Light`,
    desc: `After this endless spell has moved, roll a D6 for each unit that has any models it passed across and for each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers 1 mortal wound. In addition, if a mortal wound caused by this ability is allocated to a unit, that unit cannot issue or receive commands until the start of the next combat phase.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const BurningHeadEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 7 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Flaming Skull`,
    desc: `After this endless spell has moved, if any units are within 1" of it, roll a dice for each unit within 1" of this endless spell. On a 2+, that unit suffers D3 mortal wounds. Then, this endless spell is removed from play.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const QuicksilverSwordsEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Dancing Blades`,
    desc: `After this endless spell has moved, the commanding player can pick 1 unit that has any models it passed across and roll 12 dice. For each 6, that unit suffers 1 mortal wound. In addition, ward rolls cannot be made for mortal wounds caused by this ability.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Dancing Blades`,
    desc: `Ward rolls cannot be made for mortal wounds caused by this ability.`,
    when: [WOUND_ALLOCATION_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const PurpleSunEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 8 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `End Given Form`,
    desc: `At the end of the hero phase, before determining control of predatory endless spells, roll a D6 for this endless spell. On a 5+, this endless spell becomes wild for the rest of the battle (do not roll for it again).
    
    After this endless spell has moved, roll a D6 for each unit that has any models it passed across and for each other unit that is within 1" of it at the end of its move. On a 1, nothing happens. On a 2-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const PrismaticPalisadeEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Blinding Light`,
    desc: `Visibility between 2 models is blocked if a straight line drawn between the closest points of the 2 models passes across this endless spell.`,
    when: [DURING_GAME],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const MalevolentMaelstromEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Morbid Detonation`,
    desc: `When this endless spell is set up, place a D6 beside it with the '1' facing up. Each time a spell is successfully cast by a unit within 12" of this endless spell and not unbound, after the effects of the spell have been resolved, increase the value of the D6 beside this endless spell by 1 (to a maximum of 6). In addition, each time a model is slain within 12" of this endless spell, increase the value of the dice beside this endless spell by 1 (to a maximum of 6).
    
    At the end of the combat phase, if this endless spell is on the battlefield, roll a D6 and add the value of the D6 besides this endless spell to the roll. On a 10+, each unit within 12" of this endless spell suffers D3 mortal wounds. Then, this endless spell is removed from play.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Morbid Detonation`,
    desc: `Each time a model is slain within 12" of this endless spell, increase the value of the dice beside this endless spell by 1 (to a maximum of 6).`,
    when: [WOUND_ALLOCATION_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Morbid Detonation`,
    desc: `At the end of the combat phase, if this endless spell is on the battlefield, roll a D6 and add the value of the D6 besides this endless spell to the roll. On a 10+, each unit within 12" of this endless spell suffers D3 mortal wounds. Then, this endless spell is removed from play.`,
    when: [END_OF_COMBAT_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const RavenaksGnashingJawsEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 3D6" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Ravening Hunger`,
    desc: `After this endless spell has moved, the commanding player can pick 1 unit that has any models it passed across and roll a number of dice equal to the roll that was made for the move. For each 6, that unit suffers 1 mortal wound.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
// export const BalewindVortexEffects = [
//   {
//     name: `Against the Aetheric Wind`,
//     desc: `Add 1 to save rolls for a Wizard on a Balewind Vortex.`,
//     when: [SAVES_PHASE],
//   },
//   {
//     name: `Arcane Invigoration`,
//     desc: `A Wizard on a Balewind Vortex can attempt to cast an additional spell in each of their hero phases (including the turn in which the Summon Balewind Vortex spell was cast), and you can add 6" to the range of any spells that the Wizard casts.`,
//     when: [HERO_PHASE],
//   },
// ]
export const AethervoidPendulumEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 6". Set up the endless spell wholly within range of the caster. When this endless spell is set up, pivot the model so that the tip of the pendulum blade is pointing in the direction in which the endless spell is to be moved.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly. When this endless spell is moved, it must move in a straight line in the direction in which the tip of the pendulum blade is pointing.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Scything Blade`,
    desc: `After this endless spell has moved, roll a D6 for each unit that has any models it passed across and for each other unit that is within 1" of it at the end of its move. On a 2+, that unit suffers D3 mortal wounds.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const UmbralSpellportalEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 18". Set up the parts of the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Parts`,
    desc: `This endless spell has 2 parts`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Arcane Passage`,
    desc: `Once per turn, if a WIZARD successfully casts a spell within 1" of this endless spell, the range, visibility and effect of that spell can be measured from this endless spell instead of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Arcane Passage`,
    desc: `Once per turn, when a predatory endless spell within 6" of this endless spell is picked to move, the commanding player of that predatory endless spell can remove it from the battlefield and set it up again within 6" of the other part of this endless spell. A predatory endless spell set up in this manner does not count as having moved, but it cannot be picked to move again in the same phase.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const LauchonTheSoulseekerEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 6". Set up the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 18" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Soul Price`,
    desc: `Before the commanding player moves this endless spell, they can pick 1 friendly WIZARD wholly within 3" of this endless spell. Remove that WIZARD from the battlefield. After this endless spell has moved, set that WIZARD up again wholly within 3" of this endless spell and more than 9" from all enemy units. After that WIZARD has been set up, it suffers 1 mortal wound. That WIZARD cannot make a normal move or run in the following movement phase.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const SoulscreamBridgeEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 18". Set up the parts of the endless spell wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Parts`,
    desc: `This endless spell has 2 parts`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Deathly Passage`,
    desc: `At the start of the movement phase, the player whose turn is taking place can remove 1 friendly unit that is wholly within 6" of a part of this endless spell from the battlefield and set it up again wholly within 6" of the other part of this endless spell and more than 9" from all enemy units.
    
    A unit cannot be removed and set up again in this way more than once per phase. A unit removed and set up again in this way cannot make a normal move or run in the charge phase.`,
    when: [START_OF_MOVEMENT_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Deathly Passage`,
    desc: `A unit removed and set up again in this way cannot make a normal move or run in the charge phase.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const HorrorghastEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 6 and a range of 12". Set up the model wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `Can move up to 8" and can fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Prey on Fear`,
    desc: `Units wholly within 12" of this endless spell cannot receive commands in the battleshock phase. In addition, if a unit fails a battleshock test wholly within 12" of this endless spell, add D3 to the number of models that flee.`,
    when: [BATTLESHOCK_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
]
export const ShardsOfValagharrEffects = [
  {
    name: `Summoning`,
    desc: `Casting value of 5 and a range of 18". Set up the parts of the endless spell wholly within 12" of each other and wholly within range of the caster.`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Parts`,
    desc: `This endless spell has 2 parts`,
    when: [HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Predatory`,
    desc: `To move this endless spell, remove 1 of its parts from the battlefield and set it up again wholly within 12" of its other part.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Ensnaring Soul-drain`,
    desc: `After this endless spell has moved, draw a straight line between the closest points of each part of this endless spell. Each unit that has any models passed across by this line is ensnared until the end of that turn. Halve the Move characteristic of a unit that is ensnared. In addition, a unit that is ensnared cannot fly.`,
    when: [END_OF_HERO_PHASE],
    rule_sources: [rule_sources.GHB_2021],
  },
  {
    name: `Ensnaring Soul-drain`,
    desc: `Halve the Move characteristic of a unit that is ensnared. In addition, a unit that is ensnared cannot fly.`,
    when: [MOVEMENT_PHASE],
    rule_sources: [rule_sources.GHB_2021],
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
