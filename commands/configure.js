const inquirer = require('inquirer')
const querystring = require('querystring')
const util = require('../lib/util')
const CredentialManager = require('../lib/credential-manager')
const App = require('../lib/app')

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
    await creds.storeKeyAndSecret('consumer', answers.key, answers.secret)
  },

  async account (name) {
    const creds = new CredentialManager(name)
    const [apiKey, apiSecret] = await creds.getKeyAndSecret('consumer')
    const app = new App(apiKey, apiSecret)
    const response = querystring.parse(await app.post('oauth/request_token'))
    app.setToken(response.oauth_token, response.oauth_token_secret)
    await inquirer.prompt({
      type: 'input',
      message: 'Press Enter to open Twitter in your default browser to authorise access',
      name: 'continue'
    })

    util.openBrowser(`${app.baseURL}oauth/authorize?oauth_token=${response.oauth_token}`)

    const answers = await inquirer.prompt({
      type: 'input',
      message: 'Enter the PIN provided by App:',
      name: 'pin',
      validate: util.notEmpty
    })

    const tokenResponse = querystring.parse(
      await app.post('oauth/access_token', `oauth_verifier=${answers.pin}`)
    )

    app.setToken(tokenResponse.oauth_token, tokenResponse.oauth_token_secret)

    const verifyResponse = await app.get('1.1/account/verify_credentials.json')
    await creds.storeKeyAndSecret('account', tokenResponse.oauth_token, tokenResponse.oauth_token_secret)

    console.log(`Account "${verifyResponse.screen_name}" successfully added`)
  }
}

module.exports = configure
