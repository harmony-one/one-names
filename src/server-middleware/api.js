const app = require('express')()

app.all('/dns', (req, res) => {
  res.json({ data: 'data' })
})

module.exports = app
