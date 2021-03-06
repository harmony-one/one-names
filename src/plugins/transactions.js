const apiFactory = (app, $axios) => ({
  async list (params) {
    const response = await $axios.get('https://hmny-t.co/registrations', { params })
    return response
  },

  async stats () {
    const response = await $axios.get('https://hmny-t.co/stats')
    return response
  }
})

export default ({ app, $axios }, inject) => {
  const transactions = apiFactory(app, $axios)
  inject('transactions', transactions)
}
