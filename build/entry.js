
var chokidar = require('chokidar')
var fs = require('fs')
var path = require("path")
var fileWatch = './src/config/router-view.js'
var Handlebars = require('handlebars')
var fileWrite = './src/router/routers.js'
chokidar.watch(fileWatch).on('change', function () {
  var pwd = path.join(__dirname, '..', fileWatch)
  delete require.cache[pwd]
  var config = require('.' + fileWatch)
  var temp = eachItems(config)
  temp = 'export default ' + temp
  writeFile(fileWrite, temp)
})
function eachItems(data, path = '') {
  var temp = ''
  temp += '[\n'
  data.forEach(function (item, i) {
    var componentPath = parsePath(item.path)
    temp += '{\n'
    temp += '  path: \'' + item.path + '\',\n'
    temp += '  meta: {\n'
    temp += '    title: \'' + item.title + '\'\n'
    temp += '  },\n'
    temp += '  component: require(\'' + componentPath + '\'),\n'
    if (item.children) {
      temp += '  children:' + eachItems(item.children) + '\n'
    }
    temp += '},\n'
  })
  temp += ']\n'
  return temp
}
function parsePath(path) {
  var pathArrTmp = path.split('/')
  var pathArr = []
  pathArrTmp.forEach(function (n, i) {
    if (n) pathArr.push(n)
  })
  var name = pathArr.join('/')
  path = name ? name + '/' : ''
  var viewPath = './src/view/' + path
  var componentPath = '@/view/' + path + 'index.vue'
  if (fs.existsSync(viewPath)) return componentPath
  mkdirsSync(viewPath)
  copyViewHtml(name)
  copyViewJs(name)
  fs.writeFile('./src/view/' + path + '/index.css', fs.readFileSync("./build/template/view/index.css"))
  fs.writeFile('./src/view/' + path + '/index.vue', fs.readFileSync("./build/template/view/index.vue"))
  return componentPath
}
function writeFile(file, data) {
  fs.writeFile(file, data, function (err) {
    if (err)
      console.log("fail " + err);
    else
      console.log("写入文件ok");
  });
}

function copyViewHtml(path) {
  fs.readFile("./build/template/view/index.html", 'utf-8', function (err, source) {
    var template = Handlebars.compile(source)
    var result = template({ name: path })
    fs.writeFile('./src/view/' + path + '/index.html', result)
  })
}
function copyViewJs(path) {
  fs.readFile("./build/template/view/index.js", 'utf-8', function (err, source) {
    var template = Handlebars.compile(source)
    var result = template({
      name: path.split('/').map(e => {
        if (!e) return ''
        else return e[0].toUpperCase() + e.substring(1, e.length)
      }).join('')
    })
    fs.writeFile('./src/view/' + path + '/index.js', result)
  })
}

//递归创建目录 异步方法
function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      //console.log(path.dirname(dirname));
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
}

//递归创建目录 同步方法
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}
