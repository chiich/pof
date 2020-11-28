const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('a credential manager', () => {
  let creds

  before(() => {
    creds = new CredentialManager('pof-test')
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

  after(async () => {
    await creds.clearKeyAndSecret()
  })
})
