import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import util from '../utils'
import routers from './routers'
import store from '../store'
import config from '../config'
Vue.use(Router)
const RouterConfig = {
  mode: 'history',
  base: config.root,
  routes: routers
}
const router = new Router(RouterConfig)
var currentRouter = null
router.toReferrer = function () {
  if (!currentRouter) router.push({path: '/'})
  else router.push({path: currentRouter})
}
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    util.title(to.meta.title)
    if (to.name !== 'login') {
      currentRouter = to.path
    }
    next()
})
router.afterEach(() => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
  var currentRoutePath = router.currentRoute.path
  store.commit('breadcrumb', currentRoutePath)
  store.commit('menu', router.currentRoute)
})
export default router
