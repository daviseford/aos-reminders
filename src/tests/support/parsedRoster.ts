import type { ParsedRoster } from '../../aos4/import'

/**
 * A roster's content, without positions in the file it arrived in.
 *
 * Line numbers describe the upload, not the army: the same list is one minified line as `.json`
 * and a handful as `.ros`, so they are the one thing the formats cannot agree on. The bearer's
 * *label* is deliberately kept — it is format-independent identity, and flattening it too would
 * make a roster attributing an enhancement to the wrong unit compare equal to one attributing it
 * correctly (the gap that hid the minified-`.json` misattribution in review of #1989).
 */
export const withoutLines = (roster?: ParsedRoster) =>
  roster && {
    ...roster,
    selections: roster.selections.map(selection => ({
      ...selection,
      line: 0,
      ...(selection.bearer ? { bearer: { ...selection.bearer, line: 0 } } : {}),
    })),
  }
