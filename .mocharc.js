"use strict";

// Configurations for this file:
// https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js

module.exports = {
  diff: true,
  extension: ["ts"],
  package: "./package.json",
  timeout: 15000,
  "watch-files": ["test/**/*.ts", "src/services/*.ts"],
  spec: ["test/**/*.ts"],
  recursive: true,
  require: ["ts-node/register", "tsconfig-paths/register", "test/hook.ts"],
  exit: true,
};
