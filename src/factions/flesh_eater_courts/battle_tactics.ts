import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Screamed to Death': {
    effects: [
      {
        name: `Screamed to Death`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this battle tactic if that unit is destroyed this turn by an attack made with a missile weapon used by a friendly CRYPT FLAYERS unit, CRYPT INFERNAL COURTIER or ROYAL TERRORGHEIST.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Valiant Slaying': {
    effects: [
      {
        name: `Valiant Slaying`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this battle tactic if that unit is destroyed during this turn by an attack made by a friendly ABHORRANT.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Overrun: {
    effects: [
      {
        name: `Overrun`,
        desc: `You complete this battle tactic if every enemy unit on the battlefield is within 3" of a friendly FLESH-EATER COURTS unit at the end of the turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Glorious Feast': {
    effects: [
      {
        name: `Glorious Feast`,
        desc: `You complete this battle tactic if every friendly unit on the battlefield is wholly within 12" of a friendly FLESH-EATER COURTS HERO that has 6 noble deeds points at the end of the turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lance Formation': {
    effects: [
      {
        name: `Lance Formation`,
        desc: `You complete this battle tactic if 2 or more friendly KNIGHTS units made a charge move this turn and the charge roll for each of those units was 7 or more.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Ties of Chivalry': {
    effects: [
      {
        name: `The Ties of Chivalry`,
        desc: `Pick 1 objective on the battlefield that your opponent controls. You complete this battle tactic if you control that objective at the end of your turn and it is contested by at least 1 friendly SERFS model, 1 friendly KNIGHTS model and 1 friendly COURTIER model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')
