import { HERO_PHASE } from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells.
const EndlessSpells: TEndlessSpells = [
  {
    name: `Shyish Reaper`,
    effects: [
      {
        name: `Summon Shyish Reaper`,
        desc: `Only NAGASH, SUPREME LORD OF THE UNDEAD and NIGHTHAUNT WIZARDS can attempt to cast Summon Shyish Reaper. Casting value of 7. If successfully cast, set up a Shyish Reaper model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Shyish Reaper can move up to 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Sweeping Death`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Reaper`,
        desc: `Before moving a Shyish Reaper, pivot the model on the centre of its base so that it points lengthways in the direction you wish it to move. Then move it in a straight line in that direction. The initial pivot is free and does not count towards the distance the model moves.

        After this model has moved, roll a D6 for each model that it moved over (including models it moved over when it pivoted); if the roll is equal to or greater than the model's Save characteristic, that model's unit suffers 1 mortal wound.
      `,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is being fought in the Realm of Shyish, a Shyish Reaper can move 12" instead of 8"`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Vault of Souls`,
    effects: [
      {
        name: `Summon Vault of Souls`,
        desc: `Only NAGASH, SUPREME LORD OF THE UNDEAD and NIGHTHAUNT WIZARDS can attempt to cast Summon Vault of Souls. Casting value of 6. If successfully cast, set up a Vault of Souls model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Vault of Souls can move 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Siphon`,
        desc: `After this model is set up or has moved, roll a D6 for each model within 6" of it. On a 6+, that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soul Eruption`,
        desc: `Keep track of the number of mortal wounds inflicted by this model. If the total is 20 or more at the end of any phase, all units within 6" of this model suffer D6 mortal wounds, and then this model is dispelled.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is being fought in the Realm of Shyish, the range of this model's Soul Siphon ability is 9" instead of 6".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mortalis Terminexus`,
    effects: [
      {
        name: `Summon Mortalis Terminexus`,
        desc: `Only NAGASH, SUPREME LORD OF THE UNDEAD and NIGHTHAUNT WIZARDS can attempt to cast Summon Mortalis Terminexus. Casting value of 6. If successfully cast, set up a Mortalis Terminexus model wholly within 18" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `Mortalis Terminexus can move 8" and can fly.`,
        when: [HERO_PHASE],
      },
      {
        name: `Keeper of Mortality`,
        desc: `After this model is set up or has moved, the controlling player must decide whether the Mortalis Terminexus will reverse or hasten time.

        If they choose to reverse time, heal D3 wounds allocated to each unit within 6" of this model.

        If they choose to hasten time, each unit within 6" of this model suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Empowered by Shyish`,
        desc: `If your battle is being fought in the Realm of Shyish, the range of this model's Keeper of Mortality ability - whether the controlling player chose to reverse or hasten time - is 12" instead of 6"`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default EndlessSpells
