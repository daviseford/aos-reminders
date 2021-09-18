import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const BonesplitterzArtifacts = {
  "Glowin' Tattooz": {
    effects: [
      {
        name: `Glowin' Tattooz`,
        desc: `Add 2 to ward rolls made for the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },

  'Dokk Juice': {
    effects: [
      {
        name: `Dokk Juice`,
        desc: `Once per battle, in your hero phase, you can heal up to D6 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Lucky Bone': {
    effects: [
      {
        name: `Lucky Bone`,
        desc: `Once per phase, you can reroll either 1 hit roll or 1 wound roll for an attack made by the bearer, or you can reroll 1 save roll for an attack that targets the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, SAVES_PHASE],
      },
    ],
  },

  "Mork's Boney Bitz": {
    effects: [
      {
        name: `Mork's Boney Bitz`,
        desc: `You can add 1 to casting, dispelling and unbinding rolls for the bearer for each enemy MONSTER within 24" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Beast-lure Glyphs': {
    effects: [
      {
        name: `Beast-lure Glyphs`,
        desc: `Once per battle, at the start of your hero phase, you can pick 1 spell from the Lore of the Savage Beast (pg 91) that the bearer does not know and has not attempted to cast during the battle. The bearer can attempt to cast that spell in that hero phase in addition to any other spells that they can attempt to cast.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Maw-Krusha Beast Totem': {
    effects: [
      {
        name: `Maw-Krusha Beast Totem`,
        desc: `Once per battle, the bearer can use the Innard-Bursting Bellow from the Maw Krusha warscroll.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Kattanak Pelt': {
    effects: [
      {
        name: `Kattanak Pelt`,
        desc: `Add 1 to the Bravery characteristic of friendly units that are wholly within 18" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  "Burnin' Tattooz": {
    effects: [
      {
        name: `Burnin' Tattooz`,
        desc: `If you make a successful Warpaint save, pick an enemy unit within 1" and deal 1 mortal wound in return.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  // Seem to have been removed in the 2021 battletome
  // 'Greatdrake Toof': {
  //   effects: [
  //     {
  //       name: `Greatdrake Toof`,
  //       desc: `Pick a melee weapon to become the Greatdrake Toof. On an unmodified wound roll of 6 this weapon deals double damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Weepwood Big Shiv': {
  //   effects: [
  //     {
  //       name: `Weepwood Big Shiv`,
  //       desc: `Pick a melee weapon. Add 1 to the attacks characteristic of this weapon.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Savage Trophy': {
  //   effects: [
  //     {
  //       name: `Savage Trophy`,
  //       desc: `Add 1 to the Bravery characteristic of all friendly Bonesplitterz models within 10" of the bearer.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // 'Big Wurrgog Mask': {
  //   effects: [
  //     {
  //       name: `Big Wurrgog Mask`,
  //       desc: `Pick an enemy unit within 12" in the hero phase and roll up to 3 dice, each 2+ inflicts D3 MW's on the unit, on a 1 you take D3 MW's.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Mystic Waaagh! Paint': {
  //   effects: [
  //     {
  //       name: `Mystic Waaagh! Paint`,
  //       desc: `At the start of your hero phase roll a D6 on the spell lore table, this wizard can attempt to cast it for free, if it already knows the spell rolled it gets 1 additional spell cast for the turn.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(BonesplitterzArtifacts, 'artifact')
