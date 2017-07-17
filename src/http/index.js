import axios from 'axios'
import env from '../config/env'
import store from '../store'
//const ajaxUrl = env === 'development' ? 'http://127.0.0.1:8080' : env === 'production' ? 'https://www.url.com' : 'https://debug.url.com'
const ajaxUrl = env === 'development' ? 'http://mp.dev.hubpd.com/' : env === 'production' ? 'http://mp.dev.hubpd.com/' : 'https://debug.url.com'
var ajax = axios.create({
  baseURL: ajaxUrl,
  timeout: 30000
})
// Add a request interceptor
ajax.interceptors.request.use(function (config) {
  config.headers['token'] = store.state.token
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
export default ajax