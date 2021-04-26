<template>
  <section class="section">
		<topnav />

		<div class="container">
			<div class="inner_container">
				<div class="logo"><img src="/images/onenameslogo.svg" ></div>
				<div v-if="noWallet" class="loading">MetaMask wallet not installed 😔</div>
				<div v-if="loading" class="loading"><PulseLoader /></div>
				<div v-if="!loading && !noWallet">
					<div>
						<form @submit.prevent="searchName">
							<i class="fa fa-search icon"></i>
							<input v-model="search" class="search" placeholder="Search for a ONE name" spellcheck="false" />
							<button :disabled="searchDisabled || (search && search.length < 1)" type="submit">{{ searchText }}</button>
						</form>
					</div>

					<div class="priceContainer">
						<div v-if="hostname" class="hostname">{{ hostname }} <span v-if="invalid" class="red">🙅‍♀️ Invalid Hostname</span></div>
						<price v-if="!invalid" :characters="encodedSearch.length" @price="priceChange" />
					</div>

					<div class="search_result_container">
						<div v-if="searchDisabled" class="search_result">Searching <PulseLoader size="8px" /></div>

						<div v-if="searchResult">
							<div v-if="searchResult[0] == ''">
								Sorry, {{ hostname }} is taken 😔 try another ONE!
							</div>
							<div v-else class="search_result">
								<div><span class="green">{{ hostname }}</span> is available.</div>
								<div v-if="!registering" class="register_container"><button @click.prevent="getTwitter">Register</button></div>
							</div>
						</div>
						<div v-if="registering" class="search_result">Registering. Please wait <PulseLoader size="8px" /></div>
						<div v-if="confirmation" class="confirmation_result">
							<div>Registered!</div>
							<div><span class="green">{{ safeHostname }}</span> is yours.</div>
						</div>
						<div v-if="confirmation" class="confirmation"><a :href="`https://explorer.pops.one/#/tx/${confirmation.tx}`" target="_blank">Confirmation</a></div>
					</div>
				</div>
			</div>
			<modal name="twitter-modal" :clickToClose="false" :focusTrap="true">
        <div class="twitter_modal">
					<div>Do you want to link this registration to your Twitter profile?</div>
					<i class="fa fa-twitter icon"></i>
					<input v-model="twitter" type="text" placeholder="Twitter username" />
					<div class="button_container">
						<button @click="registerDomain(true)"><i class="fa fa-check"></i> Yes, link it</button>
						<button @click="registerDomain(false)">No, thank you</button>
					</div>
				</div>
    	</modal>
		</div>
  </section>
</template>

<script>
const isValidHostname = require('is-valid-hostname')
const punycode = require('punycode')

import Vue from 'vue'
import topnav from '~/components/topnav.vue'
import price from '~/components/price.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VModal from 'vue-js-modal'
Vue.use(VModal)

