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

### `yarn build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

## Learn More about React

To learn React, check out the [React documentation](https://reactjs.org/).

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
