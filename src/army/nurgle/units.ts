import { getChaosSlaves } from 'utils/chaosUtils'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'
import { getEverchosenUnits } from 'army/everchosen/units'
import { MARK_NURGLE } from 'meta/alliances'
import BeastsofChaos from 'army/beasts_of_chaos'
import Skaven from 'army/skaven'
import { filterBattalions, filterUnits } from 'utils/filterUtils'
import { getTamurkhansUnits, getTamurkhansBattalions } from 'army/tamurkhans_horde/units'

const SlaveUnits = getChaosSlaves(MARK_NURGLE)

const getSkavenUnits = () => {
  const listOfUnits = [
    'Plagueclaw',
    'Plague Censer Bearers',
    'Plague Priest',
    'Plague Priest on Plague Furnace',
    'Plague Monks',
    'Verminlord Corruptor',
  ]
  return filterUnits(Skaven.Units, listOfUnits)
}

const getBoCUnits = () => {
  const listOfUnits = [
    'Beastlord',
    'Bestigors',
    'Bullgors',
    'Centigors',
    'Cygor',
    'Doombull',
    'Dragon Ogor Shaggoth',
    'Dragon Ogors',
    'Ghorgon',
    'Gors',
    'Great Bray-Shaman',
    'Tuskgor Chariots',
    'Ungor Raiders',
    'Ungors',
  ]
  return filterUnits(BeastsofChaos.Units, listOfUnits)
}

const getBoCBattalion = () => {
  const listOfBattalions = ['Pestilent Throng']
  return filterBattalions(BeastsofChaos.Battalions, listOfBattalions)
}

export const AlliedUnits: TUnits = [
  ...getTamurkhansUnits(),
  ...SlaveUnits,
  ...getBoCUnits(),
  ...getEverchosenUnits(),
  ...getSkavenUnits(),
]

