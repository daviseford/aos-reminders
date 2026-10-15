import { describe, expect, it } from 'vitest'
import { extractGamesWorkshopSpearheads, type PdfDocumentLoader, type PdfTextItem } from '../../aos4/data'

/**
 * The official Spearhead reader on a synthetic pack laid out like Games Workshop's template (made-up
 * names and rules at the template's positions; no printed text is committed).
 */

const item = (str: string, x: number, y: number, height: number, width = str.length * 4): PdfTextItem => ({
  str,
  x,
  y,
  height,
  width,
})

const loader = (pages: PdfTextItem[][]): PdfDocumentLoader => ({
  load: async () => ({
    numPages: pages.length,
    getPage: async page => ({ getTextItems: async () => pages[page - 1] }),
    destroy: async () => undefined,
  }),
})

const composition = [
  item('TEST HOLDS', 120, 688.7, 30),
  item('TEST ARMY', 90.8, 668.7, 19),
  item('This Spearhead army consists', 99.2, 638.7, 9),
  item('of the following units:', 99.2, 628.7, 9),
  item('GENERAL', 99.3, 608.7, 10),
  item('♦', 99.2, 597.7, 11),
  item('Test Hero', 107.7, 598.7, 9),
  item('UNITS', 99.3, 578.7, 10),
  item('♦', 99.2, 567.7, 11),
  item('5 Test Warriors', 107.7, 568.7, 9),
]

const rules = [
  item('BATTLE TRAITS', 90.8, 698.7, 11.5),
  item('Passive', 102.1, 681.9, 8),
  item('TEST TRAIT:', 96.9, 668.7, 9.5),
  item('Flavour words.', 145, 668.7, 9),
  item('Effect:', 96.9, 648.7, 9),
  item('Add 1 to hit rolls.', 123.4, 648.7, 9),
  item('Stray', 399.9, 566.7, 9),
  item('REGIMENT ABILITIES:', 90.8, 538.7, 11.5),
  item('Deployment Phase', 321.8, 521.9, 8),
  item('TEST REGIMENT:', 316.6, 508.7, 9.5),
  item('Declare:', 316.5, 488.7, 9),
  item('Pick a unit.', 350, 488.7, 9),
  item('Effect:', 316.5, 478.7, 9),
  item('It moves.', 343, 478.7, 9),
  item('ENHANCEMENTS:', 90.8, 358.7, 11.5),
  item('Your general can use the following ability:', 96.9, 330, 9),
  item('Your Hero Phase', 102.1, 315, 8),
  item('TEST ENHANCEMENT:', 96.9, 302, 9.5),
  item('Effect:', 96.9, 292, 9),
  item('Heal 1.', 123.4, 292, 9),
]

interface BlockOptions {
  dy: number
  title: string
  stats: [string, string, string, string]
  ward?: string
  keywords: string
  ranged?: boolean
}

/** One warscroll block; `dy` shifts it down the page (the template prints two per page). */
const block = ({ dy, title, stats: [move, health, save, control], ward, keywords, ranged }: BlockOptions) => {
  const at = (str: string, x: number, y: number, height: number, width?: number) =>
    item(str, x, y - dy, height, width)
  const header = (label: string, y: number) => [
    at(label, 187.6, y, 9),
    ...(label.startsWith('RANGED') ? [at('Range Attacks', 298, y, 9)] : [at('Attacks', 326.8, y, 9)]),
    at('Hit', 366.3, y, 9),
    at('Wound', 389.9, y, 9),
    at('Rend Damage', 424.8, y, 9),
    at('Ability', 504.9, y, 9),
  ]
  return [
    at('• SPEA R H EA D WA R SCROLL •', 277.1, 706.5, 10),
    at('MOVE', 83, 717.4, 7),
    at(move, 87.4, 698.2, 14),
    at('SAVE', 125.2, 694.4, 7),
    at(health, 72.1, 680.5, 14),
    at(save, 103.7, 680.5, 14),
    at('HEALTH', 61.6, 669.7, 7),
    at(control, 90.1, 660.4, 14),
    at('CONTROL', 76, 648.8, 7),
    ...(ward ? [at(ward, 123.9, 715.8, 14)] : []),
    at(title, 252, 680.4, 18),
    ...(ranged
      ? [
          ...header('RANGED WEAPONS', 656.5),
          at('Test Bow', 200, 645.1, 8.5),
          at('18"', 304.7, 645.1, 8.5, 12),
          at('2', 339.6, 645.1, 8.5),
          at('4+', 368.3, 645.1, 8.5),
          at('3+', 399.5, 645.1, 8.5),
          at('1', 433.2, 645.1, 8.5),
          at('1', 464.3, 645.1, 8.5),
          at('Anti-Hero', 497, 649.6, 8.5),
          at('(+1 Rend)', 501.4, 640.6, 8.5),
        ]
      : []),
    ...header('MELEE WEAPONS', 633.8),
    at('Test Axe', 211.8, 622.4, 8.5),
    at('3', 339.6, 622.4, 8.5),
    at('3+', 368.3, 622.4, 8.5),
    at('3+', 399.5, 622.4, 8.5),
    at('-', 433.8, 622.4, 8.5),
    at('2', 464.3, 622.4, 8.5),
    at('-', 517.4, 622.4, 8.5),
    at('Lore that the reader skips.', 50, 600, 7),
    at('This unit has a note.', 153.1, 612, 8),
    at('Your Hero Phase', 164.2, 600, 8),
    at('TEST ABILITY:', 158.8, 588, 8),
    at('Flavour.', 215, 588, 8),
    at('Declare:', 158.7, 573.4, 8),
    at('Pick a target.', 189.1, 573.4, 8),
    at('Effect:', 158.7, 563, 8),
    at('Deal 1 damage.', 182.5, 563, 8),
    at('Passive', 301, 577.5, 8),
    at('OTHER ABILITY:', 295.6, 565.2, 8),
    at('Effect:', 295.5, 550, 8),
    at('Add 1 to saves.', 319.3, 550, 8),
    at('KEY WORDS', 163.3, 428.6, 7),
    at(keywords, 335.9, 427.8, 8),
  ]
}

