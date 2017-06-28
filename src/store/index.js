import Vue from 'vue'
import Vuex from 'vuex'
import menu from '../config/menu'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    menu: menu,
    breadcrumb: []
  },
  getters: {
  },
  mutations: {
    breadcrumb (state, path) {
      var result = []
      recursive('path', path, state.menu, 0, result)
      state.breadcrumb = result
    },
    set (state, data) {
      Object.assign(state, data)
    }
  },
  actions: {
  }
})
function recursive (key, val, data, index, result) {
  for (var i = 0, l = data.length; i < l; i++) {
    var e = data[i]
    if (e[key] && val === e[key]) {
      result[index] = e
      return true
    } else if (e.children) {
      var re = recursive(key, val, e.children, index + 1, result)
      if (re) {
        result[index] = e
        return true
      }
    }
  }
  return false
}
export default store
