const utilsFactory = app => ({
  priceCalculator (subdomainLength) {
    switch (parseInt(subdomainLength)) {
      case 0:
        return { ones: 1, years: 1 }
      case 1:
        return { ones: 1000000000, years: 3 }
      case 2:
        return { ones: 100000000, years: 3 }
      case 3:
        return { ones: 10000000, years: 3 }
      case 4:
        return { ones: 1000000, years: 3 }
      case 5:
        return { ones: 100000, years: 1 }
      case 6:
        return { ones: 10000, years: 1 }
      case 7:
        return { ones: 1000, years: 1 }
      case 8:
        return { ones: 100, years: 1 }
      case 9:
        return { ones: 10, years: 1 }
      case 10:
        return { ones: 1, years: 1 }
      default:
        return { ones: 1, years: 1 }
    }
  }
})

export default ({ app }, inject) => {
  const utils = utilsFactory(app)
  inject('utils', utils)
}