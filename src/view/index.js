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
    ...mapState(['menu'])
  },
  data() {
    return {

		isActive:false
    }
  },
   beforeCreate () {
    //监听浏览器的返回按钮
    window.addEventListener("popstate", function(e) {
      location.reload();
    }, false);
   },
   mounted(){
	  if(window.location.href.indexOf('publish') > -1){
		this.isActive=true;
	  }else{
		this.isActive=false;
	  }
  },
  created() {},
  methods: {
    onSelect(e) {
      if (e.path) {
        this.$router.push({
          path: e.path
        })
      }
	  //判断路径
     /* if(e.path.indexOf('publish') > -1){
          this.isActive=true;
      }else{
        this.isActive=false;
      }*/
    },
    logOut(e) {
      this.$http({
          method: 'get',
          url: 'http://mp.dev.hubpd.com/api/studio/logout'
        })
        .then(res => {
          console.log('退出结果：' + JSON.stringify(res.data))
          if (res.data.status == 0) {
            if (sessionStorage.getItem("token") == null || sessionStorage.getItem("token") == undefined) {
              this.$router.push('/login')
            } else {
              this.$Message.error(res.data.message)
            }

          } else {
            sessionStorage.removeItem("token")
            this.$router.push('/login')
          }

        }, err => {
          console.log('出错啦！' + err)
        })
    }
  }
}
