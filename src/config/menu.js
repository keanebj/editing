export default [{
  name: '首页',
  path: '/home',
  icon: 'ios-home-outline',
  authority:'Manage Edit'
}, {
  name: '发表',
  path: '/publish',
  icon: 'edit',
  authority:'Manage Edit'
}, {
  name: '管理',
  icon: 'ios-paper-outline',
  authority:'Manage Edit',
  children: [{
    name: '内容管理',
    path: '/manage/content',
    authority:'Manage Edit'
  }, {
    name: '工作室管理',
    path: '/manage/studio',
    match: ['manageStudioSingle'], // 如匹配路由name也可激活<Menu:activeName>
    authority:'Manage'
  }, {
    name: '广告管理',
    path: '/manage/ad',
    authority:'Manage'
  }]
}, {
  name: '设置',
  icon: 'ios-gear-outline',
  authority:'Manage Edit',
  children: [{
    name: '账号信息',
    path: '/settings/account',
    authority:'Manage Edit'
  }]
}]