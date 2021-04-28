<template>
  <div v-if="characters">
    <span class="price">{{ ones.ones.toLocaleString() }} ONE ({{ ones.years }} {{ 'Year' | pluralize(ones.years) }})</span>
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
  data () {
    return {
      ones: { ones: 1, years: 1 }
    }
  },
  watch: {
    characters (val, oldVal) {
      this.calculatePrice(val)
      this.$emit('price', this.ones)
    }
  },
  methods: {
    calculatePrice (val) {
      this.ones = this.$utils.priceCalculator(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.price {
  color: #31ee84;
}
</style>
