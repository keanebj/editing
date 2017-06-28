app.get('/api/user', function (req, res) {
  res.json(require('./user.json'))
})