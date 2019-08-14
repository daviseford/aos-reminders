import { TBattalions, TUnits } from 'types/army'
import { 
  HERO_PHASE, 
  START_OF_MOVEMENT_PHASE, 
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Beastlord`,
    effects: [
      {
        name: `Dual Axes`,
        desc: `You can re-roll hit rolls of 1 for attacks made with Paired Man-ripper Axes.`,
        when: [],
      },
      {
        name: `Hatred of Heroes`,
        desc: `You can re-roll failed wound rolls for attacks made by this model that target a HERO.`,
        when: [],
      },
      {
        name: `Grisly Trophy`,
        desc: `You can use this command ability in the combat phase if any attacks made by a friendly BEASTLORD with this command ability resulted in an enemy model being slain that phase. If you do so, until the end of that phase, you can re-roll wound rolls for attacks made by friendly BRAYHERD units wholly within 18" of that BEASTLORD . If any attacks made by that BEASTLORD resulted in an enemy HERO or MONSTER being slain that phase, you can re-roll both hit rolls and wound rolls for attacks made by friendly BRAYHERD units wholly within 18" of that BEASTLORD instead.`,
        when: [],
        command_ability: true,
      }
    ],
  },
  {
    name: `Great Bray-Shaman`,
    effects: [
      {
        name: `Infuse with Bestial Vigour`,
        desc: `At the start of your movement phase, add 3" to the Move characteristic of models in friendly BRAYHERD units wholly within 12" of any friendly GREAT BRAY-SHAMANS until the end of that phase.`,
        when: [],
      },
      {
        name: `Magic`,
        desc: `Great Bray-Shaman is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Devolve spells.`,
        when: [],
      },
      {
        name: `Devolve`,
        desc: `Devolve has a casting value of 7. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them and not within 3" of any friendly units. Your opponent must move that unit up to 2D6" so that each model in the unit ends its move as close as possible to a model from the friendly unit that was closest to it at the start of the move.`,
        when: [],
      },
    ],
  },
  {
    name: `Gors`,
    effects: [
      {
        name: `Foe-Render`,
        desc: `The leader of this unit is a Foe-render. Add 1 to the Attacks characteristic of a Foe-render’s Gor Blade(s).`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 10 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 10 models in this unit can be a Banner Bearer. A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
        when: [],
      },
      {
        name: `Rend and Tear`,
        desc: `You can re-roll hit rolls of 1 for attacks made with a pair of Gor Blades.`,
        when: [],
      },
      {
        name: `Beastshield`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Beastshields.`,
        when: [],
      },
      {
        name: `Anarchy and Mayhem`,
        desc: `Add 1 to the Attacks characteristic of this unit’s melee weapons while it has 20 or more models.`,
        when: [],
      },
    ],
  },
  {
    name: `Ungors`,
    effects: [
      {
        name: `Halfhorn`,
        desc: `The leader of this unit is a Halfhorn. Add 1 to the Attacks characteristic of a Halfhorn’s Ungor Blade or Gnarled Shortspear.`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 10 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 10 models in this unit can be a Banner Bearer. A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
        when: [],
      },
      {
        name: `Baying Hatred`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this unit while it has 20 or more models, or re-roll hit rolls of 1 and 2 for attacks made by this unit while it has 30 or more models.`,
        when: [],
      },
      {
        name: `Half-shields`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
        when: [],
      },
    ],
  },
  
  {
    name: `Ungor Raiders`,
    effects: [
      {
        name: `Halfhorn`,
        desc: `The leader of this unit is a Halfhorn. Add 1 to the Attacks characteristic of a Halfhorn’s Ungor Blade or Gnarled Shortspear.`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 10 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 10 models in this unit can be a Banner Bearer. A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
        when: [],
      },
      {
        name: `Vile Invaders`,
        desc: `After armies are set up, but before the first battle round begins, this unit can move up to 6".`,
        when: [],
      },
      {
        name: `Baying Anger`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this unit with missile weapons while it has 20 or more models, or re-roll hit rolls of 1 and 2 for attacks made by this unit with missile weapons while it has 30 or more models.`,
        when: [],
      },
    ],
  },
  {
    name: `Bestigors`,
    effects: [
      {
        name: `Gouge-Horn`,
        desc: `The leader of this unit is a Gouge-horn. Add 1 to the Attacks characteristic of a Gouge-horn’s Despoiler Axe.`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 10 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 10 models in this unit can be a Banner Bearer. A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
        when: [],
      },
      {
        name: `Despoilers`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target enemy units with 10 or more models. In addition, you can re-roll hit rolls of 1 for attacks by this unit that target ORDER units.`,
        when: [],
      },
      {
        name: `Bestial Charge`,
        desc: `Add 1 to the Attacks characteristic of this unit’s melee weapons in a turn in which it made a charge move.`,
        when: [],
      },
    ],
  },
  {
    name: `Tuskgor Chariots`,
    effects: [
      {
        name: `Tuskgor Charge`,
        desc: `You can re-roll charge rolls for this unit. In addition, add 1 to the Attacks characteristic of this unit’s melee weapons in a turn in which it made a charge move.`,
        when: [],
      },
      {
        name: `Despoilers`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target enemy units with 10 or more models. In addition, you can re-roll hit rolls of 1 for attacks by this unit that target ORDER units.`,
        when: [],
      },
    ],
  },
  {
    name: `Doombull`,
    effects: [
      {
        name: `Bloodgreed`,
        desc: `Each unmodified wound roll of 6 for attacks made by this unit inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [],
      },
      {
        name: `Slaughterer’s Call`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly WARHERD unit wholly within 12" of a friendly model with this command ability. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
        when: [],
        command_ability: true,
      },
    ],
  },
  {
    name: `Cygor`,
    effects: [
      {
        name: `Soul-eater`,
        desc: `This model can attempt to unbind 2 spells in the enemy hero phase in the same manner as a WIZARD. In addition, each time it unbinds a spell, the caster suffers 1 mortal wound and you can heal 1 wound allocated to this model.`,
        when: [],
      },
      {
        name: `Ghostsight`,
        desc: `You can re-roll failed hit rolls for attacks made by this model that target a WIZARD.`,
        when: [],
      },
    ],
  },
  {
    name: `Ghorgon`,
    effects: [
      {
        name: `Ravenous Bloodgreed`,
        desc: `Each unmodified wound roll of 6 for attacks made by this model inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [],
      },
      {
        name: `Swallow Whole`,
        desc: `Each time this model attacks, you can pick an enemy model within 1" of this model after all of this model’s attacks have been resolved and roll a dice. If the roll is equal to or greater than that enemy model’s Wounds characteristic, it is slain.`,
        when: [],
      },
    ],
  },
  {
    name: `Bullgors`,
    effects: [
      {
        name: `Bloodkine`,
        desc: `The leader of this unit is a Bloodkine. Add 1 to the Attacks characteristic of a Bloodkine’s Bullgor Axe(s) or Bullgor Great Axe.`,
        when: [],
      },
      {
        name: `Warherd Drummer`,
        desc: `1 in every 3 models in this unit can be a Warherd Drummer. Add 1 to charge rolls for a unit that includes any Warherd Drummers.`,
        when: [],
      },
      {
        name: `Warherd Banner Bearer`,
        desc: `1 in every 3 models in this unit can be a Warherd Banner Bearer. Add 1 to the Bravery characteristic of a unit that includes any Warherd Banner Bearers for each enemy unit within 12" of that unit.`,
        when: [],
      },
      {
        name: `Bloodgreed`,
        desc: `Each unmodified wound roll of 6 for attacks made by this unit inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [],
      },
      {
        name: `Dual Axes`,
        desc: `You can re-roll hit rolls of 1 for attacks made with a pair of Bullgor Axes.`,
        when: [],
      },
      {
        name: `Bullshields`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Bullshields.`,
        when: [],
      },
    ],
  },
  {
    name: `Centigors`,
    effects: [
      {
        name: `Gorehoof`,
        desc: `The leader of this unit is a Gorehoof. Add 1 to the Attacks characteristic of a Gorehoof’s Centigor Spear.`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 5 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Banner Bearer`,
        desc: `1 in every 5 models in this unit can be a Banner Bearer. A unit that includes any Banner Bearers can move an extra 1" when it runs or piles in.`,
        when: [],
      },
      {
        name: `Beastbucklers`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target a unit with Beastbucklers.`,
        when: [],
      },
      {
        name: `Charging Spear`,
        desc: `You can re-roll failed wound rolls for attacks made with this unit’s Centigor Spears if it made a charge move in the same turn.`,
        when: [],
      },
      {
        name: `Drunken Revelry`,
        desc: `At the start of your hero phase, you can say that this unit is drinking wildly. If you do so, until your next hero phase, add 1 to hit rolls for attacks made by this unit and attacks that target this unit.`,
        when: [],
      },
    ],
  },
  {
    name: `Dragon Ogor Shaggoth`,
    effects: [
      {
        name: `Beneath the Tempest`,
        desc: `If the roll-off at the start of a battle round to determine who takes the first turn is a tie, roll a dice for each THUNDERSCORN unit on the battlefield. On a 4+ heal D3 wounds allocated to that unit.`,
        when: [],
      },
      {
        name: `Magic`,
        desc: `Dragon Ogor Shaggoth is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Summon Lightning spells.`,
        when: [],
      },
      {
        name: `Summon Lightning`,
        desc: `Summon Lightning has a casting value of 7. If successfully cast, pick a friendly THUNDERSCORN unit wholly within 20" of the caster and visible to them. You can heal D3 wounds allocated to that unit. In addition, you can re-roll failed wound rolls for attacks made by that unit until your next hero phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Dragon Ogors`,
    effects: [
      {
        name: `Storm Rage`,
        desc: `You can re-roll hit rolls of 1 for this unit while it is wholly within 12" of a friendly DRAGON OGOR SHAGGOTH.`,
        when: [],
      },
    ],
  },
  {
    name: `Cahos Warhounds`,
    effects: [
      {
        name: `Outrunners of Chaos`,
        desc: `In your movement phase, if you declare that this unit will run, do not make a run roll. Instead, add 6" to the Move characteristic of all models in this unit for that phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Chaos Spawn`,
    effects: [
      {
        name: `Curse of the Dark Gods`,
        desc: `You can choose one of the following keywords for this unit the first time it is set up: KHORNE, NURGLE, SLAANESH or TZEENTCH.`,
        when: [],
      },
      {
        name: `Writhing Tentacles`,
        desc: `If you roll a double when determining the number of attacks made by a CHAOS SPAWN ’s Freakish Mutations, add 1 to hit and wound rolls for attacks made by that model until the end of the phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Jabberslythe`,
    effects: [
      {
        name: `Aura of Madness`,
        desc: `At the start of your hero phase, roll a dice for each enemy unit that is within 6" of any friendly JABBERSLYTHES . On a 6 that unit cannot attempt to cast or unbind spells, move, or attack until the start of your next hero phase.`,
        when: [],
      },
      {
        name: `Spurting Bile Blood`,
        desc: `Roll a dice each time a wound is allocated to this model that was inflicted by a melee weapon. On a 4+ the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [],
      },
    ],
  },
  {
    name: `Cockatrice`,
    effects: [
      {
        name: `Petrifying Gaze`,
        desc: `Do not use the attack sequence for an attack made with a Cockatrice’s Petrifying Gaze. Instead, roll a dice. On a 4+ the target suffers D6 mortal wounds.`,
        when: [],
      },
      {
        name: `Maddened Ferocity`,
        desc: `A Cockatrice has an Attacks characteristic of 8 instead of 4 with its Sword-like Talons if it made a charge move in the same turn.`,
        when: [],
      },
    ],
  },
  {
    name: `Chimera`,
    effects: [
      {
        name: `Draconic Head’s Fiery Breath`,
        desc: `Do not use the attack sequence for an attack made with a Chimera’s Fiery Breath. Instead the target suffers the number of mortal wounds shown on the Damage table above.`,
        when: [],
      },
      {
        name: `Vicious Charge`,
        desc: `Add 2 to charge rolls for this model`,
        when: [],
      },
    ],
  },
  {
    name: `Chaos Gargant`,
    effects: [
      {
        name: `Timber!`,
        desc: `If this model is slain, before removing the model from the battlefield the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds. This model is then removed from the battlefield.`,
        when: [],
      },
      {
        name: `Stuff ’Em In Me Bag`,
        desc: `After this model piles in, you can pick an enemy model within 3" of this model and roll a dice. If the roll is equal to or greater than double that enemy model’s Wounds characteristic, it is slain.`,
        when: [],
      },
      {
        name: `Drunken Stagger`,
        desc: `If a charge roll for this model is a double, this model cannot make a charge move that phase. In addition, the players must roll off. The player who wins the roll-off picks a point on the battlefield 3" from this model. Each unit within 2" of that point suffers D3 mortal wounds.`,
        when: [],
      },
      {
        name: `Whipped into a Frenzy`,
        desc: `At the start of the combat phase, if this model is within 3" of any friendly BEASTS OF CHAOS HEROES, you can whip it into a frenzy. If you do so, this model suffers 1 mortal wound, but you can add 1 to the Attacks characteristic of this model’s melee weapons until the end of that phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Razorgors`,
    effects: [
      {
        name: `Uncontrollable Stampede`,
        desc: `You can re-roll charge rolls for this unit. In addition, if this unit made a charge move in the same turn, an unmodified hit roll of 6 for an attack made by this unit inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [],
      },
    ],
  },
  {
    name: `Tzaangor Skyfires`,
    effects: [
      {
        name: `Guided by the Future`,
        desc: `In the combat phase, you can re-roll failed hit and wound rolls for attacks made by this unit if no enemy units within 3" of this unit have already fought in that phase.`,
        when: [],
      },
      {
        name: `Judgement from Afar`,
        desc: `An unmodified hit roll of 6 for an attack made with an Arrow of Fate inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll).`,
        when: [],
      },
    ],
  },
  {
    name: `Tzaangor Shaman`,
    effects: [
      {
        name: `Sorcerous Elixir`,
        desc: `Once per battle, in your hero phase, this model can attempt to cast one additional spell. If it does so, you can re-roll one or both of the dice when you make the casting roll for that spell.`,
        when: [],
      },
      {
        name: `Visions of the Future`,
        desc: `Add 1 to hit rolls for attacks made with a friendly TZAANGOR SKYFIRE unit’s Arrows of Fate while that unit is wholly within 12" of a friendly TZAANGOR SHAMAN.`,
        when: [],
      },
      {
        name: `Visions of the Past`,
        desc: `Add 1 to hit rolls for attacks made with a friendly TZAANGOR ENLIGHTENED unit’s Tzeentchian Spears and Vicious Beaks while that unit is wholly within 12" of a friendly TZAANGOR SHAMAN.`,
        when: [],
      },
      {
        name: `Magic`,
        desc: `This model is a WIZARD. It can attempt to cast one spell in your hero phase, and attempt to unbind one spell in the enemy hero phase. It knows the Arcane Bolt, Mystic Shield and Boon of Mutation spells.`,
        when: [],
      },
      {
        name: `Boon of Mutation`,
        desc: `Boon of Mutation has a casting value of 7. If successfully cast, pick an enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. For each enemy model slain by these mortal wounds, you can add 1 new TZAANGOR model to a single friendly TZAANGORS unit. Each new TZAANGOR model must be set up wholly within 12" of the caster and within 1" of the unit they are being added to.`,
        when: [],
      },
    ],
  },
  {
    name: `Tzaangor Enlightened`,
    effects: [
      {
        name: `Babbling Stream of Secrets`,
        desc: `If an enemy unit fails a battleshock test within 9" of any friendly TZAANGOR ENLIGHTENED units, add 1 to the number of models that flee.`,
        when: [],
      },
      {
        name: `Guided by the Past`,
        desc: `In the combat phase, you can re-roll failed hit and wound rolls for attacks made by this unit if one or more enemy units within 3" of this unit have already fought in that phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Tzaangors`,
    effects: [
      {
        name: `Tzaangor Mutant`,
        desc: `1 in every 5 models in this unit can be a Tzaangor Mutant armed with a pair of Savage Blades and a Vicious Beak. Add 1 to the Attacks characteristic of a Tzaangor Mutant’s pair of Savage Blades.`,
        when: [],
      },
      {
        name: `Twistbray`,
        desc: `The leader of this unit is a Twistbray. Add 1 to hit rolls for attacks made with a Twistbray’s melee weapons.`,
        when: [],
      },
      {
        name: `Icon Bearers`,
        desc: `1 in every 10 models in this unit can be an Icon Bearer. While this unit has any Icon Bearers, it can use the Ornate Totems ability.`,
        when: [],
      },
      {
        name: `Brayhorn`,
        desc: `1 in every 10 models in this unit can have a Brayhorn. A unit that includes any Brayhorns can run and still charge later in the same turn.`,
        when: [],
      },
      {
        name: `Destined Mayhem`,
        desc: `Add 1 to wound rolls for attacks made by this unit with melee weapons while this unit is wholly within 12" of any friendly ARCANITE HEROES.`,
        when: [],
      },
      {
        name: `Arcanite Shield`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly TZAANGORS unit that has any models armed with Arcanite Shields. On a 6+ that wound or mortal wound is negated.`,
        when: [],
      },
      {
        name: `Paired Savage Blades`,
        desc: `Add 1 to hit rolls for attacks made with a pair of Savage Blades.`,
        when: [],
      },
      {
        name: `Savagery Unleashed`,
        desc: `Add 1 to the Attacks characteristic of this unit’s melee weapons if it has at least 9 models when the attacks are being made.`,
        when: [],
      },
      {
        name: `Ornate Totems`,
        desc: `While this unit has one or more Icon Bearers, at the start of your hero phase you can pick an enemy unit within 18" of this unit and visible to it. Then, roll a number of dice equal to the number of WIZARD units that are within 9" of this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Marauding Brayherd`,
    effects: [
      {
        name: `Ferocious Despoilers`,
        desc: `Add 1 to charge rolls for friendly BRAYHERD units from this battalion that were set up on the battlefield during the same turn.`,
        when: [],
      },
    ],
  },
  {
    name: `Hungering Warherd`,
    effects: [
      {
        name: `Bloodscent`,
        desc: `Units from this battalion can move an extra 3" when they pile in.`,
        when: [],
      },
    ],
  },
  {
    name: `Thuderscorn Stormherd`,
    effects: [
      {
        name: `Raging Storm`,
        desc: `In your hero phase, you can roll a dice for each unit from this battalion that is on the battlefield. On a 4+ you can heal 1 wound allocated to that unit.
        After rolling a dice for each unit from this battalion, roll a dice for each enemy unit within 1" of any models from this battalion. On a 4+ that enemy unit suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  {
    name: `Desolating Beastherd`,
    effects: [
      {
        name: `Bringers of the Wild`,
        desc: `If the unmodified hit roll for an attack made by a unit from this battalion that is wholly within enemy territory is 6, that attack scores 2 hits on that target instead of 1. Make a wound and save roll for each hit.`,
        when: [],
      },
    ],
  },
  {
    name: `Brass Despoilers`,
    effects: [
      {
        name: `Martial Ferocity`,
        desc: `You can re-roll hit rolls of 1 for attacks made by units from this battalion while they are wholly within 9" of another unit from the same battalion. In addition, once per battle, in your hero phase, you can choose to unleash this battalion’s bestial rage. If you do so, until your next hero phase you can re-roll failed wound rolls for attacks made by units from this battalion while they are wholly within 9" of another unit from the same battalion`,
        when: [],
      },
      {
        name: `Followers of the Brass Bull`,
        desc: `Units from this battalion gain the KHORNE keyword.`,
        when: [],
      },
    ],
  },
  {
    name: `Phantasmagoria of Fate`,
    effects: [
      {
        name: `Devourers of the Arcane`,
        desc: `Units from this battalion that do not have the WIZARD keyword can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD if they are within 9" of the caster.`,
        when: [],
      },
      {
        name: `Covens of the Changer`,
        desc: `Units from this battalion gain the TZEENTCH keyword.`,
        when: [],
      },
    ],
  },
  {
    name: `Pestilent Throng`,
    effects: [
      {
        name: `Entropic Deluge`,
        desc: `If a unit from this battalion is destroyed, roll a dice for each enemy unit within 7". On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [],
      },
      {
        name: `Vectors of the Plague God`,
        desc: `Units from this battalion gain the NURGLE keyword`,
        when: [],
      },
    ],
  },
  {
    name: `Depraved Drove`,
    effects: [
      {
        name: `Covetous Fury`,
        desc: `You can re-roll failed charge rolls made for units from this battalion while they are within 12" of an enemy HERO with an artefact of power. In addition, you can re-roll hit rolls for attacks made with melee weapons by models from this battalion that target an enemy HERO with an artefact of power`,
        when: [],
      },
      {
        name: `Marked by the Decadent Fiend`,
        desc: `Units from this battalion gain the SLAANESH keyword.`,
        when: [],
      },
    ],
  },
]
