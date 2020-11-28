const chai = require('chai')
const path = require('path')
const fs = require('fs')
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('a credential manager', () => {
  const testprog = 'pof-test'
  let creds

  before(() => {
    creds = new CredentialManager(testprog)
  })

  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('foo', 'bar')
    const [key, secret] = await creds.getKeyAndSecret()
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
  })

  it('should reject when no credentials are found', async () => {
    await creds.clearKeyAndSecret()
    expect(creds.getKeyAndSecret()).to.be.rejected()
  })

  after((done) => {
    fs.unlink(path.join(process.env.HOME, '.config', 'configstore', `${testprog}.json`), done)
  })
})
