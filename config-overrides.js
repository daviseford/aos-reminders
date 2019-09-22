const { isEqual } = require("lodash");

module.exports = function override(config, env) {
    // This prevents pdf.js from throwing useless errors
  const updatedRules = config.module.rules.filter(
    rule => !isEqual(rule, { parser: { requireEnsure: false } })
  );
  config.module.rules = updatedRules;
  return config;
};