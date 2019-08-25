import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Ambition's End`,
    effects: [
      {
        name: `Ambition's End`,
        desc: `Pick one of the bearer's melee weapons to be an Ambition's End. Roll a D6 at the end of the combat phase for any HERO that suffers an unsaved wound from this weapon. On a roll of 5 or more, the Hero suffers 1 mortal wound and, if they are a Wizard, they also forget a randomly selected spell that they know.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Secret-eater`,
    effects: [
      {
        name: `Secret-eater`,
        desc: `Pick one of the bearer's weapons to be a Secret-eater. Each time a HERO is slain by this weapon, you may roll another dice and immediately add it to your pool of Destiny Dice.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spiteful Shield`,
    effects: [
      {
        name: `Spiteful Shield`,
        desc: `Roll a D6 for each successful hit roll made against the bearer in the combat phase. On a 6, the attacking unit suffers a mortal wound once the attack has been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Souldraught`,
    effects: [
      {
        name: `Souldraught`,
        desc: `Once per battle, in any hero phase, the bearer may drink this potion. Until the end of the phase, roll three dice whenever they attempt to cast or unbind a spell and use the two highest results.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glamour Fetish`,
    effects: [
      {
        name: `Glamour Fetish`,
        desc: `Your opponent must add 1 to the result of any battleshock tests they take for their units within 9" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Windthief Charm`,
    effects: [
      {
        name: `Windthief Charm`,
        desc: `Once per battle, at the start of your movement phase, you can use the Windthief Charm. If you do, for that movement phase the bearer can fly and you can double their Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Wicked Shard`,
    effects: [
      {
        name: `Wicked Shard`,
        desc: `Pick one of the bearer's melee weapons to be a Wicked Shard. Re-roll wound rolls of 1 for this weapon. Re-roll all failed wound rolls instead if the bearer successfully cast or unbound a spell in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Changeblade`,
    effects: [
      {
        name: `Changeblade`,
        desc: `Pick one of the bearer's melee weapons to be a Changeblade. Whenever a Hero is slain by a wound inflicted by this weapon, before you remove the hero's model, you can add a Tzeentch Chaos Spawn to your army and set it up within 1" of the hero's model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Nexus Staff`,
    effects: [
      {
        name: `Nexus Staff`,
        desc: `Pick one of the bearer's weapons to be a Nexus Staff. Whenever a Hero is slain by a wound inflicted by this weapon, roll a D6 for each enemy unit that is within 9" of the slain model. On a roll of 4 or more the unit being rolled for suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Timeslip Pendant`,
    effects: [
      {
        name: `Timeslip Pendant`,
        desc: `Once per battle, at the end of any combat phase, the bearer can enter a timeslip. If they do, they can pile in and attack for a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daemonheart`,
    effects: [
      {
        name: `Daemonheart`,
        desc: `Once per battle, at the end of any hero phase, the bearer can tap into the baleful energies of the Daemonheart. Add 1 to the Damage characteristic of all of the bearer's melee weapons for the duration of the turn. However, at the end of the combat phase, roll a D6; on a roll of 1, the bearer suffers a mortal wound.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Paradoxical Shield`,
    effects: [
      {
        name: `Paradoxical Shield`,
        desc: `Re-roll successful save rolls for the bearer. In addition, add 2 to the save rolls for the bearer (after any re-rolls have been taken).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warpfire Blade`,
    effects: [
      {
        name: `Warpfire Blade`,
        desc: `Pick one of the bearer's melee weapons to be a Warpfire Blade. Wound rolls of 6 or more made for this weapon cause a mortal wound in addition to their normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sentient Weapons`,
    effects: [
      {
        name: `Sentient Weapons`,
        desc: `Enemy units can never benefit from modifiers to their save rolls or Save characteristic (e.g. from being in cover) against attacks made by this daemon.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blade of Fate`,
    effects: [
      {
        name: `Blade of Fate`,
        desc: `Pick one of the bearer's melee weapons to be a Blade of Fate. If you have at least one dice in your pool of Destiny Dice when making an attack with this weapon, you can re-roll failed hit and wound rolls of 1. However, if there are 9 Destiny Dice in the pool when the bearer attacks with this weapon, you can instead re-roll all failed hit and wound rolls.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Souleater`,
    effects: [
      {
        name: `Souleater`,
        desc: `Pick one of the bearer's melee weapons to be a Souleater. Each time the bearer slays a HERO with this weapon, add 1 to this weapon's Attacks for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Phantasmal Weapons`,
    effects: [
      {
        name: `Phantasmal Weapons`,
        desc: `Improve the Rend characteristic of all melee weapons wielded by this daemon by 1 (if it has a Rend characteristic of '-'it becomes -1).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pyrofyre Stave`,
    effects: [
      {
        name: `Pyrofyre Stave`,
        desc: `Add 1 to any wound rolls you make for the bearer's attacks in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Lord of Flux`,
    effects: [
      {
        name: `Lord of Flux`,
        desc: `Roll a D6 at the beginning of each combat phase for each enemy unit within 3" of this daemon. On a roll of 4 or more that unit suffers a mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aura of Mutability`,
    effects: [
      {
        name: `Aura of Mutability`,
        desc: `You can re-roll wound rolls of 1 for friendly units of TZEENTCH DAEMONS within 3" of this daemon.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Cursed Ichor`,
    effects: [
      {
        name: `Cursed Ichor`,
        desc: `Roll a D6 at the end of the combat phase if any wounds were allocated to this daemon in the combat phase (even if this daemon was slain). On a roll of 2 or more, one enemy unit that attacked this daemon in that combat phase suffers 1 mortal wound. If several enemy units attacked this daemon, randomly select the unit that suffers the mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wellspring of Arcane Might`,
    effects: [
      {
        name: `Wellspring of Arcane Might`,
        desc: `You can re-roll any casting roll dice which are showing a 1 for any friendly units of TZEENTCH DAEMONS within 9" of this daemon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aspect of Tzeentch`,
    effects: [
      {
        name: `Aspect of Tzeentch`,
        desc: `Each time you expend a Destiny Dice whilst this daemon is on the battlefield, roll a D6. On a 6 you may immediately roll another dice and add it to your Destiny Dice pool.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mark of the Conjurer`,
    effects: [
      {
        name: `Mark of the Conjurer`,
        desc: `If the casting roll for this daemon is a double, and is successful and not unbound, you receive 2 Fate Points instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // {
  //   name:``,
  //   effects: [
  //     {
  //       name:``,
  //       desc:``,
  //       when: [START_OF_SETUP],
  //     },
  //   ],
  // },
]

export default Artifacts
