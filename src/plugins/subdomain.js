const ENS = require('@ensdomains/ensjs').default
const Web3 = require('web3')
const sha3 = require('web3-utils').sha3
const utils = require('web3-utils')
const BN = require('bn.js')
const { hash } = require('eth-ens-namehash')

const DOMAIN_NAME = 'crazy'
const ETH_GAS_LIMIT = 6721900

const EthRegistrarSubdomainRegistrar = require('../../build/contracts/EthRegistrarSubdomainRegistrar')
const apiFactory = (app, $axios, $config) => ({
  ens: null,
  web3: null,
  subdomainRegistrar: null,
  resolverAddress: null,
  price: 1,
  async init () {
    this.web3 = new Web3(window.ethereum)

    const accounts = await this.web3.eth.getAccounts()

    const provider = new Web3.providers.HttpProvider($config.WEB3_URL)

    this.ens = new ENS({ provider, ensAddress: $config.ENS_ADDRESS })

    this.resolverAddress = await this.ens.name('resolver.one').getAddress()

    const subdomainRegisterAddress = await this.ens.name('crazy.one').getAddress()

    this.subdomainRegistrar = new this.web3.eth.Contract(
      EthRegistrarSubdomainRegistrar.abi,
      subdomainRegisterAddress
    )

    return accounts
  },

  async checkDomain (subdomain) {
    const subdomainAddress = await this.ens.name(`${subdomain}.crazy.one`).getAddress()

    this.price = await this.subdomainRegistrar.methods.rentPrice(subdomain, this.durationCalculator(subdomain)).call()

    return { subdomainAddress, price: this.price }
  },

  async connect () {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return accounts
  },

  durationCalculator (subdomain) {
    const years = 1 // app.$utils.priceCalculator(subdomain.length).years
    return years * 31536000
  },

  async register (subdomain, twitterUsername) {
    const accounts = await window.ethereum.enable()

    try {
      const tx = await this.subdomainRegistrar.methods
        .register(
          sha3(DOMAIN_NAME),
          subdomain,
          accounts[0],
          this.durationCalculator(subdomain),
          twitterUsername || '',
          this.resolverAddress
        )
        .send({
          from: accounts[0],
          value: utils.toBN(this.price),
          gas: ETH_GAS_LIMIT,
          gasPrice: new BN(await this.web3.eth.getGasPrice()).mul(new BN(1))
        })

      // Update DNS here
      await this.updateDns(tx.transactionHash)

      return tx
    } catch (e) {
      console.log('error', e)
    }
  },

  async twitterLookup (subdomain) {
    console.log(
      'Twitter:',
      await this.subdomainRegistrar.methods
        .twitter(hash(`${subdomain}.crazy.one`))
        .call()
    )
  },

  async updateDns (tx) {
    await $axios.$post(`${window.location.origin}/.netlify/functions/dns`, { tx })
  },

  async test (tx) {
    const response = await $axios.$post(`${window.location.origin}/.netlify/functions/dns`, { tx })
    console.log(response)
  }
})

export default ({ app, $axios, $config }, inject) => {
  const subdomain = apiFactory(app, $axios, $config)
  inject('subdomain', subdomain)
}
