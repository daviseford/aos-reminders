import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_DURING_ROUND,
  TURN_ONE_HERO_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Endrinmaster`,
    effects: [
      {
        name: `Endrincraft`,
        desc: `One SKYVESSEL Endrinrigger is embarked on, or within 3" immediately heals D3 wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supercharged Harness:`,
        desc: `Roll a D6. 1 = suffer a mortal wound. 3+ = Aethermight Hammer damage is 3 for this phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aether-Khemist`,
    effects: [
      {
        name: `Aetheric Augmentation`,
        desc: `Pick a friendly SKYFARERS unit within 10". Until your next hero phase, +1 to attacks for one kind of weapon carried by the unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Atmospheric Isolation`,
        desc: `-1 attacks for all enemy melee weapons on models within 3" (Min 1).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bjorgen Thundrik`,
    effects: [
      {
        name: `Aetheric Augmentation`,
        desc: `Pick a friendly SKYFARERS unit within 10". Until your next hero phase, +1 to attacks for one kind of weapon carried by the unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Atmospheric Isolation`,
        desc: `-1 attacks for all enemy melee weapons on models within 3" (Min 1).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thundrik's Profiteers`,
    effects: [
      {
        name: `Khazgan Drakkskewer`,
        desc: `Khazgan has +1 Wounds and can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Glory Seekers`,
        desc: `+1 to hit rolls against MONSTER and HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aetheric Navigator`,
    effects: [
      {
        name: `Aethersight`,
        desc: `Can unbind 1 spell each enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aetherstorm`,
        desc: `Roll a D6. 3+ = All enemy flyers halve movement if they start within 18" till next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Read the Winds`,
        desc: `If Navigator does not move. Re-roll run/charge rolls for all visible SKYVESSELS (or vessel embarked on only). Cannot use in same turn as Aetherstorm.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Arkanaut Admiral`,
    effects: [
      {
        name: `First to the Fray`,
        desc: `On successful charge, +1 to charges for KHARADRON OVERLORDS units within 18".`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Master of the Skies`,
        desc: `SKYVESSEL Admiral is embarked on can run and shoot.`,
        when: [HERO_PHASE],
      },
      {
        name: `If You Want A Job Done...`,
        desc: `Re-roll hit and wounds of 1 vs MONSTER and HERO.`,
        when: [HERO_PHASE],
      },
      {
        name: `Invoke the Code - Lead by Example`,
        desc: `KHARADRON OVERLORDS within 12" do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
        command_ability: true,
      },
      {
        name: `Invoke the Code - Look out for the Boss`,
        desc: `Until next hero phase, on a roll of 5 or 6 transfer wound or mortal wound to SKYFARERS unit within 1".`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Invoke the Code - Talk Softly, Carry a Big Hammer`,
        desc: `Re-roll failed hit and wound rolls.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Grundstok Thunderers`,
    effects: [
      {
        name: `Honour Bearer`,
        desc: `Re-roll battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drillbill`,
        desc: `If enemy ends charge within 1", roll dice. Mortal wound on 2+.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Keep your Distance`,
        desc: `When chosen to make attacks, can move / run out of combat instead. May not embark.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Choking Fug`,
        desc: `Enemy models within 2" of Aetheric Fumigator have -1 to attacks on melee weapons (min 1).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pin Them, Shred Them`,
        desc: `If a Grundstok Mortar causes unsaved wounds this phase, re-roll Decksweeper number of attacks if target is same unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Finish Them`,
        desc: `If a Decksweeper causes unsaved wounds this phase, re-roll hit and damage for Aethercannons if target is same unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Brokk Grungsson, Lord-Magnate of Barak-Nar`,
    effects: [
      {
        name: `The Lord-Magnate Moves`,
        desc: `On successful charge, roll dice for an enemy unit within 1/2", 2+ = D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Champion of Barak-Nar`,
        desc: `Re-roll hit and wounds of 1 vs MONSTER and HERO.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supercharged Harness`,
        desc: `Roll a D6; 1 = suffer a mortal wound, 3+ = damage for Aethermatic Saw = 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `High Hitcher`,
        desc: `Can embark on SKYVESSEL without counting towards capacity.`,
        when: [DURING_GAME],
      },
      {
        name: `First Rule of Grungsson`,
        desc: `KHARADRON OVERLORDS units within 18" can run and charge this turn.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Skywardens`,
    effects: [
      {
        name: `Exploding Drill`,
        desc: `If wound roll for Drill Cannon is 6+, enemy unit within 3" of target takes D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grapnel Launcher`,
        desc: `Choose terrain or character with 10+ wound characteristic within 24". on 4+, move any distance to target. Stay 3" away from enemy models.`,
        when: [END_OF_SHOOTING_PHASE],
      },
      {
        name: `Hitchers`,
        desc: `Can embark on SKYVESSEL without counting towards capacity.`,
        when: [DURING_GAME],
      },
      {
        name: `Skyhook`,
        desc: `If skyhook causes unsaved wound, unit can move D6" towards unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skymines`,
        desc: `When flying enemy ends charge within 1", roll dice for each enemy model. Enemy suffers mortal wound on 6.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Timed Charges`,
        desc: `When unit retreats, roll dice for each enemy unit within 3"; enemy suffers 1 mortal wound on 6.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Endrinriggers`,
    effects: [
      {
        name: `Exploding Drill`,
        desc: `If wound roll for Drill Cannon is 6+, enemy unit within 3" of target takes D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grapnel Launcher`,
        desc: `Choose terrain or character with 10+ wound characteristic within 24". on 4+, move any distance to target. Stay 3" away from enemy models.`,
        when: [END_OF_SHOOTING_PHASE],
      },
      {
        name: `Hitchers`,
        desc: `Can embark on SKYVESSEL without counting towards capacity.`,
        when: [DURING_GAME],
      },
      {
        name: `Skyhook`,
        desc: `If skyhook causes unsaved wound, unit can move D6" towards unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Endrincraft`,
        desc: `Heal 1 mortal wound on a single SKYVESSEL embarked on, or within 1".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arkanaut Company`,
    effects: [
      {
        name: `Glory Seekers`,
        desc: `+1 to hit rolls against MONSTER and HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Grundstok Gunhauler`,
    effects: [
      {
        name: `Exploding Drill`,
        desc: `If wound roll for Drill Cannon is 6+, enemy unit within 3" of target takes D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Bomb Racks`,
        desc: `If non-flying enemy ends charge within 1", roll dice; on a 4+ choose one:
        
        Detonation Drills: Enemy unit fights last.
        
        Grudgesettler Bombs: Enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Ahead Full`,
        desc: `Re-roll run and charge this turn; cannot shoot.`,
        when: [HERO_PHASE],
      },
      {
        name: `Escort Vessel`,
        desc: `If SKYVESSEL within 3" suffers wound or mortal wound, roll dice; 5+ = can transfer wound to this unit instead.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Arkanaut Frigate`,
    effects: [
      {
        name: `Aetheric Navigation`,
        desc: `+D3" movement if Aetheric Navigator is visible.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `All Hands to the Guns`,
        desc: `Re-roll hits of 1 in shooting phase; Movement is halved, cannot run.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bomb Racks`,
        desc: `If non-flying enemy ends charge within 1", roll dice; on a 4+ choose one:
        
        Detonation Drills: Enemy unit fights last.
        
        Grudgesettler Bombs: Enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Skyhook`,
        desc: `If skyhook causes unsaved wound, unit can move D6" towards unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skymines`,
        desc: `When flying enemy ends charge within 1", roll dice for each enemy model. Enemy suffers mortal wound on 6.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tireless Endrinrigger`,
        desc: `Heal 1 wound on 4+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vessel / Overburdened`,
        desc: `Can carry 10 SKYFARERS. Can carry 5 more but -1" movement per extra.`,
        when: [DURING_GAME],
      },
      {
        name: `Set-up`,
        desc: `Embarked units set-up at same time as vessel.`,
        when: [DURING_SETUP],
      },
      {
        name: `Embark`,
        desc: `If SKYFARERS unit moves all models within 3", they can embark.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Disembark`,
        desc: `Unit disembarking must stay within 3" of vessel, more than 3" from enemy.`,
        when: [HERO_PHASE],
      },
      {
        name: `Destroyed`,
        desc: `Upon death, all embarked units disembark. Roll dice for each model; 1 = 1 slain model in unit (your choice).`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Arkanaut Ironclad`,
    effects: [
      {
        name: `Flagship`,
        desc: `All visible SKYVESSELS gain 1 of the following:
        
        Fire At Will: +2 Aethershot Carbine attacks.
        
        Make Every Shot Count: Re-roll hits of 1 during shooting phase.
        
        Prove Your Worth: +3" range for all missile weapons.
        
        'Ware The Skies: Re-roll hit and wounds of 1 vs flying enemies.`,
        when: [HERO_PHASE],
      },
      {
        name: `Batten the Hatches`,
        desc: `Re-roll saves of 1; units cannot embark/disembark.`,
        when: [HERO_PHASE],
      },
      {
        name: `Supremacy Mine`,
        desc: `Once per battle, when enemy flying unit ends charge within 1", roll a D6; 2+ = D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tireless Endrinrigger`,
        desc: `Heal 1 wound on 4+.`,
        when: [HERO_PHASE],
      },
      {
        name: `Vessel / Overburdened`,
        desc: `Can carry 10 SKYFARERS. Can carry 5 more but -1" movement per extra.`,
        when: [DURING_GAME],
      },
      {
        name: `Set-up`,
        desc: `Embarked units set-up at same time as vessel.`,
        when: [DURING_SETUP],
      },
      {
        name: `Embark`,
        desc: `If SKYFARERS unit moves all models within 3", they can embark.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Disembark`,
        desc: `Unit disembarking must stay within 3" of vessel, more than 3" from enemy.`,
        when: [HERO_PHASE],
      },
      {
        name: `Destroyed`,
        desc: `Upon death, all embarked units disembark. Roll dice for each model; 1 = 1 slain model in unit (your choice).`,
        when: [DURING_GAME],
      },
      {
        name: `Bomb Racks`,
        desc: `If non-flying enemy ends charge within 1", roll dice; on a 4+ choose one:
        
        Detonation Drills: Enemy unit fights last.
        
        Grudgesettler Bombs: Enemy suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grand Armada`,
    effects: [
      {
        name: `On a War Footing`,
        desc: `All SKYVESSELS can make a move.`,
        when: [TURN_ONE_HERO_PHASE],
      },
      {
        name: `Constitutional Experts`,
        desc: `While Admiral and one HERO are alive, you can use footnotes (except from 'These are Just Guidelines') once per round.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Iron Sky Command`,
    effects: [
      {
        name: `Lord of the Skies`,
        desc: `Friendly units with 12" of Ironclad subtract 1 from battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Trusted Bodyguard`,
        desc: `When HERO within 3" of Arkanaut Company. Wound / mortal wound on 5+ transfered to Arkanaut Company.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Iron Sky Squadron`,
    effects: [
      {
        name: `Bold Privateers`,
        desc: `When Arkanaut Company disembarks, re-roll run and charges that turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Opening Salvo`,
        desc: `+1 attacks to all missile weapons on Frigates.`,
        when: [TURN_ONE_DURING_ROUND],
      },
    ],
  },
  {
    name: `Grundstok Escort Wing`,
    effects: [
      {
        name: `Focus Fire`,
        desc: `+1 to hit rolls vs one targeted enemy unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aetherstrike Force`,
    effects: [
      {
        name: `Marked for Destruction`,
        desc: `Knight-Venator can use Star-fated Arrow. If target is hit but not slain, +1 hit rolls against target for battle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Lightning-fast Volleys`,
        desc: `Choose single unit (not Knight-Venator) within 6" of two battalion units; chosen unit can make shooting attacks.`,
        when: [HERO_PHASE],
      },
    ],
  },
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
]
