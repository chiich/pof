const path = require('path')
const fs = require('fs')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const inquirer = require('inquirer')
const dirtyChai = require('dirty-chai')
const configure = require('../../commands/configure')
const CredentialManager = require('../../lib/credential-manager')

chai.use(dirtyChai)

describe('the configure module', () => {
  const testprog = 'pof-test'
  let creds
  let sandbox

  before(() => {
    creds = new CredentialManager(testprog)
  })

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
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

  afterEach(() => {
    sandbox.restore()
  })

  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', `${testprog}.json`), done)
  })
})
