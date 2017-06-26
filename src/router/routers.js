export default [
  {
    path: '/login',
    meta: {
      title: 'login'
    },
    component: require('@/view/login/index.vue'),
  },
  {
    path: '/',
    meta: {
      title: '首页'
    },
    component: require('@/view/index.vue'),
    children: [
      {
        path: '/release/article',
        meta: {
          title: '内容发布'
        },
        component: require('@/view/release/article/index.vue'),
      },
      {
        path: '/release/image',
        meta: {
          title: '图片发布'
        },
        component: require('@/view/release/image/index.vue'),
      },
      {
        path: '/release/video',
        meta: {
          title: '视频发布'
        },
        component: require('@/view/release/video/index.vue'),
      },
      {
        path: '/cms/me',
        meta: {
          title: '我发表的'
        },
        component: require('@/view/cms/me/index.vue'),
      },
      {
        path: '/cms/auto',
        meta: {
          title: '自动同步'
        },
        component: require('@/view/cms/auto/index.vue'),
      },
      {
        path: '/cms/original',
        meta: {
          title: '原创内容'
        },
        component: require('@/view/cms/original/index.vue'),
      },
      {
        path: '/content/import',
        meta: {
          title: '内容接入'
        },
        component: require('@/view/content/import/index.vue'),
      },
      {
        path: '/content/export',
        meta: {
          title: '内容输出'
        },
        component: require('@/view/content/export/index.vue'),
      },
      {
        path: '/source/image',
        meta: {
          title: '图片管理'
        },
        component: require('@/view/source/image/index.vue'),
      },
      {
        path: '/source/video',
        meta: {
          title: '视频管理'
        },
        component: require('@/view/source/video/index.vue'),
      },
    ]

  },
]
