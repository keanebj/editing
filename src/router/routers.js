export default [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: 'login'
    },
    component: require('@/view/login/index.vue')
  },
  {
    name: 'main',
    path: '/',
    meta: {
      title: '首页'
    },
    component: require('@/view/index.vue'),
    children: [
      {
        name: 'home',
        path: '/home',
        meta: {
          title: '首页'
        },
        component: require('@/view/home/index.vue')
      },
      {
        name: 'publish',
        path: '/publish',
        meta: {
          title: '发表'
        },
        component: require('@/view/publish/index.vue')
      },
      {
        name: 'manageContent',
        path: '/manage/content',
        meta: {
          title: '内容管理'
        },
        component: require('@/view/manage/content/index.vue')
      },
      {
        name: 'manageStudio',
        path: '/manage/studio',
        meta: {
          title: '工作室管理'
        },
        component: require('@/view/manage/studio/index.vue')
      },
      {
        name: 'manageStudioSingle',
        path: '/manage/studio/:id',
        meta: {
          title: '工作室管理编辑'
        },
        component: require('@/view/manage/studio/single/index.vue')
      },
      {
        name: 'manageAd',
        path: '/manage/ad',
        meta: {
          title: '广告管理'
        },
        component: require('@/view/manage/ad/index.vue')
      },
      {
        name: 'settingsAccount',
        path: 'settings/account',
        meta: {
          title: '账号信息'
        },
        component: require('@/view/settings/account/index.vue')
      },
    ]
  }
]
