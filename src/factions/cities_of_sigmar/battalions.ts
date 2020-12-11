import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
} from 'types/phases'

const Battalions = {
  'Hammerhalian Lancers': {
    effects: [
      {
        name: `Glorious Cavalry Charge`,
        desc: `Add 1 to hit and wound rolls for attacks made with melee weapons by units from this battalion that made a charge move in the same turn and are wholly within 18" of the Freeguild General on Griffon from the same battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Viridian Pathfinders': {
    effects: [
      {
        name: `Masters of Ambush`,
        desc: `Add 1 to charge rolls for friendly units from this battalion if they used the Hunters of the Hidden Paths battle trait to setup on the battlefield in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Greywater Artillery Company': {
    effects: [
      {
        name: `A Greywater Welcome`,
        desc: `In your shooting phase in the first battleround, friendly WARMACHINES from this battalion can shoot twice if they are within 6" of a friendly HERO from this battalion and are not within 3" of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Whitefire Retinue': {
    effects: [
      {
        name: `Triarch Covenant`,
        desc: `Add 1 to casting and unbinding rolls for friendly WIZARDS from this battalion while they are within 6" of another friendly model from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Aetherguard Windrunners': {
    effects: [
      {
        name: `Swift Like the Wind`,
        desc: `Units from this battalion can retreat and still shoot and/or charge later in the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Charrwind Beasthunters': {
    effects: [
      {
        name: `Beasthunters`,
        desc: `+1 to wound for attacks made by units in this battalion against an enemy MONSTER.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Phoenix Flight': {
    effects: [
      {
        name: `Golden Aura of the Phoenicium`,
        desc: `Heal 1 wound allocated to each friendly PHOENICIUM unit wholly within 12" of any units from this battalion.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Greywater Shieldband (Greywater Fastness)': {
    effects: [
      {
        name: `Oathsworn Defenders`,
        desc: `Add 1 to hit rolls for attacks made by units from this battalion if they did not move in the same turn and are wholly within 12" of a HERO from the same battalion.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  "Kraeth's Shadowhost": {
    effects: [
      {
        name: `Subjugated`,
        desc: `If this battalion's sorceress is on the battlefield, you can add 1 to the attacks characteristic of Dreadspears and Darkshards in this battalion until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Subjugated`,
        desc: `If active, you can add 1 to the attacks characteristic of Dreadspears and Darkshards in this battalion.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Subjugated`,
        desc: `If active, subtract 1 from the save rolls of Dreadspears and Darkshards in this battalion.`,
        when: [SAVES_PHASE],
      },
      {
        name: `The Whisperers`,
        desc: `You receive one extra command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
        command_trait: true,
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')
