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
  children:[
{
  path: '/home',
  meta: {
    title: '首页'
  },
  component: require('@/view/home/index.vue'),
},
{
  path: '/publish',
  meta: {
    title: '发表'
  },
  component: require('@/view/publish/index.vue'),
},
{
  path: '/manage/content',
  meta: {
    title: '内容管理'
  },
  component: require('@/view/manage/content/index.vue'),
},
{
  path: '/manage/studio',
  meta: {
    title: '工作室管理'
  },
  component: require('@/view/manage/studio/index.vue'),
},
{
  path: '/manage/ad',
  meta: {
    title: '广告管理'
  },
  component: require('@/view/manage/ad/index.vue'),
},
{
  path: '/settings/account',
  meta: {
    title: '账号信息'
  },
  component: require('@/view/settings/account/index.vue'),
},
]

},
]
