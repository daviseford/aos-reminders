import { TEndlessSpells } from 'types/army'
import {
  AethervoidPendulumEffects,
  BalewindVortexEffects,
  BurningHeadEffects,
  ChronomanticCogsEffects,
  EmeraldLifeswarmEffects,
  GeminidsOfUhlGyshEffects,
  MalevolentMaelstromEffects,
  PrismaticPalisadeEffects,
  PurpleSunEffects,
  QuicksilverSwordsEffects,
  RavenaksGnashingJawsEffects,
  SoulsnareShacklesEffects,
  SuffocatingGravetideEffects,
  UmbralSpellportalEffects,
} from 'army/generic/endless_spells'
import { START_OF_ROUND } from 'types/phases'

const BoundEffect = {
  name: `Bound Endless Spell`,
  desc: `All of the rules that apply to other endless spells also apply to bound endless spells, except that bound predatory spells can only be moved by a player that has a Seraphon army. If only one player has a Seraphon army, then they move all of the bound predatory endless spells before any other predatory endless spells are moved. The players then alternate moving any remaining predatory endless spells as normal.
  
  If both players have Seraphon armies, the players alternate moving predatory endless spells as normal, but each time a player could move a predatory endless spell, they can choose to move either a bound predatory endless spell or a normal predatory endless spell.`,
  when: [START_OF_ROUND],
}

const EndlessSpells: TEndlessSpells = [
  {
    name: `Bound Quicksilver Swords`,
    effects: [BoundEffect, ...QuicksilverSwordsEffects],
  },
  {
    name: `Bound Emerald Lifeswarm`,
    effects: [BoundEffect, ...EmeraldLifeswarmEffects],
  },
  {
    name: `Bound Soulsnare Shackles`,
    effects: [BoundEffect, ...SoulsnareShacklesEffects],
  },
  {
    name: `Bound The Burning Head`,
    effects: [BoundEffect, ...BurningHeadEffects],
  },
  {
    name: `Bound Chronomantic Cogs`,
    effects: [BoundEffect, ...ChronomanticCogsEffects],
  },
  {
    name: `Bound Geminids of Uhl-Gysh`,
    effects: [BoundEffect, ...GeminidsOfUhlGyshEffects],
  },
  {
    name: `Bound Malevolent Maelstrom`,
    effects: [BoundEffect, ...MalevolentMaelstromEffects],
  },
  {
    name: `Bound Aethervoid Pendulum`,
    effects: [BoundEffect, ...AethervoidPendulumEffects],
  },
  {
    name: `Bound Suffocating Gravetide`,
    effects: [BoundEffect, ...SuffocatingGravetideEffects],
  },
  {
    name: `Bound Umbral Spellportal`,
    effects: [BoundEffect, ...UmbralSpellportalEffects],
  },
  {
    name: `Bound Balewind Vortex`,
    effects: [BoundEffect, ...BalewindVortexEffects],
  },
  {
    name: `Bound Ravenak's Gnashing Jaws`,
    effects: [BoundEffect, ...RavenaksGnashingJawsEffects],
  },
  {
    name: `Bound Purple Sun of Shyish`,
    effects: [BoundEffect, ...PurpleSunEffects],
  },
  {
    name: `Bound Prismatic Palisade`,
    effects: [BoundEffect, ...PrismaticPalisadeEffects],
  },
]

export default EndlessSpells
