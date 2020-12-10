import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, SAVES_PHASE } from 'types/phases'

const BonesplitterzSpells = {
  'Squiggly Curse': {
    effects: [
      {
        name: `Squiggly Curse`,
        desc: `Casting value of 6. Select a HERO within 3" and it suffers D3 mortal wounds. If you rolled a double to cast it then suffers D6 mortal wounds instead.

        If a model is slain by Squiggly Curse, you can add 1 to any further casting attempts made by the caster during the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Breath of Gorkamorka': {
    effects: [
      {
        name: `Breath of Gorkamorka`,
        desc: `Casting value of 6. Pick a Bonesplitterz unit within 24", that unit doubles how far it can move and can fly in your next movement phase. If casting roll was a double, triple how far the unit can move instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Brutal Beast Spirits': {
    effects: [
      {
        name: `Brutal Beast Spirits`,
        desc: `Casting value of 6. Pick a Bonesplitterz unit wholly within 24". Until your next hero phase, you can add 1 to all run, charge, and hit rolls made for that unit. If the casting roll was a double, you can select 2 different friendly Bonesplitterz units wholly within 24" of the caster to be affected by this spell instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bone Krusha': {
    effects: [
      {
        name: `Bone Krusha`,
        desc: `Casting value of 6. Pick an enemy unit within 24" that is visible to the caster.

          If target is within 6": Deal D6 mortal wounds.

          6" to 12" away: Deal D3 mortal wounds.

          More than 12" away: Deal 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Kunnin' Beast Spirits": {
    effects: [
      {
        name: `Kunnin' Beast Spirits`,
        desc: `Casting value of 6. Pick a unit wholly within 24". Add 1 to save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Kunnin' Beast Spirits`,
        desc: `If active, add 1 to save rolls for that unit until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Gorkamorka's War Cry": {
    effects: [
      {
        name: `Gorkamorka's War Cry`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18", that unit suffers D3 mortal wounds and must fight at the end of the combat phase in the next combat.`,
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
}

export default tagAs(BonesplitterzSpells, 'spell')
