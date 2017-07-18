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
    ...mapState(['menu', 'userinfo'])
  },
  data() {
    return {
      isActive: false
    }
  },
  beforeCreate() {
    if (sessionStorage.getItem('token') == undefined || sessionStorage.getItem('token') == null) {
      this.$router.push('/login')
    }
    //监听浏览器的返回按钮
    window.addEventListener("popstate", function (e) {
      location.reload();
    }, false);
  },
  mounted() {
    if (window.location.href.indexOf('publish') > -1) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
  },
  created() {
    if (this.userinfo == undefined) {
      this.$router.push('/login')
    } else {
      this.userName = this.userinfo.username
      this.roleType = this.userinfo.roleType
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
    logOut(e) {
      this.$http.get('http://mp.dev.hubpd.com/api/studio/logout')
        .then(res => {
          console.log('退出结果：' + JSON.stringify(res.data))
          sessionStorage.removeItem("token")
          this.$Message.info(res.data.message)
          this.$router.push('/login')
        }, err => {
          console.log('出错啦！' + err)
          this.$Message.error(JSON.stringify(err))
        })
    }
  }
}
