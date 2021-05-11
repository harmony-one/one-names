<template>
  <div class="nav">
    <div>
      <ul>
        <li>
          <a href="https://harmony.one" target="_blank">
            <img src="/images/harmony-logo-only.svg">
          </a>
        </li>
        <li>
          <a href="https://medium.com/harmony-one/harmony-community-launches-crazy-one-the-first-subdomain-nft-7db95bc53326" target="_blank">About</a>
        </li>
      </ul>
    </div>
    <div v-if="!loading && !noWallet">
      <div v-if="account" class="account">
        Connected: <span>{{ $utils.oneAddress(account) }}</span>
      </div>
      <div v-else>
        <button @click="$subdomain.connect()">
          Connect
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    account: {
      type: String,
      default: null
    },
    noWallet: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: relative;
  padding: 20px;
  display: flex;
  justify-content: space-between;

  .account {
    color: #fff;

    span {
      font-family: monospace;
    }
  }

  ul {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 0px;
    margin: 0px;
    list-style-type: none;

    li {
      padding-right: 30px;
    }
  }
  a, a:hover {
    color: #fff;
    text-decoration: none;
  }

  button {
    border-radius: 6px;
    display: block;
    color: white;
    font-size: 16px;
    font-family: Overpass;
    padding: 2px 0px;
    height: 30px;
    width: 162px;
    border: 1px solid #fff;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      opacity: 0.6;
    }
  }
}
</style>
