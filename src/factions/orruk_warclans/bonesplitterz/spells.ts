import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const BonesplitterzSpells = {
  'Squiggly Curse': {
    effects: [
      {
        name: `Squiggly Curse`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy HERO within 3" of the caster. That HERO suffers D3 mortal wounds. If that HERO is slain by those mortal wounds, you can add 1 to casting rolls for the caster for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Glowy Green Tusks': {
    effects: [
      {
        name: `Glowy Green Tusks`,
        desc: `Casting value of 5 and a range of 18'. If successfully cast, pick 1 friendly BONESPLITTERZ unit wholly within range and visible to the caster. Until the start of your next hero phase, improve the Rend characteristic of weapons used by that unit's mounts by 2.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Gorkamorka's War Cry": {
    effects: [
      {
        name: `Gorkamorka's War Cry`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. In the following combat phase, that unit can only be picked to fight at the end of that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Power of the Were-boar': {
    effects: [
      {
        name: `Power of the Were-boar`,
        desc: `Power of the Were-boar is a spell that has a casting value of 6 and a range of 24". If successfully pick 1 friendly BONESPLITTERZ unit wholly within range and visible to the caster. Until your next hero phase, add 1 to run rolls and charge rolls for that unit, and add 1 to hit rolls for attacks made by that unit, but that unit cannot shoot.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bone Spirit': {
    effects: [
      {
        name: `Bone Spirit`,
        desc: `Casting value of 7. Pick 1 friendly BONESPLITTERZ unit wholly within 12" of the caster and visible to them. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fireball!': {
    effects: [
      {
        name: `Fireball!`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18". It suffers 1 mortal wound if it has 1 model, D3 mortal wounds instead if it has 2-9 models, or D6 mortal wounds instead if it has 10+ models.`,
        when: [HERO_PHASE],
      },
    ],
  }, 
  'Fists of Gork': {
    effects: [
      {
        name: `Fists of Gork`,
        desc: `Casting value of 5. Pick 1 enemy unit within 24" of the caster that is visible to them, and roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound. If the casting roll was 10+, inflict 1 mortal wound for each 4+ instead of each 6.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Seem to have been removed in Orruk Warclans 2021 battletome
  // 'Breath of Gorkamorka': {
  //   effects: [
  //     {
  //       name: `Breath of Gorkamorka`,
  //       desc: `Casting value of 6. Pick a BONESPLITTERZ unit wholly within 24", that unit doubles how far it can move and can fly in your next movement phase. If casting roll was a double, triple how far the unit can move instead.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Brutal Beast Spirits': {
  //   effects: [
  //     {
  //       name: `Brutal Beast Spirits`,
  //       desc: `Casting value of 6. Pick a BONESPLITTERZ unit wholly within 24". Until your next hero phase, you can add 1 to all run, charge, and hit rolls made for that unit. If the casting roll was a double, you can pick 2 different friendly BONESPLITTERZ units wholly within 24" of the caster to be affected by this spell instead of 1.`,
  //       when: [HERO_PHASE],
  //       rule_sources: [rule_sources.BATTLETOME_ORRUK_WARCLANS, rule_sources.ERRATA_ORRUK_WARCLANS_JULY_2021],
  //     },
  //   ],
  // },
  // 'Bone Krusha': {
  //   effects: [
  //     {
  //       name: `Bone Krusha`,
  //       desc: `Casting value of 6. Pick an enemy unit within 24" that is visible to the caster.

  //         If target is within 6": Deal D6 mortal wounds.

  //         6" to 12" away: Deal D3 mortal wounds.

  //         More than 12" away: Deal 1 mortal wound.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // "Kunnin' Beast Spirits": {
  //   effects: [
  //     {
  //       name: `Kunnin' Beast Spirits`,
  //       desc: `Casting value of 6. Pick a unit wholly within 24". Add 1 to save rolls for that unit until your next hero phase.`,
  //       when: [HERO_PHASE],
  //     },
  //     {
  //       name: `Kunnin' Beast Spirits`,
  //       desc: `If active, add 1 to save rolls for that unit until your next hero phase.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(BonesplitterzSpells, 'spell')
