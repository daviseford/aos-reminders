import GenericEffects from 'army/generic/effects'
import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const DeadlyVenomEffect = {
  name: `Deadly Venom`,
  desc: `Each time you roll a hit roll of 6+ for this unit, that attack inflicts 1 mortal wound instead of normal damage (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
}

export const LegacyOrderUnits: TUnits = [
  {
    name: `Hunting Hounds`,
    effects: [
      {
        name: `Hounds of the Wild Hunt`,
        desc: `Add 1 to the Attacks characteristic of this unit's Savage Teeth while it is within 6" of any friendly Avatars of the Hunt.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Great Eagles`,
    effects: [
      {
        name: `Death from the Skies`,
        desc: `Add 2 to the Attacks characteristic of this unit's Beaks and Talons if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soar Away`,
        desc: `At the end of the combat phase you may declare that this unit will swoop out of combat and soar away as long as there are enemy models within 3" of it. If you do, roll 3D6; the result is how far you can immediately move this unit. The unit must end this move more than 3" from any enemy units - if they are unable to do so then they fail to escape and cannot swoop out of combat and soar away.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Tree Kin`,
    effects: [
      {
        name: `Roused to War`,
        desc: `Add 1 to hit rolls for this unit's Bludgeoning Branches if it made a charge move this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Greatcannon`,
    effects: [
      ...GenericEffects.CrewedWarMachine('Crewed Artillery'),
      {
        name: `Grapeshot`,
        desc: `Instead of firing a Cannon Ball using the profile above in the shooting phase, the Crew can load their war machine with grapeshot; if they do, then select a target that is visible to the Greatcannon. Roll one dice for each model in the target unit that is within 10" of the Greatcannon; for each roll of a 6, that unit suffers a mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Knights of Order`,
    effects: [
      {
        name: `Preceptor`,
        desc: `The leader of this unit is a Preceptor. Add 1 to the Attacks characteristic of the Preceptor's Lance and Sword or Cavalry Hammer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. While the unit includes any Standard Bearers, it only needs to take a battleshock test if two or more of its models were slain during the turn.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Hornblower`,
        desc: `Models in this unit may be Hornblowers. If the unit includes any Hornblowers, add 2 to its charge rolls.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Shield`,
        desc: `Reroll save rolls of 1 for a unit equipped with Shields.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Charging Lance`,
        desc: `Add 1 to the wound rolls and Damage characteristic for this unit's Lances and Swords if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Freeguild Archers`,
    effects: [
      {
        name: `Marksman`,
        desc: `The leader of this unit is a Marksman. Add 1 to the hit rolls for a Marksman using a Bow.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Huntsmen`,
        desc: `After set-up is complete, you can make a bonus move with this unit as if it were moving in the movement phase.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Ordered Volleys`,
        desc: `You can reroll hit rolls of 1 for Freeguild Archers in the shooting phase. You can reroll hit rolls of 1 or 2 instead if the unit has 20 or more models, or reroll any failed hit roll if it has 30 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Celestial Swarms`,
    effects: [
      {
        name: `Swarming Tide`,
        desc: `In your hero phase, you may heal D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
      DeadlyVenomEffect,
    ],
  },
  {
    name: `Chameleon Skink Stalker`,
    effects: [
      {
        name: `Chameleon Ambush`,
        desc: `Instead of setting up this model, you can place it to one side and say that it is in hiding.`,
        when: [DURING_SETUP],
      },
      {
        name: `Chameleon Ambush`,
        desc: `At the end of your movement phase you can reveal this model by setting it up anywhere on the battlefield, more than 9" from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Disappear from Sight`,
        desc: `In your hero phase, you can declare that the Skink Stalker will vanish from sight and go into hiding. If it does so, remove this model from the battlefield. You can reveal it as described in the Chameleon Ambush ability in this turn or any subsequent turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flawless Mimicry`,
        desc: `If this model is within or on a terrain feature, its Save characteristic is 3+ rather than 6+. This includes the bonus for being in cover.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Master Hunter`,
        desc: `Add 2 to the result of wound rolls for this model's Stalker Blowpipe if it did not move, and was not set up, in the movement phase of the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Witch Hunter`,
    effects: [
      {
        name: `Baroque Pistols`,
        desc: `A Witch Hunter equipped with two Baroque Pistols makes 2 attacks in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Grim Resolve`,
        desc: `Roll a dice if a Witch Hunter is targeted or affected by an enemy spell. On a 5 of more, that spell has no effect on the Witch Hunter (but it may affect other units normally).`,
        when: [HERO_PHASE],
      },
      {
        name: `Sigmar's Judgement`,
        desc: `A Witch Hunter's attacks inflict D3 Damage instead of 1 if the target of the attack is a Wizard or a Daemon.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `War Altar of Sigmar`,
    effects: [
      {
        name: `Divine Power`,
        desc: `The Arch Lector atop a War Altar of Sigmar can attempt to unbind 2 spells in each enemy hero phase as if it were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sigmar's Shield`,
        desc: `If a friendly Devoted of Sigmar model is slain by a wound or mortal wound that has been allocated to the model while it is within range of any friendly models with the Sigmar's Shield ability, roll a dice before the slain model is removed from play. On a 6, the wound or mortal wound is negated and the model is not slain. The range of the Sigmar's Shield ability for this model is shown on the damage table on the warscroll.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Power of Faith`,
        desc: `Devoted of Sigmar units from your army do not need to take battleshock tests if they are within 10" of a War Altar.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Light of Banishment`,
        desc: `When you make a Light of Banishment attack against a Chaos unit, double any wounds it suffers. The holy light is especially dangerous to Chaos Daemons, who cannot abide its searing touch. Furthermore, attacks against these units are resolved with a Rend of -2 instead of -1.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Devotional Horn`,
        desc: `Once per battle, the Devotional Horn can be blown in a battleshock phase. When it is blown, all enemy units within 10" of the War Altar must subtract 1 from their Bravery until the end of that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Battle Prayers`,
        desc: `In your hero phase, the Arch Lector can pray to Sigmar. If he does so, pick a Devoted of Sigmar unit within 10", select one of the following blessings and roll a dice. On a 1 or a 2, his prayers go unanswered, but on a 3 or more they have been heard:

        Soulfire: Roll a dice for each enemy unit within 3" of the unit you picked; on a 4 or more it is struck by soulfire and suffers a mortal wound.

        Righteous Fury: Until your next hero phase you can reroll failed hit rolls for the unit in the combat phase.

        Holy Fervour: Until your next hero phase, you can add 1 to the unit's run rolls, charge rolls, and hit rolls in the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skink Prophet`,
    effects: [
      DeadlyVenomEffect,
      {
        name: `Priestly Rites`,
        desc: `In your hero phase, you may declare that this model is performing a rite to harness the power of the heavens. If you do so, roll a dice. If the result is 4+ you can reroll run rolls, charge rolls and save rolls for this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skink Chief`,
    effects: [
      {
        name: `Marked for Greatness`,
        desc: `You can reroll a single dice for this model in each phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE, CHARGE_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
      {
        name: `Star-buckler`,
        desc: `When making save rolls for this model, ignore the attacking weapon's Rend characteristic unless it is -2 or better.`,
        when: [SHOOTING_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Warrior Priest`,
    effects: [
      {
        name: `Warhorse`,
        desc: `A Warrior Priest can be mounted on a barded Warhorse, granting them a Move of 12" and the Steel-shod Hooves attack.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
      {
        name: `Sigmarite Shield`,
        desc: `A Warrior Priest with a Sigmarite Shield has a Save of 3+.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Sigmarite Warhammers`,
        desc: `You can reroll hit rolls of 1 for a Warrior Priest armed with two Sigmarite Warhammers.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Divine Power`,
        desc: `A Warrior Priest can attempt to unbind 1 spell in each enemy hero phase, as if he were a wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Battle Prayers`,
        desc: `In your hero phase, a Warrior Priest can pray to Sigmar. If he does so, pick a Devoted of Sigmar unit within 10", select one of the following blessings and roll a dice. On a 1 or a 2, his prayers go unanswered, but on a 3 or more they have been heard:

        Shield of Faith: Until your next hero phase, you can roll a dice each time the unit suffers a wound or a mortal wound. On a 6, that wound is ignored.

        Hammer of Sigmar: Until your next hero phase you can reroll failed wound rolls for the unit in the combat phase.

        Healing Hands: One model in the unit immediately heals D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]
