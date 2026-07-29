import {
  LISTBOT_MISSING_FORMATION_LABEL,
  createListbotCoverageCorpus,
  mergeListbotGameData,
  parseListbotCurrentPage,
  parseListbotGameData,
  parseListbotVersionMarker,
  type ListbotArmyBinding,
  type ListbotGameData,
  type ListbotUnscopedUnitBinding,
} from '../support/listbotCorpus'
import { decodeAos4TextRoster } from '../../importers/aos4'

const snapshot: ListbotGameData = {
  version: '2026-07-29T00:00:00Z',
  factions: [
    { id: 'faction:alpha', name: 'Alpha Hosts' },
    { id: 'faction:archive', name: 'Archive Hosts' },
    { id: 'faction:beta', name: 'Beta Hosts' },
  ],
  units: [
    {
      id: 'unit:guard',
      name: 'Alpha Guard',
      factionId: 'faction:alpha',
      pointsCost: 100,
      isHero: false,
      isRor: false,
      isTerrain: false,
      minModels: 10,
      abilities: [{ name: 'Ignored', effect: 'RULE TEXT MUST NOT BE COPIED' }],
    },
    {
      id: 'unit:captain',
      name: 'Alpha Captain',
      factionId: 'faction:alpha',
      pointsCost: 140,
      isHero: true,
      isRor: false,
      isTerrain: false,
      minModels: 1,
    },
    {
      id: 'unit:archive',
      name: 'Archive Guard',
      factionId: 'faction:archive',
      pointsCost: 80,
      isHero: false,
      isRor: true,
      isTerrain: false,
      minModels: 5,
    },
  ],
  battleFormations: [
    {
      id: 'formation:zeta',
      name: 'Zeta Formation',
      factionId: 'faction:alpha',
      isAor: false,
    },
    {
      id: 'formation:alpha',
      name: 'Alpha Formation',
      factionId: 'faction:alpha',
      isAor: false,
    },
  ],
}

const armyBindings = [
  {
    catalogFactionId: 'catalog-faction:alpha',
    apiFactionId: 'faction:alpha',
    currentPageFactionId: 'page-faction:101',
    expectedName: 'Alpha Hosts',
  },
  {
    catalogFactionId: 'catalog-faction:beta',
    apiFactionId: 'faction:beta',
    expectedName: 'Beta Hosts',
  },
] as const satisfies readonly ListbotArmyBinding[]

const unscopedUnitBindings = [
  {
    currentUnitId: 'page-unit:202',
    sourceFactionId: '999',
    apiUnitId: 'unit:guard',
  },
] as const satisfies readonly ListbotUnscopedUnitBinding[]

