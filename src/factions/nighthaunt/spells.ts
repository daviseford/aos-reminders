import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Soul Cage': {
    effects: [
      {
        name: `Soul Cage`,
        desc: `Casting value of 6 and a range of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. The strike-last effect applies to that unit until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Drain': {
    effects: [
      {
        name: `Spirit Drain`,
        desc: `Spirit Drain is a spell that has a casting value of 7 and a range of 18". If successfully cast, pick 1 enemy unit within range and visible to the caster. Roll a number of dice equal to the number of models in the target unit. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Lifestealer: {
    effects: [
      {
        name: `Lifestealer`,
        desc: `Lifestealer is a spell that has a casting value of 7 and arange of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. The target suffers D3 mortal wounds. You can heal 1 wound allocated to the caster for each mortal wound that was allocated (and not negated) by this spell`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Seal of Shyish': {
    effects: [
      {
        name: `Seal of Shyish`,
        desc: `Casting value of 5 and a range of 12". If successfully cast, pick 1 friendly NIGHTHAUNT unit wholly within range and visible to the caster. That unit has a ward of 5+ until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Reaping Scythe': {
  //   effects: [
  //     {
  //       name: `Reaping Scythe`,
  //       desc: `Casting value of 4. Pick one of the caster's weapons. Until the start of your next hero phase, you can reroll failed hit and wound rolls for attacks made with that weapon.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  Shademist: {
    effects: [
      {
        name: `Shademist`,
        desc: `Shademist is a spell that has a casting value of 6 and a range of 12". If successfully cast, pick 1 friendly NIGHTHAUNT unit wholly within range and visible to the caster. Subtract 1 from wound rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Tether': {
    effects: [
      {
        name: `Spectral Tether`,
        desc: `Spectral Tether is a spell that has a casting value of 4. If successfully cast, remove the caster from the battlefield and set it up again on the battlefield more than from all enemy units. The caster cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Grief-Stricken': {
  //   effects: [
  //     {
  //       name: `Grief-Stricken`,
  //       desc: `Casting value of 7. Pick an enemy unit that is within 18" of the caster and visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and add 1 to hit rolls for attacks made with melee weapons that target that unit.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // Wraithstorm: {
  //   effects: [
  //     {
  //       name: `Wraithstorm`,
  //       desc: `Casting value of 7. Pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If any models in that unit are slain as a result of this spell, that unit immediately suffers an additional D3 mortal wounds.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Spectral Lure': {
  //   effects: [
  //     {
  //       name: `Spectral Lure`,
  //       desc: `Casting value of 6. Pick a friendly SUMMONABLE NIGHTHAUNT unit wholly within 24" of the caster. You can either heal D6 wounds that have been allocated to that unit or, if no wounds have been allocated to the unit, you can return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D6.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Temporal Translocation': {
  //   effects: [
  //     {
  //       name: `Temporal Translocation`,
  //       desc: `Casting value of 6. Pick a friendly NIGHTHAUNT unit wholly within 24" of the caster. You can make a normal move up to 6" with that unit. If the unit retreats as a part of this move it can still charge later in the turn.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Howling Vortex': {
  //   effects: [
  //     {
  //       name: `Howling Vortex`,
  //       desc: `Casting value of 7. Pick a point on the battlefield within 18" of the caster that is visible to them, and roll 2D6 for each enemy unit within 6" of that point. If the roll is greater than the value of that unit's Move characteristic, or that roll is a double, that unit suffers 1 mortal wound and its Move characteristic is halved until the caster's next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Spells, 'spell')
