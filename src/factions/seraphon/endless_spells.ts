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
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_ROUND } from 'types/phases'

const BoundEffect = {
  name: `Bound Endless Spell`,
  desc: `All of the rules that apply to other endless spells also apply to bound endless spells, except that bound predatory spells can only be moved by a player that has a Seraphon army. If only one player has a Seraphon army, then they move all of the bound predatory endless spells before any other predatory endless spells are moved. The players then alternate moving any remaining predatory endless spells as normal.

  If both players have Seraphon armies, the players alternate moving predatory endless spells as normal, but each time a player could move a predatory endless spell, they can choose to move either a bound predatory endless spell or a normal predatory endless spell.`,
  when: [START_OF_ROUND],
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
  'Bound Balewind Vortex': {
    effects: [
      BoundEffect,
      ...BalewindVortexEffects,
      {
        name: `Summon Balewind Vortex`,
        desc: `Casting value of 6. Only SERAPHON WIZARDS with a Wounds characteristic of 9 or less and that are not already on a Balewind Vortex can attempt to cast this spell. Set up a Bound Balewind Vortex model within 1" of the caster and more than 3" from any enemy models, then place the caster on the upper platform.

        As long as the Bound Balewind Vortex is on the battlefield, both it and the caster are treated as a single model from the caster's army that uses the caster's warscroll as well as the endless spells rules. It is treated as an enemy model by the opposing player's army. A model on a Bound Balewind Vortex cannot move,

        If the caster of a Bound Balewind Vortex attempts to dispel it, the attempt is automatically successful (do not roll any dice). This uses up the additional spell that the caster would have received in that hero phase, and still counts as the single attempt they can make to dispel an endless spell in that hero phase, but they can make any remaining casting attempts normally. If the caster of a Bound Balewind Vortex is slain, then it is immediately dispelled and removed from play along with the caster.

        If a Bound Balewind Vortex is dispelled and the caster has not been slain, first set up the caster wholly within 6" of it and more than 3" from any enemy models, and then remove the Bound Balewind Vortex model from play, If it is impossible to set up the caster, they are slain.`,
        when: [HERO_PHASE],
      },
    ],
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
}

export default tagAs(EndlessSpells, 'endless_spell')
