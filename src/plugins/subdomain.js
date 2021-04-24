import userStore from './userStore'
import { default as contract } from 'truffle-contract'
import { default as namehash } from 'eth-ens-namehash'
import Web3 from 'web3'
import { default as Promise } from 'bluebird'
import { keccak_256 as sha3 } from 'js-sha3'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
const utils = require('web3-utils')

import subdomainregistrar_artifacts from '../../build/contracts/EthRegistrarSubdomainRegistrar.json'
import ens_artifacts from '../../build/contracts/ENSRegistryWithFallback.json'

const ensAddress = '0x8658177435d4e2f9cE0E651115995757E6b542e6'
const referrerAddress = '0xFbE0741bC1B52dD723A6bfA145E0a15803AC9581'
const defaultSubdomainRegistrar = '0x29770aC8cEEfad98C928c5A7142eDBc4c5f8A4a2'

const domainnames = [{ name: 'crazy-test', version: '1.0' }]

var SubdomainRegistrar = contract(subdomainregistrar_artifacts)
var ENSC = contract(ens_artifacts)
Promise.config({ cancellation: true })

var registrarVersions = {
	'1.0': {
		query: async function(domain, subdomain) {
			console.log(111, domain, subdomain)
			const res = await domain.contract.query(
				'0x' + sha3(domain.name),
				subdomain
			)

			console.log(222, res)
			return res
		},
		register: async function(
			domain,
			subdomain,
			ownerAddress,
			referrerAddress,
			resolverAddress,
			value
		) {
			return domain.contract.register(
				'0x' + sha3(domain.name),
				subdomain,
				ownerAddress || referrerAddress,
				referrerAddress,
				resolverAddress,
				{
					from: ownerAddress || referrerAddress,
					value: Number(value)
				}
			)
		}
	}
}

const apiFactory = app => ({
	wallet: null,
	resolverAddress: null,
	ens: null,
	async init() {
		let web3 = new Web3(window.ethereum)
		SubdomainRegistrar.setProvider(web3.currentProvider)
		ENSC.setProvider(web3.currentProvider)

		try {
			this.ens = await ENSC.at(ensAddress)

			this.resolverAddress = await this.ens.resolver(
				namehash.hash('resolver.one')
			)

			// Construct instances of the registrars we know about
			var registrars = {}
			for (var i = 0; i < domainnames.length; i++) {
				var domain = domainnames[i]
				if (registrars[domain.registrar] === undefined) {
					registrars[domain.registrar] = await (domain.registrar === undefined
						? SubdomainRegistrar.at(defaultSubdomainRegistrar)
						: SubdomainRegistrar.at(domain.registrar))
				}
				domainnames[i].contract = registrars[domain.registrar]
			}

			// Get the address of the current public resolver
			this.resolverAddress = await this.ens.resolver(
				namehash.hash('resolver.one')
			)
		} catch (e) {
			console.log('error', e)
		}
	},

	async checkDomain(subdomain) {
		const domain = domainnames[0]

		var info = await registrarVersions[domain.version].query(domain, subdomain)
		const hostname = `${subdomain}.${domain.name}.one`

		const ens = new ENS({ provider: web3.currentProvider, ensAddress })
		const test = await ens.name(hostname).getAddress()
		console.log(hostname, test)

		return info
	},

	async registerDomain(subdomain) {
		const domain = domainnames[0]

		var info = await registrarVersions[domain.version].query(domain, subdomain)

		// const accounts = await harmony.getAccount()
		const accounts = await ethereum.enable()

		try {
			var tx = await registrarVersions[domain.version].register(
				domain,
				subdomain,
				accounts[0],
				referrerAddress,
				this.resolverAddress,
				utils.toBN(info[1]).toString()
			)

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
