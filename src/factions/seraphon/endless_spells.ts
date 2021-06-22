import { tagAs } from 'factions/metatagger'
import {
  AethervoidPendulumEffects,
  BurningHeadEffects,
  ChronomanticCogsEffects,
  EmeraldLifeswarmEffects,
  GeminidsOfUhlGyshEffects,
  HorrorghastEffects,
  LauchonTheSoulseekerEffects,
  MalevolentMaelstromEffects,
  PrismaticPalisadeEffects,
  PurpleSunEffects,
  QuicksilverSwordsEffects,
  RavenaksGnashingJawsEffects,
  ShardsOfValagharrEffects,
  SoulscreamBridgeEffects,
  SoulsnareShacklesEffects,
  SuffocatingGravetideEffects,
  UmbralSpellportalEffects,
} from 'generic_rules/endless_spells'
import { END_OF_HERO_PHASE } from 'types/phases'

const BoundEffect = {
  name: `Bound Endless Spell`,
  desc: `All of the rules that apply to other endless spells also apply to bound endless spells, except that bound predatory spells can only be moved by a player that has a Seraphon army. If only one player has a Seraphon army, then they move all of the bound predatory endless spells before any other predatory endless spells are moved. The players then alternate moving any remaining predatory endless spells as normal.

  If both players have Seraphon armies, the players alternate moving predatory endless spells as normal, but each time a player could move a predatory endless spell, they can choose to move either a bound predatory endless spell or a normal predatory endless spell.`,
  when: [END_OF_HERO_PHASE],
}

const EndlessSpells = {
  'Bound Quicksilver Swords': {
    effects: [BoundEffect, ...QuicksilverSwordsEffects],
  },
  'Bound Emerald Lifeswarm': {
    effects: [BoundEffect, ...EmeraldLifeswarmEffects],
  },
  'Bound Soulsnare Shackles': {
    effects: [BoundEffect, ...SoulsnareShacklesEffects],
  },
  'Bound Burning Head': {
    effects: [BoundEffect, ...BurningHeadEffects],
  },
  'Bound Chronomantic Cogs': {
    effects: [BoundEffect, ...ChronomanticCogsEffects],
  },
  'Bound Geminids of Uhl-Gysh': {
    effects: [BoundEffect, ...GeminidsOfUhlGyshEffects],
  },
  'Bound Malevolent Maelstrom': {
    effects: [BoundEffect, ...MalevolentMaelstromEffects],
  },
  'Bound Aethervoid Pendulum': {
    effects: [BoundEffect, ...AethervoidPendulumEffects],
  },
  'Bound Suffocating Gravetide': {
    effects: [BoundEffect, ...SuffocatingGravetideEffects],
  },
  'Bound Umbral Spellportal': {
    effects: [BoundEffect, ...UmbralSpellportalEffects],
  },
  "Bound Ravenak's Gnashing Jaws": {
    effects: [BoundEffect, ...RavenaksGnashingJawsEffects],
  },
  'Bound Purple Sun of Shyish': {
    effects: [BoundEffect, ...PurpleSunEffects],
  },
  'Bound Prismatic Palisade': {
    effects: [BoundEffect, ...PrismaticPalisadeEffects],
  },
  'Bound Lauchon the Soulseeker': {
    effects: [BoundEffect, ...LauchonTheSoulseekerEffects],
  },
  'Bound Soulscream Bridge': {
    effects: [BoundEffect, ...SoulscreamBridgeEffects],
  },
  'Bound Horrorghast': {
    effects: [BoundEffect, ...HorrorghastEffects],
  },
  'Bound Shards of Valagharr': {
    effects: [BoundEffect, ...ShardsOfValagharrEffects],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
