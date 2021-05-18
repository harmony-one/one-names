<template>
  <div class="main">
    <h2>Transactions</h2>
    <div>
      <span class="dark">{{ totalElements.toLocaleString() }}</span> registered. <span class="dark">$5,432</span> contributed to community DAO.
    </div>

    <div class="search">
      <form @submit.prevent="search">
        <i class="icon" />
        <input v-model="query" type="text" placeholder="Search for domain or owner address" spellcheck="false">
      </form>
    </div>

    <div v-if="transactions" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Domain</th>
            <th>Twitter</th>
            <th>Owner</th>
            <th>OwnerONE</th>
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
          <td>{{ row.owner }}</td>
          <td>{{ row.ownerONE }}</td>
          <td class="small">
            {{ row.price }}
          </td>
          <td class="small">
            {{ row.expires }}
          </td>
        </tr>
      </table>
      <div class="pagination">
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
      query: null
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    async list () {
      this.transactions = null
      this.transactions = await this.$transactions.list({ size: this.size, page: this.page })
      this.totalPages = this.transactions.data.totalPages
      this.totalElements = this.transactions.data.totalElements
    },
    goTo (pageLink) {
      this.page = pageLink - 1
      this.list()
    },
    search () {
      // TODO search
      console.log(this.query)
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

.search {
  width: 50%;

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
    margin-top: 60px;
    margin-left: 12px;
    width: 3px;
    height: 3px;
    background: url(/images/search.svg) no-repeat;
    background-size: contain;
  }

  input {
    font-family: 'Nunito', sans-serif !important;
    margin-top: 50px;
    font-size: 18px !important;
    padding: 10px 10px 10px 50px;
    width: 100%;
    border: 1px solid $blue;
    font-size: 18px;
    font-weight: 100;
  }
}

.table-container {
  margin: 20px 0;
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

  tr:nth-of-type(odd) {
    background: #eee;
  }
}

.pagination {
  margin-top: 10px;

  span {
    padding-right: 5px;
  }

  a {
    text-decoration: none;
    color: $blue;

    &:hover {
      color: $dark-blue;
    }
  }
}
</style>
