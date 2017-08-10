export default [{
    name: 'login',
    path: '/login',
    meta: {
      title: '自媒体编辑系统-登录'
    },
    component: () => import('@/view/login/index.vue')
  },
  {
    name: 'publish',
    path: '/publish',
    meta: {
      title: '发表'
    },
    component: () => import('@/view/publish/index.vue')
   },
  {
    name: 'main',
    path: '/',
    meta: {
      title: '自媒体编辑系统'
    },
    component: () => import('@/view/index.vue'),
    children: [{
        name: 'home',
        path: '',
        meta: {
          title: '自媒体编辑系统'
        },
        component: () => import('@/view/home/index.vue')
      },
      {
        name: 'manageContent',
        path: '/manage/content',
        meta: {
          title: '内容管理'
        },
        component: () => import('@/view/manage/content/index.vue')
      },
      {
        name: 'manageStudio',
        path: '/manage/studio',
        meta: {
          title: '工作室管理'
        },
        component: () => import('@/view/manage/studio/index.vue')
      },
      {
        name: 'manageStudioSingle',
        path: '/manage/studio/:id',
        meta: {
          title: '工作室管理编辑'
        },
        component: () => import('@/view/manage/studio/single/index.vue')
      },
      {
        name: 'manageAd',
        path: '/manage/ad',
        meta: {
          title: '广告管理'
        },
        component: () => import('@/view/manage/ad/index.vue')
      },
      {
        name: 'settingsAccount',
        path: 'settings/account',
        meta: {
          title: '账号信息'
        },
        component: () => import('@/view/settings/account/index.vue')
      },
      {
        name: 'notice',
        path: '/notice',
        meta: {
          title: '公告',
        },
        component: () => import('@/view/notice/index.vue'),
      },
      {
        name: 'article',
        path: '/article',
        meta: {
          title: '文章',
        },
        component: () => import('@/view/article/index.vue'),
      }
    ]
  },
  {
    name: 'share',
    path: '/share',
    meta: {
      title: '分享',
    },
    component: () => import('@/view/share/index.vue'),
  },
  {
    name: '404',
    path: '*',
    meta: {
      title: '404'
    },
    component: () => import('@/view/404/index.vue')
  }
]
