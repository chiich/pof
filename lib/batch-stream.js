const through2 = require('through2')

const batchStream = (batchSize = 5) => {
  let batch

  batch = []

  return through2.obj(
    (chunk, enc, next) => {
      batch.push(chunk)

      if (batch.length === batchSize) {
        const data = batch
        batch = []
        next(null, data)
      } else {
        next()
      }
    },
    (next) => {
      if (batch.length > 0) {
        next(null, batch)
      } else {
        next()
      }
    }
  )
}

module.exports = batchStream
