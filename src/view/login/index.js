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
var partnerLink1 = [{
  imgsrc:require('../../assets/login/57287.png'),
  name:'中华全国归国华侨联合会',
  url:'http://www.chinaql.org/'
},{
  imgsrc:require('../../assets/login/57289.png'),
  name:'中国银行业协会',
  url:'http://www.china-cba.net/'
},{
  imgsrc:require('../../assets/login/57292.png'),
  name:'国务院国资委新闻中心',
  url:'http://www.sasac.gov.cn/n85463/n327265/n327829/index.html'
},{
  imgsrc:require('../../assets/login/57293.png'),                     
  name:'中国信息安全测评中心',
  url:'http://www.itsec.gov.cn/'
},{
  imgsrc:require('../../assets/login/57296.png'),
  name:'内蒙古自治区党委宣传部',
  url:'javascript:;'
},{
  imgsrc:require('../../assets/login/57299.png'),
  name:'江苏省委宣传部',
  url:'http://www.zgjssw.gov.cn/'
},{
  imgsrc:require('../../assets/login/57301.png'),
  name:'深圳市委市政府',
  url:'http://www.sz.gov.cn/cn/'
},{
  imgsrc:require('../../assets/login/57304.png'),
  name:'贵阳市委市政府',
  url:'http://www.gygov.gov.cn/'
},{
  imgsrc:require('../../assets/login/57307.png'),
  name:'北京市海淀区委宣传部',
  url:'http://hdqw.bjhd.gov.cn/'
}]

var partnerLink2 = [{
  imgsrc:require('../../assets/login/57297.png'),
  name:'光明日报社',
  url:'http://epaper.gmw.cn/gmrb/html/2017-04/12/nbs.D110000gmrb_01.htm'
},{
  imgsrc:require('../../assets/login/57298.png'),
  name:'内蒙古日报社',
  url:'http://szb.northnews.cn/nepaper/nmgrb/html/2017-04/12/node_2.htm'
},{
  imgsrc:require('../../assets/login/57300.png'),
  name:'上海报业集团',
  url:'http://www.sumg.com.cn/'
},{
  imgsrc:require('../../assets/login/57302.png'),                     
  name:'安徽日报社',
  url:'http://epaper.anhuinews.com/html/'
},{
  imgsrc:require('../../assets/login/57303.png'),
  name:'河南日报报业集团',
  url:'http://www.henandaily.cn/'
},{
  imgsrc:require('../../assets/login/57305.png'),
  name:'湖南日报社',
  url:'http://hnrb.voc.com.cn/'
},{
  imgsrc:require('../../assets/login/57306.png'),
  name:'四川日报报业集团',
  url:'http://www.cbgw.cn/'
},{
  imgsrc:require('../../assets/login/57308.png'),
  name:'广州日报报业集团',
  url:'http://gzdaily.dayoo.com'
},{
  imgsrc:require('../../assets/login/57309.png'),
  name:'深圳报业集团',
  url:'http://www.sznews.com/zhuanti/node_156756.htm'
}]


var partnerLink3 = [{
  imgsrc:require('../../assets/login/57286.png'),
  name:'招商局集团',
  url:'http://www.cmhk.com/main/'
},{
  imgsrc:require('../../assets/login/57288.png'),
  name:'中国光大集团',
  url:'http://www.ebchina.com/ebchina/index.shtml'
},{
  imgsrc:require('../../assets/login/57290.png'),
  name:'腾讯公司',
  url:'https://www.tencent.com/zh-cn/index.html'
},{
  imgsrc:require('../../assets/login/57291.png'),                     
  name:'华为公司',
  url:'http://www.huawei.com/cn/'
},{
  imgsrc:require('../../assets/login/57295.png'),
  name:'恒大集团',
  url:'http://www.evergrande.com/'
},{
  imgsrc:require('../../assets/login/57294.png'),
  name:'中国大恒（集团）有限公司',
  url:'http://www.chinadaheng.com.cn/'
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
      partnerLink1:partnerLink1,
      partnerLink2:partnerLink2,
      partnerLink3:partnerLink3,
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
