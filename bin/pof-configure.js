const program = require('commander')
const pkg = require('../package.json')
const configure = require('../commands/configure')
const util = require('../lib/util')

program
  .version(pkg.version)

program
  .command('consumer')
  .description('Add app API key and secret')
  .action(() => configure.consumer(pkg.name).catch(util.handleError))

program
  .command('account')
  .description('Authorise access to app account')
  .action(() => configure.account(pkg.name).catch(util.handleError))

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
