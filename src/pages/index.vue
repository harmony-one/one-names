<template>
  <section class="section">
		<topnav />

		<div class="container">
			<div class="inner_container">
				<div class="logo"><img src="/images/onenameslogo.svg" ></div>
				<div v-if="noWallet" class="loading">MetaMask wallet not installed 😔</div>
				<div v-if="loading" class="loading">Loading...</div>
				<div v-if="!loading && !noWallet">
					<div>
						<form @submit.prevent="searchName">
							<i class="fa fa-search icon"></i>
							<input v-model="search" class="search" placeholder="Search for a ONE name" spellcheck="false" />
							<button :disabled="searchDisabled || (search && search.length < 1)" type="submit">{{ searchText }}</button>
						</form>
					</div>

					<div class="priceContainer">
						<div v-if="hostname" class="hostname">{{ hostname }}</div>
						<price :characters="search.length" @price="priceChange" />
					</div>

					<div class="search_result_container">
						<div v-if="searchDisabled" class="search_result">Searching...</div>

						<div v-if="searchResult">
							<div v-if="searchResult[0] == ''">
								Sorry, {{ hostname }} is taken 😔 try another ONE!
							</div>
							<div v-else class="search_result">
								<div><span class="green">Congratulations!</span> {{ hostname }} is available.</div>
								<div class="register_container"><i class="fa fa-diamond"></i> <a href="" @click.prevent="registerDomain">Register for {{ price.toLocaleString() }} ONE</a> (1 Year)</div>
							</div>
						</div>
						<div v-if="registering" class="search_result">Registering. Please wait...</div>
						<div v-if="confirmation" class="confirmation_result">
							<div>Registered!</div>
							<div><span class="green">{{ safeHostname }}</span> is yours.</div>
							<div class="confirmation"><a :href="`https://explorer.pops.one/#/tx/${confirmation.tx}`" target="_blank">Confirmation</a></div>
						</div>
					</div>
				</div>
			</div>
		</div>
  </section>
</template>

<script>
import topnav from '~/components/topnav.vue'
import price from '~/components/price.vue'

export default {
	components: {
    topnav,
		price
  },
	data() {
		return {
			noWallet: false,
			loading: true,
			connected: false,
			searchDisabled: false,
			search: '',
			hostname: null,
			safeHostname: null,
			searchText: 'Search',
			connectButton: 'Connect',
			searchResult: null,
			price: 0,
			registering: false,
			confirmation: null
		}
	},
	watch: {
		search: function(val, oldVal) {
      if (val) {
				this.searchResult = null
				this.validateHostname()
			} else {
				this.hostname = null
			}
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		validateHostname() {
			let cleanHostname = this.search.replace(/[^a-z0-9-_]/gmi, '')
			this.search = cleanHostname
			this.hostname = `${cleanHostname}.crazy.one`
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
			this.searchText = 'Loading'
			this.searchDisabled = true
			this.searchResult = await this.$subdomain.checkDomain(this.search)
			this.searchText = 'Search'
			this.searchDisabled = false
		},
		async registerDomain() {
			this.safeHostname = this.hostname
			this.registering = true
			const response = await this.$subdomain.registerDomain(this.hostname)
			this.search = ''
			this.registering = false
			this.searchResult = false
			this.confirmation = response
		}
	}
}
</script>

<style lang="scss" scoped>
.loading {
	color: #fff;
	font-size: 20px;
}

.green {
	color: #31ee84;
}

.container {
	min-height: 100vh;
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

	.hostname {
		padding-right: 20px;
	}
}

.search_result_container {
	color: #fff;
	font-size: 20px;
	.search_result {
		display: flex;

		.register_container {
			margin-left: 20px;

			a {
				color: #fff;

				&:hover {
					opacity: 0.7;
				}
			}
		}
	}

	.confirmation_result {
		display: flex;
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
}
</style>
