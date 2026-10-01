/**
 * Regressions for rosters players reported through the import warning flow.
 *
 * Each roster is the public reproduction from its issue (or, where the reporter attached none, the
 * smallest roster that reproduces the reported line), resolved end to end against the accepted
 * catalog. The assertions name the entity each previously-warned line must now land on, so a fix
 * that silenced the warning by matching the wrong thing still fails.
 */
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers'

const entityById = new Map(AOS4_CATALOG.entities.map(entity => [entity.id, entity]))

const importRoster = (text: string) => {
  const { parsedRoster, diagnostics } = decodeAos4TextRoster(text)
  expect(diagnostics).toEqual([])
  expect(parsedRoster).toBeDefined()
  return resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
    defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
    createDocumentId: () => 'roster-warning-regression',
  })
}

/** The kind and catalog name of everything a roster line resolved to. */
const resolvedAt = (preview: ReturnType<typeof importRoster>, line: number): string[] =>
  preview.matches
    .filter(match => match.line === line)
    .map(match => {
      const entity = entityById.get(match.canonicalId)
      return `${entity?.kind}: ${entity?.name}`
    })

describe('reported roster import warnings', () => {
  it('#2036: resolves the Sigdex spelling of The Beast of Castle Sternieste', () => {
    const preview = importRoster(
      [
        'Is that a dragon? 2000/2000 pts',
        '',
        'Nighthaunt',
        'Death Stalkers',
        "General's Handbook 2026-27",
        'Drops: 4',
        'Wounds: 138',
        'Spell Lore - Lore of the Underworlds',
        'Manifestation Lore - Infernal Sorceries',
        '',
        'Battle Tactic Cards: Burning for Vengeance, Blazing Onslaught',
        '',
        "General's Regiment",
        'Lady Olynder, Mortarch of Grief (320)',
        '• General',
        'Scriptor Mortis (90)',
        'Dreadscythe Harridans (190)',
        'Dreadscythe Harridans (190)',
        'Black Coach (Scourge of Aqshy) (290)',
        '',
        'Regiment 1',
        'Kurdoss Valentian, the Craven King (160)',
        'Craventhrone Guard (200)',
        '• Reinforced',
        'Chainrasps (100)',
        'Chainrasps (100)',
        '',
        'Regiment 2',
        'Guardian of Souls (100)',
        '• Lightshard of the Harvest Moon',
        '• Shadowy Aura',
        'Chainghasts (90)',
        '• Vociferous Defamers (10)',
        '',
        'Faction Terrain',
        'Nexus of Grief',
        '',
        'Regiments of Renown',
        'The Beast of Castle Sterneiste (160)',
        'Revenant Draconith',
        '',
        '',
        'Created with Sigdex: sigdex.io',
        'App Version: 24.0.3',
        'Server Version: 3.1.12',
        'Data Version: v44',
      ].join('\n')
    )

    expect(preview.diagnostics).toEqual([])
    expect(resolvedAt(preview, 39)).toEqual(['content-group: The Beast of Castle Sternieste'])
    expect(resolvedAt(preview, 40)).toEqual(['warscroll: Revenant Draconith'])
  })

  it('#2035: strips the official app enhancement cost and resolves Hobgrotz Vandalz', () => {
    const text = [
      'Helsmiths of Hashut',
      'Castigation Battery',
      "General's Handbook 2026-27",
      'Drops: 2',
      'Spell Lore - Lore of Infernal Power',
      'Prayer Lore - Prayers of the Scorched Sect',
      'Manifestation Lore - Morbid Conjuration (20 Points)',
      '',
      "General's Regiment",
      'Daemonsmith (80)',
      ' • General',
      ' • Gem of Utorak',
      'Deathshrieker Rocket Battery (150)',
      " • Bullfather's Scorn - (10) Points ",
      'Deathshrieker Rocket Battery (140)',
      'Hobgrotz Vandalz (70)',
      'Tormentor Bombard (130)',
      '',
      'Regiment 1',
      'Ashen Elder (120)',
      'Infernal Cohort with Hashutite Spears (180)',
      ' • Reinforced',
      'War Despot (80)',
      ' • An Eye for Weakness',
      '',
      '',
      'Created with Warhammer Age of Sigmar: The App',
      'App: 1.38.1 | Data: 483',
    ].join('\n')

    // The parser hands the resolver the enhancement's name alone, still borne by the battery.
    expect(decodeAos4TextRoster(text).parsedRoster?.selections).toContainEqual({
      line: 14,
      label: "Bullfather's Scorn",
      kindHint: 'enhancement',
      bearer: { line: 13, label: 'Deathshrieker Rocket Battery' },
    })

    const preview = importRoster(text)
    expect(preview.diagnostics).toEqual([])
    expect(resolvedAt(preview, 14)).toEqual(['ability: BULLFATHER’S SCORN'])
    expect(resolvedAt(preview, 16)).toEqual(['warscroll: Hobgrot Vandalz'])
  })

  it('#2029: resolves the Taar’s Grand Forgehost heroic trait Ruthless Overseer', () => {
    // No reproduction file was attached; this is the reported Army of Renown heroic trait in the
    // official app's Army of Renown header shape (see the hh-003 tournament fixture).
    const preview = importRoster(
      [
        'Forgehost 2000/2000 pts',
        '',
        "Helsmiths of Hashut | Taar's Grand Forgehost",
        'Army of Renown',
        "General's Handbook 2026-27",
        'Drops: 1',
        "Spell Lore - Taar's Grand Forgehost Spell Lore",
        "Prayer Lore - Taar's Grand Forgehost Prayer Lore",
        '',
        "General's Regiment",
        'Daemonsmith (80)',
        '• General',
        '• Ruthless Overseer',
        '',
        'Created with Warhammer Age of Sigmar: The App',
        'App: 1.38.1 | Data: 483',
      ].join('\n')
    )

    expect(preview.diagnostics).toEqual([])
    expect(resolvedAt(preview, 13)).toEqual(['ability: RUTHLESS OVERSSER'])
  })
})

describe('official app enhancement cost suffixes', () => {
  const bulletLabel = (bullet: string): string | undefined =>
    decodeAos4TextRoster(
      [
        'T 1000/2000 pts',
        'Grand Alliance Chaos | Helsmiths of Hashut | Castigation Battery',
        "General's Regiment",
        'Daemonsmith (80)',
        bullet,
        '',
        'Created with Warhammer Age of Sigmar: The App',
        'App: 1.38.1 | Data: 483',
      ].join('\n')
    ).parsedRoster?.selections.find(selection => selection.line === 5)?.label

  it.each([
    ["• Bullfather's Scorn - (10) Points", "Bullfather's Scorn"],
    ['• Charnel Vestments - (20) Points', 'Charnel Vestments'],
    ['• Charnel Vestments (20)', 'Charnel Vestments'],
    ['• Charnel Vestments (20 Points)', 'Charnel Vestments'],
    ['* Heroic Trait - Shrewd Opportunist - (10) Points', 'Shrewd Opportunist'],
    ['• Gem of Utorak', 'Gem of Utorak'],
  ])('reads %s as %s', (bullet, label) => {
    expect(bulletLabel(bullet)).toEqual(label)
  })
})
