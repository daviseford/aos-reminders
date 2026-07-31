# Sigdex import fixtures

Text exports in the shape produced by Sigdex (https://sigdex.io/), the open-source AoS 4 list
builder. The format is measured from Sigdex's own serializer
(`src/modules/builder/exportList.ts` in `AjSchaff/Sigdex`), which its importer round-trips.

These fixtures are serializer-faithful constructions against the accepted catalog's names, not
captures from the running app. Issue #1816 tracks acquiring real user-generated lists at volume
(own-account exports plus community donations) the way the New Recruit corpus strategy
(`docs/plans/2026-07-29-002`) prescribes; captured lists should replace or join these fixtures
under the same layout: `lists/<faction-slug>-<nnn>-<shape>/list.txt`.

The detection marker is the footer `Created with Sigdex: https://sigdex.io/` plus the
`App Version:` / `Data Version:` lines, which also pin the producing version for drift tracking.
