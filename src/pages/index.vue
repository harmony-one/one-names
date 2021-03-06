<template>
  <section class="section">
    <topnav :account="account" :no-wallet="noWallet" :loading="loading" />
    <div class="container">
      <div class="inner_container">
        <div class="logo">
          <img src="/images/crazyone-logo3.svg">
        </div>
        <div>
          <div>
            <form @submit.prevent="searchName">
              <i class="icon" />
              <input v-model="search" class="search" placeholder="Search for a Crazy.ONE name" spellcheck="false">
              <button :disabled="searchDisabled || (search && search.length < 1)" type="submit">
                {{ searchText }}
              </button>
            </form>
          </div>

          <div class="priceContainer">
            <div v-if="hostname" class="hostname">
              {{ hostname }}
            </div>
          </div>

          <div class="search_result_container">
            <div v-if="searchDisabled" class="search_result">
              Searching <PulseLoader size="8px" color="#69FABD" />
            </div>

            <div v-if="searchResult">
              <div v-if="Number(searchResult.subdomainAddress) !== 0">
                Sorry, <span class="green">{{ hostname }}</span> is taken<pre>Owner: {{ $utils.oneAddress(searchResult.subdomainAddress) }}</pre>
              </div>
              <div v-else class="search_result">
                <div><span class="green">{{ hostname }}</span> is available.</div>
                <div v-if="account" class="register_container">
                  <button v-if="!registering" @click.prevent="getTwitter">
                    Register for {{ priceFormat(searchResult.price) }} ONE
                  </button>
                </div>
                <div v-else class="register_container">
                  <button @click="connect()">
                    Connect
                  </button>
                </div>
              </div>
            </div>
            <div v-if="registering" class="search_result">
              Registering. Please wait <PulseLoader size="8px" color="#69FABD" />
            </div>
            <div v-if="confirmation" class="confirmation_result">
              <div>Subdomain <span class="green">{{ safeHostname }}</span> registered on Harmony</div>
              <div><span>Linked to: {{ $utils.oneAddress(account) }}</span></div>
            </div>
            <div v-if="confirmation" class="confirmation">
              <a :href="`https://explorer.harmony.one/#/tx/${confirmation.transactionHash}`" target="_blank">Confirmation</a>
            </div>

            <div class="dnsRegistration">
              <div v-if="dnsRegistering">
                Setting up your custom url {{ safeHostname }} <PulseLoader size="8px" color="#69FABD" />
              </div>
              <div v-if="dnsRegistered" class="confirmation_result">
                <a :href="`https://${safeHostname}`" target="_blank">{{ safeHostname }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal name="twitter-modal" :click-to-close="false" :focus-trap="true">
        <div class="twitter_modal">
          <div class="twitter_info">
            Do you want to link this registration to your Twitter profile?
          </div>
          <i class="twitter-icon" />
          <input v-model="twitter" type="text" placeholder="Twitter username" spellcheck="false">
          <div class="button_container">
            <button @click="register(true)">
              <i class="fa fa-check" /> Yes, link it
            </button>
            <button @click="register(false)">
              No, thank you
            </button>
          </div>
        </div>
      </modal>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VModal from 'vue-js-modal'
import topnav from '~/components/topnav.vue'

const punycode = require('punycode/')
const isValidHostname = require('is-valid-hostname')
Vue.use(VModal)

export default {
  components: {
    topnav,
    PulseLoader
  },
  data () {
    return {
      account: null,
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
      confirmation: null,
      twitter: null,
      dnsRegistering: false,
      dnsRegistered: false
    }
  },
  watch: {
    search (val, oldVal) {
      if (val) {
        this.search = val.replace('.', '')
        this.searchResult = null
        this.confirmation = null
        this.dnsRegistering = false
        this.dnsRegistered = false
        this.validateHostname()
      } else {
        this.hostname = null
      }
    },
    twitter (val, oldVal) {
      if (val) {
        this.twitter = val.replace('@', '')
      }
    }
  },
  mounted () {
    this.init()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts && accounts.length) {
          this.account = accounts[0]
        } else {
          this.account = null
        }
      })
    }
  },
  methods: {
    priceFormat (price) {
      return Math.round(Number(price) / 1e18).toLocaleString()
    },
    async connect () {
      const accounts = await this.$subdomain.connect()

      if (accounts && accounts.length) {
        this.account = accounts[0]
      }
    },
    validateHostname () {
      this.hostname = `${this.search}.crazy.one`
    },
    priceChange (val) {
      this.price = val
    },
    async init () {
      if (window.ethereum) {
        this.loading = true
        const accounts = await this.$subdomain.init()
        this.loading = false

        if (accounts && accounts.length) {
          this.account = accounts[0]
        }
      } else {
        this.noWallet = true
        this.loading = false
      }
    },
    async searchName () {
      if (!isValidHostname(punycode.toASCII(this.search))) {
        this.$toast.error('Invalid hostname. Please check format.', { duration: 5000 })
        return
      }
      this.confirmation = null
      this.searchText = 'Loading'
      this.searchDisabled = true
      this.searchResult = await this.$subdomain.checkDomain(this.search)
      this.searchText = 'Search'
      this.searchDisabled = false
    },
    getTwitter () {
      this.$modal.show('twitter-modal')
    },
    async register (useTwitter) {
      if (useTwitter) {
        if (!this.twitter) {
          console.log('Twitter handle is empty')
          return
        }
      }

      this.$modal.hide('twitter-modal')

      this.safeHostname = this.hostname
      this.registering = true

      const response = await this.$subdomain.register(this.search, this.twitter)
      this.search = ''
      this.registering = false
      this.searchResult = false
      this.confirmation = response

      // now do DNS
      this.addDns()
    },
    async addDns () {
      this.dnsRegistering = true
      await this.$subdomain.updateDns(this.confirmation.transactionHash)

      // add some delay until DNS resolves
      setTimeout(() => {
        this.dnsRegistering = false
        this.dnsRegistered = true
      }, 5000)
    }
  }
}
</script>

