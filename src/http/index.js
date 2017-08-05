import config from '../config'
import store from '../store'
import axios from 'axios'
import whitelist from './api-whitelist'
var ajax = axios.create({
  baseURL: config.host + config.serverRoot,
  timeout: 30000
})
import router from '@/router'
// Add a request interceptor
ajax.interceptors.request.use(function (config) {
  var path = config.url.replace(config.baseURL, '')
  var method = config.method
  var isWhite = false
  
  for (var i in whitelist) {
  	var n = whitelist[i];
  	if (path.startsWith(n.path)) {
    	if (n.method&&n.method.indexOf(method) == -1) {
    		isWhite = false
    	}else{
    		isWhite = true
    		break;
    	}
    }
  }
  if (!isWhite) {
    if (!store.state.token) {
      router.replace('/login')
      return config
    }
    config.headers['token'] = store.state.token || ''
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
ajax.interceptors.response.use(function (response) {
  if (response.data && response.data.status && response.data.status === 100) {
    router.replace('/login')
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export default ajax
