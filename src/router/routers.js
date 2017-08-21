export default [{
    name: 'login',
    path: '/login',
    meta: {
      title: '登录-全国党媒融合号'
    },
    component: () => import('@/view/login/index.vue')
  },
  {
    name: 'publish',
    path: '/publish',
    meta: {
      title: '发表-全国党媒融合号'
    },
    component: () => import('@/view/publish/index.vue')
   },
  {
    name: 'main',
    path: '/',
    meta: {
      title: '全国党媒融合号'
    },
    component: () => import('@/view/index.vue'),
    children: [{
        name: 'home',
        path: '',
        meta: {
          title: '全国党媒融合号'
        },
        component: () => import('@/view/home/index.vue')
      },
      {
        name: 'manageContent',
        path: '/manage/content',
        meta: {
          title: '内容管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/content/index.vue')
      },
      {
        name: 'manageAnnouncement',
        path: '/manage/announcement',
        meta: {
          title: '公告管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/announcement/index.vue')
      },
      {
        name: 'manageContentaudit',
        path: '/manage/contentaudit',
        meta: {
          title: '内容审核管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/contentaudit/index.vue')
      },
      {
        name: 'manageStudio',
        path: '/manage/studio',
        meta: {
          title: '融合号管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/studio/index.vue')
      },
      {
        name: 'manageStudioSingle',
        path: '/manage/studio/:id',
        meta: {
          title: '融合号管理编辑-全国党媒融合号'
        },
        component: () => import('@/view/manage/studio/single/index.vue')
      },
      {
        name: 'SourceMaterial',
        path: '/manage/material',
        meta: {
          title: '素材管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/material/index.vue')
      },
      {
        name: 'SourceMaterialEnter',
        path: '/manage/material/enter',
        meta: {
          title: '素材管理保存-全国党媒融合号'
        },
        component: () => import('@/view/manage/material/enter/index.vue')
      },
      {
        name: 'manageAd',
        path: '/manage/ad',
        meta: {
          title: '广告管理-全国党媒融合号'
        },
        component: () => import('@/view/manage/ad/index.vue')
      },
      {
        name: 'settingsAccount',
        path: 'settings/account',
        meta: {
          title: '账号信息-全国党媒融合号'
        },
        component: () => import('@/view/settings/account/index.vue')
      },
      {
        name: 'notice',
        path: '/notice',
        meta: {
          title: '公告-全国党媒融合号',
        },
        component: () => import('@/view/notice/index.vue'),
      },
      {
        name: 'article',
        path: '/article',
        meta: {
          title: '文章-全国党媒融合号',
        },
        component: () => import('@/view/article/index.vue'),
      }
    ]
  },
  {
    name: 'share',
    path: '/share',
    meta: {
      title: '分享-全国党媒融合号',
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
