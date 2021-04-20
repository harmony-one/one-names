<template>
  <section class="container">
    <h1>OneNames</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div>
        <button :disabled="connected" @click="connect()">
          {{ connectButton }}
        </button>
        <button @click="checkDomain()">
          Check givgivgiv.crazy-test.one
        </button>
        <button @click="registerDomain()">
          Register givgivgiv.crazy-test.one
        </button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			connected: false,
			connectButton: 'Connect'
		}
	},
	mounted() {
		this.init()
	},
	methods: {
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
			await this.$store.dispatch('subdomain/init')
			this.loading = false
		},
		async checkDomain() {
			const response = await this.$store.dispatch('subdomain/checkDomain')
			console.log(response)
		},
		async registerDomain() {
			const response = await this.$store.dispatch('subdomain/registerDomain')
			console.log(response)
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
}
</style>
