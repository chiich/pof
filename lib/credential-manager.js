const ConfigStore = require('configstore')
const inquirer = require('inquirer')
const keytar = require('keytar')

class CredentialManager {
  constructor (name) {
    this.conf = new ConfigStore(name)
    this.service = name
  }

  async getKeyAndSecret () {
    const key = this.conf.get('apiKey')
    if (key) {
      const secret = await keytar.getPassword(this.service, key)
      return [key, secret]
    } else {
      const answers = await inquirer.prompt([
        { type: 'input', name: 'key', message: 'Enter your API Key:' },
        { type: 'password', name: 'secret', message: 'Enter your API Secret:' }
      ])

      this.conf.set('apiKey', answers.key)
      await keytar.setPassword(this.service, answers.key, answers.secret)

      return [answers.key, answers.secret]
    }
  }

  async clearKeyAndSecret () {
    const key = this.conf.get('apiKey')
    this.conf.delete('apiKey')
    await keytar.deletePassword(this.service, key)
  }
}

module.exports = CredentialManager
