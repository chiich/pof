const ConfigStore = require('configstore')
const keytar = require('keytar')

class CredentialManager {
  constructor (name) {
    this.conf = new ConfigStore(name)
    this.service = name
  }

  async getKeyAndSecret (prop) {
    const key = this.conf.get(prop)
    if (!key) {
      throw new Error('API Key not found')
    }
    const secret = await keytar.getPassword(this.service, key)
    return [key, secret]
  }

  async clearKeyAndSecret (prop) {
    const key = this.conf.get(prop)
    this.conf.delete(prop)
    await keytar.deletePassword(this.service, key)
  }

  async storeKeyAndSecret (prop, key, secret) {
    this.conf.set(prop, key)
    await keytar.setPassword(this.service, key, secret)
  }
}

module.exports = CredentialManager
