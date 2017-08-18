export default [{
  name: '首页',
  path: '/',
  icon: 'ios-home-outline',
  authority: 'Manage Edit'
}, {
  name: '发表',
  path: '/publish',
  icon: 'ios-compose-outline',
  authority: 'Manage Edit'
}, {
  name: '管理',
  icon: 'ios-paper-outline',
  authority: 'Manage Edit',
  children: [{
      name: '公告管理',
      path: '/manage/announcement',
      authority: 'Manage'
    },
    {
      name: '内容管理',
      path: '/manage/content',
      authority: 'Edit'
    }, {
      name: '融合号管理',
      path: '/manage/studio',
      match: ['manageStudioSingle'], // 如匹配路由name也可激活<Menu:activeName>
      authority: 'Manage'
    }, {
      name: '广告管理',
      path: '/manage/ad',
      authority: 'Manage'
    }, {
      name: '内容审核',
      path: '/manage/contentaudit',
      authority: 'Manage'
    }, {
	    name: '素材管理',
	    path: '/manage/material',
	    match: ['SourceMaterialEnter'],
	    authority:'Edit'
	  }
  ]
}, {
  name: '设置',
  icon: 'ios-gear-outline',
  authority: 'Manage Edit',
  children: [{
    name: '账号信息',
    path: '/settings/account',
    authority: 'Manage Edit'
  }]
}]
