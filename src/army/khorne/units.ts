import { TBattalions, TUnits } from 'types/army'
import { HERO_PHASE, COMBAT_PHASE, START_OF_HERO_PHASE, END_OF_SETUP, CHARGE_PHASE, SHOOTING_PHASE, BATTLESHOCK_PHASE, DURING_GAME } from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodthirster of Insensate Rage`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Bloodthirster of Unfettered Fury`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Wrath of Khorne Bloodthirster`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Skarbrand`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Skulltaker`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Bloodmaster, Herald of Khorne`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Skullmaster, Herald of Khorne`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
    
  },
  {
    name: `Herald of Khorne on Blood Throne`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Daemon Prince of Khorne`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
    
  {
    name: `Exalted Greater Daemon of Khorne`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Mazarall the Butcher`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  {
    name: `Karanak`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Bloodletters`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
    },
  {
    name: `Bloodcrushers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
  {
    name: `Flesh Hounds`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
    },
  {
    name: `Skull Cannons`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ]
  },
]




// Battalions
export const Battalions: TBattalions = [
  {
    name: `The Skullfiend Tribe`,
    effects: [
      {
        name: `Skull Hunters`,
        desc: `If any units from the Skullfiend Tribe are within 3" of any enemy HEROES or MONSTERS at the start of your hero phase, they can immediately pile in and each model in that unit can make a single attack against one such unit with one of their melee weapons.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Goretide`,
    effects: [
      {
        name: `Aqshy's Bane`,
        desc: `In each of your hero phases, you can pile in up to 8" and attack with the Goretide’s Mighty Lord of Khorne.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aqshy's Bane`,
        desc: `You can re-roll all failed hit rolls for the Goretide’s Mighty Lord of Khorne, including any attacks made with the Blood-dark Claws of his ferocious Flesh Hound, Grizzlemaw.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hot-headed Conquerors`,
        desc: `In each of your hero phases, roll a D6. You can move each Goretide unit up to the number rolled in inches. You cannot retreat or run as part of this move, but can use it to charge the enemy.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Slaughterborn`,
    effects: [
      {
        name: `Hungry for Glory`,
        desc: ` If your general is a KHORNE HERO and they are within 3" of any enemy units in the hero phase, any Slaughterborn units that are within 12" of your general can immediately attempt to charge those enemy units. Any Slaughterborn units that make successful charges in this manner can immediately pile in and each model in those units can make a single attack with one of their melee weapons during that hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gore Pilgrims`,
    effects: [
      {
        name: `Acolytes of Khorne`,
        desc: `You can choose to re-roll the dice when attempting a Bloodfuelled Prayer or Blood Blessing of Khorne with a SLAUGHTERPRIEST from the Gore Pilgrims.`,
        when: [HERO_PHASE],
      },
      {
        name: `Widening the Rift`,
        desc: ` Increase the range of the Portal of Skulls ability of this battalion’s Bloodsecrator by 6" for each of this battalion’s SLAUGHTERPRIESTS that are within 8" of him when he opens the Portal of Skulls.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodforged`,
    effects: [
      {
        name: `Blood Aegis`,
        desc: `When you make save rolls for this unit in the combat phase, ignore the enemy’s Rend characteristic unless it is -2 or better.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infectious Bloodletting`,
        desc: `Roll a dice for each enemy model within 3" of a Bloodforged model at the start of each of your hero phases. On a roll of 6, you can immediately attack (but not pile in) with all of the melee weapons of the enemy model being rolled for as though it was part of your army. The model can attack its own unit, and even itself!`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodbound Warband`,
    effects: [
      {
        name: `Bloodrain`,
        desc: ` If at least three units from a Bloodbound Warband are within 3" of an enemy unit at the start of your hero phase, Khorne’s blessing manifests as a squall of blood and gore which falls until your next hero phase. While this bloodrain is falling, KHORNE units in your army do not need to take battleshock tests.`,
        when: [START_OF_HERO_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Frenzied Charge`,
        desc: `When units in a Bloodbound Warband make attacks in any turn that they charged, add 1 to the Attacks characteristic of all melee weapons they use. If the Bloodbound Warband contained the maximum number of units at the start of the battle, then you can also re-roll failed wound rolls of 1 for units from this battalion in the combat phase of any turn in which the unit charged.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Red Headsmen`,
    effects: [
      {
        name: `Slay the Worthy`,
        desc: ` At the start of your first hero phase, pick up to 3 HEROES and/ or MONSTERS in your opponent’s army and declare them to be worthy foes. Your opponent can re-roll failed hit rolls for attacks made by those units. For each worthy foe they slay, the Red Headsmen add 1 to the Attacks characteristic of their melee weapons for the rest of the game. If the Red Headsmen contained the maximum number of units at the start of the battle, then you can pick up to 5 HEROES and/or MONSTERS to be worthy foes instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ritual Slaughter`,
        desc: `Red Headsmen always count as being within range of their Skullgrinder’s Altar of Skulls ability. In addition, if the Skullgrinder slays a worthy foe (see "Slay the Worthy"), the range of his Altar of Skulls ability is doubled.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skulltake`,
    effects: [
      {
        name: `Reaping Strikes`,
        desc: `Skullreapers from a Skulltake within 12" of their Bloodstoker are in a frenzied fury. If the wound roll for a Skullreaper in a frenzied fury is 6 or higher, add 1 to the Damage characteristic of the weapon they are using. If the Skulltake contained the maximum number of units at the start of the battle, then this ability applies to all Skulltake units that are within 12" of the Bloodstoker.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Skullhungry`,
        desc: `The Skulltake’s Khorgoraths make 8 attacks with their Claws and Fangs rather than 5, as long as their unit is within 6" of any of the battalion’s Skullreapers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Feast`,
    effects: [
      {
        name: `Feeding Frenzy`,
        desc: `As long as the SLAUGHTERPRIEST is alive, add 1 to the Attacks characteristics of any melee weapons used by a unit from this battalion whenever it is selected to attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood-goaded`,
        desc: `Units from this battalion within 12" of the Bloodstoker do not need to take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Brass Stampede`,
    effects: [
      {
        name: `Avalanche of Brass`,
        desc: `If the Brass Stampede contained the maximum number of units at the start of the battle, roll a dice for each enemy unit within 3" of any units from the Brass Stampede in each of your hero phases; on a roll of 2 or more, that unit suffers D3 mortal wounds as they are crushed beneath the Juggernaut herd’s stamping hooves.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood-scent`,
        desc: `If any units in either army have been wiped out, the Brass Stampede add 3 to their charge rolls.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Obliterating Charge`,
        desc: `If a unit uses its Murderous Charge ability within 3" of another unit in the Brass Stampede, you do not need to roll a dice – it automatically inflicts D3 mortal wounds (or D6 if the Mighty Skullcrusher unit includes 6 or more models).`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Gorechosen`,
    effects: [
      {
        name: `Eternal Contest`,
        desc: `If a Gorechosen model is within 12" of at least two other models from the Gorechosen battalion, add 1 to its hit rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mightiest of Champions`,
        desc: `Add 1 to the Attacks characteristic of all Gorechosen melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodbound Warhorde`,
    effects: [
      {
        name: `Khorne Cares Not From Whence The Blood Flows`,
        desc: `If any units are wiped out during the combat phase, you can add 1 to the Attacks characteristic of all melee weapons used by the Bloodbound Warhorde for the remainder of that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Blood God's Scorn`,
        desc: `Units from the Bloodbound Warhorde can attempt to unbind one spell (or one additional spell if they could already do so) in each enemy hero phase in the same manner as a wizard. If a Mighty Lord of Khorne or SLAUGHTERPRIEST from the Warhorde successfully unbinds a spell, you immediately earn one Blood Tithe point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlords`,
    effects: [
      {
        name: `Murderous Lieutenants`,
        desc: `Any BLOODLETTER HEROES from the Bloodlords that are within 3" of any enemy models at the start of your hero phase can immediately pile in and attack as if it were the combat phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Exalted Loci of Khorne`,
        desc: `If any units of Bloodletters and/or Bloodcrushers from the Bloodlords are within 8" of any of the battalion’s BLOODLETTER HEROES at the start of your hero phase, they can immediately pile in and each model in the unit can make a single attack with one of their melee weapons.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Reapers of Vengeance`,
    effects: [
      {
        name: `Khorne’s Vengeance Made Manifest`,
        desc: `After set-up, pick up to D3+1 enemy units (note that they need not be HEROES) from your opponent’s army to receive Khorne’s blood mark.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Khorne’s Vengeance Made Manifest`,
        desc: `At the start of each of your hero phases, you can roll two dice for each unit from the Reapers of Vengeance that is not within 3" of any enemy models and move the unit being rolled for up to the total distance rolled in inches towards a unit with a blood mark (provided that they are on the battlefield).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Unstoppable Charge`,
        desc: `Units of Bloodcrushers from the Reapers of Vengeance inflict D3 mortal wounds as a result of their Murderous Charge ability on a roll of 2+ instead of 4+.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Blood Host of Khorne`,
    effects: [
      {
        name: `Cometh the Slaughter`,
        desc: `In each of your hero phases, pick D3 units from the Blood Host of Khorne that are within 3" of the enemy. All models in the units you pick can immediately pile in and attack with one of their melee weapons. Increase the number of units that can attack from D3 to D6 if there are sixteen or more units in the battalion at the start of the hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Council of Blood`,
    effects: [
      {
        name: `Fierce Rivals`,
        desc: `In each of your hero phases, pick one BLOODTHIRSTER from the Council of Blood to pile in and make attacks. If that BLOODTHIRSTER kills an enemy HERO or MONSTER, or wipes out a unit in doing so, you can immediately pick another BLOODTHIRSTER from the Council of Blood to pile in and make attacks with. You can continue to do this until either each model in the battalion has attacked once in this manner, or one of them fails to slay an enemy HERO or MONSTER, or wipe out a unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lords of Battle`,
        desc: `Each BLOODTHIRSTER from a Council of Blood can use the command ability on its warscroll in each of your hero phases, even if they are not your army’s general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Daemon Legion of Khorne`,
    effects: [
      {
        name: `Khorne Cares Not From Whence The Blood Flows`,
        desc: `If any units are wiped out during the combat phase, you can add 1 to the Attacks characteristic of all melee weapons used by the Daemon Legion of Khorne for the remainder of that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Revel in Carnage`,
        desc: `You immediately gain 1 Blood Tithe point at the start of each of your hero phases.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood Hunt`,
    effects: [
        {
          name: `Blood Mark`,
          desc: `After set-up, pick an enemy HERO to receive Khorne’s blood mark.`,
          when: [END_OF_SETUP],
        },
        {
          name: `Blood Mark`,
          desc: `At the start of each of your hero phases, you can roll two dice for each unit from the Blood Hunt that is not within 3" of any enemy models and move the unit being rolled for up to the total distance rolled in inches towards the HERO with the blood mark (provided that they are on the battlefield).`,
          when: [START_OF_HERO_PHASE],
        },
        {
          name: `Khorne's Hunters`,
          desc: `Add 1 to any wound rolls you make for models from a Blood Hunt when attacking an enemy HERO. If a Blood Hunt contained the maximum number of units at the start of the battle, then you can re-roll all failed wound rolls you make for models from the battalion when attacking an enemy HERO.`,
          when: [COMBAT_PHASE, SHOOTING_PHASE],
        },
      ],
  },
  {
    name: `Bloodthunder Stampede`,
    effects: [
        {
          name: `Avalanche of Brass`,
          desc: `If the Bloodthunder Stampede contained the maximum number of units at the start of the battle, roll a dice for each enemy unit within 3" of any units from the Bloodthunder Stampede in each of your hero phases; on a roll of 2 or more, that unit suffers D3 mortal wounds as they are crushed beneath the Juggernaut herd’s stamping hooves.`,
          when: [HERO_PHASE],
        },
        {
          name: `Blood-scent`,
          desc: `If any units in either army have been wiped out, the Bloodthunder Stampede add 3 to their charge rolls.`,
          when: [CHARGE_PHASE],
        },
        {
          name: `Obliterating Charge`,
          desc: `If a unit uses its Murderous Charge ability within 3" of another unit in the Bloodthunder Stampede, you do not need to roll a dice – it automatically inflicts D3 mortal wounds (or D6 if the Bloodcrusher unit includes 6 or more models) as the enemy is trampled to a bloody pulp.`,
          when: [CHARGE_PHASE],
        },
      ],
  },
  {
    name: `Charnel Host`,
    effects: [
        {
          name: `Daemon Commander`,
          desc: `You can use the Rejoice in the Slaughter command ability of the Charnel Host’s Bloodthirster of Unfettered Fury in your hero phase, even if it is not your general.`,
          when: [HERO_PHASE],
        },
        {
          name: `Butchers of Khorne`,
          desc: `In each of your hero phases, you can pile in and attack with any units from a Charnel Host that are within 8" of their battalion’s Bloodthirster of Unfettered Fury at the start of the phase.`,
          when: [HERO_PHASE],
        },
      ],
  },
  {
    name: `Gorethunder Cohort`,
    effects: [
        {
          name: `The Cannons of Khorne`,
          desc: `In each of your hero phases, D3 Skull Cannons from a Gorethunder Cohort that are within 8" of their battalion’s Blood Throne can shoot as if were the shooting phase. If a Gorethunder Cohort contained the maximum number of units at the start of the battle, then all Skull Cannons that are within 8" of their battalion’s Blood Throne can shoot as if were the shooting phase.`,
          when: [HERO_PHASE],
        },
      ],
  },
  {
    name: `Murderhost`,
    effects: [
        {
          name: `Insatiable Bloodlust`,
          desc: `After set-up has been completed, roll two dice for the Murderhost’s BLOODLETTER HERO and for each unit from this battalion that is within 8" of them, and move the unit(s) being rolled for up to the total distance rolled in inches. If the Murderhost contained the maximum number of units at the start of the battle, then you can repeat this process in each of your hero phases as well.`,
          when: [END_OF_SETUP, HERO_PHASE],
        },
      ],
  },
  {
    name: `Skullseeker Host`,
    effects: [
        {
          name: `Giant Killers`,
          desc: `If any units from a Skullseeker Host are within 3" of any enemy MONSTERS at the start of your hero phase, they can immediately pile in and each model in the unit can make a single attack against the MONSTER with one of their melee weapons.`,
          when: [START_OF_HERO_PHASE],
        },
        {
          name: `Prey Upon the Wounded`,
          desc: `In each of your hero phases, you can make a shooting attack with any Skull Cannons from a Skullseeker Host that are within 8" of a KHORNE HERO from the same battalion. After resolving any attacks made in this manner, any other units in the same Skullseeker Host can immediately attempt to charge any units that suffered any unsaved wounds from these attacks, and can attack as described in Giant Killers if the unit they charge is a MONSTER`,
          when: [HERO_PHASE],
        },
      ],
  },
]

