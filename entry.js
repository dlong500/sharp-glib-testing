#!/usr/bin/env node
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

let app_path = './dist/';
let app_module = 'base.js';

global.__basedir = __dirname;

const env = process.env.NODE_ENV || 'production';

if (env === 'development') {
  console.log('Activating on-demand babel transpiling (using options in .babelrc)...');
  require("babel-register");
  app_path = './src/'
}

module.exports = require(app_path + app_module);