const warscrolls = (
  heroTitle = 'TEST H ERO',
  heroStats: [string, string, string, string] = ['5"', '4', '4+', '2']
) => [
  ...block({
    dy: 0,
    title: heroTitle,
    stats: heroStats,
    ward: '6+',
    keywords: 'Hero, Infantry, Ward (6+)',
    ranged: true,
  }),
  ...block({
    dy: 340,
    title: 'TEST WA R R IORS',
    stats: ['4"', '1', '5+', '1'],
    keywords: 'Infantry, Reinforcements',
  }),
]

const extract = (pages: PdfTextItem[][]) =>
  extractGamesWorkshopSpearheads(new Uint8Array([1]), 'f'.repeat(64), loader(pages))

describe('official Spearhead reader', () => {
  it('reads composition, army rules, and warscrolls from the template positions', async () => {
    const result = await extract([composition, rules, warscrolls()])
    expect(result.diagnostics).toEqual([])
    // A line far above the next banner belongs to no rule and is reported, never absorbed.
    expect(result.fragments).toEqual([{ page: 2, text: 'Stray' }])
    const [army] = result.armies
    expect(army).toMatchObject({
      faction: 'TEST HOLDS',
      name: 'TEST ARMY',
      general: 'Test Hero',
      units: [{ count: 5, name: 'Test Warriors' }],
      battleTraits: [
        { name: 'TEST TRAIT', timing: 'Passive', legend: 'Flavour words.', effect: 'Add 1 to hit rolls.' },
      ],
      regimentAbilities: [
        { name: 'TEST REGIMENT', timing: 'Deployment Phase', declare: 'Pick a unit.', effect: 'It moves.' },
      ],
      enhancements: [
        {
          name: 'TEST ENHANCEMENT',
          timing: 'Your Hero Phase',
          preface: 'Your general can use the following ability:',
          effect: 'Heal 1.',
        },
      ],
    })
    const [hero, warriors] = army.warscrolls
    expect(hero).toMatchObject({
      name: 'Test Hero',
      move: '5"',
      health: '4',
      save: '4+',
      control: '2',
      ward: '6+',
      keywords: ['HERO', 'INFANTRY', 'WARD (6+)'],
      notes: ['This unit has a note.'],
      weapons: [
        {
          weaponType: 'RANGED',
          name: 'Test Bow',
          range: '18"',
          attacks: '2',
          hit: '4+',
          wound: '3+',
          rend: '1',
          damage: '1',
          abilities: 'Anti-Hero (+1 Rend)',
        },
        {
          weaponType: 'MELEE',
          name: 'Test Axe',
          range: '',
          attacks: '3',
          hit: '3+',
          wound: '3+',
          rend: '-',
          damage: '2',
          abilities: '',
        },
      ],
    })
    expect(
      hero.abilities.map(ability => [ability.name, ability.timing, ability.declare, ability.effect])
    ).toEqual([
      ['TEST ABILITY', 'Your Hero Phase', 'Pick a target.', 'Deal 1 damage.'],
      ['OTHER ABILITY', 'Passive', undefined, 'Add 1 to saves.'],
    ])
    expect(warriors).toMatchObject({
      name: 'Test Warriors',
      ward: '',
      keywords: ['INFANTRY', 'REINFORCEMENTS'],
    })
    // The pinned checksum is a pure function of the pack.
    expect((await extract([composition, rules, warscrolls()])).armies[0].checksum).toBe(army.checksum)
  })

  it('fails closed on a warscroll the composition does not list', async () => {
    const result = await extract([composition, rules, warscrolls('UNLISTED HERO')])
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toContain('spearhead-unknown-warscroll')
  })

  it('fails closed when a stat badge value is missing', async () => {
    const pages = warscrolls().filter(entry => !(entry.str === '5"' && entry.y === 698.2))
    const result = await extract([composition, rules, pages])
    expect(result.diagnostics.map(diagnostic => diagnostic.code)).toContain('spearhead-layout')
  })
})
