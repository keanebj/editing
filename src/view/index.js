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
    }
  },
  beforeCreate() {

    //监听浏览器的返回按钮
    window.addEventListener("popstate", function (e) {
      location.reload();
    }, false);
  },
  mounted() {
    if (window.location.href.indexOf('publish') > -1) {
      this.$store.commit('set', { isActive: true })
    } else {
      this.$store.commit('set', { isActive: false })
    }
  },
  created() {
    if (!this.token) {
      this.$router.push('/login')
    }
    if (this.userinfo.username == undefined || this.userinfo.username == null) {
      this.$router.push('/login')
    }
  },
  methods: {
    onSelect(e) {
      if (e.path) {
        this.$router.push({
          path: e.path
        })
      }
    },
    goHome() {
      this.$router.push('/home')
    },
    goAccount() {
      this.$router.push('/settings/account')
    },
    logOut(e) {
      this.$http.get('http://mp.dev.hubpd.com/api/studio/logout')
        .then(res => {
          console.log('退出结果：' + JSON.stringify(res.data))
          sessionStorage.removeItem("token")
          this.$store.commit('set', {
            token: ''
          })
          this.$Message.success(res.data.message)
          this.$router.push('/login')
        }, err => {
          console.log('出错啦！' + err)
          this.$Message.error(JSON.stringify(err))
        })
    }
  }
}