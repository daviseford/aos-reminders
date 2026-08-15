# The army changelog acceptance workflow

The changelog tells a player what each accepted rules update changed for their army. It is built
from the same accepted corpus the app ships; nothing here fetches source data at runtime.

## Layers

- `data/aos4/changelog/ledger.json` — the reviewed input, an append-only array of acceptance
  entries. This is the only hand-authored file. Each entry pins its prior revision (`commit` plus
  the SHA-256 of the `runtime.json` **git blob** — never the working-tree file, which is CRLF on
  Windows), pins the current checked-in `runtime.json` (LF-normalized SHA-256), names its causing
  publications (stable `publicationId`, name, source, effective date when the review records carry
  one), and dispositions every changed cohort three ways: `rules-driven` (attributed to exactly one
  publication via explicit fact selectors), `correction` (our own data fix — labeled, never
  publication-attributed, public page only), or `churn` (engineering regeneration — excluded).
- `data/aos4/changelog/records/<entry-id>.json` — command-generated per-acceptance change records.
- `src/aos4/generated/changelog/changelog.json` — the command-generated artifact the app ships:
  the newest 6 rules-driven acceptances, ordered, with publication metadata. Never hand-edit
  generated files.

## Commands

```powershell
yarn data:aos4:changelog          # verify: git-free, recomputes from checked-in inputs
yarn data:aos4:changelog:write    # generate: resolves prior revisions as pinned git blobs
```

Verify runs on shallow CI clones because it never reads git history. Generation needs a full
clone and fails closed on a blob-checksum mismatch, an unknown publication, or a rules-driven
record that matches zero or several publication selectors.

## Accepting a new corpus revision

1. Accept the corpus through the normal candidate → review → accept → generate workflow first.
2. Append a ledger entry: prior = the previous accepted commit's `runtime.json` blob; publications
   from the acceptance review's `officialDocuments`; disposition every cohort. Diff probes and the
   fail-closed selectors will surface anything you have not dispositioned.
3. Run `yarn data:aos4:changelog:write`, review the generated records like any accepted product,
   then `yarn data:aos4:changelog` and the normal verification suite.
4. Commit ledger, records, and artifact together with the corpus acceptance.

Publication attribution is a review decision recorded in the ledger, not something derived from
runtime bytes. When one acceptance bundles several publications, give each its own selectors.
