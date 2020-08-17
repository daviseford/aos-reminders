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
  SHOOTING_PHASE,
} from 'types/phases'

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
    name: `Celestial Swarm`,
    effects: [
      {
        name: `Swarming Tide`,
        desc: `In your hero phase, you may heal D3 wounds allocated to this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deadly Venom`,
        desc: `Each time you roll a hit roll of 6+ for this unit, that attack inflicts 1 mortal wound instead of normal damage (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
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
]
