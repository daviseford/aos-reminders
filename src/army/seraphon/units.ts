import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  TURN_ONE_HERO_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const StegadonBaseEffects = [
  {
    name: `Steadfast Majesty`,
    desc: `You can re-roll battleshock tests for units of SKINKS within 5" of any STEGADONS.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Skink Alpha`,
    desc: `If a Stegadon is ridden by a Skink Alpha, then in your hero phase the Alpha can give orders to a SKINK unit within 8". If that unit is not within 3" of an enemy unit, you can immediately roll a D6 and move each of its models up to that many inches. In addition, until your next hero phase, you can re-roll hit rolls of 1 for that unit.`,
    when: [HERO_PHASE],
  },
  {
    name: `Unstoppable Stampede`,
    desc: `When a Stegadon attacks with its Crushing Stomps, add 1 to any wound rolls if it charged in the same turn.`,
    when: [COMBAT_PHASE],
  },
]

// Unit Names
export const Units: TUnits = [
  {
    name: `Lord Kroak`,
    effects: [
      {
        name: `Celestial Conjuration`,
        desc: `Summon units with Lord Kroak. Summoned units must be set up wholly within 12" of a friendly SLANN or a friendly SAURUS ASTROLITH BEARER, and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `At the end of your hero phase, you receive 1 celestial conjuration point if your general is a SLANN and is on the battlefield, and 3 points per unused spell.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Dead for Innumerable Ages`,
        desc: `In the battleshock phase of each turn, roll a D6 and add the number of wounds that Lord Kroak suffered during the turn. If the result is higher than his Bravery, he is 'slain'. Otherwise, any wounds he has suffered are immediately healed.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Impeccable Foresight`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, roll 3 dice. For each 4+, you receive 1 extra command point. You cannot use this command ability more than once per hero phase.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Masters of Order`,
        desc: `SLANN WIZARDS can attempt to unbind enemy spells that are cast anywhere on the battlefield, and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Contemplations of the Ancient Ones`,
        desc: `At the end of your hero phase, you can pick 1 friendly SLANN WIZARD and replace the spell they know from the Seraphon Spell Lore table with a new spell from that table. Choose or roll for the new spell, rolling again if you generate the spell the unit had before.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Slann Starmaster`,
    effects: [
      {
        name: `Celestial Configuration`,
        desc: `Roll a D6 and see which constellation is in the ascendant, and how it affects your army.

        1-2: The Hunter's Steed: Add 1 to run and charge rolls for Seraphon units in your army.
        3-4: The Sage's Staff: Add 1 to casting rolls when Seraphon Wizards in your army attempt to cast spells.
        5-6: The Great Drake: You can re-roll hit rolls of 1 for Seraphon units in your army.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Celestial Conjuration`,
        desc: `Summon units with Slann. Summoned units must be set up wholly within 12" of a friendly SLANN or a friendly SAURUS ASTROLITH BEARER, and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `At the end of your hero phase, you receive 1 celestial conjuration point if your general is a SLANN and is on the battlefield, and 3 points per unused spell.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Celestial Configuration`,
        desc: `At the start of your hero phase, one Slann Starmaster in your army can attempt to turn the constellations to its advantage instead of casting one of its spells. If it does so, roll a D6. If the result is a 1, the Slann is distracted by its exertions and cannot cast any spells this phase. If the result is 4 or higher, you can pick a new ascendant constellation from the table. Otherwise, there is no effect.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Gift from the Heavens`,
        desc: `If a Slann Starmaster uses this ability, Seraphon units from your army that are within 10" are affected. Until your next hero phase, those units can fly and you can re-roll failed save rolls for them in the shooting phase.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Masters of Order`,
        desc: `SLANN WIZARDS can attempt to unbind enemy spells that are cast anywhere on the battlefield, and attempt to dispel endless spells anywhere on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Contemplations of the Ancient Ones`,
        desc: `At the end of your hero phase, you can pick 1 friendly SLANN WIZARD and replace the spell they know from the Seraphon Spell Lore table with a new spell from that table. Choose or roll for the new spell, rolling again if you generate the spell the unit had before.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Saurus Oldblood on Carnosaur`,
    effects: [
      {
        name: `Bloodroar`,
        desc: `If your opponent takes a battleshock test for a unit within 8" of any Carnosaurs, roll a D6. If the result is higher than the result on your opponent's dice, D3 models flee from the unit (as well as any that flee because of the test).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Ancient Warlord`,
        desc: `If the Saurus Oldblood uses this ability, then until your next hero phase, whenever a Saurus Hero from your army within 20" attacks in the combat phase, pick one of its weapons and add 2 to its Attacks characteristic until the end of the phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Pinned Down`,
        desc: `If an enemy MONSTER is hit twice with the Carnosaur's Clawed Forelimbs, you can add 2 to the result when rolling to hit that target with the Carnosaur's Massive Jaws in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Frenzy`,
        desc: `Once this model has slain an enemy with its Massive Jaws, it can run and charge in the same turn for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Saurus Oldblood`,
    effects: [
      {
        name: `Paragon of Order`,
        desc: `If a Saurus Oldblood uses this ability, each Seraphon unit from your army within 10" can immediately reform around one of its models. That model must stay where it is, but each other model in the unit can move up to 3" so long as it does not end this move within 3" of the enemy. The same unit cannot benefit from this command ability more than once in the same phase.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Wrath of the Seraphon`,
        desc: `You can re-roll wound rolls of 1 for Saurus models within 5" of an Oldblood.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Saurus Scar-Veteran on Cold One`,
    effects: [
      {
        name: `Fury of the Seraphon`,
        desc: `After this model has made all its Celestite War-pick attacks, roll a D6. If the result is 4 or higher, it can attack again with its Celestite War-pick. Roll again after those attacks; if the result is 6, it can attack for a third and final time.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savage Charge`,
        desc: `If a Scar-Veteran on Cold One uses this ability, then you can re-roll charge rolls and hit rolls of 1 for Saurus units within 8". In addition, until your next hero phase this model and any Saurus Knights within 8" make an additional attack with their Cold Ones' Vicious Bites.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Stardrake Shields`,
        desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Saurus Eternity Warden`,
    effects: [
      {
        name: `Selfless Protector`,
        desc: `Each time this model is within 2" of a Slann that suffers a wound or mortal wound, it can attempt to intervene. If it does so, roll a D6. If the result is 2 or higher, the Slann ignores that wound or mortal wound but this model suffers a mortal wound in its place.`,
        when: [DURING_GAME],
      },
      {
        name: `Alpha Warden`,
        desc: `Saurus Guard make an additional attack with their Celestite Polearms while their unit is within 5" of any Saurus Eternity Wardens from your army.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Saurus Sunblood`,
    effects: [
      {
        name: `Ferocious Rage`,
        desc: `If the hit roll for one of this model's attacks is 6 or higher, make D3 wound rolls rather than 1. If the wound roll for one of this model's attacks is 6 or higher, it causes D3 Damage rather than 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Weakness`,
        desc: `If the Saurus Sunblood uses this ability, pick an enemy unit within 15" - until your next hero phase, re-roll failed hit rolls for attacks made in the combat phase against that unit by any of your Saurus models.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Saurus Scar-Veteran on Carnosaur`,
    effects: [
      {
        name: `Stardrake Shields`,
        desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
      {
        name: `Bloodroar`,
        desc: `If your opponent takes a battleshock test for a unit within 8" of any Carnosaurs, roll a D6. If the result is higher than the result on your opponent's dice, D3 models flee from the unit (as well as any that flee because of the test).`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Saurian Savage`,
        desc: `If the Saurus Scar-Veteran on Carnosaur uses this ability, pick a Saurus unit within 15". Until your next hero phase, whenever you roll a hit roll of 6 or more for a model in that unit, that model can immediately make one additional attack using the same weapon.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Pinned Down`,
        desc: `If an enemy MONSTER is hit twice with the Carnosaur's Clawed Forelimbs, you can add 2 to the result when rolling to hit that target with the Carnosaur's Massive Jaws in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Frenzy`,
        desc: `Once this model has slain an enemy with its Massive Jaws, it can run and charge in the same turn for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Saurus Astrolith Bearer`,
    effects: [
      {
        name: `Celestial Conduit`,
        desc: `Add 1 to casting rolls for friendly Seraphon Wizards while they are within 12" of any Astrolith Bearer. In addition, add 8" to the range of any spells cast by friendly Seraphon Wizards while they are within 12" of any Astrolith Bearer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Proud Defiance`,
        desc: `You can re-roll hit rolls for friendly Seraphon units while they are wholly within 12" of this model.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `At the end of your hero phase, you receive D3 celestial conjuration points if there are one or more friendly SAURUS ASTROLITH BEARERS on the battlefield.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skink Priest w/ Cloak of Feathers`,
    effects: [
      {
        name: `Celestial Rites`,
        desc: `Roll a D6. If the result is 4 or more, pick a SERAPHON unit within 8". You can re-roll run rolls, charge rolls and save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cloak of Feathers`,
        desc: `A Skink Priest wearing a Cloak of Feathers has a Save of 4+ rather than 5+, a Move of 14" rather than 8", and can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Skink Priest w/ Priestly Trappings`,
    effects: [
      {
        name: `Celestial Rites`,
        desc: `Roll a D6. If the result is 4 or more, pick a SERAPHON unit within 8". You can re-roll run rolls, charge rolls and save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Priestly Trappings`,
        desc: `A Skink Priest wearing Priestly Trappings affects all SERAPHON units from your army within 8" when it performs a celestial rite, rather than a single unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skink Starseer`,
    effects: [
      {
        name: `Cosmic Herald`,
        desc: `At the start of your hero phase, you can roll a D6 for this model. If you do so, on a 2+, you receive 1 command point. On a 1, your opponent receives 1 command point instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Curse of Fates`,
        desc: `Casting value of 4. If successfully cast, pick a unit within 20". Once per phase until your next hero phase, you can increase or decrease the result of a single dice roll for that unit by one.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Skink Starpriest`,
    effects: [
      {
        name: `Serpent Staff`,
        desc: `A Skink Starpriest can level its staff at a SERAPHON unit in your army that is within 8", granting them the venom of the two-headed celestial serpent. Until your next hero phase, whenever models from that unit attack with their bite or jaws, a wound roll of 6 or more causes twice the normal amount of Damage.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Engine of the Gods`,
    effects: [
      {
        name: `Cosmic Engine`,
        desc: `Roll for Engine of the Gods effect.`,
        when: [HERO_PHASE],
      },
      {
        name: `Steadfast Majesty`,
        desc: `You can re-roll battleshock tests for units of SKINKS within 5" of any STEGADONS.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Unstoppable Stampede`,
        desc: `When a EoTG attacks with its Crushing Stomps, add 1 to any wound rolls if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Saurus Warriors`,
    effects: [
      {
        name: `Stardrake Icon`,
        desc: `If a battleshock test is made for an enemy unit within 5" of any stardrake icons, add 1 to the result.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Stardrake Shields`,
        desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
      {
        name: `Ordered Cohort`,
        desc: `Add 1 to this unit's hit rolls if it has at least 20 models, and 1 to the number of attacks each model makes with its Celestite weapon if it has at least 30 models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Wardrum`,
        desc: `A unit that includes any wardrums can march in its movement phase. When it does so, it doubles its Move characteristic but cannot run or charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Saurus Guard`,
    effects: [
      {
        name: `Stardrake Icon`,
        desc: `If a battleshock test is made for an enemy unit within 5" of any stardrake icons, add 1 to the result.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Stardrake Shields`,
        desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
      {
        name: `Sworn Guardians`,
        desc: `If this unit is within 8" of any SERAPHON HEROES, add 1 to the result of any save rolls for it.`,
        when: [DURING_GAME],
      },
      {
        name: `Sworn Guardians`,
        desc: `If this unit is within 8" of any SERAPHON HEROES, add 2 to its Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Saurus Knights`,
    effects: [
      {
        name: `Stardrake Icon`,
        desc: `If a battleshock test is made for an enemy unit within 5" of any stardrake icons, add 1 to the result.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Blazing Lances`,
        desc: `If the wound roll for a Celestite Lance is 6 or higher and the model charged in the same turn, the attack inflicts an additional mortal wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Stardrake Shields`,
        desc: `When you make save rolls for this unit, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
      {
        name: `Wardrum`,
        desc: `A unit that includes any wardrums can march in its movement phase. When it does so, it doubles its Move characteristic but cannot run or charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Skinks`,
    effects: [
      {
        name: `Wary Fighters`,
        desc: `When it is a Skink unit's turn to pile in and attack, it can withdraw instead. Move each model in the unit up to 8", so that each one ends up at least 3" from the enemy.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Celestial Cohort`,
        desc: `Add 1 to hit rolls for Skinks in the shooting phase if it has at least 20 models, or add 2 if it has at least 30 models.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Star-bucklers`,
        desc: `When you make save rolls for a unit carrying Star-bucklers, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Chameleon Skinks`,
    effects: [
      {
        name: `Chameleon Ambush`,
        desc: `Instead of setting up Chameleon Skinks on the battlefield, you can place it to one side and say that it is in hiding. In any of your movement phases, you can reveal a unit that is in hiding by setting it up anywhere on the battlefield.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Disappear From Sight`,
        desc: `Chameleon Skinks can blend with its surroundings and go into hiding. If it does so, remove it from the battlefield. You can reveal it via "Chameleon Ambush" in any subsequent turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Perfect Mimicry`,
        desc: `If all models in this unit are within or on a terrain feature, their Save characteristic is 3+ rather than 6+. This includes the bonus for being in cover.`,
        when: [DURING_GAME],
      },
      {
        name: `Star-venom`,
        desc: `If the hit roll is 6 or higher when a model attacks with a Dartpipe, the attack's Damage characteristic is 2 rather than 1, or 3 rather than 1 if the target is a CHAOS DAEMON.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Terradon Riders`,
    effects: [
      {
        name: `Deadly Cargo`,
        desc: `Once per game, the unit can drop its boulders onto an enemy unit it moves over during the movement phase. Roll a D6 for each Terradon in this unit; for each result of 4 or more, the enemy unit is struck by an exploding boulder and suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Sunleech Bolas`,
        desc: `If an attack made with a Sunleech Bolas scores a hit, the projectile bursts and spreads flames among the foe. Roll a D6 and make that many wound rolls.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skyblade`,
        desc: `If the target of an attack made with a Skyblade can fly, you can re-roll failed hit rolls.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swooping Dive`,
        desc: `Remember to declare that your Terradons are swooping. In the following combat phase you can re-roll failed hit and wound rolls for this unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Ripperdactyl Riders`,
    effects: [
      {
        name: `Toad Rage`,
        desc: `Place Blot Toad for Ripperdactyls.`,
        when: [TURN_ONE_HERO_PHASE],
      },
      {
        name: `Toad Rage`,
        desc: `Move Blot Toad up to D6 inches.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Swooping Dive`,
        desc: `Remember to declare that your Ripperdactyls are swooping. In the following combat phase you can re-roll failed hit and wound rolls for this unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Star-bucklers`,
        desc: `When you make save rolls for a unit carrying Star-bucklers, ignore the enemy's Rend characteristic unless it is -2 or better.`,
        when: [DURING_GAME],
      },
      {
        name: `Voracious Appetite`,
        desc: `If the hit roll for an attack made with a Ripperdactyl's Vicious Beak scores a hit, that attack inflicts D3 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Skink Handlers`,
    effects: [
      {
        name: `Aim for their Eyes`,
        desc: `If you roll a hit roll of 6 or more for a Goad-spear, that attack has struck the target in the eyes and wounds automatically - there is no need to make a wound roll for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Salamanders`,
    effects: [
      {
        name: `It Burns!`,
        desc: `Roll a D6 at the end of the shooting phase for each unit that suffered any wounds from a Salamander's Stream of Fire in that phase. If the result is 4 or higher, the unit suffers D3 mortal wounds as the corrosive liquid eats through armour, flesh and bone.`,
        when: [END_OF_SHOOTING_PHASE],
      },
      {
        name: `Goaded to Fury`,
        desc: `The range of a Salamander's Stream of Fire attack is increased to 12" while its unit is within 3" of any Skink Handlers from your army.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Razordons`,
    effects: [
      {
        name: `Instinctive Defence`,
        desc: `Once per turn, if an enemy unit ends a charge move within 3" of a Razordon unit, roll a D6. If the result is 4 or higher, the Razordons immediately attack the charging unit with their Volleys of Spikes.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Piercing Barbs`,
        desc: `If a Razordon shoots a Volley of Spikes at a target within 6", it has a Rend characteristic of -1 rather than '-'.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Goaded to Anger`,
        desc: `You can re-roll all hit rolls of 1 for a Razordon in the shooting phase while its unit is within 3" of any Skink Handlers from your army.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Kroxigor`,
    effects: [
      {
        name: `Energy Transference`,
        desc: `You can re-roll wound rolls of 1 for Kroxigor that are within 3" of any SKINKS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `When a Kroxigor attacks with a Moon Hammer, it swings it in a wide arc that hits a number of foes. Select a target unit and make one attack against it for each of its models within range.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Jaws like a Steel Trap`,
        desc: `If the wound roll for an attack made with a model's Vice-like Jaws is 6+, both you and your opponent roll a D6. If you score higher, your opponent does not make a save roll - instead, the target suffers a number of mortal wounds equal to the difference between the two dice rolls. Otherwise, the attack causes no damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Stegadon w/ Skystreak Bow`,
    effects: [...StegadonBaseEffects],
  },
  {
    name: `Stegadon w/ Sunfire Throwers`,
    effects: [
      ...StegadonBaseEffects,
      {
        name: `Gout of Sunfire`,
        desc: `When a Stegadon attacks with its Sunfire Throwers, select a target unit and make one attack against it for each of its models within range.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Bastiladon w/ Ark of Sotek`,
    effects: [
      {
        name: `Impervious Defence`,
        desc: `When you make save rolls for a Bastiladon, ignore the attacker's Rend characteristic. In addition, roll a D6 whenever it suffers a mortal wound. On a result of 4 or higher, the wound is ignored.`,
        when: [DURING_GAME],
      },
      {
        name: `Tide of Snakes`,
        desc: `At the start of each combat phase, a Bastiladon carrying an Ark of Sotek can unleash a tide of venomous serpents. Pick up to six enemy units within 8" and mark each one with a dice showing a different number. Then roll twelve dice to see where the snakes go. Each enemy unit suffers one mortal wound for each roll that matches the number on its dice. Any dice that do not roll a matching number have no effect as the snakes slither away.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bastiladon w/ Solar Engine`,
    effects: [
      {
        name: `Impervious Defence`,
        desc: `When you make save rolls for a Bastiladon, ignore the attacker's Rend characteristic. In addition, roll a D6 whenever it suffers a mortal wound. On a result of 4 or higher, the wound is ignored.`,
        when: [DURING_GAME],
      },
      {
        name: `Light of the Heavens`,
        desc: `If this model's Searing Beam targets a unit of CHAOS DAEMONS, its Damage characteristic is 3 rather than 2.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Troglodon`,
    effects: [
      {
        name: `Divining Rod`,
        desc: `The Skink Oracle can use its Divining Rod to attempt to unbind a spell in each enemy hero phase in the same manner as a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Primeval Roar`,
        desc: `Enemy units within 8" of any Troglodons in the battleshock phase must subtract 1 from their Bravery.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drawn to the Screams`,
        desc: `If a unit suffers any wounds from this model's Noxious Spittle in the shooting phase, and the Troglodon charges in the subsequent charge phase, you can add 3" to its charge distance as long as it ends its charge within 1/2" of a screaming unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Dread Saurian`,
    effects: [
      {
        name: `Primal Presence`,
        desc: `Do not take battleshock tests for friendly Skink units while they are wholly within 24" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Arcane Glyphs`,
        desc: `You can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Devourer of Beasts`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made by this model that target a Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Roar of Ruin`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of any friendly models with this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Eternal Starhost`,
    effects: [
      {
        name: `Drakescale Shieldwall`,
        desc: `Add 1 to the result of any save rolls for the Eternal Starhost's Saurus Guard while they are within 10" of their Eternity Warden.`,
        when: [DURING_GAME],
      },
      {
        name: `Patient Guardians`,
        desc: `If a unit of Saurus Guard from an Eternal Starhost does not move in its movement or charge phases, its Celestite Polearms have a Damage characteristic of D3 rather than 1 in the following combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadowstrike Starhost`,
    effects: [
      {
        name: `Stealthy Advance`,
        desc: `After set-up is complete, you can roll two dice for each unit in a Shadowstrike Starhost and move all of its models up to that many inches.`,
        when: [END_OF_SETUP],
      },
      {
        name: `The Trap is Sprung`,
        desc: `Pick a unit that is visible to the starhost's Skink Priest or Starpriest. Until your next hero phase, you can re-roll hit and wound rolls of 1 for units from the Shadowstrike Starhost that attack the unit you picked.`,
        when: [HERO_PHASE],
      },
      {
        name: `Strike From the Skies`,
        desc: `Instead of setting up the flying unit from Shadowstrike Starhost on the battlefield, you can place it to one side and say that it is hidden amid the clouds. In any of your movement phases, the unit can plummet from the skies to assail the foe. When it does so, you can set it up anywhere more than 3" from the enemy. In the following combat phase, add 1 to the result of any wound rolls made for models from that unit.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Firelance Starhost`,
    effects: [
      {
        name: `Blazing Cohort`,
        desc: `If the wound roll for a Celestite weapon carried by a model from a Firelance Starhost is 6 or higher and it charged in the same turn, the attack inflicts an additional mortal wound, as well as any caused by the Saurus Knights Blazing Lances ability.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Azyrite Hunters`,
        desc: `Add 3 to the result of any run and charge rolls for Saurus Knights that are within 10" of their Scar-Veteran.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Azyrite Hunters`,
        desc: `Add 3 to the result of any run and charge rolls for Saurus Knights that are within 10" of their Scar-Veteran.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Starbeast Constellation`,
    effects: [
      {
        name: `Ordered Constellation`,
        desc: `Units in a Starbeast Constellation do not need to take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Strategic Mastery`,
        desc: `You receive D3+1 command points, instead of 1, for each Starbeast Constellation in your army.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Sunclaw Starhost`,
    effects: [
      {
        name: `Predatory Starhost`,
        desc: `Saurus Warriors from a Sunclaw Starhost make 2 attacks with their Powerful Jaws and Stardrake Shields rather than 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Star-charged Celestite`,
        desc: `The Celestite weapons carried by Saurus Warriors in a Sunclaw Starhost are supercharged with the power of Azyr. Celestite Clubs or Spears carried by Saurus Warriors in this starhost have a Rend characteristic of -1 rather than '-'. When attacking CHAOS DAEMONS, these weapons also have a Damage characteristic of 2 rather than 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thunderquake Starhost`,
    effects: [
      {
        name: `Creator's Will`,
        desc: `The Engine of the Gods or Troglodon, and any units from the Thunderquake Starhost within 8", are guided by the will of their creator. At the start of your charge phase, you can declare that all of those units will be swift until your next charge phase, in which case you can re-roll charge rolls for those units and hit rolls for attacks made by those units. You can instead declare that all those units will be savage until your next charge phase, in which case you can re-roll wound rolls for attacks made by those units and save rolls for attacks that target those units.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Celestial Surge`,
        desc: `The great beasts of the seraphon are almost invincible when they march forth as a pack, even more so when in the presence of the Starmaster that created them. In your hero phase, each model from a Thunderquake Starhost heals a wound. Models from a Thunderquake Starhost that are within 10" of a SLANN heal D3 wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fangs of Sotek`,
    effects: [
      {
        name: `First to Battle`,
        desc: `In the first battle round, add 3" to the Move characteristic of Fangs of Sotek units, excluding Zectoka.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `First Oldblood`,
        desc: `If Ku-Quar is on the battlefield at the start of the first battle round, you receive 1 extra command point. If Ku-Quar is on the battlefield at the start of the first battle round and this battalion contains the maximum number of battalions, you receive D3 extra command points instead of 1.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Dracothion's Tail`,
    effects: [
      {
        name: `Appear at Kuoteq's Command`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is set up waiting to appear at Kuoteq's command as a reserve unit. You can set up 1 reserve unit waiting to appear at Kuoteq's command for each unit from the same battalion you set up on the battlefield. Kuoteq must be set up on the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Appear at Kuoteq's Command`,
        desc: `In your hero phase, you can set up one or more of the reserve units waiting to appear at Kuoteq's command on the battlefield more than 9" from any enemy units and wholly within 18" of Kuoteq. However, each reserve unit set up in the same turn must be a different unit chosen from a different warscroll - Kuoteq cannot command the same unit to appear more than once in the same turn. Reserve units that are set up in this way cannot move in the following movement phase. Any reserve units waiting to appear at Kuoteq's command which are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ancient Knowledge`,
        desc: `If Kuoteq is on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point. If Kuoteq is on the battlefield at the start of your hero phase, and this battalion contained the maximum number of battalions at the start of the battle, you receive 1 extra command point on a roll of 2+ instead of 4+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]
