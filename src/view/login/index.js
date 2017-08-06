import Vue from 'vue'
import Cookies from 'js-cookie'
import MainFooter from '@/components/mainFooter/index.vue'
var friendLinks = [{
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, {
  name: '中国青年网',
  url: 'http://www.baidu.com'
}, ]
export default {
  components: {
    MainFooter
  },
  data() {
    return {
      isLoading: false,
      maskStyle: {opacity: 0},
      friendLinks: friendLinks,
      formItem: {
        username: '',
        password: ''
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
              studioLogo: res.data.operatortype == "Manage" ? '' : res.data.logo
            }

            this.$store.commit('set', { userinfo })
            this.$store.commit('set', {
              token: res.data.token
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userinfo', JSON.stringify(userinfo))
            this.$Message.success('登录成功!');
            Cookies.remove('clickedNo');//删除对应的cookie
            Cookies.remove('clickedCo');//删除对应的cookie
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
    window.onscroll = () => {
      var top = document.body.scrollTop
      var height = window.innerHeight
      var opacity = (top > height ? 0.5 : top / (height * 2))
      this.maskStyle = {
        opacity: opacity
      }
    }
  }
}
