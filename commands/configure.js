const inquirer = require('inquirer')
const util = require('../lib/util')
const CredentialManager = require('../lib/credential-manager')

const configure = {
  async consumer (name) {
    const creds = new CredentialManager(name)
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'key',
        message: 'Enter your API Key:',
        validate: util.notEmpty
      },
      {
        type: 'password',
        name: 'secret',
        message: 'Enter your API Secret:',
        validate: util.notEmpty
      }
    ])
    await creds.storeKeyAndSecret(answers.key, answers.secret)
  }
}

module.exports = configure
