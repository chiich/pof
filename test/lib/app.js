const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const axios = require('axios')

const App = require('../../lib/app')

chai.use(chaiAsPromised)
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
  it('should reject on invalid credentials', async () => {
    sinon.stub(axios, 'post').rejects(new Error('401'))
    await expect(app.post('/api', 'stuff')).to.be.rejectedWith('Invalid API credentials')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('401'))
    await expect(app.get('/api')).to.be.rejectedWith('Invalid API credentials')
    axios.get.restore()
  })
  it('should reject on rate limit error', async () => {
    sinon.stub(axios, 'post').rejects(new Error('429'))
    await expect(app.post('/api', 'stuff')).to.be.rejectedWith('API rate limit reached')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('429'))
    await expect(app.get('/api')).to.be.rejectedWith('API rate limit reached')
    axios.get.restore()
  })
  it('should reject on other errors', async () => {
    sinon.stub(axios, 'post').rejects(new Error('foo'))
    await expect(app.post('/api', 'stuff')).to.be.rejectedWith('API:')
    axios.post.restore()
    sinon.stub(axios, 'get').rejects(new Error('foo'))
    await expect(app.get('/api')).to.be.rejectedWith('API:')
    axios.get.restore()
  })
})
