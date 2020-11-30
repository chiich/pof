const through2 = require('through2')
const ps = require('promise-streams')
const split = require('split2')
const parallel = require('parallel-transform')
const from = require('from2-array')
const JSONStream = require('JSONStream')
const CredentialManager = require('../lib/credential-manager')
const App = require('../lib/app')
const batch = require('../lib/batch-stream')

const doLookup = async (api, name, items, inout = process) => {
  const creds = new CredentialManager(name)
  const [key, secret] = await creds.getKeyAndSecret('consumer')
  const app = new App(key, secret)
  const [token, tokenSecret] = await creds.getKeyAndSecret('account')
  app.setToken(token, tokenSecret)
  return ps.pipeline(
    // Split onto neewlines
    items ? from.obj(items.split(',')) : inout.stdin.pipe(split()),

    // Batch up requests
    batch(100),

    // Parallelise batches; concurrency set to 2
    parallel(2, function (data, next) {
      app.get(`${api}${data.join(',')}`)
        .then((response) => next(null, response))
        .catch(next)
    }),

    // Flatten result to single array unit
    through2.obj(function (batchedAPIResponse, encoding, next) {
      batchedAPIResponse.forEach((response) => this.push(response)) // <-- negatively impacting unit tests?
      next()
    }),

    // Stringify previously-constructed array unit
    JSONStream.stringify(),

    // Pass stringified-array to stdout
    inout.stdout
  )
}

const lookup = {
  async users (...args) {
    await doLookup('1.1/users/lookup.json?screen_name=', ...args)
  },
  async statuses (...args) {
    await doLookup('1.1/statuses/lookup.json?id=', ...args)
  }
}

module.exports = lookup
