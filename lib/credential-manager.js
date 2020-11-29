const ConfigStore = require('configstore')
const keytar = require('keytar')

class CredentialManager {
  constructor (name) {
    this.conf = new ConfigStore(name)
    this.service = name
  }

  async getKeyAndSecret (prop) {
    let key
    let secret
    const envAppKey = `${this.service.toUpperCase()}_${prop.toUpperCase()}_KEY`
    if (envAppKey in process.env) {
      key = process.env[envAppKey]
    } else {
      key = this.conf.get(`keys.${prop}`)
    }
    if (!key) {
      throw new Error(`Missing ${prop} key -- have you run 'configure ${prop}'?`)
    }

    const envAppSecret = `${this.service.toUpperCase()}_${prop.toUpperCase()}_SECRET`
    if (envAppSecret in process.env) {
      secret = process.env[envAppSecret]
    } else {
      secret = await keytar.getPassword(this.service, key)
    }
    if (!secret) {
      throw new Error(`Missing ${prop} secret -- have you run 'configure ${prop}'?`)
    }
    return [key, secret]
  }

  async clearKeyAndSecret (prop) {
    const key = this.conf.get(`keys.${prop}`)
    this.conf.delete(`keys.${prop}`)
    await keytar.deletePassword(this.service, key)
  }

  async storeKeyAndSecret (prop, key, secret) {
    this.conf.set(`keys.${prop}`, key)
    await keytar.setPassword(this.service, key, secret)
  }

  async clearAll () {
    for (const prop of Object.keys(this.conf.get('keys'))) {
      await this.clearKeyAndSecret(prop)
    }
  }
}

module.exports = CredentialManager
