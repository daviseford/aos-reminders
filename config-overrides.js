const { isEqual } = require('lodash')
// const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = function override(config, env) {
  // This prevents `pdf.js` from throwing useless errors during the build process
  const updatedRules = config.module.rules.filter(
    rule => !isEqual(rule, { parser: { requireEnsure: false } })
  )
  config.module.rules = updatedRules

  // This prevents `jspdf` from throwing useless errors during the build process
  // config.plugins.push(
  //   new FilterWarningsPlugin({
  //     exclude: /Critical dependency: the request of a dependency is an expression/,
  //   })
  // )

  // Why do both pdf libraries make Webpack unhappy?
  // That is a good question :)

  /**
   * Fixes this error:
   * Module not found: Error: Can't resolve 'D:/Projects/aos-reminders/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits' in 'D:\Projects\aos-reminders\node_modules\luxon\src\zones'
   * Did you mean 'inherits.js'?
   * BREAKING CHANGE: The request 'D:/Projects/aos-reminders/node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits' failed to resolve only because it was resolved as fully specified
   * (probably because the origin is strict EcmaScript Module, e. g. a module with javascript mimetype, a '*.mjs' file, or a '*.js' file where the package.json contains '"type": "module"').
   * The extension in the request is mandatory for it to be fully specified.
   * Add the extension to the request.
   *
   *
   * Solution found here:
   * https://stackoverflow.com/questions/70964723/webpack-5-in-ceate-react-app-cant-resolve-not-fully-specified-routes
   */
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  })

  return config
}
