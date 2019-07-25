## How to Contribute

If you want to add an army or edit an existing army, please do so! Use the `src/army/sample_army/` folder as a reference for how things are added!

In particular, you'll want to focus on `units.ts`, `artifacts.ts`, `traits.ts`, and `abilities.ts`. 

Feel free to submit a PR for any incorrect/missing rules! I am only human, and the amount of data entry needed for a single army can sometimes be overwhelming.

## Top Contributors

+ [daviseford](https://github.com/daviseford)
+ [grzegorzmiazga](https://github.com/grzegorzmiazga)
  + Added Idoneth Deepkin
  + Updated Gloomspite Gitz rules
  + Updated Malign Sorcery artefacts
  + Suggested improvements to codebase
+ [PixelTom](https://github.com/PixelTom)
  + Added Dispossessed
  + Added Kharadron Overlords
+ [Cpt Asgard](https://github.com/CptAsgard)
  + Added Nighthaunt
+ [ctcodie](https://github.com/ctcodie)
  + Added Legions of Nagash
+ [T-Nightingale](https://github.com/T-Nightingale)
  + Added Print button

## Discord

https://discord.gg/2nt9Fxp

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn install`

If you just downloaded this repository, or if you are getting errors regarding missing packages, run `yarn install` to download/update dependencies.

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Pre-commit

I have set this repository up to automatically take care of some chores when you push a commit.

1. Any special punctuation characters such as `‘`, `’`, `“`, and `”` are removed and replaced with `'` or `"`.
2. Any leading or trailing whitespace is removed from any `name` or `desc` entries.
3. Periods are added to the end of descriptions if they are missing.
4. Finally, we use `pretty-quick` to format the code according to the repository standards.
