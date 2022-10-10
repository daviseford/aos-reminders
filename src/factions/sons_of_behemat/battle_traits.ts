import { tagAs } from 'factions/metatagger'
import { SONS_OF_BEHEMAT } from 'meta/factions'
import { DURING_GAME, END_OF_CHARGE_PHASE, SHOOTING_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const BattleTraits = {
  [SONS_OF_BEHEMAT]: {
    effects: [
      {
        name: `Mightier Makes Rightier`,
        desc: `Each Mega-Gargant has a Mightier Makes Rightier value listed on its damage table on its warscroll. For the purposes of contesting objectives, each Mega-Gargant model in a Sons of Behemat army counts as a number of models equal to its Mightier Makes Rightier value, while each Mancrusher Gargant model counts as 10 models.`,
        when: [DURING_GAME],
      },
      {
        name: `Chuck Rocks`,
        desc: `In your shooting phase, you can pick 1 friendly MANCRUSHER GARGANT unit wholly within 18" of your general. Each model in that unit can make a shooting attack with the Chuck Rocks missile weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `That's Mine!`,
        desc: `Pick 1 objective on the battlefield that is not within your territory. You complete this tactic if that objective is kicked away and is wholly within your territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Wrecking Crew`,
        desc: `You complete this tactic if an enemy faction terrain feature was demolished during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Man-skittles`,
        desc: `You complete this tactic if a friendly Warstomper used its 'Hurled Body' ability, an enemy model was slain by the first part of the ability, and an enemy Battleline unit was picked for the second part of the ability and suffered any mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fury of Titans`,
        desc: `You complete this tactic if you carry out the Beast Grapple, Earth-Shaking Roar and Colossal Slam monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Splat!`,
        desc: `Pick 1 enemy Hero. You complete this tactic if that Hero is slain by wounds caused by an attack made with Throwin' Rocks, Hurled Debris or a Hurled Boulder during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Colossal Violence`,
        desc: `Pick 1 friendly Mega-Gargant. You complete this tactic if you carried out the Titanic Duel monstrous rampage with that unit during this turn and the enemy Monster picked as the target was slain by attacks made by that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Monstrous Rampages': {
    effects: [
      {
        name: `Beast Grapple`,
        desc: `Pick 1 enemy MONSTER within 3"of this unit and roll a dice. On a 3+, until the end of the following combat phase, the strike-last effect applies to both that Monster and the unit carrying out this monstrous rampage.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Earth-shaking Roar`,
        desc: `Pick 1 enemy unit with a Wounds characteristic of 1 or 2 within 3" of this unit and roll 2D6. If the roll is higher than that unit's Bravery characteristic, for each point by which the roll exceeds the unit's Bravery characteristic, 1 model in that unit flees. That unit's commanding player decides battleshock which test models flee. The effect of this monstrous rampage is not considered to be a battleshock test.`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Colossal Slam`,
        desc: `Pick 1 enemy MONSTER that is not part of a unit consisting of 2 or more models and that is within% of this unit. Roll a dice.On a 3+,you can remove that MONSTER from the battlefield and set it up again anywhere wholly on open ground within 1/2"of this unit.That MONSTER suffers D3 mortal wounds. In addition, subtract 1 from hit rolls for attacks made by the unit carrying out this monstrous rampage until the end of the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')
