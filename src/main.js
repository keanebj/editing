// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'blueimp-canvas-to-blob'
import Vue from 'vue'
import router from './router'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'font-awesome/css/font-awesome.css'
import './assets/iviewTheme/index.less'
import './assets/style.css'

Vue.use(iView)
Vue.config.productionTip = false
import http from './http'
Vue.prototype.$http = http
import './directive'
import './filtres'
import config from './config'
Vue.prototype.$conf = config
/* eslint-disable no-new */
import app from './app'
new Vue({
  el: '#app',
  router,
  store,
  template: '<app/>',
  components: { app }
})
