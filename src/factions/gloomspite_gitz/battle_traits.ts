import { tagAs } from 'factions/metatagger'
import { GLOOMSPITE_GITZ } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  'The Bad Moon': {
    effects: [
      {
        name: `The Bad Moon Setup`,
        desc: `If any of the armies in a battle are Gloomspite Gitz armies, in the first battle round, after players have received their starting command points but before the start of the first turn, the player commanding the Gloomspite Gitz army picks 1 large quarter of the battlefield (core rules 28.2.8) as the Bad Moon's starting location. If more than 1 player in the battle is commanding a Gloomspite Gitz army, then those players roll off and the winner picks which large quarter is the Bad Moon's starting location.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Bad Moon Movement`,
        desc: `During the battle, the Bad Moon will move and its location will change. The Bad Moon starts in a large quarter of the battlefield. The first time it moves, it moves to the centre of the battlefield. Then it moves to the large quarter diagonally opposite the large quarter in which it started. Finally, it moves off the battlefield.

        At the start of the second and each subsequent battle round, before the priority roll, the player commanding the Gloomspite Gitz army rolls a dice. If more than 1 player in the battle is commanding a Gloomspite Gitz army, then those players roll off and the winner rolls the dice. On a 1-3, the Bad Moon does not move and instead stays at its current location. On a 4+, it moves to the next location. When the Bad Moon moves off the battlefield, it has no further effect on the battle.
        
        The location of the Bad Moon determines which GLOOMSPITE GITZ units are affected by the Light of the Bad Moon. While the Bad Moon is located in a large quarter of the battlefield, all GLOOMSPITE GITZ units wholly within the same large quarter are affected. While it is located in the centre of the battlefield, all GLOOMSPITE GITZ units on the battlefield are affected.`,
        when: [START_OF_ROUND],
      },
    ],
  },

  [GLOOMSPITE_GITZ]: {
    effects: [
      {
        name: `Light of the Bad Moon - Lunar Squigs`,
        desc: `While GLOOMSPITE GITZ SQUIG units are affected by the Light of the Bad Moon they can attempt a charge even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Light of the Bad Moon - Frothing Zealots`,
        desc: `If a friendly MOONCLAN unit receives the rally command while it is affected by the Light of the Bad Moon, you can return 1 slain model to the unit that receives the command for each 4+ instead of each 6.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Light of the Bad Moon - Spiderfang Venom`,
        desc: `While SPIDERFANG units are affected by the Light of the Bad Moon, their Spider Venom ability causes mortal wounds on an unmodified roll of 5+ instead of a 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Light of the Bad Moon - Moonlit Hide`,
        desc: `Add 1 to save rolls for attacks that target GLOOMSPITE GITZ TROGGOTH units while they are affected by the Light of the Bad Moon.`,
        when: [SAVES_PHASE],
      },

      // Battle Tactics
      {
        name: `Battle Tactic - Follow da Moon`,
        desc: `You cannot pick this tactic in the first battle round. You complete this tactic if at the end of this turn every friendly GLOOMSPITE GITZ unit on the battlefield is affected by the Light of the Bad Moon and you control more objectives than your opponent.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Glory Grabbers`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if at the end of this turn you control that objective and a friendly GLOOMSPITE GITZ unit that was added to your army as a replacement unit using the Bad Moon Loonshrine's Moonclan Lairs ability is contesting it.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Venomous Assault`,
        desc: `You complete this tactic if at least 8 mortal wounds were caused by the Spider Venom ability of friendly SPIDERFANG units during this turn and not negated.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Stab 'Em in the Dark`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that unit was destroyed by an attack made by a friendly GLOOMSPITE GITZ unit during this turn while it was not affected by the Light of the Bad Moon.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Moonlight Raid`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if at the end of this turn you control that objective and every friendly GLOOMSPITE GITZ unit that is contesting it is affected by the Light of the Bad Moon.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - You Ain't So Big`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this tactic if that MONSTER was slain by an attack made by a friendly GLOOMSPITE GITZ TROGGOTH unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },

      // Monstrous Rampages
      {
        name: `Monstrous Rampage - Ensnaring Webbing`,
        desc: `Only an ARACHNAROK unit can carry out this monstrous rampage. Pick 1 enemy HERO within 3" of this ARACHNAROK unit that is not a MONSTER and roll a dice. If the score equals or exceeds that HERO's Wounds characteristic, that hero cannot fight in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Monstrous Rampage - Giant Boing!`,
        desc: `Only a MANGLER SQUIGS unit that has made a charge move this turn can carry out this monstrous rampage. This MANGLER SQUIGS unit can make a 3D6" move but it must finish that move within 3" of any enemy units.`,
        when: [END_OF_CHARGE_PHASE],
      },

      // Heroic Actions
      {
        name: `Heroic Action - Beckon the Loonatic Hordes`,
        desc: `Only a MOONCLAN HERO affected by the Light of the Bad Moon can carry out this heroic action. This HERO can immediately issue the Rally command up to 3 times without any command points being spent. Each unit that receives the command must be a different friendly MOONCLAN unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action - Wade and Smash`,
        desc: `Only a DANKHOLD TROGGBOSS within 3" of any enemy units can carry out this heroic action. This DANKHOLD TROGGBOSS can make a 6" move but must finish the move within 3" of any enemy units. At the end of that move, roll a dice for each enemy unit within 1" of this DANKHOLD TROGGBOSS. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  "Trugg's Troggherd": {
    effects: [
      {
        name: `Moonlit Hide`,
        desc: `Add 1 to save rolls for attacks that target friendly TRUGG'S TROGGHERD units while they are affected by the Light of the Bad Moon.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Aura of Haywire Magic`,
        desc: `At the start of your hero phase, if you use a friendly TRUGG'S Malfunctioning Leystone ability, the effect you pick applies to all other friendly TRUGG'S TROGGHERD units until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The King's Wreckerz`,
        desc: `Friendly TRUGG'S TROGGHERD units that do not have the HERO keyword gain the Battleline battlefield role.`,
        when: [DURING_GAME],
      },

      // Battle Tactics
      {
        name: `Battle Tactic - Don't Like Dat One!`,
        desc: `Pick 1 enemy HERO. You complete this battle tactic if that HERO was destroyed during this turn by an attack made by a friendly TRUGG.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Feels Funny`,
        desc: `You complete this battle tactic if a friendly TRUGG'S TROGGHERD unit destroyed an enemy unit during this turn while it was affected by the Aura of Haywire Magic battle trait (pg 76).`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battle Tactic - Wot's Dat Glowy Fing?`,
        desc: `Pick 1 objective you do not control. You complete this battle tactic if you control that objective at the end of this turn and 2 or more friendly TRUGG'S TROGGHERD units that are affected by the Light of the Bad Moon are contesting that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
