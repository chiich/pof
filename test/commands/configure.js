const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const inquirer = require('inquirer')
const dirtyChai = require('dirty-chai')
const configure = require('../../commands/configure')
const CredentialManager = require('../../lib/credential-manager')
const App = require('../../lib/app')
const util = require('../../lib/util')

chai.use(dirtyChai)

describe('the configure module', () => {
  const testprog = 'pof-test'
  let creds
  let sandbox

  before(() => {
    creds = new CredentialManager(testprog)
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  it('should add credentials when none are found', async () => {
    sandbox.stub(inquirer, 'prompt').resolves({ key: 'one', secret: 'two' })
    await configure.consumer(testprog)
    const [key, secret] = await creds.getKeyAndSecret('apiKey')
    expect(key).to.equal('one')
    expect(secret).to.equal('two')
    expect(inquirer.prompt.calledOnce).to.be.true()
  })

  it('should overwrite existing credentials', async () => {
    sandbox.stub(inquirer, 'prompt').resolves({ key: 'three', secret: 'four' })
    await configure.consumer(testprog)
    const [key, secret] = await creds.getKeyAndSecret('apiKey')
    expect(key).to.equal('three')
    expect(secret).to.equal('four')
    expect(inquirer.prompt.calledOnce).to.be.true()
  })

  it('should add an account', async () => {
    sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
      .resolves(['key', 'secret'])
    sandbox.stub(App.prototype, 'post')
      .onFirstCall().resolves('oauth_token=abc&oauth_token_secret=def')
      .onSecondCall().resolves('oauth_token=ghi&oauth_token_secret=jkl')
    sandbox.stub(App.prototype, 'get').resolves({ screen_name: 'foo' })
    sandbox.stub(inquirer, 'prompt')
      .onFirstCall().resolves({ continue: '' })
      .onSecondCall().resolves({ pin: '1234' })
    sandbox.stub(util, 'openBrowser').returns('')
    sandbox.spy(console, 'log')
    await configure.account(testprog)
    CredentialManager.prototype.getKeyAndSecret.restore()

    const [token, secret] = await creds.getKeyAndSecret('accountToken')
    expect(token).to.equal('ghi')
    expect(secret).to.equal('jkl')
    expect(console.log.calledWith('Account "foo" successfully added')).to.be.true()
  })

  afterEach(() => {
    sandbox.restore()
  })

  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', `${testprog}.json`), done)
  })
})
