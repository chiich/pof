const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const axios = require('axios')

const App = require('../../lib/app')

chai.use(dirtyChai)

describe('the app module', () => {
  let app
  before(() => {
    app = new App('key', 'secret')
  })

  it('should set a token', () => {
    app.setToken('abc', '123')
    expect(app.token).to.include({ key: 'abc' })
    expect(app.token).to.include({ secret: '123' })
  })

  it('should invoke GET APIs', async () => {
    sinon.stub(axios, 'get').resolves({ data: 'foo' })
    const response = await app.get('/api')
    expect(response).to.equal('foo')
    axios.get.restore()
  })
  it('should invoke POST APIs', async () => {
    sinon.stub(axios, 'post').resolves({ data: 'bar' })
    const response = await app.post('/api', 'stuff')
    expect(response).to.equal('bar')
    axios.post.restore()
  })
})
