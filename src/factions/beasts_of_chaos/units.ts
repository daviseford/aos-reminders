import { keyPicker, tagAs } from 'factions/metatagger'
import GenericBattleTraits from 'generic_rules/battle_traits'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_TURN,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import Spells from './spells'

const InfuseWithBestialVigorEffect = {
  name: `Infuse with Bestial Vigour`,
  desc: `At the start of your movement phase, add 3" to the Move characteristic of models in friendly BRAYHERD units wholly within 12" of any friendly GREAT BRAY-SHAMANS until the end of that phase.`,
  when: [START_OF_MOVEMENT_PHASE],
}
const BloodgreedEffect = {
  name: `Bloodgreed`,
  desc: `Each unmodified wound roll of 6 for attacks made by this unit inflicts 1 mortal wound on the target in addition to any normal damage.`,
  when: [COMBAT_PHASE],
}
const BannerBearerEffect = {
  name: `Banner Bearer`,
  desc: `A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
  when: [COMBAT_PHASE, MOVEMENT_PHASE],
}
const BrayhornEffect = {
  name: `Brayhorn`,
  desc: `A unit that includes any Brayhorns can run and still charge later in the same turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const DespoilersEffect = {
  name: `Despoilers`,
  desc: `Add 1 to hit rolls for attacks made by this unit that target enemy units with 10 or more models. In addition, you can reroll hit rolls of 1 for attacks by this unit that target ORDER units.`,
  when: [COMBAT_PHASE],
}

const Units = {
  Beastlord: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Grisly Trophy'])],
    },
    effects: [
      {
        name: `Dual Axes`,
        desc: `You can reroll hit rolls of 1 for attacks made with Paired Man-ripper Axes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hatred of Heroes`,
        desc: `You can reroll failed wound rolls for attacks made by this model that target a HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Great Bray-Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Devolve'])],
    },
    effects: [
      InfuseWithBestialVigorEffect,
      {
        name: `Magic`,
        desc: `Great Bray-Shaman is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Devolve spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Gors: {
    effects: [
      BrayhornEffect,
      BannerBearerEffect,
      {
        name: `Rend and Tear`,
        desc: `You can reroll hit rolls of 1 for attacks made with a pair of Gor Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Beastshield`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Beastshields.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Anarchy and Mayhem`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons while it has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Ungors: {
    effects: [
      BrayhornEffect,
      BannerBearerEffect,
      {
        name: `Baying Hatred`,
        desc: `You can reroll hit rolls of 1 for attacks made by this unit while it has 20 or more models, or reroll hit rolls of 1 and 2 for attacks made by this unit while it has 30 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Half-shields`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Ungor Raiders': {
    effects: [
      BrayhornEffect,
      BannerBearerEffect,
      {
        name: `Vile Invaders`,
        desc: `After armies are set up, but before the first battle round begins, this unit can move up to 6".`,
        when: [END_OF_SETUP],
      },
      {
        name: `Baying Anger`,
        desc: `You can reroll hit rolls of 1 for attacks made by this unit with missile weapons while it has 20 or more models, or reroll hit rolls of 1 and 2 for attacks made by this unit with missile weapons while it has 30 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Bestigors: {
    effects: [
      BrayhornEffect,
      BannerBearerEffect,
      DespoilersEffect,
      {
        name: `Bestial Charge`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons in a turn in which it made a charge move.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Tuskgor Chariots': {
    effects: [
      {
        name: `Tuskgor Charge`,
        desc: `You can reroll charge rolls for this unit. In addition, add 1 to the Attacks characteristic of this unit's melee weapons in a turn in which it made a charge move.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      DespoilersEffect,
    ],
  },
  Doombull: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ["Slaughterer's Call"])],
    },
    effects: [BloodgreedEffect],
  },
  Cygor: {
    effects: [
      {
        name: `Soul-eater`,
        desc: `This model can attempt to unbind 2 spells in the enemy hero phase in the same manner as a WIZARD. In addition, each time it unbinds a spell, the caster suffers 1 mortal wound and you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ghostsight`,
        desc: `You can reroll failed hit rolls for attacks made by this model that target a WIZARD.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Ghorgon: {
    effects: [
      {
        name: `Ravenous Bloodgreed`,
        desc: `Each unmodified wound roll of 6 for attacks made by this model inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swallow Whole`,
        desc: `Each time this model attacks, you can pick an enemy model within 1" of this model after all of this model's attacks have been resolved and roll a D6. If the roll is equal to or greater than that enemy model's Wounds characteristic, it is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Bullgors: {
    effects: [
      {
        name: `Warherd Drummer`,
        desc: `Add 1 to charge rolls for a unit that includes any Warherd Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Warherd Banner Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit that includes any Warherd Banner Bearers for each enemy unit within 12" of that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      BloodgreedEffect,
      {
        name: `Dual Axes`,
        desc: `You can reroll hit rolls of 1 for attacks made with a pair of Bullgor Axes.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bullshields`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Bullshields.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Centigors: {
    effects: [
      BrayhornEffect,
      BannerBearerEffect,
      {
        name: `Beastbucklers`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Beastbucklers.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Charging Spear`,
        desc: `You can reroll failed wound rolls for attacks made with this unit's Centigor Spears if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Drunken Revelry`,
        desc: `At the start of your hero phase, you can say that this unit is drinking wildly. If you do so, until your next hero phase, add 1 to hit rolls for attacks made by this unit and attacks that target this unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Dragon Ogor Shaggoth': {
    mandatory: {
      spells: [keyPicker(Spells, ['Summon Lightning'])],
    },
    effects: [
      {
        name: `Beneath the Tempest`,
        desc: `If the roll-off at the start of a battle round to determine who takes the first turn is a tie, roll a D6 for each THUNDERSCORN unit on the battlefield. On a 4+ heal D3 wounds allocated to that unit.`,
        when: [START_OF_TURN],
      },
      {
        name: `Magic`,
        desc: `Dragon Ogor Shaggoth is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Summon Lightning spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dragon Ogors': {
    effects: [
      {
        name: `Storm Rage`,
        desc: `You can reroll hit rolls of 1 for this unit while it is wholly within 12" of a friendly DRAGON OGOR SHAGGOTH.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Chaos Warhounds': {
    effects: [
      {
        name: `Outrunners of Chaos`,
        desc: `In your movement phase, if you declare that this unit will run, do not make a run roll. Instead, add 6" to the Move characteristic of all models in this unit for that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Jabberslythe: {
    effects: [
      {
        name: `Aura of Madness`,
        desc: `At the start of your hero phase, roll a D6 for each enemy unit that is within 6" of any friendly JABBERSLYTHES . On a 6 that unit cannot attempt to cast or unbind spells, move, or attack until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Spurting Bile Blood`,
        desc: `Roll a D6 each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Cockatrice: {
    effects: [
      {
        name: `Petrifying Gaze`,
        desc: `Do not use the attack sequence for an attack made with a Cockatrice's Petrifying Gaze. Instead, roll a D6. On a 4+ the target suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Maddened Ferocity`,
        desc: `A Cockatrice has an Attacks characteristic of 8 instead of 4 with its Sword-like Talons if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Chimera: {
    effects: [
      {
        name: `Draconic Head's Fiery Breath`,
        desc: `Do not use the attack sequence for an attack made with a Chimera's Fiery Breath. Instead the target suffers the number of mortal wounds shown on the Damage table above.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Vicious Charge`,
        desc: `Add 2 to charge rolls for this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Chaos Gargant': {
    effects: [
      ...GenericBattleTraits.Gargant,
      {
        name: `Stuff 'Em In Me Bag`,
        desc: `After this model piles in, you can pick an enemy model within 3" of this model and roll a D6. If the roll is equal to or greater than double that enemy model's Wounds characteristic, it is slain.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Drunken Stagger`,
        desc: `If a charge roll for this model is a double, this model cannot make a charge move that phase. In addition, the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Whipped into a Frenzy`,
        desc: `At the start of the combat phase, if this model is within 3" of any friendly BEASTS OF CHAOS HEROES, you can whip it into a frenzy. If you do so, this model suffers 1 mortal wound, but you can add 1 to the Attacks characteristic of this model's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Razorgors: {
    effects: [
      {
        name: `Uncontrollable Stampede`,
        desc: `You can reroll charge rolls for this unit. In addition, if this unit made a charge move in the same turn, an unmodified hit roll of 6 for an attack made by this unit inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Tzaangor Skyfires': {
    effects: [
      {
        name: `Guided by the Future`,
        desc: `In the combat phase, you can reroll hit and wound rolls for attacks made by this unit if no enemy units within 3" of this unit have already fought in that phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Judgement from Afar`,
        desc: `An unmodified hit roll of 6 for an attack made with an Arrow of Fate inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Tzaangor Shaman': {
    mandatory: {
      spells: [keyPicker(Spells, ['Boon of Mutation'])],
    },
    effects: [
      {
        name: `Sorcerous Elixir`,
        desc: `Once per battle, in your hero phase, this model can attempt to cast one additional spell. If it does so, you can reroll the casting roll for that spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Visions of the Future`,
        desc: `Add 1 to hit rolls for attacks made with a friendly TZAANGOR SKYFIRE unit's Arrows of Fate while that unit is wholly within 12" of a friendly TZAANGOR SHAMAN.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Visions of the Past`,
        desc: `Add 1 to hit rolls for attacks made with a friendly TZAANGOR ENLIGHTENED unit's Tzeentchian Spears and Vicious Beaks while that unit is wholly within 12" of a friendly TZAANGOR SHAMAN.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Boon of Mutation spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzaangor Enlightened': {
    effects: [
      {
        name: `Babbling Stream of Secrets`,
        desc: `If an enemy unit fails a battleshock test within 9" of any friendly TZAANGOR ENLIGHTENED units, add 1 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Guided by the Past`,
        desc: `In the combat phase, you can reroll hit and wound rolls for attacks made by this unit if any enemy units within 3" of this unit have already fought in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Tzaangors: {
    effects: [
      {
        name: `Twistbray`,
        desc: `The leader of this unit is a Twistbray. Add 1 to hit rolls for attacks made with a Twistbray's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Icon Bearers`,
        desc: `While this unit has any Icon Bearers, it can use the Ornate Totems ability.`,
        when: [START_OF_HERO_PHASE],
      },
      BrayhornEffect,
      {
        name: `Destined Mayhem`,
        desc: `Add 1 to wound rolls for attacks made by this unit with melee weapons while this unit is wholly within 12" of any friendly ARCANITE HEROES.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Arcanite Shield`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a unit that has any models armed with Arcanite Shields. On a 6, that wound or mortal wound is negated. When you allocate wounds or mortal wounds to this unit, you must allocate them to a model armed with an Arcanite Shield if it is possible to do so.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Paired Savage Blades`,
        desc: `Add 1 to hit rolls for attacks made with a pair of Savage Blades.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savagery Unleashed`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if it has at least 9 models when the attacks are being made.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ornate Totems`,
        desc: `While this unit has one or more Icon Bearers, at the start of your hero phase you can pick an enemy unit within 18" of this unit and visible to it. Then, roll a number of dice equal to the number of WIZARD units that are within 9" of this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Grashrak Fellhoof': {
    mandatory: {
      spells: [keyPicker(Spells, ['Savage Bolt'])],
    },
    effects: [InfuseWithBestialVigorEffect],
  },
  "Grashrak's Despoilers": {
    effects: [
      {
        name: `Violent Despoilers`,
        desc: `Add 1 to hit rolls for attacks made by the Despoilers' unit while it is wholly within enemy territory.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Grashrak's Savage Herd`,
        desc: `Roll a D6 for each wound or mortal wound Grashrak suffers while he is within 3" of Grashrak's Despoilers. On a 4+ the Despoilers take that wound or mortal wound instead.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs({ ...Units }, 'unit')
