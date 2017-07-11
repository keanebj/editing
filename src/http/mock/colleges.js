exports.path = '/api/colleges'
exports.type = 'get'
exports.export = function (req, res) {
  return {
    data: [
        {id:'010',title:'中央厨房号学院111。',dateTime:'2017-07-22 09:40',isReaded:true},
        {id:'011',title:'中央厨房号学院222。',dateTime:'2017-05-23 09:40',isReaded:true},
        {id:'012',title:'中央厨房号学院333。',dateTime:'2017-04-24 09:40',isReaded:true},
        {id:'013',title:'中央厨房号学院444。',dateTime:'2017-03-25 09:40',isReaded:true},
        {id:'014',title:'中央厨房号学院555。',dateTime:'2017-03-22 09:40',isReaded:true},
        {id:'015',title:'中央厨房号学院666。',dateTime:'2017-01-23 09:40',isReaded:true},
        {id:'016',title:'中央厨房号学院777。',dateTime:'2017-01-24 09:40',isReaded:false},
        {id:'017',title:'中央厨房号学院888。',dateTime:'2017-01-25 09:40',isReaded:false}
    
    ]
  }
}