export default {
	components: {
    topnav,
		price,
		PulseLoader
  },
	data() {
		return {
			noWallet: false,
			loading: true,
			connected: false,
			searchDisabled: false,
			search: '',
			encodedSearch: '',
			invalid: false,
			hostname: null,
			safeHostname: null,
			searchText: 'Search',
			connectButton: 'Connect',
			searchResult: null,
			price: 0,
			registering: false,
			confirmation: null,
			twitter: null
		}
	},
	watch: {
		search: function(val, oldVal) {
			this.encodedSearch = punycode.toASCII(val)
      if (val) {
				this.invalid = false
				this.searchResult = null
				this.confirmation = null
				this.validateHostname()
			} else {
				this.hostname = null
			}
		},
		twitter: function(val, oldVal) {
			if (val) {
				this.twitter = val.replace('@', '')
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		validateHostname() {
			this.hostname = `${this.search}.crazy.one`
		},
		priceChange(val) {
			this.price = val
		},
		async connect() {
			const wallet = await this.$store.dispatch('subdomain/connect')
			console.log(wallet)
			if (wallet) {
				this.connected = true
				this.connectButton = wallet
			}
		},
		async init() {
			if (window.ethereum) {
				this.loading = true
				await this.$subdomain.init()
				this.loading = false
			} else {
				this.noWallet = true
				this.loading = false
			}
		},
		async searchName() {
			if (!isValidHostname(this.encodedSearch)) {
				this.invalid = true
				return
			}
			this.confirmation = null
			this.searchText = 'Loading'
			this.searchDisabled = true
			this.searchResult = await this.$subdomain.checkDomain(this.search)
			this.searchText = 'Search'
			this.searchDisabled = false
		},
		getTwitter() {
			this.$modal.show('twitter-modal')
		},
		async registerDomain(useTwitter) {
			if (useTwitter) {
				if (!this.twitter) {
					console.log('Twitter handle is empty')
					return
				}
			}

			this.$modal.hide('twitter-modal')

			this.safeHostname = this.hostname
			this.registering = true

			// TODO pass this.twitter to register method
			const response = await this.$subdomain.registerDomain(this.encodedSearch)
			this.search = ''
			this.registering = false
			this.searchResult = false
			this.confirmation = response
		},
		async setDns() {
			const response = await this.$axios.$get('/api/dns')
			console.log(response)
		}
	}
}
</script>

<style lang="scss" scoped>
$green: #51ff9e;
$red: red;

.loading {
	color: #fff;
	font-size: 20px;
}

.green {
	color: $green;
}

.red {
	color: red;
}

button {
	cursor: pointer;
}

.container {
	display: flex;
	justify-content: center;
	align-items: top;
	margin-top: 200px;
	text-align: center;
}

.inner_container {
	min-width: 60%;
	min-height: 200px;

	.logo {
		margin-bottom: 50px;
		img {
			width: 323px;
		}
	}
}

form {
	display: flex;
	min-width: 780px;

	::placeholder {
		color: #ccc;
	}

	i {
		position: absolute;
		font-size: 30px;
		color: #ccc;
	}

	.icon {
			padding: 10px;
			min-width: 40px;
			margin-top: 18px;
	}

	button {
		border-radius: 0px 6px 6px 0px;
		display: block;
		background: rgb(51, 182, 255);
    color: white;
    font-size: 22px;
    font-family: Overpass;
    padding: 20px 0px;
    height: 90px;
    width: 162px;
    border: none;

		&:disabled {
			background: rgb(199, 211, 227);
		}

		&:hover {
			opacity: 0.8;
		}
	}
}

.search {
	border-radius: 6px 0px 0px 6px !important;
  font-size: 28px !important;
	padding: 20px 0px 20px 55px;
  width: 100%;
  border: none;
  border-radius: 0px;
  font-size: 18px;
  font-family: Overpass;
  font-weight: 100;
}

.priceContainer {
	margin-top: 10px;
	min-height: 60px;
	color: #fff;
	display: flex;
	justify-content: center;

	.hostname {
		padding-right: 20px;
	}
}

.search_result_container {
	color: #fff;
	font-size: 20px;
	.search_result {
		display: flex;
		flex-direction: column;
		justify-content: center;

		.register_container {
			margin-top: 20px;
			color: $green;
			display: flex;
			justify-content: center;

			button {
				border-radius: 6px;
				display: block;
				background: rgb(51, 182, 255);
				color: white;
				font-size: 18px;
				font-family: Overpass;
				padding: 6px 0px;
				height: 40px;
				width: 162px;
				border: none;

				&:hover {
					opacity: 0.8;
				}
			}
		}
	}

	.congrats {
		font-weight: bold;
	}

	.confirmation_result {
		display: flex;
		justify-content: center;
		div {
			margin-right: 10px;

			a {
				color: #fff;
				font-size: 16px;

				&:hover {
					opacity: 0.7;
				}
			}
		}
	}

	.confirmation {
		a {
			color: #fff;
			font-size: 16px;

			&:hover {
				opacity: 0.7;
			}
		}
	}
}

.twitter_modal {
	background-color: #dbf2ff;
	height: 100vh;
	padding: 20px;

	::placeholder {
		color: #ccc;
	}

	.icon {
		padding: 10px;
		min-width: 40px;
		margin-top: 50px;
		position: absolute;
		font-size: 30px;
		color: #1da1f8;
		margin-left: 0 !important;
	}

	input {
		margin-top: 50px;
		border-radius: 6px !important;
		font-size: 18px !important;
		padding: 10px 0px 10px 55px;
		width: 50%;
		border: none;
		border-radius: 0px;
		font-size: 18px;
		font-family: Overpass;
		font-weight: 100;
	}

	.button_container {
		display: flex;
		justify-content: center;
		margin-top: 10px;

		:last-child {
			margin-left: 10px;
			opacity: 0.7;
		}

		button {
			border-radius: 6px;
			display: block;
			background: rgb(51, 182, 255);
			color: white;
			font-size: 18px;
			font-family: Overpass;
			padding: 6px 0px;
			height: 40px;
			width: 162px;
			border: none;

			&:hover {
				opacity: 0.6;
			}
		}
	}
}
</style>
