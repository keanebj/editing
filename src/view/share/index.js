import {
  mapState
} from 'vuex'

export default {
  name: 'share',
  data() {
    return {
      shareId: -1,
      title: '',
      content: '',
      conInfo: {
      	channel: '',
      	time: '',
      	author: ''
      },
      noData:true,
      notShared: false
    }
  },
  created() {
    this.shareId = this.$route.query.id;
    //ajax获得分享的内容
    this.$http.get("/api/content/share/" + this.shareId)
      .then((response) => {
        if(response.data.status == 1){
            this.noData=true;
            this.title = response.data.content.title;
            this.conInfo.channel = response.data.content.channel;
            this.content = response.data.content.content;
            this.conInfo.time = response.data.content.addtime;
	          this.conInfo.author = response.data.content.author;
        }else{
          this.noData=false;
           this.$Notice.warning({
                title: response.data.message,
                desc: false
            })
        }
      }, (error) => {
        this.noData=false;
        this.$Notice.warning({
            title: error.data.message,
            desc: false
        })
    });
  },
  methods: {
    goBack() {
      this.$router.push('/manage/content')
    }
  },
  mounted() {
       //找到编辑器里面的视频内容 ，进行 替换
       let $=qbVideo.get("$");
       setTimeout(function(){
          let count=$(".video_container").size();
          if(count > 0){
            for(var i=0;i<count;i++){
                let serverfileid=$(".video_container").eq(i).html('').attr('serverfileid');
                var option = {
                    "auto_play": "0",
                    "file_id": serverfileid,
                    "app_id": "1252018592",
                    "width": 640,
                    "height": 480
                };
               new qcVideo.Player("id_video_container_"+option.file_id,option); 
            }
               
          }                 
        },500)
  }
}
