import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Branchwraith`,
    effects: [
      {
        name: `Blessings of the Forest`,
        desc: `Subtract 1 from all hit rolls made against a Branchwraith if she is within 3" of a Sylvaneth Wyldwood.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Branchwych`,
    effects: [
      {
        name: `Fury of the Forest`,
        desc: `Add 1 to all hit rolls made for Branchwych while she is within 3" of a Sylvaneth Wyldwood.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Quick-tempered`,
        desc: `If a Branchwych is wounded in the combat phase, she makes 4 attacks rather than 2 with her Greenwood Scythe for the rest of the phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spirit of Durthu`,
    effects: [
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of any models with this ability. On a roll of 4 or more, that unit is knocked off their feet by the impact and must subtract 1 from all hit rolls in that combat phase as they regain their footing.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If the Spirit of Durthu's Massive Impaling Talons inflict a wound on an enemy model, roll a dice. If the result exceeds the number of wounds the enemy model has remaining, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `If a Spirit of Durthu is within 3" of a Sylvaneth Wyldwood at the start of your movement phase, he can travel along the spirit paths. If he does so, remove the Spirit of Durthu from the battlefield, and then set him up within 3" of a different Sylvaneth Wyldwood, more than 9" from any enemy models. This is his move for the movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Guardian Sword`,
        desc: `The Spirit of Durthu makes an extra D3 attacks with the Guardian Sword if he is within 3" of a Sylvaneth Wyldwood when he attacks in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Champions of the Everqueen's Will`,
        desc: `All friendly SYLVANETH units that are within 8" of any Spirits of Durthu in the battleshock phase add 1 to their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Verdant Blast`,
        desc: `When a Spirit of Durthu attacks with a Verdant Blast, you can declare that he will channel his life-force to intensify its power. Add 2 to the weapon's Attacks for the rest of the turn. If the Spirit of Durthu uses this ability, he suffers D3 mortal wounds at the end of the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Solemn Guardian`,
        desc: `If an attack that targets a friendly SYLVANETH HERO within 6" of a Spirit of Durthu causes a wound, roll a dice. On a result of 4 or more the wound is inflicted on the Spirit of Durthu instead (you can make a save roll as normal).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Drycha`,
    effects: [
      {
        name: `Mercurial Aspect`,
        desc: `At the start of each battle round, after rolling to see who takes the first turn, roll a dice. On a result of 1-3, Drycha is enraged, while on a 4-6 she is embittered. Her mood lasts until the end of the battle round.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Song of Spite`,
        desc: `You can re-roll wound rolls of 1 for Spite-Revenants whilst their unit is within 10" of Drycha Hamadreth.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Alarielle the Everqueen`,
    effects: [
      {
        name: `Talon of the Dwindling`,
        desc: `At the end of the combat phase, roll two dice for each model that suffered wounds from the Talon of the Dwindling but was not slain. If the result exceeds the model's Wounds characteristic, or if you roll two sixes, the model is slain.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Lifebloom`,
        desc: `In each of your hero phases, Alarielle calls upon the restorative energies of her realm and heals D3 wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `When the Wardroth Beetle attacks with its Great Antlers, you can add 1 to the hit rolls if the target unit has five or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Living Battering Ram`,
        desc: `If Alarielle ends a charge move within 1" of a terrain feature, each other unit within or on that terrain feature suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Soul Amphorae`,
        desc: `In your hero phase, you can heal D3 wounds allocated to each Sylvaneth model within 30" of Alarielle. Once per battle, in your hero phase, instead of using this ability to heal, you can summon 1 unit from the list on her warscroll to the battlefield, and add it to your army. The summoned unit must be set up wholly within 9" of Alarielle and more than 9" from any enemy units. That unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ghyran's Wrath`,
        desc: `Alarielle can use this ability once per battle. When she does so, you can re-roll all failed wound rolls made for friendly SYLVANETH models until your next hero phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Treelord Ancient`,
    effects: [
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of any models with this ability. On a roll of 4 or more, that unit is knocked off their feet by the impact and must subtract 1 from all hit rolls in that combat phase as they regain their footing.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If a Treelord Ancient's Massive Impaling Talons inflict a wound on an enemy model, roll a dice. If the result exceeds the number of wounds the enemy model has remaining, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `If a Treelord Ancient is within 3" of a Sylvaneth Wyldwood at the start of your movement phase, they can travel along the spirit paths. If they do so, remove the Treelord Ancient from the battlefield, and then set them up within 3" of a different Sylvaneth Wyldwood, more than 9" from any enemy models. This is their move for the movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Silent Communion`,
        desc: `In your hero phase, you can pick 1 friendly Treelord Ancient and roll a dice. On a 4+, you can set up 1 Sylvaneth Wyldwood terrain feature wholly within 24" of that Treelord Ancient, and more than 3" from any other models or terrain features.`,
        when: [HERO_PHASE],
      },
      {
        name: `Heed the Spirit-song`,
        desc: `Until your next hero phase, you can re-roll save rolls of 1 for SYLVANETH units if they are within 10" of the Treelord Ancient.`,
        when: [DURING_GAME],
        command_ability: true,
      },
    ],
  },
  {
    name: `Dryads`,
    effects: [
      {
        name: `Blessings of the Forest`,
        desc: `Subtract 1 from all hit rolls made against Dryads if it is within 3" of a Sylvaneth Wyldwood.`,
        when: [DURING_GAME],
      },
      {
        name: `Enrapturing Song`,
        desc: `In your own combat phase, you can enrapture one enemy unit that is within 3" of a unit of Dryads. You can add 1 to the hit rolls made for these Dryads against the enraptured unit in that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Impenetrable Thicket`,
        desc: `You can add 1 to the result of save rolls for a Dryad unit if it includes at least 12 models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Kurnoth Hunters (Scythes/Greatbows)`,
    effects: [
      {
        name: `Tanglethorn Thicket`,
        desc: `At the start of the charge phase, you can say that this unit will sprout thorned branches. If you do so, until the end of the turn, this unit cannot move except to pile in up to 1", but you can re-roll save rolls for attacks that target this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Envoys of the Everqueen`,
        desc: `If a friendly Sylvaneth Hero uses a command ability, friendly Sylvaneth units wholly within 12" of this unit are treated as being in range of that command ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Trample Underfoot`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Kurnoth Hunters (Greatswords)`,
    effects: [
      {
        name: `Tanglethorn Thicket`,
        desc: `At the start of the charge phase, you can say that this unit will sprout thorned branches. If you do so, until the end of the turn, this unit cannot move except to pile in up to 1", but you can re-roll save rolls for attacks that target this unit.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Sundering Strikes`,
        desc: `If the unmodified wound roll for an attack made with a Kurnoth Greatsword is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Envoys of the Everqueen`,
        desc: `If a friendly Sylvaneth Hero uses a command ability, friendly Sylvaneth units wholly within 12" of this unit are treated as being in range of that command ability.`,
        when: [DURING_GAME],
      },
      {
        name: `Trample Underfoot`,
        desc: `At the end of the combat phase, you can pick 1 enemy unit within 1" of this unit and roll 1 dice for each model in this unit. For each 4+ that enemy unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spite-Revenants`,
    effects: [
      {
        name: `Whispers in the Dark`,
        desc: `Scenery within 8" of any Spite-Revenants is haunted. Your opponent must roll two dice when taking battleshock tests for any of their units that are within 3" of such a terrain feature, and use the highest dice result.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Unbridled Malice`,
        desc: `Enemy units within 3" of any Spite-Revenants must subtract 1 from their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Tree-Revenants`,
    effects: [
      {
        name: `Glade Banner`,
        desc: `Models in a Tree-Revenants unit may bear Glade Banners. Models in a unit containing any Glade Banners can pile in up to 6".`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waypipes`,
        desc: `Models in a Tree-Revenants unit may play Waypipes. Instead of moving in the movement phase, a unit with any Waypipes can walk the spirit paths. Remove it from play, and set it up so that all its models are within 3" of a Sylvaneth Wyldwood or an edge of the battlefield, and more than 9" from the enemy.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Martial Memories`,
        desc: `Once per phase, you can re-roll a single dice for a unit of Tree-Revenants. This could be one of the dice you roll to see how far it charges, a hit roll, a save roll, a battleshock test, a roll to see whether a model is slain by deadly scenery etc.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Treelord`,
    effects: [
      {
        name: `Groundshaking Stomp`,
        desc: `At the start of the combat phase, roll a dice for each enemy unit within 3" of any models with this ability. On a roll of 4 or more, that unit is knocked off their feet by the impact and must subtract 1 from all hit rolls in that combat phase as they regain their footing.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Impale`,
        desc: `If a Treelord's Massive Impaling Talons inflict a wound on an enemy model, roll a dice. If the result exceeds the number of wounds the enemy model has remaining, it is slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit Paths`,
        desc: `If a Treelord is within 3" of a Sylvaneth Wyldwood at the start of your movement phase it can travel along the spirit paths. If it does so, remove the Treelord from the battlefield, and then set it up within 3" of a different Sylvaneth Wyldwood, more than 9" from any enemy models. This is its move for the movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Arch-Revenant`,
    effects: [
      {
        name: `Crescent Shield`,
        desc: `At the start of the combat phase, say whether this Arch-Revenant is using their shield for protection or to steady their weapon. If they use their shield for protection, you can reroll save rolls of 1 for attacks that target this model in that phase. If they use the shield to steady their weapon, you can re-roll hit rolls of 1 for attacks made with this model's Revenant's Glaive in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Champion of Kurnoth`,
        desc: `Re-roll hit rolls of 1 for attacks made by friendly Kurnoth Hunters units while they are wholly within 12" of this Arch-Revenant.`,
        when: [DURING_GAME],
      },
      {
        name: `Ultimate Sacrifice`,
        desc: `Once per battle, when you allocate a wound or mortal wound to this Arch-Revenant, you can choose to negate it. If you do so, this model cannot fly or use its Zephyrspite's Tail Pincers attack for the rest of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Call to Battle`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Sylvaneth unit wholly within 9" of a friendly model with this command ability, or wholly within 12" of a friendly model with this command ability that is your general. Add 1 to the Attacks characteristic of that unit's melee weapons in that combat phase. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Sylvaneth Wargrove`,
    effects: [
      {
        name: `Mighty Wyldwood`,
        desc: `If your army has the SYLVANETH allegiance and includes a Sylvaneth Wargrove, then the Wyldwood Groves ability allows you to set up one additional Sylvaneth Wyldwood.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Mighty Wyldwood`,
        desc: `Each time one of your units uses the Navigate Realmroots ability, add 1 to the dice result.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Winterleaf Wargrove`,
    effects: [
      {
        name: `Surrounded by Devastation`,
        desc: `Any SYLVANETH Winterleaf units that are set up in a hidden enclave at the start of the battle (see the Forest Spirits rule), can be set up within 3" of an Ophidian Archway and more than 9" from any enemy models, in addition to the other ways it can be set up. This is their move for that movement phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Embittered by War`,
        desc: `Each time you make a hit roll of 6 or more for a Winterleaf Dryad, it can immediately make one additional attack with its Wracking Talons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revenge Against Chaos`,
        desc: `You can re-roll hit and wound rolls of 1 for any attack made by a SYLVANETH Winterleaf unit upon a CHAOS unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revenge Against Chaos`,
        desc: `You can re-roll hit and wound rolls of 1 for any attack made by a SYLVANETH Winterleaf unit upon a CHAOS unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ironbark Wargrove`,
    effects: [
      {
        name: `Stubborn and Taciturn`,
        desc: `Halve the number of casualties when working out the result of a battleshock test for a SYLVANETH Ironbark unit, rounding fractions up. For example, if an Ironbark unit suffered 3 casualties, then 2 would be added to its battleshock test rather than 3.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Master-crafted Weapons`,
        desc: `You can re-roll wound rolls of 1 for the enchanted blades, protector glaives or greenwood scythes used by Ironbark Tree-Revenants and Branchwyches.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dreadwood Wargrove`,
    effects: [
      {
        name: `Malicious Tormentors`,
        desc: `You can re-roll wound rolls of 1 for attacks made by Dreadwood Spite-Revenants.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Subterfuge`,
        desc: `Roll a dice at the start of the first battle round; on a 1 or 2 you can use one of the following stratagems, on a 3 or 4 you can use two of them, and on a 5 or 6 you can use all three:
          
        Ambush: A Dreadwood unit can be redeployed anywhere on the battlefield that is more than 6" from an enemy unit.
          
        Hidden Attackers: The maximum range of enemy attacks, abilities and spells against Dreadwood units is limited to 12" during the first round of the battle.
          
        Sneak Attack: Up to 3 Dreadwood units can immediately move as if it were the movement phase (they cannot run).`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Heartwood Wargrove`,
    effects: [
      {
        name: `Worshippers of Kurnoth`,
        desc: `Add 1 to the Bravery of any Heartwood units that are within 6" of a friendly unit of Kurnoth Hunters. This bonus does not apply to units of Kurnoth Hunters themselves.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Followers of the Wild Hunt`,
        desc: `Roll a dice in each of your hero phases, adding 1 to the roll if there are any friendly units of Kurnoth Hunters on the battlefield. On a roll of 6 or more you can replace a unit of Heartwood Dryads, Tree-Revenants, or Spite-Revenants that has been completely destroyed with an identical unit. Set up the replacement unit within 6" of the edge of the battlefield or within a Sylvaneth Wyldwood, and more than 9" from any enemy units. This counts as its move for the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gnarlroot Wargrove`,
    effects: [
      {
        name: `Seekers of Knowledge`,
        desc: `A Gnarlroot Treelord Ancient, Branchwych or Branchwraith is allowed to attempt to cast one extra spell in each of their hero phases, and unbind one extra spell in each enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Oakenbrow Wargrove`,
    effects: [
      {
        name: `Noble Spirits`,
        desc: `Oakenbrow Treelords and Treelord Ancients have a Wounds characteristic of 13.`,
        when: [DURING_GAME],
      },
      {
        name: `Mighty Hosts`,
        desc: `Once during the battle, in your hero phase, you can replace a unit of Oakenbrow Dryads or Tree-Revenants that has been completely destroyed with an identical unit. Set up the replacement unit within 6" of the edge of the battlefield or within a Sylvaneth Wyldwood, and more than 9" from any enemy models. This counts as its move for the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Harvestboon Wargrove`,
    effects: [
      {
        name: `Chorus of Magic`,
        desc: `Add 1 to casting rolls for Harvestboon Branchwraiths.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vibrant Surge`,
        desc: `Add 1 to any run rolls made for Harvestboon units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Vibrant Surge`,
        desc: `Add 1 to any charge rolls made for Harvestboon units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Outcasts`,
    effects: [
      {
        name: `Fear the Forest-kin`,
        desc: `In your hero phase, roll two dice for each enemy unit that is within 8" of at least two units from this battalion. For each point by which the total dice roll exceeds the unit's Bravery, the unit suffers a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Free Spirits`,
    effects: [
      {
        name: `Swift Vengeance`,
        desc: `In your hero phase, you can pick either an enemy unit or a terrain feature, and then move each unit from the Free Spirits as though it were the movement phase (they cannot run). They must end their move closer to the chosen unit or terrain feature than they were before they moved.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Forest Folk`,
    effects: [
      {
        name: `Fade from View`,
        desc: `Once per game, in your hero phase, the Forest Folk can vanish along the spirit paths. Remove all of the models in the battalion from the battlefield and set them to one side. Then set up each of the units anywhere within your territory, or within 3" of a Sylvaneth Wyldwood. They must be set up at least 9" from the enemy, and cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Household`,
    effects: [
      {
        name: `Discipline of the Ages`,
        desc: `Enemy units cannot choose to retreat if they are within 3" of a Household unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Discipline of the Ages`,
        desc: `Units from the Household battalion add 1 to their Bravery in the battleshock phase if they are within 3" of an enemy unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Lords of the Clan`,
    effects: [
      {
        name: `Deadly Chorus`,
        desc: `In the hero phase, the Head of the Clan can unleash a great chorus. Roll a dice for each enemy unit within 10" of him, adding 1 to the result for each other model from this battalion that is also within 10" of the enemy unit being rolled for. If the result is 6-9, that enemy unit suffers D3 mortal wounds. If the result is 10 or more, that enemy unit suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Guardians of Alarielle`,
    effects: [
      {
        name: `The Song of the Lady of Vines`,
        desc: `The Lady of Vines' song has magical healing powers. She can give voice to the song in each of her hero phases. If she does so, pick a model anywhere on the battlefield; that model heals 1 wound (it heals D3 wounds instead if it is a SYLVANETH unit within 18").`,
        when: [HERO_PHASE],
      },
      {
        name: `Master of Defence`,
        desc: `Lorrus Grymn is a master of defensive warfare. Add 1 to the save rolls of Grymn, and to the save rolls of any STORMCAST ETERNALS unit from this battalion that is within 9" of him when the save is made.`,
        when: [DURING_GAME],
      },
      {
        name: `Guardians of the Queen-seed`,
        desc: `The Lady of Vines bears Alarielle's dormant form in a soulpod, and those tasked with the Everqueen's defence will fight to the last to protect it. So long as the Lady of Vines is still alive, the Bravery of all Guardians of Alarielle units is 10.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]
