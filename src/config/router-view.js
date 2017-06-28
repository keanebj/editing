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
    path: '/register',
    title: '注册'
  }, {
    path: '/home',
    title: '主页'
  }, {
    path: '/release/article',
    title: '内容发布'
  }, {
    path: '/release/image',
    title: '图片发布'
  }, {
    path: '/release/video',
    title: '视频发布'
  }, {
    title: '我发表的',
    path: '/cms/me'
  }, {
    title: '自动同步',
    path: '/cms/auto'
  }, {
    title: '原创内容',
    path: '/cms/original'
  }, {
    title: '内容接入',
    path: '/content/import'
  }, {
    title: '内容输出',
    path: '/content/export'
  }, {
    title: '图片管理',
    path: '/source/image'
  }, {
    title: '视频管理',
    path: '/source/video'
  }]
}]

