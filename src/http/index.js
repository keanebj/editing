import env from '../config/env'
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)
//const ajaxUrl = env === 'development' ? 'http://127.0.0.1:8080' : env === 'production' ? 'https://www.url.com' : 'https://debug.url.com'
const ajaxUrl = env === 'development' ? 'http://localhost:8080' : env === 'production' ? 'http://mp.dev.hubpd.com/api/' : 'https://debug.url.com'
Vue.http.options.root = ajaxUrl
Vue.http.options.emulateJSON = true