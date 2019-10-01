# Contributing to AoS Reminders

## Table of Contents

1. [Environment and Tools](#env)
    + [IDE](#ide)
    + [Recommended VSCode Plugins](#plugins)
1. [Testing](#testing)
    + [Running Tests](#running_tests)
    + [Writing Tests](#writing_tests)
1. [Development](#development)
    + [Rebasing](#rebasing)
1. [Opening a PR](#pr)
    + [Resolve TypeScript Warnings](#ts_warnings)
    + [Ensure tests pass](#tests_pass)
    + [PR Title](#pr_title)
    + [PR Description](#pr_description)
    + [Squashing and Merging](#squash_and_merge)

## <a name="env"></a>Environment and Tools

### <a name="ide"></a>IDE

We recommend using [VSCode](https://code.visualstudio.com/). It's an excellent IDE, especially when working with React/TypeScript.

### <a name="plugins"></a>Recommended VSCode Plugins

+ ESLint
+ Jest
+ Prettier

## <a name="testing"></a>Testing

### <a name="running_tests"></a>Running Tests

`yarn test`

### <a name="writing_tests"></a>Writing Tests

All tests should be created in the `tests` directory. They should have clear descriptions and test overall functionality.

**Because Warhammer changes rules frequently, it is unwise to have tests directly test the specific wording of rules. Instead, dynamically fetch information about rules and compare them.**

## <a name="development"></a>Development

### <a name="rebasing"></a>Rebasing

I recommend frequently rebasing from `master` in order to keep your branch in sync. Here are the basic commands used for that.

Assuming your branch is named `branch-123`:

```bash
git checkout master && git pull # Ensure your master branch is up to date
git checkout branch-123         # Switch back to your branch
git rebase master               # Perform a rebase
git push origin branch-123 -f   # Force-push your changes to the branch
```

## <a name="pr"></a>Opening a PR

### <a name="ts_warnings"></a>Resolve TypeScript warnings

Run `yarn start` and make sure you don't receive any errors or warnings in your console, such as:

`Line 11: 'SUPPORTED_FACTIONS' is defined but never used @typescript-eslint/no-unused-vars`

These warnings must be resolved before opening a PR. If they are merged to `master`, the resulting deployment will fail.

### <a name="tests_pass"></a>Ensure tests pass

Run `yarn test` and verify all tests pass.

### <a name="pr_title"></a>PR Title

Write a short, descriptive title. If your PR addresses a specific issue, be sure to add `(fixes #123)`. This will allow Github to close the issue automatically once the PR is merged.

A good title for a branch that adds endless spells to Seraphon (Issue #321), would be:

`Add Endless Spells to Seraphon (fixes #321)`

### <a name="pr_description"></a>PR Description

Write a description of what changed and why. Note any issues or concerns that you have with the code, or anything you'd like the reviewer to focus on.

### <a name="squash_and_merge"></a>Squashing and Merging

When merging to `master`, we only perform **Squash & Merge** operations. This keeps the git history nice and tidy (one commit per PR).

You shouldn't need to worry about this, since the Github PR settings have only enabled **Squash & Merge**.