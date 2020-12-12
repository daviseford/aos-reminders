// import { END_OF_CHARGE_PHASE, HERO_PHASE } from 'types/phases'
// import Units from './units'

// const RegularBattalions = {
//   'Regular Battalion 1': {
//     effects: [
//       {
//         name: `First Effect from Regular Battalion 1`,
//         desc: `In your hero phase, etc.`,
//         when: [HERO_PHASE],
//       },
//     ],
//   },
//   'Regular Battalion 2': {
//     mandatory: {
//       units: [keyPicker(Units, ['Simple Hero'])],
//     },
//     effects: [],
//   },
// }

// const SuperBattalions = {
//   'Super Battalion': {
//     mandatory: {
//       // This battalion requires these two battalions to be a part of it.
//       battalions: [keyPicker(RegularBattalions, ['Regular Battalion 1', 'Regular Battalion 2'])],
//     },
//     effects: [
//       {
//         name: `First Effect from Super Battalion`,
//         desc: `etc etc.`,
//         when: [END_OF_CHARGE_PHASE],
//       },
//     ],
//   },
// }

// const Battalions = { ...RegularBattalions, ...SuperBattalions }

// export default tagAs(Battalions, 'battalion')

export {}
