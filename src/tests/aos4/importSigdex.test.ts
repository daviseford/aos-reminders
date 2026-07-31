import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { resolveParsedRoster } from '../../aos4/import'
import { decodeAos4TextRoster } from '../../importers'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

const LISTS_ROOT = join(__dirname, '..', 'fixtures', 'aos4', 'import', 'sigdex', 'lists')

const fixture = (id: string): string => readFileSync(join(LISTS_ROOT, id, 'list.txt'), 'utf-8')

const fixtureIds = readdirSync(LISTS_ROOT, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .sort()

const roster = (...body: string[]) =>
  [
    'Test List 1000/2000 pts',
    ...body,
    'Created with Sigdex: https://sigdex.io/',
    'App Version: 1.8.2',
    'Data Version: v112',
  ].join('\n')

const decode = (...body: string[]) => decodeAos4TextRoster(roster(...body)).parsedRoster

const labelled = (
  parsed: NonNullable<ReturnType<typeof decode>>,
  kind: string
): string[] => parsed.selections.filter(s => s.kindHint === kind).map(s => s.label)

describe('Sigdex text import', () => {
  it('parses the standard fixture', () => {
    const { parsedRoster, diagnostics } = decodeAos4TextRoster(fixture('ogor-001-standard'))
    expect(diagnostics).toEqual([])
    expect(parsedRoster).toBeDefined()
    expect(parsedRoster!.source).toBe('sigdex-text')
    expect(parsedRoster!.proposedName).toBe('Gutbusters on Tour')
    expect(parsedRoster!.declaredFaction).toBe('Ogor Mawtribes')
    expect(parsedRoster!.declaredContext).toBe("General's Handbook 2025-26")
    expect(labelled(parsedRoster!, 'battle-formation')).toEqual(['Prophets of the Gulping God'])
    expect(labelled(parsedRoster!, 'spell-lore')).toEqual(['Lore of Maw-magic'])
    expect(labelled(parsedRoster!, 'prayer-lore')).toEqual(['Everwinter Prayers'])
    expect(labelled(parsedRoster!, 'manifestation-lore')).toEqual(['Krondspine Incarnate'])
    expect(labelled(parsedRoster!, 'warscroll')).toEqual([
      'Tyrant',
      'Ogor Gluttons',
      'Ironblaster',
      'Butcher',
      'Ogor Gluttons',
      'Leadbelchers',
      'Gnoblars',
      'Great Mawpot',
    ])
    expect(labelled(parsedRoster!, 'enhancement')).toEqual([])
  })

  const unresolvedByLabel = new Map<string, number>()

  describe('app-captured corpus (one list per army, harvested from sigdex.io)', () => {
    it.each(fixtureIds)('%s decodes and resolves without errors', id => {
      const { parsedRoster, diagnostics } = decodeAos4TextRoster(fixture(id))
      expect(diagnostics).toEqual([])
      expect(parsedRoster).toBeDefined()
      expect(parsedRoster!.source).toBe('sigdex-text')
      expect(parsedRoster!.declaredFaction).toBeTruthy()

      const preview = resolveParsedRoster(AOS4_CATALOG, parsedRoster!, {
        defaultRulesContextId: AOS4_DEFAULT_RULES_CONTEXT_ID,
        createDocumentId: () => `army:sigdex-${id}`,
      })
      expect(preview.diagnostics.filter(d => d.severity === 'error')).toEqual([])
      expect(preview.proposedDocument).toBeDefined()
      for (const diagnostic of preview.diagnostics) {
        if (diagnostic.severity !== 'warning') continue
        const label = `${id}: ${diagnostic.code} ${diagnostic.message}`
        unresolvedByLabel.set(label, (unresolvedByLabel.get(label) ?? 0) + 1)
      }
    })
  })

  afterAll(() => {
    if (unresolvedByLabel.size === 0) return
    console.log(
      ['Sigdex corpus warnings (fail-soft, not asserted):', ...Array.from(unresolvedByLabel.keys())].join(
        '\n  '
      )
    )
  })

  it('keeps enhancement bullets and strips their points', () => {
    const parsed = decode(
      'Ogor Mawtribes',
      'Prophets of the Gulping God (0)',
      "General's Regiment",
      'Tyrant (200)',
      '• General',
      '• Gnawhide Cloak (10)',
      '• Endless Appetite',
      '• 2x Massive Club'
    )
    expect(labelled(parsed!, 'enhancement')).toEqual(['Gnawhide Cloak', 'Endless Appetite'])
    expect(labelled(parsed!, 'warscroll')).toEqual(['Tyrant'])
  })

  it('parses an Army of Renown header into faction plus formation-style selection', () => {
    const parsed = decode(
      'Ogor Mawtribes | The Roving Maw',
      'Army of Renown',
      "General's Regiment",
      'Tyrant (200)'
    )
    expect(parsed!.declaredFaction).toBe('Ogor Mawtribes')
    expect(labelled(parsed!, 'battle-formation')).toEqual(['The Roving Maw'])
  })

  it('marks Regiments of Renown entries', () => {
    const parsed = decode(
      'Ogor Mawtribes',
      'Prophets of the Gulping God (0)',
      'Regiments of Renown',
      "Norgrimm's Rune Throng (400)",
      'Runelord (0)'
    )
    const renown = parsed!.selections.filter(s => s.isRegimentOfRenown)
    expect(renown.map(s => ({ label: s.label, kindHint: s.kindHint }))).toEqual([
      { label: "Norgrimm's Rune Throng", kindHint: 'regiment-of-renown' },
      { label: 'Runelord', kindHint: 'warscroll' },
    ])
  })

  it('rejects text carrying both Sigdex and Listbot markers', () => {
    const mixed = [roster('Ogor Mawtribes', 'Beast Handlers (0)'), 'Generated by Listbot 4.0'].join('\n')
    const { parsedRoster, diagnostics } = decodeAos4TextRoster(mixed)
    expect(parsedRoster).toBeUndefined()
    expect(diagnostics[0]).toMatchObject({
      code: 'unsupported-source',
      message: expect.stringContaining('more than one supported source'),
    })
  })

  it('fails soft when the export has no faction line', () => {
    const { parsedRoster, diagnostics } = decodeAos4TextRoster(
      ['Created with Sigdex: https://sigdex.io/'].join('\n')
    )
    expect(parsedRoster).toBeUndefined()
    expect(diagnostics[0]).toMatchObject({ code: 'missing-faction', severity: 'error' })
  })
})