describe('Listbot all-units coverage corpus', () => {
  it('validates the live version marker contract', () => {
    expect(
      parseListbotVersionMarker({
        version: '2026-07-29T00:00:00Z',
        factionCount: 3,
        unitCount: 3,
      })
    ).toEqual({
      version: '2026-07-29T00:00:00Z',
      factionCount: 3,
      unitCount: 3,
    })
    expect(() => parseListbotVersionMarker({ version: 'current', unitCount: 3 })).toThrow(
      'versionMarker.factionCount'
    )
  })

  it('projects provider data to composition fields and fails on unsafe references', () => {
    const parsed = parseListbotGameData(snapshot)

    expect(parsed.units[0]).toEqual({
      id: 'unit:guard',
      name: 'Alpha Guard',
      factionId: 'faction:alpha',
      pointsCost: 100,
      isHero: false,
      isRor: false,
      isTerrain: false,
      minModels: 10,
    })
    expect(parsed.units[0]).not.toHaveProperty('abilities')
    expect(
      parseListbotGameData({
        ...snapshot,
        units: [
          ...snapshot.units,
          {
            ...snapshot.units[0],
            factionId: 'faction:archive',
            name: 'Shared Alpha Guard',
          },
        ],
      }).units
    ).toHaveLength(4)
    expect(() =>
      parseListbotGameData({
        ...snapshot,
        units: [{ ...snapshot.units[0], factionId: 'faction:missing' }],
      })
    ).toThrow('unit:guard refers to unknown faction faction:missing')
    expect(() =>
      parseListbotGameData({
        ...snapshot,
        units: [...snapshot.units, { ...snapshot.units[0] }],
      })
    ).toThrow('Duplicate Listbot unit identity in faction faction:alpha: unit:guard')
  })

  it('decodes the current desktop inventory without evaluating provider JavaScript', () => {
    const current = parseListbotCurrentPage(`
      <select class="faction-select">
        <option value="">Select Faction</option>
        <optgroup label="Order">
          <option value="101">Alpha Hosts</option>
        </optgroup>
      </select>
      <script>
        const globalHeroData = {};
        globalHeroData[201] = {
          'id': 201,
          'name': 'Captain&#x27;s Guard',
          'pointsCost': 150,
          'factionId': 101,
          'isHero': true,
          'isRor': false
        }
        const globalUnitData = {};
        globalUnitData[202] = {
          'id': 202,
          'name': 'Current Guard',
          'pointsCost': 110,
          'factionId': 101,
          'numberOfModels': 10,
          'isHero': false
        }
        globalUnitData[203] = {
          'id': 203,
          'name': 'Detached Guard',
          'pointsCost': 120,
          'factionId': 999,
          'numberOfModels': 5,
          'isHero': false
        }
      </script>
    `)

    expect(current.factions).toEqual([{ id: 'page-faction:101', name: 'Alpha Hosts' }])
    expect(current.units).toEqual([
      {
        id: 'page-unit:201',
        name: "Captain's Guard",
        factionId: 'page-faction:101',
        pointsCost: 150,
        isHero: true,
        isRor: false,
        isTerrain: false,
        minModels: 1,
      },
      {
        id: 'page-unit:202',
        name: 'Current Guard',
        factionId: 'page-faction:101',
        pointsCost: 110,
        isHero: false,
        isRor: false,
        isTerrain: false,
        minModels: 10,
      },
    ])
    expect(current.unscopedUnits).toEqual([
      {
        id: 'page-unit:203',
        name: 'Detached Guard',
        sourceFactionId: '999',
        pointsCost: 120,
        isHero: false,
        isRor: false,
        isTerrain: false,
        minModels: 5,
      },
    ])

    expect(() =>
      parseListbotCurrentPage(`
        <select class="faction-select"><option value="101">Alpha Hosts</option></select>
        <script>
          globalUnitData[202] = {
            'id': 202,
            'name': 'Current Guard',
            'pointsCost': 110,
            'factionId': 101,
            'numberOfModels': 10,
            'isHero': 'false'
          }
        </script>
      `)
    ).toThrow('globalUnitData[202].isHero must be a boolean when present')

    expect(() =>
      parseListbotCurrentPage(`
        <select class="faction-select"><option value="101">Alpha Hosts</option></select>
        <script>
          globalUnitData[202] = {
            'id': 202,
            'name': 'First Guard',
            'pointsCost': 110,
            'factionId': 101,
            'numberOfModels': 10
          }
          globalUnitData[202] = {
            'id': 202,
            'name': 'Second Guard',
            'pointsCost': 120,
            'factionId': 101,
            'numberOfModels': 10
          }
        </script>
      `)
    ).toThrow('Duplicate Listbot current data assignment: globalUnitData[202]')
  })

  it('prefers current desktop units while retaining API-only armies and supplemental catalogs', () => {
    const current = parseListbotCurrentPage(`
      <select class="faction-select">
        <option value="">Select Faction</option>
        <option value="101">Alpha Hosts</option>
      </select>
      <script>
        const globalHeroData = {};
        globalHeroData[201] = {
          'id': 201,
          'name': 'Current Captain',
          'pointsCost': 150,
          'factionId': 101,
          'isHero': true,
          'isRor': false
        }
        const globalUnitData = {};
        globalUnitData[202] = {
          'id': 202,
          'name': 'Alpha Guard',
          'pointsCost': 100,
          'factionId': 999,
          'numberOfModels': 10,
          'isHero': false
        }
      </script>
    `)
    const merged = mergeListbotGameData(snapshot, current, armyBindings, unscopedUnitBindings)

    expect(merged.gameData.factions.map(faction => faction.name)).toEqual([
      'Alpha Hosts',
      'Archive Hosts',
      'Beta Hosts',
    ])
    expect(merged.gameData.units.map(unit => `${unit.factionId}:${unit.name}`).sort()).toEqual([
      'faction:archive:Archive Guard',
      'page-faction:101:Alpha Guard',
      'page-faction:101:Current Captain',
    ])
    expect(merged.reconciledUnscopedUnits).toEqual([
      {
        currentUnitId: 'page-unit:202',
        sourceFactionId: '999',
        factionName: 'Alpha Hosts',
        apiUnitId: 'unit:guard',
      },
    ])
    expect(merged.drift).toEqual([
      {
        factionName: 'Alpha Hosts',
        apiUnitEntries: 2,
        currentUnitEntries: 2,
        onlyInApi: ['Alpha Captain'],
        onlyInCurrent: ['Current Captain'],
      },
    ])

    expect(() =>
      mergeListbotGameData(
        snapshot,
        {
          ...current,
          factions: [{ id: 'page-faction:101', name: 'Renamed Alpha Hosts' }],
        },
        armyBindings,
        unscopedUnitBindings
      )
    ).toThrow('Listbot current faction page-faction:101 name changed')
  })

  it('builds deterministic army and supplemental rosters without copying rule text', () => {
    const corpus = createListbotCoverageCorpus(snapshot, ['faction:alpha', 'faction:beta'])

    expect(corpus.missingArmyFactionIds).toEqual([])
    expect(corpus.coverage).toEqual({
      sourceFactions: 3,
      emptySourceFactions: 1,
      sourceUnitEntries: 3,
      armyFactions: 1,
      armyUnitEntries: 2,
      supplementalFactions: 1,
      supplementalUnitEntries: 1,
      uncoveredUnitEntries: 0,
    })
    expect(corpus.emptyFactions).toEqual([{ id: 'faction:beta', name: 'Beta Hosts' }])

    const army = corpus.rosters.find(roster => roster.category === 'army')
    expect(army).toMatchObject({
      factionId: 'faction:alpha',
      factionName: 'Alpha Hosts',
      formation: { id: 'formation:alpha', name: 'Alpha Formation' },
      file: 'armies/alpha-hosts.txt',
      unitCount: 2,
      totalPoints: 240,
    })
    expect(army?.text).toBe(
      [
        'Alpha Hosts',
        'Alpha Formation',
        '',
        '- 1 x Alpha Captain (140)',
        '- 10 x Alpha Guard (100)',
        '',
        '240/2000pts',
        '2 drops',
        '',
        'Generated by Listbot 4.0',
        '',
      ].join('\n')
    )
    expect(army?.text).not.toContain('RULE TEXT MUST NOT BE COPIED')

    const supplemental = corpus.rosters.find(roster => roster.category === 'supplemental')
    expect(supplemental).toMatchObject({
      factionName: 'Archive Hosts',
      formation: null,
      file: 'supplemental/archive-hosts.txt',
      unitCount: 1,
    })
    expect(supplemental?.text).toContain(LISTBOT_MISSING_FORMATION_LABEL)
  })

  it('round-trips every source unit entry through the real Listbot decoder exactly once', () => {
    const corpus = createListbotCoverageCorpus(snapshot, ['faction:alpha', 'faction:beta'])

    corpus.rosters.forEach(roster => {
      const decoded = decodeAos4TextRoster(roster.text)

      expect(decoded.diagnostics).toEqual([])
      expect(decoded.parsedRoster?.declaredFaction).toBe(roster.factionName)
      expect(
        decoded.parsedRoster?.selections.filter(selection => selection.kindHint === 'warscroll')
      ).toHaveLength(roster.unitCount)
    })
    expect(corpus.rosters.reduce((total, roster) => total + roster.unitCount, 0)).toBe(snapshot.units.length)
  })

  it('reports catalog armies that the provider snapshot does not contain', () => {
    expect(
      createListbotCoverageCorpus(snapshot, ['faction:alpha', 'faction:missing']).missingArmyFactionIds
    ).toEqual(['faction:missing'])
  })
})
