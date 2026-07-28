import * as XLSX from 'xlsx'
import { describe, expect, it } from 'vitest'
import {
  createWahapediaSourceObservation,
  discoverWahapediaExportUrls,
  discoverWahapediaNavigation,
  discoverWahapediaWarscrollCollection,
} from '../../aos4/review/wahapediaObservation'

describe('Wahapedia independent source observation', () => {
  it('discovers rule and faction navigation without treating content links as inventory', () => {
    const discovery = discoverWahapediaNavigation(`
      <div class="NavColumns2">
        <a href="/aos4/the-rules/the-core-rules">The Core Rules</a>
      </div>
      <div class="NavColumns3">
        <a href="/aos4/factions/stormcast-eternals">Stormcast Eternals</a>
      </div>
      <div class="Columns3">
        <a href="/aos4/factions/kruleboyz/Kragnos">Kragnos</a>
        <a href="/aos4/Export%20Data%20Specs.xlsx">here</a>
      </div>
    `)

    expect(discovery.rulesPages).toEqual([
      {
        title: 'The Core Rules',
        url: 'https://wahapedia.ru/aos4/the-rules/the-core-rules',
      },
    ])
    expect(discovery.factionPages).toEqual([
      {
        title: 'Stormcast Eternals',
        url: 'https://wahapedia.ru/aos4/factions/stormcast-eternals',
      },
    ])
    expect(discovery.exportSpecificationUrl).toBe('https://wahapedia.ru/aos4/Export%20Data%20Specs.xlsx')
  })

  it('discovers one collated warscroll page and HTTPS-normalizes export links', () => {
    expect(
      discoverWahapediaWarscrollCollection(
        `<span class="datasheetsCollated">
          <a href="/aos4/factions/stormcast-eternals/warscrolls.html">Warscrolls collated</a>
        </span>`,
        'https://wahapedia.ru/aos4/factions/stormcast-eternals/'
      )
    ).toBe('https://wahapedia.ru/aos4/factions/stormcast-eternals/warscrolls.html')

    const workbook = XLSX.utils.book_new()
    const sheet = XLSX.utils.aoa_to_sheet([['Warscrolls.csv']])
    sheet.A1.l = { Target: 'http://wahapedia.ru/aos4/Warscrolls.csv' }
    XLSX.utils.book_append_sheet(workbook, sheet, 'EN')
    const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' })

    expect(discoverWahapediaExportUrls(bytes)).toEqual(['https://wahapedia.ru/aos4/Warscrolls.csv'])
  })

  it('marks discovery documents non-material while keeping game data fail-closed', () => {
    const observation = createWahapediaSourceObservation('2026-07-28T18:00:00.000Z', [
      {
        kind: 'data-export-index',
        title: 'Data export index',
        url: 'https://wahapedia.ru/aos4/the-rules/data-export/',
        availability: 'accessible',
      },
      {
        kind: 'rules-page',
        title: 'The Core Rules',
        url: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
        availability: 'inaccessible',
      },
    ])

    expect(observation.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Data export index',
          scope: 'explicit-non-material',
        }),
        expect.objectContaining({
          title: 'The Core Rules',
          scope: 'material',
          availability: 'inaccessible',
        }),
      ])
    )
  })
})
