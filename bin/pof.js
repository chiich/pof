#!/usr/bin/env node

const program = require('commander')
const update = require('update-notifier')
const pkg = require('../package.json')

update({ pkg }).notify({ isGlobal: true })

program
  .version(pkg.version)
  .command('configure', 'Configure app-related credentials')
  .command('lookup', 'Lookup stuff at the API')
  .parse(process.argv)
