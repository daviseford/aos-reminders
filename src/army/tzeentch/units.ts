import { getChaosSlaves } from 'utils/chaosUtils'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'
import { MARK_TZEENTCH } from 'meta/alliances'
import SlavestoDarkness from 'army/slaves_to_darkness'
import BeastsofChaos from 'army/beasts_of_chaos'
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
  desc: `If a Lord of Change uses this ability, then until your next hero phase you can add 1 to all casting and unbinding rolls made for friendly TZEENTCH DAEMON WIZARDS that are within 18" of the Lord of Change.`,
  when: [HERO_PHASE],
  command_ability: true,
}

const BoltofChangeEffect = {
  name: `Bolt of Change`,
  desc: `Casting value 7. If successfully cast, pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. If any models were slain by this spell, before removing the first slain model, you can add 1 Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
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
  desc: `If the casting roll for this model is a double and the casting attempt is successful and not unbound, this model can attempt to cast 1 extra spell this turn. If it does so and the extra casting roll is a double, the spell automatically fails and this model is slain. If a friendly Magister is slain by this effect, roll a dice before removing the model. On a 2+, 1 Tzeentch Chaos Spawn is added to your army. Set up the Tzeentch Chaos Spawn anywhere on the battlefield within 1" of the slain Magister and more than 3" from any enemy units.`,
  when: [HERO_PHASE],
}

const MasteryOfMagicEffect = {
  name: `Mastery of Magic`,
  desc: `When you make a casting or unbinding roll for this model, change the result of the lowest dice so that it matches the highest.`,
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
  desc: `If the result of an unbinding roll for a Lord of Change is 9 or more, it learns the spell that is being cast, and can cast it in subsequent turns.`,
  when: [HERO_PHASE],
}
const TouchedbyFireEffect = {
  name: `Trouched by Fire`,
  desc: `Roll a dice each time you allocate a wound or mortal wound to this unit that was inflicted by a melee weapon. On a 5+, the attacking unit suffers 1 mortal wound.`,
  when: [COMBAT_PHASE],
}

const WakeofFireEffect = {
  name: `Wake of Fire`,
  desc: `After this unit has made a normal move, you can pick 1 enemy unit that has any models passed across by any models from this unit and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
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

        Casting rolls Unbinding rolls Dispelling rolls Run rolls Charge rolls Hit rolls Wound rolls Save rolls Any roll that determines the Damage characteristic of a missile or melee weapon Battleshock test

        Note that this ability only allows you to replace a single dice roll. For 2D6 rolls (such as casting rolls or charge rolls), you can only replace 1 of the dice. In addition, any rolls that have been replaced count as unmodified rolls and cannot be re-rolled or modified further.`,
        when: [DURING_GAME],
      },
      {
        name: `Gift of Change`,
        desc: `Casting value 8. If successfully cast, pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers a number of mortal wounds equal to the Gift of Change value shown on the caster's damage table. If any models were slain by this spell, before removing the first slain model, you can add a Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
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
      MasteryOfMagicEffect,
      SpellThiefEffect,
      BeaconOfSorceryEffect,
      {
        name: `Infernal Gateway`,
        desc: `Casting value 7. Pick a visible enemy within 18" of the caster and roll 9 dice. For each roll that equals or beats the number shown on the damage table, the unit suffers a mortal wound.`,
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
        desc: `After set-up is complete, you can remove the Changeling from the battlefield and set up it up again in your opponent's territory, more than 3" from any enemy units. Enemy units treat it as part of their own army - they can move within 3" of it but they cannot target it with spells or attacks, and so on. If it makes a charge move, attacks, casts or unbinds a spell, or is within 3" of an enemy HERO at the end of any phase, it is revealed and this ability no longer has an effect.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Puckish Misdirection`,
        desc: `Until the Changeling is revealed, you can pick one unit within 9" of it in each enemy hero phase. That unit halves its Move until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Formless Horror`,
        desc: `In the combat phase, you can pick a melee weapon wielded by an enemy model within 3" of the Changeling, and use that weapon's Range, Attacks, To Hit, To Wound, Rend and Damage characteristics instead of those for the Trickster's Staff. If a weapon does not have a value for one or more of these characteristics (e.g. it is given as '*' or 'see below'), it cannot be picked.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Herald of Tzeentch`,
    effects: [
      ArcaneTomeEffect,
      {
        name: `Fortune and Fate`,
        desc: `If you roll a 9+ for a Herald of Tzeentch's casting roll, it can attempt to cast one extra spell this hero phase (it must be a different spell).`,
        when: [HERO_PHASE],
      },
      {
        name: `Pink Fire of Tzeentch`,
        desc: `Casting Value 9. Pick an enemy unit within 18" of the caster that is visible and deal D6 mortal wounds.`,
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
        desc: `Casting value 5. If successfully cast, pick 1 enemy unit within 18" of the caster and visible to them, and roll 9 dice. For each 6, that unit suffers 1 mortal wound.`,
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
        desc: `Casting value 8. If successfully cast, roll a dice for each enemy unit within 9" of the caster and visible to them. On a 3+, that unit suffers D3 mortal wounds.`,
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
        desc: `Roll a D6 each time a WIZARD within 18" of the Blue Scribes successfully casts a spell (whether or not it is unbound); on a 4 or more the Scribes learn that spell and can attempt to cast it in subsequent turns.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scrolls of Sorcery`,
        desc: `Once in each of your hero phases, the Blue Scribes can read from their Scrolls of Sorcery instead of making a casting attempt. If they do, roll a D6; on a 1, they can't decipher the scrawls and the casting attempt automatically fails, but on a 2+, that spell is successfully cast and can only be unbound on a roll of 9+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Boon of Tzeentch`,
        desc: `Casting value 4. You can re-roll failed casting rolls made for TZEENTCH WIZARDS within 18" of the Blue Scribes.`,
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
        desc: `If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Pink Horror Hornblowers is 1, that battleshock test must be re-rolled.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ectoplasmic Elasticity`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a Pink Horror from this unit. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Flickers Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Magical Flames while this unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Split and Split again`,
        desc: `When you allocate wounds or mortal wounds to this unit, you must allocate them to a Pink Horror model if it is possible to do so.

        Each time an Iridescent Horror or Pink Horror model from a friendly unit with this ability is slain, you can add 2 Blue Horror models to that unit after removing the slain model. Each time a Blue Horror model from a friendly unit with this ability is slain, you can add 1 Brimstone Horrors model to that unit after removing the slain model.

        Set up the additional models one at a time within 1" of the position that the slain model had occupied. The additional models can only be set up within 3" of an enemy unit if the position that the slain model had occupied or any other models from the slain model's unit are within 3" of that enemy unit. If you cannot set up the additional models in this way, they are removed from play (they do not count as being slain).`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Locus of Conjuration`,
        desc: `You can add 1 to any casting rolls made for this unit if it is wholly within 12" of any friendly TZEENTCH DAEMON HEROES.`,
        when: [HERO_PHASE],
      },
      {
        name: `Petty Vengeance`,
        desc: `If a Pink Horror model from this unit is slain and you do not use its Split and Split Again ability to add any models to this unit, you can pick 1 enemy unit within 1" of this unit and roll a dice. On a 5+, that enemy unit suffers 1 mortal wound.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Magic`,
        desc: `This unit is a Wizard while it has 9 or more Pink Horrors. It can attempt to cast 1 spell in your hero phase and attmept to unbind 1 spell in the enemy hero phase.It knows the Channelled Pink Fire spell. It cannot attempt to cast any spells other than Channelled Pink Fire, but any number of Horrors of Tzeentch units that have 9 or more Pink Horrors can attempt to cast Channelled Pink Fire in the same hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Channelled Pink Fire`,
        desc: `Casting value 6. If successfully cast, pick 1 friendly Horrors of Tzeentch unit wholly within 6" of the caster and visible to them. Add 1 to hit rolls for attacks made by that unit until the start of your next hero phase. A unit cannot benefit from this spell more than once per phase.`,
        spell: true,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Exalted Flamers of Tzeentch`,
    effects: [CapriciousWarpflameEffect],
  },
  {
    name: `Flamers of Tzeentch`,
    effects: [
      CapriciousWarpflameEffect,
      TouchedbyFireEffect,
      {
        name: `Guided by Billowing Flames`,
        desc: `Add 1 to hit rolls for attacks made with this unit's Warpflame while it is wholly within 9" of any friendly Exalted Flamers.`,
        when: [WOUND_ALLOCATION],
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
        desc: `Casting value 3. If successfully cast, pick 1 enemy Wizard within 24" of the caster and visible to them. Pick 1 spell from that Wizard's warscroll that is possible for this model to cast and roll a dice. On a 3+, the caster knows that spell for the rest of the battle.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Disrupter of the Arcane`,
        desc: `You can re-roll unbinding and dispelling rolls for this model.`,
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
        desc: `Once per battle, at the end of your movement phase, if this model is within 9" of a Realmgate it can use its Book of Profane Secrets. If it does so, you can summon 1 unit from the list on the warscroll to the battlefield, and add it to your army. The summoned unit must be set up wholly within 9" of a this model and wholly within 9" of the Realmgate, and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Warptongue Blade`,
        desc: `If a Warptongue Blade inflicts damage on an enemy unit, roll two dice. If the roll is higher than the enemy unit's Bravery, one model in the unit is slain. Otherwise, the blade inflicts 1 wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infernal Flames`,
        desc: `Casting value 8. Pick a visible enemy unit and roll 1 dice for each model in the target unit that is within 18" of the caster; the unit suffers 1 mortal wound for each roll of a 4+. Roll 3 dice for each MONSTER or War Machine in the target unit.`,
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
        desc: `If this model suffers any wounds or mortal wounds as the result of a spell, roll a D6. If the result is 4 or more, the wounds are ignored.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hovering Disc of Tzeentch`,
        desc: `Add 2 to the result of any save rolls for this model in the combat phase unless the attacker can fly.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lord of Fate`,
        desc: `If a Fatemaster uses this ability, roll a D6. Until your next hero phase, any time you make a dice roll for this model or a TZEENTCH MORTAL unit within 9",and the result matches that on the dice you rolled in the hero phase, you can choose to re-roll it.`,
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
        desc: `If this model has suffered 5 or more wounds, add 1 to all of its hit rolls but subtract 1 from all of its casting and unbinding rolls (healing wounds may mean the Thaumaturge ceases to be enraged).`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mighty Bulk`,
        desc: `After this model completes a charge move, pick an enemy unit within 1";that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Overwhelming Power`,
        desc: `This model heals 1 wound in each of its hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fireblast`,
        desc: `Casting value 7. Pick a visible enemy unit within 18". The unit suffers D6 mortal wounds. You can set up 1 unit of BRIMSTONE HORRORS within 1" of the target. The number of models set up in the new unit is equal to the number of mortal wounds inflicted.`,
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
        desc: `Roll a D6 before allocating a wound or mortal wound to a model that has an Arcanite Shield. On a roll of 6, the shield deflects the damage and the wound is ignored.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Gestalt Sorcery`,
        desc: `You can add 1 to the hit rolls of this unit's Sorcerous Bolts if it is within 9" of at least one friendly TZEENTCH WIZARD.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Paired Cursed Blades`,
        desc: `You can add 1 to any hit rolls made for models attacking with Paired Cursed Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scroll of Dark Arts`,
        desc: `If at least one model in the unit is equipped with a Scroll of Dark Arts, you can increase the range of the unit's Sorcerous Bolts to 18".`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Vulchare`,
        desc: `If at least one model in the unit is equipped with a Vulcharc, roll a D6 each time an enemy WIZARD within 18" of the unit successfully casts a spell. On a roll of 5 or more, the wizard suffers one mortal wound as soon as the spell's effects have been resolved.`,
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
    name: `Mutalith Vortex Beast of Tzeentch`,
    effects: [
      {
        name: `Aura of Mutation`,
        desc: `In your hero phase, you can pick a unit within 15". Roll a D6 and consult the chart below:

        1. Hideous Disfigurements: Reduce the Bravery of each model in the target unit by 1 for the rest of the battle.

        2. Trollbrains: For the rest of the battle, the controlling player must roll a D6 at the start of each of their hero phases. On the roll of a 1, the target unit can't be selected to cast spells, move or attack until their next hero phase.

        3. Gift of Mutations: Reduce the Move of each model in the target unit by 1 for the rest of the battle.

        4. Tide of Transmogrification: The target unit sufers D3 mortal wounds.

        5. Maelstrom of Change: The target unit suffers D6 mortal wounds.

        6. Spawnchange: The target unit suffers D6 mortal wounds. For each model that is slain as a result, set up a Chaos Spawn within 3" of the target unit. All Chaos Spawn created as a result of Spawnchange are added to your army.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mutant Regeneration`,
        desc: `Heal D3 wounds in each of your hero phases.`,
        when: [HERO_PHASE],
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
]

// Battalions
export const TzeentchBattalions: TBattalions = [
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
        name: `Scintillating Attack Run`,
        desc: `In each of your hero phases, you can move any units from a Skyshoal Coven up to 9" as if it were the movement phase (they cannot run as part of this move, and it does not stop them from moving normally later in the turn). After a unit moves in this manner, you can pick an enemy unit that it moved across.RolladiceforeachmodelintheSkyshoalCovenunit;foreachrollof6,the unit it moved across suffers a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzaangor Coven`,
    effects: [
      {
        name: `Aspirant Gor-kin`,
        desc: `If the unit of Tzaangors from a Tzaangor Coven is within 3" of an enemy unit and within 9" of the battalion's unit of Tzaangor Enlightened or Tzaangor Skyfires at the start of your hero phase, it can pile in and attack as if it were the combat phase. If the unit of Tzaangors is within 9" of both of these units at the start of your hero phase, then you can also add 1 to their wound rolls when they attack in this manner.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ferocious Fighters`,
        desc: `Vicious Beak attacks made by models from a Tzaangor Coven wound on a roll of 4+ instead of 5+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cult of the Transient Form`,
    effects: [
      {
        name: `The Change-gift`,
        desc: `Roll a D6 each time a Kairic Acolyte from the Cult of the Transient Form is slain. On a roll of 6, they are blessed with new life and are transmogrified into a Tzaangor. If there is already a friendly Tzaangor unit within 6" of the slain model's unit, add the Tzaangor to that unit, otherwise set it up as a new unit within 6" of the slain model's unit. In addition, roll a D6 each time a HERO from the Cult of the Transient Form is slain. On a roll of 6 they are reborn as a horrific Tzeentch Chaos Spawn; set up a Tzeentch Chaos Spawn under your control anywhere within 6" of the slain HERO model just before removing it.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `The Pyrofane Cult`,
    effects: [
      {
        name: `Arch-Pyromancers`,
        desc: `You can add 1 to the wound rolls of Sorcerous Bolt attacks made by Kairic Acolytes from the Pyrofane Cult for each other unit from the battalion that attacked the target unit with Sorcerous Bolts earlier in the same phase. For example, if two units of Kairic Acolytes from the Pyrofane Cult had already targeted a unit with Sorcerous Bolts, you could add 2 to the wound rolls of the third unit that did so.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Alter-kin Coven`,
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `In each of your hero phases, roll a D6 for each enemy unit that is within 3" of a unit from an Alter-kin Coven. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds. If any models are slain in this manner, they are blessed with mutation and transmogrified into a Tzaangor. If there is already a friendly Tzaangor unit within 6" of the slain model's unit, add the Tzaangor to that unit, otherwise set it up as a new unit within 6" of the slain model's unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcanite Cabal`,
    effects: [
      {
        name: `Master of the Cult`,
        desc: `Each time you use a Destiny Dice to predetermine a dice roll for the master of the cult, roll a D6; on a roll of 4, 5 or 6, you may roll another dice and immediately add it to your Destiny Dice pool.`,
        when: [DURING_GAME],
      },
      {
        name: `Cabal of Sorcerers`,
        desc: `Each Wizard from an Arcanite Cabal that is within 9" of at least two other WIZARDS from the same battalion in your hero phase can attempt to cast one additional spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcanite Cult`,
    effects: [
      {
        name: `Destiny Preordained`,
        desc: `When generating your Destiny Dice pool at the start of the battle, you can choose the results of 3 of the dice before rolling the remaining 6 dice as normal.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Strength in Conviction`,
        desc: `Add 1 to the Bravery of all models in an Arcanite Cult.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Aether-eater Host`,
    effects: [
      {
        name: `Feed of Magic`,
        desc: `If a unit from an Aether-eater Host successfully unbinds a spell cast by an enemy model, they immediately heal D3 wounds. Whilst an Aether-eater Host has 9 or more units, then any units of Screamers from the battalion can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard (meaning they can also heal wounds as described above).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Changehost`,
    effects: [
      {
        name: `Deceive and Dismay`,
        desc: `At the start of each of your hero phases, you may pick a pair of units from this battalion that are within 27" of the battalion's Lord of Change to swap places. To do so, take one model from each unit, and have them swap places on the battlefield. Then, remove all of the other models from the two units, and set them back up within 9" of the model from their unit that first swapped places. If a Changehost has 9 or more units at the start of your hero phase, you can pick two different pairs of units to swap places rather than only one. If the Changehost has 18 or more units, then you can pick three different pairs of units to swap places. Each unit can only move this way once in a hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Multitudinous Host`,
    effects: [
      {
        name: `Horrors Without Number`,
        desc: `In each of your hero phases, add D3 models to each unit of PINK HORRORSand/or BLUE HORRORS, and add 1 model to each unit of BRIMSTONE HORRORS in this battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Omniscient Oracles`,
    effects: [
      {
        name: `Knowledge of Past, Present and Future`,
        desc: `You can re-roll any hit, wound, save and run rolls of 1 - as well as any dice rolls of 1 in a charge roll - for models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Overseer's Fate-twisters`,
    effects: [
      {
        name: `The Will of Tzeentch`,
        desc: `At the start of each of your hero phases, add 1 dice to your Destiny Dice pool whilst at least one model from this battalion is on the battlefield. In addition, you can choose to substitute dice rolls that you have already made with Destiny Dice (rather than substituting them before rolling) whilst this battalion has 9 or more models.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Master of Fate`,
        desc: `If the Lord of Change from this battalion is on the battlefield, then in each of your hero phases you can choose to re-roll the result of one of the dice in your Destiny Dice pool.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Eternal Conflagration`,
    effects: [
      {
        name: `Pawns of the Radiant Lord`,
        desc: `When the Lord of Change that must be taken in this battalion successfully casts an Arcane Bolt or Mystic Shield spell, you can measure the range and visibility for the spell from a Flamer from this battalion instead of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Coruscating Flames`,
        desc: `Your opponent must subtract 1 from any hit rolls that target units of Flamers and Exalted Flamers of Tzeentch from the Eternal Conflagration in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Hosts Duplicitous`,
    effects: [
      {
        name: `Glamoursmiths`,
        desc: `When a WIZARD from this battalion rolls a 1 on any dice as part of a casting roll, count it as a 2instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpflame Host`,
    effects: [
      {
        name: `Storm of Daemonic Fire`,
        desc: `In each of your hero phases, roll a D6 for each enemy unit that is within 9" of a unit from a Warpflame Host. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Combine lists together to make army battalion entry.
export const Battalions: TBattalions = [...TzeentchBattalions, ...getSlavesBattalion(), ...getBoCBattalion()]
