module.exports = {
  "parser": "babel-eslint",
  "env": {
      "commonjs": true,
      "node": true,
      "es6": true
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
  },
  "extends": [ "eslint:recommended", "plugin:import/errors" ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": 1,
    "comma-dangle": [1, "always-multiline"],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": false, "optionalDependencies": false, "peerDependencies": false}],
    "require-await": "warn",
  },
  "globals": {
    "__basedir": true,
  },
}