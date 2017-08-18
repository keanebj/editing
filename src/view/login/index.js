import Vue from 'vue'
import Cookies from 'js-cookie'
import {throttle} from 'lodash' // 函数节流
import MainFooter from '@/components/mainFooter/index.vue'
var username = localStorage.getItem('remember:username') || ''
var password = localStorage.getItem('remember:password') || ''
var remember = localStorage.getItem('remember') ? true : false
var friendLinks = [{
  name: '中国青年网',
  url: 'http://news.youth.cn/'
}, {
  name: '人民政协网',
  url: 'http://www.rmzxb.com.cn/index.shtml'
}, {
  name: '中国搜索',
  url: 'http://www.chinaso.com/'
}, {
  name: '搜狐网',
  url: 'http://www.sohu.com/'
}, {
  name: '中华网',
  url: 'http://www.china.com/'
}, {
  name: '和讯网',
  url: 'http://www.hexun.com/'
}, {
  name: '山西日报网',
  url: 'http://m.sxrbw.com/'
}, {
  name: '东北网',
  url: 'http://www.dbw.cn/'
}, {
  name: '新民网',
  url: 'http://www.xinmin.cn/'
}, {
  name: '观察者网',
  url: 'http://www.guancha.cn/'
}, {
  name: '览潮网',
  url: 'http://www.fjii.com/'
}, {
  name: '红网',
  url: 'http://www.rednet.cn/'
}, {
  name: '川报观察',
  url: 'http://cbgc.scol.com.cn/'
}, {
  name: '成都全搜索',
  url: 'http://chengdu.cn/'
}, {
  name: '封面新闻',
  url: 'http://www.thecover.cn/'
}, {
  name: '新疆新闻在线',
  url: 'http://www.xjbs.com.cn/'
}, {
  name: '亚心网',
  url: 'http://www.iyaxin.com/'
}, {
  name: '长春新闻网',
  url: 'http://www.ccnews.gov.cn/'
}, {
  name: '吉林在线',
  url: 'http://www.onlinejl.com/'
}, {
  name: '河南网',
  url: 'http://www.henanwang.com.cn/'
}]
export default {
  components: {
    MainFooter
  },
  data() {
    return {
      isLoading: false,
      maskStyle: { opacity: 0 },
      friendLinks: friendLinks,
      formItem: {
        username: username,
        password: password,
        remember: remember
      },
      formRules: {
        username: [{
          required: true,
          message: '请填写用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请填写密码',
          trigger: 'blur'
        }, {
          type: 'string',
          min: 4,
          message: '密码长度不能小于4位',
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.submitLogin();
        }
      })
    },
    // 登录请求发送
    submitLogin() {
      this.isLoading = true
      this.$http.post('/api/studio/login', this.formItem).then(res => {
        if (res.data.status == 1) {
          var userinfo = {
            id: res.data.id,
            roleType: res.data.operatortype,
            username: res.data.operator,
            password: this.formItem.password,
            studioLogo: res.data.operatortype == "Manage" ? '' : res.data.logo,
            studioName: res.data.studioname
          }
          this.$store.commit('set', { userinfo })
          this.$store.commit('set', {
            token: res.data.token
          })
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userinfo', JSON.stringify(userinfo))
          this.$Message.success('登录成功!')
          Cookies.remove('clickedNo');//删除对应的cookie
          Cookies.remove('clickedCo');//删除对应的cookie

          // 记住密码
          if (this.formItem.remember) {
            localStorage.setItem('remember:username', this.formItem.username)
            localStorage.setItem('remember:password', this.formItem.password)
            localStorage.setItem('remember', 1)
          } else {
            localStorage.removeItem('remember:username')
            localStorage.removeItem('remember:password')
            localStorage.removeItem('remember')
          }
          
          this.$router.push('/')
        } else {
          this.$Message.error('您填写的账号或密码不正确，请再次尝试');
        }
        this.isLoading = false
      }, err => {
        this.isLoading = false
        this.$Message.error('您填写的账号或密码不正确，请再次尝试');
      })
    }
  },
  mounted() {
    window.onscroll = throttle(() => {
      var top = document.body.scrollTop
      var height = window.innerHeight
      var opacity = (top > height ? 0.5 : top / (height * 2))
      this.maskStyle = {
        opacity: opacity
      }
    }, 100)
  }
}
