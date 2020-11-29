const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
const axios = require('axios')
const https = require('https')

class App {
  constructor (consumerKey, consumerSecret) {
    this.baseURL = 'https://api.twitter.com/'
    this.agent = new https.Agent({
      rejectUnauthorized: false
    })
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
      config.headers = oauth.toHeader(oauth.authorize({
        url: `${config.baseURL}${config.url}`,
        method: config.method,
        data: config.data
      }, this.token))

      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      return config
    })

    axios.defaults.baseURL = this.baseURL
    axios.defaults.httpsAgent = this.agent
  }

  setToken (key, secret) {
    this.token = { key, secret }
  }

  async get (api) {
    try {
      const response = await axios.get(api)
      return response.data
    } catch (error) {
      handleAPIError(error)
    }
  }

  async post (api, data) {
    try {
      const response = await axios.post(api, data)
      return response.data
    } catch (error) {
      handleAPIError(error)
    }
  }
}

function handleAPIError (error) {
  if (error.message.includes('401')) {
    throw new Error('Invalid API credentials -- try running "configure" again')
  } else if (error.message.includes('429')) {
    throw new Error('API rate limit reached -- try again later')
  } else {
    throw new Error(`API: ${error.message}`)
  }
}

module.exports = App
