<template>
  <section class="section">
		<!-- <div class="nav">
			<ul>
				<li>
					<img src="https://assets.website-files.com/5ea98076e2f684f39f95888f/5ea98076e2f684fdc09588b9_harmony_logo.svg">
				</li>
				<li>
					<a href="https://onenames.gitbook.io/onenames/" target="_blank">About</a>
				</li>
				<li>
					<a href="https://onenames.gitbook.io/onenames/faq" target="_blank">FAQ</a>
				</li>
			</ul>
		</div> -->

		<div class="container">
			<div class="inner_container">
				<div class="logo"><img src="/images/onenameslogo.svg" ></div>
				<div v-if="loading" class="loading">Loading...</div>
				<div v-else>
					<div>
						<form @submit.prevent="searchName">
							<i class="fa fa-search icon"></i>
							<input v-model="search" class="search" placeholder="Search for a ONE name" spellcheck="false" />
							<button :disabled="search && search.length < 1" type="submit">Search</button>
						</form>
					</div>
					<div class="priceContainer">
						<div v-if="hostname" class="hostname">{{ hostname }}</div>
						<price :characters="search.length" />
					</div>
				</div>
			</div>
		</div>
  </section>
</template>

<script>
import price from '~/components/price.vue'

export default {
	components: {
    price
  },
	data() {
		return {
			loading: true,
			connected: false,
			search: '',
			hostname: null,
			connectButton: 'Connect'
		}
	},
	watch: {
		search: function(val, oldVal) {
      if (val) {
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
		async connect() {
			const wallet = await this.$store.dispatch('subdomain/connect')
			console.log(wallet)
			if (wallet) {
				this.connected = true
				this.connectButton = wallet
			}
		},
		async init() {
			this.loading = true
			await this.$subdomain.init()
			this.loading = false
		},
		async checkDomain() {
			const response = await this.$subdomain.checkDomain()
			console.log(response)
		},
		searchName() {
			console.log(this.search)
		},
		async registerDomain() {
			const response = await this.$subdomain.registerDomain(subdomain)
			console.log(response)
		}
	}
}
</script>

<style lang="scss" scoped>
.loading {
	color: #fff;
	font-size: 20px;
}

.container {
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
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
	min-height: 100px;
	color: #fff;
	font-size: 20px;
	display: flex;

	.hostname {
		padding-right: 20px;
	}
}
</style>
