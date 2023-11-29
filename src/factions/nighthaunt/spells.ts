import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Soul Cage': {
    effects: [
      {
        name: `Soul Cage`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster. The strike-last effect applies to that unit until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Drain': {
    effects: [
      {
        name: `Spirit Drain`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in the target unit. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Lifestealer: {
    effects: [
      {
        name: `Lifestealer`,
        desc: `Casting value of 7 and arange of 12". Pick 1 enemy unit within range and visible to the caster. The target suffers D3 mortal wounds. You can heal 1 wound allocated to the caster for each mortal wound that was allocated (and not negated) by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Seal of Shyish': {
    effects: [
      {
        name: `Seal of Shyish`,
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly NIGHTHAUNT unit wholly within range and visible to the caster. That unit has a ward of 5+ until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Shademist: {
    effects: [
      {
        name: `Shademist`,
        desc: `Casting value of 6 and a range of 12". Pick 1 friendly NIGHTHAUNT unit wholly within range and visible to the caster. Subtract 1 from wound rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Tether': {
    effects: [
      {
        name: `Spectral Tether`,
        desc: `Casting value of 4. If successfully cast, remove the caster from the battlefield and set it up again on the battlefield more than from all enemy units. The caster cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Grief-Stricken': {
    effects: [
      {
        name: `Grief-Stricken`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Subtract 1 from hit rolls for attacks made by that unit and add 1 to hit rolls for attacks made with melee weapons by friendly Nighthaunt units that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Wraithstorm: {
    effects: [
      {
        name: `Wraithstorm`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. If any models in that unit are slain as a result of this spell, that unit immediately suffers an additional D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Lure': {
    effects: [
      {
        name: `Spectral Lure`,
        desc: `Casting value of 6 and a range of 24". Pick 1 friendly Nighthaunt Summonable unit wholly within range and visible to the caster. You can heal up to D6 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of D6 or less.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hand of Dust': {
    effects: [
      {
        name: `Hand of Dust`,
        desc: `Casting value of 8 and a range of 3". Pick 1 enemy model within range and visible to the caster. Then, take a dice and hide it in one of your hands or under one of two appropriate containers. Your opponent must pick one of your hands or containers. If they pick the one holding the dice, the spell has no effect. If they pick the empty hand or container, the enemy model is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Stealer': {
    effects: [
      {
        name: `Soul Stealer`,
        desc: `Casting value of 7 and a range of 24". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. If the unmodified casting roll for this spell is 9+ and this spell is not unbound, that unit suffers D6 mortal wounds instead of D3. You can heal up to 1 wound that has been allocated to the caster for each mortal wound caused by this spell that is not negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Howling Vortex': {
    effects: [
      {
        name: `Howling Vortex`,
        desc: `Casting value of 7 and a range of 18". Pick a point on the battlefield within range and visible to the caster. Then, roll 2D6 for each enemy unit within 6" of that point. If the roll is greater than that unit's unmodified Move characteristic, or the roll is a double, that unit suffers 1 mortal wound and its Move characteristic is halved until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Spells, 'spell')
