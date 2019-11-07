import { AQSHY, ULGU } from 'types/realmscapes'
import { getRealmscape } from 'utils/realmUtils'
import { getVisibleReminders } from 'utils/pdf/generate/getVisibleReminders'

describe('realmUtils', () => {
  it('should return the correct realm from a given string', () => {
    const test1 = `Something from ${AQSHY}`
    const test2 = `A thing from ${ULGU}, wahoo`
    const test3 = `Incorrect capitalization of ULGU will not work`
    expect(getRealmscape(test1)).toEqual(AQSHY)
    expect(getRealmscape(test2)).toEqual(ULGU)
    expect(getRealmscape(test3)).toEqual(null)
  })
})

describe('pdf helpers', () => {
  const reminders = {
    DURING_GAME: [
      {
        condition: 'Celestial Hurricanum',
        name: 'Portents of Battle',
        desc: '',
        tag: false,
      },
      {
        name: 'Loyal Shields',
        desc: '',
        condition: 'Cities Of Sigmar Allegiance',
        tag: false,
        allegiance_ability: true,
        command_ability: false,
      },
    ],
    START_OF_HERO_PHASE: [
      {
        name: 'Wise Council',
        desc: '',
        condition: 'Cities Of Sigmar Allegiance',
        tag: false,
        allegiance_ability: true,
        command_ability: false,
      },
    ],
    DURING_HERO_PHASE: [
      {
        condition: 'Celestial Hurricanum',
        name: 'Locus of Azyr',
        desc: '',
        tag: false,
      },
      {
        name: 'Amplified Sorceries',
        desc: '',
        condition: 'Cities Of Sigmar Allegiance',
        tag: false,
        allegiance_ability: true,
        command_ability: false,
      },
    ],
    DURING_SHOOTING_PHASE: [
      {
        condition: 'Celestial Hurricanum',
        name: 'Storm of Shemtek',
        desc: '',
        tag: false,
      },
    ],
  }
  const hiddenReminders = [
    'DURING_GAME_Celestial_Hurricanum_Portents_of_Battle',
    'DURING_HERO_PHASE_Celestial_Hurricanum_Locus_of_Azyr',
    'DURING_SHOOTING_PHASE_Celestial_Hurricanum_Storm_of_Shemtek',
  ]
  it('should correctly determine the hidden reminders', () => {
    const expectedResult = {
      DURING_GAME: [
        {
          name: 'Loyal Shields',
          desc: '',
          condition: 'Cities Of Sigmar Allegiance',
          tag: false,
          allegiance_ability: true,
          command_ability: false,
        },
      ],
      START_OF_HERO_PHASE: [
        {
          name: 'Wise Council',
          desc: '',
          condition: 'Cities Of Sigmar Allegiance',
          tag: false,
          allegiance_ability: true,
          command_ability: false,
        },
      ],
      DURING_HERO_PHASE: [
        {
          name: 'Amplified Sorceries',
          desc: '',
          condition: 'Cities Of Sigmar Allegiance',
          tag: false,
          allegiance_ability: true,
          command_ability: false,
        },
      ],
    }

    // @ts-ignore
    expect(getVisibleReminders(reminders, hiddenReminders)).toEqual(expectedResult)
  })
})