// Unit Names
export const Units: TUnits = [
  {
    name: `Rotigus`,
    effects: [
      {
        name: `Blubber and Bile`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to Rotigus. On a 5+ the wound is negated, on a 6+ in the combat phase the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [DURING_GAME],
      },
      {
        name: `Corpulent Mass`,
        desc: `In your hero phase you can heal D3 wounds that have been allocated to Rotigus.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mountain of Loathsome Flesh`,
        desc: `Roll a D6 for each enemy unit within 1" of Rotigus after he completes a charge move. On a 4+ the enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Streams of Brackish Filth`,
        desc: `In your hero phase roll a D6 for each enemy unit that is within 6" of Rotigus. On a 4+ the enemy unit suffers D3 mortal wounds. Enemy units that can fly suffer D3 mortal wounds on a 6+ instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `Rotigus is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Deluge of Nurgle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deluge of Nurgle`,
        desc: `Casting value of 7. If successful roll 7 dice. For each roll that equals or beats the value from the damage table, pick a visible enemy unit and deal D3 mortal wounds to it. If more than one roll inflicts mortal wounds, you must pick a different enemy unit to suffer each set of mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Great Unclean One`,
    effects: [
      {
        name: `Blubber and Bile`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+ the wound is negated, on a 6+ in the combat phase the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [DURING_GAME],
      },
      {
        name: `Corpulent Mass`,
        desc: `In your hero phase you can heal D3 wounds that have been allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mountain of Loathsome Flesh`,
        desc: `Roll a D6 for each enemy unit within 1" of this model after it completes a charge move. On a 4+ the enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Putrid Offering`,
        desc: `If this model has a Bileblade and attempts to cast or unbind a spell, this model can suffer 1 mortal wound (cannot be negated) to add 1 to the cast or unbind.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reverberating Summons`,
        desc: `If a Nurgle unit begins its movement phase within 7" of any models with a Doomsday Bell, add 3 to its move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Grandfather's Joy`,
        desc: `Pick a friendly Nurgle Daemon unit within 21" of this model. Add 1 to the attacks characteristic of all melee weapons used by that unit until your next hero phase. You cannot pick the same unit to benefit from this ability more than once per hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Plague Wind.`,
        when: [HERO_PHASE],
      },
      {
        name: `Plague Wind`,
        desc: `Casting value of 7. If successful pick a point 14" from the caster and draw an imaginary straight line between the point and the closest part of the caster's base. Each unit (friend or foe) crossed by the center of the line suffers D3 mortal wounds. Nurgle units instead heal D3 wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Poxbringer, Herald of Nurgle`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `In Death There is Life`,
        desc: `At the start of your hero phase, if any models (friend or foe) were slain in the last turn, you can heal 1 wound allocated to a friendly Nurgle Daemon unit within 7" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell in the enemy hero phase. Knows Arcane Bolt, Mystic Shield, and Eruptive Infestation.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eruptive Infestation`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit that is within 7" of a friendly Plaguebearers unit and visible to the caster. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Epidemius, Tallyman of Nurgle`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Nurgle's Tallyman`,
        desc: `Keep a tally of the number of enemy models that have been slain by friendly Nurgle units during the battle. At the start of your hero phase, consult the table to check benefits to Nurgle units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Spoilpox Scrivener, Herald of Nurgle`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Keep Counting, I'm Watching You`,
        desc: `Re-roll dice rolls of 1 when making charge rolls for friendly Plaguebearers units while they are within 7" of this model. In addition, re-roll hit rolls of 1 for friendly Plaguebearers units while they are within 7" of this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Keep Counting, I'm Watching You`,
        desc: `Re-roll hit rolls of 1 for friendly Plaguebearers units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sloppity Bilepiper, Herald of Nurgle`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Disease of Mirth`,
        desc: `Add 1 to the bravery characteristic of friendly Nurgle Daemon units while they are within 7" of any Sloppity Bilepipers. In addition, subract 1 from the bravery characteristic of enemy units while they are within 7" of any Sloppity Bilepipers.`,
        when: [DURING_GAME],
      },
      {
        name: `Jolly Gutpiper`,
        desc: `Re-roll failed charge rolls and hit rolls of 1 friendly Nurglings and Great Unclean One units while they are within 7" of any Sloppity Bilepipers.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Horticulous Slimux`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Acidic Slime Trail`,
        desc: `Roll a D6 for each enemy unit within 3" of this model immediately before this model makes a retreat move. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Beast Handler`,
        desc: `Re-roll failed charge rolls of 1 for friendly Beasts of Nurgle units while they are within 7" of this model.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Beast Handler`,
        desc: `Re-roll failed hit rolls of 1 for friendly Beasts of Nurgle units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `In Death There is Life`,
        desc: `If any models (friend or foe) were slain in the last turn, you can heal 1 wound allocated to a friendly Nurgle Daemon unit within 7" of this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Cultivating the Garden of Nurgle`,
        desc: `Once during the battle, you can set up a Feculent Gnarlmaw within 3" of Horticulous Slimux, more that 3" from any other terrain feature, and more that 1" from any objectives.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Plaguebearers`,
    effects: [
      {
        name: `Plagueridden`,
        desc: `The leader of this unit is a Plagueridden, add 1 to the attacks characteristic of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearer`,
        desc: `Models in this unit can be Icon Bearers. If an unmodified roll of 1 is made for a battleshock test, no models feel. Instead D6 models are added to the unit (up to a total equal to the starting size of the unit).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Pipers`,
        desc: `Models in this unit can be Pipers. Re-roll battleshock tests of 1 for enemy units while they are within 6" of any Pipers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Cloud of Flies`,
        desc: `Subtract 1 from hit rolls targeting this unit in the shooting phase. If the unit contains 20 or more models subtract 2 from hit rolls in the shooting phase and 1 from hit rolls in the combat phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Locus of Fecundity`,
        desc: `Re-roll save rolls of 1 for this unit while it is within 7" of a Nurgle Daemon hero.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Plague Drones`,
    effects: [
      {
        name: `Plaguebringer`,
        desc: `The leader of this unit is a Plaguebringer. Add 1 to the attacks characteristic of a Plaguebringer's Plaguesword.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearer`,
        desc: `Models in this unit can be Icon Bearers. If an unmodified roll of 1 is made for a battleshock test, no models feel. Instead 1 model is added to the unit (up to a total equal to the starting size of the unit).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bell Tollers`,
        desc: `Models in this unit can be Bell Tollers. Re-roll battleshock tests of 1 for enemy units while they are within 6" of any Bell Tollers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Locus of Contagion`,
        desc: `Add 1 to the attacks characteristic of this unit's weapons while it is within 7" of a friendly Nurgle Daemon hero.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Beasts of Nurgle`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Acidic Slime Trail`,
        desc: `Roll a D6 for each enemy unit within 3" of this model immediately before this model makes a retreat move. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Attention Seekers`,
        desc: `This unit can charge in the same turn in which it ran or retreated.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Locus of Virulencce`,
        desc: `Add 1 to the damage characteristics of this units weapons while within 7" of a friendly Nurgle Daemon hero.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nurglings`,
    effects: [
      {
        name: `Disease Ridden Demise`,
        desc: `Roll a D6 for each enemy unit that was allocated any wounds caused by a unit of Nurglings in that combat phase. On a 2+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Endless Swarm`,
        desc: `Heal any wounds allocated to this unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Hidden Infestations`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is setup as a hidden infestation.`,
        when: [DURING_SETUP],
      },
      {
        name: `Hidden Infestations`,
        desc: `Set up any Nurglings using Hidden Infestations.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Glottkin`,
    effects: [
      {
        name: `Mountain of Loathsome Flesh`,
        desc: `Roll a D6 for each enemy unit within 1" of this model after it completes a charge move. On a 4+ the enemy unit suffers D3 mortal wounds. You cannot use this command ability more than once per hero phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Blessings of Nurgle`,
        desc: `You can heal D3 wounds that have been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Horrific Opponent`,
        desc: `Roll 2D6 for each enemy unit within 7" of this model. If the roll is greater than the unit's bravery characteristic, subtract 1 from hit rolls for that unit in the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells in your hero phase and attempt to unbind 1 spells. Knows Arcane Bolt, Mystic Shield, and Fleshy Abundance.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fleshy Abundance`,
        desc: `Casting value of 7. If successfully cast, pick a friendly unit within 14" that is visible to the caster. Add 1 to the wounds characteristic of all models in that unit until your next hero phase. Note this spell expiring can kill models with exisitng allocated wounds equal to or exceeding normal wounds characteristic.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Lord of Nurgle`,
        desc: `Until your next hero phase, all friendly Nurgle units within 14" of this model add 1 to their attacks characteristic of any of their melee weapons.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Orghotts Daemonspew`,
    effects: [
      {
        name: `Acid Ichor`,
        desc: `Roll a D6 for each time you allocate a wound to this model in the combat phase (and it is not negated). On a 4+ the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fury of the Halfblood`,
        desc: `Add D3 to the attacks characteristic of Orghotts Daemonspew's Rotaxes if he made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Rotaxes`,
        desc: `At the end of the combat phase, roll a D6 for each enemy model that was allocated any wounds caused by the Rotaxes. On a 4+ that model suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Fester and Rot`,
        desc: `Pick a friendly Nurgle unit within 14" of this model. Re-roll failed wound rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Bloab Rotspawned`,
    effects: [
      {
        name: `Daemon-flies`,
        desc: `Roll a D6 for each enemy unit within 7" of Bloab Rotspawned. On a 4+ subract 1 from the hit rolls for the unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Windspeaker Bells`,
        desc: `Subtract 1 from the casting rolls of enemy wizards while they are within 14" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Miasma of Pestilence.`,
        when: [HERO_PHASE],
      },
      {
        name: `Miasma of Pestilence`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 14" of the caster that is visible. Until your next hero phase, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to that unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Miasma of Pestilence`,
        desc: `If successfully cast earlier, roll a D6 at the end of each phase in which any wounds or mortal wounds were allocated to that unit and not negated. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [
          END_OF_HERO_PHASE,
          END_OF_MOVEMENT_PHASE,
          END_OF_CHARGE_PHASE,
          END_OF_COMBAT_PHASE,
          END_OF_BATTLESHOCK_PHASE,
        ],
      },
    ],
  },
  {
    name: `Morbidex Twiceborn`,
    effects: [
      {
        name: `Lord of Nurglings`,
        desc: `You can pick 1 friendly Nurglings unit within 7" of this model and add 1 model to it (up to a total equal to the starting size of the unit).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Malicious Mites`,
        desc: `Add 1 to the wound rolls for friendly Nurglings units while they are within 7" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Nurgle's Rot`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of any units with this ability. On a roll of a 6, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Repugnant Regrowth`,
        desc: `Roll a D6, on a 4+ heal 1 wound allocated to this model. Heal D3 on rolls of 6+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of Afflictions`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Rotten Regeneration`,
        desc: `You can heal 1 wound that has been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Plague Vector`,
        desc: `Re-roll hit rolls of 1 for friendly Rotbringer units while within 7" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Incubatch`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of this model. On a 2+ that unit suffers 1 mortal wound. Nurgle units instead suffer 1 mortal wound on a 6+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Virulent Discharge`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of any friendly units with this ability. On a 6+ that unit suffers D3 mortal wounds. If the unit has the Nurgle keyword, heal D3 wounds allocated instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spearhead of Contagion`,
        desc: `If this model is your general, you can pick a friendly Pusgoyle Blightlords unit within 14" and add 8" to that units move characteristic until your next hero phase. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Festus the Leechlord`,
    effects: [
      {
        name: `Healing Elixirs`,
        desc: `You can heal 1 wound that has been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Delightful Brews, Splendid Restoratives`,
        desc: `You can pick a unit (friend or foe) within 1" of this model. Pick a friendly or enemy unit and roll a D6. On a friendly unit, on a 2+ heal D3 wounds that have been allocated to that unit. On an enemy unit, on a 2+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Curse of the Leper.`,
        when: [HERO_PHASE],
      },
      {
        name: `Curse of the Leper`,
        desc: `Casting value of 7. If successfully cast, select a unit within 14" that is visible. Subtract 1 from the save rolls for that unit for the rest of the battle. This spell cannot be cast on the same enemy unit more that once per battle.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Harbinger of Decay`,
    effects: [
      {
        name: `Soulbound Shield`,
        desc: `Roll a D6 each time you allocate a wound to this model as a result of a spell. On a 4+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Rotsword`,
        desc: `Once per battle, pick an enemy hero within 1" of this model and roll a D6. On a 2+ that hero suffers D3 mortal wounds. On a 4+ that hero suffers D3 mortal wounds and each other enemy unit within 7" of that hero suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Morbid Vigour`,
        desc: `Until your next hero phase, roll a D6 each time you allocate a wound or mortal wound to a friendly Nurgle unit within 7" of this model. On a 5+ the wound is negated. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Sorcerer`,
    effects: [
      {
        name: `Blessed with Vitality`,
        desc: `Roll a D6 each time this model successfully casts a spell and it is not unbound. On a 4+ you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Stream of Corruption.`,
        when: [HERO_PHASE],
      },
      {
        name: `Stream of Corruption`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 7" and visible. That unit suffers 3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Lord of Blights`,
    effects: [
      {
        name: `Munificent Bounty`,
        desc: `You can pick 1 friendly unit of Putrid Blightkings that is within 3" of this model. That unit can shoot in the shooting phase using the Munificent Bounty Death's Head missle weapon.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Vermid Shield`,
        desc: `Re-roll save rolls of 1 for this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plague of Flies`,
        desc: `Pick a friendly Nurgle unit within 21" of this model. Until your next hero phase, subtract 1 from the hit rolls of attacks that target that unit in the shooting phase. If the unit contains 20 or more models, subtract 2 from the hit rolls of attacks that target the unit in the shooting phase and 1 from the hit rolls of attacks that target the unit in the combat phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Plague of Flies`,
        desc: `If this ability had been activated, subtract 1 from the hit rolls of attacks targeting the buffed unit.

               If the unit contains 20 or more models, subtract 2 from the hit rolls of attacks targeting the buffed unit.

               The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Plague of Flies`,
        desc: `If this ability had been activated and buffed unit contains 20 or more models, subtract 1 from the hit rolls of attacks on the buffed unit. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gutrot Spume`,
    effects: [
      {
        name: `Clutching Pseudopods`,
        desc: `You can pick an enemy model within 1" of this model. Choose a weapon carried by the target and roll a D6. On a 4+ that weapon cannot be used in the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Towering Arrogance`,
        desc: `Re-roll hit rolls of 1 for this model is the target is a hero. In addition, if this model is within 3" of an enemy hero in the combat phase, he cannot target units that are not heros.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `Instead of placing this model on the battlefield you can set it and unit of Putrid Blightkings up aboard his flagship. This counts as a single set up.`,
        when: [DURING_SETUP],
      },
      {
        name: `Master of the Slime Fleet`,
        desc: `Set up this model and the unit of Putrid Blightkings within 6" of each other, wholly within 6" of the edge of the battlefield and more than 9" from any enemy models.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Lord of Plagues`,
    effects: [
      {
        name: `Wanton Slaughter`,
        desc: `Re-roll hit rolls of 1 for friendly Putrid Blightking units while they are within 7" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Rotten Corpse Mulch`,
        desc: `Roll a D6 after this model makes its attacks. Add the number of wounds inflicted by this model (and which were not saved or negated) to the dice roll. If the total is a 7+ you immediately receive 1 contagion point.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Plague-ridden Great Weapons`,
        desc: `Each time you make a hit roll of 6+ for this model's Plague-ridden Great Blade, that hit roll inflicts D6 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grandfather's Gift`,
        desc: `Pick an enemy unit within 21" of this model. Roll 7 dice. Each 6+ causes the target to suffer 1 mortal wound.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Putrid Blightkings`,
    effects: [
      {
        name: `Blightlord`,
        desc: `The leader of this unit is a Blightlord. Add one to the wound characteristic the Blightlord model.`,
        when: [DURING_GAME],
      },
      {
        name: `Icon Bearers`,
        desc: `Add 1 to this units bravery characteristic while it includes any Icon Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Sonorous Tocsin`,
        desc: `Add 1 to this unit's run and charge rolls while it includes any models carrying a Sonorous Tocsin.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Virulent Discharge`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of any friendly units with this ability. On a 6+ that unit suffers D3 mortal wounds. If the unit has the Nurgle keyword, heal D3 wounds allocated instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blighted Weapons`,
        desc: `Each time you make a hit roll of 6+ for this unit's Blighted Weapons, that hit roll inflicts D6 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pusgoyle Blightlords`,
    effects: [
      {
        name: `Disgustingly Resilient`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 5+ the wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Virulent Discharge`,
        desc: `Roll a D6 for each unit (friend or foe) within 3" of any friendly units with this ability. On a 6+ that unit suffers D3 mortal wounds. If the unit has the Nurgle keyword, heal D3 wounds allocated instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blighted Weapons`,
        desc: `Each time you make a hit roll of 6+ for this unit's Blighted Weapons, that hit roll inflicts D6 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Greater Daemon Of Nurgle`,
    effects: [
      {
        name: `Blubber and Bile`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated. In addition, on a 6, if the attacking unit is within 3" of this model, it suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
      {
        name: `Corpulent Mass`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mountain of Loathsome Flesh`,
        desc: `Roll 1 dice for each enemy unit that is within 1" of this model after this model completes a charge move. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Magic`,
        desc: `An Exalted Greater Daemon of Nurgle is a Wizard. It can attempt to cast two spells in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Plague Wind spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Plague Wind`,
        desc: `Casting value of 7. If successful pick a point 14" from the caster and draw an imaginary straight line between the point and the closest part of the caster's base. Each unit (friend or foe) crossed by the center of the line suffers D3 mortal wounds. Nurgle units instead heal D3 wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Grandfather's Exalted Joy`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Nurgle Daemon unit wholly within 28" of a friendly model with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons until your next hero phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Battalions
export const NurgleBattalions: TBattalions = [
  {
    name: `The Munificent Wanderers`,
    effects: [
      {
        name: `Infested with Foul Gifts`,
        desc: `In the Rampant Disease stage of the Cycle of Corruption, enemy units that are affected by Rampant Disease that are within 14" of a unit from this battalion suffer D6 mortal wounds instead of D3. In addition if the Great Unclean One is on the battlefield during the Rampant Disease stage of the Cycle, then D6 enemy units are affected by the Rampant disease instead of D3.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Tallyband of Nurgle`,
    effects: [
      {
        name: `Droning Masses`,
        desc: `Each unit in this battalion heals 1 wound that has been allocated to it. For units of Plaguebearers, return D3 slain models to each unit instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Disease and Pestilence Personified`,
        desc: `If the number of Plaguebearer units + the number of Plague Drone units = 7, you receive 1 extra contagion point in each of your hero phases.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Thricefold Befoulment`,
    effects: [
      {
        name: `Hungry for the Plague God's Praise`,
        desc: `Re-roll hit rolls of 1 for models from this battalion while they are within 14" of another model from this battalion. In addition, re-roll wound rolls of 1 for models from this battalion while they are within 14" of two other models from this battalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Plague Storm of Nurgle`,
        desc: `If a model from this battalion successfully casts the Plague Wind spell when it is within 7" of another model from this battalion, then the number of mortal wounds inflicted by the spell is increased from D3 to 2D3. If the caster is within 7" of two other models from this battalion, then the number of mortal wounds inflicted is increased to 3D3 instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Nurgle's Menagerie`,
    effects: [
      {
        name: `Assistant Gardeners`,
        desc: `Horticulous Slimux can use his Cultivating the Garden of Nurgle ability in each of your hero phases instead of only once per battle. In addition, when he does so, the Feculent Gnarlmaw can be set up within 3" of any unit from this battalion instead of being set up within 3" of Horticulous.`,
        when: [HERO_PHASE],
      },
      {
        name: `Utterly Revolting Horde`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 14" of 7 or more models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Blessed Sons`,
    effects: [
      {
        name: `Swollen with Pride`,
        desc: `Units in this battalion do not have to take battleshock tests while they have 7 or more models.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Blessed Blightplate`,
        desc: `Re-roll saves rolls of 1 for models in this battalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Plague Cyst`,
    effects: [
      {
        name: `Master of Slaughter`,
        desc: `Re-roll all failed hit rolls for units from this battalion that are affected by the Wanton Slaughter ability of this battalion's Lord of Plagues, instead of only re-rolling hit rolls of 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Horribly Contagious`,
        desc: `Roll a D6 for each enemy unit within 3" of any units from this battalion. On a 6+ the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blight Cyst`,
    effects: [
      {
        name: `Endless Bounty`,
        desc: `The Munificent Bounty ability from this battalion's Lord of Blights affects all units from this battalion that are within 3" of him instead of only one unit.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Supremely Blighted Weapons`,
        desc: `The Blighted Weapons used by the Putrid Blightkings in this battalion have a Rend characteristic of '-1'.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blights on the Landscape`,
        desc: `Enemy units do not receive any benefits for being in cover against attacks made by this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Affliction Cyst`,
    effects: [
      {
        name: `The Droning Sky`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and set up as hovering the skies. You can do this with as many units from the battalion as you wish.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Droning Sky`,
        desc: `Set up each unit hovering in the skies more than 9" from any enemy models.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Diseased Onslaught`,
        desc: `If the Lord of Afflictions from this battalion uses his Spearhead of Contagion command ability, it affects all units from this battalion that are within 14" of him instead of only one unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Combine lists together to make army battalion entry.
export const Battalions: TBattalions = [
  ...NurgleBattalions,
  ...getBoCBattalion(),
  ...getTamurkhansBattalions(),
]
