/**
 * Guards for the import alias table.
 *
 * An alias table is a liability if nobody prunes it: entries outlive the defect they worked
 * around, and each one is a standing opportunity to resolve a name to the wrong entity. These
 * tests make the table self-maintaining — when the catalog is corrected upstream, the alias that
 * compensated for it starts failing here and has to be deleted rather than quietly lingering.
 */
import { AOS4_CATALOG, AOS4_DEFAULT_RULES_CONTEXT_ID } from '../../aos4/generated'
import { aliasedImportLabel, IMPORT_LABEL_ALIASES, normalizeImportLabel } from '../../aos4/import'

const catalogNames = new Set(AOS4_CATALOG.entities.map(entity => normalizeImportLabel(entity.name)))
/**
 * Redundancy is judged in the default rules context, where imports resolve. A name the catalog
 * carries only in another context cannot make an alias redundant: resolution tries the roster's
 * own wording first within the document's context, so an alias only ever fires on a miss there.
 * The live case is the Spearhead-only "Ogor Gluttons" beside the renamed current-standard
 * "Gluttons" (issue #1880) — the alias can never divert the Spearhead match.
 */
const defaultContextNames = new Set(
  AOS4_CATALOG.entities
    .filter(entity => entity.rulesContextIds.includes(AOS4_DEFAULT_RULES_CONTEXT_ID))
    .map(entity => normalizeImportLabel(entity.name))
)

describe('import label aliases', () => {
  it('has no duplicate sources', () => {
    const sources = IMPORT_LABEL_ALIASES.map(alias => normalizeImportLabel(alias.from))
    expect(sources).toEqual(Array.from(new Set(sources)))
  })

  it('documents why every entry exists', () => {
    for (const alias of IMPORT_LABEL_ALIASES) {
      expect(alias.reason.trim().length).toBeGreaterThan(20)
    }
  })

  /**
   * A target that no longer exists means the catalog changed under us. Either the defect was
   * fixed — delete the entry — or a name moved and the alias now points nowhere, which would
   * silently stop working without this check.
   */
  it('points every alias at a name the catalog actually has', () => {
    const stale = IMPORT_LABEL_ALIASES.filter(alias => !catalogNames.has(normalizeImportLabel(alias.to))).map(
      alias => `${alias.from} -> ${alias.to}`
    )

    expect(stale).toEqual([])
  })

  /**
   * If the roster spelling already matches something resolvable in the default context, the alias
   * is redundant at best and a hijack at worst — it would redirect a name the catalog knows
   * perfectly well. A match that exists only in another context does not count.
   */
  it('only covers labels the default-context catalog cannot already resolve', () => {
    const redundant = IMPORT_LABEL_ALIASES.filter(alias =>
      defaultContextNames.has(normalizeImportLabel(alias.from))
    ).map(alias => alias.from)

    expect(redundant).toEqual([])
  })

  it('never aliases a label to itself', () => {
    for (const alias of IMPORT_LABEL_ALIASES) {
      expect(normalizeImportLabel(alias.from)).not.toEqual(normalizeImportLabel(alias.to))
    }
  })

  it('looks up aliases through normalization, not exact spelling', () => {
    expect(aliasedImportLabel('Blood Blessings of Khorne')).toEqual('Blood Blesssings of Khorne')
    expect(aliasedImportLabel('  blood   blessings of khorne  ')).toEqual('Blood Blesssings of Khorne')
    expect(aliasedImportLabel('Lore of the Storm')).toBeUndefined()
  })
})
