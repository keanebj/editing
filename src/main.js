// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'blueimp-canvas-to-blob'
import Vue from 'vue'
import router from './router'
import store from './store'
import iView from 'iview'
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

//自定义指令--音频播放
Vue.directive('my-directive', {
  bind: function () {
    alert(34234234);
    // 做绑定的准备工作
    // 比如添加事件监听器，或是其他只需要执行一次的复杂操作
  },
  update: function (newValue, oldValue) {
    // 根据获得的新值执行对应的更新
    // 对于初始值也会被调用一次
  },
  unbind: function () {
    // 做清理工作
    // 比如移除在 bind() 中添加的事件监听器
  }
})

