<template>
  <div class="main">
    <h2>Transactions</h2>
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
      size: 20,
      page: 0
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
    },
    previous () {
      this.page = this.page - 1
      this.list()
    },
    next () {
      this.page = this.page + 1
      this.list()
    },
    goTo (pageLink) {
      this.page = pageLink - 1
      this.list()
    }
  }
}
</script>

<style lang="scss">
$blue: #00b0ef;

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
    color: #1B295E;

    &:hover {
      opacity: 0.5;
    }
  }
}
</style>
