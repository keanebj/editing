import Publishtext from '@/view/publishtext/index.vue'
import Publishvideo from '@/view/publishvideo/index.vue'
import MainHeader from '@/components/mainHeader/index.vue'
import MainFooter from '@/components/mainFooter/index.vue'
import uploadVideo from '@/components/uploadVideo/index.vue'
import {
  mapState
} from 'vuex'
export default {
  name: 'ViewPublish',
  components: {
    MainHeader,
    MainFooter,
    Publishtext,
    Publishvideo,
    uploadVideo
  },
  data () {
    return { 
      tabname:'text',
      disabledText:false,
      disabledVideo:false
    }
  },
  computed: {
    ...mapState(['menu', 'userinfo'])
  },
  methods: {
    showUploadPop(){
      this.$refs.uploadVideoEle.showModal();
    },
    disabledTab(name){
      if(name =='text'){
          //禁用text
          this.tabname='video';
          this.disabledText=true;
      }else{
          //禁用video
          this.tabname='text';
           this.disabledVideo=true;
      }
    },
    insertVideoEditor(val,id){
      //如果是图文
      if(this.tabname == 'text'){
          this.$refs.publishtextele.insertVideoEditor(val);
      }else{
          //如果是视频
          this.$refs.publishvideoele.insertVideoEditor(val,id);
      } 
    },
    goBack(){
      this.$router.go(-1);
    },
    logOut(e){
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
    },
    goHome() {
      this.$router.push('/')
    },
    goAccount() {
      this.$router.push('/settings/account')
    }
  }
  }

