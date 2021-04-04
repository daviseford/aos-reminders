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

  return config
}
