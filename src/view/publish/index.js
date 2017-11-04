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
    ...mapState(['menu'])
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
    insertVideoEditor(val,id,name,url){
      //如果是图文
      if(this.tabname == 'text'){
          this.$refs.publishtextele.insertVideoEditor(val);
      }else{
          //如果是视频
          this.$refs.publishvideoele.insertVideoEditor(val,id,name,url);
      }
    },
    goBack(){
      this.$router.go(-1);
    }
  }
}
