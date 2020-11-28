const chai = require('chai')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
const sinon = require('sinon')
const inquirer = require('inquirer')
const CredentialManager = require('../lib/credential-manager')

chai.use(dirtyChai)

describe('a credential manager', () => {
  let creds

  before(() => {
    creds = new CredentialManager('pof-test')
  })

  context('with no existing credentials', () => {
    it('should prompt the user', async () => {
      sinon.stub(inquirer, 'prompt').resolves({ key: 'foo', secret: 'bar' })
      const [key, secret] = await creds.getKeyAndSecret()
      expect(key).to.equal('foo')
      expect(secret).to.equal('bar')
      expect(inquirer.prompt.calledOnce).to.be.true()
      inquirer.prompt.restore()
    })
  })

  context('with existing credentials', () => {
    it('should just return them', async () => {
      const [key, secret] = await creds.getKeyAndSecret()
      expect(key).to.equal('foo')
      expect(secret).to.equal('bar')
    })
  })

  after(async () => {
    await creds.clearKeyAndSecret()
  })
})