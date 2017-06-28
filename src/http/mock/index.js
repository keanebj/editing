// app.get('/api/user', function (req, res) {
//   res.json(require('./user.json'))
// })

exports.path = '/api/user'
exports.type = 'get'
exports.export = function (req, res) {
  return {
    a: 1011
  }
}