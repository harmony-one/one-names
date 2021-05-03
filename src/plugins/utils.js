import { getAddress } from '@harmony-js/crypto'

const utilsFactory = app => ({
  oneAddress (address) {
    return getAddress(address).bech32
  },
  priceCalculator (subdomainLength) {
    switch (parseInt(subdomainLength)) {
      case 0:
        return 1
      case 1:
        return 1000000000
      case 2:
        return 100000000
      case 3:
        return 10000000
      case 4:
        return 1000000
      case 5:
        return 100000
      case 6:
        return 10000
      case 7:
        return 1000
      case 8:
        return 100
      case 9:
        return 10
      case 10:
        return 1
      default:
        return 1
    }
  }
})

export default ({ app }, inject) => {
  const utils = utilsFactory(app)
  inject('utils', utils)
}