import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  // Gifts of Morathi
  {
    name: `Crown of Woe`,
    effects: [
      {
        name: `Crown of Woe`,
        desc: `Subtract 1 from the bravery characteristic of enemy units that are within 7" of the bearer. The first time the bearer slays an enemy model, the range of this ability is increased to 14" for the remainder of the battle.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Cursed Blade`,
    effects: [
      {
        name: `Cursed Blade`,
        desc: `Add 1 to the hit rolls made for the selected melee weapon. In addition, each time a hit roll of 7+ is made for that weapon, the target suffers 1 mortal wound instead of the normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Amulet of Dark Fire`,
    effects: [
      {
        name: `Amulet of Dark Fire`,
        desc: `Roll a D6 each time the bearer is allocated a mortal wound inflicted by an enemy spell. On a 4+ that wound is negated.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Crone Blade`,
    effects: [
      {
        name: `Crone Blade`,
        desc: `Each time an enemy model is slain by the selected melee weapon, you can heal 1 wound allocated to the bearer.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Thousand and One Dark Blessings`,
    effects: [
      {
        name: `Thousand and One Dark Blessings`,
        desc: `Add 1 to the save rolls for the bearer.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Bloodbane Venom`,
    effects: [
      {
        name: `Bloodbane Venom`,
        desc: `If a model is allocated any wounds from attacks made using the selected melee weapon but not slain, roll a D6 after the bearer has finished all of their attacks. If the roll equals or exceeds the target's wound characteristic, it is slain.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  // Artifacts of Shadow
  {
    name: `Shadow Stone (Wizard)`,
    effects: [
      {
        name: `Shadow Stone (Wizard)`,
        desc: `Re-roll dice rolls of 1 that are made as part of a casting roll for the bearer. In addition add 1 to the casting roll if the bearer attempts a spell from the Lore of Shadows.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Rune of Ulgu (Wizard)`,
    effects: [
      {
        name: `Rune of Ulgu (Wizard)`,
        desc: `The bearer knows one additional spell from the Lore of Shadows.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `The Mirror Glaive (Wizard)`,
    effects: [
      {
        name: `The Mirror Glaive (Wizard)`,
        desc: `Each time the bearer unbinds an enemy spell, they can immediately attempt to cast either the Mystic Shield or Arcane Bolt spells as if they were your hero phase. Your opponent cannot attempt to unbind this spell if the casting roll is successful.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Seven-fold Shadow (Wizard)`,
    effects: [
      {
        name: `Seven-fold Shadow (Wizard)`,
        desc: `Once per battle, instead of moving the bearer, you can remove them from the battlefield and set them up anywhere on the battlefield more that 9" from any enemy models. This is their move for that movement phase.`,
        when: [MOVEMENT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Crystal Heart (Wizard)`,
    effects: [
      {
        name: `Crystal Heart (Wizard)`,
        desc: `The bearer can attempt to cast a second spell in each of your hero phases. If they do so, roll a D6 before the casting roll is made. On a 1, the bearer suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Shade Claw (Wizard)`,
    effects: [
      {
        name: `Shade Claw (Wizard)`,
        desc: `The bearer's Whisperclaw has a Rend characteristic of -2.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  // Relics of Khaine
  {
    name: `Blood Sigil (Priest)`,
    effects: [
      {
        name: `Blood Sigil (Priest)`,
        desc: `The bearer knows an additional prayer from the Prayers of the Khainite Cult.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Iron Circlet (Priest)`,
    effects: [
      {
        name: `Iron Circlet (Priest)`,
        desc: `Whenever the bearer prays, re-roll rolls of 1 when seeing if the prayer is successful or not.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Rune of Khaine (Priest)`,
    effects: [
      {
        name: `Rune of Khaine (Priest)`,
        desc: `When the bearer is slain, roll a D6. On a 1 nothing happens. On a 2-5 the unit that slew the bearer suffers D3 mortal wounds. On a 6 the slayer suffers D6 mortal wounds.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Crimson Shard (Priest)`,
    effects: [
      {
        name: `Crimson Shard (Priest)`,
        desc: `The bearer's Blade of Khaine has a to wound characteristic of 2+.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Khainite Pendant (Priest)`,
    effects: [
      {
        name: `Khainite Pendant (Priest)`,
        desc: `The bearer can pray three times in your hero phase. However the first time a 1 is rolled when the bearer prays and they are found unworthy, they suffer D3 mortal wounds instead of 1.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Hagbrew (Priest)`,
    effects: [
      {
        name: `Hagbrew (Priest)`,
        desc: `Add 1 to the wound rolls for the bearer's melee weapons.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Artifacts
