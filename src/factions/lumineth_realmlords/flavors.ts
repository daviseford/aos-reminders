import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const Flavors = {
  Ymetrica: {
    effects: [
      {
        name: `Mountain Realm`,
        desc: `When friendly Ymetrica Alarith units that have the Enduring as Rock ability are targeted by an attack, change the Rend characteristic for that attack to '-' if the weapon used for that attack has a Rend characteristic of -1 or -2 instead of only -1.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Syar: {
    effects: [
      {
        name: `Gleaming Brightness`,
        desc: `Friendly Syar units start the battle with 2 aetherquartz reserves instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Iliatha: {
    effects: [
      {
        name: `Unity of Purpose`,
        desc: `Once per turn, you can say that 2 friendly Iliatha Vanari units will use their aetherquartz reserves to use an aetherquartz reserve ability in the same phase instead of only 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  Zaitrec: {
    effects: [
      {
        name: `Lambent Mystics`,
        desc: `Add 1 to casting, dispelling or unbinding rolls for friendly Zaitrec Wizards.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Alumnia: {
    effects: [
      {
        name: `Claim the field`,
        desc: `If the base of each model in a friendly Alumnia Vanari unit is touching the bases of 2 or more other models in the same unit, each model in that unit that is within 6" of an objective counts as 2 models for the purposes of contesting that objective.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Helon: {
    effects: [
      {
        name: `Gale of Killing Shafts`,
        desc: `Add 1 to the hit and wound roll of missile weapons used by friendly Helon units that are within 6" of any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors
