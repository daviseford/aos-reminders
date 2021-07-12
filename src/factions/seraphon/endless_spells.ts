import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
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
import { DURING_GAME } from 'types/phases'
import rule_sources from './rule_sources'

const BondedEffects = [
  {
    name: `Bonded Endless Spells`,
    desc: `Endless spells summoned by SERAPHON WIZARDS are bonded to the model that summoned them.`,
    when: [DURING_GAME],
    rule_sources: [rule_sources.BATTLETOME_SERAPHON, rule_sources.ERRATA_SERAPHON_JULY_2021],
    shared: true
  },
  ...GenericEffects.Bonded,
]

const EndlessSpells = {
  'Bound Quicksilver Swords': {
    effects: [...BondedEffects, ...QuicksilverSwordsEffects],
  },
  'Bound Emerald Lifeswarm': {
    effects: [...BondedEffects, ...EmeraldLifeswarmEffects],
  },
  'Bound Soulsnare Shackles': {
    effects: [...BondedEffects, ...SoulsnareShacklesEffects],
  },
  'Bound Burning Head': {
    effects: [...BondedEffects, ...BurningHeadEffects],
  },
  'Bound Chronomantic Cogs': {
    effects: [...BondedEffects, ...ChronomanticCogsEffects],
  },
  'Bound Geminids of Uhl-Gysh': {
    effects: [...BondedEffects, ...GeminidsOfUhlGyshEffects],
  },
  'Bound Malevolent Maelstrom': {
    effects: [...BondedEffects, ...MalevolentMaelstromEffects],
  },
  'Bound Aethervoid Pendulum': {
    effects: [...BondedEffects, ...AethervoidPendulumEffects],
  },
  'Bound Suffocating Gravetide': {
    effects: [...BondedEffects, ...SuffocatingGravetideEffects],
  },
  'Bound Umbral Spellportal': {
    effects: [...BondedEffects, ...UmbralSpellportalEffects],
  },
  "Bound Ravenak's Gnashing Jaws": {
    effects: [...BondedEffects, ...RavenaksGnashingJawsEffects],
  },
  'Bound Purple Sun of Shyish': {
    effects: [...BondedEffects, ...PurpleSunEffects],
  },
  'Bound Prismatic Palisade': {
    effects: [...BondedEffects, ...PrismaticPalisadeEffects],
  },
  'Bound Lauchon the Soulseeker': {
    effects: [...BondedEffects, ...LauchonTheSoulseekerEffects],
  },
  'Bound Soulscream Bridge': {
    effects: [...BondedEffects, ...SoulscreamBridgeEffects],
  },
  'Bound Horrorghast': {
    effects: [...BondedEffects, ...HorrorghastEffects],
  },
  'Bound Shards of Valagharr': {
    effects: [...BondedEffects, ...ShardsOfValagharrEffects],
  },
}

export default tagAs(EndlessSpells, 'endless_spell')
