<template>
  <div class="main">
    <h2>Transactions</h2>
    <div v-if="totalRegistered > 0">
      <span class="dark">{{ totalRegistered.toLocaleString() }}</span> registered. <span class="dark">{{ totalFundsRaised.toLocaleString() }}</span> ONEs contributed to community DAO.
    </div>

    <div class="search">
      <form @submit.prevent="list(true)">
        <div class="search-container">
          <i class="icon" />
          <input id="search" v-model="search" type="search" placeholder="Search for domain or owner address" spellcheck="false">
          <button type="submit">
            Search
          </button>
        </div>
      </form>
    </div>

    <div v-if="transactions && transactions.data && transactions.data.content.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Twitter</th>
            <th>Owner</th>
            <th>Price</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tr v-for="(row, index) in transactions.data.content" :key="index">
          <td class="small">
            {{ row.domain }}
          </td>
          <td class="small">
            {{ row.twitter }}
          </td>
          <td>
            <div>
              <a :href="`https://explorer.harmony.one/#/address/${row.owner}`" target="_blank">{{ row.owner }}</a>
            </div>
            <div>
              <a :href="`https://explorer.harmony.one/#/address/${row.ownerONE}`" target="_blank">{{ row.ownerONE }}</a>
            </div>
          </td>
          <td class="small">
            {{ row.price }}
          </td>
          <td class="small">
            {{ row.expires }}
          </td>
        </tr>
      </table>
      <div class="transaction-count">
        {{ totalElements.toLocaleString() }} {{ 'transaction' | pluralize(totalElements) }} found
      </div>
      <div v-if="totalPages > 1" class="pagination">
        <span v-for="(pageLink, index) in totalPages" :key="index">
          <span v-if="pageLink == (page + 1)">
            <strong>{{ pageLink }}</strong>
          </span>
          <span v-else>
            <a href="" @click.prevent="goTo(pageLink)">
              {{ pageLink }}
            </a>
          </span>
        </span>
      </div>
    </div>
    <div v-if="search && transactions && transactions.data && transactions.data.content.length < 1" class="no-results">
      No transactions found.
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      transactions: null,
      totalPages: 0,
      totalElements: 0,
      size: 20,
      page: 0,
      totalRegistered: 0,
      totalFundsRaised: 0,
      search: null
    }
  },
  head () {
    return {
      title: 'Transactions | Crazy.ONE'
    }
  },
  mounted () {
    const vm = this
    document.querySelector('#search').addEventListener('search', function () {
      if (!vm.search) {
        vm.clear()
      }
    })
    this.list(false)
    this.stats()
  },
  methods: {
    clear () {
      this.list(true)
    },
    async list (newSearch) {
      if (newSearch) {
        this.page = 0
      }

      const params = { size: this.size, page: this.page }

      if (this.search) {
        params.search = this.search
      }

      this.transactions = null
      this.transactions = await this.$transactions.list(params)
      this.totalPages = this.transactions.data.totalPages
      this.totalElements = this.transactions.data.totalElements
    },
    async stats () {
      const response = await this.$transactions.stats()
      this.totalRegistered = response.data.totalRegistered
      this.totalFundsRaised = response.data.totalFundsRaised
    },
    goTo (pageLink) {
      this.page = pageLink - 1
      this.list(false)
    }
  }
}
</script>

<style lang="scss">
$blue: #00b0ef;
$dark-blue: #1B295E;

body {
  background-color: #fff;
}

.main {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
}

.dark {
  font-weight: bold;
  color: $dark-blue;
}

.transaction-count {
  margin-top: 5px;
  font-weight: bold;
}

.no-results {
  margin-top: 20px;
  font-weight: bold;
}

.search-container {
  display: flex;
  align-items: center;
  margin-top: 50px;
}

.search {
  width: 50%;

  ::placeholder {
    color: #ccc;
  }

  button {
    border-radius: 0px 6px 6px 0px;
    display: block;
    background: $dark-blue;
    color: white;
    height: 46px;
    width: 162px;
    border: none;
    cursor: pointer;
  }

  .icon {
    position: absolute;
    padding: 10px;
    margin-left: 12px;
    width: 3px;
    height: 3px;
    background: url(/images/search.svg) no-repeat;
    background-size: contain;
  }

  input {
    font-family: 'Nunito', sans-serif !important;
    font-size: 18px !important;
    padding: 10px 10px 10px 50px;
    width: 95%;
    border: 1px solid $blue;
    border-right: 0;
    font-size: 18px;
    font-weight: 100;
  }
}

.table-container {
  margin: 20px 0;
  width: 100%;
}

table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  border: 1px solid #ccc;

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;

    th {
      color: #fff;
      line-height: 1.4;
      background-color: $blue;
      padding-top: 18px;
      padding-bottom: 18px;
      border: 1px solid #fff;
    }
  }

  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;

    td {
      padding: 10px;
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.small {
        max-width: 10px;
      }
    }
  }

  // tr:nth-of-type(odd) {
  //   background: #eee;
  // }
}

.pagination {
  margin-top: 10px;

  span {
    padding-right: 5px;
  }
}

a {
  text-decoration: none;
  color: $dark-blue;

  &:hover {
    color: $blue;
  }
}
</style>
