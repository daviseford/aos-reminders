import { filterUnits } from 'utils/filterUtils'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
  START_OF_TURN,
  CHARGE_PHASE,
} from 'types/phases'

/**
 * Exporting Nighthaunt units per LoN FAQ
 */
export const getNighthauntUnits = () => {
  const listOfUnits = [
    `Cairn Wraith`,
    `Chainrasp Horde`,
    `Glaivewraith Stalkers`,
    `Grimghast Reapers`,
    `Guardian of Souls`,
    `Guardian of Souls w/ Mortality Glass`,
    `Hexwraiths`,
    `Knight of Shrouds on Ethereal Steed`,
    `Knight of Shrouds`,
    `Lord Executioner`,
    `Spirit Hosts`,
    `Spirit Torment`,
    `Tomb Banshee`,
  ]
  return filterUnits(Units, listOfUnits)
}

const Ethereal = [
  {
    name: `Ethereal`,
    desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this model.`,
    when: [DURING_GAME],
  },
]

// Unit Names
export const Units: TUnits = [
  {
    name: `Lady Olynder, Mortarch of Grief`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with the Banshee Handmaidens' Spectral Claws is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grave-sands of Time`,
        desc: `Once per battle, in your hero phase, you can choose either to inflict D6 mortal wounds on an enemy HERO within 6" of this model, or heal D6 wounds that have been allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lifting the Veil`,
        desc: `At the start of your hero phase, pick an enemy unit within 12" of this model that is visible to her and roll a D6. On a 1, nothing happens. On a 2+, that unit suffers a number of mortal wounds equal to the roll. In addition, if any enemy models are slain by this ability, immediately heal D3 wounds that have been allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Mortarch of Grief`,
        desc: `Add 1 to the number of models that flee from enemy units that fail a battleshock test while they are within 12" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Wail of the Damned`,
        desc: `At the start of your shooting phase, roll 2D6 for each enemy unit within 10" of this model. If the roll for the unit is higher than its Bravery characteristic, it suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `No Rest For the Wicked`,
        desc: `You can use this command ability in your hero phase if this model is your general and is on the battlefield. If you do so, you can return 1 slain model to each friendly SUMMONABLE NIGHTHAUNT unit that is within 12" of a friendly model with this command ability.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Magic`,
        desc: `Lady Olynder is a WIZARD. She can attempt to cast two different spells in each of your hero phases, and attempt to unbind two spells in each enemy hero phase. She knows the Arcane Bolt, Mystic Shield and Grief-stricken spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grief Stricken`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit that is within 18" of the caster and visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and add 1 to hit rolls for attacks made with melee weapons that target that unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Kurdoss Valentian, the Craven King`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with the Wraith Heralds' Spectral Claws is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `If I Cannot Rule, None Shall Rule!`,
        desc: `At the start of the enemy hero phase, after the opposing player receives their command point for that turn, roll a D6. On a 5+, subtract 1 from the enemy player's command points, to a minimum of 0, and you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Soul-crushing Smite`,
        desc: `If the unmodified wound roll for an attack made with the Sepulchral Sceptre is 6, that attack has a Damage characteristic of D6 instead of D3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Suffer No Rival`,
        desc: `You can re-roll failed hit rolls for attacks made with the Sepulchral Sceptre if the target is an enemy general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Reikenor the Grimhailer`,
    effects: [
      ...Ethereal,
      {
        name: `Corpse Candles`,
        desc: `In your hero phase, before this model attempts to cast a spell, you can say that it will snuff out a corpse candle. If you do so, pick either this model or an enemy model within 12" of this model. That model suffers 1 mortal wound. If the mortal wound was suffered by an enemy model, add 1 to the casting roll; if the mortal wound was suffered by this model, add 3 to the casting roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with Fellreaper is 6, that attack inflicts 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `You can re-roll failed hit rolls for attacks made with Fellreaper if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `Reikenor the Grimhailer is a WIZARD. He can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Wraithstorm spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wraithstorm`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If any models in that unit are slain as a result of this spell, that unit immediately suffers an additional D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Knight of Shrouds`,
    effects: [
      ...Ethereal,
      {
        name: `Stolen Hours`,
        desc: `Each time a wound inflicted by this model's Sword of Stolen Hours slays an enemy HERO, heal 1 wound allocated to this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spectral Overseer`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Add 1 to hit rolls for friendly NIGHTHAUNT units while they are wholly within 12" of that model in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Knight of Shrouds on Ethereal Steed`,
    effects: [
      ...Ethereal,
      {
        name: `Stolen Hours`,
        desc: `Each time a wound inflicted by this model's Sword of Stolen Hours slays an enemy HERO, heal 1 wound allocated to this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of Gheists`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly NIGHTHAUNT unit that is wholly within 18" of a friendly model with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons in that combat phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Guardian of Souls`,
    effects: [
      ...Ethereal,
      {
        name: `Nightmare Lantern`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons used by friendly NIGHTHAUNT units that are wholly within 12" of this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Spectral Lure spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spectral Lure`,
        desc: `Casting value of 6. If successfully cast, pick a friendly SUMMONABLE NIGHTHAUNT unit wholly within 24" of the caster. You can either heal D6 wounds that have been allocated to that unit or, if no wounds have been allocated to the unit, you can return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D6.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Guardian of Souls w/ Mortality Glass`,
    effects: [
      ...Ethereal,
      {
        name: `Mortality Glass`,
        desc: `When enemy units within 9" of this model charge, roll a D6 instead of 2D6 when determining the distance they can move.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Temporal Translocation spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Temporal Translocation`,
        desc: `Casting value of 6. If successfully cast, pick a friendly NIGHTHAUNT unit wholly within 24" of the caster. You can make a normal move up to 6" with that unit. If the unit retreats as a part of this move it can still charge later in the turn.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Spirit Torment`,
    effects: [
      ...Ethereal,
      {
        name: `Nagash's Bidding`,
        desc: `You can re-roll hit rolls of 1 for friendly NIGHTHAUNT units while they are wholly within 12" of any friendly SPIRIT TORMENTS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Captured Soul Energy`,
        desc: `At the start of the battleshock phase, if 3 or more enemy models were slain that turn, pick a friendly NIGHTHAUNT unit within 6" of this model and heal D3 wounds that have been allocated to that unit. If 3 or more enemy STORMCAST ETERNAL models were slain that turn, heal 3 wounds instead of D3 wounds.

        Alternatively, instead of healing the unit you picked, if models from that unit have been slain, you can return them to the unit. Roll a D3; you can return any slain models to that unit that have a combined Wounds characteristic of less than or equal to the number you rolled.

        If your army includes more than one SPIRIT TORMENT, at least 3 enemy models must have been slain during the turn for each SPIRIT TORMENT that uses this ability, and no SPIRIT TORMENT can use this ability more than once in the same battleshock phase.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Chainghasts`,
    effects: [
      ...Ethereal,
      {
        name: `Another Link in the Chain`,
        desc: `While this unit is wholly within 12" of a friendly SPIRIT TORMENT, you can re-roll hit rolls of 1 for friendly NIGHTHAUNT units while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `The Attacks characteristic of the Ghastflails melee weapon is equal to the number of enemy models within 2" of the attacking model when the number of attacks made with the weapon is determined.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dreadblade Harrow`,
    effects: [
      ...Ethereal,
      {
        name: `Phantasmal Discorporation`,
        desc: `If this model is more than 3" from any enemy models at the start of your movement phase, instead of making a normal move, you can remove it from the battlefield and then set it up anywhere on the battlefield more than 9" from any enemy models.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Dreadblade`,
        desc: `Add 1 to the Damage characteristic of this model's Dreadblade if it made a charge move in the same turn. Add 1 to the Attacks characteristic of this model's Dreadblade if it did not make a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Curse of Loyalty`,
        desc: `Re-roll wound rolls of 1 for attacks made with this model's Dreadblade while it is within 9" of a friendly KNIGHT OF SHROUDS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord Executioner`,
    effects: [
      ...Ethereal,
      {
        name: `Beheading Strike`,
        desc: `If the unmodified wound roll for an attack made with a Decapitating Greataxe is 6, add 2 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Staring Death in the Face`,
        desc: `At the start of a combat phase, you can pick an enemy HERO within 3" of this model. Subtract 1 from hit rolls for attacks made by that HERO in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Disembodied Skulls`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 5+, the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tomb Banshee`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with a Chill Dagger is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghostly Howl`,
        desc: `At the start of your shooting phase, pick an enemy unit within 10" of this model and roll 2D6. If the roll is higher than the unit's Bravery characteristic, it suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the roll.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cairn Wraith`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with a Reaper Scythe is 6, that attack inflicts 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `You can re-roll failed hit rolls for attacks made with a Reaper Scythe if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mourngul`,
    effects: [
      ...Ethereal,
      {
        name: `Devourer of Flesh and Souls`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with this model's Nightmarish Claws and Fangs is 6, that attack inflicts 2 mortal wounds and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghastly Apparition`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models while they are within 6" of any friendly models with this ability.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glaivewraith Stalkers`,
    effects: [
      ...Ethereal,
      {
        name: `Deathbeat Drummer`,
        desc: `Models in this unit can be Deathbeat Drummers. A unit that includes any Deathbeat Drummers can retreat and charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `The Point of Death`,
        desc: `You can re-roll failed hit rolls for attacks made with this unit's Hunter's Glaives if this unit or the target unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grimghast Reapers`,
    effects: [
      ...Ethereal,
      {
        name: `Reaped Like Corn`,
        desc: `You can re-roll failed hit rolls for attacks made with this unit's Slasher Scythes if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `For Whom the Bell Tolls`,
        desc: `Allocate wounds inflicted by a Death Knell after allocating wounds inflicted by Slasher Scythes. For each enemy model that is slain by wounds inflicted by a Death Knell, you can inflict 1 mortal wound on an enemy unit within 3" of the model armed with the Death Knell.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chainrasp Horde`,
    effects: [
      ...Ethereal,
      {
        name: `Dreadwarden`,
        desc: `The leader of this unit is a Dreadwarden. Add 1 to the Attacks characteristic of a Dreadwarden's Malignant Weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Dreadwarden`,
        desc: `The leader of this unit is a Dreadwarden. A Chainrasp Horde has a Bravery characteristic of 10 instead of 6 while it includes a Dreadwarden.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Chilling Horde`,
        desc: `You can re-roll wound rolls of 1 for this unit while it has more than 10 models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bladegheist Revenants`,
    effects: [
      ...Ethereal,
      {
        name: `Fearful Frenzy`,
        desc: `You can re-roll failed hit rolls for attacks made by this unit if it is wholly within 12" of any friendly SPIRIT TORMENTS or CHAINGHASTS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Whirling Death`,
        desc: `Add 1 to the Attacks characteristic of this unit's Tomb Greatblades if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Whirling Death`,
        desc: `This unit can retreat and charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Myrmourn Banshees`,
    effects: [
      ...Ethereal,
      {
        name: `Spell-eaters`,
        desc: `Once in each enemy hero phase, if this unit is within 18" of an enemy WIZARD that successfully casts a spell, this unit can attempt to unbind the spell in the same manner as a WIZARD. If it does so, add 1 to the unbinding roll for every 4 models in this unit. In addition, if this unit unbinds an enemy spell, add 1 to the Attacks characteristic of this unit's Chill Daggers until the next enemy hero phase.

        Once in each of your hero phases, if this unit is within 6" of an ENDLESS SPELL, this unit can attempt to dispel the endless spell in the same manner as a WIZARD. If this unit dispels an endless spell, it suffers D3 mortal wounds, but add 1 to the Attacks characteristic of this unit's Chill Daggers until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spell-eaters`,
        desc: `If this unit unbinds an enemy spell, add 1 to the Attacks characteristic of this unit's Chill Daggers until the next enemy hero phase. If this unit dispels an endless spell, add 1 to the Attacks characteristic of this unit's Chill Daggers until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dreadscythe Harridans`,
    effects: [
      ...Ethereal,
      {
        name: `Slasher Crone`,
        desc: `The leader of this unit is a Slasher Crone. Add 1 to the Attacks characteristic of a Slasher Crone's Scythed Limbs.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Harrowing Shriek`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models within 3" of this unit unless they have a Bravery characteristic of 6 or more.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Murderous Bloodlust`,
        desc: `If the unmodified wound roll for an attack made with Scythed Limbs is 6, that attack has a Damage characteristic of 2 instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spirit Hosts`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with Spectral Claws and Daggers is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hexwraiths`,
    effects: [
      ...Ethereal,
      {
        name: `Hellwraith`,
        desc: `The leader of this unit is a Hellwraith. Add 1 to the Attacks characteristic of a Hellwraith's Spectral Scythe.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with a Spectral Scythe is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spectral Hunters`,
        desc: `In your movement phase, immediately after this unit has moved, you can pick an enemy unit that has any models that a model from this unit passed across. If you do so, roll a D6 for each model from this unit that passed across the enemy unit. For each roll of 5+, that enemy unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Black Coach`,
    effects: [
      ...Ethereal,
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made with the Cairn Wraith's Reaper Scythe is 6, that attack inflicts 2 mortal wounds and the attack sequence ends (do not make a wound or save roll).

        In addition, if the unmodified hit roll for an attack made with the Relic Bearers' Spectral Claws is 6, that attack inflicts 1 mortal wound and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Evocation of Death`,
        desc: `At the start of each battle round, roll 3 dice for each BLACK COACH on the battlefield. For each 4+ that BLACK COACH gains a level of power. Levels of power are cumulative and last for the rest of the battle.`,
        when: [START_OF_TURN],
      },
      {
        name: `Evocation of Death - First Level - Nimbus of Power`,
        desc: `In your hero phase, heal D3 wounds that have been allocated to this model. In addition, at the start of your hero phase, pick 1 friendly SUMMONABLE NIGHTHAUNT unit wholly within 12" of this model and return D3 slain models to that unit. The returning models must be set up within 12" of this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Evocation of Death - Second Level - Unholy Vigour`,
        desc: `Re-roll hit rolls of 1 for this model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Evocation of Death - Second Level - Unholy Vigour`,
        desc: `This model can run and charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death - Third Level - Spectral Scythes`,
        desc: `After this model completes a charge move, pick an enemy unit withini 1" of this model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death - Fourth Level - Insubstantial Form`,
        desc: `This model can retreat and charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Evocation of Death - Fifth Level - Witch-fire`,
        desc: `In your hero phase, roll a D6 for each enemy unit within 3" of this model. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Reaped Like Corn`,
        desc: `You can re-roll failed hit rolls for attacks made with this model's Reaper Scythe if the target unit has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Briar Queen`,
    effects: [...Ethereal],
  },
  {
    name: `Thorns of the Briar Queen`,
    effects: [
      ...Ethereal,
      {
        name: `Varclav the Cruel`,
        desc: `The leader of this unit is Varclav the Cruel. Add 1 to the Attacks characteristic of Varclav the Cruel's Malignant Weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Varclav the Cruel`,
        desc: `The leader of this unit is Varclav the Cruel. This unit has a Bravery characteristic of 10 instead of 6 while it includes Varclav the Cruel.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Grasping Chains`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this unit that target an enemy unit that is within 3" of two or more models from this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Nighthaunt Procession`,
    effects: [
      {
        name: `Nighthaunt Procession`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly NIGHTHAUNT model from this battalion within 12" of your general or a friendly NIGHTHAUNT HERO from the battalion. On a 6+ the wound is negated. If this battalion is part of a Nighthaunt army, this ability replaces the Deathless Spirits battle trait for all units in this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shroudguard`,
    effects: [
      {
        name: `Shroudguard`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a BLADEGHEIST REVENANT model from a unit in this battalion wholly within 12" of a KNIGHT OF SHROUDS or REIKENOR THE GRIMHAILER from the same battalion. On a 5+, that wound or mortal wound is negated. If you use this ability, you cannot also use the Deathless Spirits battle trait to try to negate the same wound or mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deathriders`,
    effects: [
      {
        name: `Deathriders`,
        desc: `Add 1 to charge rolls for units from this battalion. In addition, if you make an unmodified charge roll of 9+ for a unit from this battalion, it can fight immediately after you complete the charge move. This does not stop the unit from being picked to fight in the combat phase of the same turn. If this battalion is part of a Nighthaunt army, this ability replaces the Wave of Terror battle trait for all units in this battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Condemned`,
    effects: [
      {
        name: `The Condemned`,
        desc: `You can re-roll failed hit rolls for attacks made by CHAINRASP HORDE units from this battalion while they are wholly within 16" of this battalion's SPIRIT TORMENT or CHAINGHASTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Chainguard`,
    effects: [
      {
        name: `Chainguard`,
        desc: `Each time a CHAINRASP HORDE from this battalion is affected by a Spectral Lure or Temporal Translocation spell cast by this battalion's GUARDIAN OF SOULS, you can return D6 slain models to that unit (in addition to any models returned to the unit by the Spectral Lure)`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Execution Horde`,
    effects: [
      {
        name: `Execution Horde`,
        desc: `Subtract 1 from hit rolls for attacks that target this battalion's LORD EXECUTIONER while a SPIRIT HOST unit from this battalion is within 6" of the attacker's unit. In addition, add 1 to hit rolls for attacks made by this battalion's LORD EXECUTIONER while any SPIRIT HOST units from this battalion are within 6" of the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Death Stalkers`,
    effects: [
      {
        name: `Death Stalkers`,
        desc: `After set-up is complete but before the battle begins, pick one enemy unit to be soul-marked by this battalion. Add 1 to hit and wound rolls for attacks made by units from this battalion that target the soul-marked unit.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Shrieker Host`,
    effects: [
      {
        name: `Shrieker Host`,
        desc: `Re-roll battleshock rolls of 1 for enemy units that are within 6" of any units from this battalion at the start of the battleshock phase. In addition, the Inspiring Presence command ability cannot be used on enemy units that are within 6" of any units from this battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]
