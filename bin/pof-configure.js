const program = require('commander')
const pkg = require('../package.json')
const configure = require('../commands/configure')

program
  .version(pkg.version)

program
  .command('consumer')
  .description('Add app API key and secret')
  .action(async () => {
    await configure.consumer(pkg.name)
  })

program
  .command('account')
  .description('Authorise access to app account')
  .action(async () => {
    await configure.account(pkg.name)
  })

program
  .parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
