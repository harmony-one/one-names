const express = require('express')
const Web3 = require('web3')
const ENS = require('@ensdomains/ensjs').default
const sha3 = require('web3-utils').sha3
const NODE_URL = 'https://api.s0.b.hmny.io'
const ENS_ADDRESS = '0xB750e4B49cf1b5162F7EfC964B3df5E9bfC893AD'

const app = express()
app.use(express.json())

const registerDns = (subdomain) => {
  // TODO AWS Route 53 call
  console.log('AWS call...')
}

const getLogs = async (txHash) => {
  const web3 = new Web3(NODE_URL)
  const provider = new Web3.providers.HttpProvider(NODE_URL)
  const ens = new ENS({ provider, ensAddress: ENS_ADDRESS })

  const receipt = await web3.eth.getTransactionReceipt(txHash)

  receipt.logs.forEach(async (log) => {
    try {
      const decoded = web3.eth.abi.decodeLog(
        [
          {
            indexed: true,
            name: 'label',
            type: 'bytes32'
          },
          {
            indexed: false,
            name: 'subdomain',
            type: 'string'
          },
          {
            indexed: true,
            name: 'owner',
            type: 'address'
          },
          {
            indexed: false,
            name: 'price',
            type: 'uint256'
          }
        ],
        log.data,
        log.topics.slice(1)
      )

      const subdomainRegisterAddress = await ens.name('crazy.one').getAddress()
      const checkDomain = decoded.label === sha3('crazy')
      const checkContract = receipt.to.toLowerCase() === subdomainRegisterAddress.toString().toLowerCase()

      // confirmed. OK to continue
      if (checkDomain && checkContract) {
        const subdomain = decoded.subdomain
        console.log('OK to register DNS', subdomain)
        registerDns(subdomain)
      } else {
        console.log('Error: could not verify domain or contract')
      }
    } catch (e) {}
  })
}

app.post('/dns', async (req, res) => {
  const tx = req.body.tx
  await getLogs(tx)
  res.json({ data: 'done' })
})

module.exports = app
