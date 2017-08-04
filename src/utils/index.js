let util = {}
util.title = function (title) {
  title = title ? title + '' : 'iView project'
  window.document.title = title
}
util.base64 = import('./base64.js')
export default util
