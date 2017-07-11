exports.path = '/api/adList'
exports.type = 'get'
exports.export = function (req, res) {
  return {
    data: [
        {id:'001',url:'../../assets/ad.png'},  
        {id:'002',url:'../../assets/ad.png'},
        {id:'003',url:'../../assets/ad.png'},
        {id:'004',url:'../../assets/ad.png'}
    ]
  }
}
