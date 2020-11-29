const chai = require('chai')
const path = require('path')
const fs = require('fs-extra')
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
  const testprog = 'pof-test'
  let creds

  before(() => {
    creds = new CredentialManager(testprog)
  })

  it('should return credentials when they are found', async () => {
    await creds.storeKeyAndSecret('consumer', 'foo', 'bar')
    const [key, secret] = await creds.getKeyAndSecret('consumer')
    expect(key).to.equal('foo')
    expect(secret).to.equal('bar')
  })

  it('should reject when no key is found', async () => {
    await creds.clearKeyAndSecret('consumer')
    expect(creds.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer key')
  })

  it('should reject when no secret is found', async () => {
    creds.conf.set('keys.consumer', 'foo')
    await expect(creds.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer secret')
    creds.conf.delete('keys.consumer')
  })

  it('should remove all credentials', async () => {
    await creds.storeKeyAndSecret('consumer', 'one', 'two')
    await creds.storeKeyAndSecret('account', 'three', 'four')

    await creds.clearAll()

    await expect(creds.getKeyAndSecret('consumer')).to.be.rejected()
    await expect(creds.getKeyAndSecret('account')).to.be.rejected()
  })

  after(async () => {
    await creds.clearAll()
    await fs.unlink(path.join(process.env.HOME, '.config', 'configstore', `${testprog}.json`))
  })
})
