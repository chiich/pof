const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')

class App {
  constructor (consumerKey, consumerSecret) {
    this.baseURL = 'https://api.twitter.com/'
    this.token = {}
    const oauth = OAuth({
      consumer: {
        key: consumerKey,
        secret: consumerSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString, key) => {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
      }
    })

    axios.interceptors.request.use((config) => {
      config.headers = oauth.toHeaders(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        data: config.data
      }, this.token))

      config.header['Content-Type'] = 'application/x-www-form-urlencoded'
      return config
    })

    axios.defaults.baseURL = this.baseURL
  }

  setToken (key, secret) {
    this.token = { key, secret }
  }

  async get (api) {
    const response = await axios.get(api)
    return response.data
  }

  async post (api, data) {
    const response = await axios.post(api, data)
    return response.data
  }
}

module.exports = App
