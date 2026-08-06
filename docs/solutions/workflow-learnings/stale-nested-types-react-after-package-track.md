---
title: "Phantom TS2786 JSX errors come from a stale nested @types/react, not from the code"
date: 2026-08-06
category: workflow-learnings
module: tooling
problem_type: environment_issue
component: package_manager
severity: medium
applies_when:
  - "Switching between a branch that predates the Phase 2 package track and one that follows it"
  - "Crossing the React 17 -> 19 or Bootstrap 4 -> 5 boundary in an existing local worktree"
  - "Establishing a baseline error count for `yarn tsc --noEmit` before starting work"
  - "About to 'fix' type errors in files the branch never touched"
symptoms:
  - "`TS2786: ... is not a valid JSX element type` in files nobody edited"
  - "Errors concentrate in src/components/info/reminders.tsx and src/components/helpers/link.tsx"
  - "CI compiles the same commit with zero errors while the local tree fails"
  - "react-bootstrap and react-icons JSX types resolve through the wrong React namespace"
root_cause: environment_mismatch
resolution_type: process_change
related_components:
  - "package.json"
  - "yarn.lock"
  - "src/components/info/reminders.tsx"
  - "src/components/helpers/link.tsx"
tags: [yarn-classic, nested-dependencies, types-react, tsc-baseline, react-19, phantom-errors]
---

# Phantom `TS2786` JSX errors come from a stale nested `@types/react`

## Context

Branches that predate the Phase 2 package track resolve a different dependency tree. Yarn Classic
does not always prune the nested copies it no longer needs, so switching branches inside an existing
`node_modules` can leave a `react-bootstrap/node_modules/@types/react` at 17.x sitting underneath a
top-level 19.x.

`tsc` then resolves react-bootstrap's *and* react-icons' JSX types through React 17's namespace and
reports a handful of `TS2786 ... is not a valid JSX element type` errors — typically in
`src/components/info/reminders.tsx` and `src/components/helpers/link.tsx`, files the branch never
touched.

## Why it is not a code defect

`yarn.lock` carries a single `@types/react`, and `package.json` already pins it through
`resolutions`. CI installs clean and compiles with zero errors. Only the local tree is poisoned.

## Confirm

```powershell
Get-ChildItem -Recurse -Path node_modules -Filter package.json |
  Where-Object { $_.FullName -match '@types\\react\\package.json$' }
```

More than one hit means the tree is stale.

## Fix

Remove `node_modules` and reinstall with `yarn install --frozen-lockfile`.

## The rule this produces

Do not "fix" the reported type errors. Verify against a clean install before believing any baseline
error count, and before treating pre-existing errors as something a branch inherited.
