// const JSONStream = require('JSONStream')
// const stream = require('stream')

// const rs = new stream.Readable()
// const js = JSONStream.parse('*')

// const data = '[\n{"screen_name":"foo"}\n,\n{"screen_name":"bar"}\n]\n'

// rs.push(data)
// rs.push(null)

// js.on('end', (data) => {
//   console.log({ data })
// })

// rs.pipe(js)

const transform = require('parallel-transform')

const stream = transform(10, function (data, callback) { // 10 is the parallism level
  setTimeout(function () {
    callback(null, data)
  }, Math.random() * 1000)
})

stream.on('data', function (data) {
  console.log(data) // prints 0,1,2,...
})
stream.on('end', function () {
  console.log('stream has ended')
})

for (let i = 0; i < 10; i++) {
  stream.write('' + i)
}
stream.end()
