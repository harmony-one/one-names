<template>
  <div v-if="characters">
    <span class="price">{{ ones.toLocaleString() }} ONE (1 Year)</span>
  </div>
</template>

<script>
export default {
  props: {
    characters: {
      type: Number,
      default: null
    }
  },
  data() {
		return {
			ones: 0
		}
	},
  watch: {
		characters: function(val, oldVal) {
      this.calculatePrice(val)
      this.$emit('price', this.ones)
		}
	},
  methods: {
    calculatePrice(val) {
      switch(parseInt(val)) {
      case 0:
        this.ones = 0
        break;
      case 1:
        this.ones = 1000000000
        break
      case 2:
        this.ones = 100000000
        break
      case 3:
        this.ones = 10000000
        break
      case 4:
        this.ones = 1000000
        break
      case 5:
        this.ones = 100000
        break
      case 6:
        this.ones = 10000
        break
      case 7:
        this.ones = 1000
        break
      case 8:
        this.ones = 100
        break
      case 9:
        this.ones = 10
        break
      case 10:
        this.ones = 1
        break
      default:
        this.one = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.price {
  color: #31ee84;
}
</style>
