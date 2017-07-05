/**
 * 当该文件修改后将重新执行/build/entry.js文件
 */

module.exports = [{
  path: '/login',
  title: 'login'
}, {
  path: '/',
  title: '首页',
  children: [{
    path: '/home',
    title: '首页'
  }, {
    path: '/publish',
    title: '发表'
  }, {
    path: '/manage/content',
    title: '内容管理'
  }, {
    path: '/manage/studio',
    title: '工作室管理'
  }, {
    path: '/manage/ad',
    title: '广告管理'
  }, {
    path: 'settings/account',
    title: '账号信息'
  }]
}]

