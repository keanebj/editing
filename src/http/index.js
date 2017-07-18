import env from '../config/env'
import store from '../store'
import axios from 'axios'
import whitelist from './api-whitelist'
const ajaxUrl = env === 'development' ? 'http://mp.dev.hubpd.com/' : env === 'production' ? 'http://mp.dev.hubpd.com/' : 'https://debug.url.com'
var ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})
// Add a request interceptor
ajax.interceptors.request.use(function (config) {
  var path = config.url.replace(config.baseURL, '')
  console.log('Request: ' + path)
  if (whitelist.indexOf(path) < 0) {
    if (!store.state.token) {
      window.location.href = '/login'
      // return config
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
  if (response.data && response.data.status && response.data.status === 2) {
    window.localhost.href = '/login'
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export default ajax
