const ENS = require('@ensdomains/ensjs').default
const Web3 = require('web3')
const sha3 = require('web3-utils').sha3
const utils = require('web3-utils')
const BN = require('bn.js')

const ENS_ADDRESS = '0x84e2459Bf48ed4B57014F5E6c6a76B845d44F278'
const REFERRER_ADDRESS = '0xFbE0741bC1B52dD723A6bfA145E0a15803AC9581'
const NODE_URL = 'https://api.s0.b.hmny.io'

const DOMAIN_NAME = 'crazy'

const ETH_GAS_LIMIT = 6721900

const duration = 31536000

const EthRegistrarSubdomainRegistrar = require("../../build/contracts/EthRegistrarSubdomainRegistrar");
const apiFactory = app => ({
  ens: null,
  web3: null,
  subdomainRegistrar: null,
  resolverAddress: null,
  price: 1,
  async init() {
    this.web3 = new Web3(window.ethereum)

    const accounts = await this.web3.eth.getAccounts()

    const provider = new Web3.providers.HttpProvider(NODE_URL)

    this.ens = new ENS({ provider, ensAddress: ENS_ADDRESS })

    this.resolverAddress = await this.ens.name('resolver.one').getAddress()

    const subdomainRegisterAddress = await this.ens.name('crazy.one').getAddress()

    this.subdomainRegistrar = new this.web3.eth.Contract(
      EthRegistrarSubdomainRegistrar.abi,
      subdomainRegisterAddress
    )

    return accounts
  },

  async checkDomain(subdomain) {
    let subdomainAddress = await this.ens.name(`${subdomain}.crazy.one`).getAddress()

    this.price = await this.subdomainRegistrar.methods.rentPrice(subdomain, duration).call()

    return { subdomainAddress, price: this.price }
  },

  async connect() {
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
		return accounts
	},

  async register(subdomain) {

    const accounts = await ethereum.enable()

    try {
      const tx = await this.subdomainRegistrar.methods
      .register(
        sha3(DOMAIN_NAME),
        subdomain,
        accounts[0],
        duration,
        REFERRER_ADDRESS,
        this.resolverAddress
      )
      .send({
        from: accounts[0],
        value: utils.toBN(this.price),
        gas: ETH_GAS_LIMIT,
        gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1)),
      })

      return tx
    } catch (e) {
			console.log('error', e)
		}
  }
})

export default ({ app }, inject) => {
	const subdomain = apiFactory(app)
	inject('subdomain', subdomain)
}
