const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const { ObjectReadableMock, ObjectWritableMock } = require('stream-mock')
const sinon = require('sinon')
const CredentialManager = require('../../lib/credential-manager')
const App = require('../../lib/app')
const lookup = require('../../commands/lookup')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the lookup module', () => {
  let sandbox
  const testprog = 'pof-test'

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  context('users', () => {
    beforeEach(() => {
      sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
        .resolves(['key', 'secret'])
      sandbox.stub(App.prototype, 'get')
        .callsFake((url) => {
          const response = url.slice(url.indexOf('=') + 1)
            .split(',').map((n) => ({ screen_name: n }))
          return Promise.resolve(response)
        })
    })

    it.skip('should lookup users piped to stdin', (done) => {
      const stdin = new ObjectReadableMock(['foo\n', 'bar\n'])
      const stdout = new ObjectWritableMock()

      lookup.users(testprog, null, { stdin, stdout })

      stdout.on('finish', () => {
        expect(stdout.data)
          .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
        done()
      })
    })
    it.skip('should lookup more than 100 users piped to stdin', (done) => {
      const users = [...Array(11).keys()].map((n) => `foo${n}`)
      const stdin = new ObjectReadableMock(users.map((u) => `${u}\n`))
      const stdout = new ObjectWritableMock()

      lookup.users(testprog, null, { stdin, stdout })

      stdout.on('finish', () => {
        expect(stdout.data)
          .to.deep.equal(users.map((u) => ({ screen_name: u })))
        done()
      })
    })

    it.skip('should lookup users passed in via the command line', (done) => {
      const stdout = new ObjectWritableMock()

      lookup.users(testprog, 'foo,bar', { stdout })

      stdout.on('finish', () => {
        expect(stdout.data)
          .to.deep.equal([{ screen_name: 'foo' }, { screen_name: 'bar' }])
        done()
      })
    })

    it('should reject on error', async () => {
      App.prototype.get.restore()
      sandbox.stub(App.prototype, 'get').rejects(new Error('Test Error'))
      const stdout = new ObjectWritableMock()
      await expect(lookup.users(testprog, 'foo', { stdout })).to.be.rejectedWith('Test Error')
    })
  })

  afterEach(() => {
    sandbox.restore()
  })
})
