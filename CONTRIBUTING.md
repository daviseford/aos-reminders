# Contributing to AoS Reminders

- [Contributing to AoS Reminders](#contributing-to-aos-reminders)
  - [Environment and Tools](#environment-and-tools)
    - [IDE](#ide)
    - [Recommended VSCode Plugins](#recommended-vscode-plugins)
  - [Testing](#testing)
    - [Running Tests](#running-tests)
    - [Writing Tests](#writing-tests)
  - [Development](#development)
    - [Rebasing](#rebasing)
  - [Opening a PR](#opening-a-pr)
    - [Resolve TypeScript warnings](#resolve-typescript-warnings)
    - [Ensure tests pass](#ensure-tests-pass)
    - [PR Title](#pr-title)
    - [PR Description](#pr-description)
    - [Squashing and Merging](#squashing-and-merging)
  - [Testing Offline](#testing-offline)

## Environment and Tools

### IDE

We recommend using [VSCode](https://code.visualstudio.com/). It's an excellent IDE, especially when working with React/TypeScript.

### Recommended VSCode Plugins

+ ESLint
+ Jest
+ Prettier

## Testing

### Running Tests

`yarn test`

### Writing Tests

All tests should be created in the `tests` directory. They should have clear descriptions and test overall functionality.

**Because Warhammer changes rules frequently, it is unwise to have tests directly test the specific wording of rules. Instead, dynamically fetch information about rules and compare them.**

## Development

### Rebasing

I recommend frequently rebasing from `master` in order to keep your branch in sync. Here are the basic commands used for that.

Assuming your branch is named `branch-123`:

```bash
git checkout master && git pull # Ensure your master branch is up to date
git checkout branch-123         # Switch back to your branch
git rebase master               # Perform a rebase
git push origin branch-123 -f   # Force-push your changes to the branch
```

## Opening a PR

### Resolve TypeScript warnings

Run `yarn start` and make sure you don't receive any errors or warnings in your console, such as:

`Line 11: 'SUPPORTED_FACTIONS' is defined but never used @typescript-eslint/no-unused-vars`

These warnings must be resolved before opening a PR. If they are merged to `master`, the resulting deployment will fail.

### Ensure tests pass

Run `yarn test` and verify all tests pass.

### PR Title

Write a short, descriptive title. If your PR addresses a specific issue, be sure to add `(fixes #123)`. This will allow Github to close the issue automatically once the PR is merged.

A good title for a branch that adds endless spells to Seraphon (Issue #321), would be:

`Add Endless Spells to Seraphon (fixes #321)`

### PR Description

Write a description of what changed and why. Note any issues or concerns that you have with the code, or anything you'd like the reviewer to focus on.

### Squashing and Merging

When merging to `master`, we only perform **Squash & Merge** operations. This keeps the git history nice and tidy (one commit per PR).

You shouldn't need to worry about this, since the Github PR settings have only enabled **Squash & Merge**.

## Testing Offline

Install `serve` (we will use this to serve the local build).

`npm install serve -g`

Next, run `yarn build` and then `cd` into the directory and serve it up!

```bash
yarn build
cd build/
serve
```

Remember: You'll need to re-`build` and re-`serve` every time you make a change!