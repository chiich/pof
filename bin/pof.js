#!/usr/bin/env node

const program = require('commander')
const pkg = require('../package.json')

program
  .version(pkg.version)
  .command('configure', 'Configure app-related credentials')
  .command('lookup', 'Lookup stuff at the API')
  .parse(process.argv)
