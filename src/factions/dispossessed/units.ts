import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'

const ThrongMusiciansAndStandardBearerEffects = [
  {
    name: `Throng Musician`,
    desc: `When a unit containing any Hornblowers or Drummers runs, they can 'Sound the Advance'. If they do so, do not roll a D6 to see how far the unit runs; instead, they can move up to an extra 4".`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Standard Bearer`,
    desc: `If you fail a battleshock test for a unit that has any Standard Bearers, halve the number of models that flee (rounding up).`,
    when: [BATTLESHOCK_PHASE],
  },
]
const RunicIconAndClanBannerEffects = [
  {
    name: `Runic Icon`,
    desc: `Roll a D6 if an enemy spell affects a unit with any Runic Icons. On a roll of 5 or more, that spell has no effect on the unit (but it will affect other units normally).`,
    when: [HERO_PHASE],
  },
  {
    name: `Clan Banner`,
    desc: `If you fail a battleshock test for a unit that has any Clan Banners, halve the number of models that flee (rounding up).`,
    when: [BATTLESHOCK_PHASE],
  },
]
const GromrilShieldsEffects = [
  {
    name: `Gromril Shields`,
    desc: `This unit can create a shield wall instead of running or charging in its turn. If it does so, reroll all failed save rolls for the unit in the combat phase until its next movement phase.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Gromril Shields`,
    desc: `If active, reroll all failed save rolls for the unit in the combat phase until its next movement phase.`,
    when: [SAVES_PHASE],
  },
]
const HornblowersEffect = {
  name: `Hornblowers`,
  desc: `When a unit containing any Hornblowers runs, they can 'Sound the Advance'. If they do so, do not roll a D6 to see how far the unit runs; instead, they can move up to an extra 4".`,
  when: [MOVEMENT_PHASE],
}
const DrummersEffect = {
  name: `Drummers`,
  desc: `When a unit containing any Drummers runs, they can 'Sound the Advance'. If they do so, do not roll a D6 to see how far the unit runs; instead, they can move up to an extra 4".`,
  when: [MOVEMENT_PHASE],
}
const DuardinBucklersEffects = [
  {
    name: `Duardin Bucklers`,
    desc: `If a unit is equipped with Duardin Bucklers, it can create a shield wall instead of running or charging in its turn. If it does so, reroll all failed save rolls for the unit in the combat phase until its next movement phase.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Duardin Bucklers`,
    desc: `If active, reroll all failed save rolls for the unit in the combat phase until its next movement phase.`,
    when: [SAVES_PHASE],
  },
]
const IconBearerEffect = {
  name: `Icon Bearer`,
  desc: `Roll a D6 if an enemy spell affects a unit with any Icon Bearers. On a roll of 5 or more, that spell has no effect on the unit (but it will affect other units normally).`,
  when: [HERO_PHASE],
}
const ForgeProvenGromrilArmorEffect = {
  name: `Forge-proven Gromril Armour`,
  desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
  when: [SAVES_PHASE],
}
const CinderblastBombEffect = {
  name: `Cinderblast Bomb`,
  desc: `Once per battle, a model with a Cinderblast Bomb can throw it in your shooting phase. To do so pick a unit within 6" and roll a D6; on a 2 or more, that unit suffers D3 mortal wounds.`,
  when: [SHOOTING_PHASE],
}

const Units = {
  'Warden King': {
    mandatory: { command_abilities: [keyPicker(command_abilities, ['Ancestral Grudge'])] },
    effects: [
      {
        name: `Ancestor Shield`,
        desc: `You can reroll all failed saves for a Warden King.`,
        when: [DURING_GAME],
      },
      {
        name: `Oath Stone`,
        desc: `In the hero phase, a Warden King can use this ability. If he does so, he cannot move until his next hero phase, but all DISPOSSESSED units from your army within 18" in the battleshock phase may use the Warden King's Bravery instead of their own.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Runelord: {
    effects: [
      {
        name: `Runes of Spellbreaking`,
        desc: `A Runelord can attempt to unbind one enemy spell in the enemy hero phase as if he were a wizard. You can add 2 to any unbinding rolls for a Runelord.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune Lore`,
        desc: `In your hero phase a Runelord can use this ability. If he does so, pick a DISPOSSESSED unit within 16", select a power and roll a D6; on a 1 the Runelord has failed and nothing happens. On a roll of 2 or more the runes hammered into his allies' wargear glow white-hot with rune magic and the power takes effect.

        Ancestral Shield: Until your next hero phase, you can roll a D6 whenever a model in this unit suffers a wound or a mortal wound. On a 6, that wound or mortal wound is ignored.

        Forgefire: Until your next hero phase, increase the Rend characteristics of the unit's weapons by 1 (i.e. '-' becomes -1, -1 becomes -2 and so on).`,
        when: [HERO_PHASE],
      },
    ],
  },
  Unforged: {
    effects: [
      {
        name: `Runic Axes`,
        desc: `You can reroll all hit rolls of 1 for an Unforged.`,
        when: [DURING_GAME],
      },
      {
        name: `Epic Deathblow`,
        desc: `If an Unforged is slain in the combat phase, roll a D6 before it is removed. On a roll of 4 or more, you can inflict D3 mortal wounds on the enemy unit that struck the fatal blow (inflict D6 mortal wounds instead if a Chaos model struck the final blow).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Nemesis`,
        desc: `Attacks made by an Unforged inflict double Damage against CHAOS units.`,
        when: [DURING_GAME],
      },
      {
        name: `The Bigger They Are...`,
        desc: `You can add 1 to any wound rolls for an Unforged if the target of the attack has a Wounds characteristic of more than 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Hammerers: {
    effects: [
      ...ThrongMusiciansAndStandardBearerEffects,
      {
        name: `Kingsguard`,
        desc: `You do not need to take battleshock tests for this unit if it is within 16" of a DISPOSSESSED HERO from your army in the battleshock phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Ironbreakers: {
    effects: [
      IconBearerEffect,
      DrummersEffect,
      CinderblastBombEffect,
      ...GromrilShieldsEffects,
      ForgeProvenGromrilArmorEffect,
    ],
  },
  Irondrakes: {
    effects: [
      IconBearerEffect,
      HornblowersEffect,
      ForgeProvenGromrilArmorEffect,
      {
        name: `Grudgehammer Torpedo`,
        desc: `A Grudgehammer Torpedo inflicts D6 Damage instead of D3 if the target has the MONSTER keyword.`,
        when: [SHOOTING_PHASE],
      },
      CinderblastBombEffect,
      {
        name: `Blaze Away`,
        desc: `You can add 1 to the Attacks characteristic of this unit's missile weapons if it has at least 10 models and is more than 3" from of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Longbeards: {
    effects: [
      ...ThrongMusiciansAndStandardBearerEffects,
      ...GromrilShieldsEffects,
      {
        name: `Old Grumblers`,
        desc: `In your hero phase, pick one of the grumblings listed below. The effects last until your next hero phase.

        "I thought duardin were made of sterner stuff!": Roll a D6 each time a DISPOSSESSED model from your army flees whilst within 8" of this unit; on a 5 or more that model stands firm under the Longbeards' stern gaze and does not flee.

        "Who does this beardling think he is?": Friendly DISPOSSESSED HEROES within 8" of this unit are treated as if they were your general when working out the range of command abilities.

        "Grots are weedier these days!": You can reroll wound rolls of 1 for DISPOSSESSED models from your army that are within 8" of this unit when they attack in the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Quarrellers: {
    effects: [
      DrummersEffect,
      ...RunicIconAndClanBannerEffects,
      {
        name: `Volley Fire`,
        desc: `You can add 1 to the Attacks characteristic of this unit's missile weapons if it has at least 20 models and is more than 3" from any enemy units.`,
        when: [SHOOTING_PHASE],
      },
      ...DuardinBucklersEffects,
    ],
  },
  Thunderers: {
    effects: [
      DrummersEffect,
      ...RunicIconAndClanBannerEffects,
      {
        name: `Precision Fire`,
        desc: `You can add 1 to all hit rolls for a Thunderer if its unit has 20 or more models and there are no enemy models within 3".`,
        when: [SHOOTING_PHASE],
      },
      ...DuardinBucklersEffects,
    ],
  },
  Warriors: {
    effects: [
      HornblowersEffect,
      ...RunicIconAndClanBannerEffects,
      {
        name: `Resolute in Defence`,
        desc: `You can reroll failed wound rolls of 1 when attacking with a Warrior in your opponent's combat phase. You can instead reroll all failed wound rolls for a Warrior if its unit has 20 or more models when it attacks in your opponent's combat phase.`,
        when: [COMBAT_PHASE],
      },
      ...DuardinBucklersEffects,
    ],
  },
}

export default tagAs(Units, 'unit')
