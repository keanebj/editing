export default [{
  name: '内容发布',
  children: [{
    name: '文章发布',
    path: '/release/article'
  }, {
    name: '组图发布',
    path: '/release/image'
  }, {
    name: '组图发布',
    path: '/release/video'
  }]
}, {
  name: '内容管理',
  children: [{
    name: '我发表的',
    path: '/cms/me'
  }, {
    name: '自动同步',
    path: '/cms/auto'
  }, {
    name: '原创内容',
    path: '/cms/original'
  }]
}, {
  name: '渠道管理',
  children: [{
    name: '内容接入',
    path: '/content/import'
  }, {
    name: '内容输出',
    path: '/content/export'
  }]
}, {
  name: '素材管理',
  children: [{
    name: '图片管理',
    path: '/source/image'
  }, {
    name: '视频管理',
    path: '/source/video'
  }]
}, {
  name: '直播间'
}, {
  name: '粉丝'
}, {
  name: '问答系统'
}, {
  name: '数据管理'
}, {
  name: '账号管理'
}]