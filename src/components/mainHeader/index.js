import {
  mapState
} from 'vuex'
export default {
  name: 'ComponentsMainHeader',
  computed: {
    ...mapState(['userinfo'])
  },
  methods: {
    logOut(e){
      this.$http.get('/api/studio/logout').then(res => {
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
    },
    goHome() {
      this.$router.push('/')
    },
    goAccount() {
      this.$router.push('/settings/account')
    }
  }
}
