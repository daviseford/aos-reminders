import BeastsofChaos from 'army/beasts_of_chaos'
import SlavestoDarkness from 'army/slaves_to_darkness'
import { MARK_TZEENTCH } from 'meta/alliances'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { getChaosSlaves } from 'utils/chaosUtils'
import { filterBattalions, filterUnits } from 'utils/filterUtils'

const SlaveUnits = getChaosSlaves(MARK_TZEENTCH)

const getSlavesBattalion = () => {
  const listOfBattalions = ['Fatesworn Warband']
  return filterBattalions(SlavestoDarkness.Battalions, listOfBattalions)
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
    'Tzaangors',
    `Tzaangor Enlightened`,
    `Tzaangor Skyfires`,
    `Tzaangor Shaman`,
    'Ungor Raiders',
    'Ungors',
  ]
  return filterUnits(BeastsofChaos.Units, listOfUnits)
}

const getBoCBattalion = () => {
  const listOfBattalions = ['Phantasmagoria of Fate']
  return filterBattalions(BeastsofChaos.Battalions, listOfBattalions)
}

export const AlliedUnits: TUnits = [...SlaveUnits, ...getBoCUnits()]

const ArcaneTomeEffect = {
  name: `Arcane Tome`,
  desc: `Once per battle, when this model attempts to cast or unbind a spell, you can roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the casting or unbinding roll.`,
  when: [HERO_PHASE],
}
const BeaconOfSorceryEffect = {
  name: `Beacon of Sorcery`,
  desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to casting and unbinding rolls for friendly TZEENTCH DAEMON WIZARDS while they are wholly within 18" of that model. The same unit cannot benefit from this command ability more than once per turn.`,
  when: [START_OF_HERO_PHASE],
  command_ability: true,
}
const BoltofChangeEffect = {
  name: `Bolt of Change`,
  desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. If any models were slain by this spell, before removing the first slain model, you can add 1 Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
  when: [HERO_PHASE],
  spell: true,
}
const CapriciousWarpflameEffect = {
  name: `Capricious Warpflame`,
  desc: `Add 1 to hit rolls for attacks made by this unit if the target unit has 10 or more models. Add 2 to hit rolls instead of 1 if the target unit has 20 or more models.`,
  when: [SHOOTING_PHASE],
}
const MagicTouchedEffect = {
  name: `Magic-touched`,
  desc: `If the casting roll for this model is a double and the casting attempt is successful and not unbound, this model can attempt to cast 1 extra spell this turn. If it does so and the extra casting roll is a double, the spell automatically fails and this model is slain. If a friendly Magister is slain by this effect, roll a D6 before removing the model. On a 2+, 1 Tzeentch Chaos Spawn is added to your army. Set up the Tzeentch Chaos Spawn anywhere on the battlefield within 1" of the slain Magister and more than 3" from any enemy units.`,
  when: [HERO_PHASE],
}
const MasteryOfMagicEffect = {
  name: `Mastery of Magic`,
  desc: `When this model makes a casting, unbinding or dispelling roll, you can change the lowest D6 to match the highest D6.`,
  when: [HERO_PHASE],
}
const SkySharksEffect = {
  name: `Sky-sharks`,
  desc: `If the target is an enemy Monster, change the Damage characteristic of this unit's Lamprey Bite to D3.`,
  when: [COMBAT_PHASE],
}
const SpellEaterEffect = {
  name: `Spell-eater`,
  desc: `Once per turn, in your hero phase, you can pick 1 endless spell within 18" of this model. That endless spell is dispelled.`,
  when: [HERO_PHASE],
}
const SpellThiefEffect = {
  name: `Spell-thief`,
  desc: `If this model successfully unbinds an enemy spell with an unbinding roll of 9+, this model can attempt to cast that spell, if it is possible for it to do so, for the rest of the battle.`,
  when: [HERO_PHASE],
}
const TouchedbyFireEffect = {
  name: `Touched by Fire`,
  desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit that was inflicted by a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound.`,
  when: [WOUND_ALLOCATION_PHASE],
}
const WakeofFireEffect = {
  name: `Wake of Fire`,
  desc: `After this unit has made a normal move, you can pick 1 enemy unit that has any models passed across by any models from this unit and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
  when: [MOVEMENT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Kairos Fateweaver`,
    effects: [
      MasteryOfMagicEffect,
      SpellEaterEffect,
      {
        name: `Oracle of Eternity`,
        desc: `Once per battle, in either player's turn, if this model is on the battlefield, you can replace a single dice from one of the following dice rolls with a result of your choice.

        Casting rolls, Unbinding rolls, Dispelling rolls, Run rolls, Charge rolls, Hit rolls, Wound rolls, Save rolls, Any roll that determines the Damage characteristic of a missile or melee weapon, Battleshock test

        Note that this ability only allows you to replace a single dice roll. For 2D6 rolls (such as casting rolls or charge rolls), you can only replace 1 of the dice. In addition, any rolls that have been replaced count as unmodified rolls and cannot be rerolled or modified further.`,
        when: [DURING_GAME],
      },
      {
        name: `Gift of Change`,
        desc: `Casting value of 8. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers a number of mortal wounds equal to the Gift of Change value shown on the caster's damage table. If any models were slain by this spell, before removing the first slain model, you can add a Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Magic`,
        desc: `While friendly Wizards are wholly within 18" of him, Kairos Fateweaver knows any spells on those Wizards' warscrolls that are possible for him to cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of Change`,
    effects: [
      BeaconOfSorceryEffect,
      MasteryOfMagicEffect,
      SpellEaterEffect,
      SpellThiefEffect,
      {
        name: `Infernal Gateway`,
        desc: `Casting value of 7. Pick a visible enemy within 18" of the caster and roll 9 dice. That unit suffers 1 mortal wound for each roll that is equal to or greater than the Infernal Gateway value shown on the caster's damage table.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `The Changeling`,
    effects: [
      {
        name: `Arch-deceiver`,
        desc: `At the start of the first battle round, after armies have been set up but before the first turn begins, you can remove this model from the battlefield. If you do so, at the end of your first movement phase, you must set this model up again anywhere within your opponent's territory more than 3" from any enemy units.`,
        when: [TURN_ONE_START_OF_TURN, TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Puckish Misdirection`,
        desc: `In the enemy hero phase, you can pick 1 enemy unit within 9" of this model. If you do so, until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and half the Move characteristic of that unit (rounding up).`,
        when: [HERO_PHASE],
      },
      {
        name: `Changeling Magic`,
        desc: `While this model is within 9" of an enemy Wizard, it knows any spell on that Wizard's warscroll that are possible for this model to cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Changecaster, Herald of Tzeentch`,
    effects: [
      ArcaneTomeEffect,
      {
        name: `Fortune and Fate`,
        desc: `If this model successfully casts a spell with a casting roll of 9+, this model can attempt to cast 1 extra spell in that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pink Fire of Tzeentch`,
        desc: `Casting value of 9. Pick an enemy unit within 18" of the caster that is visible and deal D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Fluxmaster, Herald of Tzeentch on Disc`,
    effects: [
      ArcaneTomeEffect,
      {
        name: `Blue Fire of Tzeentch`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster and visible to them, and roll 9 dice. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Fateskimmer, Herald of Tzeentch on Burning Chariot`,
    effects: [
      ArcaneTomeEffect,
      SkySharksEffect,
      WakeofFireEffect,
      {
        name: `Tzeentch's Firestorm`,
        desc: `Casting value of 8. Roll a D6 for each enemy unit within 9" of the caster and visible to them. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `The Blue Scribes`,
    effects: [
      {
        name: `Frantic Scribbling`,
        desc: `Each time a Wizard wholly within 18" of this model successfully casts a spell that is not unbound and that is possible for this model to cast, you can roll a D6. On a 4+, this model knows that spell for the rest of the battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scrolls of Sorcery`,
        desc: `Once in each of your hero phases, when this model attempts to cast a spell, instead of making a casting roll, you can say that it will read from its scrolls of sorcery. If you do so, roll a D6. On a 2+, that spell is automatically cast and cannot be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Boon of Tzeentch`,
        desc: `Casting value of 4. You can reroll casting rolls for friendly TZEENTCH WIZARDS wholly within 18" of the caster for the rest of that phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Horrors of Tzeentch`,
    effects: [
      {
        name: `Icon Bearer`,
        desc: `If the unmodified roll for a battleshock test for this unit while it includes any Pink Horror Icon Bearers is 1, you can return D6 slain Horrors of Tzeentch models to this unit, and no models from this unit will flee in that battleshock phase. Set up the Horrors of Tzeentch models one at a time within 1" of a model from this unit that has not been returned in that phase. The models can only be set up within 3" of an enemy unit if this unit was within 3" of that enemy unit before any models were returned.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Horn Blower`,
        desc: `If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Pink Horror Hornblowers is 1, that battleshock test must be rerolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ectoplasmic Elasticity`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Pink Horror from this unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Flickers Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Magical Flames while this unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Split and Split Again`,
        desc: `When you allocate wounds or mortal wounds to this unit, you must allocate them to a Pink Horror model if it is possible to do so.

        Each time an Iridescent Horror or Pink Horror model from a friendly unit with this ability is slain, you can add 2 Blue Horror models to that unit after removing the slain model. Each time a Blue Horror model from a friendly unit with this ability is slain, you can add 1 Brimstone Horrors model to that unit after removing the slain model.

        Set up the additional models one at a time within 1" of the position that the slain model had occupied. The additional models can only be set up within 3" of an enemy unit if the position that the slain model had occupied or any other models from the slain model's unit are within 3" of that enemy unit. If you cannot set up the additional models in this way, they are removed from play (they do not count as being slain).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Locus of Conjuration`,
        desc: `You can add 1 to any casting rolls made for this unit if it is wholly within 12" of any friendly TZEENTCH DAEMON HEROES.`,
        when: [HERO_PHASE],
      },
      {
        name: `Petty Vengeance`,
        desc: `If a Pink Horror model from this unit is slain and you do not use its Split and Split Again ability to add any models to this unit, you can pick 1 enemy unit within 1" of this unit and roll a D6. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit is a Wizard while it has 9 or more Pink Horrors. It can attempt to cast 1 spell in your hero phase and attmept to unbind 1 spell in the enemy hero phase.It knows the Channelled Pink Fire spell. It cannot attempt to cast any spells other than Channelled Pink Fire, but any number of Horrors of Tzeentch units that have 9 or more Pink Horrors can attempt to cast Channelled Pink Fire in the same hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Channelled Pink Fire`,
        desc: `Casting value of 6. Pick 1 friendly Horrors of Tzeentch unit wholly within 6" of the caster and visible to them. Add 1 to hit rolls for attacks made by that unit until the start of your next hero phase. A unit cannot benefit from this spell more than once per phase.`,
        spell: true,
        when: [HERO_PHASE],
      },
      {
        name: `Channelled Pink Fire`,
        desc: `If active, add 1 to hit rolls for attacks made by the buffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Flamers of Tzeentch`,
    effects: [CapriciousWarpflameEffect, TouchedbyFireEffect],
  },
  {
    name: `Flamers of Tzeentch`,
    effects: [
      CapriciousWarpflameEffect,
      TouchedbyFireEffect,
      {
        name: `Guided by Billowing Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Warpflame while it is wholly within 9" of any friendly Exalted Flamers.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Screamers of Tzeentch`,
    effects: [
      SkySharksEffect,
      {
        name: `Slashing Fins`,
        desc: `After this unit has made a normal move, pick 1 enemy unit and roll 1 dice for each model in this unit that passed across any models from that unit. For each 5+, that unit suffers 1 mortal wound. If that enemy unit is a Wizard, for each 5+, inflict D3 mortal wounds instead of 1.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Eyes of the Nine`,
    effects: [
      {
        name: `Arcanite Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Split`,
        desc: `If the Blue Horror model from a friendly unit with this ability is slain, you can add 1 Brimstone Horrors model to that unit after removing the slain model. The Brimstone Horrors' Magical Flames have an Attacks characteristic of 1 instead of 2, and their Taloned Hands have an Attacks characteristic of 2 instead of 1.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Burning Chariots of Tzeentch`,
    effects: [SkySharksEffect, CapriciousWarpflameEffect, TouchedbyFireEffect, WakeofFireEffect],
  },
  {
    name: `Curseling, Eye of Tzeentch`,
    effects: [
      {
        name: `Vessel of Chaos`,
        desc: `If this model successfully unbinds a spell that is possible for it to cast, it can immediately attempt to cast that spell even though it is the enemy hero phase. If that spell is successfully cast, it cannot be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Glean Magic`,
        desc: `Casting value of 3. Pick 1 enemy Wizard within 24" of the caster and visible to them. Pick 1 spell from that Wizard's warscroll that is possible for this model to cast and roll a D6. On a 3+, the caster knows that spell for the rest of the battle.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Disrupter of the Arcane`,
        desc: `You can reroll unbinding and dispelling rolls for this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magister`,
    effects: [MagicTouchedEffect, BoltofChangeEffect],
  },
  {
    name: `Magister on Disc of Tzeentch`,
    effects: [MagicTouchedEffect, BoltofChangeEffect],
  },
  {
    name: `Gaunt Summoner of Tzeentch`,
    effects: [
      {
        name: `Book of Profane Secrets`,
        desc: `Once per battle this model can use this ability at the start of your hero phase. Summon 1 unit of the following to the battlefield: 5 Horrors of Tzeentch, 10 Bloodletters, 10 Daemonettes, 10 Plaguebearers or 6 Furies. The summoned unit must be set up wholly within 9" of a this model and more than 9" from any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Warptongue Blade`,
        desc: `If the unmodified wound roll for an attack made with a Warptongue Blade is 6, that attack inflicts D6 mortal wounds on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infernal Flames`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" of the caster that is visible to them, and roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound. If that unit is a Monster or War Machine, roll 3 dice for each model instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Fatemaster`,
    effects: [
      {
        name: `Soulbound Shield`,
        desc: `Each time this model is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell or endless spell on this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hovering Disc of Tzeentch`,
        desc: `Add 2 to the result of any save rolls for this model in the combat phase unless the attacker is a Monster or can fly.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of Fate`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick a friendly model with this command ability. Until your next hero phase, you can reroll hit rolls for attacks made by friendly Tzeentch units wholly within 9" of this model.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Ogroid Thaumaturge`,
    effects: [
      {
        name: `Brutal Rage`,
        desc: `You can reroll hit and wound rolls for attacks made with melee weapons by this model if any wounds or mortal wounds were allocated to this model earlier in the same phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mighty Rampage`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Choking Tendrils`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D6 mortal wounds. For each model that is slain by mortal wounds inflicted by this spell, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Kairic Acolytes`,
    effects: [
      {
        name: `Arcanite Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated. When you allocate wounds or mortal wounds to this unit, you must allocate them to a model armed with an Arcanite Shield if it is possible to do so.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Gestalt Sorcery`,
        desc: `Casting value of 6. Pick 1 friendly Kairic Acolytes unit wholly within 9" of the caster. Until your next hero phase, improve the Rend characteristic of that unit's Sorcerous Bolt attack by 1. A unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Gestalt Sorcery`,
        desc: `If active, improve the Rend characteristic of the buffed unit's Sorcerous Bolt attack by 1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Paired Cursed Blades`,
        desc: `You can reroll hit rolls for attacks made with a pair of Cursed Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scroll of Dark Arts`,
        desc: `A unit that includes any Scrolls of Dark Arts can add 1 to casting and unbinding rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vulcharc`,
        desc: `If an enemy Wizard successfully casts a spell within 18" of a friendly unit that includes any Vulcharcs, roll a D6. On a 4+, that Wizard suffers 1 mortal wound after the effects of that spell have been resolved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzeentch Chaos Spawn`,
    effects: [
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by a Tzeentch Chaos Spawn's Freakish Mutations, resolve those attacks with a To Hit and To Wound characteristic of 3+ instead of 4+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Greater Demon of Tzeentch`,
    effects: [
      MasteryOfMagicEffect,
      SpellThiefEffect,
      BeaconOfSorceryEffect,
      {
        name: `Magic`,
        desc: `This model is a Wizard. It can attempt to cast two spells in your hero phase, and attempt to unbind two spells in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Infernal Gateway spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Infernal Gateway`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and roll 9 dice. For each roll that equals or beats the value shown for Infernal Gateway on the damage table above, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Vortemis the All-seeing`,
    effects: [
      MagicTouchedEffect,
      {
        name: `Sorcerous Insight`,
        desc: `Casting value of 5. You receive 1 extra command point. This extra command point can only be spent by picking this model to use the At the Double, Forward to Victory or Inspiring Presence command ability.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
]

// Battalions
const TzeentchBattalions: TBattalions = [
  {
    name: `Witchfyre Coven`,
    effects: [
      {
        name: `Mastery of Wyrdflame`,
        desc: `Once per turn, in your hero phase, pick 1 Kairic Acolyte unit in this battalion. That unit can make a shooting attack.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skyshoal Coven`,
    effects: [
      {
        name: `Diving from the skies`,
        desc: `After a friendly uni from this battalion made a normal move, you can pick 1 enemy unit that has any models passed across by any models fro that friendly unit and roll a D6. On a 2", that enemy unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzaangor Coven`,
    effects: [
      {
        name: `Pride of the Gor-kin`,
        desc: `At the start of your hero phase, you can pick 1 friendly unit from this battalion that is within 3" of an enemy unit. That unit can shoot or fight.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Alter-kin Coven`,
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `In each of the charge phase, roll a D6 for each enemy unit that is within 3" of a unit from an Alter-kin Coven. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds. If any models are slain in this manner, you can add 1 Tzaangor model to an existing Tzaangor unit in your army. If you do so, set up that Tzaangor model within 1" of a friendly Tzaangor unit that is within 9" of the slain model. The model can only be set up within 3" of an enemy unit if the friendly Tzaangor unit was within 3" of that enemy unit before any models were added.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Arcanite Cabal`,
    effects: [
      {
        name: `Master of the Cult`,
        desc: `After armies are set up but before the first battle round begins, pick 1 friendly model from this battalion. For the rest of the battle, each time you spend a Destiny Dice to replace a dice roll for that model, roll a D6. On a 2+, you can replace one of your remaining Destiny Dice with that roll.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Arcanite Cult`,
    effects: [
      {
        name: `Destiny Preordained`,
        desc: `When generating your Destiny Dice pool at the start of the battle, you can choose the results of 6 of the dice before rolling the remaining 3 dice as normal.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Aether-eater Host`,
    effects: [
      {
        name: `Feed of Magic`,
        desc: `If a friendly unit from this battalion successfully unbinds a spell in the enemy hero phase, you can immediately heal D3 wounds allocated to that unit. In addition, 1 friendly Screamers of Tzeentch unit from this battalion can attempt to unbind 1 spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Changehost`,
    effects: [
      {
        name: `Deceive and Dismay`,
        desc: `At the start of your hero phase, if the LORD OF CHANGE from this battalion is your general and is on the battlefield, you can pick 1 other friendly unit from this battalion and remove it from the battlefield. If you do so, set up that unit again anywhere on the battlefield more than 9" from any enemy units. The unit you set up in this manner cannot move in the following movement phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Multitudinous Host`,
    effects: [
      {
        name: `Horrors Without Number`,
        desc: `At the start of your hero phases, you can return D3 slain Horrors of Tzeentch models to each friendly Horrors of Tzeentch unit from this battalion (roll separately for each unit)`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Omniscient Oracles`,
    effects: [
      {
        name: `Knowledge of Past, Present and Future`,
        desc: `You can reroll any hit, wound, save and run rolls of 1 for models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Overseer's Fate-twisters`,
    effects: [
      {
        name: `The Will of Tzeentch`,
        desc: `At the start of your hero phases, if 1 or more friendly units from this battalion are on the battlefield, you can roll a D6 and add it to your Destiny Dice. In addition, at the start of your hero phase, if the Lord of Change from this battalion is on the battlefield, you can reroll one of your Destiny Dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpflame Host`,
    effects: [
      {
        name: `Storm of Daemonic Fire`,
        desc: `At the end of the charge phase, roll a D6 for each enemy unit within 9" of any friendly units from this battalion. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ab-Het's Skyseekers`,
    effects: [
      {
        name: `Foreseen Manoeuveres`,
        desc: `When making a charge roll for a unit from this battalion, roll 3D6, remove 1 dice of your choice, and then use the remaining 2D6 to determine the charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Fate Legion`,
    effects: [
      {
        name: `Three times three, the offerings be`,
        desc: `If your army includes this battalion, you start the battle with 9 Fate Points.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `M 'zarr's Aetherhost`,
    effects: [
      {
        name: `Spontaneous Destruction`,
        desc: `In each of your hero phases; pick either the Herald of Tzeentch or another unit from this battalion within 9" of them; you can choose either to cast one additional spell with that unit this phase or make a shooting attack with all the models in that unit as if it were the shooting phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Combine lists together to make army battalion entry.
export const Battalions: TBattalions = [...TzeentchBattalions, ...getSlavesBattalion(), ...getBoCBattalion()]