<style lang="scss">
body {
  background-color: #00b0ef;
}
</style>

<style lang="scss" scoped>
$break-small: 800px;

$green: #69FABD;
$red: red;
$button: #1B295E;

.loading {
  color: #fff;
  font-size: 20px;
}

.green {
  color: $green;
  font-weight: 600;
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
  margin-top: 85px;
  text-align: center;
}

.inner_container {
  min-width: 60%;
  min-height: 200px;

  @media screen and (max-width: $break-small) {
    min-width: 90%;
  }

  .logo {
    margin-bottom: 50px;
    height: 74px;

    @media screen and (max-width: $break-small) {
      margin-bottom: 0;
    }

    img {
      width: 323px;

      @media screen and (max-width: $break-small) {
        width: 200px;
      }
    }
  }
}

form {
  display: flex;

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
    margin-top: 30px;
    margin-left: 15px;
    width: 27px;
    height: 27px;
    background: url(/images/search.svg) no-repeat;

    @media screen and (max-width: $break-small) {
      display: none;
    }
  }

  button {
    border-radius: 0px 6px 6px 0px;
    display: block;
    background: $button;
    color: white;
    font-size: 22px;
    padding: 20px 0px;
    height: 90px;
    width: 162px;
    border: none;

    @media screen and (max-width: $break-small) {
      height: 50px;
      padding: 10px 0px;
      font-size: 18px;
    }

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
  font-weight: 100 !important;
  font-family: 'Nunito', sans-serif !important;

  @media screen and (max-width: $break-small) {
    font-size: 14px !important;
    padding: 5px 10px;
    height: 40px;
    width: 100%;
  }
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
        background: $button;
        color: white;
        font-size: 18px;
        padding: 6px 20px;
        height: 40px;
        width: auto;
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

  pre {
    font-size: 14px;
  }

  .confirmation_result {
    justify-content: center;
    div {
      margin-right: 10px;
    }

    a {
      color: $green;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  .dnsRegistration {
    margin-top: 20px;
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

  .twitter_info {
    margin-top: 20px;
  }

  .twitter-icon {
    padding: 10px;
    margin-top: 58px;
    position: absolute;
    margin-left: 15px !important;
    width: 27px;
    height: 27px;
    filter: invert(50%) sepia(83%) saturate(1482%) hue-rotate(178deg) brightness(96%) contrast(104%);
    background: url(/images/twitter.svg) no-repeat;
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
      background: $button;
      color: white;
      font-size: 18px;
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
