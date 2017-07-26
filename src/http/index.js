import config from '../config'
import store from '../store'
import axios from 'axios'
import whitelist from './api-whitelist'
var ajax = axios.create({
  baseURL: config.host,
  timeout: 30000
})
// Add a request interceptor
ajax.interceptors.request.use(function (config) {
  var path = config.url.replace(config.baseURL, '')
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
  if (response.data && response.data.status && response.data.status === 100) {
    window.location.href = '/login'
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export default ajax
