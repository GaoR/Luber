module.exports = {
  "extends": ["airbnb"],
  "env": {
    "jest": true,
    "browser": true,
  },
  "rules": {
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": true
    }],
    "linebreak-style": ["error", "windows"]
  }
};