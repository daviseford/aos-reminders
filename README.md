[![Codeship Status for daviseford/aos-reminders](https://app.codeship.com/projects/c0b303b0-94f9-0137-ac21-1aa1838f71d2/status?branch=master)](https://app.codeship.com/projects/357042)

## Discord

[https://discord.gg/2nt9Fxp](https://discord.gg/2nt9Fxp)

## How to Contribute

If you want to add an army or edit an existing army, please do so! Use the `src/army/sample_army/` folder as a reference for how things are added!

Feel free to submit a PR for any incorrect/missing rules! I am only human, and the amount of data entry needed for a single army can sometimes be overwhelming.

**For more contribution guidelines, check out [CONTRIBUTING.md](https://github.com/daviseford/aos-reminders/blob/master/CONTRIBUTING.md)**

## Contributors

+ [JohnSchramm](https://github.com/JohnSchramm)
+ [thundergore](https://github.com/thundergore)
+ [grzegorzmiazga](https://github.com/grzegorzmiazga)
+ [PixelTom](https://github.com/PixelTom)
+ [ctcodie](https://github.com/ctcodie)
+ [Cpt Asgard](https://github.com/CptAsgard)
+ [LiuSeeker](https://github.com/LiuSeeker)
+ Lorax
+ [NiklassMM](https://github.com/NiklasMM)
+ [mmorrison](https://github.com/mmorrison)
+ [wspencermiller](https://github.com/wspencermiller)
+ [Zirhark](https://github.com/Zirhark)
+ [T-Nightingale](https://github.com/T-Nightingale)
+ [mattbarkerdev](https://github.com/mattbarkerdev)
+ [exonian](https://github.com/exonian)
+ [Sobakaa](https://github.com/Sobakaa)

## Available Scripts

In the project directory, you can run:

### `yarn install`

If you just downloaded this repository, or if you are getting errors regarding missing packages, run `yarn install` to download/update dependencies.

### `yarn start`

Runs the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn lint`

Checks your code for formatting or logical errors. Run this before opening a PR, since the CI will fail your branch if you don't pass the linting standards.

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

## `yarn analyze`

Run after `yarn build`. Analyzes the build bundle and shows which dependencies and files are taking up space.

## Pre-commit

I have set this repository up to automatically take care of some chores when you push a commit.

1. Any special punctuation characters such as `‘`, `’`, `“`, and `”` are removed and replaced with `'` or `"`.
2. Any leading or trailing whitespace is removed from any `name`, `desc`, and `tag` entries.
3. Periods are added to the end of descriptions if they are missing.
4. Finally, we use `pretty-quick` to format the code according to the repository standards.

## Deployment

This repository is automatically deployed using CodeShip.

Whenever a commit is pushed to the `master` branch, the project is built and uploaded to S3.

This happens automatically, so be careful when merging to `master`! Your changes will immediately be live.

### Authenticating Locally

If you want to test or use subscriber features _locally_, you can do it :)

First, login through Auth0. You can create a fake account - your email doesn't need to be verified.

Then subscribe and go through checkout as usual. You can use any of Stripes [test card numbers](https://stripe.com/docs/testing#cards) to complete the transaction. Just enter a test card number, and any expiration date/CVC/ZIP code, and your account will be subscribed.

I like to use card # `4242 4242 4242 4242` since I can just spam my keyboard.

Obviously, this does not work in production :)

### Warscroll Builder/Azyr Import

Found a discrepancy between Warscroll Builder and AoS Reminders? You have two options:

1. [Open an issue on Github](https://github.com/daviseford/aos-reminders/issues) and let us know.
2. Add to the typo list (`[warscroll|azyr]TypoMap`) in `src/utils/import/options.ts`
3. Just wait. :) Failed imports are fired off to Google Analytics - we will probably fix your issue within a couple days.


### Helpful Commands

Delete all local branches except `master`

Linux/OSX:

```bash
git branch | grep -v "master" | xargs git branch -D
```

Windows:

```powershell
git branch | %{ $_.Trim() } | ?{ $_ -ne 'master' } | %{ git branch -D $_ }
```

### API Repositories

+ [REST API](https://github.com/daviseford/aos-reminders-rest-api)
+ [Subscription API](https://github.com/daviseford/aos-reminders-subscription-api)

_Note: These are both private repositories._

### Will you ever add units stats or points?

No.

This is something I will never add to AoS Reminders (unless we get a blessing from GW). It gets too close to entirely replacing the need for a battletome, and I don't want GW to think I'm trying to do that. It's a great idea but not one that I will do :)
