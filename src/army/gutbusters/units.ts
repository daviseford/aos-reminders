import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Tyrant`,
    effects: [
      {
        name: `Big Name`,
        desc: `Before setting this model up, roll a D6 to discover its big name. On a 6, choose freely.`,
        when: [DURING_SETUP],
      },
      {
        name: `Big Name 1: Deathcheater`,
        desc: `The Tyrant has 9 Wounds instead of 8.`,
        when: [DURING_GAME],
      },
      {
        name: `Big Name 2: Brawlerguts`,
        desc: `You can add 1 to wound rolls for this Tyrant in the combat phase if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Big Name 3: Fateseeker`,
        desc: `The Tyrant has a Save of 3+ instead of 4+.`,
        when: [DURING_GAME],
      },
      {
        name: `Big Name 4: Longstrider`,
        desc: `The Tyrant has a Move of 8" instead of 6".`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Big Name 5: Giantbreaker`,
        desc: `+1 weapon damage versus MONSTERS.`,
        when: [DURING_GAME],
      },
      {
        name: `Club 'em then Club 'em Again`,
        desc: `You can re-roll failed hit rolls for a Tyrant armed with more than one Club, Basher or Slicer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gutgouger`,
        desc: `Any wound roll of 6 or more made with a Great Gutgouger inflicts double Damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bully of the First Degree`,
        desc: `Pck one GUTBUSTERS unit from your army within 6". That unit suffers D3 mortal wounds but does not then have to take battleshock tests for the rest of the battle whilst this Tyrant is alive and on the battlefield.`,
        when: [DURING_GAME],
        command_ability: true,
      },
    ],
  },
  {
    name: `Butcher`,
    effects: [
      {
        name: `Great Cauldron: result 1`,
        desc: `Bad Meat: Butcher takes D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Great Cauldron: result 2`,
        desc: `Troggoth Guts: The Butcher heals D3 wounds and all other friendly OGOR models within 14" heal a single wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Great Cauldron: result 3-4`,
        desc: `Spinemarrow: Select an OGOR unit within 14". Until your next hero phase, you can add 1 to all hit rolls made by that unit in the combat phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
      {
        name: `Great Cauldron: result 5-6`,
        desc: `Bonecrusher: oll a dice for each enemy unit within 7" of the Butcher. On a 4 or more, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bloodgruel`,
        desc: `Roll a D6 each time a Butcher successfully casts or unbinds a spell (roll after resolving the effects of the spell). On a 2 or more, the Butcher heals 1 wound. On a roll of 1, however, the Butcher chokes on whatever gobbet of flesh he was ramming down his throat and suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Voracious Maw`,
        desc: `Casting value 7. Pick a unit within 18" that is visible to the caster. That unit suffers D3 mortal wounds. Roll a D6 after resolving any damage; on a 1, 2 or 3 the maw emits a satisfied burp and then disappears. On any other roll it chomps again, inflicting another D3 mortal wounds on the unit. Repeat until unit failure or unit death.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Ogors`,
    effects: [
      {
        name: `Crusher`,
        desc: `Leader makes 4 attacks rather than 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bellower`,
        desc: `Subtract 1 from the Bravery of enemy units that are within 6" of any Bellowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Bull Charge`,
        desc: `You can re-roll wound rolls of 1 for an Ogor unit if it made a charge move in the same turn. If the unit also has 10 or more models, you can re-roll all failed wound rolls instead.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ogor Clubs and Blades`,
        desc: `You can re-roll hit rolls of 1 for an Ogor armed with more than one Ogor Club or Blade.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Iron Fists`,
        desc: `Each time you make a successful save roll of 6 or more for a unit of Ogors armed with Iron Fists, and the attacking unit is within 1", the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Great Beast Skull`,
        desc: `Roll a D6 whenever an enemy model flees whilst its unit is within 6" of any Great Beast Skulls from your army. On a 6, another model immediately flees from that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Tribal Banner`,
        desc: `You can re-roll dice rolls of 6 when taking battleshock tests for a unit that includes any Tribal Banners.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Lookout Grot`,
        desc: `6+ to ignore wounds or mortal wounds from missile weapons.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ironguts`,
    effects: [
      {
        name: `Gutlord`,
        desc: `Leader makes 4 attacks rather than 3.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bellower`,
        desc: `Subtract 1 from the Bravery of enemy units that are within 6" of any Bellowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Rune Maw Bearer`,
        desc: `Roll a D6 whenever an enemy model flees whilst its unit is within 6" of any Rune Maw Bearers from your army. On a 6, another model immediately flees from that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Rune Maw Bearer`,
        desc: `Roll a D6 if an enemy spell affects an Ironguts unit with any Rune Maw Bearers. On a roll of a 6, that spell has no affect on the Ironguts.`,
        when: [HERO_PHASE],
      },
      {
        name: `Down to the Ironguts`,
        desc: `Once per battle,after at least one OGOR model from your army has fled from the battle. When the Ironguts use this ability, you can re-roll hit, wound and save rolls of 1 for models in this unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gorgers`,
    effects: [
      {
        name: `Ambushing Hunters`,
        desc: `Instead of setting up this unit on the battlefield normally, you can place it to one side. If you do so, then in your first movement phase set up this unit anywhere on the battlefield and more than 12" from any enemy models. This is the unit's move for that movement phase.`,
        when: [DURING_SETUP],
      },
      {
        name: `Insatiable Hunger`,
        desc: `Gorgers can charge even if they made a run move in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Leadbelchers`,
    effects: [
      {
        name: `Thunderfist`,
        desc: `Unit leader makes 3 attacks rather than 2 when it uses its Leadbelcher Gun to batter the enemy in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bellower`,
        desc: `Subtract 1 from the Bravery of enemy units that are within 6" of any Bellowers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Thunderous Blasts of Hot Metal`,
        desc: `As long as no enemy models are within 3" of this unit and it did not move in the movement phase of the same turn, its Leadbelcher Guns make D6 attacks in the shooting phase instead of D3.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ironblaster`,
    effects: [
      {
        name: `Rhinox Charge`,
        desc: `Add 1 to the damage inflicted by the Rhinox's attack if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Cannon Shell`,
        desc: `You can re-roll failed hit rolls for a Cannon of the Sky-Titans if the target unit has 10 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Grot Scraplauncher`,
    effects: [
      {
        name: `Rhinox Charge`,
        desc: `Add 1 to the damage inflicted by the Rhinox's attack if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Rain of Scrap`,
        desc: `A Scraplauncher can shoot targets that are not visible to it. If the Scraplauncher hits a unit that has 10 or more models, increase its Damage to D6. If it hits a unit that has 20 or more models, increase its Damage to 2D6 instead.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Grots`,
    effects: [
      {
        name: `Groinbiter`,
        desc: `+1 to hit for unit leader.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Screeching Horde`,
        desc: `A Grot makes 2 attacks rather than 1 if its unit has 20 or more models. It makes 3 attacks instead if its unit has 30 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Trappers`,
        desc: `Roll a D6 each time an enemy unit finishes a charge move within 3" of a unit of Grots; on a 6 that unit immediately suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]
