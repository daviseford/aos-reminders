// import { COMBAT_PHASE, SAVES_PHASE } from 'types/phases'
// import artifacts from './artifacts'
// import CommandAbilities from './command_abilities'
// import Spells from './spells'
//
// const Units = {
//   'Unit 1': {
//     effects: [
//       {
//         name: `Force Field`,
//         desc: `Go Go Power Rangers.`,
//         when: [COMBAT_PHASE],
//       },
//     ],
//   },
//   'Unit 2': {
//     effects: [
//       {
//         name: `Force Field`,
//         desc: `Go Go Power Rangers.`,
//         when: [COMBAT_PHASE],
//       },
//     ],
//   },
//   'Simple Hero': {
//     mandatory: {
//       artifacts: [keyPicker(artifacts, ['Artifact 1'])],
//     },
//     effects: [
//       {
//         name: `A Simple Rule`,
//         desc: `2+2, or something like that.`,
//         when: [SAVES_PHASE],
//       },
//     ],
//   },
// }
//
// // This is a pattern we use when we need to reference other units
// const aComplexCharacter = {
//   'A Complex Character': {
//     mandatory: {
//       artifacts: [keyPicker(artifacts, ['Another Artifact'])],
//       spells: [keyPicker(Spells, ['A Second Spell'])],
//       command_abilities: [keyPicker(CommandAbilities, ['Command Ability 1'])],
//
//       // Let's say that when this character is selected, Simple Hero must also be selected
//       // Note - not the inverse! We don't want to select this character just because we selected Simple Hero
//       units: [keyPicker(Units, ['Simple Hero'])],
//     },
//     effects: [
//       {
//         name: `A Complex Rule`,
//         desc: `e=mc2, or something like that.`,
//         when: [COMBAT_PHASE],
//       },
//     ],
//   },
// }
//
// export default tagAs({ ...Units, ...aComplexCharacter }, 'unit')
//
export {}
