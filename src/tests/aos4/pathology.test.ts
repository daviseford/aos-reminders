import { AOS4_CATALOG } from '../../aos4/generated'
import {
  AOS4_GOLDEN_TRUTH_CASES,
  decodeUtf8Strict,
  inspectCatalogPathologies,
  inspectStructuredPathologies,
  pathologyReviewCohorts,
} from '../../aos4/review'
import type { Aos4Catalog, BattleProfile, Weapon } from '../../aos4/domain'

const catalogWith = (battleProfile: Partial<BattleProfile>, weapon: Partial<Weapon>): Aos4Catalog => {
  const existingProfile = AOS4_CATALOG.entities.find(
    (entity): entity is BattleProfile => entity.kind === 'battle-profile'
  )!
  const existingWeapon = AOS4_CATALOG.entities.find((entity): entity is Weapon => entity.kind === 'weapon')!
  return {
    ...AOS4_CATALOG,
    entities: [
      { ...existingProfile, ...battleProfile },
      { ...existingWeapon, ...weapon },
    ],
    relationships: [],
  }
}

describe('AoS 4 structured-data pathology validation', () => {
  it('decodes valid UTF-8 independently of terminal rendering and rejects invalid bytes', () => {
    const bytes = new Uint8Array([0x32, 0x35, 0x6d, 0x6d, 0x20, 0xc3, 0x97, 0x20, 0x34, 0x30])

    expect(decodeUtf8Strict(bytes, 'fixture')).toBe('25mm × 40')
    expect(() => decodeUtf8Strict(new Uint8Array([0xc3, 0x28]), 'fixture')).toThrow(
      'fixture is not valid UTF-8'
    )
  })

  it('rejects replacement characters, controls, and unresolved placeholders', () => {
    expect(
      inspectStructuredPathologies(
        {
          corrupted: 'damage � value',
          controlled: 'line\u0000break',
          placeholder: '{{MISSING_EFFECT}}',
        },
        'fixture'
      ).map(issue => issue.code)
    ).toEqual(['control-character', 'replacement-character', 'unresolved-placeholder'])
  })

  it('rejects malformed measurements but preserves legitimate multi-base entries', () => {
    const malformed = inspectCatalogPathologies(catalogWith({ baseSizes: ['40mm [1]', '2 5 m m [1]'] }, {}))
    const valid = inspectCatalogPathologies(
      catalogWith(
        {
          baseSizes: ['28.5mm [3] or 40mm [1]', '60 × 35mm. Champion is 40mm.'],
        },
        {}
      )
    )

    expect(malformed).toContainEqual(
      expect.objectContaining({
        code: 'malformed-measurement-token',
        severity: 'error',
        value: '2 5 m m [1]',
      })
    )
    expect(valid.filter(issue => issue.code === 'malformed-measurement-token')).toEqual([])
  })

  it('separates impossible values from deterministic review flags', () => {
    const issues = inspectCatalogPathologies(
      catalogWith(
        { baseSizes: ['. 32mm'] },
        {
          profile: {
            attacks: '2',
            hit: '4',
            wound: '3#',
            rend: '1',
            damage: 'D3',
          },
        }
      )
    )

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'suspicious-measurement-layout',
          severity: 'review',
        }),
        expect.objectContaining({
          code: 'suspicious-weapon-characteristic',
          severity: 'review',
          path: expect.stringContaining('.profile.hit'),
        }),
        expect.objectContaining({
          code: 'suspicious-weapon-characteristic',
          severity: 'review',
          path: expect.stringContaining('.profile.wound'),
        }),
      ])
    )
    expect(issues.filter(issue => issue.severity === 'error')).toEqual([])
    expect(pathologyReviewCohorts(issues)).toEqual([
      'high-risk:pathology',
      'high-risk:pathology:suspicious-measurement-layout',
      'high-risk:pathology:suspicious-weapon-characteristic',
    ])
    expect(inspectCatalogPathologies(catalogWith({}, {}))).toEqual(
      [...inspectCatalogPathologies(catalogWith({}, {}))].sort((left, right) =>
        `${left.subject}|${left.path}|${left.code}`.localeCompare(
          `${right.subject}|${right.path}|${right.code}`
        )
      )
    )
  })

  it('does not turn hard pathology failures into heuristic review cohorts', () => {
    const issues = inspectCatalogPathologies(catalogWith({ baseSizes: ['2 5 m m [1]'] }, {}))

    expect(pathologyReviewCohorts(issues)).toEqual([])
    expect(
      issues.filter(
        issue => issue.code === 'malformed-measurement-token' && issue.path.endsWith('.baseSizes[0]')
      )
    ).toHaveLength(1)
  })

  it('accepts source-defined See below damage without weakening attacks validation', () => {
    const valid = inspectCatalogPathologies(
      catalogWith(
        {},
        {
          profile: {
            attacks: '2D6',
            hit: '4+',
            wound: 'See below',
            rend: 'See below',
            damage: 'See below',
          },
        }
      )
    )
    const invalid = inspectCatalogPathologies(
      catalogWith(
        {},
        {
          profile: {
            attacks: 'See below',
            hit: '4+',
            wound: '3+',
            rend: '-',
            damage: '1',
          },
        }
      )
    )

    expect(valid.filter(issue => issue.code === 'suspicious-weapon-characteristic')).toEqual([])
    expect(invalid).toContainEqual(
      expect.objectContaining({
        code: 'suspicious-weapon-characteristic',
        path: expect.stringContaining('.profile.attacks'),
      })
    )
  })

  it('binds the Lord-Terminos correction to official page evidence', () => {
    expect(AOS4_GOLDEN_TRUTH_CASES).toContainEqual({
      id: 'golden-truth:lord-terminos-base-size',
      sourceRecordId:
        'source-record:games-workshop:5fbaa128ff5087235bb133b5e48a0885119d7a0e4422aa38e3c71604db2f81f2%3Apage%3A20',
      locator: { kind: 'page', page: 20, section: 'Lord-Terminos' },
      field: 'baseSizes[1]',
      observedValue: '2 5 m m [1]',
      expectedValue: '25mm [1]',
      rationale: 'The official base-size cell is layout-split; adjacent digits and the mm unit form 25mm.',
    })
  })

  it('keeps the Lord-Terminos golden value in the generated catalog', () => {
    const profile = AOS4_CATALOG.entities.find(
      entity => entity.kind === 'battle-profile' && entity.name === 'Lord-Terminos battle profile'
    )

    expect(profile).toMatchObject({
      kind: 'battle-profile',
      baseSizes: ['25mm [1]', '40mm [1]'],
    })
    expect(
      inspectCatalogPathologies(AOS4_CATALOG).filter(
        issue => issue.subject === profile?.id && issue.code === 'malformed-measurement-token'
      )
    ).toEqual([])
  })
})
