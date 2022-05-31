const { expect } = require('chai')
const { ethers } = require('hardhat')
const ABI = require('./ModifiedUsdcAbi.json')

describe('Test Hack', function () {
  let usdc
  let scam
  let owner, spender
  let accs

  before(async () => {
    accs = await ethers.getSigners()
    ;[owner, spender] = accs

    const Usdc = await ethers.getContractFactory('Usdc', owner)
    const Scam = await ethers.getContractFactory('Scam1', owner)
    const Scam4 = await ethers.getContractFactory('Scam4', owner)

    usdc = await Usdc.deploy()
    scam = await Scam.deploy(usdc.address)
    scam4 = await Scam4.deploy()

    await usdc.deployed()
    await scam.deployed()
    await scam4.deployed()
  })

  describe('Usdc contract', () => {
    it('Should mint USDC tokens to deployer address', async function () {
      expect(await usdc.balanceOf(owner.address)).to.equal(1000)
    })
  })

  describe('Scam contract 1', () => {
    it('Delegate call to target Usdc Contract modified caller contract allowances, hack does NOT work', async () => {
      const tx = await scam.approve(spender.address, 500)
      await expect(tx)
        .to.emit(scam, 'Approval')
        .withArgs(owner.address, spender.address, 500)

      await tx.wait()

      expect(await scam.allowance(owner.address, spender.address)).not.to.equal(
        500
      )
      expect(await scam.allowance(owner.address, spender.address)).to.equal(400)
      expect(await usdc.allowance(owner.address, spender.address)).to.equal(0)
    })
  })

  describe('Scam contract 4', () => {
    it('transfer causes out of gas error', async () => {
      let message

      try {
        await scam4.transfer(owner.address, 100)
      } catch (err) {
        message = err.message
      }

      expect(message).to.equal('Transaction ran out of gas')
    })
  })

  describe('Extended ABI', () => {
    it('Can not send ETH when making a token transfer, extending ABI has no effect', async () => {
      const _usdc = await ethers.getContractAt(ABI.abi, usdc.address, owner)
      expect(usdc.address).to.equal(_usdc.address)

      await expect(() =>
        _usdc.transfer(spender.address, 100)
      ).to.changeTokenBalances(_usdc, [owner, spender], [-100, 100])
      await expect(() =>
        _usdc
          .transfer(spender.address, 100, { value: 0 })
          .to.changeTokenBalances(_usdc, [owner, spender], [-100, 100])
      )

      try {
        await _usdc.transfer(spender.address, 100, {
          value: ethers.utils.parseEther('1')
        })
      } catch (err) {
        expect(err.message).to.match(/reverted/)
      }
    })
  })

  describe('Sending ETH in a payable transfer', () => {
    it('Sends ETH out', async () => {
      const Scam = await ethers.getContractFactory('Scam5', accs[0])
      const scam = await Scam.deploy(accs[1].address)

      await expect(
        await scam.transfer(accs[2].address, 100)
      ).not.to.changeEtherBalance(accs[1], 1000)

      await expect(
        await scam.transfer(accs[2].address, 100, { value: 10000 })
      ).to.changeEtherBalances([accs[0], accs[1]], [-10000, 10000])
    })
  })
})
