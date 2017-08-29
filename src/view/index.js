import {
  mapState
} from 'vuex'
import MainHeader from '@/components/mainHeader/index.vue'
import MainFooter from '@/components/mainFooter/index.vue'
import ComponentsMainMenu from '@/components/mainMenu/index.vue'
import ComponentsBreadcrumb from '@/components/breadcrumb/index.vue'
export default {
  components: {
    MainHeader,
    MainFooter,
    ComponentsMainMenu,
    ComponentsBreadcrumb
  },
  computed: {
    ...mapState(['menu', 'userinfo', 'isActive', 'token'])
  },
  data() {
    return {
      minHeight: window.screen.height - 310,
      isToken : true
    }
  },
  beforeCreate() {   
    
    //监听浏览器的返回按钮
    window.addEventListener("popstate", function (e) {
      location.reload();
    }, false);
  },
  mounted() {
   
    /*if (window.location.href.indexOf('publish') > -1) {
      this.$store.commit('set', {
        isActive: true
      })
    } else {
      this.$store.commit('set', {
        isActive: false
      })
    }*/
  },
  created() {
    if(localStorage.getItem('token') == null){
      this.$router.push('/login')
    }
    else{
      this.isToken= false
    }
    this.getLocalUserInfo()
  },
  methods: {
    getLocalUserInfo() {
      console.log('userinfo = ' + localStorage.getItem('userinfo'))
      if (localStorage.getItem('userinfo')) {
        let _userinfo = {}
        _userinfo = JSON.parse(localStorage.getItem('userinfo'))
        this.$store.commit('set', {
          _userinfo
        })
      }
    },
    onSelect(e) {
      if (e.path) {
        this.$router.push({
          path: e.path
        })
      }
    },
    goHome() {
      this.$router.push('/')
    },
    goAccount() {
      this.$router.push('/settings/account')
    },
    logOut(e) {
      this.$http.get('/api/studio/logout')
        .then(res => {
          if (res.data.status == 1) {
            localStorage.removeItem("token")
            this.$store.commit('set', {
              token: ''
            })
            this.$Message.success('退出成功')
          } else {
            this.$Message.error(res.data.message)
          }
          this.$router.push('/login')
        }, err => {
          this.$Message.error(JSON.stringify(err))
        })
    }
  }
}
